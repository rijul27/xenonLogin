import express from "express";
import connectDB from "./config/db.js";
const app = express(); // creting the server
import {  loginController, registerController} from "./controllers/authController.js";     // Controllers 
import dotenv from "dotenv";
const PORT = 8000; // defining PORT
app.use(express.static("public")); // Serving the static files
app.use(express.json());           //Middlewares 
dotenv.config()
connectDB();
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/api/v1/auth/login", loginController);                //API Endpoints 
app.post("/api/v1/auth/register", registerController);


app.listen(PORT, () => {
  // Listening to the PORT
  console.log("Server is Listening on the Port ", PORT);
});