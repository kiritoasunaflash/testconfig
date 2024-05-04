import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const data = ref([1, 23, 13, 12, 41, 123, 123, 24, 453, 42, 31, 243, 1])
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }
  const quickSort = (arr) => {
    if (arr.length === 1) {
      return arr
    }
    let left = []
    let right = []
    let middleIndex = Math.floor(arr.length / 2)
    let middle = arr.splice(middleIndex, 1)[0]
    for (let key in arr) {
      if (arr[key] < middle) {
        left.push(arr[key])
      } else {
        right.push(arr[key])
      }
    }
    return quickSort(left).concat([middle], quickSort(right))
  }
  console.log('this is pop')
  console.log('nonon')
  return { count, doubleCount, increment }
})
