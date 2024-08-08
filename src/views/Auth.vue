<script setup>
import {reactive,computed} from 'vue'
import {useAxios} from "@/composable/useAxios.js";
import {useRoute, useRouter} from "vue-router";
import {useCookies} from 'vue3-cookies'
import Toast from "primevue/toast";
import {useToast} from "primevue/usetoast";
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";

const { cookies } = useCookies()

const router = useRouter()
const route = useRoute()
const toast = useToast()

const data = reactive({
  login: '',
  password: ''
})
const rules = reactive({
  login: {required},
  password: {required},
});
const v$ = useVuelidate(rules, data);
const layout = computed(() => route.meta?.layout)
async function fetchOrders() {
  const result = await v$.value.$validate();

  if (result) {
    try {
      const res = await useAxios('/login', {
        method: 'POST',
        data: {
          login: data.login,
          password: data.password
        }
      });
      cookies.set('token', res.token)
      if (res.token) {
        toast.add({
          severity: "success",
          summary: "Success Message",
          detail: "Message Content",
          life: 3000,
        });
        await router.push({ name: 'Dashboard' })
        localStorage.setItem('user_name', res.user.name)
        localStorage.setItem('hasOneOrganization', res.user?.hasOneOrganization)
        localStorage.setItem('organization', JSON.stringify(res.user?.organization))
      }
    } catch (e) {
      console.log(e)
      toast.add({
        severity: "error",
        summary: "Error Message",
        detail: e.response.data.message,
        life: 3000,
      });
    }
  }
}

</script>

<template>
  <div class="grid grid-cols-12">
    <div class="col-span-6">
      <img src="@/assets/img/AuthImg.svg" alt="">
    </div>
    <div class="col-span-6 flex flex-col justify-center items-center w-full">
      <img src="@/assets/img/FullLogo.png" alt="" class="relative bottom-[138px] object-cover">
      <div>
        <div class="text-[16px] leading-[16px] text-center font-semibold">Вход</div>
        <fin-input  :error="v$.login.$error" v-model="data.login" class="w-[360px] mt-[50px]" placeholder="Логин"></fin-input>
        <fin-input :error="v$.password.$error"  v-model="data.password" class="w-[360px] mt-[26px]" placeholder="Пароль"></fin-input>
        <fin-button severity="success" class="w-[360px] mt-[26px]" label="Войти" @click="fetchOrders()"/>
        <div class="text-[16px] leading-[16px] text-center font-semibold text-[#3935E7] mt-[50px]">
          Забыли пароль?
        </div>
      </div>
    </div>
  </div>
  <Toast/>
</template>

<style scoped lang="scss">
</style>