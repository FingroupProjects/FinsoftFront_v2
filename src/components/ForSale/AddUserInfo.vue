<script setup>
import {ref} from 'vue'
import Dialog from "primevue/dialog";
import FloatLabel from "primevue/floatlabel";
import DatePicker from "primevue/datepicker";
import {useAxios} from "@/composable/useAxios.js";
import moment from "moment/moment.js";
import Toast from 'primevue/toast'
import {useToast} from "primevue/usetoast";
import InputMask from 'primevue/inputmask';

const emit = defineEmits(['close-modal', 'postSale'])
const props = defineProps({
  openUserInfo: {
    type: Boolean,
    default: false
  }
})
const toast = useToast()
const name = ref('');
const lastName = ref('');
const phone = ref('');
const birthday = ref('');
const address = ref('');


async function addUser() {
  try {
    const res = await useAxios(`discount`, {
      method: 'POST',
      data: {
        "name": name.value,
        "lastname": lastName.value,
        "phone": phone.value,
        "birthday": moment(birthday.value).format('YYYY-MM-DD HH:mm:ss'),
        "address": address.value,
      }
    })
    toast.add({severity: 'success', summary: 'Создано!', detail: 'Документ успешно создано!', life: 1500});
    emit('close-modal')
  } catch (e) {
    toast.add({severity: 'error', summary: e.response.data.message, life: 1500});
  }
}
</script>

<template>
  <Dialog :draggable="false" class="fast-goods-header" v-model:visible="props.openUserInfo" modal
          :style="{ width: '800px', height:'354px' }" scroll :closable="false"
          :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <template #header>
      <div class="flex justify-between items-center w-full ">
        <div class="flex gap-5 items-center ">
          <fin-button @click="emit('close-modal')" icon="pi pi-times" class="p-button-2xl" severity="warning"
                      label="Отменить"/>
          <div class="font-semibold text-[26px] leading-[26px] text-[#141C30]">
            Добавление клиента
          </div>
        </div>
        <fin-button icon="pi pi-arrow-right" class="p-button-2xl" severity="info"
                    label="Создать" @click="addUser"/>
      </div>
    </template>
    <div class="grid add-user-info-modal grid-cols-12 gap-[16px] mt-[6px]">
      <fin-input v-model="name" class="col-span-4" placeholder="Имя"/>
      <fin-input v-model="lastName" class="col-span-4" placeholder="Фамилия"/>
      <FloatLabel class="col-span-4">
        <InputMask id="ssn" class="w-full" v-model="phone" mask="+99999-999-9999" placeholder="Телефон" />
        <label for="ssn">SSN</label>
      </FloatLabel>
      <fin-input v-model="address" class="col-span-6" placeholder="Адрес"/>

      <FloatLabel class="col-span-6">
        <DatePicker
            showIcon
            v-model="birthday"
            hourFormat="24"
            dateFormat="dd.mm.yy"
            fluid
            hideOnDateTimeSelect
            iconDisplay="input"
            class="w-full"
        />
        <label for="dd-city">Дата</label>
      </FloatLabel>
    </div>
  </Dialog>
  <Toast/>
</template>

<style scoped lang="scss">
.active {
  background: #3935E7;
  color: white;
}

.btn-transition {
  transition: 0.3s all linear;
}
</style>
<style lang="scss">
.add-user-info-modal {
  .p-datepicker {
    border: none !important;
    border-radius: 14px !important;
    display: flex !important;
    align-items: center !important;


    &-input-icon-container {
      top: 18px !important;
    }
  }

  .p-inputtext {
    height: 46px !important;
    border-radius: 10px !important;
  }
}
</style>