import { defineStore } from 'pinia'
import { ref } from 'vue'
import { regist, login } from '@/Api/regist'
import { setToken,getToken,removeToken } from '@/utils/cookie'
const tokenTest=ref(null)
export const userState=defineStore('userInfo',()=>{
    const tokenTest=ref(null)
    tokenTest.value='550e8400-e29b-41d4-a716-446655440000'
    setToken(tokenTest.value)
    let timer=new Date()
    console.log(timer); 
    if(timer<0){
        removeToken('token')
    }
    console.log(getToken('token'));
    return {tokenTest}
})