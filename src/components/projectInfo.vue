<template>
    <form @submit.prevent="postProject" class="project__info">
        <h2>Project Info</h2>
        <div class="project__info__row">
            <span>№ </span>
            <span>{{project.project}}</span>
        </div>
        <div class="project__info__row">
            <span>SZ №</span>
            <span>{{project.cabinetInfo.szNumber}}</span>
        </div>
        <div class="project__info__row">
            <span>Project name</span>
            <span>
                {{project.cabinetInfo.projectName}}
            </span>
        </div>
        <div class="project__info__row">
            <span>РМ</span>
            <span>
                {{project.cabinetInfo.pm}}
            </span>
        </div>
        <div class="project__info__row">
            <span>Вuyer</span>
            <span>
                {{project.cabinetInfo.buyer}}
            </span>
        </div>
        <div class="project__info__row">
            <span>Сontract administrator</span>
            <span>
                {{project.cabinetInfo.contractAdministrator}}
            </span>
        </div>
        <div class="project__info__row">
            <span>Buyout administrator</span>
            <span>
                {{project.cabinetInfo.buyoutAdministrator}}
            </span>
        </div>
        <div class="project__info__row">
            <span>Lead engineer</span>
            <span>
                {{project.cabinetInfo.leadEngineer}}
            </span>
        </div>
        <div class="project__info__row">
            <span>Hardware engineer</span>
            <span>
                {{project.cabinetInfo.hardwareEngineer}}
            </span>
        </div>
        <div v-if="!fetchTemplate" class="fetchHolder">Load</div>
        <div v-else v-for="(value, key, index) in fetchTemplate.template.base" :key="index" class="project__info__row">
            <span>{{key}}</span>
            <select required v-model="selected[key]">
                <option v-for="(fitter, index) in value" :key="index">{{fitter}}</option>
            </select>
        </div>
        <div v-if="!fetchTemplate" class="fetchHolder">Load</div>
        <div v-else v-for="(value, key, index) in fetchTemplate.template.extend" :key="index"
            class="project__info__row">
            <span>{{key}}</span>
            <textarea v-model="selected[key]" cols="30" rows="3"></textarea>
        </div>
        <h4>Cabinets</h4>
        <div v-if="cabinets.length === 0">
            <h4>please select cabinets</h4>
        </div>
        <div v-else v-for="(value, key, index) in cabinets" :key="index" class="project__info__row">
            <span v-if="value.cabinetInfo.wo"> WO: {{value.cabinetInfo.wo}}</span>
            <span v-else style="padding: 5px; color: white; background-color: red; font-size:10px;"> Номер WO должен
                быть заполнен </span>
            <span>Name :{{ value.cabinetInfo.cabName }}</span>
        </div>
        <input  type="submit" value="ADD" />
    <!-- <button type="submit" @click="postProject">ADD</button> -->
    </form>
</template>

<script>
export default {
    data() {
        return {
            fetchTemplate: null,
            selected: {},
            status: {}
        }
    },
    props: {
        project: {
            type: Object,
            default: () => {}
        },
        cabinets: {
            type: Array,
            default: () => []
        },
    },
    methods: {
        async postProject() {
            const cab = this.cabinets.map((el) => {
                return {
                    wo: el.cabinetInfo.wo,
                    cabName: el.cabinetInfo.cabName,
                    "cabTime": {},
                    "dimensions": "",
                    "documentation": "",
                    "weight": "",
                    "hardwareEngineer": ""
                }
            })
            await fetch("/api/POST_project", {
                method: "POST", // или 'PUT'
                body: JSON.stringify({
                    id: this.project.project,
                    status: this.selected.Status,
                    info: {
                        szNumber: this.project.cabinetInfo.szNumber,
                        projectName: this.project.cabinetInfo.projectName,
                        pm: this.project.cabinetInfo.pm,
                        buyer: this.project.cabinetInfo.buyer,
                        contractAdministrator: this.project.cabinetInfo.contractAdministrator,
                        buyoutAdministrator: this.project.cabinetInfo.buyoutAdministrator,
                        leadEngineer: this.project.cabinetInfo.leadEngineer,
                        seniorFitter: this.selected['Senior fitter'],
                        ["Specific requirement"]: this.selected['Specific requiremen'],
                        Comments: this.selected.Comments,
                        redyToProd: false,
                    },
                    cabinets: cab
                })
            });
        }
    },
    async mounted() {
        try {
                  this.fetchTemplate = await (
            await fetch('/api/templates/project/projectTemplate')
        ).json();  
        } catch (error) {
            console.log(error);
        }

    },
}
</script>

<style lang="css" scoped>
.project__info{
    border: solid 1px black;
}
.project__info__row{
    border-bottom: solid 1px black;
    background: rgba(214, 214, 214, 0.459);
    padding: 5px;
   display: grid;
   grid-template-columns: 1fr 2fr;
}
.project__info__row > span{
    justify-self:stretch;
    align-self: center;
  /* place-self: start; */
  text-align: start;
}
</style>