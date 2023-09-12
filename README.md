# Document Sharing Platform API

This is the documentation for the Document Sharing Platform API. This API allows users to sign up, upload documents, share them with other users, and manage their documents. It is built using Node.js, Express, and MongoDB Atlas for data storage. Basic authentication is implemented using the `express-basic-auth` middleware, and Postman is used for testing the API.

## Tech Stack Used
Nodejs, Expressjs, MongoDB Atlas, Postman

## Deployment Link (on Render)
https://motorq-sde-assessment.onrender.com

## Video Link
https://youtu.be/AaU2dsYIVKw

## Testing the API
- Encode your "mobileNumber:password" using an online base64 encoder
- In Postman pass Authorization header value as "Basic <encoded-value>" for testing all authenticated routes

## Setup

Follow these steps to set up and run the API:

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/PoorvKumar/motorq-sde-assessment.git

2. Navigate to project directory
  `cd motorq-sde-assessment`

3. Install the dependencies
    `npm install`

4. Setup .env
  Variable Name | Example Value
--------------- |----------------
PORT            |  5000
MONGODB_URI     |  "mongodb+srv://poorvkumar14:Ironman3000@motorq-sde.llahct9.mongodb.net/"

Also, designed the approach for Shareable Links:

- Creating a model for ShareableLink with attributes:
  - `documentId` (the document whose link)
  - `owner` (document and link owner)
  - `linkToken` (a unique token to identify which among multiple links for the same document)
  - `accessedUsers` (an array of users who have accessed the document using this link according to timestamp; whenever the signed-in authorized user opens the link, they get added to the array)

a.) POST request to `/document/:documentId/shareable` to create a shareable link that will return the `linkToken` as a JSON response, and this `linkToken` is valid for 24 hours.

b.) DELETE request to `/document/:documentId/shareable/linkToken` to delete this link.

c.) GET request to `/document/:documentId/shareable/linkToken/access-history` to see who all accessed this link.

d.) GET request to `/document/shareable/linkToken` to access the link through the token and view the document associated with the ShareableLink associated with the `linkToken`.


