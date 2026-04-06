var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

const promBundle = require('express-prom-bundle');
const metricsMiddleware = promBundle({
  includeMethod: true,
  includePath: true,
  promClient: {
    collectDefaultMetrics: {}
  }
});
app.use(metricsMiddleware);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// RabbitMQ Setup
const amqp = require('amqplib');
const rabbitUrl = process.env.RABBITMQ_URL || 'amqp://localhost';
let channel;

async function connectRabbit() {
  try {
    const connection = await amqp.connect(rabbitUrl);
    channel = await connection.createChannel();
    await channel.assertQueue('orders', { durable: true });
    console.log('API connected to RabbitMQ (queue: orders)');
  } catch (err) {
    console.error('API failed to connect to RabbitMQ:', err);
    setTimeout(connectRabbit, 5000);
  }
}
connectRabbit();

app.use('/', indexRouter);
app.use('/users', usersRouter);

// New Order POST route
app.post('/order', async (req, res) => {
  const order = req.body;
  if (!order.product || !order.amount) {
    return res.status(400).json({ error: 'Product and amount are required' });
  }

  if (channel) {
    channel.sendToQueue('orders', Buffer.from(JSON.stringify(order)), { persistent: true });
    res.status(202).json({ message: 'Order sent for processing', order });
  } else {
    res.status(503).json({ error: 'Messaging service unavailable' });
  }
});

// Simple GET route for functionality check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'avans-api' });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
