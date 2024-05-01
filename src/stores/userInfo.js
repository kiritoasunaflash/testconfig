import { defineStore } from 'pinia'
import { ref } from 'vue'
import { regist, login } from '@/Api/regist'
import { setToken, getToken, removeToken } from '@/utils/cookie'
<<<<<<< HEAD
export const userState = defineStore('userInfo', () => {
  const tokenTest = ref(null)
  tokenTest.value = '550e8400-e29b-41d4-a716-446655440000'
  setToken(tokenTest.value)
  let timer = ref(null)
  const getTimer = (time) => {
    console.log(time)
    let timeDate = null
    setTimeout(() => {
      timeDate = Date.now()
      timer.value = time - timeDate
      console.log(timer.value)
    }, 1000)
    console.log(timer.value)
    if (timer.value < 0) {
      removeToken('token')
      console.log(getToken('token'), 20)
    }
  }

  console.log(getToken('token'), 23)
  return { tokenTest, getTimer, timer }
=======
const tokenTest = ref(null)
export const userState = defineStore('userInfo', () => {
  tokenTest.value = '550e8400-e29b-41d4-a716-446655440000'
  setToken(tokenTest.value)
  let timer = new Date()
  console.log(timer)
  if (timer < 0) {
    removeToken('token')
  }
  console.log(getToken('token'))
  console.log(111)
  return { tokenTest }
>>>>>>> feat-noFeel-my
})
