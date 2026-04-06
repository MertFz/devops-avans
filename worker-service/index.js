const amqp = require('amqplib');
const mongoose = require('mongoose');

const mongoUrl = process.env.MONGO_URL || 'mongodb://worker_admin:secure_password@localhost:27017/worker_db?authSource=admin';
const rabbitUrl = process.env.RABBITMQ_URL || 'amqp://localhost';

const orderSchema = new mongoose.Schema({
  product: String,
  amount: Number,
  timestamp: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

async function start() {
  try {
    // 1. Connect to MongoDB
    await mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Worker connected to MongoDB');

    // 2. Connect to RabbitMQ
    const connection = await amqp.connect(rabbitUrl);
    const channel = await connection.createChannel();
    const queue = 'orders';

    await channel.assertQueue(queue, { durable: true });
    console.log(`Worker listening on queue: ${queue}`);

    // 3. Consume messages
    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        const content = JSON.parse(msg.content.toString());
        console.log('Received order:', content);

        try {
          const newOrder = new Order(content);
          await newOrder.save();
          console.log('Order saved to worker database');
          channel.ack(msg);
        } catch (err) {
          console.error('Error saving order:', err);
          // Don't ack so it stays in queue or moved to DLQ (keeping it simple here)
        }
      }
    });

  } catch (error) {
    console.error('Worker failed to start:', error);
    setTimeout(start, 5000); // Retry after 5s
  }
}

start();
