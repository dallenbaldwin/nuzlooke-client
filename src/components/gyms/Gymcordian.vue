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
               <c-resource-image
                  :alt-text="gym.leader.label"
                  :image="gym.leader.sprite_url"
                  max-width="100"
               ></c-resource-image>
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
      <c-dialog-wrapper v-model="hasErrors" v-on:close-dialog="closeDialog">
         <c-error-card :errors="errors" v-on:close-dialog="closeDialog"></c-error-card>
      </c-dialog-wrapper>
   </v-expansion-panel>
</template>

<script>
import BadgeSprite from './BadgeSprite.vue';
import PokemonType from '../pokemon/PokemonType.vue';
import Pokecordian from './Pokecordian.vue';
import Button from '../Button.vue';
import * as util from '../../util/util';
import { setEarnedBadge } from '../../controllers/gym';
import DialogCardVue from '../dialogs/DialogCard.vue';
import ErrorCardVue from '../dialogs/ErrorCard.vue';
import DialogWrapperVue from '../dialogs/DialogWrapper.vue';
import ResourceImageVue from '../ResourceImage.vue';

export default {
   name: 'Gymcordian',
   props: { gym: { required: true } },
   components: {
      'c-badge-sprite': BadgeSprite,
      'c-pokemon-type': PokemonType,
      'c-pokecordian': Pokecordian,
      'c-btn': Button,
      'c-error-card': ErrorCardVue,
      'c-dialog-card': DialogCardVue,
      'c-dialog-wrapper': DialogWrapperVue,
      'c-resource-image': ResourceImageVue,
   },
   data() {
      return {
         isDefeated: this.gym.is_defeated,
         hasErrors: false,
         errors: null,
         errorCard: {
            title: `Error`,
            cancelBtn: {
               text: 'close',
            },
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
         let errors = await setEarnedBadge(this.gym);
         if (errors) {
            this.gym.is_defeated = !this.gym.is_defeated;
            this.isDefeated = !this.isDefeated;
            this.errors = errors;
            this.hasErrors = true;
         }
      },
      closeDialog() {
         this.errors = null;
         this.hasErrors = false;
      },
   },
   beforeMount() {
      this.isDefeated = this.gym.is_defeated;
   },
};
</script>

<style></style>
