<script setup>
import DatePicker from "primevue/datepicker";
import Dropdown from "primevue/dropdown";
import FloatLabel from "primevue/floatlabel";
import { onMounted, reactive, ref, watch, defineEmits  } from "vue";
import { useStaticApi } from "@/composable/useStaticApi.js";
import { useAxios } from "@/composable/useAxios.js";

const userNames = ref([]);
const currency = ref([])
const deleted = ref([
  { label: 'Да', value: 1},
  { label: 'Нет', value: 0 },
]);

const status = ref([
  { label: 'Проведен', value: 1 },
  { label: 'Не проведен', value: 0 },
]);

const rawDateFirst = ref(null);
const rawDateSecond = ref(null);
const filterValues = reactive({
  startDate: '',
  endDate: '',
  organization_id: '',
  currency_id: '',
  author_id: '',
  deleted: '',
  active: ''
});
onMounted(() => {
  console.log(filterValues)
  Object.assign(filterValues, props.savedFilters);
});


function formatDateTime(date) {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear()
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


watch(rawDateFirst, (newValue) => {
  if (newValue) {
    try {
      const formattedDateTime = formatDateTime(newValue);
      filterValues.startDate = formattedDateTime;
    } catch (error) {
      console.error('Error formatting date and time:', error);
      filterValues.startDate = '';
    }
  } else {
    filterValues.startDate = '';
  }
});

watch(rawDateSecond, (newValue) => {
  if (newValue) {
    try {
      const formattedDateTime = formatDateTime(newValue);
      filterValues.endDate = formattedDateTime;
    } catch (error) {
      console.error('Error formatting date and time:', error);
      filterValues.endDate = '';
    }
  } else {
    filterValues.endDate = '';
  }
});

const emit = defineEmits(['updateFilters']);
const datas = () => {
  emit('updateFilters', filterValues);
};
const applyFilters = () => {
  emit('updateFilters', filterValues);
};

const clearFilters = () => {
  Object.keys(filterValues).forEach(key => filterValues[key] = '');
  emit('updateFilters', filterValues); // Обновляем сохраненные фильтры
};
const getUsers = async () => {
  try {
    const res = await useAxios('/user');
    const items = res.result.data;
    userNames.value = items.map(user => ({ label: user.name, value: user.id }));
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
const getCurrency = async () =>{
  try {
    const res = await useAxios(`/currency`)
    const items = res.result.data;
    currency.value = items.map(user => ({
      id: user.id,
      name: user.name,
    }));
    console.log('log', currency.value)
  }catch (e){
  }
}
const clear = () => {
  Object.keys(filterValues).forEach(key => filterValues[key] = '');
  rawDateFirst.value = '';
  rawDateSecond.value = '';
  datas()
};

const {
  findOrganization,
  organization,
} = useStaticApi();


onMounted(() => {
  getUsers();
  getCurrency();
});
</script>

<template>
  <div class="filters-purchase ml-5">
    <div class="text-black text-[20px] font-semibold ">Фильтры</div>
    <FloatLabel class="mt-[14px] col-span-4">
      <DatePicker
          v-model="rawDateFirst"
          showIcon
          showTime
          hourFormat="24"
          dateFormat="dd.mm.yy,"
          fluid
          iconDisplay="input"
          class="w-[466px]"
      />
      <label for="dd-city">От</label>
    </FloatLabel>
    <FloatLabel class="col-span-4 mt-[22px]">
      <DatePicker
          v-model="rawDateSecond"
          showIcon
          showTime
          hourFormat="24"
          dateFormat="dd.mm.yy"
          fluid
          iconDisplay="input"
          class="w-[466px]"
      />
      <label for="dd-city">До</label>
    </FloatLabel>
    <Dropdown class="mt-[22px] w-[466px] font-semibold"
        v-model="filterValues.organization_id"
        placeholder="Организация"
        :options="organization"
        option-label="name"
        @click="findOrganization"
        option-value="code"
    />
    <div class="flex mt-[22px] gap-4">
      <Dropdown class="w-[225px] font-semibold" placeholder="Статус"
                v-model="filterValues.active"
                :options="status"
                option-label="label"
                option-value="value"
      />
      <Dropdown class="w-[225px] font-semibold" placeholder="Удален"
                v-model="filterValues.deleted"
                :options="deleted"
                option-label="label"
                option-value="value"
      />
    </div>
    <div class="flex mt-[22px] gap-4">
      <Dropdown class="w-[225px] font-semibold" placeholder="Автор"
                v-model="filterValues.author_id"
                :options="userNames"
                option-label="label"
                option-value="value"
      />
      <Dropdown class="w-[225px] font-semibold"
                v-model="filterValues.currency_id"
                placeholder="Валюта"
                :options="currency"
                option-label="name"
                option-value="id"
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
  .p-component{
    border-radius: 10px !important;
    border-color: #DCDFE3 !important;
    height: 46px !important;
  }
  .appearance-none{
    border-radius: 10px !important;
    height: 46px !important;
    border-color: #DCDFE3 !important;
  }
  .p-button-secondary{
    color: #3935E7 !important;
    font-size: 16px !important;
  }
  .p-button-label{
    font-weight: bold !important;
  }
  .p-datepicker-input-icon-container{
    margin-top: -12px !important;
  }

}


</style>