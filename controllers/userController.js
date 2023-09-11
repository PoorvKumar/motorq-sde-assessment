const User=require("../models/User");
const bcrypt=require("bcryptjs");

exports.signUp=async (req,res)=>
{
    try
    {
        const { mobileNumber, password }=req.body;

        if(!/^\d{10}$/.test(mobileNumber))
        {
            return res.status(400).json({error: 'Invalid mobile number format'});
        }

        if(!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password))
        {
            return res.status(400).json({error: 'Invalid password format'});
        }

        const existingUser=await User.findOne({mobileNumber});
        if(existingUser)
        {
            return res.status(409).json({error: 'Mobile number already registered'});
        }

        const hashedPassword=await bcrypt.hash(password,10);

        const newUser = new User({ mobileNumber, password: hashedPassword });
        await newUser.save();

        // const token = jwt.sign({ _id: newUser._id }, process.env.SECRET_KEY);

        res.status(201).json({ message: 'User registered successfully' });
    }
    catch(error)
    {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.getAllUsers=async (req,res)=>
{
    try
    {
        const users=await User.find({},'mobileNumber');

        //extract mobile numbers from user objects having id also
        const mobileNumbers=users.map((user)=> ({mobileNumber: user.mobileNumber}));

        res.status(200).json(mobileNumbers);
    }
    catch(error)
    {
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
}