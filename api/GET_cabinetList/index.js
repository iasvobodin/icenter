module.exports = async function(context, req, data) {
  if (data.length === 0) {
    context.res = {
    status: 404
    };
    return
  } else {
    // const filter = data.forEach(e =>{
    //   Object.keys(e).filter(key => {
    //     key.startsWith('_')
    //     context.log(key)
    //   })
      
    // })
    context.res = {
      body: {
        data: data.map(el => {
          const objE = Object.entries(el).filter(entries => !entries[0].startsWith('_') && !entries[0].startsWith('ttl'))
          const objF = Object.fromEntries(objE)
          const Cabinets = []
           el.Cabinets.split(',').forEach(e => Cabinets.push({
             wo:e.split('__')[0],
             'cab name': e.split('__')[1]
           })
           )
          
          return {
            ...objF,
            Cabinets
            
          }
        }),
        // el.project.toString()).filter(el => el.length > 6).sort(),
        lastUpdate: data[data.length - 1]._ts
      }
    };
  }
  // const fProject = {
  //   project: data[0].project,
  //   cabinets: []
  // }
  // data.forEach(e => {
  //   e.cabinet.wo&&fProject.cabinets.push(e.cabinet)
  // })
  

};
