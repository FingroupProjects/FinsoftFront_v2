<script setup>
import {ref} from "vue";
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

const deleteProduct = async () => {
  const id = ref();
  id.value = props.selectProducts.flatMap((el) => el.id);
  console.log('delete',props.selectProducts)
  const endpoint = props.selectProducts[0].deleted_at
      ?  '/sale/agreement/massRestore'
      : '/sale/agreement/massDelete';

  try {
    const response = await useAxios(endpoint, {
      method: "POST",
      data: {
        ids: id.value,
      },
    });
    emit('getProduct');
    deleteProductsDialog.value = false;
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
      detail: error.message || 'An error occurred during deletion.',
      life: 3000,
    });
  }
};


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
        Вы действительно хотите удалить запись?
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
    <Toolbar>
      <template #start>
        <div class="flex gap-3 items-center">
          <div
              class="text-[15px] leading-4 font-semibold font-[Manrope] text-[#3935E7]"
          >
            Выбран: {{ props.selectProducts.length }}
          </div>
          <fin-button
              label="Удалить"
              icon="pi pi-trash"
              severity="warning"
              class="p-button-sm"
              @click="deleteProductsDialog = true;"
          />
        </div>
      </template>
    </Toolbar>
  </div>
</template>

<style lang="scss">
.card-toolbar {

  .p-toolbar {
    border-bottom: 1px solid #e2e8f0;
    border-top: 1px solid #e2e8f0;
    border-left: none;
    border-right: none;
    border-radius: 0;
    width: 100%;
  }
}

.card {
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
</style>