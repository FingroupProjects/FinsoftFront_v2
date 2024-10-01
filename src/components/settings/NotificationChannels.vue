<script setup>
import Checkbox from 'primevue/checkbox';
import { ref } from "vue";

const checked = ref(false);

</script>

<template>
  <div class="types-notifications bg-white w-[270px] h-[771] rounded-2xl">
    <div class="flex pt-[25px] pl-[25px] text-[18px] font-semibold">
      Каналы уведомлений
    </div>
    <div>
        <div class="flex pt-[25px] pl-[25px]">
          <div class="card flex items-center justify-center">
            <Checkbox v-model="checked" :binary="true" />
          </div>
          <div class="ml-2">Email</div>
        </div>
        <div class="flex pt-[25px] pl-[25px]">
          <div class="card flex items-center justify-center">
            <Checkbox v-model="checked" :binary="true" />
          </div>
          <div class="ml-2">CMC</div>
      </div>
        <div class="flex pt-[25px] pl-[25px]">
          <div class="card flex items-center justify-center">
            <Checkbox v-model="checked" :binary="true" />
          </div>
          <div class="ml-2">Telegram</div>
      </div>
    </div>

  </div>
</template>

<style scoped lang="scss">

</style>