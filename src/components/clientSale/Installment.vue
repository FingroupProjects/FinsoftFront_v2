<script setup>
import FloatLabel from "primevue/floatlabel";
import Select from "primevue/select";
import {ref} from 'vue'
import DatePicker from "primevue/datepicker";

const loanTerm = [3, 6, 12];
const selectedTerm = ref()

const loanTermOptions = loanTerm.map(term => ({
  label: `${term} месяцев `,
  value: term
}));

function selectGoods() {
  console.log('select',selectedTerm.value)
}

const products = ref();
const columns = [
  { field: 'code', header: 'Code' },
  { field: 'name', header: 'Name' },
  { field: 'category', header: 'Category' },
  { field: 'quantity', header: 'Quantity' }
];


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
        <div class="header-title w-1/2 ml-8 mt-8">
          Срок кредитования и график погашения
        </div>
        <div class="w-1/2 mt-8 -ml-[100px]">
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

      <!-- Table Section -->
      <div class=" flex items-end mt-3">
        <table class="w-full">

          <tbody>
          <tr class="flex justify-between w-full">
            <!-- Column 1: DatePicker -->
            <td class="w-1/3 px-2">
              <FloatLabel>
                <DatePicker
                    showIcon
                    showTime
                    hourFormat="24"
                    dateFormat="dd.mm.yy,"
                    fluid
                    hideOnDateTimeSelect
                    iconDisplay="input"
                    class="w-full"
                />
                <label for="dd-city">Дата</label>
              </FloatLabel>
            </td>

            <!-- Column 2: Select -->
            <td class="w-1/3 px-2">
                  robots.txt.js
                  v-model="selectedTerm"
                  :options="loanTermOptions"
                  option-label="label"
                  option-value="value"
                  class="w-full"
              />
            </td>

            <!-- Column 3: Input -->
            <td class="w-1/3 px-2">
              <fin-input
                  placeholder="Сумма погашения"
                  class="w-full"
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