<template>
   <div class="text-center ma-3">
      <div class="text-button ma-1">
         Processing request...
      </div>
      <v-progress-circular
         indeterminate
         :size="size"
         color="primary"
      ></v-progress-circular>
   </div>
</template>

<script>
export default {
   name: 'ProgressSpiner',
   props: {
      size: {
         type: String,
         default: '100',
      },
   },
};
</script>

<style></style>
