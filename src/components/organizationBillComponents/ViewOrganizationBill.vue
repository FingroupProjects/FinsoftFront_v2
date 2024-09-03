<script setup>
import {computed, onMounted, reactive, ref} from "vue";
import {useAxios} from "@/composable/useAxios.js";
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";
import {useToast} from "primevue/usetoast";
import Toast from "primevue/toast";
import FinInput from "@/components/ui/Inputs.vue";
import DatePicker from "primevue/datepicker";
import FloatLabel from "primevue/floatlabel";
import Textarea from "primevue/textarea";
import Dropdown from "primevue/dropdown";
import {useStaticApi} from "@/composable/useStaticApi.js";
const emit = defineEmits(["closeDialog", 'close-sidebar']);
import moment from "moment";
import Select from "primevue/dropdown";
const props = defineProps({
  productId: {
    required: true,
  },
  openModalClose: {
    type: Boolean,
    default: false
  },
  data: Object
});
const {
  findCurrency,
  currency,
  loading,
  findOrganization,
  organization,
  loadingOrganization,
} = useStaticApi();

onMounted(function (){
  findCurrency()
  findOrganization()
})

const toast = useToast();

const id = ref();
const createValues = reactive({
  datetime24h: new Date,
  selectCurrency: "",
  bill_number: "",
  comments: "",
  selectedOrganization: "",
  name: ""
});
const rules = reactive({
  datetime24h: {required},
  selectCurrency: {required},
  selectedOrganization: {required},
  name: {required},
  bill_number: {required}
});
const v$ = useVuelidate(rules, createValues);


async function saveFn() {
  const result = await v$.value.$validate();
  if (result) {
    try {
      const res = await useAxios(`organizationBill/${props.productId}`, {
        method: "PATCH",
        data: {
          date: moment(createValues.datetime24h).format("YYYY-MM-DD"),
          organization_id: createValues.selectedOrganization.id,
          currency_id: createValues.selectCurrency.id,
          comment: createValues.comments,
          bill_number: createValues.bill_number,
          name: createValues.name
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

async function getGood() {
  const item = props.data
  console.log(item)
  createValues.name = item.name
  createValues.bill_number = item.bill_number
  createValues.selectCurrency = item.currency
  createValues.comments = item.comment
  createValues.date = item.date
  createValues.selectedOrganization = item.organization

  id.value = item.id
}

onMounted(async () => {
  await getGood()
});


const organizationJson = localStorage.getItem('organization');
const organizationHas = JSON.parse(organizationJson);
const hasOrganization = JSON.parse(localStorage.getItem('hasOneOrganization'));
</script>

<template>
  <div class="create-purchases">
    <div class="header">
      <div>
        <div class="header-title">Просмотр</div>
        <div class="header-text text-[#808BA0] font-semibold text-[16px]">

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
            label="Закрыть"
            severity="warning"
            class="p-button-lg"
        />
      </div>
    </div>
    <div class="form grid grid-cols-12 gap-[16px] mt-[30px]">
      <fin-input v-model="createValues.name" class="col-span-4" :error="v$.name.$error" placeholder="Наименование"/>
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

      <FloatLabel class="col-span-4">
        <Dropdown
            v-model="createValues.selectedOrganization"
            :class="{ 'p-invalid': v$.selectedOrganization.$error }"
            :loading="loadingOrganization"
            :options="organization"
            optionLabel="name"
            class="w-full"
        >
          <template #value>
            {{ createValues.selectedOrganization?.name }}
          </template>
        </Dropdown>
        <label for="dd-city">Организация</label>
      </FloatLabel>
      <fin-input v-model="createValues.bill_number" class="col-span-4" :error="v$.bill_number.$error" placeholder="Номер счета"/>
      <FloatLabel class="col-span-4">
        <Dropdown
            v-model="createValues.selectCurrency"
            :class="{ 'p-invalid': v$.selectCurrency.$error }"
            :loading="loading"
            :options="currency"
            optionLabel="name"
            class="w-full"
            disabled style="background-color: #fff !important;"
        >
          <template #value>
            {{ createValues.selectCurrency?.name }}
          </template>
        </Dropdown>
        <label for="dd-city">Валюта</label>
      </FloatLabel>
      <FloatLabel class="col-span-12 mt-[10px]">
        <Textarea v-model="createValues.comments" class="w-full" style="min-height: 20px" rows="2" cols="20"/>
        <label for="dd-city">Комментарий</label>
      </FloatLabel>
    </div>
  </div>

  <Toast/>
</template>

<style lang="scss" scoped>
.text-qs-code {
  font-family: Manrope, sans-serif;
  font-size: 20px;
  line-height: 20px;
  color: #141C30;
  font-weight: 600;
}

.dissipation-qs-code {
  font-family: Manrope, sans-serif;
  font-size: 15px;
  line-height: 15px;
  color: #808BA0;
  font-weight: 600;
}

.img-goods {
  width: 261px !important;
  height: 207px !important;
  position: relative;
  z-index: 333;
}

</style>
