<script setup>
import { onMounted, ref, watch } from "vue";

const props = defineProps({
  profileData: Object
});
const emit = defineEmits(['send-data']);

const getOrganization = ref({});

const getData = () => {
  getOrganization.value = { ...props.profileData };
};

watch(getOrganization, (newVal) => {
  emit("send-data", newVal);
  console.log("send", newVal);
}, { deep: true });

onMounted(() => {
  getData();
});

</script>

<template>
  <div class="card-organization bg-white w-[890px] h-[390px] rounded-2xl">
    <div class="flex pt-8 pl-8 items-center justify-between ">
      <div class="text-[18px] font-semibold"> Карточка организации</div>
    </div>
    <div class="flex gap-4 mt-8">
      <div class="ml-6 border-2 w-[46px] h-[46px] rounded-2xl items-center flex justify-center bg-[#f6f6f6]">
        <img src="@/assets/img/exampleImg.svg" alt="" class="w-[46px]" />
      </div>
      <div class="w-[768px] mr-8">
        <fin-input placeholder="Наименование организации" v-model="getOrganization.name" />
      </div>
    </div>
    <div class="mt-6 ml-6 mr-8">
      <fin-input placeholder="Адрес" v-model="getOrganization.address" />
    </div>
    <div class="flex gap-4 mt-6 justify-around ml-6 mr-8">
      <div>
        <fin-input placeholder="Телефон" v-model="getOrganization.phone" class="w-[407px]" />
      </div>
      <div>
        <fin-input placeholder="Сайт" v-model="getOrganization.website" class="w-[407px]" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
