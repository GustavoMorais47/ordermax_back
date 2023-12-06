import mongoose from "mongoose";

const database = mongoose.createConnection(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1bmzdp5.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
);

export default database;
