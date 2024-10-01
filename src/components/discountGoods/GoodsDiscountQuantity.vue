<script setup>
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import Select from "primevue/select";
import {ref, onMounted} from "vue";
import FloatLabel from "primevue/floatlabel";
import {useAxios} from "@/composable/useAxios.js";

const emit = defineEmits([ 'sendData' ]);
const props = defineProps({
  goods:''
})

const selectedProduct = ref(null);
const selectedProductGift = ref(null);
const selectedQuantity = ref(null)
const productsId = ref([]);
const products = ref([]);

const getIdProducts = async (inputValue) => {
  const res = await useAxios(`good?search=${inputValue?.srcElement.value}`);
  productsId.value = res.result.data.map((el) => ({
    name: el.name,
    code: el.id,
    img: el.images[0]?.image ? imgURL + el.images[0].image : new URL('@/assets/img/exampleImg.svg', import.meta.url)
  }));
};

function getGoods() {
  if (props.goods !== undefined && props.goods !== null) {
    console.log(props.goods);
    const getGood = props.goods.map((el) => ({
      name: el.good.name,
      code: el.good.id,
      img: el.good.img
    }));

    const getGiftedGood = props.goods.map((el) => ({
      name: el.giftedGood.name,
      code: el.giftedGood.id,
      img: el.giftedGood.img
    }));
    getGood.forEach(good => {
      products.value.push({
        name: good.name,
        code: good.code,
        img: good.img?.image ? imgURL + good.img.image : new URL('@/assets/img/exampleImg.svg', import.meta.url),
        isGift: false
      });
    });
    getGiftedGood.forEach(giftedGood => {
      products.value.push({
        name: giftedGood.name,
        code: giftedGood.code,
        img: giftedGood.img?.image ? imgURL + giftedGood.img.image : new URL('@/assets/img/exampleImg.svg', import.meta.url),
        isGift: true
      });
    });
    console.log('setting', products.value);
  }
}


const addFn = () => {
  if (!selectedProductGift.value) {
    alert("Пожалуйста, выберите товар в подарок.");
    return;
  }

  if (selectedProduct.value && selectedQuantity.value) {
    products.value.push({
      code: selectedProduct.value.code,
      name: selectedProduct.value.name,
      img: selectedProduct.value.img,
      quantity: selectedQuantity.value,
      isGift: false
    });
  }
  if (selectedProductGift.value) {
    products.value.push({
      code: selectedProductGift.value.code,
      name: selectedProductGift.value.name,
      img: selectedProductGift.value.img,
      quantity: 1,
      isGift: true
    });
  }
  selectedProduct.value = null;
  selectedQuantity.value = null;
  selectedProductGift.value = null;
  sendData()
  console.log('Updated products:', products.value);
};


const sendData = () => {
  emit("sendData", products.value);
  console.log('send data', products.value);
}

onMounted(()=>{
  getGoods()
})

</script>

<template>
  <div class=" mt-10  border-y-[1px] zebra-border">
    <div class="flex mt-6 mb-4 gap-4 w-full">
      <FloatLabel class="w-[640px]">
        <Select
            v-model="selectedProduct"
            :options="productsId"
            optionLabel="name"
            class="w-full h-[47px] rounded-[10px]"
            editable
            @keyup="getIdProducts"
        />
        <label>Поиск по Id, наименованию, штрих коду</label>
      </FloatLabel>
      <fin-input v-model="selectedQuantity" class="w-[200px]" placeholder="Кол-во товаров"/>
    </div>
    <div class="flex mt-8 mb-6 gap-4">
      <FloatLabel class="w-[640px]">
        <Select
            v-model="selectedProductGift"
            :options="productsId"
            optionLabel="name"
            class="w-full h-[47px] rounded-[10px]"
            editable
            @keyup="getIdProducts"
        />
        <label>Поиск по Id, наименованию, штрих коду (Товар в подарок)</label>
      </FloatLabel>
      <fin-button icon="pi pi-trash" severity="warning" style="width: 46px !important; height: 46px !important;" />
      <fin-button
          @click="addFn"
          icon="pi pi-save"
          label="Сохранить"
          severity="success"
          class="p-button-lg"
      />
    </div>
  </div>
  <div class="mt-6">
    <div class="table-contract">
      <DataTable
          :value="products"
          scrollable
          scrollHeight="500px"
          class="mt-[21px]"
          editMode="row"
          tableStyle="min-width: 50rem"
      >
        <Column field="name" header="Товар" style="width: 60%; height: 62px;">
          <template #body="slotProps">
            <div class="flex items-center gap-[10px]">
              <img :src="slotProps.data?.img" alt=""
                   class="w-[32px] h-[32px] rounded-[8px] object-cover">
              <span :class="{'text-green-500': slotProps.data?.isGift}">
          {{ slotProps.data?.name }}
        </span>
            </div>
          </template>
        </Column>

        <Column field="quantity" header="Кол-во товаров">
          <template #body="slotProps">
            <span>{{ slotProps.data?.quantity }}</span>
          </template>
        </Column>

        <Column field="quantity" header="">
          <template #body="{data,index}">
            <i
                class="pi pi-trash text-[#808BA0] cursor-pointer"
            ></i>
          </template>
        </Column>
      </DataTable>

    </div>
  </div>
</template>

<style lang="scss">
.table-contract {
  .p-datatable-header-cell {
    background-color: #F2F2F2 !important;
    height: 44px !important;
  }

  .p-datepicker-input-icon-container {
    padding-top: 100px !important;
  }
}

.p-datepicker {
  border: 2px !important;
  border-radius: 10px !important;
}

.zebra-border {
  border-image: repeating-linear-gradient(
          90deg,
          #C9CED9 0px,
          #C9CED9 5px,
          white 5px,
          white 10px
  ) 20;
}
</style>
