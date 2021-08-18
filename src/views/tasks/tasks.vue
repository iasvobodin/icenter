<template>
  <div>
<!-- <button @click="ff">FF</button>
<a href="https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=4cd0c647-2554-4150-a8d9-e82416eede9f&response_type=id_token+token&redirect_uri=http%3A%2F%2Flocalhost%2Fmyapp%2F&scope=openid%20https%3A%2F%2Fgraph.microsoft.com%2Fmail.read&response_mode=fragment&state=12345&nonce=678910">!!!!!!!!!!!!!!!!</a> -->
  </div>
</template>

<script>
import * as signalR from '@microsoft/signalr'
// import headerVue from '@/components/header.vue'
export default {
  setup() {

// const ff = async ()=>{
//   // await fetch("https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=4cd0c647-2554-4150-a8d9-e82416eede9f&response_type=id_token+token&redirect_uri=http%3A%2F%2Flocalhost%2Fmyapp%2F&scope=openid%20https%3A%2F%2Fgraph.microsoft.com%2Fmail.read&response_mode=fragment&state=12345&nonce=678910",{
//   //   method: "GET"
//   // })
// await fetch("https://management.azure.com/subscriptions/a5746592-9d11-4360-940b-b8fdb1042923/resourceGroups/icenterJuly/providers/Microsoft.DataFactory/factories/icenter/pipelines/icenter/createRun?api-version=2018-06-01",{
//   method: "POST",
//   headers:{
//     Authorization:"Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Im5PbzNaRHJPRFhFSzFqS1doWHNsSFJfS1hFZyIsImtpZCI6Im5PbzNaRHJPRFhFSzFqS1doWHNsSFJfS1hFZyJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTBmZjEtY2UwMC0wMDAwMDAwMDAwMDAvZW1lcnNvbi5zaGFyZXBvaW50LmNvbUBlYjA2OTg1ZC0wNmNhLTRhMTctODFkYS02MjlhYjk5ZjY1MDUiLCJpc3MiOiIwMDAwMDAwMS0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDBAZWIwNjk4NWQtMDZjYS00YTE3LTgxZGEtNjI5YWI5OWY2NTA1IiwiaWF0IjoxNjI3OTAwMjAyLCJuYmYiOjE2Mjc5MDAyMDIsImV4cCI6MTYyNzk4NjkwMiwiaWRlbnRpdHlwcm92aWRlciI6IjAwMDAwMDAxLTAwMDAtMDAwMC1jMDAwLTAwMDAwMDAwMDAwMEBlYjA2OTg1ZC0wNmNhLTRhMTctODFkYS02MjlhYjk5ZjY1MDUiLCJuYW1laWQiOiI4M2U2M2JiZC02Y2I5LTRhNGYtOTdlNC01MzM1NzUxMjEwNzRAZWIwNjk4NWQtMDZjYS00YTE3LTgxZGEtNjI5YWI5OWY2NTA1Iiwib2lkIjoiMjYyNmQxYzAtYzA2Ni00YzA5LTg2ZDQtZDFiY2E4Zjk5NzQ5Iiwic3ViIjoiMjYyNmQxYzAtYzA2Ni00YzA5LTg2ZDQtZDFiY2E4Zjk5NzQ5IiwidHJ1c3RlZGZvcmRlbGVnYXRpb24iOiJmYWxzZSJ9.mch0YJOscVsJDRGFLZZZj-FVfw0Zih_9O8uIFlnUNbrh6so1-wb5rzp4JZfO8D4-kM-KMJP98yKPTsI6aAUJGDcMTQdAdyVkXRNk7U-6DKTrL3EFx46crNtR9UjXse5B-lg3W27W8YSWM-8puTPLcPu2vwBQEPxWPD0K1E3V6-PG_Epm-HUlHc-XuDTof4Bij28TmUmdcAF9eEbC2QlYJMmw9aZ6LQYJKBPmXC9bbvXO57k675kEiOBeI6MFiEydExLBB1HEonLyHzHtsABQKguBvuLhyI6w4uHky4hnAtWSz4UqVMGmwi6lD0Xwm_28Dlkv54tWK59RCh6xCrXpQQ"
//   }
// })
// console.log('FETCHED');
// }


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
    // return {ff}
  }
}
</script>

<style lang="css" scoped>

</style>