<script setup>
import {reactive, ref} from "vue";
import {useAxios} from "@/composable/useAxios.js";
import Dropdown from "primevue/dropdown";
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";
import {useToast} from "primevue/usetoast";
import Toast from "primevue/toast";
import FloatLabel from "primevue/floatlabel";
import Textarea from 'primevue/textarea';
import FinInput from "@/components/ui/Inputs.vue";
import FileUpload from 'primevue/fileupload';

const emit = defineEmits(["closeDialog", 'close-sidebar']);
const props = defineProps({
  productId: {
    required: true,
  }
});

const toast = useToast();

const goodGroupList = ref([]);
const productsInfo = ref();
const listUnit = ref([]);
const locationList = ref([]);
const createValues = reactive({
  nameProduct: '',
  vendorCode: "",
  selectLocation: "",
  selectedGoodGroup: "",
  selectUnit: "",
  comments: "",
});
const rules = reactive({
  nameProduct: {required},
  vendorCode: {required},
  // selectLocation: {required},
  selectedGoodGroup: {required},
  selectUnit: {required},
});
const fileupload = ref();
const v$ = useVuelidate(rules, createValues);

async function unitList() {
  try {
    const res = await useAxios(`/unit`);
    return listUnit.value = res.result.data.map(item => {
      return {
        code: item.id,
        name: item.name,
      }
    })
  } catch (e) {
    console.log(e);
  }
}

unitList()

async function locationGet() {
  try {
    const res = await useAxios(`/location`);
    return locationList.value = res.result.data.map(item => {
      return {
        code: item.id,
        name: item.name,
      }
    })
  } catch (e) {
    console.log(e);
  }
}

locationGet()

async function goodGroupGet() {
  try {
    const res = await useAxios(`/good-group`);
    return goodGroupList.value = res.result.data.map(item => {
      return {
        code: item.id,
        name: item.name,
      }
    })
  } catch (e) {
    console.log(e);
  }
}

goodGroupGet()

async function saveFn() {
  const result = await v$.value.$validate();

  if (result) {
    try {
      const res = await useAxios(`/good`, {
        method: "POST",
        data: {
          name: createValues.nameProduct,
          vendor_code: createValues.vendorCode,
          unit_id: createValues.selectUnit.code,
          good_group_id: createValues.selectedGoodGroup.code,
          goods: productsInfo.value,
          main_image:''
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
        <img src="@/assets/img/emptyImg.svg" alt=""  class="w-full">
      </div>
      <div class="form w-full grid grid-cols-12 gap-[16px]">
        <fin-input placeholder="Введите название..." class="col-span-12" v-model="createValues.nameProduct"/>

        <FloatLabel class="col-span-3">
          <Dropdown
              v-model="createValues.selectedGoodGroup"
              :options="goodGroupList"
              :class="{ 'p-invalid': v$.selectedGoodGroup.$error }"
              optionLabel="name"
              class="w-full"
          />
          <label for="dd-city">Категория</label>
        </FloatLabel>
        <fin-input class="col-span-3" placeholder="Артикул" v-model="createValues.vendorCode">

        </fin-input>
        <FloatLabel class="col-span-3">
          <Dropdown
              v-model="createValues.selectUnit"
              :class="{ 'p-invalid': v$.selectUnit.$error }"
              :options="listUnit"
              optionLabel="name"
              class="w-full"
          />
          <label for="dd-city">Ед. изм.</label>
        </FloatLabel>
        <FloatLabel class="col-span-3">
<!--          :class="{ 'p-invalid': v$.selectLocation.$error }"-->
          <Dropdown
              v-model="createValues.selectLocation"

              :options="locationList"
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
  <div class="grid grid-cols-12 w-[29%] items-center mt-[30px]">
    <div class="text-qs-code col-span-6">
      Штрих-коды
    </div>
    <fin-button
        icon="pi pi-save"
        label="Добавить"
        severity="success"
        class="col-span-6"
    />
    <div class="dissipation-qs-code col-span-12 mt-4">
      Вы пока не добавили ни одного штрих-кода
    </div>
  </div>
  <hr class="mt-[30px]">
  <div class="grid grid-cols-12 w-[29%] items-center mt-[30px]">
    <div class="text-qs-code col-span-6">
      Набор
    </div>
    <fin-button
        icon="pi pi-save"
        label="Добавить"
        severity="success"
        class="col-span-6"
    />
    <div class="dissipation-qs-code col-span-12 mt-4">
      Вы пока не добавили ни одного набора
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

</style>
