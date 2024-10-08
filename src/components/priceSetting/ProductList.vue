<script setup>
import {ref, reactive} from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import {useStaticApi} from "@/composable/useStaticApi.js";
import {useRouter} from "vue-router";
import CardGoods from "@/components/priceSetting/CardGoods.vue";
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/pagination';

const props = defineProps({
  products: {
    type: Array,
    default: () => []
  }
})
const {
  statusList,
} = useStaticApi();

const router = useRouter();

const modules = ref([]);
const selectedProduct = ref();
const createModal = ref(false);
const visibleFilter = ref(false)
const metaKey = ref(true);
const createOpenModal = ref(false);
const openInfoModal = ref(false);
const loader = ref(true)
const sortDesc = ref('asc');
const orderBy = ref('id');
const dateInfo = ref(null);
const priceList = ref([]);
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

const openUp = ref(Array(props.products.value?.length).fill(false));

const onRowClick = (event) => {
  const product = event.data;
  createModal.value = true;
  createOpenModal.value = true
  dateInfo.value = product
};

const sortData = (field) => {
  console.log(priceList.value);
  priceList.value = props.products.goods?.find(item => item.id === field);
};
</script>

<template>
  <div class="flex gap-3 mt-5 overflow-auto w-[1600px] div_big">
    <div class="bg-white w-[32%] shadow-list h-[80vh] rounded-[10px] fixed z-10">
      <DataTable
          scrollable
          scrollHeight="660px"
          v-model:selection="selectedProduct"
          :value="props.products.goods"
          dataKey="id"
          tableStyle="max-width:100%"
          :metaKeySelection="metaKey"
          @row-click="onRowClick"
      >
        <Column selectionMode="multiple"></Column>
        <Column field="id" :sortable="true">
          <template #header="{index}">
            <div class="w-full h-full">
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
            <span @click="sortData(slotProps.data?.id)"
                  class="text-ellipsis block w-[90px] whitespace-nowrap overflow-hidden">
              {{ slotProps.data?.id }}
            </span>
          </template>
        </Column>
        <Column field="name" :sortable="true">
          <template #header="{index}">
            <div class="w-full h-full">
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
            {{ slotProps.data.name }}
          </template>
        </Column>
        <Column>
          <template #header>
            <fin-button
                severity="success"
                icon="pi pi-plus"
                label="Товар"
            />
          </template>
        </Column>
      </DataTable>
    </div>
    <swiper
        :slidesPerView="4"
        :spaceBetween="12"
        :pagination="{
      clickable: true,
    }"
        :modules="modules"
        class="mySwiper w-[60%] relative left-[350px]"
    >
      <swiper-slide v-for="item in priceList.prices" class="w-full" :key="item.id" >
        <CardGoods class="w-full" :info-list="item"/>
      </swiper-slide>
    </swiper>

    <div class="add-product relative z-10">
      <fin-button icon="pi pi-plus" severity="success"></fin-button>
    </div>
  </div>

</template>

<style scoped lang="scss">

.shadow-list {
  box-shadow: 10px 10px 10px 10px #0000000F;
}

.div_big::-webkit-scrollbar {
  width: 15px;
  height: 13px;
  transition: 1s all linear;
}

/* Track */
.div_big:hover::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgba(128, 128, 128, 0.1);
  border-radius: 10px;
}

/* Handle */
.div_big:hover::-webkit-scrollbar-thumb {
  background: #007aff;
  border-radius: 10px;
}

/* Handle on hover */
.div_big::-webkit-scrollbar-thumb:hover {
  background: #0951a4;
}

.add-product {
  border: 2px dashed #B7C7E8;
  border-radius: 10px;
  height: 80vh;
  padding: 15px;
}
</style>