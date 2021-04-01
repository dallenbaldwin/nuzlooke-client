<template>
   <v-chip outlined :color="DamageClass[upperClass].color" small class="mr-1">
      <!-- <v-img
         class="mr-1"
         :lazy-src="Icons.MISC.POKEBALL"
         :src="DamageClass[upperClass].icon"
         contain
         max-height="16"
         max-width="16"
      ></v-img> -->
      {{ damageClass }}
   </v-chip>
</template>

<script>
export default {
   name: 'DamageClass',
   props: ['damageClass'],
   computed: {
      upperClass() {
         return this.damageClass.toUpperCase();
      },
   },
   data() {
      return {};
   },
};
</script>

<style>
.v-chip {
   padding: 0 6px;
}
</style>
