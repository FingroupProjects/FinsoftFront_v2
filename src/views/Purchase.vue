<script setup>
import {onMounted, ref} from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Tag from 'primevue/tag';
import Sidebar from "primevue/sidebar";
import CreatePurchase from "@/components/CreatePurchase.vue";
import FilterPurchase from "@/components/FilterPurchase.vue";
import Paginator from 'primevue/paginator';
import Toolbar from 'primevue/toolbar';
import Dialog from 'primevue/dialog';

const visibleRight = ref(false);
const products = ref();
const selectedProduct = ref();
const value1 = ref('')
const selectedCity = ref();
const selectPage = ref(50)
const visibleFilter = ref(false)
const metaKey = ref(true);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const product = ref({});
const cities = ref([
  {name: 'New York', code: 'NY'},
  {name: 'Rome', code: 'RM'},
  {name: 'London', code: 'LDN'},
  {name: 'Istanbul', code: 'IST'},
  {name: 'Paris', code: 'PRS'}
]);
const pageCounts = ref([
  {
    count: 5
  },

  {
    count: 10
  },

  {
    count: 15
  },

  {
    count: 20
  }
])
const openUp = ref(true)

const deleteProduct = () => {
  products.value = products.value.filter(val => val.id !== products.value.id);
  deleteProductDialog.value = false;
  product.value = {};
};
const confirmDeleteSelected = () => {
  deleteProductsDialog.value = true;
};

onMounted(() => {
  products.value = [{
    id: '1000',
    code: '322',
    name: '11.07.2024 12:11:00',
    description: 'Ultra Holding SLL',
    image: 'Miss Alysa Lockman III',
    price: 45,
    category: 'Serena Price',
    quantity: 24,
    inventoryStatus: 'Admin',
    rating: 'Сомони'
  }]
});
</script>

<template>
  <div class="grid grid-cols-12 gap-[16px]">
    <IconField class="col-span-6">
      <InputIcon class="pi pi-search"/>
      <InputText class="w-full" v-model="value1" placeholder="Поиск"/>
    </IconField>
   label="Создать"></Button>
    <Dropdown v-model="selectedCity" :options="cities" optionLabel="name" placeholder="Склад"
              class="w-full  col-span-2"/>
    <Dropdown v-model="selectedCity" :options="cities" optionLabel="name" placeholder="Поставщик"
              class="w-full col-span-2"/>
    <div class="flex gap-4 col-span-2">
      <fin-button @click="visibleFilter = true" severity="primary" class="w-[46px]">
        <img src="@/assets/img/menu.svg" alt="">
      </fin-button>
      <fin-button @click="visibleRight = true" severity="success" icon="pi pi-plus" class="w-[80%]"
                  label="Создать"/>
    </div>
  </div>
  <div class="card mt-4">
    <Dialog v-model:visible="deleteProductsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle !text-3xl"/>
        <span v-if="product">
          Are you sure you want to delete <b>{{ product.name }}</b>?
        </span>
      </div>
      <template #footer>
        <fin-button label="No" icon="pi pi-times" text @click="deleteProductDialog = false"/>
        <fin-button label="Yes" icon="pi pi-check" @click="deleteProduct"/>
      </template>
    </Dialog>
    <Toolbar v-if="!(!selectedProduct || !selectedProduct.length)">
      <template #start>
        <div class="flex gap-3 items-center">
          <div class="text-[15px] leading-4 font-semibold font-[Manrope] text-[#3935E7]">
            Выбран: {{ selectedProduct.length }}
          </div>
          <fin-button label="Провести" icon="pi pi-trash" class="p-button-sm" severity="warning" @click="confirmDeleteSelected"
                      :disabled="!selectedProduct || !selectedProduct.length"/>
          <fin-button label="Удалить" icon="pi pi-trash" severity="warning" class="p-button-sm" @click="confirmDeleteSelected"
                      :disabled="!selectedProduct || !selectedProduct.length"/>
          <fin-button label="Дублировать" icon="pi pi-copy" severity="warning" class="p-button-sm" @click="confirmDeleteSelected"
                      :disabled="!selectedProduct || !selectedProduct.length"/>
        </div>
      </template>
    </Toolbar>
    <DataTable v-model:selection="selectedProduct"
               :value="products"
               dataKey="id"
               tableStyle="min-width:100%"
               selectionMode="multiple"
               :metaKeySelection="metaKey">
      <Column selectionMode="multiple"></Column>
      <Column field="code" :sortable="true" header="№">
        <template #sorticon>
          <i @click="openUp = !openUp" v-if="openUp" class="pi pi-arrow-down text-[#808BA0] text-[5px]"></i>
          <i @click="openUp = !openUp" v-else class="pi pi-arrow-up text-[#808BA0] text-[5px]"></i>
        </template>
      </Column>

      <Column field="name" :sortable="true" header="Дата">
        <template #sorticon>
          <i @click="openUp = !openUp" v-if="openUp" class="pi pi-arrow-down text-[#808BA0] text-[5px]"></i>
          <i @click="openUp = !openUp" v-else class="pi pi-arrow-up text-[#808BA0] text-[5px]"></i>
        </template>
      </Column>
      <Column field="category" :sortable="true" header="Поставщик">
        <template #sorticon>
          <i @click="openUp = !openUp" v-if="openUp" class="pi pi-arrow-down text-[#808BA0] text-[5px]"></i>
          <i @click="openUp = !openUp" v-else class="pi pi-arrow-up text-[#808BA0] text-[5px]"></i>
        </template>
      </Column>
      <Column field="image" :sortable="true" header="Организация">
        <template #sorticon>
          <i @click="openUp = !openUp" v-if="openUp" class="pi pi-arrow-down text-[#808BA0] text-[5px]"></i>
          <i @click="openUp = !openUp" v-else class="pi pi-arrow-up text-[#808BA0] text-[5px]"></i>
        </template>
      </Column>
      <Column field="price" :sortable="true" header="Сумма">
        <template #sorticon>
          <i @click="openUp = !openUp" v-if="openUp" class="pi pi-arrow-down text-[#808BA0] text-[5px]"></i>
          <i @click="openUp = !openUp" v-else class="pi pi-arrow-up text-[#808BA0] text-[5px]"></i>
        </template>
      </Column>
      <Column field="category" :sortable="true" header="Склад">
        <template #sorticon>
          <i @click="openUp = !openUp" v-if="openUp" class="pi pi-arrow-down text-[#808BA0] text-[5px]"></i>
          <i @click="openUp = !openUp" v-else class="pi pi-arrow-up text-[#808BA0] text-[5px]"></i>
        </template>
      </Column>
      <Column field="category" :sortable="true" header="Статус">
        <template #sorticon>
          <i @click="openUp = !openUp" v-if="openUp" class="pi pi-arrow-down text-[#808BA0] text-[5px]"></i>
          <i @click="openUp = !openUp" v-else class="pi pi-arrow-up text-[#808BA0] text-[5px]"></i>
        </template>
        <template #body>
          <Tag value="Проведен" severity="success"/>
<!--          <Tag value="Не проведен" severity="warn"/>-->
        </template>
      </Column>
      <Column field="inventoryStatus" :sortable="true" header="Автор">
        <template #sorticon>
          <i @click="openUp = !openUp" v-if="openUp" class="pi pi-arrow-down text-[#808BA0] text-[5px]"></i>
          <i @click="openUp = !openUp" v-else class="pi pi-arrow-up text-[#808BA0] text-[5px]"></i>
        </template>
      </Column>
      <Column field="rating" :sortable="true" header="Валюта">
        <template #sorticon>
          <i @click="openUp = !openUp" v-if="openUp" class="pi pi-arrow-down text-[#808BA0] text-[5px]"></i>
          <i @click="openUp = !openUp" v-else class="pi pi-arrow-up text-[#808BA0] text-[5px]"></i>
        </template>
      </Column>
    </DataTable>
    <div class="paginator-dropdown w-full bg-white">
      <span class="paginator-text">
        Элементов на странице:
      </span>
      <Dropdown
          v-model="selectPage"
          :options="pageCounts"
      >
        <template #value="slotProps">{{ slotProps.value.count }}</template>

        <template #option="slotProps">
          {{ slotProps.option.count }}
        </template>
      </Dropdown>
      <Paginator :rows="1" :totalRecords="120" :rowsPerPageOptions="[10, 20, 30]"
                 template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                 currentPageReportTemplate="{first} / {totalRecords}"/>
    </div>
  </div>
  <Sidebar v-model:visible="visibleRight" :show-close-icon="false" position="right">
    <CreatePurchase/>
  </Sidebar>
  <Sidebar v-model:visible="visibleFilter" :show-close-icon="false" position="right">
    <filter-purchase/>
  </Sidebar>
</template>
<style lang="scss">
.paginator-dropdown {
  display: flex;
  justify-content: end;
  align-items: center;

  &-text {
    font-family: Manrope, sans-serif;
    font-size: 15px;
    font-weight: 500;
    line-height: 15px;
    text-align: left;
    color: #141C30;

  }

  .p-select {
    border-color: #E9E9E9 !important;
    border-radius: 10px !important;
    height: 29px;
    width: 65px;
    justify-content: center;
    align-items: center;
    margin-left: 9px;
  }

  .p-placeholder {
    font-family: Manrope, sans-serif;
    font-size: 15px;
    font-weight: 500;
    line-height: 15px;
    text-align: left;
  }

  .p-select-dropdown {
    width: 10px;
    height: 5px;
    margin-right: 10px;
  }
}
.p-drawer-right .p-drawer {
  width: 1154px !important;
  border-top-left-radius: 30px;
}
.p-inputtext {
  border-color: white !important;
  border-radius: 10px !important;
  box-shadow: none !important;
}

.p-inputtext::placeholder {
  color: #808BA0 !important;
  font-size: 15px !important;
  font-weight: 600;
  font-family: Manrope, sans-serif;
  line-height: 15px;
}

.p-focus {
  border-color: white !important;
  border-radius: 10px !important;
  box-shadow: none !important;
}

.p-placeholder {
  color: #808BA0 !important;
  font-size: 15px !important;
  font-weight: 600;
  font-family: Manrope, sans-serif;

}

.p-select{
  border-radius: 10px !important;
}
.p-select-open{
  border-color: #3935E7 !important;
}

.p-datatable-column-title {
  color: #808BA0;
  font-family: Manrope, sans-serif;
  font-weight: 600;
  font-size: 15px;
  line-height: 15px;
}

.p-datatable-table {
  border-radius: 10px;
}

.p-tag-label {
  font-size: 13px;
  line-height: 13px;
  font-weight: 600;
  font-family: Manrope, sans-serif;

}

.p-tag-success {
  background: #CBF7D2 !important;
  padding: 8px 12px 8px 12px !important;
  color: #17A825;
}
.p-tag-warn{
  background: #FFE9C9!important;
  padding: 8px 12px 8px 12px !important;
  color: #C1790C;
}
.p-datatable-tbody > tr > td{
  color: #141C30;
  font-weight: 500;
  font-family: Manrope, sans-serif;
  font-size: 15px;
  line-height: 15px;
}
.p-datatable-header-cell:nth-child(1){
  border-top-left-radius: 10px !important;
}
.p-datatable-header-cell:nth-child(10){
  border-top-right-radius: 10px !important;
}

.p-paginator {
  justify-content: end !important;
}
</style>

