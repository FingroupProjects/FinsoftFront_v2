<script setup>
import Checkbox from 'primevue/checkbox';
import { ref } from "vue";

const checked = ref(false);

</script>

<template>
  <div class="types-notifications bg-white w-[270px] h-[771] rounded-2xl">
    <div class="flex pt-[25px] pl-[25px] text-[18px] font-semibold">
      Типы уведомлений
    </div>
    <div>
      <div class="flex pt-[25px] pl-[25px]">
        <div class="card flex items-center justify-center">
          <Checkbox v-model="checked" :binary="true" />
        </div>
        <div class="ml-2">Ежедневный отчет</div>
      </div><div class="flex pt-[25px] pl-[25px]">
        <div class="card flex items-center justify-center">
          <Checkbox v-model="checked" :binary="true" />
        </div>
        <div class="ml-2">Еженедельный отчет</div>
      </div><div class="flex pt-[25px] pl-[25px]">
        <div class="card flex items-center justify-center">
          <Checkbox v-model="checked" :binary="true" />
        </div>
        <div class="ml-2">Ежемесячный отчет</div>
      </div><div class="flex pt-[25px] pl-[25px]">
        <div class="card flex items-center justify-center">
          <Checkbox v-model="checked" :binary="true" />
        </div>
        <div class="ml-2">Продажа</div>
      </div><div class="flex pt-[25px] pl-[25px]">
        <div class="card flex items-center justify-center">
          <Checkbox v-model="checked" :binary="true" />
        </div>
        <div class="ml-2">Малый остаток</div>
      </div>
    </div>

  </div>
</template>

<style scoped lang="scss">

</style>