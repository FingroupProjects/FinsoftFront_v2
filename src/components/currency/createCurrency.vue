<script setup>
import {reactive, computed, ref} from "vue";
import {useAxios} from "@/composable/useAxios.js";
import Dropdown from "primevue/dropdown";
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";
import {useToast} from "primevue/usetoast";
import Toast from "primevue/toast";
import FloatLabel from "primevue/floatlabel";
import Textarea from 'primevue/textarea';
import FinInput from "@/components/ui/Inputs.vue";
import emptyImg from '@/assets/img/emptyImg.svg';
import Carousel from 'primevue/carousel';
import moment from "moment/moment.js";

const emit = defineEmits(["closeDialog", 'close-sidebar']);

const toast = useToast();

const openInfoModal = ref()
const createValues = reactive({
  name: "",
  symbol_code: "",
  digital_code: "",
  multiplicity: ""
});
const rules = reactive({
  name: {required},
  symbol_code: {required},
  digital_code: {required},
  multiplicity: {required},
});
const v$ = useVuelidate(rules, createValues);

async function saveFn() {
  const result = await v$.value.$validate();
  openInfoModal.value = false
  if (result) {
    try {
      const res = await useAxios(`currency`, {
        method: "POST",
        data: {
          digital_code: createValues.digital_code,
          symbol_code: createValues.symbol_code,
          name: createValues.name,
          multiplicity: createValues.multiplicity
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

</script>

<template>
  <div class="create-purchases">
    <div class="header">
      <div>
        <div class="header-title">Добавление валюты</div>
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
    <div class="grid grid-cols-10 mt-[30px] gap-[26px]">
      <div class="form w-full col-span-12 grid grid-cols-12 gap-[16px] relative create-goods">
        <fin-input placeholder="Название" class="col-span-5" v-model="createValues.name"/>
        <fin-input placeholder="Символьный код" class="col-span-5" v-model="createValues.symbol_code"/>
        <fin-input placeholder="Цифровой код" class="col-span-5" v-model="createValues.digital_code"/>
        <fin-input placeholder="Кратность" class="col-span-5" v-model="createValues.multiplicity"/>
      </div>
    </div>

  </div>
  <div class="grid grid-cols-12 w-[29%] items-center mt-[30px]">
    <div class="text-qs-code col-span-6">
      Курсы валют
    </div>
    <fin-button
        icon="pi pi-save"
        label="Добавить"
        severity="success"
        class="col-span-6"
    />
    <div class="dissipation-qs-code col-span-12 mt-4">
      Вы пока не добавили ни одного курса
    </div>
  </div>
  <hr class="mt-[30px]">
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
