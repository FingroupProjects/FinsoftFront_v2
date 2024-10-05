<script setup>
import {onMounted, ref, watch, reactive} from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import InputText from "primevue/inputtext";
import Tag from "primevue/tag";
import Dropdown from "primevue/dropdown";
import Paginator from 'primevue/paginator';
import {useAxios} from "@/composable/useAxios.js";
import moment from "moment";
import {useStaticApi} from "@/composable/useStaticApi.js";
import MethodsPurchase from "@/components/purchase/MethodsPurchase.vue";
import HeaderPurchase from "@/components/HeaderPurchase.vue"
import Loader from "@/components/ui/Loader.vue";
import {useRouter} from "vue-router";

const {
  findStatus,
  statusList,
  loadingStatus,
} = useStaticApi();

const router = useRouter();

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
const dateInfo = ref(null);
const headerPurchaseRef = ref(null);
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
    const res = await useAxios(`/price-set-up`, {params});
    pagination.value.totalPages = Number(res.result.pagination.total_pages);
    products.value = res.result.data;
  } catch (e) {
    console.log(e);
  } finally {
    loader.value = false;
  }

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

function createOpen() {
  router.push('/price-list')
}

const sortData = (field, index) => {
  orderBy.value = field
  openUp.value[index] = !openUp.value[index]
  if (sortDesc.value === 'asc') sortDesc.value = 'desc'
  else sortDesc.value = 'asc'
  getProducts()
};

function callGetDashBoardData() {
  if (headerPurchaseRef.value && headerPurchaseRef.value.getDashBoardData) {
    headerPurchaseRef.value.getDashBoardData();
  } else {
    console.error('getDashBoardData method is not defined or ref is not resolved');
  }
}

watch(selectedCounterparty, () => {
  if (selectedCounterparty.value && typeof selectedCounterparty.value === 'object') {
    getProducts();
  }
});

onMounted(async () => {
  await getProducts()
})
</script>

<template>
  <header-purchase ref="headerPurchaseRef" header-title="Покупка товаров"/>
  <div>
    <div class="grid grid-cols-12 gap-[16px] purchase-filter relative bottom-[43px]">
      <IconField class="col-span-8">
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
          placeholder="Статус"
          @click="findStatus"
          :loading="loadingStatus"
          :options="findStatus"
          class="w-full col-span-2"
      />
      <div class="flex gap-4 col-span-2">
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
.p-select:not(.p-disabled).p-focus {
  border-color: #3935E7 !important;
}
</style>