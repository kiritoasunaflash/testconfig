import { defineStore } from 'pinia'
import { ref } from 'vue'
import { setToken, getToken, removeToken } from '@/utils/cookie'

export const userState = defineStore('userInfo', () => {
  const tokenTest = ref('550e8400-e29b-41d4-a716-446655440000')

  // Immediately set the token upon store initialization
  setToken(tokenTest.value)

  const timer = ref(null)

  // Clear timer if it exists
  const clearTimer = () => {
    if (timer.value) {
      clearTimeout(timer.value)
      timer.value = null
    }
  }

  const setTimer = (expirationTime) => {
    clearTimer() // Clear existing timer before setting a new one

    timer.value = setTimeout(() => {
      const currentTime = Date.now()
      const timeLeft = expirationTime - currentTime

      if (timeLeft < 0) {
        removeToken('token')
        console.log('Token removed:', getToken('token'))
      }
    }, 1000)
  }
  // aha
  return { tokenTest, setTimer }
})
