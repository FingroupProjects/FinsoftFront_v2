<script setup>
import {onMounted, ref, reactive} from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Dropdown from "primevue/dropdown";
import Paginator from 'primevue/paginator';
import {useAxios} from "@/composable/useAxios.js";
import moment from "moment";
import {useStaticApi} from "@/composable/useStaticApi.js";
import {useRouter} from "vue-router";
import Sidebar from "primevue/sidebar";
import CreateProduct from "@/components/priceSetting/CreateProduct.vue";
import CardGoods from "@/components/priceSetting/CardGoods.vue";

const {
  statusList,
} = useStaticApi();

const router = useRouter();

const selectedProduct = ref();
const createModal = ref(false);
const products = ref([]);
const first = ref(0)
const visibleFilter = ref(false)
const metaKey = ref(true);
const createOpenModal = ref(false);
const openInfoModal = ref(false);
const loader = ref(true)
const sortDesc = ref('asc');
const orderBy = ref('id');
const dateInfo = ref(null);
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
  createModal.value = true;
  createOpenModal.value = true
  dateInfo.value = product
};

const getProducts = async (filters = {}) => {
  const params = {
    itemsPerPage: selectPage.value.count,
    orderBy: orderBy.value,
    perPage: first.value,
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

const sortData = (field, index) => {
  orderBy.value = field
  openUp.value[index] = !openUp.value[index]
  if (sortDesc.value === 'asc') sortDesc.value = 'desc'
  else sortDesc.value = 'asc'
  getProducts()
};

onMounted(async () => {
  await getProducts()
})
</script>

<template>
  <div class="flex gap-3 mt-5">
    <div class="bg-white w-[32%] shadow-list h-[80vh] overflow-auto rounded-[10px]">
      <div>
        <DataTable
            scrollable
            scrollHeight="660px"
            v-model:selection="selectedProduct"
            :value="products"
            dataKey="id"
            tableStyle="max-width:100%"
            :metaKeySelection="metaKey"
            @row-click="onRowClick"
        >
          <Column selectionMode="multiple"></Column>
          <Column field="code" :sortable="true">
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
          <Column field="name" :sortable="true">
            <template #header="{index}">
              <div class="w-full h-full" @click="sortData('date',index)">
                Товары <i
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
          <Column>
            <template #header>
              <fin-button
                  @click="createModal = true"
                  severity="success"
                  icon="pi pi-plus"
                  label="Товар"
              />
            </template>
          </Column>
        </DataTable>
      </div>
      <div class="paginator-dropdown pagination-price-list  bg-white sticky top-[100%]">
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
    <CardGoods/>
    <div class="add-product">
      <fin-button icon="pi pi-plus" severity="success"></fin-button>
    </div>
  </div>
  <Sidebar
      v-model:visible="createModal"
      :show-close-icon="false"
      position="right"
      class="create-purchase"
      :dismissable="false"
  >
    <CreateProduct @close-sidebar="createModal = false"/>
  </Sidebar>
</template>

<style scoped lang="scss">
.shadow-list{
  box-shadow:10px 10px 10px 10px #0000000F;
}
.add-product {
  border: 2px dashed #B7C7E8;
  border-radius: 10px;
  height: 80vh;
  padding: 15px;
}

</style>