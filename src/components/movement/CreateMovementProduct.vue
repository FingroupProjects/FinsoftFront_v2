<script setup>
import {onMounted, ref, watchEffect} from "vue";
import Dropdown from "primevue/dropdown";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import {useAxios} from "@/composable/useAxios.js";
import FloatLabel from "primevue/floatlabel";
import InputText from "primevue/inputtext";
import formatInputAmount from "@/constants/formatInput.js";
import formatNumber from '../../constants/formatNumber.js';
import {useClientSale} from "@/store/clientSale.js";

const emit = defineEmits(["postGoods"]);
const store = useClientSale();

const selectedProducts = ref();
const addInput = ref(false);
const products = ref([]);
const postProducts = ref([]);
const coleVo = ref("");
const price = ref("");
const sum = ref("");
const getAllSum = ref(0);
const getAllProduct = ref(0);
const productsId = ref([]);
const editingRows = ref([]);
const newProduct = ref();

const validateProduct = (product) => {
  return product.coleVo;
};

const clearInputValues = () => {
  newProduct.value = {};
  coleVo.value = "";
  price.value = "";
  sum.value = "";
  selectedProducts.value = null
};

const addFn = async () => {
  const product = {
    coleVo: coleVo.value,
    price: price.value,
    sum: sum.value,
    good_id: selectedProducts.value.code,
    products: selectedProducts.value.products,
    img: selectedProducts.value.img
  };

  if (validateProduct(product)) {
    products.value.push(product);
    postProducts.value.push({
      amount: product.coleVo,
      good_id: selectedProducts.value.code,
      price: product.price,
    });
    getAllSum.value += Number(product.sum);
    getAllProduct.value += Number(product.coleVo);
    addInput.value = false;

    emit("postGoods", {postProducts:postProducts.value,getAllProduct: getAllProduct?.value, goods: products?.value });
  }

  clearInputValues();
};

const confirmDeleteProduct = (index) => {
  const deletedProduct = products.value.splice(index, 1)[0];
  postProducts.value.splice(index, 1);
  getAllSum.value -= Number(deletedProduct.sum);
  getAllProduct.value -= Number(deletedProduct.coleVo);
};

const getIdProducts = async (inputValue) => {
  const imgURL = import.meta.env.VITE_IMG_URL;
  const res = await useAxios(`good?search=${inputValue?.srcElement.value}`);
  productsId.value = res.result.data.map((el) => ({
    products: el.name,
    code: el.id,
    img: el.images[0]?.image ? imgURL + el.images[0].image : new URL('@/assets/img/exampleImg.svg',import.meta.url)
  }));
};

const getOnBased = () =>{
  console.log('store',store.getId)
  if (store.getId !== null){
    for (const storeElement of store.getId) {
      for (const item of storeElement.goods) {
        products.value.push({
          products: item.good.name,
          coleVo: item.amount,
          img: item.image
        })
        const lastProduct = products.value[products.value.length - 1];
        postProducts.value.push({
          amount: lastProduct.coleVo,
          good_id: item.good.id,
        });
      }
    }
  }
  emit("postGoods", {postProducts:postProducts.value,getAllProduct: getAllProduct?.value, goods: products?.value });
}


const onRowEditSave = (event) => {
  const {newData, index} = event;
  const oldProduct = products.value[index];

  newData.sum = Number((newData.price * newData.coleVo).toFixed(2));

  products.value.splice(index, 1, newData);

  postProducts.value.splice(index, 1, {
    amount: newData.coleVo,
    good_id: newData.products.code || oldProduct.good_id
  });

  getAllSum.value = getAllSum.value - Number(oldProduct.sum) + Number(newData.sum);
  getAllProduct.value = getAllProduct.value - Number(oldProduct.coleVo) + Number(newData.coleVo);
};

watchEffect(() => {
  sum.value = Number((coleVo.value * price.value).toFixed(2))
});

onMounted(async () => {
  await getIdProducts();
  getOnBased()
});
</script>

<template>
  <div class="flex items-center mt-[30px] gap-[21px]">
    <div class="header-title">Товары</div>
  </div>
  <div class="filter-form grid grid-cols-12 gap-[16px] pt-[21px] pb-[21px] mt-[21px]">
    <FloatLabel class="col-span-6 h-[47px]">
      <Dropdown
          v-model="selectedProducts"
          :options="productsId"
          optionLabel="products"
          @keyup="getIdProducts"
          editable
          class="w-full h-[47px] rounded-[10px]"
      />
      <label for="">Поиск по Id, наименованию, штрих коду</label>
    </FloatLabel>
    <div class="col-span-6 flex gap-[16px]">
      <fin-input v-model="coleVo" :model-value="formatInputAmount(coleVo)" placeholder="Кол-во"/>

      <fin-button
          icon="pi pi-save"
          @click="addFn"
          label="Добавить"
          severity="success"
          class="p-button-lg"
      />
    </div>
  </div>
  <div class="table-create" v-if="products.length > 0">
    <DataTable
        :value="products"
        scrollable
        scrollHeight="280px"
        class="mt-[21px]"
        v-model:editingRows="editingRows"
        @row-edit-save="onRowEditSave"
        editMode="row"
        tableStyle="min-width: 50rem"
    >
      <Column field="products" header="Наименование">
        <template #editor="{ data, field }">
          <Dropdown
              v-model="data[field]"
              :options="productsId"
              optionLabel="products"
              placeholder="Поиск по Id, наименованию, штрих коду"
              class="h-[46px]"
              fluid
          >
            <template #value>
              <span
                  v-if="
                  data[field]?.products !== '' &&
                  data[field]?.products !== null &&
                  data[field]?.products !== undefined
                "
              >
                {{ data[field]?.products }}
              </span>
              <span
                  v-else-if="
                  data[field] !== '' &&
                  data[field] !== null &&
                  data[field] !== undefined
                "
              >
                {{ data[field] }}
              </span>
            </template>
          </Dropdown>
        </template>
        <template #body="slotProps">
           <span
               v-if="
                 slotProps.data.products?.products!== '' &&
                 slotProps.data.products?.products!== null &&
                 slotProps.data.products?.products !== undefined
                "
               class="flex items-center gap-[10px]"
           >

             <img :src="slotProps.data?.img" alt=""
                  class="w-[32px] h-[32px] rounded-[8px] object-cover">
                {{ slotProps.data.products?.products }}
              </span>
          <span
              v-else-if="
                  slotProps.data.products !== '' &&
                  slotProps.data.products !== null &&
                  slotProps.data.products !== undefined
                "
          class="flex items-center gap-[10px]"
          >
            <img :src="slotProps.data?.img" alt=""
                            class="w-[32px] h-[32px] rounded-[8px] object-cover">
                {{ slotProps.data.products }}
              </span>
        </template>
      </Column>
      <Column field="coleVo" header="Кол-во">
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" :model-value="formatInputAmount(data[field])" fluid class="w-[10%]"/>
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
      <Column
          :rowEditor="true"
          style="width: 10%; min-width: 8rem;"
          bodyStyle="text-align:center"
      >
      </Column>
    </DataTable>
  </div>

</template>
<style lang="scss">
.table-create {
  .p-datatable-header-cell {
    background: #f6f6f6;
  }

  .p-select-label {
    margin-top: 5px;
  }

  .p-datatable-row-editor-init {
    right: 80px;
  }
}
</style>

<style scoped lang="scss">
.filter-form {
  border-top: 1px dashed #dcdfe3;
  border-bottom: 1px dashed #dcdfe3;
}
</style>