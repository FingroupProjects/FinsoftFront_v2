<script setup>
import {ref, watchEffect} from "vue";
import {useAxios} from "@/composable/useAxios.js";
import Toolbar from 'primevue/toolbar';
import Dialog from 'primevue/dialog';
import {useToast} from "primevue/usetoast";

const toast = useToast();
const props = defineProps({
  selectProducts: ''
})
const emit = defineEmits(['getProduct'])

const deleteProductsDialog = ref(false);
const copyProductsDialog = ref(false);
const conductDialog = ref(false)

const selectProduct = (product) => {
  const hasActive = props.selectProducts.some(p => p.active);
  console.log(hasActive)
  if (props.selectProducts[0].active !== hasActive) {
    return toast.add({
      severity: "error",
      summary: "Error Message",
      detail: '',
      life: 3000,
    });
  }
};
watchEffect(() => {
  selectProduct()
})
const copyProducts = async () => {
  const id = ref();
  id.value = props.selectProducts.flatMap((el) => el.id);
  try {
    const res = await useAxios(`/document/copy/${id.value[0]}`, {
      method: "POST",
    });
    emit('getProduct')
    copyProductsDialog.value = false;
    toast.add({
      severity: "success",
      summary: "Success Message",
      detail: '',
      life: 3000,
    });
  } catch (e) {
    toast.add({
      severity: "error",
      summary: "Error Message",
      detail: e,
      life: 3000,
    });
  }
};

const deleteProduct = async () => {
  const id = ref();
  id.value = props.selectProducts.flatMap((el) => el.id);

  const endpoint = props.selectProducts[0].deleted_at
      ? '/document/inventory/massRestore'
      :'/document/inventory/massDelete' ;

  try {
    const response = await useAxios(endpoint, {
      method: "POST",
      data: {
        ids: id.value,
      },
    });
    emit('getProduct'); // Trigger an event to refresh product data
    deleteProductsDialog.value = false; // Close the delete dialog
    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Products deleted successfully.",
      life: 3000,
    });
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: error.message || 'An error occurred during deletion.', // Provide more detailed error message if available
      life: 3000,
    });
  }
};

async function conductMethod(){
  const id = ref();
  id.value = props.selectProducts.flatMap((el) => el.id);
  const endpoint = props.selectProducts[0].active
      ? '/document/inventory/unApprove'
      :'/document/inventory/approve' ;

  try {
    const res = await useAxios(endpoint, {
      method: "POST",
      data: {
        ids: id.value,
      },
    });
    emit('getProduct')
    conductDialog.value = false;

    toast.add({
      severity: "success",
      summary: "Success Message",
      detail: '',
      life: 3000,
    });
  } catch (e) {
    toast.add({
      severity: "error",
      summary: "Error Message",
      detail: e,
      life: 3000,
    });
  }
}

</script>

<template>
  <div class="card-toolbar mt-4">
    <Dialog
        v-model:visible="deleteProductsDialog"
        :style="{ width: '424px' }"
        :modal="true"
        :closable="false"
    >
      <div class="font-semibold text-[20px] leading-6 text-center w-[80%] m-auto text-[#141C30]">
        Вы действительно хотите удалить документ?
      </div>
      <template #footer>
        <fin-button label="Подтвердить" class="w-full" severity="success" icon="pi pi-check" @click="deleteProduct"/>
        <fin-button
            label="Отменить"
            icon="pi pi-times"
            class="w-full"
            severity="warning"
            @click="deleteProductsDialog = false"
        />
      </template>
    </Dialog>
    <Dialog
        v-model:visible="copyProductsDialog"
        :style="{ width: '450px' }"
        :closable="false"
        :modal="true"
    >
      <div class="font-semibold text-[20px] leading-6 text-center w-[80%] m-auto text-[#141C30]">
        Вы действительно хотите дублировать документ?
      </div>
      <template #footer>
        <fin-button label="Подтвердить" class="w-full" severity="success" icon="pi pi-check" @click="copyProducts"/>
        <fin-button
            label="Отменить"
            icon="pi pi-times"
            class="w-full"
            severity="warning"
            @click="copyProductsDialog = false"
        />
      </template>
    </Dialog>
    <Dialog
        v-model:visible="conductDialog"
        :style="{ width: '450px' }"
        :closable="false"
        :modal="true"
    >
      <div class="font-semibold text-[20px] leading-6 text-center w-[80%] m-auto text-[#141C30]">
        Вы действительно хотите провести документ?
      </div>
      <template #footer>
        <fin-button label="Подтвердить" class="w-full" severity="success" icon="pi pi-check" @click="conductMethod"/>
        <fin-button
            label="Отменить"
            icon="pi pi-times"
            class="w-full"
            severity="warning"
            @click="conductDialog = false"
        />
      </template>
    </Dialog>
    <Toolbar>
      <template #start>
        <div class="flex gap-3 items-center">
          <div
              class="text-[15px] leading-4 font-semibold font-[Manrope] text-[#3935E7]"
          >
            Выбран: {{ props.selectProducts.length }}
          </div>
          <fin-button
              label="Провести"
              icon="pi pi-external-link"
              class="p-button-sm"
              severity="warning"
              @click="conductDialog = true"
          />
          <fin-button
              label="Удалить"
              icon="pi pi-trash"
              severity="warning"
              class="p-button-sm"
              @click="deleteProductsDialog = true;"
          />
          <fin-button
              label="Дублировать"
              icon="pi pi-copy"
              severity="warning"
              class="p-button-sm"
              @click="copyProductsDialog = true"
          />
        </div>
      </template>
    </Toolbar>
  </div>
</template>

<style lang="scss">
.card-toolbar{

  .p-toolbar{
    border-bottom: 1px solid #e2e8f0;
    border-top: 1px solid #e2e8f0;
    border-left: none;
    border-right: none;
    border-radius: 0;
    width: 100%;
  }
}
.card{
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
</style>