module.exports = async function(context) {
  context.res = {
    body: {
      text: "Hello from the API"
    }
  };
};
