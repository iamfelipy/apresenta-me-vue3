import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const user = ref({name: 'pietro'});
  function setUser(userLogin) {
    user.value = {...userLogin}
  }

  return { user, setUser }
})
