const multipart = require("parse-multipart");
const sharp = require("sharp");





const {
  BlobServiceClient
} = require("@azure/storage-blob");

module.exports = async function (context, req) {


  const AZURE_STORAGE_CONNECTION_STRING =
    process.env.MyStorageConnectionAppSetting;

  // Create the BlobServiceClient object which will be used to create a container client
  const blobServiceClient = BlobServiceClient.fromConnectionString(
    AZURE_STORAGE_CONNECTION_STRING
  );

  // Get a reference to a container
  const containerClient = blobServiceClient.getContainerClient("errors-photo");



  if (req.query.test) {
    const bodyBuffer = Buffer.from(req.body);
    const boundary = multipart.getBoundary(req.headers["content-type"]);
    const parts = multipart.Parse(bodyBuffer, boundary);

    

    parts.forEach(e=>{
      const originBlob = containerClient.getBlockBlobClient(e.filename);
      const thumbBlob = containerClient.getBlockBlobClient("thumb__" + e.filename);
      originBlob.upload(
        e.data,
        e.data.length, {
          blobHTTPHeaders: {
            blobContentType: e.type,
          },
        }
      );

      sharp(e.data)
      .resize({
        width: 100,
        height: null,
      })
      .toBuffer({
          resolveWithObject: true,
        },
        // eslint-disable-next-line no-unused-vars
        async (_, data) => {
          await thumbBlob.uploadData(data.buffer, {
            blobHTTPHeaders: {
              blobContentType: parts[0].type,
            },
          });
        }
      );

      context.log(
        "Blob was uploaded successfully. requestId: ",
      );
    })
    context.res = {
      // status defaults to 200 */
      body: "ok",
    };
    return
  }


  const uploadDataBlockBlobClient = containerClient.getBlockBlobClient(
    "thumb__" + req.query.fileName
  );
  const blockBlobClient = containerClient.getBlockBlobClient(
    req.query.fileName
  );

  if (req.query.delblob) {
    blockBlobClient.deleteIfExists()
    uploadDataBlockBlobClient.deleteIfExists()
    return
  }

  var bodyBuffer = Buffer.from(req.body);
  var boundary = multipart.getBoundary(req.headers["content-type"]);
  var parts = multipart.Parse(bodyBuffer, boundary);

  sharp(parts[0].data)
    .resize({
      width: 100,
      height: null,
    })
    .toBuffer({
        resolveWithObject: true,
      },
      // eslint-disable-next-line no-unused-vars
      async (err, data, info) => {
        await uploadDataBlockBlobClient.uploadData(data.buffer, {
          blobHTTPHeaders: {
            blobContentType: parts[0].type,
          },
        });
      }
    );



  sharp(parts[0].data)
    // .resize({
    //   width: 1920,
    //   height: null,
    // })
    .toBuffer({
        resolveWithObject: true,
      },
      // eslint-disable-next-line no-unused-vars
      async (err, data, info) => {
        await blockBlobClient.uploadData(data.buffer, {
          blobHTTPHeaders: {
            blobContentType: parts[0].type,
          },
        });
      }
    );

  // const uploadBlobResponse = await blockBlobClient.upload(
  //   parts[0].data,
  //   parts[0].data.length, {
  //     blobHTTPHeaders: {
  //       blobContentType: parts[0].type,
  //     },
  //   }
  // );
  // context.log(
  //   "Blob was uploaded successfully. requestId: ",
  //   uploadBlobResponse.requestId
  // );



  context.res = {
    // status defaults to 200 */
    body: "ok",
  };
  // context.done();
};
