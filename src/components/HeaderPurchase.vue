<script setup>
const props = defineProps({
  headerTitle:''
})
</script>

<template>
  <div class="relative z-20 bottom-[40px]">
    <div class="header-text font-semibold text-[20px] leading-[20px] text-[#141C30]">
      {{props.headerTitle}}
    </div>
    <div class="grid grid-cols-5 gap-[20px]">
      <div class="card-header mt-4 mb-4 col-span-1">
        <div class="flex justify-between">
          <div class="font-semibold text-[13px] text-[#120F1F]">
            <i class="pi pi-arrow-down text-[#EE2828] text-[10px]"></i> -5.6%
          </div>
          <div class="font-semibold text-[13px] text-[#120F1F]">
            Новые
          </div>
        </div>
        <div class="text-[32px] font-medium leading-[32px] text-[#141C30]">
          180
        </div>
      </div>
      <div class="card-header mt-4 mb-4 col-span-1">
        <div class="flex justify-between">
          <div class="font-semibold text-[13px] text-[#120F1F]">
            <i class="pi pi-arrow-up text-[#07BC51] text-[10px]"></i> +2.6%
          </div>
          <div class="font-semibold text-[13px] text-[#120F1F]">
            В пути
          </div>
        </div>
        <div class="text-[32px] font-medium leading-[32px] text-[#141C30]">
          89
        </div>
      </div>
      <div class="card-header mt-4 mb-4 col-span-1">
        <div class="flex justify-between">
          <div class="font-semibold text-[13px] text-[#120F1F]">
            <i class="pi pi-arrow-up text-[#07BC51] text-[10px]"></i> 1.6%
          </div>
          <div class="font-semibold text-[13px] text-[#120F1F]">
            С рассрочкой
          </div>
        </div>
        <div class="text-[32px] font-medium leading-[32px] text-[#141C30]">
          65%
        </div>
      </div>
      <div class="card-header mt-4 mb-4 col-span-1">
        <div class="flex justify-between">
          <div class="font-semibold text-[13px] text-[#120F1F]">
            <i class="pi pi-arrow-up text-[#07BC51] text-[10px]"></i>1.6%
          </div>
          <div class="font-semibold text-[13px] text-[#120F1F]">
            Проведенные
          </div>
        </div>
        <div class="text-[32px] font-medium leading-[32px] text-[#141C30]">
          192
        </div>
      </div>
      <div class="card-header mt-4 mb-4 col-span-1">
        <div class="flex justify-between">
          <div class="font-semibold text-[13px] text-[#120F1F]">
            <i class="pi pi-arrow-up text-[#07BC51] text-[10px]"></i> 1.6%
          </div>
          <div class="font-semibold text-[13px] text-[#120F1F]">
            Отказ
          </div>
        </div>
        <div class="text-[32px] font-medium leading-[32px] text-[#141C30]">
          20
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped lang="scss">
.card-header{
  //width: 258px;
  height: 86px;
  border-radius: 10px;
  padding: 16px;
  background: white;
}
</style>