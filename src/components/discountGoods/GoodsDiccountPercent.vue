<script setup>
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import Select from "primevue/select";
import { ref, onMounted } from "vue";
import FloatLabel from "primevue/floatlabel";
import { useAxios } from "@/composable/useAxios.js";

const emit = defineEmits([ 'sendData' ]);
const props = defineProps({
  goods:''
})

const selectedProducts = ref(null);
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

function getData(){
  if (props.goods !== undefined && props.goods !== null){
    const getProd = props.goods
    products.value = getProd.map((el) => ({
      id: el.id,
      name: el.good.name,
      code: el.good.id,
      img: el.good.img?.image ? imgURL + el.images[0].image : new URL('@/assets/img/exampleImg.svg', import.meta.url)
    }))
  }
  }

const addFn = () => {
  if (selectedProducts.value) {
    products.value.push({
      code: selectedProducts.value.code,
      name: selectedProducts.value.name,
      img: selectedProducts.value.img
    });
    senData()
  }
  deleteSelectedProduct()
};

const senData = () =>{
  emit("sendData", products.value);
}

const deleteSelectedProduct = () =>{
  selectedProducts.value = null
}

onMounted(() => {
  getIdProducts();
  getData()
});

</script>

<template>
  <div class="mt-10 border-y-[1px] zebra-border">
    <div class="flex mt-4 mb-4 gap-4">
      <FloatLabel class="w-[540px]">
        <Select
            v-model="selectedProducts"
            :options="productsId"
            optionLabel="name"
            class="w-full h-[47px] rounded-[10px]"
            editable
            @keyup="getIdProducts"
        />
        <label>Поиск по Id, наименованию, штрих коду</label>
      </FloatLabel>

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
        <Column field="name" header="Товар" style="width: 95%; height: 62px;">
          <template #body="slotProps">
            <div class="flex items-center gap-[10px]">
              <img :src="slotProps.data?.img" alt="Product Image"
                   class="w-[32px] h-[32px] rounded-[8px] object-cover">
              <span>{{ slotProps.data?.name }}</span>
            </div>
          </template>
        </Column>

        <Column field="quantity" header="">
          <template #body="{ data, index }">
            <i class="pi pi-trash text-[#808BA0] cursor-pointer" @click="products.splice(index, 1)"></i>
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
