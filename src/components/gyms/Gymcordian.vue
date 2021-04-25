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
                  aspect-ratio="3/2"
                  max-width="100"
                  :lazy-src="Icons.MISC.NUZLOOKE"
                  position="center left"
               ></v-img>
               <div id="location" class="ma-3">
                  <div class="text-subtitle-2">
                     <v-icon left>mdi-map-marker</v-icon>{{ gym.location }}
                  </div>
               </div>
               <div id="type" class="ma-3">
                  <div class="text-subtitle-2">Dominant Type</div>
                  <c-pokemon-type :type="gym.dominant_type"></c-pokemon-type>
               </div>
               <div id="completed" class="ma-3">
                  <div class="text-subtitle-2">{{ gym.badge.label }}</div>
                  <v-switch
                     :disabled="gameFinished"
                     class="mt-0"
                     color="success"
                     inset
                     label="Earned"
                     v-model="isDefeated"
                     @change="setEarnedBadge"
                  ></v-switch>
               </div>
            </v-row>
            <v-row class="mt-6">
               <v-expansion-panels accordion disable-icon-rotate>
                  <c-pokecordian
                     v-for="pokemon of pokemons"
                     :key="pokemon.sort_id"
                     :pokemon="pokemon"
                  ></c-pokecordian>
               </v-expansion-panels>
            </v-row>
         </v-container>
      </v-expansion-panel-content>
      <v-dialog v-model="errors.hasErrors" width="500" @click:outside="closeError">
         <c-error-card
            :errors="errors.errors"
            :status="errors.status"
            v-on:close-dialog="closeError"
         ></c-error-card>
      </v-dialog>
   </v-expansion-panel>
</template>

<script>
import BadgeSprite from './BadgeSprite.vue';
import PokemonType from '../pokemon/PokemonType.vue';
import Pokecordian from './Pokecordian.vue';
import Button from '../Button.vue';
import ErrorCard from '../dialogs/ErrorCard.vue';
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
      'c-error-card': ErrorCard,
   },
   data() {
      return {
         isDefeated: this.gym.is_defeated,
         errors: {
            hasErrors: false,
            errors: [],
            status: null,
         },
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
         if (!util.isUndefined(this.gym.leader.flavor_text)) t.push(':');
         t.push(this.gym.leader.flavor_text);
         return t.join(' ');
      },
   },
   methods: {
      // this throws an error in the console for some reason... everything works, the switch just doesn't like @change
      async setEarnedBadge() {
         this.gym.is_defeated = Boolean(this.isDefeated);
         const earned = await gymController.setEarnedBadge(this.gym);
         if (earned) {
            this.gym.is_defeated = !this.gym.is_defeated;
            this.isDefeated = !this.isDefeated;
            this.errors.hasErrors = true;
            this.errors.status = earned.status;
            this.errors.errors.push(...earned.error);
         }
      },
      closeError() {
         this.errors.errors = [];
         this.errors.status = null;
         this.errors.hasErrors = false;
      },
   },
   beforeMount() {
      this.isDefeated = this.gym.is_defeated;
   },
};
</script>

<style></style>
