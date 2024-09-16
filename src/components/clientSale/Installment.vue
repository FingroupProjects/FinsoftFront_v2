<script setup>
import FloatLabel from "primevue/floatlabel";
import Select from "primevue/select";
import {ref, watch} from 'vue'
import DatePicker from "primevue/datepicker";

const loanTerm = [3, 6, 12];
const selectedTerm = ref()
const dateValues = ref(Array(selectedTerm.value).fill(null));
const loanTermOptions = loanTerm.map(term => ({
  label: `${term} months `,
  value: term
}));

function selectGoods() {
  console.log('select',selectedTerm.value)
}

watch(selectedTerm, (newVal) => {
  dateValues.value = Array(newVal).fill(null);
});

</script>

<template>
  <div class="installment">
    <div class="header">
      <div>
        <div class="header-title">Рассрочка</div>

      </div>
      <div class="flex gap-[16px]">
        <fin-button
            icon="pi pi-save"
            @click="selectGoods"
            label="Сохранить"
            severity="success"
            class="p-button-lg"
        />
        <fin-button
            icon="pi pi-times"

            label="Отменить"
            severity="warning"
            class="p-button-lg"
        />
      </div>
    </div>
    <div class="flex grid-cols-4 gap-[16px] mt-[30px]">
       <fin-input
         placeholder="Сумма передоплаты"
         class="w-full"
       />
      <FloatLabel class="w-full" >
        <Select
            class="w-full"
        >
        </Select>
        <label for="dd-city">Поручитель</label>
      </FloatLabel>
    </div>
    <div class="flex gap-[16px] mt-[30px]">
      <div class="w-1/2">
        <fin-input
            placeholder="Оплата от бонуса"
            class="w-full"
        />
      </div>
      <div class="w-1/2 flex gap-[16px]">
        <FloatLabel class="w-1/2">
          <Select
              class="w-full"
          />
          <label for="dd-city">Сертификат</label>
        </FloatLabel>

        <div class="w-1/2">
          <fin-input
              placeholder="Номинал"
              class="w-full"
              disabled
          />
        </div>
      </div>
    </div>
    <div class="flex ml-[220px] mt-2">
      <div class=" text-green-600">Итого бонус: 23 560, 40</div>
    </div>

    <div class="flex flex-col mt-8 border-4 w-[770px] h-[530px]">
      <div class="header flex gap-4">
        <div class="header-title w-[210px] ml-8 mt-8 leading-8" style="line-height: 1.4 !important;">
          Срок кредитования и график погашения
        </div>
        <div class="w-1/2 mt-8">
          <FloatLabel class="w-[200px]">
            <Select
                v-model="selectedTerm"
                :options="loanTermOptions"
                option-label="label"
                option-value="value"
                class="w-full"
            />
            <label for="loan-term">Срок кредита</label>
          </FloatLabel>
        </div>
      </div>
      <div class="flex-grow mt-3 overflow-auto max-h-[450px]">
        <table class="w-full">
          <tbody>
          <tr v-for="(i, index) in selectedTerm" :key="index" class="flex justify-between w-full mt-1">
            <td class="mx-4 mt-2 bg-gray-300 rounded-2xl w-[35px] h-[35px] text-blue-700 font-bold">
               <p v-if="i > 9" class="ml-[6px] pt-1">{{ i }}</p>
              <p v-if="i <= 9" class="ml-[10px] pt-1">{{ i }}</p>
            </td>
            <td class="w-1/3 px-2 mb-6 ">
              <FloatLabel>
                <DatePicker
                    showIcon
                    showTime
                    v-model="dateValues[index]"
                    hourFormat="24"
                    dateFormat="dd.mm.yy"
                    fluid
                    hideOnDateTimeSelect
                    iconDisplay="input"
                    class="w-full h-[45px] date-picker-rounded"

                />
                <label for="dd-city">Дата</label>
              </FloatLabel>
            </td>
            <td class="w-1/3 px-2">
              <Select
                  option-value="value"
                  class="w-full h-[45px]"
              />
            </td>
            <td class="w-1/3 px-2">
              <fin-input
                  placeholder="Сумма погашения"
                  class="w-full h-[45px]"
              />
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>


  </div>

</template>

<style scoped lang="scss">


</style>