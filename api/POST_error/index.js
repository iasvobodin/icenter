module.exports = async function(context, req) {
  context.log(req.rawBody);

  context.bindings.errorOut = req.rawBody
  context.bindings.userErrorOut = [ 
    {
       id: req.body.id,
       authInfo:{
        userDetails: req.body["senior fitter"],
       },
        type: "error",
        status: req.body.status,
        ttl: 6000,
        "project number": req.body['project number'],
        "cab name": req.body['cab name'],
        description: req.body.body["Описание"]
   },
   {
       id: req.body.id,
       authInfo:{
        userDetails: req.body.fitter,
       },
        type: "error",
        status: req.body.status,
        ttl: 6000,
        "project number": req.body['project number'],
        "cab name": req.body['cab name'],
        description: req.body.body["Описание"]
   }

]
  // context.done();
};
