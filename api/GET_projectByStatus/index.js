module.exports = async function (context, req, data) {
  // const project = [];
  // data.map(el => el.project);
  context.res = {
    body: {
      data: data.map(el => {
        const objE = Object.entries(el).filter(entries => !entries[0].startsWith('_') && !entries[0].startsWith('ttl'))
        const objF = Object.fromEntries(objE)
        return {
          // ...el,
          'project number': el.id.split(' ')[0].replace('-', '.'),
          ...objF
        }
      }),
      // el.project.toString()).filter(el => el.length > 6).sort(),
      lastUpdate: data[data.length - 1]._ts
    }
  };
};