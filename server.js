const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const colors = require("colors");
const morgan = require("morgan");
const {connectDB} = require("./config/db");


dotenv.config();
connectDB();
// Express
const app = express();
// MiddleWare

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use('/api/v1/auth', require("./routes/userRoutes"))
app.use("/api/v1/post",require("./routes/postRoutes") );

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});


app.get("/", (req, res) => {
  res.status(200).json({
    Success: true,
    message: " Node Server is working Fine",
  });
});

const Port = process.env.PORT || 7777;

app.listen(Port, (req, res) => {
  console.log(`server is working on port ${Port} Successfully`.bgBlue.white);
});
