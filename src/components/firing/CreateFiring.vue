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
import FloatLabel from "primevue/floatlabel";
import Textarea from 'primevue/textarea';
import Dialog from "primevue/dialog";
import FinInput from "@/components/ui/Inputs.vue";

const emit = defineEmits(["closeDialog", 'close-sidebar']);

const toast = useToast();

const {
  findOrganization,
  organization,
  loadingOrganization,

  findEmployee,
  employeeList,
  loadingEmployee,

} = useStaticApi();

const agreementList = ref([]);
const loadingAgreement = ref(false);
const productsInfo = ref();
const isCurrencyFetched = ref(false);
const openInfoModal = ref(false);
const initialValue = ref(null);
const isModal = ref(false)
const createValues = reactive({
  datetime24h: new Date,
  comment: "",
  basis: "",
  firing_date: new Date,
  employee: "",
  organization: ""

});
const rules = reactive({
  datetime24h: {required},
  employee: {required},
  basis: {required},
  firing_date: {required},
  organization: {required}
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
      const res = await useAxios(`firing`, {
        method: "POST",
        data: {
          date: moment(createValues.datetime24h).format("YYYY-MM-DD "),
          organization_id: createValues.organization.code,
          firing_date: createValues.firing_date,
          basis: createValues.basis,
          employee_id: createValues.employee.code
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

function getProducts(products) {
  productsInfo.value = products;
}

onMounted(async () => {
  try {
    await Promise.all([
      findOrganization(),
      findEmployee()
    ]);
  } catch (error) {
    console.error('Error:', error);
  }
});

async function infoModalClose() {
  if (isModal.value || productsInfo.value?.length > 0) openInfoModal.value = true
  else emit('close-sidebar')
}

watch(createValues, (newVal) => {
  if (initialValue.value !== null) {
    // This will only execute after the initial value is set
    isModal.value = true;
  }
  initialValue.value = newVal;
}, {deep: true});


</script>

<template>
  <div class="create-purchases">
    <div class="header">
      <div>
        <div class="header-title">Увольнение</div>

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
      <FloatLabel class="col-span-4">
        <DatePicker
            showIcon
            v-model="createValues.datetime24h"
            :class="{ 'p-invalid': v$.datetime24h.$error }"
            dateFormat="dd.mm.yy"
            fluid
            hideOnDateTimeSelect
            iconDisplay="input"
            class="w-full"
        />
        <label for="dd-city">Дата</label>
      </FloatLabel>

      <FloatLabel class="col-span-4" v-if="!hasOrganization">
        <Dropdown
            v-model="createValues.organization"
            :options="organization"
            :class="{ 'p-invalid': v$.organization.$error }"
            :loading="loadingOrganization"
            optionLabel="name"
            class="w-full"
        />
        <label for="dd-city">Организация</label>
      </FloatLabel>
      <FloatLabel class="col-span-4">
        <Dropdown
            v-model="createValues.employee"
            :options="employeeList"
            :class="{ 'p-invalid': v$.employee.$error }"
            :loading="loadingEmployee"
            optionLabel="name"
            class="w-full"
        />
        <label for="dd-city">Сотрудник</label>
      </FloatLabel>

      <FloatLabel class="col-span-4">
        <DatePicker
            showIcon
            v-model="createValues.firing_date"
            :class="{ 'p-invalid': v$.firing_date.$error }"
            dateFormat="dd.mm.yy"
            fluid
            hideOnDateTimeSelect
            iconDisplay="input"
            class="w-full"
        />
        <label for="dd-city">Дата увольнения</label>
      </FloatLabel>

      <FloatLabel class="col-span-12 mt-[10px]">
        <Textarea :class="{ 'p-invalid': v$.basis.$error }" v-model="createValues.basis" class="w-full" style="min-height: 20px" rows="8" cols="20"/>
        <label for="dd-city">Основание</label>
      </FloatLabel>
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
