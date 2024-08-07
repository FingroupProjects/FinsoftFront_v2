<script setup>
import { ref, watchEffect, onMounted, reactive } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { useAxios } from "@/composable/useAxios.js";
import FloatLabel from "primevue/floatlabel";
import Dropdown from "primevue/dropdown";
import { useVuelidate } from "@vuelidate/core";

const v$ = useVuelidate();

const emit = defineEmits(["postGoods"]);

const goods = ref([]);
const selectedProducts = ref();
const addInput = ref(false);
const products = ref([]);
const postProducts = ref([]);
const amount = ref("");
const price = ref("");
const sum = ref("");
const getAllSum = ref(0);
const getAllProduct = ref(0);
const productsId = ref([]);
const editingRows = ref([]);
const newProduct = ref();
const editing = reactive({});

const validateProduct = (product) => {
  return product.amount && product.price && product.sum;
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
    price: price.value,
    sum: sum.value,
    good_id: selectedProducts.value.code,
    products: selectedProducts.value.products,
  };

  if (validateProduct(product)) {
    goods.value.push(product);
    postProducts.value.push({
      amount: product.amount,
      good_id: selectedProducts.value.code,
      price: product.price,
    });
    getAllSum.value += Number(product.sum);
    getAllProduct.value += Number(product.amount);
    getAllProduct.value += Number(product.price);

    addInput.value = false;

    emit("postGoods", postProducts.value);
  }

  clearInputValues();
};

const confirmDeleteProduct = (index) => {
  const deletedProduct = goods.value.splice(index, 1)[0];  // Update goods
  postProducts.value.splice(index, 1);
  getAllSum.value -= Number(deletedProduct.sum);
  getAllProduct.value -= Number(deletedProduct.amount);
  getAllProduct.value -= Number(deletedProduct.price);
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
  const oldProduct = goods.value[index];

  goods.value.splice(index, 1, newData); // Update goods
  postProducts.value.splice(index, 1, {
    amount: newData.amount,
    good_id: newData.products.code,
    price: newData.price,
  });

  getAllSum.value -= Number(oldProduct.sum);
  getAllSum.value += Number(newData.sum);

  getAllProduct.value -= Number(oldProduct.amount);
  getAllProduct.value += Number(newData.amount);
  getAllProduct.value -= Number(oldProduct.price);
  getAllProduct.value += Number(newData.price);
  goods.value.sum = newData.price * getAllProduct.value;
  console.log(postProducts);
};

const editColumn = (rowIndex, field) => {
  editing[rowIndex] = editing[rowIndex] || {};
  editing[rowIndex][field] = true;
};

const saveChanges = (rowIndex, field) => {
  if (editing[rowIndex]) {
    delete editing[rowIndex][field];

    goods.value[rowIndex].updated = true;
  }
};

const isEditing = (rowIndex, field) => {
  return editing[rowIndex] && editing[rowIndex][field];
};

const deleteItem = (rowIndex) => {
  goods.value[rowIndex].deleted = true;
};

const getGood = async () => {
  try {
    const res = await useAxios(`/document/show/${props.productId}`);
    const items = res.result.goods;
    const sum = res.result.sum;

    const imgURL = import.meta.env.VITE_IMG_URL;

    goods.value = items.map((item) => ({
      name: item.good.name,
      amount: item.amount,
      price: item.price,
      sum: item.price * item.price,
      photo: item.image ? `${imgURL}${item.image}` : '',
      created: false,
      updated: false,
      deleted: false,
    }));

    getAllSum.value = sum;
    getAllProduct.value = items.reduce((total, item) => total + Number(item.amount), 0);
    console.log('name',goods.value)
  } catch (error) {
    console.log(error);
  }
};

const updateGoods = async () => {
  const result = await v$.value.$validate();
  if (result) {
    try {
      const filteredGoods = goods.value.filter(good => good.created || good.updated || good.deleted);

      const res = await useAxios(`/document/update/${props.productId}`, {
        method: 'PATCH',
        data: {
          goods: filteredGoods
        }
      });

      // Handle the response if necessary
      console.log(res.data);
    } catch (e) {
      console.error(e);
    }
  }
};

watchEffect(() => {
  sum.value = amount.value * price.value;

});

onMounted(async () => {
  await getIdProducts();
  await getGood();
  console.log('sum',sum.value)
});
</script>

<template>
  <div class="card-sidebar">
    <div class="filter-form grid grid-cols-12 gap-[16px] pt-[21px] pb-[21px] mt-[21px]">
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
        <fin-input v-model="amount" placeholder="Кол-во" />
        <fin-input v-model="price" placeholder="Цена" />
        <fin-input v-model="sum" placeholder="Сумма" />
        <fin-button
            icon="pi pi-save"
            @click="addFn"
            label="Сохранить"
            severity="success"
            class="p-button-lg"
        />
      </div>
    </div>
    <div class="table-create" v-if="goods.length > 0">
      <DataTable
          :value="goods"
          class="mt-[21px]"
          v-model:editingRows="editingRows"
          @row-edit-save="onRowEditSave"
          editMode="row"
          tableStyle="min-width: 50rem"
      >
        <Column field="name" header="Наименование">
          <template #editor="{ data, field }">
            <Dropdown
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
            </Dropdown>
          </template>
        </Column>
          <Column field="amount" header="Кол-во">
          <template #editor="{ data, field }">
            <fin-input v-model="data[field]" fluid  />
          </template>
        </Column>
        <Column field="price" header="Цена">
          <template #editor="{ data, field }">
            <fin-input v-model="data[field]" fluid  />
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
            bodyClass="w-[7%]"
            headerStyle="min-width: 4rem"
        ></Column>
      </DataTable>
    </div>
    <div class="footer-card flex justify-end text-[18px] mt-[30px] p-[15px] bg-[#F5F6FA]">
      <p class="mr-[15px]">Итого: </p>
      <span class="font-[600]">{{ getAllSum }} ₽</span>
    </div>
  </div>
</template>

<style scoped>

.table-create {
  margin-top: 1rem;
}
</style>
