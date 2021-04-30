<template>
   <v-lazy
      v-model="isActive"
      :options="{
         threshold: 0.5,
      }"
      transition="fade-transition"
   >
      <v-card min-width="300" max-width="300" elevation="1" outlined class="ma-1">
         <div v-if="isAvailable">
            <v-card-title>{{ encounter.label }}</v-card-title>
            <v-card-subtitle>Available Pokemon</v-card-subtitle>
            <v-card-text v-if="isAvailable" class="d-inline-flex justify-end flex-wrap">
               <c-poke-sprite
                  class="mx-1 mt-1"
                  v-for="(pokemon, i) of encounter.pokemons"
                  :key="i"
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
               @click="newEncounter = !newEncounter"
               :disabled="game.is_finished"
            >
               Encounter
            </c-btn>
            <c-btn
               v-if="!isAvailable"
               @click="resetEncounter = !resetEncounter"
               color="orange"
               :icon="Icons.CONTROLS.EXCLAIM"
               :disabled="game.is_finished"
            >
               Reset
            </c-btn>
         </v-card-actions>
         <c-dialog-wrapper v-model="newEncounter">
            <c-new-encounter
               :encounter="encounter"
               v-on:close-dialog="newEncounter = !newEncounter"
            ></c-new-encounter>
         </c-dialog-wrapper>
         <c-dialog-wrapper v-model="resetEncounter">
            <c-reset-encounter
               :encounter="encounter"
               v-on:close-dialog="resetEncounter = !resetEncounter"
            ></c-reset-encounter>
         </c-dialog-wrapper>
      </v-card>
   </v-lazy>
</template>

<script>
import PokeSprite from '../pokemon/PokeSprite.vue';
import Button from '../Button.vue';
import DialogCard from '../../components/dialogs/DialogCard.vue';
import ResetEncounter from './ResetEncounter.vue';
import NewEncounter from './NewEncounter.vue';
import EncounterResultConst from '../../constants/EncounterResultConst';
import DialogWrapperVue from '../dialogs/DialogWrapper.vue';

export default {
   name: 'RouteCard',
   props: {
      encounter: { required: true },
   },
   components: {
      'c-poke-sprite': PokeSprite,
      'c-btn': Button,
      'c-dialog-card': DialogCard,
      'c-reset-encounter': ResetEncounter,
      'c-new-encounter': NewEncounter,
      'c-dialog-wrapper': DialogWrapperVue,
   },
   data() {
      return {
         isActive: false,
         newEncounter: false,
         resetEncounter: false,
      };
   },
   watch: {},
   methods: {},
   computed: {
      game() {
         return this.$store.state.game;
      },
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
