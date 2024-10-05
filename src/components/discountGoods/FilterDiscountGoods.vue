<script setup>
import Select from "primevue/select";
import FloatLabel from "primevue/floatlabel";
import {defineProps, onMounted, ref, watch} from "vue";
import {useAxios} from "@/composable/useAxios.js";
import DatePicker from "primevue/datepicker";

const emit = defineEmits(['updateFilters','clearFilter' ]);
const props = defineProps(['savedFilters']);

const type  = [
  {id: "percent", name: 'Процент'},
  {id: "good", name: 'Товар'},
]
const status = [
  {id: 1, name: 'Активный'},
  {id: 2, name: 'Не активный'},
]
const selectedStatus = ref()
const selectedType = ref()
const selectedGood = ref()
const rawDateFirst = ref()
const rawDateSecond = ref()
const cpAgreementList = ref({})
const filterValue = ref([])

function sendData () {
  filterValue.value = {
    start_date: rawDateFirst.value,
    end_date: rawDateSecond.value,
    good: selectedGood.value,
    type: selectedType.value,
  }
  console.log(filterValue.value)
  emit('updateFilters', filterValue.value)
}

const clearFilters = () => {
  Object.keys(filterValue).forEach(key => filterValue[key] = '');
  emit('clearFilter', filterValue);
};

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


const getGood = async () =>{
  const res = await useAxios(`/good`)
  cpAgreementList.value = res.result.data;
  console.log(cpAgreementList.value)
}

watch(rawDateFirst, (newValue) => {
  if (newValue) {
    try {
      const formattedDateTime = formatDateTime(newValue);
      rawDateFirst.value = formattedDateTime;
    } catch (error) {
      console.error('Error formatting date and time:', error);
      rawDateFirst.value = '';
    }
  } else {
    rawDateFirst.value = '';
  }
});

watch(rawDateSecond, (newValue) => {
  if (newValue) {
    try {
      const formattedDateTime = formatDateTime(newValue);
      rawDateSecond.value = formattedDateTime;
    } catch (error) {
      console.error('Error formatting date and time:', error);
      rawDateSecond.value = '';
    }
  } else {
    rawDateSecond.value = '';
  }
});

onMounted(()=>{
  getGood()
  Object.assign(filterValue, props.savedFilters);
  console.log('login',props.savedFilters)
})
</script>

<template>
  <div>
    <div class="text-black text-[20px] font-semibold ">Фильтры</div>

    <div class="block mt-8">
      <FloatLabel class="mt-[14px] col-span-4">
        <DatePicker
            v-model="rawDateFirst"
            showIcon
            showTime
            hourFormat="24"
            dateFormat="dd.mm.yy,"
            fluid
            hideOnDateTimeSelect
            iconDisplay="input"
            class="w-full"

        />
        <label for="dd-city">От</label>
      </FloatLabel>
      <FloatLabel class="col-span-4 mt-4">
        <DatePicker
            v-model="rawDateSecond"
            showIcon
            showTime
            hourFormat="24"
            dateFormat="dd.mm.yy"
            fluid
            hideOnDateTimeSelect
            iconDisplay="input"
            class="w-full"
        />
        <label for="dd-city">До</label>
      </FloatLabel>
      <div class="w-full gap-4 mt-4">
        <FloatLabel>
          <Select
              class="w-full"
              :options="cpAgreementList"
              optionLabel="name"
              optionValue="id"
              v-model="selectedGood"
          />
          <label for="dd-city">Товар</label>
        </FloatLabel>
      </div>
      <div class="flex gap-4">
        <div class="w-full mt-4">
          <FloatLabel>
            <Select
                class="w-full"
                :options="type"
                optionLabel="name"
                optionValue="id"
                v-model="selectedType"
            />
            <label for="dd-city">Тип</label>
          </FloatLabel>
        </div>
      </div>
    </div>
    <div class="flex justify-center mt-[22px] gap-4">
      <fin-button @click="sendData()" icon="pi pi-save"  label="Применить" severity="success" class="p-button-lg w-[225px]"/>
      <fin-button @click="clearFilters()"  icon="pi pi-times"  label="Сбросить" severity="secondary" class="p-button-lg w-[225px]"/>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>