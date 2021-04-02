module.exports = function (context, documents) {
    context.log('First document Id modified : ', documents);


    // context.bindings.testOut = documents[0];

    context.res = {
      status: 200, /* Defaults to 200 */
      body: documents[0]
    };

    // context.done();
  }