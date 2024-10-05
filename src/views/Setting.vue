<script setup>
import SystemSettings from "@/components/settings/SystemSettings.vue";
import TypesNotifications from "@/components/settings/TypesNotifications.vue";
import NotificationChannels from "@/components/settings/NotificationChannels.vue";

</script>

<template>
  <div class="flex gap-6">
      <system-settings />
      <types-notifications />
      <NotificationChannels />
  </div>
</template>

<style scoped lang="scss">

</style>