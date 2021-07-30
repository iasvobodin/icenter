<template>
  <div>

  </div>
</template>

<script>
import * as signalR from '@microsoft/signalr'
export default {
  setup() {

    const connect = () => {
      const connection = new signalR.HubConnectionBuilder()
        .withUrl('/api')
        .build();

      connection.onclose(() => {
        console.log('SignalR connection disconnected');
        setTimeout(() => connect(), 2000);
      });

      connection.on('updated', updatedStock => {
        console.log(updatedStock);
        alert(`${updatedStock.id} обновлена`)
      });

      connection.start().then(() => {
        console.log("SignalR connection established");
      });
    };

    connect();
    return {}
  }
}
</script>

<style lang="css" scoped>

</style>