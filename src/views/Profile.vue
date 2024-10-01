<script setup>
import PersonalData from "@/components/profile/PersonalData.vue";
import CardOrganization from "@/components/profile/CardOrganization.vue";
import {useAxios} from "@/composable/useAxios.js";
import {onMounted, ref} from "vue";
import {useToast} from "primevue/usetoast";

const toast = useToast();
const profileData = ref({})
const dataOrg = ref({})
const getProfileData = ref({})
const getDataOrg = ref({})
const visible = ref(false);


const getProfile = async () =>{
  const res = await useAxios(`/profile`);
  profileData.value = res.result;
  dataOrg.value = profileData.value.organization
  console.log('get profile', profileData.value)
  visible.value = true;
}

const updateProfile = async () =>{
  try{
    const data = {
      email: getProfileData.value.email,
      name: getProfileData.value.name,
      role: getProfileData.value.role,
      phone: getProfileData.value.phone,
      organization: getDataOrg.value,
    }
    const res = await useAxios(`/profile`, {
      method: 'POST',
      data: data
    })
    toast.add({
      severity: 'success',
      summary: 'Обновлено!',
      detail: 'Профиль успешно обновлен!',
      life: 1500
    });
    console.log('Response:', res);
  }catch(error){
    console.log(error)
  }
}

const getDataProfile = (event) => {
  getProfileData.value = event
  updateProfile()
};

const getDataCard = (event) =>{
  getDataOrg.value = event
  console.log('card', event);
}

onMounted(async () =>{
  await getProfile()
})

</script>

<template>
  <div class="relative z-20 bottom-[40px] mt-2">
    <div class="header-text font-semibold text-[20px] leading-[20px] text-[#141C30]">
      Профиль
    </div>
    <div v-if="visible">
      <div class="mt-[50px]">
        <personal-data :profileData="profileData" @send-data="getDataProfile" />
      </div>
      <div class="mt-10">
        <card-organization :profileData="dataOrg" @send-data="getDataCard" />
      </div>
    </div>

  </div>

</template>

<style scoped lang="scss">

</style>