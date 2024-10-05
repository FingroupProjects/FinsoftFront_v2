<script setup>
import {ref, watchEffect} from "vue";
import {useAxios} from "@/composable/useAxios.js";
import Toolbar from 'primevue/toolbar';
import Dialog from 'primevue/dialog';
import {useToast} from "primevue/usetoast";
import {useClientSale} from "@/store/clientSale.js";
import {useRouter} from "vue-router";

const toast = useToast();
const props = defineProps({
  selectProducts: ''
})
const emit = defineEmits(['getProduct'])
const store = useClientSale()
const router = useRouter();

const deleteProductsDialog = ref(false);
const copyProductsDialog = ref(false);
const conductDialog = ref(false)
const createBasedOnDialog = ref(false);
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
      ? '/document/client/return/massRestore'
      :'/document/client/return/massDelete' ;

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

const createBasedOn = (item) => {
  if (item === 'saleToClients') {
    store.getId = props.selectProducts
    router.push({ name: 'clientSale' });
  }

  if (item === 'returnToSupplier'){
    store.getId = props.selectProducts
    router.push({ name: 'providerReturn' });
  }
  if (item === 'transfer'){
    store.getId = props.selectProducts
    router.push({ name: 'movement' });
  }
};

const handleCreateBasedOnClick = () => {
  if (props.selectProducts.length === 1) {
    const isActive = props.selectProducts[0].active;
    if (isActive) {
      createBasedOnDialog.value = true;
    } else {
      toast.add({
        severity: "warn",
        summary: "Предупреждение!",
        detail: "Пожалуйста, выберите проведенный документ!",
        life: 3000
      });
    }
  } else {
    toast.add({
      severity: "warn",
      summary: "Предупреждение!",
      detail: "Пожалуйста, выберите только один документ!",
      life: 3000
    });
  }
};

async function conductMethod(){
  const id = ref();
  id.value = props.selectProducts.flatMap((el) => el.id);
  const endpoint = props.selectProducts[0].active
      ? '/document/client/unApprove'
      :'/document/client/approve' ;

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
      summary: "Проведен!",
      detail: 'Документ успешно проведен!',
      life: 3000,
    });
  } catch (e) {
    console.log(e)
    if (e.response && e.response.status === 400) {
      conductDialog.value = false
      emit('errorResponse', e.response);
    }
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

    <!-- Создать на оснавании-->
    <Dialog
        v-model:visible="createBasedOnDialog"
        :style="{ width: '450px' }"
        :closable="false"
        :modal="true"
    >
      <div class="font-semibold text-[20px] leading-6 text-center w-[80%] m-auto text-[#141C30] mb-4">
        Создание на основании
      </div>

      <div class="w-full card flex justify-center border-0">
        <ul class="ml-7 mr-7 w-full border-0 border-b-2 ">
          <li
              id="saleToClients"
              @click="createBasedOn('saleToClients')"
              class="h-[63px] text-[18px] font-semibold pt-3 mb-3 border-t-2 text-black flex justify-between items-center cursor-pointer"
          >
            Продажа клиентам
            <i class="pi pi-arrow-right text-[#3935E7] font-semibold"></i>

          </li>
          <li
              id="returnToSupplier"
              @click="createBasedOn('returnToSupplier')"
              class="h-[63px] text-[18px] font-semibold pt-3 mb-3 border-t-2 text-black flex justify-between items-center cursor-pointer"
          >
            Возврат поставщику
            <i class="pi pi-arrow-right text-[#3935E7]"></i>
          </li>
          <li
              id="moneyExpense"
              @click="createBasedOn('moneyExpense')"
              class="h-[63px] text-[18px] font-semibold pt-3 mb-3 border-t-2 text-black flex justify-between items-center cursor-pointer "
          >
            Росход денег
            <i class="pi pi-arrow-right text-[#3935E7]"></i>
          </li>
          <li
              id="rsExpense"
              @click="createBasedOn('rsExpense')"
              class="h-[63px] text-[18px] font-semibold pt-3 mb-3 border-t-2 text-black flex justify-between items-center cursor-pointer"
          >
            Росход рс
            <i class="pi pi-arrow-right text-[#3935E7]"></i>
          </li>
          <li
              id="transfer"
              @click="createBasedOn('transfer')"
              class="h-[63px] text-[18px] font-semibold pt-3 mb-3 border-t-2 text-black flex justify-between items-center cursor-pointer"
          >
            Перемещение
            <i class="pi pi-arrow-right text-[#3935E7]"></i>
          </li>
        </ul>
      </div>

      <template #footer>
        <div class="flex justify-center w-full h-[50px] ">
          <fin-button
              label="Отменить"
              icon="pi pi-times"
              class="button-close"
              severity="warning"
              @click="createBasedOnDialog = false"
          />
        </div>
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
          <fin-button
              label="Создать на основании"
              icon="pi pi-plus"
              severity="warning"
              class="p-button-sm"
              @click="handleCreateBasedOnClick"
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

.button-close{
  border-radius: 10px !important;
  width: 90% !important;
  height: 100% !important;
  font-size: 18px !important;
  font-weight: bold !important;
}
.button-close .pi {
  font-weight: 16 !important;
  font-size: 22px !important;
}
</style>