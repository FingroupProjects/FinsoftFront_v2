<script setup>
import {ref} from 'vue'
import {useAxios} from "@/composable/useAxios.js";
import {useRouter} from "vue-router";
import { useCookies } from 'vue3-cookies'
const { cookies } = useCookies()
const router = useRouter()
const loginName = ref('')
const password = ref('')

async function fetchOrders() {
  try {
    const res = await useAxios('/login', {
      method: 'POST',
      data: {
        login: loginName.value,
        password: password.value
      }
    });
    cookies.set('token', res.token)
    if (res.token){
      router.push('/dashboard')
      localStorage.setItem('user_name', res.user.name)
      localStorage.setItem('hasOneOrganization', res.user?.hasOneOrganization)
    }
  } catch (e) {
    console.log(e)
  }
}

</script>

<template>
  <fin-input v-model="loginName" placeholder="name"></fin-input>
  <fin-input v-model="password" placeholder="password"></fin-input>
  <fin-button label="login" @click="fetchOrders()"/>
</template>

<style scoped lang="scss">
</style>