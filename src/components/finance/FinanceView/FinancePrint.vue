<script setup>
import {useAxios} from "@/composable/useAxios.js";
import {onMounted, ref} from "vue";


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
  organizationName: '',
  counterpartyName: '',
  sender:'',
  counterpartyAgreementName: '',
  basis: '',
  date: null,
  cashRegister: '',
  operationType:''

});

const headers = ref([
  { id: 1, title: "№", key: "doc_number" },
  { id: 2, title: "Договор", key: "name" },
  { id: 4, title: "Основание", key: "price" },
  { id: 3, title: "Касса", key: "count" }
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
    const res = await useAxios(`/cash-store/show/${props.productId}`)
    const item = res.result;
    printDoc.value = {
      doc_number: item.doc_number,
      organizationName: item.organization.name,
      counterpartyName: item.counterparty.name,
      sender: item.sender.name,
      counterpartyAgreementName: item.counterpartyAgreement.name,
      basis: item.basis,
      date: item.date,
      cashRegister: item.cashRegister.name,
      operationType: item.operationType.name,
    }
    console.log('GGG', printDoc.value)
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
        <div class="text-lg border-b">{{printDoc.organizationName}}</div>
      </div>
      <div class="">
        <div class="text-gray-500 text-[12px]">Контрагент</div>
        <div class="text-l border-b">{{printDoc.counterpartyName}}</div>
      </div>
      <div class="">
        <div class="text-gray-500 text-[12px]">Вноситель</div>
        <div class="text-lg border-b">{{printDoc.sender}}</div>
      </div>
    </div>

    <div class="flex mt-10 gap-[100px] justify-center">
      <div class="text-center text-3xl"> {{ printDoc.operationType }} №  {{printDoc.doc_number}} от {{printDoc.date}}</div>
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
          <tr>
            <td class="border border-gray-400 p-2 text-center">{{ 1 }}</td>
            <td class="border border-gray-400 p-2 text-center" >{{printDoc.counterpartyAgreementName}}</td>
            <td class="border border-gray-400 p-2 text-center">{{printDoc.basis}}</td>
            <td class="border border-gray-400 p-2 text-center">{{printDoc.cashRegister}}</td>
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