<template>
   <v-expansion-panel>
      <v-expansion-panel-header class="text-h6">
         <div>
            {{ species }}
            <span class="ml-1 text-subtitle-2">Lv</span>
            <span>{{ level }}</span>
         </div>
         <template v-slot:actions>
            <c-poke-sprite :src="iconUrl" size="small"></c-poke-sprite>
         </template>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
         <v-container>
            <v-row class="d-flex flex-column justify-center align-center">
               <c-poke-sprite :src="spriteUrl" size="large"></c-poke-sprite>
               <div class="ma-3">
                  <c-pokemon-type
                     v-for="(type, i) of types"
                     :key="i"
                     :type="type"
                  ></c-pokemon-type>
               </div>
            </v-row>
            <v-row class="d-flex flex-row justify-space-around align-center">
               <c-gym-pokemon-move
                  v-for="move of moves"
                  :key="move.label"
                  :move="move"
               ></c-gym-pokemon-move>
            </v-row>
         </v-container>
      </v-expansion-panel-content>
   </v-expansion-panel>
</template>

<script>
import PokemonType from '../PokemonType.vue';
import PokeSprite from '../PokeSprite.vue';
import GymPokemonMove from './GymPokemonMove.vue';

export default {
   name: 'Pokecordian',
   props: { pokemon: { required: true } },
   components: {
      'c-poke-sprite': PokeSprite,
      'c-pokemon-type': PokemonType,
      'c-gym-pokemon-move': GymPokemonMove,
   },
   data() {
      return {
         species: this.pokemon.species,
         level: this.pokemon.level,
         iconUrl: this.pokemon.icon_url,
         spriteUrl: this.pokemon.sprite_url,
         types: this.pokemon.types,
         moves: this.pokemon.moves,
      };
   },
   computed: {},
};
</script>

<style></style>
