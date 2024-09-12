<script setup>
import {ref, computed, onMounted} from 'vue';
import FinanceTabs from '@/components/finance/FinanceTabs.vue';
import FinancePc from "@/components/finance/FinancePc.vue";
import FinanceTabsCass from "@/components/finance/FinanceTabsCass.vue";
import FinanceInvestment from "@/components/finance/FinanceInvestment.vue";
import FinanceCreditReceive from "@/components/finance/FinanceCreditReceive.vue";
import FinanceProviderRefound from "@/components/finance/FinanceProviderRefound.vue";
import FinanceAccountablePersonRefund from "@/components/finance/FinanceAccountablePersonRefund.vue";
import FinanceOtherExpenses from "@/components/finance/FinanceOtherExpenses.vue";
import FinanceOtherIncomes from "@/components/finance/FinanceOtherIncomes.vue";
import {useFinanceStore} from "@/store/finance.js";
import {useAxios} from "@/composable/useAxios.js";
import BankTabs from "@/components/bank/BankTabs.vue";
import BankPc from "@/components/bank/BankPc.vue";
import BankTabsCass from "@/components/bank/BankTabsCass.vue";
import BankInvestment from "@/components/bank/BankInvestment.vue";
import BankCreditReceive from "@/components/bank/BankCreditReceive.vue";
import BankProviderRefound from "@/components/bank/BankProviderRefound.vue";
import BankAccountablePersonRefund from "@/components/bank/BankAccountablePersonRefund.vue";
import BankOtherExpenses from "@/components/bank/BankOtherExpenses.vue";
import BankOtherIncomes from "@/components/bank/BankOtherIncomes.vue";

const emit = defineEmits(['open-view', 'close-sidebar']);

const store = useFinanceStore()

const userName = {
  name: localStorage.getItem("user_name"),
};
const item = ref([]);
const activeTabIndex = ref(0);

const openTab = (index) => {
  activeTabIndex.value = index;
};

const activeTab = computed(() => {
  if (activeTabIndex.value !== null) {
    return item.value[activeTabIndex.value];
  }
  return {
    code: 0
  };
});

async function fetchOperating() {
  try {
    const res = await useAxios(
        `/operationTypes?type=PKO`
    );
    return (item.value = res.result.map((el) => {
      return {
        name: el.title_ru,
        code: el.id,
        type: el.type
      };
    }));
  } catch (e) {
    console.log(e);
  }
}

fetchOperating()

function openModal() {
  if (store.isModal) store.openInfoModal = true
  else emit('close-sidebar')
}

function closeFn() {
  emit('close-sidebar')
  store.isModal = false
  store.openInfoModal = false
}

function postMethod(id) {
  emit('open-view', id)
}
</script>

<template>
  <div>
    <div class="header flex justify-between items-center">
      <div class="header-title">Создание Рас.Счет</div>
      <div class="flex gap-[16px]">
        <fin-button
            icon="pi pi-times"
            label="Отменить"
            severity="warning"
            class="p-button-lg"
            @click="openModal"
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
      <BankTabs v-if="activeTab?.code === 1" @close-sidebar="closeFn" @close-dialog="postMethod"
                   :operation-type="activeTab?.code" :type="activeTab.type"/>
      <BankPc v-if="activeTab?.code ===2" @close-sidebar="closeFn" @close-dialog="postMethod"
                 :operation-type="activeTab?.code" :type="activeTab.type"/>
      <BankTabsCass v-if="activeTab?.code ===3" @close-sidebar="closeFn" @close-dialog="postMethod"
                       :operation-type="activeTab?.code" :type="activeTab.type"/>
      <BankInvestment v-if="activeTab?.code ===4" @close-sidebar="closeFn" @close-dialog="postMethod"
                         :operation-type="activeTab?.code" :type="activeTab.type"/>
      <BankCreditReceive v-if="activeTab?.code ===5" @close-sidebar="closeFn" @close-dialog="postMethod"
                            :operation-type="activeTab?.code" :type="activeTab.type"/>
      <BankProviderRefound v-if="activeTab?.code ===6" @close-sidebar="closeFn" @close-dialog="postMethod"
                              :operation-type="activeTab?.code" :type="activeTab.type"/>
      <BankAccountablePersonRefund v-if="activeTab?.code ===7" @close-sidebar="closeFn"
                                         @close-dialog="postMethod" :operation-type="activeTab?.code"
                                         :type="activeTab.type"/>
      <BankOtherExpenses v-if="activeTab?.code ===8" @close-sidebar="closeFn" @close-dialog="postMethod"
                              :operation-type="activeTab?.code" :type="activeTab.type"/>
      <BankOtherIncomes v-if="activeTab?.code ===9" @close-sidebar="closeFn" @close-dialog="postMethod"
                             :operation-type="activeTab?.code" :type="activeTab.type"/>

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