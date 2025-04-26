const express = require("express");
const path = require("path");
const { connectToMongoDB } = require("./connection/connect");
const { restrictToLoggedInUsersOnly } = require('./middleware/auth')
const URL = require("./model/url");
const cookieParser = require('cookie-parser')

const urlRoute = require("./router/url");
const staticRoute = require("./router/staticRouter");
const userRoute = require("./router/user");

const app = express();
const PORT = 3001;

//MoongoDB connection
connectToMongoDB("mongodb://127.0.0.1:27017/ulshortner").then(() =>
  console.log("connected to MongoDB")
);

//EJS
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/user", userRoute);
app.use("/url",restrictToLoggedInUsersOnly, urlRoute);
app.use("/", staticRoute);

app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    },{new:true}
  );
  if (!entry) {
    return res.status(404).send("URL not found");
  }
  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => {
  console.log(`server running at:http://localhost:${PORT}`);
});
