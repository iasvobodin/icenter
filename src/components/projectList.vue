<template>
    <div>
        helooooow
        <div class="project__holder" v-if="!projectList">Загрузка данных</div>

<table v-else>
  <thead>
    <tr>
      <th>Номер проекта</th>
      <th  v-for="(value, key, index) in projectList[2].info" :key="index" >{{key}}</th>
    </tr>
  </thead>
  <tbody>
    <tr  v-for="(value, key, index) in projectList" :key="index" >
      <td>{{value.id}}</td>
      <td v-for="(val, key, index) in value.info" :key="index" >{{val}}</td>
    </tr>
  </tbody>
</table>
        <!-- <div v-else v-for="(project, index) in projectList" :key="index" class="project_list">

            <div class="project__item">
                {{project.id}}
                <div v-for="(value, key, index) in project.info" :key="index" class="project__info">
                    <p>
                        {{key}}  {{value}}
                    </p>
                </div>
            </div>
        </div> -->
    </div>
</template>

<script>
export default {
    data() {
        return {
            projectList: null,
            status: "open"
        }
    },
    async mounted() {
        try {
                  this.projectList = await (
            await fetch(`/api/project/${this.status}`)
        ).json();  
        } catch (error) {
            console.log(error);
        }

    },
}
</script>

<style lang="css" scoped>
table {
  border-collapse: collapse;
 
}
td, th {
  border: 1px solid #999;
  padding: 0.5rem;
   font-size: 12px;
}
tbody tr:nth-child(odd) {
  background: #eee;
}
tbody tr:hover {
  background: yellow;
}
</style>