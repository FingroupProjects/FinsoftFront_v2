<script setup>

import {ref, onMounted} from "vue";
import Dialog from "primevue/dialog";
import {useAxios} from "@/composable/useAxios.js";

const props = defineProps({
  profileData: ''
})
const emit = defineEmits(['send-data']);

const personalData = ref({})
const changePasswordDialog = ref(false);
const password = ref();
const passwordConfirm = ref();

const changePassword = async () =>{
  const res = await useAxios(`change-password`, {
    method: "POST",
    data:{
      password: password.value,
      password_confirmation: passwordConfirm.value
    }
  })
  changePasswordDialog.value = false
}


const getPersonalData = () =>{
  personalData.value = props.profileData;
}
const saveData = () => {
  emit("send-data", personalData.value);
  console.log("send", personalData.value);
};
onMounted(()  =>{
   getPersonalData()
})

</script>

<template>
    <div class="profile bg-white w-[890px] h-[235px] rounded-2xl">
      <div class="flex pt-4 pl-8 items-center justify-between">
        <div class="text-[18px] font-semibold"> Песональные данные</div>
        <div class="mr-8 ">
          <fin-button
              @click="saveData"
              label="Сохранить"
              severity="success"
              class="h-[31px] mr-3"
          />
          <fin-button
              @click="changePasswordDialog = true"
              label="Сменить пароль"
              severity="warning"
              class="h-[31px]"
          />
        </div>
      </div>
      <div class="flex gap-4 mt-8">
        <div class="ml-6 border-2 w-[46px] h-[46px] rounded-2xl items-center flex justify-center bg-[#f6f6f6]">
          <img src="@/assets/img/exampleImg.svg" alt="" class="w-[46px]" />
        </div>
        <div class="w-[768px] mr-8">
          <fin-input placeholder="ФИО" v-model="personalData.name" />
        </div>
      </div>
      <div class="mt-8 pl-4 pr-6 flex justify-around">
        <div>
          <fin-input placeholder="Должность" class="w-[266px] font-bold" v-model="personalData.role" />
        </div>
        <div>
          <fin-input placeholder="Телефон"  class="w-[266px]" v-model="personalData.phone" />
        </div>

        <div>
          <fin-input placeholder="Электронная почта" type="email" class="w-[266px]" v-model="personalData.email" />
        </div>
      </div>
      <Dialog
          v-model:visible="changePasswordDialog"
          :style="{ width: '450px' }"
          :closable="false"
          :modal="true"
      >
        <div class="gap-4">
          <div class="font-semibold text-[20px] leading-6 text-center w-full m-auto text-[#141C30]">
            Изменить пароль
          </div>
          <div class="flex gap-4 mt-4">
            <fin-input placeholder="Новый пароль" class="w-full font-bold" v-model="password" />
          </div>
          <div class="flex gap-4 mt-4">
            <fin-input placeholder="Подтверждение пароля" class="w-full font-bold" v-model="passwordConfirm" />
          </div>
        </div>

        <template #footer>
          <fin-button label="Подтвердить" class="w-full" severity="success" icon="pi pi-check" @click="changePassword" />
          <fin-button
              label="Отменить"
              icon="pi pi-times"
              class="w-full"
              severity="warning"
              @click="changePasswordDialog = false"
          />
        </template>
      </Dialog>
    </div>
</template>

<style  lang="scss">

.profile{
  .p-button{
    height: 31px !important;
    border-radius: 10px !important;
  }
  .p-button-label{
    font-weight: bold !important;
  }
}


</style>