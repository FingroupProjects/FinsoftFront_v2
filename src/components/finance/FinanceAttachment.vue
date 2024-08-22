<script setup>
import Dropdown from "primevue/dropdown";
import InputText from "primevue/inputtext";
import FloatLabel from "primevue/floatlabel";
import DatePicker from "primevue/datepicker";
import Textarea from "primevue/textarea";
import {reactive, ref, watch, watchEffect} from "vue";
import {useStaticApi} from "@/composable/useStaticApi.js";
import {useAxios} from "@/composable/useAxios.js";
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";
import Dialog from "primevue/dialog";
import {useFinanceStore} from "@/store/finance.js";

const store = useFinanceStore()

const emit = defineEmits(["closeDialog", 'close-sidebar']);


const {
  findCurrency,
  currency,
  loading,
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
const isCurrencyFetched = ref(false);
const initialValue = ref(null);
const isModal = ref(false);
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
const userName = {
  name: localStorage.getItem("user_name"),
};
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

findStorage()


watch(createValues, (newVal) => {
  if (initialValue.value !== null) {
    // This will only execute after the initial value is set
    store.isModal = true;
  }
  initialValue.value = newVal;
}, {deep: true});

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
  <div class="form grid grid-cols-12 gap-[16px] col-span-8 ">
    <FloatLabel class="col-span-6">
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

    <FloatLabel class="col-span-6">
      <Dropdown
          v-model="createValues.selectedStorage"
          :class="{ 'p-invalid': v$.selectedStorage.$error }"
          @click="findStorage"
          :loading="loadingStorage"
          :options="storage"
          optionLabel="name"
          class="w-full"
      />
      <label for="dd-city">Автор</label>
    </FloatLabel>

    <FloatLabel class="col-span-6" v-if="!hasOrganization">
      <Dropdown
          v-model="createValues.selectedOrganization"
          :options="organization"
          :class="{ 'p-invalid': v$.selectedOrganization.$error }"
          @click="findOrganization"
          :loading="loadingOrganization"
          optionLabel="name"
          class="w-full"
      />
      <label for="dd-city">Организация</label>
    </FloatLabel>
    <FloatLabel class="col-span-6">
      <Dropdown
          v-model="createValues.selectedCounterparty"
          :class="{ 'p-invalid': v$.selectedCounterparty.$error }"
          @click="findCounterparty"
          :options="counterparty"
          :loading="loadingCounterparty"
          optionLabel="name"
          class="w-full"
      />
      <label for="dd-city">Поставщик</label>
    </FloatLabel>

    <FloatLabel class="col-span-12">
      <Dropdown
          v-model="createValues.selectCurrency"
          :class="{ 'p-invalid': v$.selectCurrency.$error }"
          @click="findCurrency(createValues.selectedAgreement)"
          :loading="loading"
          :options="currency"
          optionLabel="name"
          class="w-full"
      >
        <template #value>
          {{ createValues.selectCurrency?.name }}
        </template>
      </Dropdown>
      <label for="dd-city">Банковский счет</label>
    </FloatLabel>

    <div class="col-span-12 grid grid-cols-12 gap-[16px] border border-dashed p-[10px] rounded-[10px]">
      <fin-input class="col-span-6" placeholder="Основание"/>
      <FloatLabel class="col-span-6">
        <Dropdown
            v-model="createValues.selectedStorage"
            :class="{ 'p-invalid': v$.selectedStorage.$error }"
            @click="findStorage"
            :loading="loadingStorage"
            :options="storage"
            optionLabel="name"
            class="w-full"
        />
        <label for="dd-city">Касса</label>
      </FloatLabel>
      <FloatLabel class="col-span-12 mt-[10px]">
        <Textarea v-model="createValues.comments" class="w-full" style="min-height: 20px" rows="2" cols="20"/>
        <label for="dd-city">Комментарий</label>
      </FloatLabel>
      <div class="col-span-12 p-[26px] bg-[#ECF1FB] mt-[26px] rounded-[10px]">
        <div class="w-full input-finance-sum">
          <InputText type="text" size="large" class="w-full" placeholder="Сумма"/>
        </div>

        <fin-button icon="pi pi-arrow-right" class="mt-[26px] w-full" icon-pos="left" severity="success"
                    label="Провести операцию"/>
      </div>
    </div>
  </div>
  <Dialog
      v-model:visible="store.openInfoModal"
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
.input-finance-sum {
  .p-inputtext {
    border-radius: 10px !important;
    border-color: transparent !important;
  }
}
</style>