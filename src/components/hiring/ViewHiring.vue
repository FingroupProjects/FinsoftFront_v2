<script setup>
import {onMounted, reactive, ref, watch, watchEffect} from 'vue';
import {useAxios} from "@/composable/useAxios.js";
import {useStaticApi} from "@/composable/useStaticApi.js";
import {useToast} from "primevue/usetoast";
import {useVuelidate} from "@vuelidate/core";
import moment from "moment";
import FloatLabel from "primevue/floatlabel";
import Textarea from "primevue/textarea";
import DatePicker from "primevue/datepicker";
import Dialog from "primevue/dialog";
import {usePurchaseStore} from "@/store/pruchase.js";
import Dropdown from "primevue/dropdown";
import {required} from "@vuelidate/validators";
import FinInput from "@/components/ui/Inputs.vue";

const emit = defineEmits(['close-sidebar', 'editSave']);
const props = defineProps({
  productId: {
    required: true,
  },
  openModalClose: {
    type: Boolean,
    default: false
  },
  data: Object
});

const store = usePurchaseStore()

const status = ref('');
const productsInfo = ref();
const toast = useToast();

const approved = ref(false);
const isOpen = ref(false);
const isCurrencyFetched = ref(false);
const openInfoModal = ref(false);
const agreementList = ref([]);
const changeValue = ref(false);
const initialValue = ref(null);
const loaderSave = ref(false)
const createValues = reactive({
  datetime24h: new Date,
  comment: "",
  position: "",
  department: "",
  salary: "",
  schedule: "",
  basis: "",
  hiring_date: new Date,
  employee: "",
  organization: "",
  doc_number: ""

});
const rules = reactive({
  datetime24h: {required},
  position: {required},
  employee: {required},
  department: {required},
  salary: {required},
  schedule: {required},
  basis: {required},
  hiring_date: {required},
  organization: {required}
});

const v$ = useVuelidate(rules, createValues);

const {
  findOrganization,
  organization,
  loadingOrganization,
  findDepartment,
  departments,
  loadDepartment,
  findPosition,
  positions,
  loadPositions,
  findEmployee,
  employeeList,
  loadingEmployee,
  findSchedule,
  schedules,
  loadSchedule
} = useStaticApi();

const userName = {
  name: localStorage.getItem("user_name"),
};
const organizationJson = localStorage.getItem('organization');
const organizationHas = JSON.parse(organizationJson);
const hasOrganization = JSON.parse(localStorage.getItem('hasOneOrganization'));


const getView = async () => {
  const item = props.data;

  createValues.organization = item.organization;
  createValues.employee = item.employee;
  createValues.salary = item.salary;
  createValues.hiring_date = new Date(item.hiring_date);
  createValues.author = item.author;
  createValues.department = item.department;
  createValues.basis = item.basis;
  createValues.position = item.position;
  createValues.schedule = item.schedule;
  createValues.datetime24h = new Date(item.date);
  createValues.doc_number = item.doc_number;

  console.log(createValues);
};


const updateView = async () => {
  const result = await v$.value.$validate();
  openInfoModal.value = false
  changeValue.value = false
  if (result) {
    loaderSave.value = true
    try {
      const data = {
        organization_id: createValues.organization?.id || createValues.organization?.code,
        employee_id: createValues.employee?.id || createValues.employee?.code,
        salary: createValues.salary,
        date: moment(createValues.date).format('YYYY-MM-DD '),
        hiring_date: moment(createValues.hiring_date).format('YYYY-MM-DD '),
        department_id: createValues.department?.id || createValues.department?.code,
        position_id: createValues.position?.id || createValues.position?.code,
        schedule_id: createValues.schedule?.id || createValues.schedule?.code,
        basis: createValues.basis,
      };

      const res = await useAxios(`/hiring/${props.productId}`, {
        method: 'PATCH',
        data: data
      });
        toast.add({severity: 'success', summary: 'Обновлено!', detail: 'Документ успешно обновлен!', life: 1500});
    } catch (e) {
      console.error(e);
      toast.add({severity: 'error', summary: 'Ошибка!', detail: 'Не удалось обновить документ!', life: 1500});
    } finally {
      loaderSave.value = false
      store.postGoods = []
    }
  }
};


function infoModalClose() {
  if (changeValue.value) openInfoModal.value = true
  else emit('close-sidebar')
}

function changeModal() {
  changeValue.value = true
}

async function saveFnDialog() {
  //await updateView()
  emit('close-sidebar')
}


watch(productsInfo, (newVal) => {
  if (initialValue.value !== null) {
    changeValue.value = true;
  }
  initialValue.value = newVal;
}, {deep: true});

onMounted(function () {
  getView(),
      findOrganization(),
      findDepartment(),
      findPosition(),
      findSchedule(),
      findEmployee()
})

</script>
<template>
  <button class="w-[24px] h-[30px] bg-[#fff] rounded-close-btn" @click="infoModalClose"><i
      class="pi pi-times text-[#808BA0]"></i></button>
  <div>
    <div class="edit-purchase">
      <Toast/>
      <div class="header">
        <div class="flex gap-[16px] pt-2">
          <div>
            <div class="header-title">Просмотр №{{
                createValues.doc_number
              }}   </div>
            <div class="header-text text-[#808BA0] font-semibold mt-1.5 text-[12px]">
            </div>
          </div>

          <fin-button icon="pi pi-save" @click="updateView()" label="Сохранить" :loading="loaderSave" severity="success"
                      class="p-button-lg"/>
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
          >
          <label for="dd-city">Организация</label>
            <template #value>
              {{ createValues.organization?.name }}
            </template>
          </Dropdown>
        </FloatLabel>
        <FloatLabel class="col-span-4">
          <Dropdown
              v-model="createValues.employee"
              :options="employeeList"
              :class="{ 'p-invalid': v$.employee.$error }"
              :loading="loadingEmployee"
              optionLabel="name"
              class="w-full"
          >
          <label for="dd-city">Сотрудник</label>
            <template #value>
              {{ createValues.employee?.name }}
            </template>
          </Dropdown>
        </FloatLabel>
        <FloatLabel class="col-span-4">
          <Dropdown
              v-model="createValues.department"
              :class="{ 'p-invalid': v$.department.$error }"
              :options="departments"
              :loading="loadDepartment"
              optionLabel="name"
              class="w-full"
          >
          <label for="dd-city">Отдел</label>
          <template #value>
            {{ createValues.department?.name }}
          </template>
          </Dropdown>
        </FloatLabel>
        <FloatLabel class="col-span-4">
          <Dropdown
              v-model="createValues.position"
              :class="{ 'p-invalid': v$.position.$error }"
              :loading="loadPositions"
              :options="positions"
              optionLabel="name"
              class="w-full"
          >
            <template #value>{{ createValues.position?.name }}</template>
          </Dropdown>
          <label for="dd-city">Должность</label>
        </FloatLabel>
        <FloatLabel class="col-span-4">
          <DatePicker
              showIcon
              v-model="createValues.hiring_date"
              :class="{ 'p-invalid': v$.hiring_date.$error }"
              dateFormat="dd.mm.yy"
              fluid
              hideOnDateTimeSelect
              iconDisplay="input"
              class="w-full"
          />
          <label for="dd-city">Дата приема</label>
        </FloatLabel>
        <FloatLabel class="col-span-4">
          <Dropdown
              v-model="createValues.schedule"
              :class="{ 'p-invalid': v$.schedule.$error }"
              :loading="loadSchedule"
              :options="schedules"
              optionLabel="name"
              class="w-full"
          >
          <label for="dd-city">График</label>
          <template #value>
            {{ createValues.schedule?.name }}
          </template>
          </Dropdown>
        </FloatLabel>
        <fin-input class="col-span-4" placeholder="Оклад" v-model="createValues.salary"/>

        <FloatLabel class="col-span-12 mt-[10px]">
          <Textarea :class="{ 'p-invalid': v$.schedule.$error }" v-model="createValues.basis" class="w-full"
                    style="min-height: 20px" rows="8" cols="20"/>
          <label for="dd-city">Основание</label>
        </FloatLabel>
      </div>
    </div>
    <div class="text-[20px] font-[600] absolute bottom-[40px]">
      Автор: {{ userName.name }}
    </div>
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
      <fin-button label="Подтвердить" class="w-full" :loading="loaderSave" severity="success" icon="pi pi-check"
                  @click="saveFnDialog"/>
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
.p-dialog-close-button {
  position: absolute !important;
  right: 0;
}

.rounded-close-btn {
  border-radius: 8px 0 0 8px;
  position: absolute;
  left: -15px;
  z-index: 3333;
}

.view-doc {
  .p-select-option .p-focus {
    background-color: #3935E7 !important;
    color: white !important;
  }

  .p-select-open {
    border-color: #3935E7 !important;
  }

  .p-select-option:hover {
    background-color: #ededed !important;
  }

  .p-inputwrapper-focus {
    border-color: #3935E7 !important;
  }

  .p-datepicker-input {
    border: 0;
  }

  .p-select:hover {
    border-color: #3935E7 !important;
  }
}

.icon-history {
  margin-left: 780px !important;
  background-color: white !important;
  color: #3935E7 !important;
  border: 1px solid #DCDFE3 !important;
  width: 160px !important;
  height: 31px !important;
}

.icon-print {
  background-color: white !important;
  color: #3935E7 !important;
  border: 1px solid #DCDFE3 !important;
  width: 150px !important;
  height: 31px !important;
}

.edit-purchase {
  .p-select {
    border-color: #DCDFE3;
    border-radius: 10px !important;
    box-shadow: none !important;
    height: 46px;
    align-items: center;
  }

  .p-inputtext {
    border: 1px solid #DCDFE3;
    border-radius: 10px !important;
  }

  .btn-movement {
    font-weight: bold !important;
    font-size: 16px !important;
    width: 138px !important;
    height: 46px !important;
    gap: 10px !important;
  }

  .btn-movement:hover {
    color: #3935E7 !important;
  }

  .btn-approve:hover {
    color: #17A825 !important;
    border-color: #17A825 !important;
    font-weight: bold !important;
    background-color: #fff !important;
  }

  .btn-approve .p-button-label {
    font-weight: 600;
  }

  .btn-un-approve .p-button-label {
    font-weight: 600;
  }

  .btn-un-approve {
    color: #C1790C !important;
    border-color: #C1790C !important;
    font-weight: bold !important;
    background-color: #fff !important;
  }

  .active-approve {
    background-color: #fff !important;
  }
}

.drower-movement {
  width: 850px !important;
  border-top-left-radius: 30px;
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
  }

  &-text {
    font-family: Manrope, sans-serif;
  }
}

.filter-form {
  border-top: 1px dashed #DCDFE3;
  border-bottom: 1px dashed #DCDFE3;
}
</style>
