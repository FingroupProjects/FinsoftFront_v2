<script setup>
import {onMounted, reactive, ref} from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import formatInputAmount from "@/constants/formatInput.js";
import Dropdown from "primevue/dropdown";
import FloatLabel from "primevue/floatlabel";
import {useAxios} from "@/composable/useAxios.js";
import {useToast} from "primevue/usetoast";
import moment from "moment/moment.js";
import Tag from "primevue/tag";
import FinInput from "@/components/ui/Inputs.vue";
import {required} from "@vuelidate/validators";
import {useVuelidate} from "@vuelidate/core";

const props = defineProps({
  productId: {
    required: true,
  },
  data: Object
});

const toast = useToast();

const coleVo = ref("");
const selectUnit = ref();
const getCPList = ref([]);
const createValues = reactive({
  name: "",
  address: "",
  phone: "",
  email: ""
});
const rules = reactive({
  name: {required},
  phone: {required}
});
const v$ = useVuelidate(rules, createValues);


const clearInputValues = () => {
  selectUnit.value = {};
  coleVo.value = "";
};

async function addCpAgreement() {
  try {
    const res = await useAxios(`/cpAgreement`, {
      method: "POST",
      data: {
            "name": coleVo.value,
            "contract_number": selectUnit.value.code,
            "date": selectUnit.value.code,
            "organization_id": selectUnit.value.code,
            "counterparty_id": props.productId,
            "contact_person": coleVo.value,
            "currency_id": "das",
            "payment_id": "d",
            "comment": "fs",
            "price_type_id": "d"
      },
    });

    toast.add({
      severity: "success",
      summary: "Success Message",
      detail: "Message Content",
      life: 3000,
    });
    clearInputValues();
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


const confirmDelete = async (index) => {
  try {
    const res = await useAxios(`/counterparty/${index}`,{
      method: "DELETE",
    });
    toast.add({
      severity: "success",
      summary: "Success Message",
      detail: "Message Content",
      life: 3000,
    });
    await getAgreements()
  } catch (e) {
    console.log(e);
    toast.add({
      severity: "error",
      summary: "Error Message",
      detail: e.response.data.message,
      life: 3000,
    });
  }
};
async function getGood() {
  const item = props.data;
    getCPList.value = item.counterpartyAgreement;
    console.log(item, getCPList.value);
}

onMounted(async () => {
  await getGood()
});

async function getAgreements() {
  try {
    const res = await useAxios(`/cpAgreement/getAgreementByCounterpartyId/${props.productId}`);
    return getCPList.value = res
  } catch (e) {
    console.log(e);
  }
}



</script>

<template>
  <div class="flex items-center mt-[30px] gap-[21px]">
    <div class="header-title">Договоры контрагента</div>
  </div>
  <div class="filter-form grid grid-cols-12 gap-[16px] pt-[21px] pb-[21px] mt-[21px]">

    <div class="grid grid-cols-10 mt-[30px] gap-[26px]">
      <div class="form w-full col-span-12 grid grid-cols-12 gap-[16px] relative create-goods">
        <fin-input :class="{ 'p-invalid': v$.name.$error }" placeholder="Наименование" class="col-span-5" v-model="createValues.name"/>
        <fin-input  placeholder="Адрес" class="col-span-5" v-model="createValues.address"/>
        <fin-input :class="{ 'p-invalid': v$.phone.$error }" placeholder="Телефон" class="col-span-5" v-model="createValues.phone"/>
        <fin-input placeholder="Почта" class="col-span-5" v-model="createValues.email"/>
      </div>
    </div>
  </div>
  <div v-if="getCPList.length > 0" class="table-create dropdown-status">
    <DataTable
        scrollable
        scrollHeight="660px"
        dataKey="id"
        :value="getCPList"
        tableStyle="min-width: 100%"
    >

      <Column field="image">
        <template #header="{index}">
          <div class="w-full h-full">
            Наименование
          </div>
        </template>
        <template #sorticon="{index}">
        </template>
        <template #body="slotProps">
          {{ slotProps.data.name }}
        </template>
      </Column>
      <Column field="image">
        <template #header="{index}">
          <div class="w-full h-full">
            Контакная лицо
          </div>
        </template>
        <template #sorticon="{index}">
        </template>
        <template #body="slotProps">
          {{ slotProps.data.contact_person }}
        </template>
      </Column>
      <Column field="image">
        <template #header="{index}">
          <div class="w-full h-full">
              Номер телефона
          </div>
        </template>
        <template #sorticon="{index}">
        </template>
        <template #body="slotProps">
          {{ slotProps.data.contract_number }}
        </template>
      </Column>
      <Column field="image">
        <template #header="{index}">
          <div class="w-full h-full">
            Валюта
          </div>
        </template>
        <template #sorticon="{index}">
        </template>
        <template #body="slotProps">
          {{ slotProps?.data.currency?.name }}
        </template>
      </Column>
      <Column field="image">
        <template #header="{index}">
          <div class="w-full h-full">
            Валюта оплаты
          </div>
        </template>
        <template #sorticon="{index}">
        </template>
        <template #body="slotProps">
          {{ slotProps?.data.payment?.name }}
        </template>
      </Column>
      <Column field="image">
        <template #header="{index}">
          <div class="w-full h-full">
            Тип цены
          </div>
        </template>
        <template #sorticon="{index}">
        </template>
        <template #body="slotProps">
          {{ slotProps?.data.price_type?.name }}
        </template>
      </Column>
    </DataTable>
  </div>
</template>
<style lang="scss">
.table-create {
  .p-datatable-header-cell {
    background: #f6f6f6;
  }

  .p-select-label {
    margin-top: 5px;
  }
}

.dropdown-status {
  .p-select {
    border-radius: 10px;
  }
  .p-datatable-header-cell {
    background: #f6f6f6 !important;
  }

  .p-datatable-row-editor-init {
    right: 40px;
  }

  .p-datatable-table-container::-webkit-scrollbar {
    width: 4px !important;
    height: 3px !important;
  }

  .p-datatable-table-container::-webkit-scrollbar-track {
    background-color: #f1f1f1 !important;
    height: 3px !important;
  }

  .p-datatable-table-container::-webkit-scrollbar-thumb {
    background-color: #3935E7 !important;
    border-radius: 6px !important;
    height: 3px !important;
  }

  .p-datatable-table-container::-webkit-scrollbar-thumb:hover {
    background-color: #3935E7;
    height: 3px !important;
  }
}
</style>

<style scoped lang="scss">
.filter-form {
  border-top: 1px dashed #dcdfe3;
  border-bottom: 1px dashed #dcdfe3;
}
</style>