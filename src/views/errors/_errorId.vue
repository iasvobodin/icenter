<template>
  <div class="cabinet">
    <div>
      <h1>{{ $route.params.errorId }}</h1>
      <br />
    </div>
    <div v-if="error" class="cabinet__info">
      <section class="information">
        <info-render :info-data="error.info" />
      </section>
      <section v-for="(val, key, index) in error.body" :key="index" class="eror__body">
        <div v-if="!key.startsWith('_')&&Object.values(val)[1]">
          <div v-if="!returnRender(key, val)">
            <h2 >{{ key }}</h2>
          <info-render :info-data="val" />
          </div>
        </div>
      </section>
      <section class="mod__error__body">
        <form id="errorData" @submit.prevent="updateErorData">
          <div v-for="(value, key, index) in $store.state.template.error[
              error.type
            ]" :key="index">
            <div v-if="returnRender(key, value)">
              <h3>Статус ошибки: {{ key }}</h3>
              <conditional-render v-model="error.body[key]" :data-render="value" :required="!$store.state.user.info.userRoles.includes('admin')" />
            </div>
          </div>
        </form>
      </section>
      <h3 v-if="error.photos[0]">Фотографии</h3>
       <error-photos 
       :change-photos="changeInfo"
       :current-photos="error.photos"
        @delete-blob="setPH" 
        @resized-blob="errorPhotosBlob($event)"/>
    </div>
    <div v-else class="loading" />
    <p v-if="errorIsNotDef">{{ errorIsNotDef }}</p>
  </div>
  <br />
  <br />
  <div class="button__block">
    <button v-if="
        error &&
        !changeInfo &&
        error.info.Добавил === $store.state.user.info.userDetails || 
        $store.state.user.info.userRoles.includes('admin')
      " @click="changeData">
      {{!changeInfo? 'Редактировать':'Отмена'}}
    </button>
    <button @click="deleteError" v-if="changeInfo">Удалить</button>
    <button v-if="changeInfo" type="submit" form="errorData">
      Сохранить
    </button>
  </div>

  <!-- <img crossorigin="anonymous" src="https://icaenter.blob.core.windows.net/errors-photo/21-01-04-12-30-23.jpg" alt="11"> -->
</template>

<script>
import errorPhotos from '@/components/errorPhotos.vue'
import conditionalRender from "@/components/conditionalRender.vue";
import infoRender from "@/components/infoRender.vue";
export default {
  components: {
    errorPhotos,
    conditionalRender,
    infoRender,
  },
  data() {
    return {
      compressBlob: [],
      files: [],
      linkPhoto: 'https://icaenter.blob.core.windows.net/errors-photo/',
      showPhotos: false,
      statusConfirmed: false,
      statusClosed: false,
      closeError: null,
      dataModel: null,
      changeInfo: false,
      error: null,
      errorIsNotDef: null,
      errorTemplate: null,
      test: null,
      deletMethods: []
    };
  },

  async created() {
    this.error = await this.getCurrentError();
    this.error.body = this.error.body[this.error.body.length - 1];
  },
  methods: {
    errorPhotosBlob(e) {
      this.compressBlob = e
      addEventListener('beforeunload', (event) => {
        // Отмените событие, как указано в стандарте.
        event.preventDefault();
        // Chrome требует установки возвратного значения.
        event.returnValue = 'aaa';
      });
    },
    async deleteError() {
      const delErr = {
        method: "POST", // или 'PUT'
        body: JSON.stringify({
          id: this.error.id,
          status: this.error.status,
          info: {
            wo: this.error.info.wo
          },
          ttl: 1
        }),
      }
      await fetch("/api/POST_openError", delErr)
      await fetch("/api/POST_error", delErr);
      this.error.photos.length > 0 && await Promise.all(this.error.photos.map(async e => {
        await fetch(`/api/blob?fileName=${e}&delblob=true`)
      }))
      this.$router.push('/errors')
    },
    setPH(e) {
      this.deletMethods = e.del
      this.error.photos.splice(e.index, 1)
      // this.error.photos = e.actual
    },
    // resizedBlob(e){
    //   console.log(e,"!!!!!!!!!!!!!!!!!!!!!!");
    // },
    // deleteFromBase(e){
    //   console.log(e);
    // },
    // firedFileInput(){
    //   this.$refs.fileInput.click()
    // },
    // checkFile() {
    //   // this.fileInput = document.getElementById('imageFile') 
    //   this.files = Object.values(this.$refs.fileInput.files)
    //   addEventListener("beforeunload", this.beforeUnloadListener, {
    //     capture: true
    //   });
    // },
    // deleteBlob(el, i) {
    //   this.error.photos.splice(i, 1)
    //   this.deletMethods.push(`/api/blob?fileName=${el}&delblob=true`, `/api/blob?fileName=thumb__${el}&delblob=true`)
    // },
    // eslint-disable-next-line no-unused-vars
    returnRender(key) {
      if (this.changeInfo && this.$store.state.user.info.userRoles.includes('admin')) {
        return true
      }
      if (this.changeInfo && this.error.status === 'confirmed') {
        if (key === "Открыто") {
          return false;
        }
        if (key === "Принято") {
          return false;
        }
        if (key === "Устранено") {
          return true;
        }
      }
      if (this.changeInfo && this.$store.state.user.info.userDetails.toLowerCase() === this.error.info.Добавил) {
        if (key === "Открыто") {
          return true;
        }
        if (key === "Принято") {
          return false;
        }
        if (key === "Устранено") {
          return false;
        }
      }
    },
    changeData() {
      this.changeInfo = !this.changeInfo;
    },
    async updateErorData() {
      //GET CURRENT ITEM FROM DB
      const err = await this.getCurrentError();
      const photos = this.error.photos
      // OBJECT FOR NEW UPDATET ERROR
      const updateErorBody = {
        ...err,
        status: Object.values(this.error.body.Устранено)[0] ?
          "closed" : Object.values(this.error.body.Принято)[0] ?
          "confirmed" : "open",
        body: [
          ...err.body, //CURRENT BODY + 
          {
            ...this.error.body, //CHANGED BODY
            _changed: JSON.parse(localStorage.getItem("user")).info.userDetails.toLowerCase(),
            _time: `${Date.now()}`,
          },
        ],
        photos
      };
      // OBJECT FOR OPEN ERROR
      const openError = {
        id: this.error.id,
        info: {
          ...this.error.info,
          Описание: this.error.body.Открыто["Описание"],
        },
        type: "error",
        status: updateErorBody.status,
        // ttl: 6000,
      };
      // DELETE OPEN ERROR IF STATUS IS CLOSED
      if (
        err.status != updateErorBody.status ||
        updateErorBody.status === "closed"
      ) {
        // console.log("comparestatus");
        await fetch("/api/POST_openError", {
          method: "POST", // или 'PUT'
          body: JSON.stringify({
            id: err.id,
            status: err.status,
            ttl: 1
          }),
        });
      }
    
      try {
        const formData = new FormData()
        this.compressBlob.map((e, i) => {
          const imageName = `${err.id}__${this.$store.state.user.info.userDetails.toLowerCase()}__${Date.now() + i}.jpg`
          photos.push(imageName)
          formData.set(`photo${i+1}`, e, imageName)
        })
         // UPLOAD PHOTOS
        await fetch(
          '/api/blob?test=true', {
            method: 'POST',
            body: formData,
          },
        )
        // DELETE PHOTOS FROM AZURE STORAGE
       await Promise.all(this.deletMethods?.del.map(async e => {
          await fetch(e)
        }))
        // UPDATE ERROR IN ICENTERDB
        await fetch("/api/POST_error", {
          method: "POST", // или 'PUT'
          body: JSON.stringify({
            ...updateErorBody
          }),
        });


        if (updateErorBody.status === "closed") {
          return;
        } //IF STATUS CLOSED SKIP THIS STEP
        await fetch("/api/POST_openError", {
          method: "POST",
          body: JSON.stringify({
            ...openError
          }),
        });


      } finally {
        this.changeInfo = !this.changeInfo;
        this.error.photos = photos
        removeEventListener("beforeunload", (event) => {
          // Отмените событие, как указано в стандарте.
          event.preventDefault();
          // Chrome требует установки возвратного значения.
          event.returnValue = '';
        });
      }
    },
    async getCurrentError() {
      try {
        const responsError = await fetch(
          `/api/errors/${this.$route.params.errorId}`
        );
        const error = await responsError.json();
        if (!responsError.ok) {
          this.errorIsNotDef = "Данной ошибки не существует";
          console.log("Данной ошибки не существует");
        }

        return error;
      } catch (error) {
        this.errorIsNotDef = "Данной ошибки не существует";
        console.log("errors is not def", error);
      }
    },
  },
};
</script>

<style lang="css" scoped>
.add__photo{
width: 100px;
 place-self: center;
 cursor: pointer;
}

.custom-file-input:hover::before {
  border-color: black;
}
.custom-file-input:active::before {
  background: -webkit-linear-gradient(top, #e3e3e3, #f9f9f9);
  background-image: url('/img/add__image.svg');
}
.back__image{
  position: fixed;
  top: 10px;
  right: 80px;
  width: 40px;
  border: 1px solid black;
  border-radius: 4px;
  cursor: pointer;
}
.delete__image{
  top: -30px;
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.photos {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  column-gap: 1vh;
  row-gap: 1vh;
}
.photo__holder {
  /* width: 100px; */
  position: relative;
  /* height: 100px; */
  place-self: center;
  margin: auto;
  margin-top: 1vh;
  margin-bottom: 1vh;
  box-sizing: border-box;
  /* overflow: hidden; */
  border-radius: 4px;
}
.error__photos {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
.description__area {
  width: inherit;
}
.loading {
  margin: auto;
  width: 30px;
  height: 30px;
  background: url(/img/loading.gif) no-repeat center bottom;
}
p {
  font-size: 16px;
}
h3 {
  margin: 5px;
}
.cabinet {
  border: 1px solid orange;
  border-radius: 4px;
  margin: auto;
  margin-top: 1vh;
  margin-bottom: 1vh;
  width: min(95vw, 600px);
  padding: 10px;
  box-sizing: border-box;
}
h1 {
  margin: 10px;
}
h2 {
  margin: 7px;
}
.cabinet__info {
  /* width: min(95vw, 400px); */
  width: 100%;
  box-sizing: border-box;
  margin: auto;
}
.cabinet__info__desc {
  /* border-bottom: 1px solid black; */
  padding: 5px;
  /* width: 100%; */
}
.cabinet__info__desc > h3 {
  margin-top: 1vh;
  margin-bottom: 1vh;
}
/* .cabinet__info__item {
  border-bottom: 1px solid black;
  padding: 5px;
  display: grid;
  grid-template-columns: 1fr 4fr;
}
.cabinet__info__item > h3 {
  justify-self: start;
  align-self: center;
  text-align: start;
}
.cabinet__info__item > p {
  justify-self: end;
  text-align: end;
  align-self: center;
} */
.cabinet__info__item > select {
  justify-self: end;
  text-align: end;
  align-self: center;
}
.error__item__desc {
  justify-self: end;
  text-align: end;
  align-self: center;
  margin: 0;
}
/* .error__item__vertical__title {
  text-align: center;
  margin: 5px;
}
.error__item__vertical__desc {
  padding: 5px;
  text-align: start;
} */
</style>
