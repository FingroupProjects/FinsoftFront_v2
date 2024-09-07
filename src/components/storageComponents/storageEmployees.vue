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
import moment from "moment/moment.js";

const props = defineProps({
  productId: {
    required: true,
  },
  data: Object
});

const showForm = ref(false)
const toast = useToast();

const getEmployeeList = ref([]);
const createValues = reactive({
  name: "",
  employee: "",
  from: "",
  to: ""
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
  employee: {required},
  from: {required},
  to: {required}
});
const v$ = useVuelidate(rules, createValues);


const clearInputValues = () => {
  createValues.name = ""
  createValues.employee = ""
  createValues.from = ""
  createValues.to = ""
};
const {
  findEmployee,
    employeeList,
    loadingEmployee

} = useStaticApi();

async function addStorageEmployee() {
  const result = await v$.value.$validate();
  console.log(result)
  if(!result) return
  try {
    const res = await useAxios(`/storage/add-employee/${props.productId}`, {
      method: "POST",
      data: {
            "employee_id": createValues.employee.code,
            "from": createValues.from,
            "to": createValues.to,
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
 findEmployee()
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
    getEmployeeList.value = item.counterpartyAgreement;
    console.log(item, getEmployeeList.value);
}
function toggleForm() {
  showForm.value = !showForm.value
}

onMounted(async () => {
  await getGood()
});

async function getAgreements() {
  try {
    const res = await useAxios(`/storage/get-employees-by-storage_id/${props.productId}`);
    console.log(res.result.data)
    return getEmployeeList.value = res.result.data
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
      <a @click="toggleForm">Сотрудники склада</a>
    </div>
  </div>


  <div v-show="showForm"  class="filter-form grid grid-cols-12 gap-[16px] pt-[21px] pb-[21px] mt-[21px]">
    <FloatLabel class="col-span-4">
      <DatePicker
          showIcon
          v-model="createValues.from"
          dateFormat="dd.mm.yy"
          :class="{ 'p-invalid': v$.from.$error }"
          iconDisplay="input"
          class="w-full"
      >
      </DatePicker>
      <label for="dd-city">От</label>
    </FloatLabel>
    <FloatLabel class="col-span-4">
      <DatePicker
          showIcon
          v-model="createValues.to"
          dateFormat="dd.mm.yy"
          :class="{ 'p-invalid': v$.to.$error }"
          iconDisplay="input"
          class="w-full"
      >
      </DatePicker>
      <label for="dd-city">До</label>
    </FloatLabel>

    <FloatLabel class="col-span-4">
      <Dropdown
          v-model="createValues.employee"
          :class="{ 'p-invalid': v$.employee.$error }"
          @click="findEmployee"
          :loading="loadingEmployee"
          :options="employeeList"
          optionLabel="name"
          class="w-full"
      >
        <template #value>
          {{ createValues.employee?.name }}
        </template>
      </Dropdown>
      <label for="dd-city">Сотрудник</label>
    </FloatLabel>
    <fin-button
        icon="pi pi-save"
        @click="addStorageEmployee"
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
        :value="getEmployeeList"
        tableStyle="min-width: 100%"
    >
      <Column field="name" header="">
        <template #header="{index}">
          <div class="w-full h-full" >
            От
          </div>
        </template>
        <template #body="slotProps">
          {{ moment(new Date(slotProps.data.from)).format(" D.MM.YYYY") }}
        </template>
      </Column>
      <Column field="name" header="">
        <template #header="{index}">
          <div class="w-full h-full" >
            До
          </div>
        </template>
        <template #body="slotProps">
          {{ moment(new Date(slotProps.data.to)).format(" D.MM.YYYY") }}
        </template>
      </Column>
      <Column field="image">
        <template #header="{index}">
          <div class="w-full h-full">
            Сотрудник
          </div>
        </template>
        <template #sorticon="{index}">
        </template>
        <template #body="slotProps">
          {{ slotProps.data.name }}
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