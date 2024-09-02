<script setup>
import {onMounted, reactive, ref} from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import formatInputAmount from "@/constants/formatInput.js";
import Dropdown from "primevue/dropdown";
import FloatLabel from "primevue/floatlabel";
import {useAxios} from "@/composable/useAxios.js";
import {useToast} from "primevue/usetoast";
import Tag from "primevue/tag";
import FinInput from "@/components/ui/Inputs.vue";
import {required} from "@vuelidate/validators";
import {useVuelidate} from "@vuelidate/core";
import {useStaticApi} from "@/composable/useStaticApi.js";
import DatePicker from "primevue/datepicker";

const props = defineProps({
  productId: {
    required: true,
  },
  data: Object
});

const toast = useToast();

const getCPList = ref([]);
const createValues = reactive({
  name: "",
  date: "",
  comment: "",
  organization: "",
  contact_number: "",
  contract_person: "",
  currency: "",
  payment: "",
  priceType: ""
});
const getSeverity = (status) => {
  if (status == null) {
    return {
      status: "success",
      name: "Активный",
    };
  } else {
    return {
      status: "warn",
      name: "Не активный",
    };
  }
};

const rules = reactive({
  name: {required},
  currency: {required},
  payment: {required},
  priceType: {required},
  date: {required},
  contact_number: {required},
  contract_person: {required}
});
const v$ = useVuelidate(rules, createValues);


const clearInputValues = () => {
  createValues.date = ""
  createValues.name = ""
  createValues.comment = ""
  createValues.organization = ""
  createValues.contact_number = ""
  createValues.contract_person = ""
  createValues.currency = ""
  createValues.payment = ""
  createValues.priceType = ""
};
const {
  findOrganization,
  organization,
  loadingOrganization,
  findCurrency,
  currency,
  loading,
    findPriceType,
    loadPriceType,
    priceTypes

} = useStaticApi();

async function addCpAgreement() {
  const result = await v$.value.$validate();
  console.log(result)
  if(!result) return
  try {
    const res = await useAxios(`/cpAgreement`, {
      method: "POST",
      data: {
            "name": createValues.name,
            "contract_number": createValues.contact_number,
            "date": createValues.date,
            "organization_id": createValues.organization.code,
            "counterparty_id": props.productId,
            "contact_person": createValues.contract_person,
            "currency_id": createValues.currency.code,
            "payment_id": createValues.payment.code,
            "comment": createValues.comment,
            "price_type_id": createValues.priceType.code
      },
    });
    clearInputValues();
    toast.add({
      severity: "success",
      summary: "Success Message",
      detail: "Message Content",
      life: 3000,
    });

    getAgreements()
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

onMounted(function (){
  findCurrency()
  findOrganization()
  findPriceType()
});
const confirmDelete = async (index) => {
  try {
    const res = await useAxios(`/cpAgreement/massDelete`,{
      method: "POST",
      data: {
        ids: [index],
      },
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
    return getCPList.value = res.result.data
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
    <FloatLabel class="col-span-4">
      <DatePicker
          showIcon
          v-model="createValues.date"
          dateFormat="dd.mm.yy"
          :class="{ 'p-invalid': v$.date.$error }"
          iconDisplay="input"
          class="w-full"
      >
      </DatePicker>
      <label for="dd-city">Дата</label>
    </FloatLabel>
        <fin-input :class="{ 'p-invalid': v$.name.$error }" placeholder="Наименование" class="col-span-4" v-model="createValues.name"/>
        <fin-input :class="{ 'p-invalid': v$.contract_person.$error }" placeholder="Контакная лицо" class="col-span-4" v-model="createValues.contract_person"/>
        <fin-input :class="{ 'p-invalid': v$.contact_number.$error }" placeholder="Номер контракта" class="col-span-4" v-model="createValues.contact_number"/>
    <FloatLabel class="col-span-4">
      <Dropdown
          v-model="createValues.organization"
          :class="{ 'p-invalid': v$.currency.$error }"
          @click="findOrganization"
          :loading="loading"
          :options="organization"
          optionLabel="name"
          class="w-full"
      >
        <template #value>
          {{ createValues.organization?.name }}
        </template>
      </Dropdown>
      <label for="dd-city">Организация</label>
    </FloatLabel>
    <FloatLabel class="col-span-4">
      <Dropdown
          v-model="createValues.currency"
          :class="{ 'p-invalid': v$.currency.$error }"
          @click="findCurrency"
          :loading="loading"
          :options="currency"
          optionLabel="name"
          class="w-full"
      >
        <template #value>
          {{ createValues.currency?.name }}
        </template>
      </Dropdown>
      <label for="dd-city">Валюта</label>
    </FloatLabel>
    <FloatLabel class="col-span-4">
      <Dropdown
          v-model="createValues.payment"
          :class="{ 'p-invalid': v$.payment.$error }"
          @click="findCurrency"
          :loading="loading"
          :options="currency"
          optionLabel="name"
          class="w-full"
      >
        <template #value>
          {{ createValues.payment?.name }}
        </template>
      </Dropdown>
      <label for="dd-city">Валюта</label>
    </FloatLabel>
    <FloatLabel class="col-span-4">
      <Dropdown
          v-model="createValues.priceType"
          :class="{ 'p-invalid': v$.priceType.$error }"
          @click="findPriceType"
          :loading="loadPriceType"
          :options="priceTypes"
          optionLabel="name"
          class="w-full"
      >
        <template #value>
          {{ createValues.priceType?.name }}
        </template>
      </Dropdown>
      <label for="dd-city">Тип цены</label>
    </FloatLabel>
    <fin-button
        icon="pi pi-save"
        @click="addCpAgreement"
        label="Добавить"
        severity="success"
        class="p-button-lg"
    />

  </div>
  <div  class="table-create dropdown-status">
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
              Номер контракта
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
      <Column field="status" :sortable="true" header="">
        <template #header="{index}">
          <div class="w-full h-full" >
            Статус
          </div>
        </template>
        <template #sorticon="">
        </template>
        <template #body="slotProps">
          <Tag
              :value="getSeverity(slotProps.data?.deleted_at).name"
              :severity="getSeverity(slotProps.data?.deleted_at).status"
          />
        </template>
      </Column>
      <Column field="quantity" header="">
        <template #body="{ data }">
          <i
              @click="confirmDelete(data.id)"
              class="pi pi-trash text-[#808BA0] cursor-pointer"
          ></i>
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
.p-invalid {
  border: 1px solid #f2376f !important;
}

</style>

<style scoped lang="scss">
.filter-form {
  border-top: 1px dashed #dcdfe3;
  border-bottom: 1px dashed #dcdfe3;
}
</style>