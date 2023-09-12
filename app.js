const express=require("express");
const app=express();

const dotenv=require("dotenv");
dotenv.config();

app.use(express.json());

const colors=require("colors");

//Connecting to DB
const connectDB=require("./config/db");
connectDB();

//routes
const userRoutes=require("./routes/userRoutes");
const documentRoutes=require("./routes/documentRoutes");
const shareableLinkRoutes=require("./routes/shareableLinkRoutes");

app.use(userRoutes);
app.use(documentRoutes);
app.use(shareableLinkRoutes);

const PORT=process.env.PORT || 5000;
app.listen(PORT,console.log(`Server listening on PORT: ${PORT}`.blue.bold));