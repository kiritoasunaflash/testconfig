import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { userState } from './userInfo'
import { removeToken, getToken } from '@/utils/cookie'
export const getOther = defineStore('otherStore', () => {
  const userStore = ref(userState())
  console.log(getToken('token'))
  //   removeToken('token')
  userStore.value.tokenTest = null
  const time = ref(0)
  time.value = computed(() => {
    return (time.value = Date.now())
  })
  console.log('this time?')
  return { time }
})
