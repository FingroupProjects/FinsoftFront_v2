<script setup>
import {onMounted, reactive, ref} from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import formatInputAmount from "@/constants/formatInput.js";
import Select from "primevue/select";
import FloatLabel from "primevue/floatlabel";
import {useAxios} from "@/composable/useAxios.js";
import {useToast} from "primevue/usetoast";
import Tag from "primevue/tag";
import FinInput from "@/components/ui/Inputs.vue";
import {required} from "@vuelidate/validators";
import {useVuelidate} from "@vuelidate/core";
import {useStaticApi} from "@/composable/useStaticApi.js";
import DatePicker from "primevue/datepicker";
import InputText from "primevue/inputtext";

const props = defineProps({
  productId: {
    required: true,
  },
  data: Object
});

const selectedCurrency = ref(null);
const selectedPayment = ref(null);
const selectedPriceType = ref(null);
const editingRows = ref([]);
const showForm = ref(false)
const toast = useToast();

const getCPList = ref([]);
const createValuess = reactive({
  id:"",
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

const onRowEditSave = async (editedRowData) => {
  try {
    await updateCpAgreement(editedRowData);
    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Agreement updated successfully",
      life: 3000
    });
  } catch (error) {
    console.error("Update failed:", error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Failed to update agreement",
      life: 3000
    });
  }
};


const ruless = reactive({
  name: {required},
  currency: {required},
  payment: {required},
  priceType: {required},
  date: {required},
  contact_number: {required},
  contract_person: {required}
});
const v$ = useVuelidate(ruless, createValuess);


const clearInputValues = () => {
  createValuess.date = ""
  createValuess.name = ""
  createValuess.comment = ""
  createValuess.organization = ""
  createValuess.contact_number = ""
  createValuess.contract_person = ""
  createValuess.currency = ""
  createValuess.payment = ""
  createValuess.priceType = ""
};
const {
  findOrganization,
  organization,
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
            "name": createValuess.name,
            "contract_number": createValuess.contact_number,
            "date": createValuess.date,
            "organization_id": createValuess.organization.code,
            "counterparty_id": props.productId,
            "contact_person": createValuess.contract_person,
            "currency_id": createValuess.currency.code,
            "payment_id": createValuess.payment.code,
            "comment": createValuess.comment,
            "price_type_id": createValuess.priceType.code
      },
    });
    clearInputValues()
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


async function updateCpAgreement(agreementToUpdate) {
  const result = await v$.value.$validate();
  console.log('num', agreementToUpdate.newData.contract_number)

  try {
    if (!agreementToUpdate) {
      console.error('No agreement specified for update');
      return;
    }

    const res = await useAxios(`/cpAgreement/${agreementToUpdate.data.id}`, {
      method: "PATCH",
      data: {
        comment: agreementToUpdate.comment,
        contact_person: agreementToUpdate.newData.contact_person,
        contract_number: agreementToUpdate.newData.contract_number,
        currency_id: agreementToUpdate.newData.currency?.id,
        counterparty_id: agreementToUpdate.newData.counterparty?.id,
        organization_id: agreementToUpdate.newData.organization?.id,
        date: agreementToUpdate.newData.date,
        name: agreementToUpdate.newData.name,
        payment_id: agreementToUpdate.newData.payment?.id,
        price_type_id: agreementToUpdate.newData.price_type.id
      }
    });

    console.log('Update response:', res);
    getAgreements()
  } catch (e) {
    console.error('Error updating agreement:', e);
  }
}



function updateCurrencyName(data, value) {
  data.currency.name = value.name;
  data.currency = { ...data.currency, name: value.name };
  data.currency.id = value.code;
}
function updatePaymentName(data, value) {
  if (!data.payment) {
    data.payment = {};
  }
  data.payment.name = value?.name || '';
  data.payment.id = value?.code || '';
}
function updatePriceTypeName(data, value) {
  data.price_type.name = value.name;
  data.price_type = { ...data.price_type, name: value.name };
  data.price_type.id = value.code;
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

}
function toggleForm() {
  showForm.value = !showForm.value
}

onMounted(async () => {
  await getGood()
  await getAgreements()

});

async function getAgreements() {
  try {
    const res = await useAxios(`/cpAgreement/getAgreementByCounterpartyId/${props.productId}`);
    console.log('result', getCPList.value)
    return getCPList.value = res.result.data
  } catch (e) {
    console.log(e);
  }
}

</script>

<template>
  <div class="flex items-center mt-[30px] gap-[21px] mb-3">
    <div
        class="header-title font-bold"
        :class="{ 'text-blue-500 cursor-pointer': !showForm }"
    >
      <a @click="toggleForm">Договоры контрагента</a>
    </div>
  </div>


  <div v-show="showForm"  class="filter-form grid grid-cols-12 gap-[16px] pt-[21px] pb-[21px] mt-[21px]">
    <FloatLabel class="col-span-4">
      <DatePicker
          showIcon
          v-model="createValuess.date"
          dateFormat="dd.mm.yy"
          :class="{ 'p-invalid': v$.date.$error}"
          iconDisplay="input"
          class="w-full"
      >
      </DatePicker>

      <label for="dd-city">Дата</label>
    </FloatLabel>
        <fin-input :class="{ 'p-invalid': v$.name.$error}" placeholder="Наименование" class="col-span-4" v-model="createValuess.name"/>
        <fin-input :class="{ 'p-invalid': v$.contract_person.$error }" placeholder="Контакная лицо" class="col-span-4" v-model="createValuess.contract_person"/>
        <fin-input :class="{ 'p-invalid': v$.contact_number.$error }" placeholder="Номер контракта" class="col-span-4" v-model="createValuess.contact_number"/>
    <FloatLabel class="col-span-4">
      <Select
          v-model="createValuess.organization"
          :class="{ 'p-invalid': v$.currency.$error}"
          @click="findOrganization"
          :loading="loading"
          :options="organization"
          optionLabel="name"
          class="w-full"
      >
        <template #value>
          {{ createValuess.organization?.name }}
        </template>
      </Select>
      <label for="dd-city">Организация</label>
    </FloatLabel>
    <FloatLabel class="col-span-4">
      <Select
          v-model="createValuess.currency"
          :class="{ 'p-invalid': v$.currency.$error}"
          @click="findCurrency"
          :loading="loading"
          :options="currency"
          optionLabel="name"
          class="w-full"
      >
        <template #value>
          {{ createValuess.currency?.name }}
        </template>
      </Select>
      <label for="dd-city">Валюта</label>
    </FloatLabel>
    <FloatLabel class="col-span-4">
      <Select
          v-model="createValuess.payment"
          :class="{ 'p-invalid': v$.payment.$error}"
          @click="findCurrency"
          :loading="loading"
          :options="currency"
          optionLabel="name"
          class="w-full"
      >
        <template #value>
          {{ createValuess.payment?.name }}
        </template>
      </Select>
      <label for="dd-city">Валюта оплаты</label>
    </FloatLabel>
    <FloatLabel class="col-span-4">
      <Select
          v-model="createValuess.priceType"
          :class="{ 'p-invalid': v$.priceType.$error}"
          @click="findPriceType"
          :loading="loadPriceType"
          :options="priceTypes"
          optionLabel="name"
          class="w-full"
      >
        <template #value>
          {{ createValuess.priceType?.name }}
        </template>
      </Select>
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

  <div class="table-create Select-status">
    <DataTable
        :value="getCPList"
        scrollable
        scrollHeight="660px"
        v-model:editingRows="editingRows"
        @row-edit-save="onRowEditSave"
        editMode="row"
        tableStyle="min-width: 100%"
        dataKey="id"
    >
      <!-- Наименование -->
      <Column field="name" header="Наименование">
        <template #editor="{ data, field }">
          <input-text v-model="data[field]"  fluid style="width: 90px !important;" />
        </template>
      </Column>

      <!-- Контакная лицо (already defined) -->
      <Column field="contact_person" header="Контакная лицо">
        <template #editor="{ data, field }">
          <input-text v-model="data[field]"  fluid />
        </template>
      </Column>

      <!-- Номер контракта -->
      <Column field="contract_number" header="Номер контракта">
        <template #editor="{ data, field }">
          <input-text style="width: 110px !important;" v-model="data[field]" type="number" :model-value="formatInputAmount(data[field])" fluid />
        </template>
      </Column>

      <!-- Валюта -->
      <Column field="currency" header="Валюта">
        <template #editor="{ data }">
          <FloatLabel class="col-span-4">
            <Select
                v-model="selectedCurrency"
                :options="currency"
                optionLabel="name"
                class="w-[110px]"
                @update:modelValue="(value) => updateCurrencyName(data, value)"
            >
              <template #value>
                {{data.currency.name}}
              </template>
            </Select>
          </FloatLabel>
        </template>
        <template #body="slotProps">
          {{ slotProps.data.currency.name }}
        </template>
      </Column>


      <!-- Валюта оплаты -->
      <Column field="currency" header="Валюта оплаты">
        <template #editor="{ data }">
          <FloatLabel class="col-span-4">
            <Select
                v-model="selectedPayment"
                :options="currency"
                optionLabel="name"
                class="w-[110px]"
                @click="findCurrency"
                @update:modelValue="(value) => updatePaymentName(data, value)"
            >
              <template #value>
                {{data.payment.name}}
              </template>
            </Select>
          </FloatLabel>
        </template>
        <template #body="slotProps">
          {{ slotProps.data.payment?.name }}
        </template>
      </Column>

      <!-- Тип цены -->
      <Column field="priceType" header="Тип цены">
        <template #editor="{ data }">
          <FloatLabel class="col-span-4">
            <Select
                v-model="selectedPriceType"
                :options="priceTypes"
                optionLabel="name"
                class="w-[130px]"
                @click="findPriceType"
                @update:modelValue="(value) => updatePriceTypeName(data, value)"
            >
              <template #value>
                {{data.price_type.name}}
              </template>
            </Select>
          </FloatLabel>
        </template>
        <template #body="slotProps">
          {{ slotProps.data.price_type.name }}
        </template>
      </Column>

      <!-- Статус -->
      <Column field="status" header="Статус">
        <template #body="slotProps">
          <Tag
              :value="getSeverity(slotProps.data?.deleted_at).name"
              :severity="getSeverity(slotProps.data?.deleted_at).status"
          />
        </template>
      </Column>

      <!-- Actions (Delete Icon) -->
      <Column field="quantity" header="">
        <template #body="{ data }">
          <i
              @click="confirmDelete(data.id)"
              class="pi pi-trash text-[#808BA0] cursor-pointer"
          ></i>
        </template>
      </Column>
      <Column :rowEditor="true"
              style="width: 0; min-width: 7rem;"
              bodyStyle="text-align:center">
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

.Select-status {
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