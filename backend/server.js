require("@tensorflow/tfjs");
const fs = require("fs");
const express = require("express");
const https = require("https");
const http = require("http");
const cors = require("cors");
const controllers = require("./src/controllers/user-controllers");

// vars for https
const privateKey = fs.readFileSync(__dirname + "/certs/selfsigned.key", "utf8");
const certificate = fs.readFileSync(
  __dirname + "/certs/selfsigned.crt",
  "utf8"
);
const credentials = { key: privateKey, cert: certificate };

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(cors());

app.set("view engine", "ejs");

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

// get request for instagram request
app.get("/posts/", async (req, res, next) => {
  try {
    const code = req.query.code;
    let userId;
    if (code) {
      userId = await controllers.setUpData(code);
      res.render("user-found", { userId: userId });
    } else {
      res.status(200).send("user not found");
    }
  } catch (err) {
    next(err);
  }
});

// post request for client
app.post("/analyze", async (req, res, next) => {
  try {
    const user_id = req.body.userId;
    const analyzedData = await controllers.getAnalyzedDataFromDb(user_id);
    res.status(200).send(analyzedData);
  } catch (err) {
    next(err);
  }
});

app.get("/", (req, res, next) => {
  res.status(200).send("welcome to our server");
});

app.use((req, res, next) => {
  const error = new Error("Could not find this route.");
  error.status(404);
  next(error);
});

app.use((error, req, res, next) => {
  res
    .status(error.status || 500)
    .json({ message: error.message || "An unknown error occurred!" });
});

httpServer.listen(8000);
httpsServer.listen(8443);
