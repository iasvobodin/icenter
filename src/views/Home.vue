<template>
  <h1>Test iCenterApp</h1>
  <p>this application is in development mode</p>
  <!-- <chooseCabinet />
  <setError /> -->
</template>

<script>
import chooseCabinet from "../components/chooseCabinet";
import setError from "../components/setError";
export default {
  components: {
    // eslint-disable-next-line vue/no-unused-components
    chooseCabinet,
    // eslint-disable-next-line vue/no-unused-components
    setError,
  },
  // setup(props) {
  //   // console.log(props); // { user: '' }

  //   return {}; // anything returned here will be available for the rest of the component
  // }
};
</script>
