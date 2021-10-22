const multipart = require('parse-multipart')
const sharp = require('sharp')
const { BlobServiceClient } = require('@azure/storage-blob')

module.exports = async function (context, req) {
  const AZURE_STORAGE_CONNECTION_STRING =
    process.env.MyStorageConnectionAppSetting

  // Create the BlobServiceClient object which will be used to create a container client
  const blobServiceClient = BlobServiceClient.fromConnectionString(
    AZURE_STORAGE_CONNECTION_STRING
  )

  // Get a reference to a container
  const containerClient = blobServiceClient.getContainerClient(
    req.query.container
  )

  if (req.query.list) {
    // let i = 1;
    const list = []
    for await (const blob of containerClient.listBlobsFlat()) {
      list.push(blob.name)
    }
    context.res = {
      body: list,
    }
    return
  }

  if (req.query.test) {
    const bodyBuffer = Buffer.from(req.body)
    const boundary = multipart.getBoundary(req.headers['content-type'])
    const parts = multipart.Parse(bodyBuffer, boundary)

    parts.forEach((e) => {
      const originBlob = containerClient.getBlockBlobClient(e.filename)
      const thumbBlob = containerClient.getBlockBlobClient(
        'thumb__' + e.filename
      )
      originBlob.upload(e.data, e.data.length, {
        blobHTTPHeaders: {
          blobContentType: e.type,
        },
      })

      sharp(e.data)
        .resize({
          width: 100,
          height: null,
        })
        .toBuffer(
          {
            resolveWithObject: true,
          },
          async (_, data) => {
            await thumbBlob.uploadData(data.buffer, {
              blobHTTPHeaders: {
                blobContentType: parts[0].type,
              },
            })
          }
        )

      context.log('Blob was uploaded successfully. requestId: ')
    })
    context.res = {
      // status defaults to 200 */
      body: 'ok',
    }
    return
  }

  if (req.query.delblob) {
    const uploadDataBlockBlobClient = containerClient.getBlockBlobClient(
      'thumb__' + req.query.fileName
    )
    const blockBlobClient = containerClient.getBlockBlobClient(
      req.query.fileName
    )

    blockBlobClient.deleteIfExists()
    uploadDataBlockBlobClient.deleteIfExists()
    return
  }

  context.res = {
    // status defaults to 200 */
    body: 'ok',
  }
  // context.done();
}
