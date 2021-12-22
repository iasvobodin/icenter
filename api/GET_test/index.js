module.exports = async function (context) {
  const clearData = (el) => {
    const objE = Object.entries(el).filter(
      (entries) => !entries[0].startsWith('_')
    )
    return Object.fromEntries(objE)
  }
  if (!context.bindings.errorData[0]) {
    context.res = {
      status: 404,
    }
  } else {
    context.res = {
      body: clearData(context.bindings.errorData[0]),
    }
  }


  const patchSource = context.bindings.errorData[0];

const replaceOperation = 
    [{ 
      op: "set", 
      path: "/test", 
      value: "TADA" 
    }];

const { resource: patchSource1 } = await container.item(patchSource.lastName).patch(replaceOperation); 
console.log(`Patched ${patchSource1.lastName} to new ${patchSource1.lastName}.`); 
  // context.log(context.bindings.errorData[0])
}
