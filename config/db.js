const mongoose=require('mongoose');

const connectDB=async ()=>
{
    try
    {
        const connString=process.env.MONGO_URI || "mongodb+srv://poorvkumar14:Ironman3000@motorq-sde.llahct9.mongodb.net/";
        const conn=await mongoose.connect(process.env.MONGO_URI);

        console.log(`MongoDB Connected: ${conn.connection.host}`.red.bold.underline);
    }
    catch(err)
    {
        console.log(`Error: ${err.message}`.white.bold.underline);
        process.exit();
    }
}

module.exports=connectDB;