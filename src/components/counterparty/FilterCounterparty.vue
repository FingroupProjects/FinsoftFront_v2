<script setup>
import Dropdown from "primevue/dropdown";
import {onMounted, reactive, ref, defineEmits} from "vue";


const filterValues = reactive({
  roles: '',
  deleted: '',
});
const statusList = ref([
  {label: 'Активный', value: 0},
  {label: 'Не Активный', value: 1},
]);

const roleList = ref([
  {
    name: 'Клиент',
    code: 1
  },
  {
    name: 'Поставщик',
    code: 2
  },
  {
    name: 'Прочие',
    code: 3
  },
])


const emit = defineEmits(['updateFilters']);
const applyFilters = () => {
  emit('updateFilters', filterValues);
  console.log('posted', filterValues);
};
const clearFilters = () => {
  Object.keys(filterValues).forEach(key => filterValues[key] = '');
  emit('clearFilter', filterValues);
};


</script>


<template>
  <div class="filters-purchase ml-5">
    <div class="text-black text-[20px] font-semibold ">Фильтры</div>

    <Dropdown class="mt-[22px] w-[466px] font-semibold"
              v-model="filterValues.roles"
              placeholder="Роль"
              :options="roleList"
              option-label="name"
              option-value="code"
    />
    <div class="flex mt-[1px] gap-4">
      <Dropdown class="mt-[22px] w-[466px] font-semibold"
                v-model="filterValues.deleted"
                :options="statusList"
                option-label="label"
                option-value="value"
                placeholder="Статус"
      />
    </div>

    <div class="flex mt-[22px] gap-4">
      <fin-button @click="applyFilters()" icon="pi pi-save" label="Применить" severity="success"
                  class="p-button-lg w-[225px]"/>
      <fin-button @click="clearFilters()" icon="pi pi-times" label="Сбросить" severity="secondary"
                  class="p-button-lg w-[225px]"/>
    </div>
  </div>
</template>

<style>
.filters-purchase {
  .custom-calendar {
    padding-top: 10px;
  }

  .p-component {
    border-radius: 10px !important;
    border-color: #DCDFE3 !important;
    height: 46px !important;
  }

  .appearance-none {
    border-radius: 10px !important;
    height: 46px !important;
    border-color: #DCDFE3 !important;
  }

  .p-button-secondary {
    color: #3935E7 !important;
    font-size: 16px !important;
  }

  .p-button-label {
    font-weight: bold !important;
  }

  .p-datepicker-input-icon-container {
    margin-top: -12px !important;
  }

}


</style>