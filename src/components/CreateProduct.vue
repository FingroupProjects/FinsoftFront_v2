<script setup>
import { ref, watchEffect, onMounted,computed } from "vue";
import Dropdown from "primevue/dropdown";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { useAxios } from "@/composable/useAxios.js";
import FloatLabel from "primevue/floatlabel";
import InputText from "primevue/inputtext";

const emit = defineEmits(["postGoods"]);

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
  return product.coleVo && product.price && product.sum;
};
const formattedCardNumber = computed({
  get() {
    const cardNumberWithoutSpaces = price.value.replace(/\s/g, '');
    const formattedNumber = cardNumberWithoutSpaces.replace(/\B(?=(\d{4})+(?!\d))/g, ' ');
    return formattedNumber;
  },
  set(value) {
    const regex = /\D/g; // Regular expression to remove non-digits
    price.value = value.replace(regex, '');
  }
});


const clearInputValues = () => {
  newProduct.value = {};
  coleVo.value = "";
  price.value = "";
  sum.value = "";
  selectedProducts.value=null
};

const addFn = async () => {
  const product = {
    coleVo: coleVo.value,
    price: price.value,
    sum: sum.value,
    good_id: selectedProducts.value.code,
    products: selectedProducts.value.products,
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

    emit("postGoods", postProducts.value);
  }

  clearInputValues();
};

const confirmDeleteProduct = (index) => {
  const deletedProduct = products.value.splice(index, 1)[0];
  postProducts.value.splice(index, 1);
  getAllSum.value -= Number(deletedProduct.sum);
  getAllProduct.value -= Number(deletedProduct.coleVo);
};

const getIdProducts = async () => {
  const res = await useAxios(`good?search=3412123123`);
  productsId.value = res.result.data.map((el) => ({
    products: el.name,
    code: el.id,
  }));
};

const onRowEditSave = (event) => {
  const { newData, index } = event;
  const oldProduct = products.value[index];

  products.value.splice(index, 1, newData); // Update product in place
  postProducts.value.splice(index, 1, {
    amount: newData.coleVo,
    good_id: newData.products.code,
    price: newData.price,
  });

  getAllSum.value -= Number(oldProduct.sum);
  getAllSum.value += Number(newData.sum);

  getAllProduct.value -= Number(oldProduct.coleVo);
  getAllProduct.value += Number(newData.coleVo);
  products.value.sum = newData.price * getAllProduct.value;
  console.log(postProducts);
};

watchEffect(() => {
  sum.value = coleVo.value * price.value;
});

onMounted(async () => {
  await getIdProducts();
});
</script>

<template>
  <div class="flex items-center mt-[30px] gap-[21px]">
    <div class="header-title">Товары</div>
  </div>
  <div
    class="filter-form grid create-purchase grid-cols-12 gap-[16px] pt-[21px] pb-[21px] mt-[21px]"
  >
    <FloatLabel class="col-span-6">
      <Dropdown
        v-model="selectedProducts"
        :options="productsId"
        optionLabel="products"
        class="w-full"
      />
      <label for="">Поиск по Id, наименованию, штрих коду</label>
    </FloatLabel>
    <div class="col-span-6 flex gap-[16px]">
      <fin-input v-model="coleVo" placeholder="Кол-во" type="number"/>
      <fin-input v-model="price" placeholder="Цена" type="number" />
      <fin-input v-model="sum" placeholder="Сумма" type="number" />
      <fin-button
        icon="pi pi-save"
        @click="addFn"
        label="Сохранить"
        severity="success"
        class="p-button-lg"
      />
    </div>
  </div>
  <div class="table-create" v-if="products.length > 0">
    <DataTable
      :value="products"
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
              >
                {{ slotProps.data.products?.products }}
              </span>
              <span
                v-else-if="
                  slotProps.data.products !== '' &&
                  slotProps.data.products !== null &&
                  slotProps.data.products !== undefined
                "
              >
                {{slotProps.data.products }}
              </span>
        </template>
      </Column>
      <Column field="coleVo" header="Кол-во">
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" fluid class="w-[10%]" />
        </template>
      </Column>
      <Column field="price" header="Цена">
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" fluid class="w-[10%]" />
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
        style="width: 10%; min-width: 8rem"
        bodyStyle="text-align:center"
      ></Column>
    </DataTable>
  </div>

  <div
    class="rounded-[10px] flex justify-between items-center p-[18px] mt-[16px] bg-[#F6F6F6]"
  >
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
        {{ getAllProduct }}
      </div>
      <div class="text-[22px] text-[#141C30] leading-[22px] font-semibold">
        <div
          class="text-[13px] text-[#808BA0] leading-[13px] font-semibold mb-[8px]"
        >
          Товаров
        </div>
        {{ products.length }}
      </div>
      <div class="text-[22px] text-[#141C30] leading-[22px] font-semibold">
        <div
          class="text-[13px] text-[#808BA0] leading-[13px] font-semibold mb-[8px]"
        >
          Сумма
        </div>
        {{ getAllSum.toLocaleString() }}
      </div>
    </div>
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
}
</style>

<style scoped lang="scss">
.filter-form {
  border-top: 1px dashed #dcdfe3;
  border-bottom: 1px dashed #dcdfe3;
}
</style>
