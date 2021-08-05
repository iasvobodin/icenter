<template>
<div class="login__holder">
  <div class="login">
    <h1>iCenterApp<br>Login </h1>
    <a href="/.auth/login/aad">
    <img src="/img/Microsoft.svg" alt=""></a>
   <br>
    <a href="/.auth/login/google">
    <img src="/img/Google.svg" alt="">
    </a>
  </div>
</div>

</template>

<script>

</script>

<style lang="css" scoped>
.login__holder{
  display: grid;
  width: 100%;
  height: 100vh;
}
.login{
  place-self: center;
  padding-bottom: 20vh;
}
img{
  width: 150px;
  height: 50px;
  margin: 1vh;
  padding: 1vh;
  border: 1px solid rgb(214, 214, 214);
  box-shadow: 0 3.2px 7.2px 0 rgba(0,0,0,.132),0 .6px 1.8px 0 rgba(0,0,0,.108);
  border-radius: 5px;
}
</style>
