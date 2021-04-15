const multipart = require("parse-multipart");
module.exports = async function (context, req) {
    // if (req.body) {  
    //     context.bindings.myOutputBlob = req.body;
    //   }



      if (req.body) {
        const bodyBuffer = Buffer.from(req.body);
  
        const boundary = multipart.getBoundary(req.headers["content-type"]);
        const parts = multipart.Parse(bodyBuffer, boundary);
  
        context.bindings.myOutputBlob = parts[0].data;
        // context.done();
      }

  // const name = (req.query.name || (req.body && req.body.name));
  // const responseMessage = name
  //     ? "Hello, " + name + ". This HTTP triggered function executed successfully."
  //     : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";
//   context.bindings.myOutputBlob = context.req.body;
  // context.res = {
  //     // status: 200, /* Defaults to 200 */
  //     // body: responseMessage
  // };
};
