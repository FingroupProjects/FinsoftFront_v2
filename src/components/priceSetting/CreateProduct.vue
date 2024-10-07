<script setup>
import {reactive, ref, watchEffect, watch, onMounted} from "vue";
import DatePicker from "primevue/datepicker";
import {useStaticApi} from "@/composable/useStaticApi.js";
import {useAxios} from "@/composable/useAxios.js";
import Select from "primevue/select";
import moment from "moment";
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";
import {useToast} from "primevue/usetoast";
import FloatLabel from "primevue/floatlabel";
import Dialog from "primevue/dialog";
import FinInput from "@/components/ui/Inputs.vue";
import MultiSelect from 'primevue/multiselect';

const emit = defineEmits(["closeDialog", 'close-sidebar']);

const toast = useToast();

const {
  findOrganization,
  organization,
  loadingOrganization,
} = useStaticApi();

const isOpen = ref(false)
const agreementList = ref([]);
const isCurrencyFetched = ref(false);
const openInfoModal = ref(false);
const initialValue = ref(null);
const isModal = ref(false);
const priceTypeList = ref([]);
const goodGroupList = ref([]);
const createValues = reactive({
  datetime24h: new Date,
  selectedPriceType: "",
  changeBySum: "",
  selectedOrganization: "",
  changeByPercent: "",
  selectedGoodGroup: ""

});
const rules = reactive({
  datetime24h: {required},
  selectedOrganization: {required},
  selectedGoodGroup: {required},
  selectedPriceType: {required},
  changeBySum: {required},
  changeByPercent: {required}
});
const productsInfo = ref({
  postProducts: [],
  getAllSum: 0,
  getAllProduct: [],
  goods: []
});

const organizationJson = localStorage.getItem('organization');
const organizationHas = JSON.parse(organizationJson);
const hasOrganization = JSON.parse(localStorage.getItem('hasOneOrganization'));
const v$ = useVuelidate(rules, createValues);

async function saveFn() {
  const result = await v$.value.$validate();
  openInfoModal.value = false;

  const idGoodGroup = createValues.selectedGoodGroup.map(el => el.code);
  const idPriceType = createValues.selectedPriceType.map(el => el.code);

  if (result) {
    try {
      const res = await useAxios(`/price-set-up/settings`, {
        method: "GET",
        params: {
          "goodGroupIds": idGoodGroup,
          "priceTypeIds": idPriceType,
          "changeBySum": createValues.changeBySum,
          "changeByPercent": createValues.changeByPercent,
          date: moment(createValues.datetime24h).format("YYYY-MM-DD HH:mm:ss"),
          organization_id: createValues.selectedOrganization.code,
        },
      });

      toast.add({
        severity: "success",
        summary: "Success Message",
        detail: "Message Content",
        life: 3000,
      });

      emit("closeDialog", res.result);
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

const getPriceType = async () => {
  const res = await useAxios(`/priceType`);
  priceTypeList.value = res.result.data.map((el) => ({
    name: el.name,
    code: el.id,
  }));
};
const getGoodGroup = async () => {
  const res = await useAxios(`/good-group`);
  goodGroupList.value = res.result.data.map((el) => ({
    name: el.name,
    code: el.id,
  }));
};
onMounted(async () => {
  try {
    await Promise.all([
      findOrganization(),
      getPriceType(),
      getGoodGroup()
    ]);
  } catch (error) {
    console.error('Error:', error);
  }
});

async function infoModalClose() {
  if (isModal.value || productsInfo.value?.length > 0) openInfoModal.value = true
  else emit('close-sidebar')
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
});
</script>

<template>
  <div class="create-purchases">
    <div class="header">
      <div>
        <div class="header-title">Настройка</div>
      </div>
      <div class="flex gap-[16px]">
        <fin-button
            icon="pi pi-save"
            @click="saveFn"
            label="Настройка"
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
      <FloatLabel class="col-span-6">
        <DatePicker
            showIcon
            v-model="createValues.datetime24h"
            :class="[{ 'p-invalid': v$.datetime24h.$error }]"
            showTime
            hourFormat="24"
            dateFormat="dd.mm.yy,"
            fluid
            hideOnDateTimeSelect
            iconDisplay="input"
            class="w-full "
        />
        <label for="dd-city">Дата</label>
      </FloatLabel>

      <FloatLabel class="col-span-6" v-if="!hasOrganization">
        <Select
            v-model="createValues.selectedOrganization"
            :options="organization"
            :class="{ 'p-invalid': v$.selectedOrganization.$error }"
            :loading="loadingOrganization"
            optionLabel="name"
            class="w-full"

        />
        <label for="dd-city">Организация</label>
      </FloatLabel>

      <FloatLabel class="col-span-6">
        <MultiSelect
            v-model="createValues.selectedGoodGroup"
            :class="{ 'p-invalid': v$.selectedGoodGroup.$error }"
            :options="goodGroupList"
            optionLabel="name"
            class="w-full"/>
        <label for="dd-city">Категории товаров</label>
      </FloatLabel>
      <FloatLabel class="col-span-6">
        <MultiSelect
            v-model="createValues.selectedPriceType"
            :class="{ 'p-invalid': v$.selectedPriceType.$error }"
            :options="priceTypeList"
            optionLabel="name"
            class="w-full"/>
        <label for="dd-city">Виды цен</label>
      </FloatLabel>
      <fin-input v-model="createValues.changeBySum" :error="v$.changeBySum.$error " class="col-span-6"
                 placeholder="Изменить на X Cумма"></fin-input>
      <fin-input v-model="createValues.changeByPercent" :error="v$.changeByPercent.$error " class="col-span-6"
                 placeholder="Изменить на X %"></fin-input>
    </div>
  </div>
  <Dialog
      v-model:visible="openInfoModal"
      :style="{ width: '424px' }"
      :modal="true"
      :closable="false"
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
@import "@/assets/style/colors";

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
