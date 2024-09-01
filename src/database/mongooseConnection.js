const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.configDotenv();
const { MONGODB_USERNAME, MONGODB_PASSWORD } = process.env;
let username = encodeURIComponent(MONGODB_USERNAME);
let password = encodeURIComponent(MONGODB_PASSWORD);

const uri = `mongodb+srv://${username}:${password}@mongocluster.zbt6ser.mongodb.net/EcomDb?retryWrites=true&w=majority&appName=MongoCluster`;

const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};

const mongoConnect = async () => {
  try {
    const obj = await mongoose.connect(uri, clientOptions);
    if (obj) {
      console.log("mongodb connected");
    }
  } catch (error) {
    console.log("failed to connect");
  }
};
module.exports = mongoConnect;