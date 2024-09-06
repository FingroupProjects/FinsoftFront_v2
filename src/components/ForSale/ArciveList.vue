<script setup>
import InputText from "primevue/inputtext";
import InputIcon from "primevue/inputicon";
import Dialog from "primevue/dialog";
import IconField from "primevue/iconfield";
import {useAxios} from "@/composable/useAxios.js";
import {ref, computed} from "vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const emit = defineEmits(['close-modal', 'postArchive'])
const props = defineProps({
  openFastGoods: {
    type: Boolean,
    default: false
  }
})

const selectedProduct = ref();
const fastGoodsList = ref([]);
const checked = ref(Array(fastGoodsList.value.length).fill(false));
const selectFilter = ref(null);
const filterSelect = ref(null);
const postProducts = ref([]);
const archiveList = ref([]);
const searchValue = ref('');

async function getArchiveList(value) {
  try {
    const res = await useAxios(value ? `rmk/search-by-doc_number/${value}` : 'rmk/get/archive');
    archiveList.value = Array.isArray(res.result.data) && res.result.data.length > 0
        ? res.result.data
        : res.result;

  } catch (e) {
    console.log(e)
  }
}

getArchiveList()

function closeDialog() {
  selectFilter.value = null
  filterSelect.value = null
  postProducts.value = []
  checked.value = []
  emit('close-modal')
}

function postFn() {
  emit('postArchive', selectedProduct)
  if (postProducts.value.length !== 0) {

  }
}

</script>

<template>
  <Dialog :draggable="false" class="fast-goods-header" v-model:visible="props.openFastGoods" modal
          :style="{ width: '940px', height:'620px' }" scroll :closable="false"
          :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <template #header>
      <div class="flex justify-between items-center w-full ">
        <div class="flex gap-5 items-center ">
          <fin-button @click="closeDialog" icon="pi pi-times" class="p-button-2xl" severity="warning"
                      label="Отменить"/>
          <div class="font-semibold text-[26px] leading-[26px] text-[#141C30]">

          </div>
        </div>
        <fin-button icon="pi pi-arrow-right" class="p-button-2xl" severity="success"
                    label="Отобразить" @click="postFn"/>
      </div>
      <div class="mt-[26px]">
        <IconField class="w-full filter-goods">
          <InputIcon class="pi pi-search "/>
          <InputText
              class="w-full"
              v-model="searchValue"
              @input="getArchiveList(searchValue)"
              placeholder="Поиск по названию, артикулу, штрих-коду"
          />
        </IconField>
      </div>
    </template>
    <DataTable v-model:selection="selectedProduct" :value="archiveList" dataKey="id" tableStyle="min-width: 50rem">
      <Column selectionMode="single" headerStyle="width: 3rem"></Column>
      <Column field="date" header="Дата"></Column>
      <Column field="doc_number" header="Номер документа"></Column>
      <Column field="for_payment" header="К оплате"></Column>
      <Column field="sale" header="Ручная скидка"></Column>

    </DataTable>
  </Dialog>
</template>

<style lang="scss">
.fast-good-checkbox {
  .p-checkbox-checked .p-checkbox-box {
    background: #17A825 !important;
    width: 32px !important;
    height: 32px !important;
    border-radius: 50%;
    border-color: transparent !important;
  }

  .p-checkbox {
    width: 32px !important;
    position: absolute;
    top: 5px;
    right: 13px;
  }

  .p-checkbox-box {
    border-radius: 50% !important;
    width: 32px !important;
    height: 32px !important;
  }

}

.fast-goods-header {
  .p-dialog-header {
    display: block !important;
  }
}

</style>
<style scoped lang="scss">
.active {
  background: #3935E7;
  color: white;
}

.btn-transition {
  transition: 0.3s all linear;
}
</style>