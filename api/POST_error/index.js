module.exports = async function(context, req) {
  context.log(req.rawBody);


  // this.error = {
  //   id: "error__" + Date.now(),
  //   info: {
  //     wo: this.$store.state.projectInfo.wo.toString(),
  //     "cab name": this.$store.state.projectInfo["cab name"],
  //     "project number": this.$store.state.projectInfo["project number"],
  //     fitter: sessionStorage.getItem("userDetails").toLowerCase(),
  //     "senior fitter": this.$store.state.projectInfo["senior fitter"].toLowerCase(),
  //     type: "error",
  //   },
  //   status: "open",
  //   stage: 1,
  //   ttl: 6000,
  //   body: [this.errorBody],
  // };

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
  //  {
  //      id: req.body.id,
  //     info:{
  //       userDetails: req.body.info.fitter,
  //      },
  //       type: "error",
  //       status: req.body.status,
  //       ttl: 6000,
  //       "project number": req.body.info['project number'],
  //       "cab name": req.body.info['cab name'],
  //       description: req.body.body[req.body.body.length - 1].stage1["Описание"]
  //  }

// ]
  // context.done();
};
