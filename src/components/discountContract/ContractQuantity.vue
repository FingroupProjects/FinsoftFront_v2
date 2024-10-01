<script setup>
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import Select from "primevue/select";
import {ref, onMounted} from "vue";
import FloatLabel from "primevue/floatlabel";
import {useAxios} from "@/composable/useAxios.js";
import {useToast} from "primevue/usetoast";

const emit = defineEmits(['sendData']);
const props = defineProps({
  contract: '',
})
const toast = useToast();

const productsId = ref([]);
const selectedAgreement = ref()
const selectedQuantity = ref()
const cpAgreementList = ref();
const selectedProduct = ref(null);
const products = ref([]);

const getContract = async () =>{
  const res = await useAxios(`/cpAgreement`)
  cpAgreementList.value = res.result.data;
}

const getIdProducts = async (inputValue) => {
  const res = await useAxios(`good?search=${inputValue?.srcElement.value}`);
  productsId.value = res.result.data.map((el) => ({
    name: el.name,
    code: el.id,
    img: el.images[0]?.image ? imgURL + el.images[0].image : new URL('@/assets/img/exampleImg.svg', import.meta.url)
  }));
};

function getData(){
  if (props.contract !== undefined && props.contract !== null) {
    const getGood = props.contract
    products.value = getGood.map((el) => ({
      id: el.id,
      good_id: el.good.id,
      agreement_id: el.agreement.id,
      quantity: el.quantity,
      goodName: el.good.name,
      agreementName: el.agreement.name,
      img: el.good.img?.image ? imgURL + el.images[0].image : new URL('@/assets/img/exampleImg.svg', import.meta.url)
    }))
  }
}


function addFn() {
  try {
    products.value.push({
      good_id: selectedProduct.value.code,
      agreement_id: selectedAgreement.value.id,
      quantity: selectedQuantity.value,
      goodName: selectedProduct.value.name,
      agreementName: selectedAgreement.value.name,
      img: selectedProduct.value.img
    });
    console.log('selected data', selectedProduct.value);
    sendData()
    selectedAgreement.value = null;
    selectedQuantity.value = null;
    selectedProduct.value = null;
  }catch(error){
      toast.add({
        severity: "error",
        summary: "Ошибка!",
        detail: "Пожалуйста выберите товар",
        life: 3000,
      });
    console.log(error);
  }

}

function sendData() {
  emit("sendData", products.value);
}


onMounted(()=>{
  getContract()
  getData()
})

</script>

<template>
<div>
  <div class=" mt-10  border-y-[1px] zebra-border">
    <div class="flex mt-4 gap-4 mb-4">
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
      <Select
          v-model="selectedAgreement"
          :options="cpAgreementList"
          optionLabel="name"
          placeholder="Выберите договор"
          class="w-[260px]"/>
      <fin-input v-model="selectedQuantity" placeholder="Кол-во товаров" class="w-[200px]"/>
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
        <Column field="goodName" header="Товар" style="width: 60%; height: 62px;">
          <template #body="slotProps">
            <div class="flex items-center gap-[10px]">
              <img :src="slotProps.data?.img" alt="Product Image"
                   class="w-[32px] h-[32px] rounded-[8px] object-cover">
              <span :class="{'text-green-500': slotProps.data?.isGift}">
        {{ slotProps.data?.goodName }}
      </span>
            </div>
          </template>
        </Column>

        <Column field="agreementName" header="Договор" ></Column>
        <Column field="quantity" header="Кол-во товаров" >
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
</div>


</template>

<style lang="scss">
.table-contract{
  .p-datatable-header-cell {
    background-color: #f6f6f6 !important;
  }
  .p-datepicker{
    border: 2px !important;
    border-radius: 10px !important;
  }
  .p-datepicker-input-icon-container{
    padding-top: -100px !important;
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