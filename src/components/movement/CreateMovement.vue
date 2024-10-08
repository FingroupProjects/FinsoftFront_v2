<script setup>
import {reactive, ref, watchEffect, watch, onMounted} from "vue";
import DatePicker from "primevue/datepicker";
import {useStaticApi} from "@/composable/useStaticApi.js";
import {useAxios} from "@/composable/useAxios.js";
import CreateProduct from "@/components/CreateProduct.vue";
import Dropdown from "primevue/dropdown";
import moment from "moment";
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";
import {useToast} from "primevue/usetoast";
import Toast from "primevue/toast";
import FloatLabel from "primevue/floatlabel";
import Textarea from 'primevue/textarea';
import Dialog from "primevue/dialog";
import CreateMovementProduct from "@/components/movement/CreateMovementProduct.vue";
import {useClientSale} from "@/store/clientSale.js";
import formatNumber from "@/constants/formatNumber.js";

const emit = defineEmits(["closeDialog", 'close-sidebar']);
const store = useClientSale()
const toast = useToast();

const {
  findStorage,
  storage,
  loadingStorage,
  findOrganization,
  organization,
  loadingOrganization,
} = useStaticApi();

const openInfoModal = ref(false);
const initialValue = ref(null);
const isModal = ref(false)
const createValues = reactive({
  datetime24h: new Date,
  comments: "",
  selectedOrganization: "",
  selectedSenderStorage: "",
  selectedRecipientStorage: ""
});
const rules = reactive({
  datetime24h: {required},
  selectedOrganization: {required},
  selectedSenderStorage: {required},
  selectedRecipientStorage: {required},
});
const productsInfo = ref({
  postProducts: [],
  getAllProduct: [],
  goods: []
});
const userName = {
  name: localStorage.getItem("user_name"),
};
const organizationJson = localStorage.getItem('organization');
const organizationHas = JSON.parse(organizationJson);
const hasOrganization = JSON.parse(localStorage.getItem('hasOneOrganization'));
const v$ = useVuelidate(rules, createValues);


async function saveFn() {
  const result = await v$.value.$validate();
  openInfoModal.value = false
  if (result) {
    try {
      const res = await useAxios(`document/movement`, {
        method: "POST",
        data: {
          date: moment(createValues.datetime24h).format("YYYY-MM-DD HH:mm:ss"),
          organization_id: createValues.selectedOrganization.code || createValues.selectedOrganization.id,
          comment: createValues.comments,
          goods: productsInfo.value,
          sender_storage_id: createValues.selectedSenderStorage.code || createValues.selectedRecipientStorage.id,
          recipient_storage_id: createValues.selectedRecipientStorage.code || createValues.selectedRecipientStorage.id
        },
      });
      toast.add({
        severity: "success",
        summary: "Success Message",
        detail: "Message Content",
        life: 3000,
      });
      emit("closeDialog", res.data.id);
      store.getId = null
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
}


function getOnBased(){
  console.log('getter', store.getId)
  if (store.getId !== null){
    for (const idElement of store.getId) {
      createValues.selectedOrganization = idElement.organization;
      createValues.selectedRecipientStorage = idElement.storage;
      createValues.selectedSenderStorage = idElement.storage;
      createValues.comments = idElement.comment;
    }
  }
}


function getProducts(products) {
  productsInfo.value = products;
}

findStorage()

async function infoModalClose() {
  if (isModal.value || productsInfo.value?.length > 0) openInfoModal.value = true
  else emit('close-sidebar')
  store.getId = null
}

watch(createValues, (newVal) => {
  if (initialValue.value !== null) {
    // This will only execute after the initial value is set
    isModal.value = true;
  }
  initialValue.value = newVal;
}, {deep: true});

watchEffect(() => {

  if (hasOrganization === true) createValues.selectedOrganization = {
    name: organizationHas.name,
    code: organizationHas.id
  }
  if (storage.value.length === 1) createValues.selectedStorage = storage.value[0]
});

onMounted(() =>{
  getOnBased()
})
</script>

<template>
  <div class="create-purchases">
    <div class="header">
      <div>
        <div class="header-title">Создание перемещение</div>

      </div>
      <div class="flex gap-[16px]">
        <fin-button
            icon="pi pi-save"
            @click="saveFn"
            label="Сохранить"
            severity="success"
            class="p-button-lg"
        />
        <fin-button
            icon="pi pi-times"
            @click="infoModalClose"
            label="Отменить"
            severity="warning"
            class="p-button-lg"
        />
      </div>
    </div>
    <div class="form grid grid-cols-12 gap-[16px] mt-[30px]">
      <FloatLabel class="col-span-4">
        <DatePicker
            showIcon
            v-model="createValues.datetime24h"
            :class="{ 'p-invalid': v$.datetime24h.$error }"
            showTime
            hourFormat="24"
            dateFormat="dd.mm.yy,"
            fluid
            hideOnDateTimeSelect
            iconDisplay="input"
            class="w-full"
        />
        <label for="dd-city">Дата</label>
      </FloatLabel>

      <FloatLabel class="col-span-4" v-if="!hasOrganization">
        <Dropdown
            v-model="createValues.selectedOrganization"
            :options="organization"
            :class="{ 'p-invalid': v$.selectedOrganization.$error }"
            @click="findOrganization"
            :loading="loadingOrganization"
            optionLabel="name"
            class="w-full"
        >
          <template #value>
            {{createValues.selectedOrganization.name}}
          </template>
        </Dropdown>
        <label for="dd-city">Организация</label>
      </FloatLabel>

      <FloatLabel class="col-span-4">
        <Dropdown
            v-model="createValues.selectedSenderStorage"
            :class="{ 'p-invalid': v$.selectedSenderStorage.$error }"
            @click="findStorage"
            :loading="loadingStorage"
            :options="storage"
            optionLabel="name"
            class="w-full"
        >
          <template #value>
            {{createValues.selectedSenderStorage?.name}}
          </template>
        </Dropdown>
        <label for="dd-city">Склад Отправитель</label>
      </FloatLabel>
      <FloatLabel class="col-span-4">
        <Dropdown
            v-model="createValues.selectedRecipientStorage"
            :class="{ 'p-invalid': v$.selectedRecipientStorage.$error }"
            @click="findStorage"
            :loading="loadingStorage"
            :options="storage"
            optionLabel="name"
            class="w-full"
        >
          <template #value>
            {{createValues.selectedRecipientStorage?.name}}
          </template>
        </Dropdown>
        <label for="dd-city">Склад Получатель</label>
      </FloatLabel>
      <FloatLabel class="col-span-12 mt-[10px]">
        <Textarea v-model="createValues.comments" class="w-full" style="min-height: 20px" rows="2" cols="20"/>
        <label for="dd-city">Комментарий</label>
      </FloatLabel>
    </div>
  </div>
  <CreateMovementProduct @postGoods="getProducts"/>
  <div class="summary-container fixed bottom-0 left-0 w-full bg-white shadow-lg">
    <div class="rounded-[10px] p-drawer-footer flex justify-between items-center p-[18px] bg-[#F6F6F6]">
      <div class="text-[#141C30] font-semibold text-[19px] leading-[20px]">
        Автор: {{ userName.name }}
      </div>
      <div class="flex gap-[49px]" style="border-left: 1px dashed gray; padding-left: 20px">
        <div class="text-[22px] text-[#141C30] leading-[22px] font-semibold">
          <div class="text-[13px] text-[#808BA0] leading-[13px] font-semibold mb-[8px]">

          </div>
          Итого:
        </div>
        <div class="text-[22px] text-[#141C30] leading-[22px] font-semibold">
          <div class="text-[13px] text-[#808BA0] leading-[13px] font-semibold mb-[8px]">
            Кол-во
          </div>
          {{ formatNumber(productsInfo.getAllProduct) }}
        </div>
        <div class="text-[22px] text-[#141C30] leading-[22px] font-semibold">
          <div class="text-[13px] text-[#808BA0] leading-[13px] font-semibold mb-[8px]">
            Товаров
          </div>
          {{ productsInfo.goods?.length }}
        </div>

      </div>
    </div>
  </div>
  <Dialog
      v-model:visible="openInfoModal"
      :style="{ width: '424px' }"
      :modal="true"
  >
    <div class="font-semibold text-[20px] leading-6 text-center w-[80%] m-auto text-[#141C30]">
      Хотите сохранить измения?
    </div>
    <template #footer>
      <fin-button label="Подтвердить" class="w-full" severity="success" icon="pi pi-check" @click="saveFn"/>
      <fin-button
          label="Отменить"
          icon="pi pi-times"
          class="w-full"
          severity="warning"
          @click="emit('close-sidebar')"
      />
    </template>
  </Dialog>
</template>

<style lang="scss">
@import '@/assets/style/colors.scss';

.create-purchases {

  .p-button-secondary {
    color: transparent !important;
    border-color: transparent !important;
  }

  .p-invalid {
    border: 1px solid #f2376f !important;
  }

  .p-select-option {
    width: 90% !important;
    margin: 0 15px !important;
    border-radius: 10px !important;
    font-weight: bold !important;
  }

  .p-focus {
    color: #fff !important;
  }

  .p-select-label {
    font-weight: bold !important;
  }

  .p-select-list-container {
    width: 100% !important;
  }

  .p-datepicker {
    border: none;
    border-radius: 10px;
    display: flex;
    align-items: center;

    &-input-icon-container {
      top: 15px !important;
    }
  }

  .p-button-secondary {
    color: $primary-color !important;
    border-color: $primary-color !important;
  }

  .p-inputtext {
    border-radius: 10px;
  }

  .p-inputtext:enabled:focus {
    border-color: $primary-color;
    border-radius: 10px;
  }
}

.p-inputtext:enabled:hover {
  border-color: transparent;
}

.p-inputtext:enabled:focus {
  border-color: #DCDFE3 !important;
}

.p-textarea:enabled:focus {
  border-color: $primary-color !important;
}

.header {
  display: flex;
  justify-content: space-between;

  &-title {
    font-family: Manrope, sans-serif;
    font-weight: 600;
    font-size: 20px;
    line-height: 20px;
    color: var(--fin-text-header);

    &-text {
      font-family: Manrope, sans-serif;
    }
  }
}
</style>
