<template>
   <v-fade-transition>
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
                  :src="pokemon.icon_url"
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
            <c-btn
               v-if="isAvailable"
               color="green"
               :icon="Icons.CONTROLS.EXCLAIM"
               :click="emitNewEncounter"
            >
               Encounter
            </c-btn>
            <c-btn
               v-if="!isAvailable"
               :click="emitResetEncounter"
               color="orange"
               :icon="Icons.CONTROLS.EXCLAIM"
            >
               Reset
            </c-btn>
         </v-card-actions>
      </v-card>
   </v-fade-transition>
</template>

<script>
import EncounterResultConst from '../constants/EncounterResultConst.js';
import PokeSprite from '../components/PokeSprite.vue';
import Button from '../components/Button.vue';

export default {
   name: 'RouteCard',
   props: ['encounter'],
   components: {
      'c-poke-sprite': PokeSprite,
      'c-btn': Button,
   },
   data() {
      return {};
   },
   methods: {
      // TODO can i avoid emitting?
      emitNewEncounter() {
         this.$emit('new-encounter', this.encounter);
      },
      emitResetEncounter() {
         this.$emit('reset-encounter', this.encounter);
      },
   },
   computed: {
      isAvailable() {
         return this.encounter.result.constant === EncounterResultConst.AVAILABLE;
      },
      outLineColor() {
         if (this.encounter.result.constant === EncounterResultConst.CAUGHT)
            return 'green';
         if (this.encounter.result.constant === EncounterResultConst.FAINTED)
            return 'red';
         if (this.encounter.result.constant === EncounterResultConst.FLED)
            return 'orange';
      },
   },
};
</script>

<style></style>
