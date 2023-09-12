const express=require("express");
const router=express.Router();

//controllers
const shareableLinkController=require("../controllers/shareableLinkController");

//middleware
const authMiddleware=require("../middleware/authMiddleware");

router.post('/document/:documentId/shareable',authMiddleware,shareableLinkController.createLink);
router.delete('/document/:documentId/shareable/:linkToken',authMiddleware,shareableLinkController.deleteLink);
router.post('/document/shareable/:linkToken',authMiddleware,shareableLinkController.viewUsingLink);
router.get('/document/:documentId/shareable/:linkToken/access-history',authMiddleware,shareableLinkController.viewAccessHistory);

module.exports=router;