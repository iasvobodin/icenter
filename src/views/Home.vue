<template>
  <h1>Test iCenterApp</h1>
  <chooseCabinet />
  <setError />
</template>

<script>
import chooseCabinet from "../components/chooseCabinet";
import setError from "../components/setError";
export default {
  components: {
    chooseCabinet,
    setError
  }
  // setup(props) {
  //   // console.log(props); // { user: '' }

  //   return {}; // anything returned here will be available for the rest of the component
  // }
};
</script>
