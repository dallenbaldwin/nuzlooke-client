<template>
   <v-chip outlined :color="PokemonType[upperType].color" small class="mr-1">
      <v-img
         class="mr-1"
         :lazy-src="Icons.MISC.POKEBALL"
         :src="PokemonType[upperType].icon"
         contain
         max-height="16"
         max-width="16"
      ></v-img>
      {{ type }}
   </v-chip>
</template>

<script>
export default {
   name: 'PokemonType',
   props: ['type'],
   computed: {
      upperType() {
         return this.type.toUpperCase();
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
