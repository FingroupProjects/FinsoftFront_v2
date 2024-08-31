<script setup>
import {reactive, ref, watchEffect, watch, onMounted} from "vue";
import DatePicker from "primevue/datepicker";
import {useStaticApi} from "@/composable/useStaticApi.js";
import {useAxios} from "@/composable/useAxios.js";
import CreateProduct from "@/components/CreateProduct.vue";
import Dropdown from "primevue/dropdown";
import moment from "moment";
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";
import {useToast} from "primevue/usetoast";
import Toast from "primevue/toast";
import FloatLabel from "primevue/floatlabel";
import Textarea from 'primevue/textarea';
import Dialog from "primevue/dialog";

const emit = defineEmits(["closeDialog", 'close-sidebar']);

const toast = useToast();

const {
  findUsers,
  userList,
  loadingUser
} = useStaticApi();

const agreementList = ref([]);
const loadingAgreement = ref(false);
const productsInfo = ref();
const isCurrencyFetched = ref(false);
const openInfoModal = ref(false);
const initialValue = ref(null);
const isModal = ref(false)
const createValues = reactive({
  name: "",
  inn: "",
  director: "",
  chief_accountant: "",
  address: "",
});
const rules = reactive({
  name: {required},
  inn: {required},
  director: {required},
  chief_accountant: {required}
});
const userName = {
  name: localStorage.getItem("user_name"),
};
const organizationJson = localStorage.getItem('organization');
const organizationHas = JSON.parse(organizationJson);
const hasOrganization = JSON.parse(localStorage.getItem('hasOneOrganization'));
const v$ = useVuelidate(rules, createValues);

async function saveFn() {
  const result = await v$.value.$validate();
  openInfoModal.value = false
  if (result) {
    try {
      const res = await useAxios(`organization`, {
        method: "POST",
        data: {
          name: createValues.name,
          INN: createValues.inn,
          chief_accountant_id: createValues.chief_accountant.code,
          director_id: createValues.director.code,
          address: createValues.address
        },
      });
      toast.add({
        severity: "success",
        summary: "Success Message",
        detail: "Message Content",
        life: 3000,
      });
      emit("closeDialog", res.result);
    } catch (e) {
      console.log(e);
      toast.add({
        severity: "error",
        summary: "Error Message",
        detail: e.response.data.message,
        life: 3000,
      });
    }
  }
}


onMounted( function (){
  findUsers()
});

async function infoModalClose() {
  if (isModal.value || productsInfo.value?.length > 0) openInfoModal.value = true
  else emit('close-sidebar')
}

watch(createValues, (newVal) => {
  if (initialValue.value !== null) {
    isModal.value = true;
  }
  initialValue.value = newVal;
}, {deep: true});


onMounted(function (){
  findUsers()
})

</script>

<template>
  <div class="create-purchases">
    <div class="header">
      <div>
        <div class="header-title">Создания организация</div>
        <div class="header-text text-[#808BA0] font-semibold text-[16px]">

        </div>
      </div>
      <div class="flex gap-[16px]">
        <fin-button
            icon="pi pi-save"
            @click="saveFn"
            label="Сохранить"
            severity="success"
            class="p-button-lg"
        />
        <fin-button
            icon="pi pi-times"
            @click="infoModalClose"
            label="Отменить"
            severity="warning"
            class="p-button-lg"
        />
      </div>
    </div>
    <div class="form grid grid-cols-12 gap-[16px] mt-[30px]">
      <fin-input v-model="createValues.name" class="col-span-4" :error="v$.name.$error" placeholder="Наименование"/>
      <fin-input v-model="createValues.inn" class="col-span-4" :error="v$.inn.$error" placeholder="ИНН"/>
      <FloatLabel class="col-span-4" >
        <Dropdown
            v-model="createValues.director"
            :options="userList"
            :class="{ 'p-invalid': v$.director.$error }"
            @click="findUsers"
            :loading="loadingUser"
            optionLabel="name"
            class="w-full"
        />
        <label for="dd-city">Директор</label>
      </FloatLabel>
      <FloatLabel class="col-span-4" >
        <Dropdown
            v-model="createValues.chief_accountant"
            :options="userList"
            :class="{ 'p-invalid': v$.chief_accountant.$error }"
            @click="findUsers"
            :loading="loadingUser"
            optionLabel="name"
            class="w-full"
        />
        <label for="dd-city">Главный бухгалтер</label>
      </FloatLabel>
      <fin-input v-model="createValues.address" class="col-span-4"  placeholder="Адрес"/>
    </div>
  </div>

  <div class="text-[20px] font-[600] absolute bottom-[40px]">
    Автор: {{ userName.name }}
  </div>
  <Dialog
      v-model:visible="openInfoModal"
      :style="{ width: '424px' }"
      :modal="true"
  >
    <div class="font-semibold text-[20px] leading-6 text-center w-[80%] m-auto text-[#141C30]">
      Хотите сохранить измения?
    </div>
    <template #footer>
      <fin-button label="Подтвердить" class="w-full" severity="success" icon="pi pi-check" @click="saveFn"/>
      <fin-button
          label="Отменить"
          icon="pi pi-times"
          class="w-full"
          severity="warning"
          @click="emit('close-sidebar')"
      />
    </template>
  </Dialog>
</template>

<style lang="scss">
@import "@/assets/style/colors";

.create-purchases {

  .p-button-secondary {
    color: transparent !important;
    border-color: transparent !important;
  }

  .p-invalid {
    border: 1px solid #f2376f !important;
  }

  .p-select-option {
    width: 90% !important;
    margin: 0 15px !important;
    border-radius: 10px !important;
    font-weight: bold !important;
  }

  .p-focus {
    color: #fff !important;
  }

  .p-select-label {
    font-weight: bold !important;
  }

  .p-select-list-container {
    width: 100% !important;
  }

  .p-datepicker {
    border: none;
    border-radius: 10px;
    display: flex;
    align-items: center;

    &-input-icon-container {
      top: 15px !important;
    }
  }

  .p-button-secondary {
    color: $primary-color !important;
    border-color: $primary-color !important;
  }

  .p-inputtext {
    border-radius: 10px;
  }

  .p-inputtext:enabled:focus {
    border-color: $primary-color;
    border-radius: 10px;
  }
}

.p-inputtext:enabled:hover {
  border-color: transparent;
}

.p-inputtext:enabled:focus {
  border-color: #DCDFE3 !important;
}

.p-textarea:enabled:focus {
  border-color: $primary-color !important;
}

.header {
  display: flex;
  justify-content: space-between;

  &-title {
    font-family: Manrope, sans-serif;
    font-weight: 600;
    font-size: 20px;
    line-height: 20px;
    color: var(--fin-text-header);

    &-text {
      font-family: Manrope, sans-serif;
    }
  }
}
</style>
