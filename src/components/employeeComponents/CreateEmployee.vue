<script setup>
import {reactive, ref, watchEffect, watch, onMounted, computed} from "vue";
import DatePicker from "primevue/datepicker";
import {useStaticApi} from "@/composable/useStaticApi.js";
import {useAxios} from "@/composable/useAxios.js";
import CreateProduct from "@/components/CreateProduct.vue";
import Dropdown from "primevue/dropdown";
import moment from "moment";
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";
import {useToast} from "primevue/usetoast";
import FloatLabel from "primevue/floatlabel";

const emit = defineEmits(["closeDialog", 'close-sidebar']);

const toast = useToast();



const productsInfo = ref();
const isCurrencyFetched = ref(false);
const openInfoModal = ref(false);
const initialValue = ref(null);
const isModal = ref(false)
const createValues = reactive({
  name: "",
  address: "",
  phone: "",
  email: ""
});
const rules = reactive({
  name: {required},
  phone: {required},
  email: {required},
  address: {required},
});
const userName = {
  name: localStorage.getItem("user_name"),
};
const v$ = useVuelidate(rules, createValues);

async function saveFn() {
  const result = await v$.value.$validate();
  openInfoModal.value = false;

  if (result) {
    const formData = new FormData();

    formData.append("name", createValues.name);
    formData.append("address", createValues.address);
    formData.append("phone", createValues.phone);
    formData.append("group_id", 1);
    formData.append("email", createValues.email);

    if (imageRefs.value.length > 0) {
      formData.append("image", imageRefs.value[0]);
    }

    try {
      const res = await useAxios(`employee`, {
        method: "POST",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
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



async function infoModalClose() {
  if (isModal.value || productsInfo.value?.length > 0) openInfoModal.value = true
  else emit('close-sidebar')
}

const fileInput = ref()
const imagePreview = ref([]);

watch(createValues, (newVal) => {
  if (initialValue.value !== null) {
    isModal.value = true;
  }
  initialValue.value = newVal;
}, {deep: true});


const imageRefs = ref([]);
const onPickFile = () => {
  fileInput.value.click();
};

const selectImage = (event) => {
  const files = event.target.files;

  for (const file of files) {
    imageRefs.value.push(file);
    const fileReader = new FileReader();
    fileReader.addEventListener('load', () => {
      imagePreview.value.push(fileReader.result);
    });
    fileReader.readAsDataURL(file);
  }

};
</script>

<template>
  <div class="create-purchases">
    <div class="header">
      <div>
        <div class="header-title">Создания сотрудника</div>
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
            @click="infoModalClose"
            label="Отменить"
            severity="warning"
            class="p-button-lg"
        />
      </div>
    </div>
    <div class="form grid grid-cols-12 gap-[16px] mt-[30px]">
      <div class="relative col-span-3 h-[100%] ">
        <input
            accept="image/*"
            type="file"
            @change="selectImage"
            style="display: none"
            class="h-[100%]"
            ref="fileInput"
        />
        <div v-if="imagePreview.length !== 0">
          <img
              :src="imagePreview[0]"
              @click="onPickFile"
              alt=""
              class=" m-auto rounded-[16px] object-cover"
          />
        </div>
        <div v-else
             class="m-auto flex h-[100%] items-center justify-center border border-dashed rounded-[16px]">
          <button @click="onPickFile" class="text-gray-500">
            Загрузить изображение
          </button>
        </div>
      </div>

      <!-- Form Fields -->
      <div class="col-span-9 grid grid-cols-12 gap-[10px]">

        <fin-input v-model="createValues.name" :class="{ 'p-invalid': v$.name.$error }" class="col-span-6 "
                   placeholder="Имя"/>
        <fin-input v-model="createValues.phone" :class="{ 'p-invalid': v$.phone.$error }" class="col-span-6"
                   placeholder="Телефон"/>
        <fin-input v-model="createValues.email"  :class="{ 'p-invalid': v$.email.$error }" class="col-span-6" placeholder="Email"/>
        <fin-input v-model="createValues.address"  :class="{ 'p-invalid': v$.address.$error }"  class="col-span-6" placeholder="Адрес"/>
      </div>
    </div>
  </div>

  <div class="text-[20px] font-[600] absolute bottom-[40px]">
    Автор: {{ userName.name }}
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

  .p-invalid {
    border: 1px solid #f2376f !important;
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
