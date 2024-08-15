<script setup>
import {useAxios} from "@/composable/useAxios.js";
import {onMounted, ref, computed} from "vue";


const goods = ref({
  name:'',
  amount: '',
  price:''
})
const props = defineProps({
  productId:{
    required: true,
  }
});

const printDoc = ref({
  doc_number: '',
  doc_name: '',
  organizationName: '',
  author: '',
  counterpartyName: '',
  counterpartyAgreementName: '',
  storageName: '',
  date: null,
  currencyName: '',
});

const headers = ref([
  { id: 1, title: "№", key: "doc_number" },
  { id: 2, title: "Наименование товара", key: "name" },
  { id: 4, title: "Цена", key: "price" },
  { id: 3, title: "Количество", key: "count" },
  { id: 5, title: "Сумма", key: "sum" },
]);

const windowPrint = () => {
  window.print();
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  };
  return date.toLocaleString('en-GB', options).replace(',', '');
};

const getView = async () => {
  try {
    const res = await useAxios(`/document/show/${props.productId}`)
    const item = res.result;

    printDoc.value = {
      doc_number: item.doc_number,
      organizationName: item.organization,
      author: item.author,
      counterpartyName: item.counterparty,
      counterpartyAgreementName: item.counterpartyAgreement,
      storageName: item.storage,
      date: formatDate(item.date),
      currencyName: item.currency,

    };
    goods.value = item.goods.map(good => ({
      id: good.id,
      name: good.good.name,
      amount: good.amount,
      price: good.price,
    }));
    console.log('GGG', goods)
  } catch (e) {
    console.error('Error fetching data:', e);
  }
};

onMounted(async () => {
  await getView();
  await windowPrint();
  await window.close();
});

</script>
<template>
  <div class="container">
    <div class="flex gap-[100px] justify-center">
      <div class="">
        <div class="text-gray-500 text-[12px]">Организация</div>
        <div class="text-lg border-b">{{printDoc.organizationName.name}}</div>
      </div>
      <div class="">
        <div class="text-gray-500 text-[12px]">Поствщик</div>
        <div class="text-l border-b">{{printDoc.counterpartyName.name}}</div>
      </div>
      <div class="">
        <div class="text-gray-500 text-[12px]">Склад</div>
        <div class="text-lg border-b">{{printDoc.storageName.name}}</div>
      </div>
    </div>

    <div class="flex mt-10 gap-[100px] justify-center">
      <div class="text-center text-3xl"> Накладная поступление №  {{printDoc.doc_number}} от {{printDoc.date}}</div>
    </div>
    <div class="flex justify-center mt-10">
      <table class="table-auto w-full max-w-4xl border border-collapse border-gray-400">
        <thead>
        <tr>
          <th v-for="header in headers" :key="header.id" class="border border-gray-400 p-2 text-center">
            {{ header.title }}
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(good, index) in goods" :key="good.id" class="border border-gray-400">
          <td class="border border-gray-400 p-2 text-center">{{ index + 1 }}</td>
          <td class="border border-gray-400 p-2 text-center">{{ good.name }}</td>
          <td class="border border-gray-400 p-2 text-center">{{ good.price }}</td>
          <td class="border border-gray-400 p-2 text-center">{{ good.amount }}</td>
          <td class="border border-gray-400 p-2 text-center">{{ good.amount * good.price }}</td>
        </tr>
        </tbody>
      </table>
    </div>

    <div class="flex justify-center gap-16 mt-10">
      <div class="flex gap-4">
        <span>Сдал</span>
        <div style="width: 150px; border-bottom: 1px solid #d9d9d9" />
      </div>
      <div class="flex gap-4">
        <span>Принял</span>
        <div style="width: 150px; border-bottom: 1px solid #d9d9d9" />
      </div>
    </div>
  </div>
</template>


<style scoped>

</style>