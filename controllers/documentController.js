const { log } = require("console");
const Document=require("../models/Document");

//***************** DOCUMENT MANAGEMENT CONTROLLERS ***************** 
exports.addDoc=async (req,res)=>
{
    try 
    {
        const { name, content } = req.body;
        const owner = req.auth.user; // authenticated user's mobile number is stored in req.auth.user by express-basic-auth
    
        // Validate the document name (maximum 50 characters, alphanumeric and space characters only)
        if (!/^[A-Za-z0-9\s]{1,50}$/.test(name)) 
        {
          return res.status(400).json({ error: 'Invalid document name format' });
        }

        // const sharedWith=[];
        // sharedWith.push(owner);
    
        // Create a new document
        const newDocument = new Document({ name, content, owner });
        // console.log(newDocument);
    
        // Save the document to the database
        await newDocument.save();
    
        res.status(201).json({ message: 'Document created successfully', documentId: newDocument._id });
      } 
      catch(error) 
      {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
}

exports.getUserDoc=async (req,res)=>
{
    try
    {
        const owner=req.auth.user;
        const userDocuments=await Document.find({owner},'name content');
        res.status(200).json(userDocuments);
    }
    catch(error)
    {
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
}

exports.deleteDoc = async (req, res) => 
{
  try 
  {
    const documentId = req.params.documentId;
    const owner = req.auth.user; // authenticated user's mobile number is stored in req.auth.user by express-basic-auth

    // Find the document by ID and owner
    const document = await Document.findOne({ _id: documentId, owner });

    if (!document) 
    {
        return res.status(404).json({error: "Document not found or owner not authorized for given document"});
    }

    // Delete the document
    await Document.deleteOne({ _id: documentId });
    res.status(200).json({ message: "Document deleted successfully" });
  } 
  catch (error) 
  {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//***************** DOCUMENT SHARING CONTROLLERS *****************
exports.getSharedUsers=async (req,res)=>
{
    try 
    {
      const documentId = req.params.documentId;
      const owner = req.auth.user; // authenticated user's mobile number is stored in req.auth.user by express-basic-auth

      // Find the document by ID and owner
      const document = await Document.findOne({ _id: documentId, owner });

      if (!document) 
      {
        return res
          .status(404)
          .json({ error: "Document not found or unauthorized" });
      }

      // Get the mobile numbers of users with access (excluding the owner)
      const sharedUsers = await Document.find({ _id: documentId }).distinct("sharedWith");
      const sharedUsersWithoutOwner = sharedUsers.filter((user) => user !== owner);

      res.status(200).json({ sharedUsers: sharedUsersWithoutOwner });
    } 
    catch(error) 
    {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
}

exports.grantAccess=async (req,res)=>
{
    try 
    {
      const documentId = req.params.documentId;
      const owner = req.auth.user; // authenticated user's mobile number is stored in req.auth.user by express-basic-auth
      const { sharedWith } = req.body;

      // Find the document by ID and owner
      const document = await Document.findOne({ _id: documentId, owner });

      if (!document) 
      {
        return res
          .status(404)
          .json({ error: "Document not found or you are unauthorized to access the document" });
      }

      // Validate and normalize the list of mobile numbers
      const validMobileNumbers = [];

      for (const mobileNumber of sharedWith) 
      {
        if (/^[0-9]{10}$/.test(mobileNumber)) 
        {
          validMobileNumbers.push(mobileNumber);
        } 
        else 
        {
          return res
            .status(400)
            .json({ error: `Invalid mobile number format: ${mobileNumber}` });
        }
      }

      // Update the sharedWith field with the validated mobile numbers
      document.sharedWith = validMobileNumbers;
      await document.save();

      res.status(200).json({ message: "Access granted to specified users" });
    } 
    catch(error) 
    {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
}

exports.getSharedDocs=async (req,res)=>
{
    try
    {
        const owner=req.auth.user; // authenticated user's mobile number is stored in req.auth.user by express-basic-auth

        //Find all docs shared with user except the one's owned by user
        const sharedDocuments=await Document.find({sharedWith: owner, owner: {$ne: owner}}, 'name _id owner');

        res.status(200).json(sharedDocuments);
    }
    catch(error)
    {
        console.error(error);
        res.status(500).json({error: "Internal server error"});
    }
}

//Document View End-Point
exports.viewDocument=async (req,res)=>
{
    try 
    {
      const documentId = req.params.documentId;
      const owner = req.auth.user; // Assuming the authenticated user's mobile number is stored in req.auth.user

      // Find the document by ID
      const document = await Document.findOne({ _id: documentId });

      if(!document) 
      {
        return res.status(404).json({ error: "Document not found" });
      }

      // Check if the authenticated user is the owner or has access to the document
      if (document.owner !== owner && !document.sharedWith.includes(owner)) 
      {
        return res.status(403).json({ error: "You do not have access to this document" });
      }

      // Return the document data (without any other keys or subkeys)
      const documentData = {
        name: document.name,
        content: document.content,
        owner: document.owner
      };

      res.status(200).json(documentData);
    } 
    catch(error) 
    {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
}
  