<script setup>
import {reactive, ref, watch, watchEffect} from "vue";
import {useStaticApi} from "@/composable/useStaticApi.js";
import {useAxios} from "@/composable/useAxios.js";
import Dropdown from "primevue/dropdown";
import moment from "moment";
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";
import {useToast} from "primevue/usetoast";
import Toast from "primevue/toast";
import FloatLabel from "primevue/floatlabel";
import Textarea from 'primevue/textarea';
import FinInput from "@/components/ui/Inputs.vue";
import QsCodeAdd from "@/components/goodsComponents/QsCodeAdd.vue";
import KitGoods from "@/components/goodsComponents/KitGoods.vue";

const emit = defineEmits(["closeDialog", 'close-sidebar']);
const props = defineProps({
  productId:{
    required: true,
  }
});
const toast = useToast();

const {
  findCurrency,
  currency,
  findStorage,
  storage,
  loadingStorage,
  findOrganization,
  organization,
  findCounterparty,
  counterparty,
  loadingCounterparty,
  loadingOrganization,
} = useStaticApi();

const agreementList = ref([]);
const loadingAgreement = ref(false);
const productsInfo = ref();
const isCurrencyFetched = ref(false);
const createValues = reactive({
  datetime24h: new Date,
  selectCurrency: "",
  selectedStorage: "",
  selectedAgreement: "",
  comments: "",
  selectedOrganization: "",
  selectedCounterparty: "",
});
const rules = reactive({
  datetime24h: {required},
  selectCurrency: {required},
  selectedStorage: {required},
  selectedOrganization: {required},
  selectedCounterparty: {required},
  selectedAgreement: {required},
});

const organizationJson = localStorage.getItem('organization');
const organizationHas = JSON.parse(organizationJson);
const hasOrganization = JSON.parse(localStorage.getItem('hasOneOrganization'));
const v$ = useVuelidate(rules, createValues);

async function getAgreement() {
  try {
    loadingAgreement.value = true;
    const res = await useAxios(
        `/cpAgreement/getAgreementByCounterpartyId/${createValues.selectedCounterparty.code}`
    );
    return (agreementList.value = res.result.data.map((el) => {
      return {
        name: el.name,
        code: el.id,
      };
    }));
  } catch (e) {
    console.log(e);
  } finally {
    loadingAgreement.value = false;
  }
}

async function saveFn() {
  const result = await v$.value.$validate();

  if (result) {
    try {
      const res = await useAxios(`/document/provider/purchase`, {
        method: "POST",
        data: {
          date: moment(createValues.datetime24h).format("YYYY-MM-DD HH:mm:ss"),
          organization_id: createValues.selectedOrganization.code,
          counterparty_id: createValues.selectedCounterparty.code,
          counterparty_agreement_id: createValues.selectedAgreement.code,
          storage_id: createValues.selectedStorage.code,
          currency_id: createValues.selectCurrency.code,
          goods: productsInfo.value,
        },
      });
      toast.add({
        severity: "success",
        summary: "Success Message",
        detail: "Message Content",
        life: 3000,
      });
      emit("closeDialog", res.result.id);
    } catch (e) {
      console.log(e);
      toast.add({
        severity: "error",
        summary: "Error Message",
        detail: e,
        life: 3000,
      });
    }
  }
}

function getProducts(products) {
  productsInfo.value = products;
}

findStorage()

watchEffect(() => {
  if (
      createValues.selectedCounterparty &&
      createValues.selectedCounterparty.agreement &&
      createValues.selectedCounterparty.agreement.length > 0
  ) {
    createValues.selectedAgreement = {
      name: createValues.selectedCounterparty.agreement[0].name,
      code: createValues.selectedCounterparty.agreement[0].id,
    };
  } else {
    createValues.selectedAgreement = null;
  }
  if (hasOrganization === true) createValues.selectedOrganization = {
    name: organizationHas.name,
    code: organizationHas.id
  }
  if (storage.value.length === 1) createValues.selectedStorage = storage.value[0]
});
watch(createValues, (newValue) => {
  if (newValue.selectedAgreement && !isCurrencyFetched.value) {
    findCurrency(newValue.selectedAgreement).then(() => {
      createValues.selectCurrency = currency.value[0];
    });
    isCurrencyFetched.value = true;
  }
});
</script>

<template>
  <div class="create-purchases">
    <div class="header">
      <div>
        <div class="header-title">Добавление товара</div>
        <div class="header-text text-[#808BA0] font-semibold text-[16px]">
          №32151
        </div>
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
            @click="emit('close-sidebar')"
            label="Отменить"
            severity="warning"
            class="p-button-lg"
        />
      </div>
    </div>
    <div class="flex mt-[30px] gap-[26px]">
      <div class="">
        <img src="../../assets/img/GoodsImg.svg" alt="" class="w-full">
      </div>
      <div class="form w-full grid grid-cols-12 gap-[16px]">
        <fin-input placeholder="Наименвоание" class="col-span-12"/>

        <FloatLabel class="col-span-3" v-if="!hasOrganization">
          <Dropdown
              v-model="createValues.selectedOrganization"
              :options="organization"
              :class="{ 'p-invalid': v$.selectedOrganization.$error }"
              @click="findOrganization"
              :loading="loadingOrganization"
              optionLabel="name"
              class="w-full"
          />
          <label for="dd-city">Категория</label>
        </FloatLabel>
        <FloatLabel class="col-span-3">
          <Dropdown
              v-model="createValues.selectedCounterparty"
              :class="{ 'p-invalid': v$.selectedCounterparty.$error }"
              @click="findCounterparty"
              :options="counterparty"
              :loading="loadingCounterparty"
              optionLabel="name"
              class="w-full"
          />
          <label for="dd-city">Артикул</label>
        </FloatLabel>
        <FloatLabel class="col-span-3">
          <Dropdown
              v-model="createValues.selectedAgreement"
              :class="{ 'p-invalid': v$.selectedAgreement.$error }"
              @click="getAgreement"
              :loading="loadingAgreement"
              :options="agreementList"
              optionLabel="name"
              class="w-full"
          >
            <template #value>{{ createValues.selectedAgreement?.name }}</template>
          </Dropdown>
          <label for="dd-city">Ед. изм.</label>
        </FloatLabel>
        <FloatLabel class="col-span-3">
          <Dropdown
              v-model="createValues.selectedStorage"
              :class="{ 'p-invalid': v$.selectedStorage.$error }"
              @click="findStorage"
              :loading="loadingStorage"
              :options="storage"
              optionLabel="name"
              class="w-full"
          />
          <label for="dd-city">Местоположение</label>
        </FloatLabel>

        <FloatLabel class="col-span-12 mt-[10px]">
          <Textarea v-model="createValues.comments" class="w-full" style="min-height: 20px" rows="2" cols="20"/>
          <label for="dd-city">Описание</label>
        </FloatLabel>
      </div>
    </div>

  </div>
  <qs-code-add :product-id="props.productId" @postGoods="getProducts"/>
  <kit-goods :product-id="props.productId"/>
  <Toast/>
</template>

<style lang="scss">
@import "@/assets/style/colors";

.create-purchases {
  .p-select {
    border-color: #dcdfe3;
    border-radius: 10px !important;
    box-shadow: none !important;
    height: 46px;
    align-items: center;
  }

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
    //border-color: white;
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