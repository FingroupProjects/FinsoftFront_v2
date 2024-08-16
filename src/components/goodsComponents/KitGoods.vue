<script setup>
import {ref} from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import formatInputAmount from "@/constants/formatInput.js";
import Dropdown from "primevue/dropdown";
import FloatLabel from "primevue/floatlabel";
import {useAxios} from "@/composable/useAxios.js";
import {useToast} from "primevue/usetoast";

const props = defineProps({
  productId: {
    required: true,
  }
});

const toast = useToast();

const coleVo = ref("");
const selectUnit = ref();
const listUnit = ref([]);
const getUnitList = ref([]);

const clearInputValues = () => {
  selectUnit.value = {};
  coleVo.value = "";
};

async function addUnit() {
  try {
    const res = await useAxios(`/goods/addUnits/${props.productId}`, {
      method: "POST",
      data: {
            "amount": coleVo.value,
            "unit_id": selectUnit.value.code
      },
    });
    getUnit()
    toast.add({
      severity: "success",
      summary: "Success Message",
      detail: "Message Content",
      life: 3000,
    });
    clearInputValues();
  } catch (e) {
    console.log(e);
    toast.add({
      severity: "error",
      summary: "Error Message",
      detail: e.response.data.message,
      life: 3000,
    });
  }
}


const confirmDeleteProduct = async (index) => {
  try {
    const res = await useAxios(`/goods/removeUnit/${index}`,{
      method: "DELETE",
    });
    toast.add({
      severity: "success",
      summary: "Success Message",
      detail: "Message Content",
      life: 3000,
    });
    getUnit()
  } catch (e) {
    console.log(e);
    toast.add({
      severity: "error",
      summary: "Error Message",
      detail: e.response.data.message,
      life: 3000,
    });
  }
};

async function getUnit() {
  try {
    const res = await useAxios(`/goods/units/${props.productId}`);
    return getUnitList.value = res
  } catch (e) {
    console.log(e);
  }
}

getUnit()

async function unitList() {
  try {
    const res = await useAxios(`/unit`);
    return listUnit.value = res.result.data.map(item => {
      return {
        code: item.id,
        name: item.name,
      }
    })
  } catch (e) {
    console.log(e);
  }
}
unitList()
</script>

<template>
  <div class="flex items-center mt-[30px] gap-[21px]">
    <div class="header-title">Набор</div>
  </div>
  <div class="filter-form grid grid-cols-12 gap-[16px] pt-[21px] pb-[21px] mt-[21px]">
    <FloatLabel class="col-span-3 h-[47px]">
      <Dropdown
          v-model="selectUnit"
          :options="listUnit"
          optionLabel="name"
          class="w-full h-[47px] rounded-[10px]"
      />
      <label for="">Ед. изм.</label>
    </FloatLabel>
    <div class="col-span-3 flex gap-[16px]">

      <fin-input v-model="coleVo" class="w-full" :model-value="formatInputAmount(coleVo)"
                 placeholder="Кол-во"/>
      <fin-button
          icon="pi pi-save"
          @click="addUnit"
          label="Добавить"
          severity="success"
          class="p-button-lg"
      />
    </div>
  </div>
  <div class="table-create dropdown-status" v-if="getUnitList.length > 0">
    <DataTable
        :value="getUnitList"
        scrollable
        scrollHeight="280px"
        class="mt-[21px]"
        tableStyle="min-width: 50rem"
    >
      <Column field="coleVo" header="Ед. изм.">
        <template #body="{ data }">
          <div class="flex items-center gap-[10px]">
            <img src="@/assets/img/boxIcon.svg" alt="" class="me-2">
            <div>{{ data.name }}</div>
          </div>
        </template>
      </Column>
      <Column field="data" header="Кол-во в упаковке">
        <template #body="{data}">
          {{ data?.pivot.amount }}
        </template>
      </Column>

      <Column field="quantity" header="">
        <template #body="{ data }">
          <i
              @click="confirmDeleteProduct(data.id)"
              class="pi pi-trash text-[#808BA0] cursor-pointer"
          ></i>
        </template>
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
}

.dropdown-status {
  .p-select {
    border-radius: 10px;
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
</style>

<style scoped lang="scss">
.filter-form {
  border-top: 1px dashed #dcdfe3;
  border-bottom: 1px dashed #dcdfe3;
}
</style>