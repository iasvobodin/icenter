module.exports = async function(context, req) {
  context.log(req.rawBody);

  context.bindings.errorOut = req.rawBody
  context.bindings.userErrorOut = 
  // [ 
    {
       id: req.body.id,
       info: {...req.body.info, Описание: req.body.body[req.body.body.length - 1].Открыто["Описание"]},
        type: "error",
        status: req.body.status,
        ttl: 6000,
      
   }
  
};
