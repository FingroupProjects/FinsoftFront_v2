<script setup>
import DatePicker from "primevue/datepicker";
import Dropdown from "primevue/dropdown";
import FloatLabel from "primevue/floatlabel";
import { onMounted, reactive, ref, watch, defineEmits, defineProps  } from "vue";
import { useAxios } from "@/composable/useAxios.js";
import {useStaticApi} from "@/composable/useStaticApi.js";

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
  loadSchedule,
  findUsers,
    userList,
    loadingUser
} = useStaticApi();


const clearFilters = () => {
  Object.keys(filterValues).forEach(key => filterValues[key] = '');
  emit('clearFilter', filterValues);
};
onMounted(async () => {
  try {
    await Promise.all([
      findOrganization(),
      findDepartment(),
      findPosition(),
      findSchedule(),
      findEmployee()
    ]);
  } catch (error) {
    console.error('Error:', error);
  }
});
const deleted = ref([
  { label: 'Да', value: 1},
  { label: 'Нет', value: 0 },
]);

const status = ref([
  { label: 'Проведен', value: 1 },
  { label: 'Не проведен', value: 0 },
]);

const filterValues = reactive({
  organization_id: '',
  author_id: '',
  deleted: '',
  department_id: '',
  position_id: '',
  employee_id: '',
  schedule_id: ''
});



const emit = defineEmits(['updateFilters', 'clearFilter']);
const props = defineProps(['savedFilters']);
const applyFilters = () => {
  emit('updateFilters', filterValues);
};


onMounted(() => {

  console.log('logg',filterValues)
  Object.assign(filterValues, props.savedFilters);

});
</script>

<template>
  <div class="filters-purchase ml-5">
    <div class="text-black text-[20px] font-semibold ">Фильтры</div>

    <Dropdown class="mt-[22px] w-[466px] font-semibold"
        v-model="filterValues.organization_id"
        placeholder="Организация"
        :options="organization"
        option-label="name"
    />
    <div class="flex mt-[22px] gap-4">
      <Dropdown class="w-[225px] font-semibold" placeholder="Удален"
                v-model="filterValues.deleted"
                :options="deleted"
                option-label="label"
                option-value="value"
      />

      <Dropdown class="w-[225px] font-semibold"
                v-model="filterValues.department_id"
                placeholder="Отдел"
                :options="departments"
                option-label="name"
      />
    </div>
    <div class="flex mt-[22px] gap-4">
      <Dropdown class="w-[225px] font-semibold" placeholder="Должность"
                v-model="filterValues.position_id"
                :options="positions"
                option-label="name"
                :loading="loadingEmployee"
      />

      <Dropdown class="w-[225px] font-semibold" placeholder="Должность"
                v-model="filterValues.employee_id"
                :options="employeeList"
                :loading="loadingEmployee"
                optionLabel="name"
      />
    </div>
    <div class="flex mt-[22px] gap-4">
      <Dropdown class="w-[225px] font-semibold" placeholder="График"
                v-model="filterValues.schedule_id"
                :options="schedules"
                option-label="name"
      />

    </div>
    <div class="flex mt-[22px] gap-4">
      <fin-button @click="applyFilters()" icon="pi pi-save"  label="Применить" severity="success" class="p-button-lg w-[225px]"/>
      <fin-button @click="clearFilters()"  icon="pi pi-times"  label="Сбросить" severity="secondary" class="p-button-lg w-[225px]"/>
    </div>
  </div>
</template>

<style>
.filters-purchase {
  .custom-calendar {
    padding-top: 10px;
  }
}


</style>