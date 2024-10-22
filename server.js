const app = require("./app");
const { connectDB } = require("./DB.config/connectDB");
const router = require("./router");
require("dotenv").config();
const cors = require("cors");

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
  });
});
app.use(
  cors({
    origin: [process.env.CLIENT_side_port, process.env.ADMIN_side_port], // This should match the address of your frontend
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // Enable this if you need to handle cookies
  })
);
app.use("/api/v1", router);

app.use((error, req, res, text) => {
  const message = error.message ? error.message : "Server Error Occured";
  const status = error.status ? error.status : 500;
  res.status(status).json({ success: false, message });
});

const https = require("https");

function getServerIP() {
  https
    .get("https://ifconfig.me", (resp) => {
      let data = "";

      // A chunk of data has been received.
      resp.on("data", (chunk) => {
        data += chunk;
      });

      // The whole response has been received. Print out the result.
      resp.on("end", () => {
        console.log("Server Public IP:", data);
      });
    })
    .on("error", (err) => {
      console.error("Error fetching public IP:", err.message);
    });
}

getServerIP();

const port = process.env.PORT;
app.listen(port, async () => {
  console.log(`server Running at http://localhost:${port}`);
  await connectDB();
  console.log("DB connected");
});
