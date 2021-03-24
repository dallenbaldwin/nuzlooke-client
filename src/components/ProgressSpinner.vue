<template>
   <div class="text-center mt-3 mb-3">
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
