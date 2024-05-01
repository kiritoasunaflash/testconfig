import { defineStore } from 'pinia'
import { ref } from 'vue'
import { regist, login } from '@/Api/regist'
import { setToken,getToken } from '@/utils/cookie'

export const userState=defineStore('userInfo',()=>{
    const tokenTest=ref(null)
    // login(query).then(res=>{
    //         console.log(res);
    //     // if(res.data)
    //     token.value=res.data
    // })
    tokenTest.value='550e8400-e29b-41d4-a716-446655440000'
    setToken(tokenTest.value)
    console.log(getToken());
    return {tokenTest}
})