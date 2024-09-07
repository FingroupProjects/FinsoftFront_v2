<script setup>
import {onMounted, ref, watch, watchEffect} from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import {useAxios} from "@/composable/useAxios.js";
import FloatLabel from "primevue/floatlabel";
import Select from "primevue/dropdown";
import inputText from 'primevue/inputtext'
import InputText from 'primevue/inputtext'
import formatInputaccounting_quantity from "@/constants/formatInput.js";
import formatNumber from '../../constants/formatNumber.js'
import {usePurchaseStore} from "@/store/pruchase.js";

const emit = defineEmits([ 'editModal']);
const props = defineProps({
      infoGoods: Object
    },
);
const store = usePurchaseStore();
const goods = ref([]);
const selectedProducts = ref();
const addInput = ref(false);
const accounting_quantity = ref("");
const actual_quantity = ref("");
const difference = ref("");
const getAllSum = ref(0);
const getAllProduct = ref(0);
const productsId = ref([]);
const editingRows = ref([]);
const newProduct = ref();
const editModalOpen = ref(true);

const imgURL = import.meta.env.VITE_IMG_URL;

const clearInputValues = () => {
  newProduct.value = {};
  accounting_quantity.value = "";
  actual_quantity.value = "";
  difference.value = "";
  selectedProducts.value = null;
};

const validateProduct = (product) => {
  return product.accounting_quantity && product.actual_quantity && product.difference;
};

const addFn = async () => {
  const product = {
    accounting_quantity: accounting_quantity.value,
    actual_quantity: actual_quantity.value,
    difference: (Number(accounting_quantity.value) - Number(actual_quantity.value)).toFixed(2),
    good_id: selectedProducts.value.code,
    name: selectedProducts.value.products,
    img: selectedProducts.value.img,

  };

  if (validateProduct(product)) {
    goods.value.push(product);
    store.postGoods.push({
      accounting_quantity: product.accounting_quantity,
      good_id: selectedProducts.value?.code,
      actual_quantity: product.actual_quantity,
      difference: parseFloat(product.difference),
    })
    getAllSum.value += Number(product.actual_quantity);
    getAllProduct.value += Number(product.accounting_quantity);
    addInput.value = false;
  }
  clearInputValues();
};

const confirmDeleteProduct = async (index, indexProduct) => {
  store.postGoods.splice(indexProduct, 1)
  goods.value.splice(indexProduct, 1)
  getAllProduct.value = goods.value.reduce((total, el) => {
    return total + (el?.accounting_quantity || 0);
  }, 0);

  getAllSum.value = goods.value.reduce((total, el) => {
    return total + (el?.actual_quantity || 0);
  }, 0);
  emit('editModal', editModalOpen.value)
  try {
    const response = await useAxios(`/document/delete-document-goods`, {
      method: "POST",
      data: {
        ids: [index],
      },
      headers: {
        'permission': 1
      }
    });
  } catch (error) {
  }
};

const getIdProducts = async (inputValue) => {
  const res = await useAxios(`good?search=${inputValue?.srcElement.value}`);
  productsId.value = res.result.data.map((el) => ({
    products: el.name,
    code: el.id,
    img: el.images[0]?.image ? imgURL + el.images[0].image : new URL('@/assets/img/exampleImg.svg', import.meta.url)
  }));
};

const onRowEditSave = (event) => {
  const {newData, index} = event;
  const oldProduct = goods.value[index];
  newData.difference = Number((newData.actual_quantity * newData.accounting_quantity).toFixed(2));
  goods.value.splice(index, 1, newData);

  store.postGoods.splice(index, 1, {
    accounting_quantity: newData.accounting_quantity,
    id: oldProduct.id,
    good_id: oldProduct.good_id,
    actual_quantity: newData.actual_quantity,
  });

  getAllSum.value = getAllSum.value - Number(oldProduct.actual_quantity) + Number(newData.accounting_quantity);
  getAllProduct.value = getAllProduct.value - Number(oldProduct.accounting_quantity) + Number(newData.accounting_quantity);
  emit('editModal', editModalOpen.value);
};

const getGood = async () => {
  try {
      const items = props.infoGoods.inventoryGoods;
      goods.value = items.map((item) => ({
        id: item.id,
        good_id: item.good.id,
        name: item.good.name,
        accounting_quantity: item.accounting_quantity,
        actual_quantity: item.actual_quantity,
        difference: item.accounting_quantity - item.actual_quantity,
        img: item.image ? imgURL + item.image : new URL('@/assets/img/exampleImg.svg', import.meta.url),
        created: false,
        updated: false,
        deleted: false,
      }));

      getAllProduct.value = items.reduce((total, el) => total + (el?.accounting_quantity || 0), 0);
      getAllSum.value = props.infoGoods.actual_quantity || 0;
  } catch (error) {
    console.error('Error in getGood:', error);
  }
};


watchEffect(() => {
  difference.value = Number((accounting_quantity.value - actual_quantity.value).toFixed(2));
});

onMounted(async () => {
  await getIdProducts();

});
watchEffect(() => {
  getGood();
})
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
      <fin-input v-model="accounting_quantity" :model-value="formatInputaccounting_quantity(accounting_quantity)" placeholder="Факт.кол"/>
      <fin-input v-model="actual_quantity" :model-value="formatInputaccounting_quantity(actual_quantity)" placeholder="Физ.кол"/>
      <fin-input v-model="difference" :model-value="formatInputaccounting_quantity(difference)" placeholder="Разница"/>
      <fin-button
          icon="pi pi-plus"
          @click="addFn"
          label="Добавить"
          severity="success"
          class="p-button-lg"
      />
    </div>
  </div>

  <div class="purchase-table-header" v-if="goods?.length > 0">
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
        <template #body="slotProps">
          <div class="flex items-center gap-[10px]">
            <img :src="slotProps.data?.img" alt=""
                 class="w-[32px] h-[32px] rounded-[8px] object-cover">
            <span>{{ slotProps.data?.name }}</span>
          </div>
        </template>
      </Column>
      <Column field="accounting_quantity" header="Факт.кол">
        <template #editor="{ data, field }">
          <input-text v-model="data[field]" fluid :model-value="formatInputaccounting_quantity(data[field])"/>
        </template>
      </Column>
      <Column field="actual_quantity" header="Физ.кол">
        <template #editor="{ data, field }">
          <input-text v-model="data[field]" :model-value="formatInputaccounting_quantity(data[field])" fluid/>
        </template>
      </Column>
      <Column field="difference" header="Разница"></Column>
      <Column field="quantity" header="">
        <template #body="{data,index}">
          <i
              @click="confirmDeleteProduct(data.id,index)"
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
          <div class="text-[13px] text-[#808BA0] leading-[13px] font-semibold mb-[8px]">
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
        <div class="text-[22px] text-[#141C30] leading-[22px] font-semibold">
          <div class="text-[13px] text-[#808BA0] leading-[13px] font-semibold mb-[8px]">
            Сумма
          </div>
          {{ formatNumber(getAllSum) }}
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
