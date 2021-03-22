<template>
   <v-progress-circular
      indeterminate
      :size="size"
      color="primary"
   ></v-progress-circular>
</template>

<script>
export default {
   name: 'ProgressSpiner',
   props: ['size']
}
</script>

<style>

</style>