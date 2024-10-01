<script setup>
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import Select from "primevue/select";
import {useAxios} from "@/composable/useAxios.js";
import {ref, onMounted, reactive} from "vue";
import {required} from "@vuelidate/validators";
import {useVuelidate} from "@vuelidate/core";
import {useToast} from "primevue/usetoast";

const emit = defineEmits([ 'sendData' ]);
const props = defineProps({
  contract: ''
})

const toast = useToast();
const selectedAgreement = ref()
const cpAgreementList = ref()
const products = ref([]);



const getSale = () =>{
  if(props.contract !== undefined && props.contract !== null){
    const getContract = props.contract
    products.value = getContract.map((item) =>({
      id: item.id,
      name: item.agreement.name,
      client: item.agreement.contact_person,
    }))
  }
}

const getContract = async () =>{
  const res = await useAxios(`/cpAgreement`)
  cpAgreementList.value = res.result.data;
}
const deleteSelected = () =>{
  selectedAgreement.value = null
}

const addData = () =>{
  try {
      products.value.push({
        id: selectedAgreement.value.id,
        name: selectedAgreement.value.name,
        client: selectedAgreement.value.counterparty.name
      })
      selectedAgreement.value = null
      senData()
      console.log('selectedAgreement', products.value)

  }catch (e){
    toast.add({
      severity: "error",
      summary: "Ошибка!",
      detail: "Пожалуйста выберите договор",
      life: 3000,
    });
    console.log(e)
  }
}

function senData (){
  emit('sendData', products.value)
}

onMounted(()=>{
  getContract()
  getSale()
})

</script>

<template>
<div class=" mt-10  border-y-[1px] zebra-border">
  <div class="flex mt-4 mb-4 gap-4">
    <Select
        v-model="selectedAgreement"
        :options="cpAgreementList"
        optionLabel="name"
        placeholder="Выберите договор"
        class="w-[260px]"
    />

    <fin-button
        @click="addData"
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
        <Column field="name" header="Договор" style="width: 25%; height: 62px;"/>

        <Column field="client" header="Клиент" style="width: 75%;" />
        <Column header="">
          <template #body="{ data, index }">
            <i class="pi pi-trash text-[#808BA0] cursor-pointer" @click="products.splice(index, 1)"></i>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>

</template>

<style lang="scss">
.table-contract{
  .p-datatable-header-cell {
    background-color: #F2F2F2 !important;
    height: 44px !important;
  }

  .p-datepicker-input-icon-container{
    padding-top: 100px !important;
  }

}

.p-invalid {
  border: 1px solid #f2376f !important;
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