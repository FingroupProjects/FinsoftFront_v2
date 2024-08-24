<script setup>
import {computed, onMounted, reactive, ref} from "vue";
import {useAxios} from "@/composable/useAxios.js";
import Dropdown from "primevue/dropdown";
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";
import {useToast} from "primevue/usetoast";
import Toast from "primevue/toast";
import FloatLabel from "primevue/floatlabel";
import Textarea from 'primevue/textarea';
import FinInput from "@/components/ui/Inputs.vue";
import moment from "moment";
import DatePicker from "primevue/datepicker";
import {useStaticApi} from "@/composable/useStaticApi.js";
import {data} from "autoprefixer";

const emit = defineEmits(["closeDialog", 'close-sidebar']);

const props = defineProps({
  productId: {
    required: true,
  }
});

const toast = useToast();

const id = ref();
const viewValues = reactive({
  date: '',
  name: '',
  bill_number: "",
  organization: "",
  currency: "",
  comments: "",
});
const rules = reactive({
  name: {required},
  date: {required},
  bill_number: {required},
  organization: {required},
  currency: {required},
});
const v$ = useVuelidate(rules, viewValues);
const {
  findCurrency,
  currency,
  loading,
  findOrganization,
  organization,
  loadingOrganization,
} = useStaticApi();

async function saveFn() {
  const result = await v$.value.$validate();

  if (result) {
    try {
      const res = await useAxios(`organizationBill/${props.productId}`, {
        method: "PATCH",
        data: {
          date: moment(viewValues.date).format("YYYY-MM-DD"),
          organization_id: viewValues.organization.code,
          currency_id: viewValues.currency.code,
          comment: viewValues.comments,
          bill_number: viewValues.bill_number,
          name: viewValues.name
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
        detail: e.response.data.message,
        life: 3000,
      });
    }
  }
}

async function getGood() {
  try {
    const res = await useAxios(`/organizationBill/${props.productId}`);
    console.log(res)
    viewValues.name = res.result.name
    viewValues.bill_number = res.result.bill_number
    viewValues.currency = {
      name: res.result.currency.name,
      code: res.result.currency.id
    }
    viewValues.comments = res.result.description
    viewValues.date = moment(res.result.date).format("YYYY-MM-DD")
    viewValues.organization = {
      name: res.result?.organization.name,
      code: res.result.organization.id
    }
    id.value = res.result.id
  } catch (e) {
    console.log(e);
  }
}


onMounted(function (){
  getGood()
  findOrganization()
  findCurrency()
})

</script>

<template>
  <div class="create-purchases">
    <div class="header">
      <div>
        <div class="header-title"> Просмотр банковский счет организации</div>
        <div class="header-text text-[#808BA0] font-semibold text-[16px]">
          №{{ id }}
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
      <fin-input v-model="viewValues.name" class="col-span-4" :error="v$.name.$error" placeholder="Наименование"/>
      <FloatLabel class="col-span-4">
        <DatePicker
            showIcon
            v-model="viewValues.date"
            :class="{ 'p-invalid': v$.date.$error }"
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

      <FloatLabel class="col-span-4" >
        <Dropdown
            v-model="viewValues.organization"
            :options="organization"
            :class="{ 'p-invalid': v$.organization.$error }"
            @click="findOrganization"
            :loading="loadingOrganization"
            optionLabel="name"
            class="w-full"
        >
          <template #value>
            {{ viewValues.organization?.name }}
          </template>
        </Dropdown>
        <label for="dd-city">Организация</label>
      </FloatLabel>
      <fin-input v-model="viewValues.bill_number" class="col-span-4" :error="v$.bill_number.$error" placeholder="Номер счета"/>
      <FloatLabel class="col-span-4">
        <Dropdown
            v-model="viewValues.currency"
            :class="{ 'p-invalid': v$.currency.$error }"
            @click="findCurrency"
            :loading="loading"
            :options="currency"
            optionLabel="name"
            class="w-full"
        >
          <template #value>
            {{ viewValues.currency?.name }}
          </template>
        </Dropdown>
        <label for="dd-city">Валюта</label>
      </FloatLabel>
      <FloatLabel class="col-span-12 mt-[10px]">
        <Textarea v-model="viewValues.comments" class="w-full" style="min-height: 20px" rows="2" cols="20"/>
        <label for="dd-city">Комментарий</label>
      </FloatLabel>
    </div>

  </div>
  <Toast/>
</template>

<style lang="scss" scoped>
.text-qs-id {
  font-family: Manrope, sans-serif;
  font-size: 20px;
  line-height: 20px;
  color: #141C30;
  font-weight: 600;
}

.dissipation-qs-id {
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
