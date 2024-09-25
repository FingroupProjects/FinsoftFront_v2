\<script setup>
import {ref, watch, onMounted, reactive} from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import InputText from "primevue/inputtext";
import Select from "primevue/select";
import Drawer from "primevue/drawer"
import FilterPlanning from "@/components/planningGoods/FilterPlanning.vue";
import Paginator from 'primevue/paginator';
import {useAxios} from "@/composable/useAxios.js";
import Toast from "primevue/toast";
import HeaderPurchase from "@/components/HeaderPurchase.vue";
import ViewPlanningGoods from "@/components/planningGoods/ViewPlanningGoods.vue";
import CreatePlanningGoods from "@/components/planningGoods/CreatePlanningGoods.vue";
import MethodsPlanning from "@/components/planningGoods/MethodsPlanning.vue";
import Tag from "primevue/tag";


const visibleRight = ref(false);
const products = ref([]);
const selectedProduct = ref();
const selectedProductId = ref()
const search = ref('')
const first = ref(0)
const visibleFilter = ref(false)
const metaKey = ref(true);
const createOpenModal = ref(false);
const sortDesc = ref('asc');
const orderBy = ref('id');
const dataInfo = ref(null)

const selectedStatus = ref();
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
const savedFilterValues = reactive({
  startDate: '',
  endDate: '',
  organization_id: '',
  year: ''
});

const onRowClick = (event) => {
  const product = event.data;
  visibleRight.value = true;
  createOpenModal.value = true;
  dataInfo.value = product;
  selectedProductId.value = product.id;
};

const handleFiltersUpdate = (filters) => {
  getPlans(filters);
  Object.assign(savedFilterValues, filters);
  console.log(filters);
  visibleFilter.value = false
}

const clearFilter  = (filters) => {
  Object.assign(savedFilterValues, filters);
  visibleFilter.value = false;
  getPlans()
}

async function getPlans(filters = {}) {
  const params = {
    itemsPerPage: selectPage.value.count,
    orderBy: orderBy.value,
    perPage: first.value,
    search: search.value,
    deleted: selectedStatus.value?.code,
    page: first.value,
    ...filters,
    sort: sortDesc.value
  };
  try {
    const res = await useAxios(`/plan/goods`, {params});
    pagination.value.totalPages = Number(res.result.pagination.total_pages);
    products.value = res.result.data;
    console.log('plans',res.result.data)
    return products.value;
  } catch (e) {
    console.log(e)
  } finally {

  }
}

const getSeverity = (status) => {
  if (status === null) {
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


function getProductMethods() {
  selectedProduct.value = null
  getPlans()
}

function closeFn(result) {
  dataInfo.value = result
  console.log('data info',dataInfo.value)
  createOpenModal.value = true
  getPlans();
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
  getPlans()
};

async function closeFnVl() {
  await getPlans();
  visibleRight.value = false
}

const debounceSearch = ref(null);
watch(search, () => {
  clearTimeout(debounceSearch.value);
  debounceSearch.value = setTimeout(() => {
    getPlans();
  }, 500);
});

onMounted(() => {
  getPlans();
  getSeverity()
});
</script>

<template>
  <header-purchase header-title="Планирование Товары"/>

  <div >
    <div class="grid grid-cols-8 gap-[16px] purchase-filter relative bottom-[43px]">
      <IconField class="col-span-6">
        <InputIcon class="pi pi-search"/>
        <InputText
            class="w-full"
            @input="getPlans"
            v-model="search"
            placeholder="Поиск"
        />
      </IconField>

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

    <div class="card mt-4 bg-white h-[75vh] overflow-auto relative bottom-[43px]">
      <methods-planning @get-product="getProductMethods" :select-products="selectedProduct"
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
        <Column field="name" :sortable="true" header="">
          <template #header="{index}">
            <div class="w-full h-full" @click="sortData('name',index)">
              Год <i

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
            {{ slotProps.data.year }}
          </template>
        </Column>
        <Column field="director" :sortable="true" header="">
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
            {{ slotProps.data.organization.name }}
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
                :value="getSeverity(slotProps.data?.deleted_at).name"
                :severity="getSeverity(slotProps.data?.deleted_at).status"
            />
          </template>
        </Column>

      </DataTable>
      <div class="paginator-dropdown bg-white sticky left-0 top-[100%]">
        <span class="paginator-text"> Элементов на странице: </span>
        <Select
            v-model="selectPage"
            @update:model-value="getPlans"
            :options="pageCounts"
        >
          <template #value="slotProps">{{ slotProps.value.count }}</template>
          <template #option="slotProps">
            {{ slotProps.option.count }}
          </template>
        </Select>
        <Paginator
            :rows="1"
            :totalRecords="Number(pagination.totalPages)"
            v-model:first="first"
            @page="getPlans"
            :rowsPerPageOptions="[10, 20, 30]"
            template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            currentPageReportTemplate="{first} / {totalRecords}"
        />
      </div>
    </div>
  </div>


  <div class="create-purchase-sidebar">
    <Drawer
        v-model:visible="visibleRight"
        :show-close-icon="false"
        position="right"
        class="create-purchase"
        :dismissable="false"
    >

      <view-planning-goods
          v-if="createOpenModal"
          :id-planning="dataInfo.id"
          :data="dataInfo"
          @close-sidebar="closeFnVl"
      />
      <create-planning-goods v-else @close-sidebar="visibleRight = false" @close-dialog="closeFn"/>
    </Drawer>
  </div>

  <Drawer
      v-model:visible="visibleFilter"
      :show-close-icon="false"
      position="right"
      class="filters-purchase"
  >
    <filter-planning :savedFilters="savedFilterValues" @updateFilters="handleFiltersUpdate" @clearFilter="clearFilter" />
  </Drawer>
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

.p-invalid {
  border: 1px solid #f2376f !important;
}

.p-select:not(.p-disabled).p-focus {
  border-color: #3935E7 !important;
}
</style>
