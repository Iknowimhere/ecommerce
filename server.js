require("dotenv").config();
const http = require("http");
const app = require("./app");
const { default: mongoose } = require("mongoose");
let PORT = process.env.PORT;
let server = http.createServer(app);

mongoose
  .connect(process.env.MONGODB_LOCALURL)
  .then(() => {
    console.log("db connected");
  })
  .catch((err) => {
    console.log(err);
  });

server.listen(PORT, (err) => {
  if (err) console.log(err);
  console.log(`server is on ${PORT}`);
});

