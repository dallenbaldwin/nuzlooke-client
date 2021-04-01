<template>
   <v-expansion-panel>
      <v-expansion-panel-header disable-icon-rotate class="text-h6">
         {{ gym.label }}
         <template v-slot:actions>
            <v-icon v-if="!gym.is_defeated">{{ Icons.CONTROLS.HELP }}</v-icon>
            <c-badge-sprite
               v-if="gym.is_defeated"
               :src="gym.badge.sprite_url"
               :grey="!gym.is_defeated"
            ></c-badge-sprite>
         </template>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
         <v-container>
            <v-row class="mb-3">
               <div class="text-button">
                  {{ leaderText }}
               </div>
            </v-row>
            <v-row class="d-flex flex-row justify-content-start">
               <v-img
                  :src="gym.leader.sprite_url"
                  contain
                  max-height="150"
                  max-width="150"
                  :lazy-src="Icons.MISC.NUZLOOKE"
                  position="center left"
               ></v-img>
               <div id="completed" class="mx-6">
                  <!-- <div class="text-body">{{ gym.location }}</div> -->
                  <div class="text-subtitle-2">{{ gym.badge.label }}</div>
                  <v-switch
                     class="mt-0"
                     color="success"
                     inset
                     label="Earned"
                     :value="gym.is_defeated"
                  ></v-switch>
               </div>
               <div id="type" class="mx-6">
                  <div class="text-subtitle-2">Dominant Type</div>
                  <c-pokemon-type :type="gym.dominant_type"></c-pokemon-type>
               </div>
            </v-row>
            <v-row class="mt-6">
               <v-expansion-panels popout disable-icon-rotate>
                  <c-pokecordian
                     v-for="pokemon of pokemons"
                     :key="pokemon.species"
                     :pokemon="pokemon"
                  ></c-pokecordian>
               </v-expansion-panels>
            </v-row>
         </v-container>
      </v-expansion-panel-content>
   </v-expansion-panel>
</template>

<script>
import BadgeSprite from '../BadgeSprite.vue';
import PokemonType from '../PokemonType.vue';
import Pokecordian from './Pokecordian.vue';
import * as util from '../../util/util.js';

export default {
   name: 'Gymcordian',
   props: { gym: { required: true } },
   components: {
      'c-badge-sprite': BadgeSprite,
      'c-pokemon-type': PokemonType,
      'c-pokecordian': Pokecordian,
   },
   computed: {
      pokemons() {
         return this.gym.pokemons;
      },
      leaderText() {
         const t = [this.gym.leader.label];
         if (
            this.gym.leader.label !== '...' &&
            !util.isUndefined(this.gym.leader.flavor_text)
         )
            t.push(':');
         t.push(this.gym.leader.flavor_text);
         return t.join(' ');
      },
   },
};
</script>

<style></style>
