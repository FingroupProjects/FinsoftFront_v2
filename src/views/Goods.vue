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
import FilterPurchase from "@/components/FilterPurchase.vue";
import Paginator from 'primevue/paginator';
import {useAxios} from "@/composable/useAxios.js";
import {useStaticApi} from "@/composable/useStaticApi.js";
import Toast from "primevue/toast";
import HeaderPurchase from "@/components/HeaderPurchase.vue";
import AddGoods from "@/components/goodsComponents/ViewGoods.vue";
import CreateGoods from "@/components/goodsComponents/createGoods.vue";
import MethodsGoods from "@/components/goodsComponents/MethodsGoods.vue";
import Loader from "@/components/ui/Loader.vue";

const {
  findStorage,
  storage,
  loadingStorage,
} = useStaticApi();

const visibleRight = ref(false);
const products = ref();
const selectedStorage = ref(null);
const selectedProduct = ref();
const selectedProductId = ref();
const search = ref('');
const selectedStatus = ref();
const first = ref(0);
const visibleFilter = ref(false);
const metaKey = ref(true);
const createOpenModal = ref(false);
const loading = ref(true);
const sortDesc = ref('asc');
const orderBy = ref('id');

const imgURL = import.meta.env.VITE_IMG_URL;
const hasOrganization = JSON.parse(localStorage.getItem('hasOneOrganization'));
const statusList = ref([
  {
    name: 'Активный',
    code: 0
  },
  {
    name: 'Не активный',
    code: 1
  },
])
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
  createOpenModal.value = true;
  visibleRight.value = true;
  selectedProductId.value = product.id
};

const handleFiltersUpdate = (filters) => {
  console.log('Received filters:', filters);
  getProducts(filters);
  visibleFilter.value = false
}


async function getProducts(filters = {}) {
  const params = {
    itemsPerPage: selectPage.value.count,
    perPage: first.value,
    search: search.value,
    storage_id: selectedStorage.value?.code,
    deleted: selectedStatus.value?.code,
    page:first.value,
    orderBy: orderBy.value,
    sort: sortDesc.value,
    ...filters,
  };
  try {
    const res = await useAxios(`good?search=`, {params});

    pagination.value.totalPages = Number(res.result.pagination.total_pages);
    products.value = res.result.data;
    return products.value;

  } catch (e) {
    console.log(e)
  } finally {
    loading.value = false
  }
}

function getProductMethods() {
  selectedProduct.value = null
  getProducts()
}

const sortData = (field, index) => {
  orderBy.value = field
  openUp.value[index] = !openUp.value[index]
  if (sortDesc.value === 'asc') sortDesc.value = 'desc'
  else sortDesc.value = 'asc'
  getProducts()
};
const getSeverity = (status) => {
  if (status == null) {
    return {
      status: "success",
      name: "Активный",
    };
  } else {
    return {
      status: "warn",
      name: "Не активный",
    };
  }
};

function closeFn(id) {
  selectedProductId.value = id
  createOpenModal.value = true
}

function closeView() {
  visibleRight.value = false
  getProducts();
}

function createOpen() {
  visibleRight.value = true
  createOpenModal.value = false
}

watch(selectedStorage, () => {
  getProducts();
});
watch(selectedStatus, () => {
  getProducts();
});
getProducts();
</script>

<template>
  <header-purchase header-title="Товары"/>
  <div>
    <div class="grid grid-cols-12 gap-[16px] purchase-filter relative bottom-[43px]">
      <IconField class="col-span-6">
        <InputIcon class="pi pi-search"/>
        <InputText
            class="w-full"
            @input="getProducts"
            v-model="search"
            placeholder="Поиск по названию, артикулу, штрих-коду"
        />
      </IconField>
      <Dropdown
          v-model="selectedStorage"
          optionLabel="name"
          placeholder="Категория"
          @click="findStorage"
          :loading="loadingStorage"
          :options="storage"
          class="w-full col-span-2"
      />
      <Dropdown
          v-model="selectedStatus"
          :options="statusList"
          optionLabel="name"
          placeholder="Статус"
          class="w-full col-span-2"
      />
      <div class="flex gap-4 col-span-2">
        <fin-button
            @click="visibleFilter = true "
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
            label="Добавить"
        />
      </div>
    </div>
    <div class="card mt-4 bg-white h-[75vh] overflow-auto relative bottom-[43px]">
      <Loader v-if="loading"/>
      <div v-else>
        <MethodsGoods @get-product="getProductMethods" :select-products="selectedProduct"
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
              <span class="text-ellipsis block w-[90px] whitespace-nowrap overflow-hidden">{{ slotProps.data?.id }}</span>
            </template>
          </Column>
          <Column field="category" :sortable="true" header="">
            <template #header="{index}">
              <div class="w-full h-full" @click="sortData('name',index)">
                Наименование <i
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
              <div class="flex items-center gap-[10px]">
                <img src="@/assets/img/exampleImg.svg" alt="" v-if="slotProps?.data?.images.length===0"
                     class="w-[32px] h-[32px] object-cover rounded-[8px]">
                <img v-else :src="imgURL+ slotProps?.data?.images[0]?.image" alt=""
                     class="w-[32px] h-[32px] object-cover rounded-[8px]">
                {{ slotProps.data?.name }}
              </div>
            </template>
          </Column>
          <Column field="image" v-if="!hasOrganization" :sortable="true" header="">
            <template #header="{index}">
              <div class="w-full h-full" @click="sortData('vendor_code',index)">
                Артикул <i
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
              {{ slotProps.data?.vendor_code }}
            </template>
          </Column>
          <Column field="price" :sortable="true" header="">
            <template #header="{index}">
              <div class="w-full h-full" @click="sortData('goodGroup.name',index)">
                Категория <i
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
              {{ slotProps.data?.goodGroup?.name }}
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
            <template #sorticon="">
            </template>
            <template #body="slotProps">
              <Tag
                  :value="getSeverity(slotProps.data?.deleted_at).name"
                  :severity="getSeverity(slotProps.data?.deleted_at).status"
              />
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

  <div class="create-purchase-sidebar">
    <Sidebar
        v-model:visible="visibleRight"
        :show-close-icon="false"
        position="right"
        class="create-purchase"
    >
      <add-goods v-if="createOpenModal" :product-id="selectedProductId" @close-sidebar="closeView"
                 @close-dialog="closeFn"/>
      <create-goods v-else @close-dialog="closeFn" @close-sidebar="closeView"/>

    </Sidebar>
  </div>

  <Sidebar
      v-model:visible="visibleFilter"
      :show-close-icon="false"
      position="right"
      class="filters-purchase"
  >
    <filter-purchase @updateFilters="handleFiltersUpdate"/>
  </Sidebar>
  <Toast/>
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

.create-purchase-sidebar {
  width: 1154px !important;
  border-top-left-radius: 30px;
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