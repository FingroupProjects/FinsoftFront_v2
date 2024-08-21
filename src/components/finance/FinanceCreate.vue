<script setup>
import {ref, computed} from 'vue';
import FinanceTabs from '@/components/finance/FinanceTabs.vue';
import FinancePc from "@/components/finance/FinancePc.vue";
import FinanceTabsCass from "@/components/finance/FinanceTabsCass.vue";
import FinanceInvestment from "@/components/finance/FinanceInvestment.vue";
import FinanceCreditReceive from "@/components/finance/FinanceCreditReceive.vue";
import FinanceProviderRefound from "@/components/finance/FinanceProviderRefound.vue";
import FinanceAccountablePersonRefund from "@/components/finance/FinanceAccountablePersonRefund.vue";
import FinanceOtherExpenses from "@/components/finance/FinanceOtherExpenses.vue";
import FinanceOtherIncomes from "@/components/finance/FinanceOtherIncomes.vue";

const userName = {
  name: localStorage.getItem("user_name"),
};
const item = ref([
  {
    name: 'Оплата от клиента',
    code: 0
  },
  {
    name: 'Снятие Р/С',
    code: 1
  },
  {
    name: 'Получение с другой касса',
    code: 2
  },
  {
    name: 'Вложение',
    code: 3
  },
  {
    name: 'Получение кредита',
    code: 4
  },
  {
    name: 'Возврат от поставщика',
    code: 5
  },
  {
    name: 'Возврат от подотчетника',
    code: 6
  },
  {
    name: 'Прочие доходы',
    code: 7
  },
  {
    name: 'Прочие приходы',
    code: 8
  },
]);
const activeTabIndex = ref(0);

const openTab = (index) => {
  activeTabIndex.value = index;
};

const activeTab = computed(() => {
  if (activeTabIndex.value !== null) {
    return item.value[activeTabIndex.value];
  }
  return {
    code:0
  };
});
</script>

<template>
  <div>
    <div class="header flex justify-between items-center">
      <div class="header-title">Создание ПКО</div>
      <div class="flex gap-[16px]">
        <fin-button
            icon="pi pi-times"
            label="Отменить"
            severity="warning"
            class="p-button-lg"
        />
      </div>
    </div>
    <div class="grid grid-cols-12 gap-[46px] mt-[30px]">
      <div class="sidebar-finance col-span-4 border-r">
        <div
            class="font-semibold text-[16px] text-[#808BA0] leading-[16px] p-[13px] cursor-pointer"
            v-for="(items, index) in item"
            :key="index"
            :class="{ 'active-tab': activeTabIndex === index }"
            @click="openTab(index)"
        >
          {{ items.name }}
        </div>
      </div>
      <FinanceTabs v-if="activeTab?.code ===0"/>
      <FinancePc v-if="activeTab?.code ===1"/>
      <FinanceTabsCass v-if="activeTab?.code ===2"/>
      <FinanceInvestment v-if="activeTab?.code ===3"/>
      <FinanceCreditReceive v-if="activeTab?.code ===4"/>
      <FinanceProviderRefound v-if="activeTab?.code ===5"/>
      <finance-accountable-person-refund v-if="activeTab?.code ===6"/>
      <finance-other-expenses v-if="activeTab?.code ===7"/>
      <finance-other-incomes v-if="activeTab?.code ===8"/>

      <div class="text-[20px] font-[600] absolute bottom-[40px]">
        Автор: {{ userName.name }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.active-tab {
  background: #ECF1FB;
  color: #3935E7 !important;
  border-right: 2px solid #3935E7;
  border-bottom-left-radius: 10px;
  border-top-left-radius: 10px;
}
</style>