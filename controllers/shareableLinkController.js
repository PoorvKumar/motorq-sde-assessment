const ShareableLink=require("../models/ShareableLink");
const Document=require("../models/Document");

exports.createLink=async (req,res)=>
{
    try 
    {
        const documentId = req.params.documentId;
        const owner = req.auth.user; // Assuming the authenticated user's mobile number is stored in req.auth.user

        // console.log(documentId);
    
        // Generate a unique linkToken (you can use a library to create a random token)
        // const linkToken = generateUniqueToken();
        const linkToken = documentId+'@';
    
        // Create a new shareable link record in the database
        const shareableLink = new ShareableLink({
          documentId,
          owner,
          linkToken,
          accessedUsers: [], // Initialize with an empty array of accessed users
        });
    
        await shareableLink.save();
    
        res.status(201).json({ linkToken });
      } 
      catch(error) 
      {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
}

exports.deleteLink=async (req,res)=>
{
    try {
      const documentId = req.params.documentId;
      const linkToken = req.params.linkToken;
      const owner = req.auth.user; // Assuming the authenticated user's mobile number is stored in req.auth.user

      // Find and delete the shareable link record associated with the specified linkToken
      const deletedLink = await ShareableLink.findOneAndDelete({
        documentId,
        linkToken,
        owner,
      });

      if (!deletedLink) {
        return res.status(404).json({ error: "Shareable link not found" });
      }

      res.status(200).json({message: "Link Deleted Seccessfully"});
    } 
    catch(error) 
    {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
}

exports.viewUsingLink=async (req,res)=>
{
    try
    {
        const linkToken=req.params.linkToken;

        // Find the shareable link record by linkToken
        const shareableLink = await ShareableLink.findOne({ linkToken });

        if (!shareableLink) 
        {
          return res.status(404).json({ error: "Shareable link not found" });
        }

        const document=await Document.findById(shareableLink.documentId);

        shareableLink.accessedUsers.push({
          mobileNumber: req.auth.user, // authenticated user's mobile number is available in req.auth.user by express-basic-auth
          accessTimestamp: new Date(),
        });
      
        await shareableLink.save();

        res.status(200).json(document);
    }
    catch(error)
    {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

exports.viewAccessHistory=async (req,res)=>
{
    try {
      const documentId = req.params.documentId;
      const linkToken = req.params.linkToken;
      const owner = req.auth.user; 

      const shareableLink = await ShareableLink.findOne({
        documentId,
        linkToken,
        owner,
      });

      if (!shareableLink) 
      {
        return res.status(404).json({ error: "Shareable link not found" });
      }

      // Retrieve the access history (accessedUsers) from the shareable link record
      const accessHistory = shareableLink.accessedUsers;

      res.status(200).json({ accessHistory });
    } 
    catch(error) 
    {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
}