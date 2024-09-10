<script setup>
import {reactive, ref, watch} from "vue";

import {useAxios} from "@/composable/useAxios.js";

import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";
import {useToast} from "primevue/usetoast";
import Dialog from "primevue/dialog";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';


const getResponseData = ref()
const weeks = reactive([
  {
    week_num: 0,
    week: 'пн',
    hour: 0
  },
  {
    week_num: 1,
    week: 'вт',
    hour: 0
  },
  {
    week_num: 2,
    week: 'ср',
    hour: 0
  },
  {
    week_num: 3,
    week: 'чт',
    hour: 0
  },
  {
    week_num: 4,
    week: 'пт',
    hour: 0
  },
  {
    week_num: 5,
    week: 'сб',
    hour: 0
  },
  {
    week_num: 6,
    week: 'вс',
    hour: 0
  }
]);

const emit = defineEmits(["closeDialog", 'close-sidebar']);

const toast = useToast();


const agreementList = ref([]);
const loadingAgreement = ref(false);
const productsInfo = ref();
const isCurrencyFetched = ref(false);
const openInfoModal = ref(false);
const initialValue = ref(null);
const isModal = ref(false)
const createValues = reactive({
  name: ""
});
const rules = reactive({
  name: {required},
});
const userName = {
  name: localStorage.getItem("user_name"),
};

const v$ = useVuelidate(rules, createValues);


async function saveFn() {
  const result = await v$.value.$validate();
  openInfoModal.value = false
  if (result) {
    try {
      const res = await useAxios(`/schedule`, {
        method: "POST",
        data: {

          name: createValues.name,
          data: getResponseData.value.map((item, index) => ({
            month_id: index + 1,
            number_of_hours: item.hours
          })),
          weeks: weeks.map(item => ({
            week: item.week_num,
            hour: Number(item.hour)
          }))
        }
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

async function calculate() {
  const result = await v$.value.$validate();
  openInfoModal.value = false
  if (result) {
    try {
      const res = await useAxios(`/calculateHours`, {
        method: "POST",
        data: {
          weeks: weeks.map(item => ({
            week: item.week_num,
            hour: Number(item.hour)
          }))
        }
      });
      getResponseData.value = res.result
      console.log('Response Data:', getResponseData.value);
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

</script>

<template>
  <div class="create-purchases">
    <div class="header">
      <div>
        <div class="header-title">Создание должности</div>
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
    <div class="form  gap-[16px] mt-[30px] w-full">
      <fin-input v-model="createValues.name" class="col-span-4 w-full" :error="v$.name.$error" placeholder="Наименование"/>
    </div>
    <div class="form grid grid-cols-7 gap-[16px] mt-[30px] w-full">
      <fin-input
          v-for="week in weeks"
          v-model="week.hour"
          min-width="10px"
          max-width="10px"
          placeholder=""
        type="number"
      />
    </div>
    <div class="flex justify-end gap-[16px] mt-[30px] w-full">
      <fin-button
          @click="calculate"
          label="Вычислить"
          severity="success"
          class="p-button-lg"
      />
    </div>
    <div class=" mt-10 border-4 rounded-xl  w-full   " >
      <DataTable scrollable scrollHeight="500px" :value="getResponseData" :paginator="true" :rows="12">
        <Column
            header="#"
            class="items-center w-[100px] h-[50px]"
        >
          <template #body="slotProps">
            {{ slotProps.index + 1 }}
          </template>
        </Column>
        <Column
            field="month"
            header="Месяц"
            class="items-center w-[300px] h-[50px]"
        ></Column>
        <Column
            header="Кол.Часов"
            class="items-center w-[70px] h-[50px]"
        >
          <template #body="slotProps">
            <fin-input placeholder="" v-model.number="slotProps.data.hours" class="w-[100px] h-full" />
          </template>
        </Column>
      </DataTable>
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
