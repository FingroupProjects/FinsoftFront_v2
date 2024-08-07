<script setup>
import DatePicker from "primevue/DatePicker";
import Dropdown from "primevue/dropdown";
import FloatLabel from "primevue/floatlabel";
import {onMounted, reactive, ref} from "vue";
import {useStaticApi} from "@/composable/useStaticApi.js";
import {useAxios} from "@/composable/useAxios.js";

const userNames = ref()
const deleted = ref([
  { label: 'Да', value: '1' },
  { label: 'Нет', value: '0 ' },
]);
const status = ref([
  { label: 'Проведен', value: '1' },
  { label: 'Не проведен', value: '0' },
]);
const filterValues = reactive({
  first: '',
  second: '',
  organization_id: '',
  storage_id:'',
  currency_id:'',
  author_id: '',
  deleted:'',
  active:'',
})

const emit = defineEmits(['updateFilters']); // Define emits if not already defined

const datas = () => {
  emit('updateFilters', filterValues);
}

const getUsers = async () => {
  try {
    const res = await useAxios('/user');
    const items = res.result.data;

    userNames.value = items.map(user => user.name);

    console.log('filters',userNames);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

const {
  findCurrency,
  currency,
  findStorage,
  storage,
  findOrganization,
  organization,

} = useStaticApi()

onMounted(()=>{
  getUsers()
})
</script>

<template>
  <div class="filters-purchase ml-5">
    <div class="text-black text-[20px] font-semibold ">Фильтры</div>
    <FloatLabel class="mt-[14px] col-span-4">
      <DatePicker
          v-model="filterValues.first"
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
          v-model="filterValues.second"
          showIcon
          showTime
          hourFormat="24"
          dateFormat="dd.mm.yy,"
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
    <Dropdown class="mt-[22px] w-[466px] font-semibold"
              v-model="filterValues.storage_id"
              placeholder="Склад"
              :options="storage"
              option-label="name"
              @click="findStorage"
              option-value="code"
    />
    <div class="flex mt-[22px] gap-4">
      <Dropdown class="w-[225px] font-semibold" placeholder="Статус"
                v-model="filterValues.active"
                :options="status"
                option-label="label"
      />
      <Dropdown class="w-[225px] font-semibold" placeholder="Удален"
                v-model="filterValues.deleted"
                :options="deleted"
                option-label="label"
      />
    </div>
    <div class="flex mt-[22px] gap-4">
      <Dropdown class="w-[225px] font-semibold" placeholder="Автор"
                v-model="filterValues.author_id"
                :options="userNames"
      />
      <Dropdown class="w-[225px] font-semibold"
                v-model="filterValues.currency_id"
                placeholder="Валюта"
                :options="currency"
                option-label="name"
                @click="findCurrency"
      />
    </div>
    <div class="flex mt-[22px] gap-4">
      <fin-button @click="datas()" icon="pi pi-save"  label="Применить" severity="success" class="p-button-lg w-[225px]"/>
      <fin-button icon="pi pi-times"  label="Сбросить" severity="secondary" class="p-button-lg w-[225px]"/>
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