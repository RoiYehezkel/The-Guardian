//should remain within a folder called db, and add the
//mongo_uri link to our .env file

const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

// uri can be the cdn from mongo atlas if not dev
const mongoUri = `${process.env.MONGO_URI_DEV}/instsUsers`;

// connect function
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  // useCreateIndex: true,
  // useUnifidedTopology: true
});

mongoose.connection.on("connected", () => {
  console.log("connected to mongo instance");
});

mongoose.connection.on("error", (error) => {
  console.log("Error connecting to mongo", error);
});
