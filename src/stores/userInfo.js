import { defineStore } from 'pinia'
import { ref } from 'vue'
import { regist, login } from '@/Api/regist'
export const userState=defineStore('userInfo',()=>{
    const token=ref(null)
    login(query).then(res=>{
            console.log(res);
        // if(res.data)
    })
})