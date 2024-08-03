<script setup>
import { onMounted, ref, reactive } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import FinSelect from '@/components/ui/Selects.vue';
import { useAxios } from '@/composable/useAxios.js';
import FinInput from '@/components/ui/Inputs.vue';
import { useVuelidate } from "@vuelidate/core";
import moment from "moment/moment.js";

const v$ = useVuelidate();
const goods = ref([]);

const props = defineProps({
  productId: {
    required: true,
  },
});

const editing = reactive({});

const editColumn = (rowIndex, field) => {
  editing[rowIndex] = editing[rowIndex] || {};
  editing[rowIndex][field] = true;
};

const saveChanges = (rowIndex, field) => {
  if (editing[rowIndex]) {
    delete editing[rowIndex][field];
    // Mark the item as updated
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
      price: item.good.price,
      sum: sum,
      photo: item.image ? `${imgURL}${item.image}` : '',
      created: false,
      updated: false,
      deleted: false,
    }));
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

onMounted(() => {
  getGood();
});
</script>

<template>
  <div class="card-sidebar">
    <DataTable :value="goods" tableStyle="min-width: 10px; height: 100px;">
      <Column header="Наименование">
        <template #body="slotProps">
          <div style="display: flex; align-items: center;">
            <i v-if="!slotProps.data.photo" class="pi pi-image" style="margin-right: 10px;"></i>
            <img v-else :src="slotProps.data.photo" class="image-good">
            <span class="ml-[10px]">{{ slotProps.data.name }}</span>
          </div>
        </template>
      </Column>
      <Column header="Кол-во" style="width: 100px;">
        <template #body="slotProps">
          <div @dblclick="editColumn(slotProps.rowIndex, 'amount')">
            <template v-if="isEditing(slotProps.rowIndex, 'amount')">
              <fin-input placeholder="Кол-во" v-model="slotProps.data.amount" @blur="saveChanges(slotProps.rowIndex, 'amount')" />
            </template>
            <template v-else>
              {{ slotProps.data.amount }}
            </template>
          </div>
        </template>
      </Column>
      <Column header="Цена" style="width: 100px;">
        <template #body="slotProps">
          <div @dblclick="editColumn(slotProps.rowIndex, 'price')">
            <template v-if="isEditing(slotProps.rowIndex, 'price')">
              <fin-input placeholder="Цена" v-model="slotProps.data.price" @blur="saveChanges(slotProps.rowIndex, 'price')" />
            </template>
            <template v-else>
              {{ slotProps.data.price }}
            </template>
          </div>
        </template>
      </Column>
      <Column header="Сумма" style="width: 100px;">
        <template #body="slotProps">
          <div @dblclick="editColumn(slotProps.rowIndex, 'sum')">
            <template v-if="isEditing(slotProps.rowIndex, 'sum')">
              <fin-input placeholder="Сумма" v-model="slotProps.data.sum" @blur="saveChanges(slotProps.rowIndex, 'sum')" />
            </template>
            <template v-else>
              {{ slotProps.data.sum }}
            </template>
          </div>
        </template>
      </Column>
      <Column header="" style="width: 50px;">
        <template #body="slotProps">
          <i class="pi pi-trash" style="cursor: pointer;" @click="updateGoods()"></i>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style lang="scss">
@import "@/assets/style/colors";

.card-sidebar {
  td {
    color: black !important;
    font-size: 18px !important;
    font-weight: 600 !important;
  }

  .p-datatable-header-cell {
    background-color: $table-bg-color !important;
  }
  .p-select-open {
    background-color: white !important;
    width: 20px !important;
  }
  .relative {
    width: 170px !important;
  }
  .p-focus {
    background-color: white !important;
    border: 1px solid $pi-chevron-color !important;
  }
  .p-select-option {
    border-radius: 10px !important;
    padding: 8px 16px !important;
    margin: 4px 0 !important;
    color: black !important;
  }

  .pi-trash {
    color: $text-color !important;
  }
  .image-good {
    background-color: #f6f6f6 !important;
    border-radius: 10px !important;
    padding: 3px;
    width: 50px;
    height: 50px;
  }
  .pi-image {
    background-color: #f6f6f6 !important;
    border-radius: 10px !important;
    padding: 3px;
    width: 50px;
    height: 50px;
    font-size: 30px !important;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #808ba0 !important;
  }

  .p-datatable-table-container {
    border-top-right-radius: 10px !important;
  }
}

.color-circle {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  margin-right: 8px;
}
</style>
