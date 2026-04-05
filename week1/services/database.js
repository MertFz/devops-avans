const { MongoClient } = require("mongodb");
const uri = process.env.MONGO_URL || "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);
const db = client.db(process.env.DB_NAME || "devops_avans_week1");

module.exports = {

    db: db,
    client: client

};