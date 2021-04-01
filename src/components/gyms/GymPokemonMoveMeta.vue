<template>
   <v-chip label outlined :color="GymPokemonMeta[upperMeta].color" small class="mr-1">
      <!-- <v-img
         class="mr-1"
         :lazy-src="Icons.MISC.POKEBALL"
         :src="GymPokemonMeta[upperMeta].icon"
         contain
         max-height="16"
         max-width="16"
      ></v-img> -->
      {{ GymPokemonMeta[upperMeta].label }}: {{ text }}
   </v-chip>
</template>

<script>
export default {
   name: 'GymPokemonMeta',
   props: ['text', 'meta'],
   computed: {
      upperMeta() {
         return this.meta.toUpperCase();
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
