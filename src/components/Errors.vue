<template>
   <v-alert text dense type="error">
      {{ error }}
   </v-alert>
</template>

<script>
export default { name: 'Errors', props: ['error'] };
</script>

<style></style>
