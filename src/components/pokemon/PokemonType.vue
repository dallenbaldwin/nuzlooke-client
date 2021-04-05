<template>
   <v-chip outlined :color="color" small class="mr-1">
      <v-img
         class="mr-1"
         :lazy-src="Icons.MISC.POKEBALL"
         :src="icon"
         contain
         max-height="16"
         max-width="16"
      ></v-img>
      {{ type }}
   </v-chip>
</template>

<script>
import PokemonTypes from '../../constants/PokemonTypes';

export default {
   name: 'PokemonType',
   props: ['type'],
   computed: {
      color() {
         return Object.values(PokemonTypes).find(t => t.label === this.type).color;
      },
      icon() {
         return Object.values(PokemonTypes).find(t => t.label === this.type).icon;
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
