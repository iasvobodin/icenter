// const multipart = require("parse-multipart");
// module.exports = async function (context, req) {
//     // if (req.body) {
//     //     context.bindings.myOutputBlob = req.body;
//     //   }

//       if (req.body) {
//         const bodyBuffer = Buffer.from(req.body);

//         const boundary = multipart.getBoundary(req.headers["content-type"]);
//         const parts = multipart.Parse(bodyBuffer, boundary);
//   // context.log(parts)
//         context.bindings.myOutputBlob = parts[0].data;
//         // context.done();
//       }

//   // const name = (req.query.name || (req.body && req.body.name));
//   // const responseMessage = name
//   //     ? "Hello, " + name + ". This HTTP triggered function executed successfully."
//   //     : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";
// //   context.bindings.myOutputBlob = context.req.body;
//   // context.res = {
//   //     // status: 200, /* Defaults to 200 */
//   //     // body: responseMessage
//   // };
// };

// module.exports = async function (context) {
//   context.log("MyStorageConnectionAppSetting: " + process.env["MyStorageConnectionAppSetting"]);
// };

const multipart = require("parse-multipart");
const { BlobServiceClient } = require("@azure/storage-blob");

module.exports = async function (context, req) {
  const AZURE_STORAGE_CONNECTION_STRING =
    process.env.MyStorageConnectionAppSetting;
  // Create the BlobServiceClient object which will be used to create a container client
  const blobServiceClient = BlobServiceClient.fromConnectionString(
    AZURE_STORAGE_CONNECTION_STRING
  );


  // Get a reference to a container
  const containerClient = blobServiceClient.getContainerClient('errors-photo');


  var bodyBuffer = Buffer.from(req.body);
  var boundary = multipart.getBoundary(req.headers["content-type"]);
  var parts = multipart.Parse(bodyBuffer, boundary);
  const blockBlobClient = containerClient.getBlockBlobClient(parts[0].filename);

  const uploadBlobResponse = await blockBlobClient.upload(
    parts[0].data,
    parts[0].data.length,
    {
      blobHTTPHeaders: {
        blobContentType: parts[0].type,
      },
    }
  );
  context.log(
    "Blob was uploaded successfully. requestId: ",
    uploadBlobResponse.requestId
  );

  
  context.res = {
    // status defaults to 200 */
    body: "ok",
  };
  // context.done();
};
