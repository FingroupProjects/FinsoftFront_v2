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
import DataTable from "primevue/datatable";
import Column from "primevue/column";


const workerSchedule = ref()
const nameSchedule = ref()
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

const weeks = ref();


const toast = useToast();

const id = ref();
const createValues = reactive({
  name: ""
});
const rules = reactive({

  name: {required},
});
const v$ = useVuelidate(rules, createValues);

async function getGood() {
  const item = props.data
  workerSchedule.value = item.workerSchedule
  nameSchedule.value = item.name
  weeks.value = item.weekHours
  console.log('123', item )
  id.value = item.id
}

async function saveFn() {
  const result = await v$.value.$validate();
  console.log('before',workerSchedule.value)
    try {
      const res = await useAxios(`/schedule/${props.productId}`, {
        method: "PATCH",
        data: {
          name: nameSchedule.value,
          data: workerSchedule.value.map((item, index) => ({
            id: item.id,
            month_id: index + 1,
            number_of_hours: item.number_of_hours
          })),
          weeks: weeks.value.map(item => ({
            id: item.id,
            week: item.week,
            hour: Number(item.hours)
          }))
        }
      });
      const ress =  res.result
      workerSchedule.value = ress.workerSchedule
      console.log('after',workerSchedule.value)
      toast.add({
        severity: "success",
        summary: "Success Message",
        detail: "Message Content",
        life: 3000,
      });
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
      <fin-input v-model="nameSchedule" class="col-span-4" placeholder="Наименование"/>
    </div>
    <div class="form grid grid-cols-7 gap-[16px] mt-[30px] w-full">
      <fin-input
          v-for="week in weeks"
          v-model="week.hours"
          min-width="10px"
          max-width="10px"
          placeholder=""
          type="number"
      />
    </div>
    <div class="flex justify-end gap-[16px] mt-[30px] w-full">
    </div>

    <div class=" mt-10 border-4 rounded-xl  w-full   " >
      <DataTable scrollable scrollHeight="500px" :value="workerSchedule" :paginator="true" :rows="12">
        <Column
            header="#"
            class="items-center w-[100px] h-[50px]"
        >
          <template #body="slotProps">
            {{ slotProps.index + 1 }}
          </template>
        </Column>
        <Column
            field="month.name"
            header="Месяц"
            class="items-center w-[300px] h-[50px]"
        ></Column>
        <Column
            header="Кол.Часов"
            class="items-center w-[70px] h-[50px]"
        >
          <template #body="slotProps">
            <fin-input placeholder="" v-model.number="slotProps.data.number_of_hours" class="w-[100px] h-full" />
          </template>
        </Column>
      </DataTable>
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
