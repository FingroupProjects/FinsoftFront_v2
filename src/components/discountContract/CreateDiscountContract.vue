<script setup>
import DatePicker from "primevue/datepicker";
import FloatLabel from "primevue/floatlabel";
import Select from "primevue/select";
import DataTable from "primevue/datatable";
import Column from "primevue/column";

</script>

<template>
<div>
  <div class="header">
    <div>
      <div class="header-title">Установка скидки на договор</div>
      <div class="header-text text-[#808BA0] font-semibold text-[16px] pt-1">№32154</div>
    </div>
    <div class="flex gap-[16px]">
      <fin-button
          icon="pi pi-save"
          label="Сохранить"
          severity="success"
          class="p-button-lg"
      />
      <fin-button
          icon="pi pi-times"
          label="Отменить"
          severity="warning"
          class="p-button-lg"
      />
    </div>
  </div>

  <div class="mt-8">
    <div class="">
      <fin-input placeholder="Название скидки" />
    </div>
    <div class="flex mt-6 gap-4">
      <FloatLabel class="w-full">
        <DatePicker
            showIcon
            showTime
            hourFormat="24"
            dateFormat="dd.mm.yy,"
            fluid
            hideOnDateTimeSelect
            iconDisplay="input"
            class="w-full"
        />
        <label for="dd-city">Дата начало</label>
      </FloatLabel>
      <FloatLabel class="w-full">
        <DatePicker
            showIcon
            showTime
            hourFormat="24"
            dateFormat="dd.mm.yy,"
            fluid
            hideOnDateTimeSelect
            iconDisplay="input"
            class="w-full"
        />
        <label for="dd-city">Дата окончание</label>
      </FloatLabel>
    </div>
    <div class="flex mt-6 gap-4">
      <Select placeholder="Условия скидки" class="w-full"/>
      <fin-input placeholder="Процент" class="w-full" />
    </div>
    <div class="flex mt-6 gap-4">
      <fin-input placeholder="Описание" class="w-full" />
    </div>
    <div class="flex mt-6 gap-4">
      <Select placeholder="Выберите договор" class="w-[260px]"/>
      <fin-button icon="pi pi-trash" severity="warning" style="width: 46px !important; height: 46px !important;" />
      <fin-button
          icon="pi pi-save"
          label="Сохранить"
          severity="success"
          class="p-button-lg"
      />
    </div>
  </div>
</div>
</template>

<style scoped lang="scss">

</style>