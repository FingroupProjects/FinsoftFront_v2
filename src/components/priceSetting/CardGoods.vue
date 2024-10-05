<script setup>

</script>

<template>
  <div class="rounded-[10px] bg-[#fff] px-4 py-3 h-[80vh] w-[17%]">
    <div class="header flex gap-[13px]">
      <img class="w-[32px] h-[32px] rounded-[10px] border-2 object-cover"
           src="https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_3x4.jpg"
           alt="">
      <div class="text-[600] text-[16px] leading-[16px] text-[#000]">
        Пяторочка
        <div class="text-container">
          ул. Гагарина, 87, Узловая
        </div>
      </div>
      <button class="text-[14px] relative bottom-[10px]">
        <img src="@/assets/img/trashIcon.svg" class="w-[16px] h-[16px]" alt="">
      </button>
    </div>
    <div class="content mt-[14px]">
      <div class="text-[15px] font-medium leading-[15px] text-[#141C30]">
        74,404
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.header{
  border-bottom: 1px solid #DCDFE3;
  padding-bottom: 11px;
}
.text-container {
  font-size: 13px;
  line-height: 13px;
  color: #808BA0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 200px;
}
</style>