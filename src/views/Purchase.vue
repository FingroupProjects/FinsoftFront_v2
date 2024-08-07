<script setup>
import {ref, watch} from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";
import Tag from "primevue/tag";
import Sidebar from "primevue/sidebar";
import CreatePurchase from "@/components/CreatePurchase.vue";
import FilterPurchase from "@/components/FilterPurchase.vue";
import Paginator from 'primevue/paginator';
import {useAxios} from "@/composable/useAxios.js";
import moment from "moment";
import {useStaticApi} from "@/composable/useStaticApi.js";
import Toast from "primevue/toast";
import ViewPurchase from "@/components/ViewPurchase.vue";
import MethodsPurchase from "@/components/MethodsPurchase.vue";
import HeaderPurchase from "@/components/HeaderPurchase.vue";

const {
  findStorage,
  storage,
  loadingStorage,
  findCounterparty,
  counterparty,
  loadingCounterparty,
} = useStaticApi();

const visibleRight = ref(false);
const products = ref();
const selectedStorage = ref(null);
const selectedProduct = ref();
const filterData = ref()
const selectedProductId = ref()
const search = ref('')
const selectedCounterparty = ref();
const first = ref(1)
const visibleFilter = ref(false)
const openViewPurchase = ref(false)
const metaKey = ref(true);

const pageCounts = ref([
  {
    count: 5,
  },

  {
    count: 10,
  },

  {
    count: 15,
  },

  {
    count: 20,
  },
]);
const openUp = ref(Array(products.value?.length).fill(false));
const pagination = ref({
  perPage: 0,
  totalPages: 0,
});
const selectPage = ref({
  count: 20,
});

const onRowClick = (event) => {
  const product = event.data;
  openViewPurchase.value = true;
  selectedProductId.value = product.id
};
const handleFiltersUpdate = (filters) => {
  console.log('Received filters:', filters);
  for (const filter of filters) {
    if (filter !== '') {
      filterData.value = filter;
    }
    console.log(filterData)
  }
}

async function getProducts() {
  const res = await useAxios(`/document/provider/purchase`,  {
    params: {
      itemsPerPage: selectPage.value.count,
      orderBy: 'id',
      perPage: first.value,
      search: search.value,
      storage_id: selectedStorage.value?.code,
      counterparty_id:selectedCounterparty.value?.code,
      page:first.value+1
    },
  }
  );
  pagination.value.totalPages = res.result.pagination.total_pages;
  return (products.value = res.result.data);
}
function getProductMethods(){
  selectedProduct.value = null
  getProducts()
}

const getSeverity = (status, deleted) => {
  if (deleted) {
    return {
      status: "warn",
      name: "Удалено",
    };
  }

  switch (status) {
    case true:
      return {
        status: "success",
        name: "Проведен",
      };
    case false:
      return {
        status: "warn",
        name: "Не проведен",
      };
    default:
      return {
        status: "error",
        name: "Unknown status",
      };
  }
};

function closeFn(id) {
  selectedProductId.value = id
  visibleRight.value = false
  openViewPurchase.value = true
}

const sortData = (field, index) => {
  products.value.sort((a, b) => (a[field] > b[field] ? 1 : -1));
  openUp.value[index] = !openUp.value[index];
};
watch(selectedStorage, () => {
  getProducts();
});
watch(selectedCounterparty, () => {
  getProducts();
});
getProducts();
</script>

<template>
  <header-purchase/>
  <div class="grid grid-cols-12 gap-[16px] purchase-filter relative bottom-[43px]">
    <IconField class="col-span-6">
      <InputIcon class="pi pi-search" />
      <InputText
        class="w-full"
        @input="getProducts"
        v-model="search"
        placeholder="Поиск"
      />
    </IconField>
    <Dropdown
      v-model="selectedStorage"
      optionLabel="name"
      placeholder="Склад"
      @click="findStorage"
      :loading="loadingStorage"
      :options="storage"
      class="w-full col-span-2"
    />
    <Dropdown
      v-model="selectedCounterparty"
      :loading="loadingCounterparty"
      @click="findCounterparty"
      :options="counterparty"
      optionLabel="name"
      placeholder="Поставщик"
      class="w-full col-span-2"
    />
    <div class="flex gap-4 col-span-2">
      <fin-button
      @click="visibleFilter = true "
          severity="primary"
          class="w-[46px]"

      >
        <img src="@/assets/img/menu.svg" alt="" />
      </fin-button>
      <fin-button
        @click="visibleRight = true"
        severity="success"
        icon="pi pi-plus"
        class="w-[80%]"
        label="Создать"
      />
    </div>
  </div>
  <div class="card mt-4 bg-white h-[80vh] overflow-auto relative bottom-[43px]">
    <MethodsPurchase @get-product="getProductMethods" :select-products="selectedProduct"
                     v-if="!(!selectedProduct || !selectedProduct.length)"/>
    <DataTable
        v-model:selection="selectedProduct"
        :value="products"
        dataKey="id"
        tableStyle="min-width:100%"
        :metaKeySelection="metaKey"
        @row-click="onRowClick"
        @sort="sortData('code')"
    >
      <Column selectionMode="multiple"></Column>
      <Column field="code" :sortable="true" header="№">
        <template #header>
        </template>
        <template #sorticon="{index}">
          <i
              @click="sortData('code',index)"
              :class="{
            'pi pi-arrow-down': openUp[index],
            'pi pi-arrow-up': !openUp[index],
            'text-[#808BA0] text-[5px]': true
          }"
          ></i>
        </template>
        <template #body="slotProps">
          <span
              class="text-ellipsis block w-[90px] whitespace-nowrap overflow-hidden"
          >{{ slotProps.data?.doc_number }}</span
          >
        </template>
      </Column>

      <Column field="name" :sortable="true" header="Дата">
        <template #sorticon="{index}">
          <i
              @click="sortData('code',index)"
              :class="{
            'pi pi-arrow-down': openUp[index],
            'pi pi-arrow-up': !openUp[index],
            'text-[#808BA0] text-[5px]': true
          }"
          ></i>
        </template>
        <template #body="slotProps">
          {{ moment(new Date(slotProps.data.date)).format(" D.MM.YYYY h:mm") }}
        </template>
      </Column>
      <Column field="category" :sortable="true" header="Поставщик">
        <template #sorticon="{index}">
          <i
              @click="sortData('code',index)"
              :class="{
            'pi pi-arrow-down': openUp[index],
            'pi pi-arrow-up': !openUp[index],
            'text-[#808BA0] text-[5px]': true
          }"
          ></i>
        </template>
        <template #body="slotProps">
          {{ slotProps.data.counterparty?.name }}
        </template>
      </Column>
      <Column field="image" :sortable="true" header="Организация">
        <template #sorticon="{index}">
          <i
              @click="sortData('code',index)"
              :class="{
            'pi pi-arrow-down': openUp[index],
            'pi pi-arrow-up': !openUp[index],
            'text-[#808BA0] text-[5px]': true
          }"
          ></i>
        </template>
        <template #body="slotProps">
          {{ slotProps.data.organization?.name }}
        </template>
      </Column>
      <Column field="price" :sortable="true" header="Сумма">
        <template #sorticon="{index}">
          <i
              @click="sortData('code',index)"
              :class="{
            'pi pi-arrow-down': openUp[index],
            'pi pi-arrow-up': !openUp[index],
            'text-[#808BA0] text-[5px]': true
          }"
          ></i>
        </template>
        <template #body="slotProps">
          {{ slotProps.data.sum }}
        </template>
      </Column>
      <Column field="storage" :sortable="true" header="Склад">
        <template #sorticon="{data,index}">
          <i
              @click="sortData('code',index)"
              :class="{
            'pi pi-arrow-down': openUp[index],
            'pi pi-arrow-up': !openUp[index],
            'text-[#808BA0] text-[5px]': true
          }"
          ></i>
        </template>
        <template #body="slotProps">
          {{ slotProps.data.storage?.name }}
        </template>
      </Column>
      <Column field="status" :sortable="true" header="Статус">
        <template #sorticon="{index}">
          <i
              @click="sortData('code',index)"
              :class="{
            'pi pi-arrow-down': openUp[index],
            'pi pi-arrow-up': !openUp[index],
            'text-[#808BA0] text-[5px]': true
          }"
          ></i>
        </template>
        <template #body="slotProps">
          <Tag
              :value="getSeverity(slotProps.data.active,slotProps.data?.deleted_at).name"
              :severity="getSeverity(slotProps.data.active,slotProps.data?.deleted_at).status"
          />
        </template>
      </Column>
      <Column field="inventoryStatus" :sortable="true" header="Автор">
        <template #sorticon="{index}">
          <i
              @click="sortData('code',index)"
              :class="{
            'pi pi-arrow-down': openUp[index],
            'pi pi-arrow-up': !openUp[index],
            'text-[#808BA0] text-[5px]': true
          }"
          ></i>
        </template>
        <template #body="slotProps">
          {{ slotProps.data?.author?.name }}
        </template>
      </Column>
      <Column field="rating" :sortable="true" header="Валюта">
        <template #sorticon="{index}">
          <i
              @click="sortData('code',index)"
              :class="{
            'pi pi-arrow-down': openUp[index],
            'pi pi-arrow-up': !openUp[index],
            'text-[#808BA0] text-[5px]': true
          }"
          ></i>
        </template>
        <template #body="slotProps">
          {{ slotProps.data?.currency?.name }}
        </template>
      </Column>
    </DataTable>
    <div class="paginator-dropdown bg-white sticky left-0 top-[100%]">
      <span class="paginator-text"> Элементов на странице: </span>
      <Dropdown
          v-model="selectPage"
          @update:model-value="getProducts"
          :options="pageCounts"
      >
        <template #value="slotProps">{{ slotProps.value.count }}</template>
        <template #option="slotProps">
          {{ slotProps.option.count }}
        </template>
      </Dropdown>
      <Paginator
          :rows="1"
          :totalRecords="`${pagination.totalPages}`"
          v-model:first="first"
          @page="getProducts"
          :rowsPerPageOptions="[10, 20, 30]"
          template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="{first} / {totalRecords}"
      />
    </div>
  </div>
  <div class="create-purchase-sidebar">
    <Sidebar
        v-model:visible="visibleRight"
        :show-close-icon="false"
        position="right"
        class="create-purchase"
    >
      <CreatePurchase @close-sidebar="visibleRight=false" @close-dialog="closeFn"/>
    </Sidebar>
  </div>

  <Sidebar
      v-model:visible="openViewPurchase"
      :show-close-icon="false"
      position="right"
      class="create-purchase-sidebar"
  >
    <view-purchase :productId="selectedProductId"/>
  </Sidebar>

  <Sidebar
      v-model:visible="visibleFilter"
      :show-close-icon="false"
      position="right"
      class="filters-purchase"
  >
    <filter-purchase  @updateFilters="handleFiltersUpdate"  />
  </Sidebar>
  <Toast />
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
    color: #141c30;
  }

  .p-select {
    border-color: #e9e9e9;
    border-radius: 10px;
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

.purchase-filter {
  .p-inputtext {
    border-color: white !important;
    border-radius: 10px !important;
    box-shadow: none !important;
  }

  .p-inputtext::placeholder {
    color: #808ba0 !important;
    font-size: 15px !important;
    font-weight: 600;
    font-family: Manrope, sans-serif;
    line-height: 15px;
  }

  .p-select {
    border-color: white;
    border-radius: 10px !important;
    box-shadow: none !important;
  }

  .p-placeholder {
    color: #808ba0 !important;
    font-size: 15px !important;
    font-weight: 600;
    font-family: Manrope, sans-serif;
  }
}

.create-purchase-sidebar{
  width: 1154px !important;
  border-top-left-radius: 30px;
}

.create-purchase{
  width: 1154px !important;
  border-top-left-radius: 30px;
}

.filters-purchase{
  width: 546px !important;
  border-top-left-radius: 30px;
}

.p-datatable-column-title {
  color: #808ba0;
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
  background: #cbf7d2 !important;
  padding: 8px 12px 8px 12px !important;
  color: #17a825;
}

.p-tag-warn {
  background: #ffe9c9 !important;
  padding: 8px 12px 8px 12px !important;
  color: #c1790c;
}

.p-datatable-tbody > tr > td {
  color: #141c30;
  font-weight: 500;
  font-family: Manrope, sans-serif;
  font-size: 15px;
  line-height: 15px;
}

.p-datatable-header-cell:nth-child(1) {
  border-top-left-radius: 10px !important;
}

.p-datatable-header-cell:nth-child(10) {
  border-top-right-radius: 10px !important;
}

.p-paginator {
  justify-content: end !important;
}
.p-select:not(.p-disabled).p-focus{
  border-color: #3935E7 !important;
}
</style>
