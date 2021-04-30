<template>
   <v-card
      class="mx-6 mt-3 align-self-stretch"
      outlined
      elevation="1"
      max-width="350"
      min-width="300"
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
         <c-meta
            v-if="power"
            meta="power"
            outline-color="black"
            label="Power"
            :text="power"
         ></c-meta>
         <c-meta
            v-if="accuracy"
            outline-color="black"
            label="Accuracy"
            :text="`${accuracy}%`"
            meta="accuracy"
         ></c-meta>
         <c-meta v-if="pp" meta="pp" outline-color="black" label="PP" :text="pp"></c-meta>
      </v-card-text>
   </v-card>
</template>

<script>
import DamageClass from './DamageClass.vue';
import GymPokemonMeta from './GymPokemonMeta.vue';
import PokemonType from '../pokemon/PokemonType.vue';

export default {
   name: 'GymPokemonMove',
   props: {
      move: { required: true },
   },
   components: {
      'c-pokemon-type': PokemonType,
      'c-damage-class': DamageClass,
      'c-meta': GymPokemonMeta,
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
