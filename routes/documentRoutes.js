const express=require("express");
const router=express.Router();

//controllers
const documentController=require("../controllers/documentController");

//middleware
const authMiddleware=require("../middleware/authMiddleware");

//Document Management
router.post('/document',authMiddleware,documentController.addDoc);
router.get('/document',authMiddleware,documentController.getUserDoc);
router.delete('/document/:documentId',authMiddleware,documentController.deleteDoc);

//Document Sharing Management
router.get('/document/:documentId/shared',authMiddleware,documentController.getSharedUsers);
router.post('/document/:documentId/shared',authMiddleware,documentController.grantAccess);
router.get('/documents/shared',authMiddleware,documentController.getSharedDocs);

//Document End-Point
router.get('/document/:documentId',authMiddleware,documentController.viewDocument);

module.exports=router;
