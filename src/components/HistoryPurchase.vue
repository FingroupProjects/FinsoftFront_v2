<script setup>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import {useAxios} from "@/composable/useAxios.js";
import {onMounted, ref} from "vue";


const historyCteatedData = ref({})
const historyUpdatedData = ref([])
const goodsHistory = ref([])
const props = defineProps({
  productId: {
    required: true,
  },
});
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  };
  return date.toLocaleString('en-GB', options).replace(',', '');
};

const getHistory = async () => {
  try {
    const res = await useAxios(`/document/changeHistory/${props.productId}`);
    const item = res.result;
    item.history.forEach(item => {
      if (item.status === 'Создан') {
        historyCteatedData.value = {
          status: item.status,
          userName: item.user.name,
          date: formatDate(item.date),
        }
      } else if (item.status === "Изменен") {
        historyUpdatedData.value.push({
          status: item.status,
          userName: item.user.name,
          date: formatDate(item.date),
          body: item.changes[0].body,
          goods: item.changes[0].goods,
        });
      }
    })

  } catch (error) {
    console.error(error)
  }
}

const getGoodsHistory = async () => {
  console.log(historyUpdatedData.value)
  goodsHistory.value = historyUpdatedData.value.map((item) => {
    return item.goods.map((good) => ({
      good: good.good,
      price: good.body.price,
      amount: good.body.amount,
      type: good.type,
      priceEditValue: good.body?.Цена?.new_value,
      previousValue: good.body?.Цена?.previous_value,
      colValueEdit:good.body?.Количество?.new_value,
      colPreviousValueEdit:good.body?.Количество?.previous_value,
    }));
  }).flat();
};

onMounted(async () => {
  await getHistory();
  await getGoodsHistory();
})

</script>

<template>
  <div>
    <div class="ml-5 -mt-2">
      <p class="text-[20px] font-semibold text-[#141C30]">История закупки</p>
    </div>
    <div class="rounded-[10px] flex justify-between items-center p-[18px] mt-[16px] bg-[#F6F6F6]">
      <div class="text-[#000000] font-semibold text-[20px] leading-[20px]">{{ historyCteatedData.status }}</div>
      <div class="flex gap-[20px]">
        <div class="text-[#000000] font-semibold text-[15px] leading-[15px]">{{ historyCteatedData.userName }}</div>
        <div class="text-[#808BA0] font-semibold text-[15px] leading-[15px]">{{ historyCteatedData.date }}</div>
      </div>
    </div>
    <div v-for="item in historyUpdatedData" class="rounded-[10px]  p-[18px] mt-[16px] bg-[#F6F6F6]">
      <div class=" flex justify-between items-center">
        <div class="text-[#000000] font-semibold text-[18px] leading-[20px]">Изменен</div>
        <div class="flex gap-[20px]">
          <div class="text-[#141C30] font-semibold text-[15px] leading-[15px]">{{ item.userName }}</div>
          <div class="text-[#808BA0] font-semibold text-[15px] leading-[15px]">{{ item.date }}</div>
        </div>
      </div>

      <div class="flex gap-[10px]" v-for="(data, key) in item.body">
        <div class="text-[#141C30] mt-3 font-semibold text-[15px] leading-[15px]">{{ key }}:</div>
        <div class="text-[#141C30] mt-3 font-semibold text-[15px] leading-[15px]">{{ data.new_value }} >
          {{ data.previous_value }}
        </div>
      </div>

    </div>
    <div class="rounded-[10px]  p-[18px] mt-[16px] bg-[#F6F6F6]" v-if="goodsHistory.length !== 0">
      <div class="flex justify-between items-center">
        <div class="text-[#000000] font-semibold text-[20px] leading-[18px]">Изменен</div>
        <div class="flex gap-[20px]">
          <div class="text-[#000000] font-semibold text-[15px] leading-[20px]">{{ historyCteatedData.userName }}</div>
          <div class="text-[#808BA0] font-semibold text-[15px] leading-[20px]">{{ historyCteatedData.date }}</div>
        </div>
      </div>
      <div class="mt-[10px]">
        <DataTable class="font-semibold" :value="goodsHistory"
                   tableStyle="min-width: 10px; height: 100px;">
          <Column class="font-semibold" header="Товар">
            <template #body="slotProps">
              <div style="display: flex; align-items: center;">
                <i v-if="!slotProps.data.photo" class="pi pi-image" style="margin-right: 10px;"></i>
                <img v-else :src="slotProps.data.image" class="image-good" alt=""/>
                <span class="ml-[10px] font-semibold">{{ slotProps.data.good }}</span>
              </div>
            </template>
          </Column>
          <Column header="Статус" style="width: 100px; font-size: 15px; font-weight: 600;">
            <template #body="slotProps">
              <span>{{ slotProps.data.type }}</span>
            </template>
          </Column>
          <Column header="Кол-во" style="width: 100px; font-size: 15px; font-weight: 600;">
            <template #body="slotProps">
              <span style="color: green">
                <span v-if="slotProps.data.type === 'Создан'"
                      style="color: #808ba0;">0&lt;</span>{{ slotProps.data.amount }}
                    <span v-if="slotProps.data.type === 'Изменен'"
                          style="color: #808ba0;">{{slotProps.data.colPreviousValueEdit}}&lt;</span>{{ slotProps.data.colValueEdit }}
              </span>
            </template>
          </Column>
          <Column header="Цена" style="width: 100px; font-size: 15px; font-weight: 600;">
            <template #body="slotProps">
              <span style="color: green">
                <span v-if="slotProps.data.type === 'Создан'"
                      style="color: #808ba0;">0&lt;</span>{{ slotProps.data.price }}
                  <span v-if="slotProps.data.type === 'Изменен'"
                        style="color: #808ba0;">{{
                      slotProps.data.previousValue
                    }}&lt;</span>{{ slotProps.data.priceEditValue }}
              </span>
            </template>
          </Column>
        </DataTable>

      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pi-image {
  background-color: #f6f6f6 !important;
  border-radius: 10px !important;
  padding: 3px;
  width: 32px;
  height: 32px;
  font-size: 14px !important;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #808ba0 !important;
}

</style>