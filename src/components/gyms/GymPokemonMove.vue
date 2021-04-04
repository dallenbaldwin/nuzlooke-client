<template>
   <v-card
      class="mx-6 mt-3 align-self-stretch"
      outlined
      elevation="1"
      max-width="350"
      min-width="350"
      rounded
   >
      <v-card-title class="d-flex">
         <span class="text-button">{{ label }}</span>
         <v-chip
            class="align-self-start"
            x-small
            outlined
            color="warning"
            v-if="priority"
            >{{ priority }}</v-chip
         >
         <v-spacer></v-spacer>
         <c-pokemon-type :type="type"></c-pokemon-type>
         <c-damage-class :damageClass="damageClass"></c-damage-class>
      </v-card-title>
      <v-card-subtitle>{{ description }}</v-card-subtitle>
      <v-card-text class="d-flex flex-row justify-end">
         <c-meta v-if="power" meta="power" :text="power"></c-meta>
         <c-meta v-if="accuracy" meta="accuracy" :text="`${accuracy}%`"></c-meta>
         <c-meta v-if="pp" meta="pp" :text="pp"></c-meta>
      </v-card-text>
   </v-card>
</template>

<script>
import DamageClass from './DamageClass.vue';
import GymPokemonMoveMeta from './GymPokemonMoveMeta.vue';
import PokemonType from '../pokemon/PokemonType.vue';

export default {
   name: 'GymPokemonMove',
   props: {
      move: { required: true },
   },
   components: {
      'c-pokemon-type': PokemonType,
      'c-damage-class': DamageClass,
      'c-meta': GymPokemonMoveMeta,
   },
   data() {
      return {
         priority: this.move.priority,
         type: this.move.type,
         label: this.move.label,
         damageClass: this.move.damage_class,
         description: this.move.description,
         power: this.move.power,
         accuracy: this.move.accuracy,
         pp: this.move.pp,
      };
   },
};
</script>

<style></style>
