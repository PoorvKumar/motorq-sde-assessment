const mongoose=require('mongoose');

const connectDB=async ()=>
{
    try
    {
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