<script setup>
import {onMounted, ref, watchEffect} from "vue";
import Dropdown from "primevue/dropdown";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import {useAxios} from "@/composable/useAxios.js";
import FloatLabel from "primevue/floatlabel";
import InputText from "primevue/inputtext";
import formatInputAmount from "@/constants/formatInput.js";
import {useClientSale} from "@/store/clientSale.js";
import Sidebar from "primevue/sidebar";
import Installment from "@/components/clientSale/Installment.vue";

const emit = defineEmits(['postGoods', 'editModal'])
const props = defineProps({
  productDate: {
    required: true
  }
})

const buttonInstallment = ref(false)
const dataInstallment = ref('')
const store = useClientSale()
const sendSumDate = ref([])
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
const visibleInstallment = ref(false);
const getOnBasedValues = ref()

const validateProduct = (product) => {
  return product.coleVo && product.price && product.sum;
};

const clearInputValues = () => {
  newProduct.value = {};
  coleVo.value = "";
  price.value = "";
  sum.value = "";
  selectedProducts.value = null
};

const getOnBased = () =>{
  getOnBasedValues.value = store.getId
  console.log('before called', products.value)
  if (store.getId !== null){
    for (const idElement of getOnBasedValues.value) {
      for (const item of idElement.goods) {
        products.value.push({
          products: item.good.name,
          coleVo: item.amount,
          price: item.price,
          sum: item.amount * item.price,
          img: item.image
        });
        const lastProduct = products.value[products.value.length - 1];

        postProducts.value.push({
          amount: lastProduct.coleVo,
          good_id: item.good.id,
          price: lastProduct.price,
        });
        sendData()
      }
    }
  }
}

const addFn = async () => {
  const product = {
    coleVo: coleVo.value,
    price: price.value,
    sum: sum.value,
    good_id: selectedProducts.value?.code || selectedProducts.value?.id,
    products: selectedProducts.value?.products,
    img: selectedProducts.value?.img
  };
  const hasProductInfo = product.coleVo !== '' && product.price !== '' && product.good_id !== undefined;
  if (hasProductInfo) {
    buttonInstallment.value = true;
    console.log('Valid product:', product);
  }

  if (validateProduct(product)) {
    products.value.push(product);
    postProducts.value.push({
      amount: product.coleVo,
      good_id: selectedProducts.value?.code,
      price: product.price,
    });
    getAllSum.value += Number(product.sum);
    getAllProduct.value += Number(product.coleVo);
    addInput.value = false;
    sendData();
  }

  clearInputValues();
};


const sendData = () => {
  console.log('Emitting data:', {
    postProducts: postProducts.value,
    getAllSum: getAllSum.value,
    getAllProduct: getAllProduct?.value,
    goods: products?.value,
    dataInstallment: dataInstallment.value
  });

  emit('postGoods', {
    postProducts: postProducts.value,
    getAllSum: getAllSum.value,
    getAllProduct: getAllProduct?.value,
    goods: products?.value,
    dataInstallment: dataInstallment.value
  });
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

const getDataInstallment = (data) => {
  dataInstallment.value = data;
  sendData()
  console.log('getting', dataInstallment.value);
};

async function closeFnVl() {
  visibleInstallment.value = false
}

async function dataToInstallment () {
  visibleInstallment.value = true
  console.log('delete',sendSumDate)
}


const onRowEditSave = (event) => {
  const {newData, index} = event;
  const oldProduct = products.value[index];
  newData.sum = Number((newData.price * newData.coleVo).toFixed(2));
  products.value.splice(index, 1, newData);
  postProducts.value.splice(index, 1, {
    amount: newData.coleVo,
    good_id: newData.products.code || oldProduct.good_id,
    price: newData.price,
  });
  getAllSum.value = getAllSum.value - Number(oldProduct.sum) + Number(newData.sum);
  getAllProduct.value = getAllProduct.value - Number(oldProduct.coleVo) + Number(newData.coleVo);
};

watchEffect(() => {
  sum.value = Number((coleVo.value * price.value).toFixed(2))
});

onMounted(async () => {
  await getIdProducts();
   getOnBased();

});
</script>

<template>
  <div class="flex items-center mt-[30px] gap-[21px]">
    <div class="header-title">Товары</div>
    <div class="ml-auto justify-end" v-if="buttonInstallment">
      <fin-button
          icon="pi pi-angle-right"
          @click="dataToInstallment()"
          label="В рассрочку"
          severity="warning"
          class="p-button-lg "
          style="height: 31px !important; font-weight: bold !important;"
      />
    </div>

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
      <fin-input v-model="price" :model-value="formatInputAmount(price)" placeholder="Цена"/>
      <fin-input v-model="sum" :model-value="formatInputAmount(sum)" placeholder="Сумма" type="number"/>
      <fin-button
          icon="pi pi-plus"
          @click="addFn"
          label="Добавить"
          severity="success"
          class="p-button-lg p-select-open"
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
            <img :src="slotProps.data?.img " class="w-[32px] h-[32px] rounded-[8px] object-cover" />
                {{ slotProps.data.products }}
              </span>
        </template>
      </Column>
      <Column field="coleVo" header="Кол-во">
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" :model-value="formatInputAmount(data[field])" fluid class="w-[10%]"/>
        </template>
      </Column>
      <Column  field="price" header="Цена">
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" :model-value="formatInputAmount(data[field])" fluid class="w-[10%]"/>
        </template>
      </Column>
      <Column field="sum" header="Сумма"></Column>
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
    <Sidebar
        v-model:visible="visibleInstallment"
        :show-close-icon="false"
        position="right"
        class="drawer-movement"
        :dismissable="false"
    >
      <Installment :allSum="getAllSum" :date="props.productDate" :products="dataInstallment" @send-data="getDataInstallment" @close-sidebar="closeFnVl" />
    </Sidebar>
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
.drawer-movement {
  width: 850px !important;
  border-top-left-radius: 30px;
}


</style>

<style scoped lang="scss">
.filter-form {
  border-top: 1px dashed #dcdfe3;
  border-bottom: 1px dashed #dcdfe3;
}
</style>