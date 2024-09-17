<script setup>
import { ref, onMounted } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import {useAxios} from "@/composable/useAxios.js";

const balance = ref({})
const goodAccounting = ref({})
const counterparty = ref({})
const props = defineProps({
  productId: {
    required: true,
  },
  numberAgreement: {
    required: true,
  },
});

const getBalance = async () => {
  try {
    const res = await useAxios(`document-report/balance/${props.productId}`);
    const items = res.result.data;
    if (items && items.length > 0) {
      const balances = items.map(item => ({
        date: item.date,
        creditArticle: item.bill.name,
        debitArticle: item.movement_type,
          sum: item.sum ?? 0
      }));
      balance.value = balances;
      console.log('balances', balance.value);
    } else {
      console.error('No items found in the response');
    }
  } catch (error) {
    console.error('Error fetching balance:', error);
  }
}

const getGoodAccounting = async () => {
  try {
    const res = await useAxios(`document-report/good-accountings/${props.productId}`)
    const items = res.result.data;
    if (items && items.length > 0) {
      const goodAccountings = items.map(item => ({
        date: item.date,
        storage: item.storage.name,
        good: item.good.name,
        movement: item.movement_type,
        amount: item.amount,
        sum: item.sum ?? 0,
      }))
      goodAccounting.value = goodAccountings;
      console.log('ok', goodAccountings.value);
    } else {
      console.error('No items found in the response');
    }
  } catch (e) {
    console.error(e)
  }
}

const getCounterparty = async () =>{
  try{
    const res = await useAxios(`document-report/counterparty-settlements/${props.productId}`)
    const items = res.result.data
    if (items && items.length > 0) {
      const counterparties = items.map(item => ({
        date: item.date,
        movement: item.movement_type,
        counterpartyName: item.counterparty.name,
        counterpartyAgreement: item.counterpartyAgreement.name,
        sum: item.sum ?? 0,
      }));
      counterparty.value = counterparties;
    }else {
      console.error('No items found in the response');
    }
  }catch (e){
    console.error(e)
  }
}


onMounted(() => {
  getBalance();
  getGoodAccounting()
  getCounterparty()
})
</script>
<template>
<div>
  <div class="ml-5 -mt-2">
    <p class="text-[20px] font-semibold text-[#141C30]">Движение закупки</p>
    <p class="text-[#808BA0] text-[16px]">№{{ props.numberAgreement }}</p>
  </div>
  <div class="carddes ml-5">
    <Tabs value="0">
      <TabList >
        <Tab  value="0">Баланс</Tab>
        <Tab value="1">Учёт</Tab>
        <Tab value="2">Взаимо действие с поставщиками</Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="0">
          <div class="movement-card card w-[770px] -ml-4">
            <DataTable :value="balance">
              <Column field="date" header="Дата"></Column>
              <Column field="creditArticle" header="Счёт"></Column>
              <Column field="debitArticle" header="Тип движения"></Column>
              <Column field="sum" header="Сумма"></Column>
            </DataTable>
          </div>
        </TabPanel>
        <TabPanel value="1">
          <div class="movement-card card w-[770px] -ml-4">
            <DataTable :value="goodAccounting">
              <Column field="date" header="Дата"></Column>
              <Column field="good" header="Товар"></Column>
              <Column field="storage" header="Склад"></Column>
              <Column field="amount" header="Количество"></Column>
              <Column field="sum" header="Сумма"></Column>
              <Column field="movement" header="Тип"></Column>
            </DataTable>
          </div>
        </TabPanel>
        <TabPanel value="2">
          <div class="movement-card card w-[770px] -ml-4">
            <DataTable :value="counterparty">
              <Column field="date" header="Дата"></Column>
              <Column field="counterpartyName" header="Контрагент"></Column>
              <Column field="counterpartyAgreement" header="Договор"></Column>
              <Column field="sum" header="Сумма"></Column>
              <Column field="movement" header="Тип"></Column>
            </DataTable>
          </div>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</div>

</template>

<style scoped lang="scss">
@import "@/assets/style/colors";
.p-datatable-thead{
  background-color: $table-bg-color !important;
}

.p-tab-active{
  color: $primary-color !important;
}

.p-tab{
  color: $data-label-color;
}


.p-tablist-active-bar {
  background: $primary-color !important;
  height: 3px !important;
}
.movement-card{
    .p-datatable-thead .p-datatable-header-cell{
    background-color: $table-bg-color !important;
    border-top-right-radius: 10px !important;
  }
  .p-datatable-thead{
    border-top-right-radius: 10px !important;
    border-top-left-radius: 10px !important;
    background-color: $table-bg-color !important;
  }

}

</style>
