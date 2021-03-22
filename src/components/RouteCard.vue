<template>
   <v-card
      min-width="300"
      max-width="300"
      elevation="1"
      outlined
      class="align-self-start mt-3 mx-3"
   >
      <div v-if="isAvailable">
         <v-card-title>{{ encounter.label }}</v-card-title>
         <v-card-subtitle>Available Pokemon</v-card-subtitle>
         <v-card-text v-if="isAvailable" class="d-inline-flex justify-end">
            <c-poke-sprite
               class="mx-1"
               v-for="pokemon of encounter.pokemons"
               :key="pokemon.species"
               :src="pokemon.sprite_url || debugSprite"
               size="small"
            ></c-poke-sprite>
         </v-card-text>
      </div>
      <div v-if="!isAvailable" class="d-inline-flex justify-start">
         <c-poke-sprite
            class="align-self-start mx-3 mt-3"
            :src="encounter.result.sprite_url"
            :outline-color="outLineColor"
         ></c-poke-sprite>
         <span>
            <v-card-title>{{ encounter.label }}</v-card-title>
            <v-card-subtitle
               >{{ encounter.result.constant
               }}{{
                  encounter.result.nickname ? `: ${encounter.result.nickname}` : ''
               }}</v-card-subtitle
            >
         </span>
      </div>
      <v-card-actions class="pt-0 pb-0 mb-2">
         <v-spacer></v-spacer>
         <v-btn text @click="emitNewEncounter" v-if="isAvailable">
            <v-icon color="green" dark>{{ Icons.CONTROLS.EXCLAIM }}</v-icon>
            New Encounter
         </v-btn>
         <v-btn text @click="emitEditEncounter" v-if="!isAvailable">
            <v-icon color="orange" dark>{{ Icons.CONTROLS.EDIT }}</v-icon>
            Edit Encounter
         </v-btn>
      </v-card-actions>
   </v-card>
</template>

<script>
import EncounterResult from '../constants/EncounterResult.js';
import PokeSprite from '../components/PokeSprite.vue';

export default {
   name: 'RouteCard',
   props: ['encounter'],
   components: {
      'c-poke-sprite': PokeSprite,
   },
   data() {
      return {
         debugSprite:
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vii/icons/25.png',
      };
   },
   methods: {
      emitNewEncounter() {
         this.$emit('new-encounter', this.encounter);
      },
      emitEditEncounter() {
         this.$emit('edit-encounter', this.encounter);
      },
   },

   computed: {
      isAvailable() {
         return this.encounter.result.constant === EncounterResult.AVAILABLE;
      },
      outLineColor() {
         if (this.encounter.result.constant === EncounterResult.CAUGHT) return 'green';
         if (this.encounter.result.constant === EncounterResult.FAINTED) return 'red';
         if (this.encounter.result.constant === EncounterResult.FLED) return 'orange';
      },
   },
};
</script>

<style></style>
