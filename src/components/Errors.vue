<template>
   <v-alert :max-width="maxWidth" text dense type="error" class="text-wrap">
      {{ error }}
   </v-alert>
</template>

<script>
// TODO make this array compatible
export default {
   name: 'Errors',
   props: {
      error: { required: true },
      'max-width': { required: false, default: 900 },
   },
};
</script>

<style></style>
