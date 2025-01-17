<script setup>
import {onMounted, ref, watch} from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import InputText from "primevue/inputtext";
import Tag from "primevue/tag";
import Sidebar from "primevue/sidebar";
import Dropdown from "primevue/dropdown";
import Select from "primevue/select";
import CreatePurchase from "@/components/purchase/CreatePurchase.vue";
import FilterPurchase from "@/components/FilterPurchase.vue";
import Paginator from 'primevue/paginator';
import {useAxios} from "@/composable/useAxios.js";
import moment from "moment";
import {useStaticApi} from "@/composable/useStaticApi.js";
import Toast from "primevue/toast";
import ViewPurchase from "@/components/purchase/ViewPurchase.vue";
import MethodsPurchase from "@/components/purchase/MethodsPurchase.vue";
import HeaderPurchase from "@/components/HeaderPurchase.vue"
import Loader from "@/components/ui/Loader.vue";
import {reactive} from "vue";

const {
  findStorage,
  storage,
  loadingStorage,
  findCounterparty,
  counterparty,
  loadingCounterparty,
} = useStaticApi();

const visibleRight = ref(false);
const products = ref([]);
const selectedStorage = ref(null);
const selectedProduct = ref();
const selectedProductId = ref()
const search = ref('')
const selectedCounterparty = ref();
const first = ref(0)
const visibleFilter = ref(false)
const metaKey = ref(true);
const createOpenModal = ref(false);
const openInfoModal = ref(false);
const loader = ref(true)
const sortDesc = ref('asc');
const orderBy = ref('id');
const dateInfo = ref(null)
const savedFilterValues = reactive({
  startDate: '',
  endDate: '',
  organization_id: '',
  currency_id: '',
  author_id: '',
  deleted: '',
  active: ''
});

const hasOrganization = JSON.parse(localStorage.getItem('hasOneOrganization'));


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
  visibleRight.value = true;
  createOpenModal.value = true
  dateInfo.value = product
  selectedProductId.value = product.id
};

const getProducts = async (filters = {}) => {
  const params = {
    itemsPerPage: selectPage.value.count,
    orderBy: orderBy.value,
    perPage: first.value,
    search: search.value,
    storage_id: selectedStorage.value?.code,
    counterparty_id: selectedCounterparty.value?.code,
    page: first.value,
    ...filters,
    sort: sortDesc.value
  };

  loader.value = true

  try {
    const res = await useAxios(`/document/provider/purchase`, {params});
    pagination.value.totalPages = Number(res.result.pagination.total_pages);
    products.value = res.result.data;
  } catch (e) {
    console.log(e);
  } finally {
    loader.value = false;
  }

};

const handleFiltersUpdate = (filters) => {
  getProducts(filters);
  Object.assign(savedFilterValues, filters);
  visibleFilter.value = false;
}
const clearFilter = (filters) => {
  selectedStorage.value = null;
  selectedCounterparty.value = null;
  Object.assign(savedFilterValues, filters);
  visibleFilter.value = false;
  getProducts()
}

const searchCounterparty = async (inputValue) => {
  const res = await useAxios(`counterparty?search=${inputValue?.srcElement.value}`);
  counterparty.value = res.result.data.map((el) => ({
    name: el.name,
    code: el.id,
    agreement: el.agreement,
  }));
};


function getProductMethods() {
  selectedProduct.value = null
  getProducts()

  callGetDashBoardData()

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

function closeFn(result) {
  dateInfo.value = result
  createOpenModal.value = true
  getProducts();
}

function createOpen() {
  visibleRight.value = true
  createOpenModal.value = false
}

const sortData = (field, index) => {
  orderBy.value = field
  openUp.value[index] = !openUp.value[index]
  if (sortDesc.value === 'asc') sortDesc.value = 'desc'
  else sortDesc.value = 'asc'
  getProducts()
};

async function closeFnVl() {
  await getProducts();
  visibleRight.value = false
  callGetDashBoardData()
}


watch(selectedStorage, () => {
  if (selectedStorage.value) {
    getProducts();
  }
});
watch(selectedCounterparty, () => {

  if (selectedCounterparty.value && typeof selectedCounterparty.value === 'object') {
    getProducts();
  }
});

const headerPurchaseRef = ref(null);

function callGetDashBoardData() {
  if (headerPurchaseRef.value && headerPurchaseRef.value.getDashBoardData) {
    headerPurchaseRef.value.getDashBoardData();
  } else {
    console.error('getDashBoardData method is not defined or ref is not resolved');
  }
}

onMounted(async () => {
  await getProducts()
})
</script>

<template>
  <header-purchase ref="headerPurchaseRef" header-title="Покупка товаров"/>
  <div>
    <div class="grid grid-cols-12 gap-[16px] purchase-filter relative bottom-[43px]">
      <IconField class="col-span-6">
        <InputIcon class="pi pi-search"/>
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
      <Select
          v-model="selectedCounterparty"
          :loading="loadingCounterparty"
          :options="counterparty"
          optionLabel="name"
          placeholder="Поставщик"
          class="w-full col-span-2"
          editable
          @keyup="searchCounterparty"
      />
      <div class="flex gap-4 col-span-2">
        <fin-button
            @click="visibleFilter = true"
            severity="primary"
            class="w-[46px]"
        >
          <img src="@/assets/img/menu.svg" alt=""/>
        </fin-button>
        <fin-button
            @click="createOpen"
            severity="success"
            icon="pi pi-plus"
            class="w-[80%]"
            label="Создать"
        />
      </div>
    </div>

    <div class="bg-white mt-4 h-[75vh] overflow-auto relative bottom-[43px]">
      <Loader v-if="loader"/>
      <div v-else>
        <MethodsPurchase @get-product="getProductMethods" :select-products="selectedProduct"
                         v-if="!(!selectedProduct || !selectedProduct.length)"/>
        <DataTable
            scrollable
            scrollHeight="660px"
            v-model:selection="selectedProduct"
            :value="products"
            dataKey="id"
            tableStyle="min-width:100%"
            :metaKeySelection="metaKey"
            @row-click="onRowClick"
        >
          <Column selectionMode="multiple"></Column>
          <Column field="code" :sortable="true" header="">
            <template #header="{index}">
              <div class="w-full h-full" @click="sortData('id',index)">
                № <i
                  :class="{
              'pi pi-arrow-down': openUp[index],
              'pi pi-arrow-up': !openUp[index],
              'text-[#808BA0] text-[5px]': true
            }"
              ></i>
              </div>
            </template>
            <template #sorticon="{index}">
            </template>
            <template #body="slotProps">
            <span class="text-ellipsis block w-[90px] whitespace-nowrap overflow-hidden">
              {{ slotProps.data?.doc_number }}
            </span>
            </template>
          </Column>

          <Column field="name" :sortable="true" header="">
            <template #header="{index}">
              <div class="w-full h-full" @click="sortData('date',index)">
                Дата <i
                  :class="{
              'pi pi-arrow-down': openUp[index],
              'pi pi-arrow-up': !openUp[index],
              'text-[#808BA0] text-[5px]': true
            }"
              ></i>
              </div>
            </template>
            <template #sorticon="{index}">
            </template>
            <template #body="slotProps">
              {{ moment(new Date(slotProps.data.date)).format(" D.MM.YYYY h:mm") }}
            </template>
          </Column>
          <Column field="category" :sortable="true" header="">
            <template #header="{index}">
              <div class="w-full h-full" @click="sortData('counterparty.name',index)">
                Поставщик <i
                  :class="{
              'pi pi-arrow-down': openUp[index],
              'pi pi-arrow-up': !openUp[index],
              'text-[#808BA0] text-[5px]': true
            }"
              ></i>
              </div>
            </template>
            <template #sorticon="{index}">

            </template>
            <template #body="slotProps">
              {{ slotProps.data.counterparty?.name }}
            </template>
          </Column>
          <Column field="image" v-if="!hasOrganization" :sortable="true" header="">
            <template #header="{index}">
              <div class="w-full h-full" @click="sortData('organization.name',index)">
                Организация <i
                  :class="{
              'pi pi-arrow-down': openUp[index],
              'pi pi-arrow-up': !openUp[index],
              'text-[#808BA0] text-[5px]': true
            }"
              ></i>
              </div>
            </template>
            <template #sorticon="{index}">
            </template>
            <template #body="slotProps">
              {{ slotProps.data.organization?.name }}
            </template>
          </Column>
          <Column field="price" :sortable="true" header="">
            <template #header="{index}">
              <div class="w-full h-full" @click="sortData('sum',index)">
                Сумма <i
                  :class="{
              'pi pi-arrow-down': openUp[index],
              'pi pi-arrow-up': !openUp[index],
              'text-[#808BA0] text-[5px]': true
            }"
              ></i>
              </div>
            </template>
            <template #sorticon="{index}">
            </template>
            <template #body="slotProps">
              {{ slotProps.data.sum }}
            </template>
          </Column>
          <Column field="storage" :sortable="true" header="">
            <template #header="{index}">
              <div class="w-full h-full" @click="sortData('storage.name',index)">
                Склад <i
                  :class="{
              'pi pi-arrow-down': openUp[index],
              'pi pi-arrow-up': !openUp[index],
              'text-[#808BA0] text-[5px]': true
            }"
              ></i>
              </div>
            </template>
            <template #sorticon="{index}">
            </template>
            <template #body="slotProps">
              {{ slotProps.data.storage?.name }}
            </template>
          </Column>
          <Column field="status" :sortable="true" header="">
            <template #header="{index}">
              <div class="w-full h-full" @click="sortData('active',index)">
                Статус <i
                  :class="{
              'pi pi-arrow-down': openUp[index],
              'pi pi-arrow-up': !openUp[index],
              'text-[#808BA0] text-[5px]': true
            }"
              ></i>
              </div>
            </template>
            <template #sorticon="{index}">
            </template>
            <template #body="slotProps">
              <Tag
                  :value="getSeverity(slotProps.data.active,slotProps.data?.deleted_at).name"
                  :severity="getSeverity(slotProps.data.active,slotProps.data?.deleted_at).status"
              />
            </template>
          </Column>
          <Column field="inventoryStatus" :sortable="true" header="">
            <template #header="{index}">
              <div class="w-full h-full" @click="sortData('author.name',index)">
                Автор <i
                  :class="{
              'pi pi-arrow-down': openUp[index],
              'pi pi-arrow-up': !openUp[index],
              'text-[#808BA0] text-[5px]': true
            }"
              ></i>
              </div>
            </template>
            <template #sorticon="{index}">
            </template>
            <template #body="slotProps">
              {{ slotProps.data?.author?.name }}
            </template>
          </Column>
          <Column field="currency" :sortable="true" header="">
            <template #header="{index}">
              <div class="w-full h-full" @click="sortData('currency.name',index)">
                Валюта <i
                  :class="{
              'pi pi-arrow-down': openUp[index],
              'pi pi-arrow-up': !openUp[index],
              'text-[#808BA0] text-[5px]': true
            }"
              ></i>
              </div>
            </template>
            <template #sorticon="{index}">
            </template>
            <template #body="slotProps">
              {{ slotProps.data?.currency?.name }}
            </template>
          </Column>
        </DataTable>
      </div>
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
            :totalRecords="Number(pagination.totalPages)"
            v-model:first="first"
            @page="getProducts"
            :rowsPerPageOptions="[10, 20, 30]"
            template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            currentPageReportTemplate="{first} / {totalRecords}"
        />
      </div>
    </div>
  </div>

  <Sidebar
      v-model:visible="visibleRight"
      :show-close-icon="false"
      position="right"
      class="create-purchase"
      :dismissable="false"
  >
    <view-purchase :product-id="dateInfo.id" v-if="createOpenModal" @close-sidebar="closeFnVl" :date="dateInfo"
                   :openModalClose="openInfoModal"/>
    <CreatePurchase v-else @close-sidebar="visibleRight = false" @close-dialog="closeFn"/>
  </Sidebar>
  <Sidebar
      v-model:visible="visibleFilter"
      :show-close-icon="false"
      position="right"
      class="filters-purchase"
  >
    <filter-purchase :savedFilters="savedFilterValues" @updateFilters="handleFiltersUpdate" @clearFilter="clearFilter"/>
  </Sidebar>
  <Toast/>

</template>
<style lang="scss">
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

.create-purchase {
  width: 1154px !important;
  border-top-left-radius: 30px;
}

.filters-purchase {
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

.p-select:not(.p-disabled).p-focus {
  border-color: #3935E7 !important;
}
</style>
