import { unref } from "vue";


export default function searchByObject(obj, key, query){
    
    return Object.values(obj).filter(e=>{
        // debugger
    key.forEach(el => {
        e[el].includes(query)
    });
})

}