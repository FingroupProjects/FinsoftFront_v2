<script setup>
import { ref, onMounted } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
const products = ref([
  {name: '4 566,90', code: '11.07.2024 12:11:00', category: '1 224,30', quantity: '5 791,20'},
  {name: '4 566,90', code: '07.07.2024 08:12:00', category: '1 224,30', quantity: '5 791,20'},
  {name: '4 566,90', code: '04.06.2024 09:13:23', category: '1 224,30', quantity: '5 791,20'},
  {name: '4 566,90', code: '01.06.2024 09:23:12', category: '1 224,30', quantity: '5 791,20'},
]);
</script>
<template>
<div>
  <div class="ml-5 -mt-2">
    <p class="text-[20px] font-semibold text-[#141C30]">Движение закупки</p>
    <p class="text-[#808BA0] text-[16px]">№32151</p>
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
          <div class="card w-[770px] -ml-4">
            <DataTable  :value="products" >
              <Column field="code" header="Дата"></Column>
              <Column field="name" header="Кредит"></Column>
              <Column field="category" header="Дебет"></Column>
              <Column field="quantity" header="Сумма"></Column>
            </DataTable>
          </div>
        </TabPanel>
        <TabPanel value="1">
              <!--data-->
        </TabPanel>
        <TabPanel value="2">
              <!--data-->
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

.p-datatable-header-cell{
  background-color: $table-bg-color !important;
}
</style>
