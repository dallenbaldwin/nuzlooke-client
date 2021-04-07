<template>
   <v-expansion-panel>
      <v-expansion-panel-header disable-icon-rotate class="text-h6">
         {{ gym.label }}
         <template v-slot:actions>
            <v-slide-x-transition leave-absolute>
               <v-icon v-if="!isDefeated">{{ Icons.CONTROLS.HELP }}</v-icon>
            </v-slide-x-transition>
            <v-slide-x-transition leave-absolute>
               <c-badge-sprite
                  v-if="isDefeated"
                  :src="gym.badge.sprite_url"
                  :grey="!isDefeated"
               ></c-badge-sprite>
            </v-slide-x-transition>
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
               <div id="location" class="mx-6">
                  <div class="text-subtitle-2">
                     <v-icon left>mdi-map-marker</v-icon>{{ gym.location }}
                  </div>
               </div>
               <div id="type" class="mx-6">
                  <div class="text-subtitle-2">Dominant Type</div>
                  <c-pokemon-type :type="gym.dominant_type"></c-pokemon-type>
               </div>
               <div id="completed" class="mx-6">
                  <div class="text-subtitle-2">{{ gym.badge.label }}</div>
                  <v-switch
                     :disabled="gameFinished"
                     class="mt-0"
                     color="success"
                     inset
                     label="Earned"
                     :value="gym.is_defeated"
                     v-model="isDefeated"
                     @change="setEarnedBadge"
                  ></v-switch>
               </div>
            </v-row>
            <v-row class="mt-6">
               <v-expansion-panels multiple popout disable-icon-rotate>
                  <c-pokecordian
                     v-for="pokemon of pokemons"
                     :key="pokemon.sort_id"
                     :pokemon="pokemon"
                  ></c-pokecordian>
               </v-expansion-panels>
            </v-row>
         </v-container>
      </v-expansion-panel-content>
   </v-expansion-panel>
</template>

<script>
import BadgeSprite from './BadgeSprite.vue';
import PokemonType from '../pokemon/PokemonType.vue';
import Pokecordian from './Pokecordian.vue';
import Button from '../Button.vue';
import * as util from '../../util/util';
import * as gymController from '../../controllers/gym';

export default {
   name: 'Gymcordian',
   props: { gym: { required: true } },
   components: {
      'c-badge-sprite': BadgeSprite,
      'c-pokemon-type': PokemonType,
      'c-pokecordian': Pokecordian,
      'c-btn': Button,
   },
   data() {
      return {
         isDefeated: this.gym.is_defeated,
      };
   },
   computed: {
      gameFinished() {
         return this.$store.state.game.is_finished;
      },
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
   methods: {
      setEarnedBadge() {
         this.gym.is_defeated = Boolean(this.isDefeated);
         gymController.setEarnedBadge(this.gym);
      },
   },
};
</script>

<style></style>
