<script setup>
import {onMounted, ref, watchEffect} from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import {useAxios} from "@/composable/useAxios.js";
import FloatLabel from "primevue/floatlabel";
import Select from "primevue/dropdown";
import {useVuelidate} from "@vuelidate/core";
import inputText from 'primevue/inputtext'
import InputText from 'primevue/inputtext'
import formatInputAmount from "@/constants/formatInput.js";
import formatNumber from '../constants/formatNumber.js'

const v$ = useVuelidate();

const emit = defineEmits(["postGoods",'editModal']);

const goods = ref([]);
const selectedProducts = ref();
const addInput = ref(false);
const postProducts = ref([]);
const amount = ref("");
const price = ref("");
const sum = ref("");
const getAllProduct = ref(0);
const productsId = ref([]);
const editingRows = ref([]);
const newProduct = ref();
const editModalOpen = ref(true)
const imgURL = import.meta.env.VITE_IMG_URL;
const validateProduct = (product) => {
  return product.amount;
};
const props = defineProps({
  productId:{
    required: true,
  }
});

const clearInputValues = () => {
  newProduct.value = {};
  amount.value = "";
  price.value = "";
  sum.value = "";
  selectedProducts.value = null;
};

const addFn = async () => {
  const product = {
    amount: amount.value,
    good_id: selectedProducts.value.code,
    name: selectedProducts.value.products,
    img: selectedProducts.value.img,
    created: true,
    deleted: false,
    updated: false
  };

  if (validateProduct(product)) {
    goods.value.push(product);
    postProducts.value.push({
      amount: product.amount,
      good_id: selectedProducts.value.code,
      price: product.price,
    });
    getAllProduct.value += Number(product.amount);
    addInput.value = false;

    emit("postGoods", { goods: postProducts.value });
  }

  clearInputValues();
};

const confirmDeleteProduct = (index) => {
  postProducts.value.splice(index, 1);
  goods.value.splice(index, 1);
  getAllProduct.value = goods.value.reduce((total, el) => {
    return el?.amount -total;
  }, 0);
  if (goods.value.length === 0){
    getAllProduct.value = 0
  }
  emit('editModal',editModalOpen.value)
};

const getIdProducts = async (inputValue) => {
  const res = await useAxios(`good?search=${inputValue?.srcElement.value}`);
  productsId.value = res.result.data.map((el) => ({
    products: el.name,
    code: el.id,
    img: el.images[0]?.image ? imgURL + el.images[0].image : new URL('@/assets/img/exampleImg.svg',import.meta.url)
  }));
};

const onRowEditSave = (event) => {
  const { newData, index } = event;
  const oldProduct = goods.value[index];
  newData.sum = Number((newData.price * newData.amount).toFixed(2));
  goods.value.splice(index, 1, newData);
  postProducts.value.splice(index, 1, {
    amount: newData.amount,
    good_id: newData.good_id || oldProduct.good_id,
    price: newData.price,
  });


  getAllProduct.value = getAllProduct.value - Number(oldProduct.amount) + Number(newData.amount);
  emit('editModal',editModalOpen.value)
};

const getGood = async () => {
  try {
    const res = await useAxios(`/document/movement/${props.productId}`);
    const items = res.data.goods;

    goods.value = items.map((item) => ({
      good_id: item.good.id,
      name: item.good.name,
      amount: item.amount,
      price: item.price,
      sum: item.price * item.price,
      img: item.image ? imgURL + item.image : new URL('@/assets/img/exampleImg.svg',import.meta.url),
      created: false,
      updated: false,
      deleted: false,
    }));


  } catch (error) {
    console.log(error);
  }
};



onMounted(async () => {
  await getIdProducts();
  await getGood();
});
</script>

<template>
  <div class="filter-form grid grid-cols-12 gap-[16px] pt-[21px] pb-[21px] mt-[21px]">
      <FloatLabel class="col-span-6">
        <Select
            v-model="selectedProducts"
            :options="productsId"
            optionLabel="products"
            class="w-full h-[47px] rounded-[10px]"
            editable
            @keyup="getIdProducts"
        >
        </Select>
        <label for="">Поиск по Id, наименованию, штрих коду</label>
      </FloatLabel>
      <div class="col-span-6 flex gap-[16px]">
        <fin-input v-model="amount" :model-value="formatInputAmount(amount)" placeholder="Кол-во" />
        <fin-button
            icon="pi pi-plus"
            @click="addFn"
            label="Добавить"
            severity="success"
            class="p-button-lg"
        />
      </div>
    </div>

  <div class="purchase-table-header" v-if="goods.length > 0">
    <DataTable
        :value="goods"
        scrollable
        scrollHeight="280px"
        class="mt-[21px]"
        v-model:editingRows="editingRows"
        @row-edit-save="onRowEditSave"
        editMode="row"
        tableStyle="min-width: 50rem"
    >
      <Column field="name" header="Наименование">
        <template #editor="{ data, field }">
          <Select
              v-model="data[field]"
              :options="productsId"
              optionLabel="name"
              placeholder="Поиск по Id, наименованию, штрих коду"
              class="h-[46px]"
              fluid
          >
            <template #value>
              <span v-if="data[field]">{{ data[field] }}</span>
              <span v-else>{{ data[field] }}</span>
            </template>

          </Select>
        </template>

      </Column>
      <Column field="amount" header="Кол-во">
        <template #editor="{ data, field }">
          <input-text v-model="data[field]" fluid :model-value="formatInputAmount(data[field])"/>
        </template>
      </Column>

      <Column field="quantity" header="">
        <template #body="{ index }">
          <i
              @click="confirmDeleteProduct(index)"
              class="pi pi-trash text-[#808BA0] cursor-pointer"
          ></i>
        </template>
      </Column>
      <Column :rowEditor="true"
              style="width: 0; min-width: 7rem;"
              bodyStyle="text-align:center"></Column>
    </DataTable>
  </div>
  <div class="summary-container">
    <div class="rounded-[10px] flex justify-between items-center p-[18px] mt-4 bg-[#F6F6F6]">
      <div class="text-[#141C30] font-semibold text-[20px] leading-[20px]">
        Итого:
      </div>
      <div class="flex gap-[49px]">
        <div class="text-[22px] text-[#141C30] leading-[22px] font-semibold">
          <div
              class="text-[13px] text-[#808BA0] leading-[13px] font-semibold mb-[8px]"
          >
            Кол-во
          </div>
          {{ formatNumber(getAllProduct) }}
        </div>
        <div class="text-[22px] text-[#141C30] leading-[22px] font-semibold">
          <div class="text-[13px] text-[#808BA0] leading-[13px] font-semibold mb-[8px]">
            Товаров
          </div>
          {{ goods?.length }}
        </div>

      </div>
    </div>
  </div>
</template>

<style lang="scss">
.card-sidebar {
  .p-component {
    height: 48px !important;
    border-radius: 10px !important;
    border-color: #DCDFE3 !important;
  }
}

.purchase-table-header {
  .p-datatable-header-cell {
    background: #f6f6f6 !important;
  }

  .p-datatable-row-editor-init {
    right: 40px;
  }

  .p-datatable-table-container::-webkit-scrollbar {
    width: 4px !important;
    height: 3px !important;
  }

  .p-datatable-table-container::-webkit-scrollbar-track {
    background-color: #f1f1f1 !important;
    height: 3px !important;
  }

  .p-datatable-table-container::-webkit-scrollbar-thumb {
    background-color: #3935E7 !important;
    border-radius: 6px !important;
    height: 3px !important;
  }

  .p-datatable-table-container::-webkit-scrollbar-thumb:hover {
    background-color: #3935E7;
    height: 3px !important;
  }
}
</style>
