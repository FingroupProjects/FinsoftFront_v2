<script setup>
import {onMounted, reactive, ref, watch, watchEffect} from "vue";
import {useAxios} from "@/composable/useAxios.js";
import {useStaticApi} from "@/composable/useStaticApi.js";
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";
import {useToast} from "primevue/usetoast";
import Dialog from "primevue/dialog";
import Select from "primevue/select"
import MultiSelect from "primevue/multiselect";
import FloatLabel from "primevue/floatlabel";

const {
  organization,
  findOrganization,
  loadingOrganization,
} = useStaticApi();

const props = defineProps({
  idPlanning: Number,
  data: {
    type: [Object, Number],
    default: () => ({}),
  },
});

const emit = defineEmits(["closeDialog", 'close-sidebar']);
const toast = useToast();

const selectedValues = ref([])
const params = ref([])
const selectedGoods = ref()
const goodGroups = ref([]);
const getGoodsData = ref([])
const getGoodsList = ref([])
const visibleAddGoods = ref(false)
const openInfoModal = ref(false);
const initialValue = ref(null);
const isModal = ref(false)
const goods = ref([])
const months = {
  1: "Январь",
  2: "Февраль",
  3: "Март",
  4: "Апрель",
  5: "Май",
  6: "Июнь",
  7: "Июль",
  8: "Август",
  9: "Сентябрь",
  10: "Октябрь",
  11: "Ноябрь",
  12: "Декабрь"
};
const pagination = ref({
  perPage: 0,
  totalPages: 0,
});
const createValues = reactive({
  selectedOrganization:"",
  year: "",
});

const userName = {
  name: localStorage.getItem("user_name"),
};
const organizationJson = localStorage.getItem('organization');
const organizationHas = JSON.parse(organizationJson);
const hasOrganization = JSON.parse(localStorage.getItem('hasOneOrganization'));

const getGoodsGroup = async (filters = {}) =>{
  const res = await useAxios(`/good-group`)
  pagination.value.totalPages = Number(res.result.pagination.total_pages);
  goodGroups.value = res.result.data
}

function onGroupSelect(groups) {
  params.value.groupIds = groups.map(group => group.id);
}

const getGoodByGroups = async () => {
  try {
    const res = await useAxios(`/good/goods-by-group-ids/`, {
      params: { ids: params.value.groupIds }
    });
    const newGoods = res.result.filter(item =>
        !getGoodsData.value.some(existingItem => existingItem.id === item.id)
    );
    if (newGoods.length === 0) {
      toast.add({
        severity: "warn",
        summary: "Предупреждение!",
        detail: "Товар уже существует!",
        life: 3000,
      });
    } else {
      const generateEmptyMonths = () => {
        const months = {};
        for (let i = 1; i <= 12; i++) {
          months[i] = null;
        }
        return months;
      };
      const goodsWithMonths = newGoods.map(item => ({
        ...item,
        months: generateEmptyMonths()
      }));
      getGoodsData.value.push(...goodsWithMonths);
      console.log('push', goodsWithMonths);
    }
  } catch (error) {
    console.error("Error fetching goods by group IDs:", error);
  }
  visibleAddGoods.value = !visibleAddGoods.value;
};


const getGoods = async () =>{
  const res = await useAxios(`/good`);
  getGoodsList.value = res.result.data
}

const addToArray = () => {
  const createEmptyMonths = () => {
    const months = {};
    for (let i = 1; i <= 12; i++) {
      months[i] = null;
    }
    return months;
  };
  const exists = getGoodsData.value.some(item => item.id === selectedGoods.value.id);
  if (!exists) {
    const transformedGoods = {
      id: selectedGoods.value.id,
      name: selectedGoods.value.name,
      months: createEmptyMonths()
    }
    getGoodsData.value.push(transformedGoods);
    console.log('Updated Goods Data:', getGoodsData.value);
  } else {
    toast.add({
      severity: "warn",
      summary: "Предупреждение!",
      detail: "Товар уже существует!",
      life: 3000,
    });
    console.log('Item already exists in getGoodsData:', selectedGoods.value.id);
  }
};

const handleInput = (monthId, goodId, event) => {
  const value = parseInt(event.target.value);
  const index = getGoodsData.value.findIndex(item => item.id === goodId);
  if (index !== -1) {
    if (monthId in getGoodsData.value[index].months) {
      getGoodsData.value[index].months[monthId] = value;
    } else {
      console.error(`MonthId ${monthId} not found in the months object for goodId ${goodId}`);
    }
  } else {
    console.error(`Item with id ${goodId} not found in goods.value`);
  }
};

const getPlanning = async () => {
  const res = await useAxios(`/plan/goods/${props.idPlanning}`);
  const result = res.result;
  createValues.selectedOrganization = {
    code: result.organization.id,
    name: result.organization.name
  };
  createValues.year = result.year;
  const goodsMap = new Map()
  result.goods.forEach(item => {
    const goodId = item.good.id;
    const monthId = item.month.id;
    if (!goodsMap.has(goodId)) {
      goodsMap.set(goodId, {
        id: item.good.id,
        name: item.good.name,
        months: {}
      });
      for (let i = 1; i <= 12; i++) {
        goodsMap.get(goodId).months[i] = null;
      }
    }
    goodsMap.get(goodId).months[monthId] = item.quantity || 0;
  });
  getGoodsData.value = Array.from(goodsMap.values());
  console.log('let',res.result)
};

async function saveFn() {
  console.log('goods', goods.value)
  try {
    const res = await useAxios(`/plan/goods/${props.idPlanning}`, {
      method: "PATCH",
      data: {
        organization_id: createValues.selectedOrganization.code,
        year: createValues.year,
        goods: getGoodsData.value.map(item => {
          const goods = [];
          Object.keys(item.months).forEach(monthId => {
            const quantity = item.months[monthId] === null ? 0 : item.months[monthId];
            goods.push({
              good_id: item.id,
              month_id: parseInt(monthId),
              quantity: quantity,
            });
          });
          return goods;
        }).flat()
      }
    });
    console.log('1', getGoodsData.value)
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

watchEffect(() => {
  if (hasOrganization === true) createValues.selectedOrganization = {
    name: organizationHas.name,
    code: organizationHas.id
  }
});

watch(createValues, (newVal) => {
  if (initialValue.value !== null) {
    isModal.value = true;
  }
  initialValue.value = newVal;
}, {deep: true});
onMounted(async () => {
  try {
    await Promise.all([
      findOrganization()
    ]);
  } catch (error) {
    console.error('Error:', error);
  }
});

onMounted(()=>{
  getGoodsGroup()
  getGoods()
  getPlanning()
})
</script>

<template>
  <div class="create-purchases">
    <div class="header">
      <div>
        <div class="header-title">Просмотр план товаров</div>
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
            label="Отменить"
            severity="warning"
            class="p-button-lg"
        />
      </div>
    </div>
    <div class="flex gap-4 mt-[30px]">
      <FloatLabel v-if="!hasOrganization">
        <Select
            v-model="createValues.selectedOrganization"
            :options="organization"
            :loading="loadingOrganization"
            optionLabel="name"
            class="w-[200px]"
        >
          <template #value>
            {{createValues.selectedOrganization.name}}
          </template>
        </Select>
        <label for="dd-city">Организация</label>
      </FloatLabel>
      <fin-input placeholder="Год" v-model="createValues.year"  />
      <FloatLabel v-if="!hasOrganization">
        <MultiSelect
            filter
            v-model="selectedValues"
            :maxSelectedLabels="3" class="w-full md:w-80"
            :options="goodGroups"
            optionLabel="name"
            @update:modelValue="onGroupSelect"
        />
        <label for="dd-city">Товары</label>
      </FloatLabel>
      <fin-button
          icon="pi pi-plus"
          label="Добавить"
          @click="getGoodByGroups"
          severity="success"
          class="p-button-lg"
      />
    </div>
    <div>
      <table class="w-full mt-6">
        <thead class="bg-gray-200 gap-4 text-center text-black">
        <tr>
          <th class="border-2 border-gray-300 w-[150px]">Товар</th>
          <th v-for="(month, index) in months" :key="index" class="border-2 border-gray-300">
            {{ month }}
          </th>
        </tr>
        </thead>
        <tbody>
        <tr class="text-center" v-for="{ id: goodId, name: goodName, months } in getGoodsData" :key="goodId">
          <td class="fz-14 border-2">{{ goodName }}</td>
          <td v-for="(monthName, monthId) in months" :key="monthId">
            <fin-input
                class="h-full"
                placeholder=""
                v-model="months[monthId]"
            @input="handleInput(monthId, goodId, $event)"
            />
          </td>
        </tr>
        </tbody>
      </table>
      <FloatLabel v-if="visibleAddGoods" class="mt-4">
        <Select
            v-model="selectedGoods"
            :options="getGoodsList"
            optionLabel="name"
            class="w-[200px]"
            @update:modelValue="addToArray"
        />
        <label for="dd-city">Товары</label>
      </FloatLabel>
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

  .p-datepicker {
    border: none;
    border-radius: 10px;
    display: flex;
    align-items: center;

    &-input-icon-container {
      top: 15px !important;
    }
  }

  .p-datatable-table-container::-webkit-scrollbar {
    width: 4px !important;
    height: 3px !important;
  }

  .p-datatable-table-container::-webkit-scrollbar-track {
    background-color: #f1f1f1 !important;
    height: 3px !important;
  }

  .p-datatable-table-container::-webkit-scrollbar-thumb {
    background-color: #3935E7 !important;
    border-radius: 6px !important;
    height: 3px !important;
  }

  .p-datatable-table-container::-webkit-scrollbar-thumb:hover {
    background-color: #3935E7;
    height: 3px !important;
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
