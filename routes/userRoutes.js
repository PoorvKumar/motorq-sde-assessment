const express=require("express");
const router=express.Router();

//controllers
const userController=require("../controllers/userController");

//middleware
const authMiddleware=require("../middleware/authMiddleware");

router.post('/signup',userController.signUp);
router.get('/users', userController.getAllUsers);

module.exports=router;