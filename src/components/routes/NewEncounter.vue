<template>
   <c-dialog-card
      :props="dialogCard"
      v-on:close-dialog="closeDialog"
      v-on:new-encounter="newEncounter"
   >
      <v-slide-y-transition>
         <div v-show="processing">
            <c-progress-spinner></c-progress-spinner>
         </div>
      </v-slide-y-transition>
      <v-slide-y-transition>
         <div v-show="!processing">
            <v-radio-group column v-model="result.constant">
               <v-radio
                  v-for="(result, i) of Object.values(EncounterResultConst)"
                  :key="`${result}-${i}`"
                  :label="result"
                  :value="result"
               ></v-radio>
            </v-radio-group>
            <c-combobox
               v-model="result.species"
               :items="pokemons"
               label="Pokemon"
               :disabled="result.constant === EncounterResultConst.AVAILABLE"
            >
            </c-combobox>
            <c-text-field
               v-model="result.nickname"
               label="Nickname"
               :disabled="result.constant !== EncounterResultConst.CAUGHT"
            ></c-text-field>
            <v-slide-y-transition>
               <v-card elevation="0" v-show="showPartyManagerOptions">
                  <v-card-title>You have 6 Pokemon in your Party!</v-card-title>
                  <v-card-subtitle
                     >You can only keep up to 6 Pokemon in your Party. Would you like to
                     switch a current party member for
                     {{ result.nickname }}?</v-card-subtitle
                  >
                  <v-card-text>
                     <v-radio-group v-model="result.destination" row mandatory>
                        <v-radio :value="PartyState.PC" label="Send to Storage"></v-radio>
                        <v-radio
                           :value="PartyState.PARTY"
                           label="Send to Party"
                        ></v-radio>
                     </v-radio-group>
                     <c-combobox
                        label="Party Member"
                        :items="partyPokemons"
                        v-model="result.replacement"
                        :disabled="result.destination === PartyState.PC"
                     >
                     </c-combobox>
                  </v-card-text>
               </v-card>
            </v-slide-y-transition>
         </div>
      </v-slide-y-transition>
      <c-error-messages
         v-if="hasErrors"
         :full-width="true"
         :errors="errors"
      ></c-error-messages>
   </c-dialog-card>
</template>

<script>
import ProgressSpinner from '../ProgressSpinner.vue';
import DialogCard from '../dialogs/DialogCard.vue';
import TextField from '../form-controls/TextField.vue';
import Combobox from '../form-controls/Combobox.vue';
import * as pokemonController from '../../controllers/pokemon';
import EncounterResultConst from '../../constants/EncounterResultConst';
import * as userController from '../../controllers/user';
import * as gameController from '../../controllers/game';
import * as routeController from '../../controllers/route';
import PartyState from '../../constants/PartyState';
import EncounterResult from '../../models/EncounterResult';
import * as pokeapiController from '../../controllers/pokeapi';
import ErrorMessagesVue from '../ErrorMessages.vue';

export default {
   name: 'NewEncounter',
   props: {
      encounter: { required: true },
   },
   components: {
      'c-dialog-card': DialogCard,
      'c-progress-spinner': ProgressSpinner,
      'c-error-messages': ErrorMessagesVue,
      'c-text-field': TextField,
      'c-combobox': Combobox,
   },
   data() {
      return {
         processing: false,
         result: {
            constant: EncounterResultConst.AVAILABLE,
            species: null,
            nickname: null,
            destination: null,
            replacement: null,
         },
         id: this.encounter.id,
         label: this.encounter.label,
         errors: null,
         hasErrors: false,
         dialogCard: {
            title: this.encounter.label,
            primaryBtn: { action: 'new-encounter' },
         },
      };
   },
   watch: {
      result: {
         handler(newVal) {
            if (routeController.isFledFainted(newVal.constant)) {
               this.result.nickname = null;
            } else if (routeController.isAvailable(newVal.constant)) {
               this.result.nickname = null;
               this.result.species = null;
            }
            if (pokemonController.isPC(newVal.destination)) {
               this.result.replacement = null;
            }
         },
         deep: true,
      },
      showPartyManagerOptions(newVal) {
         if (newVal === false) {
            this.result.destination = null;
            this.result.replacement = null;
         }
      },
   },
   methods: {
      closeDialog() {
         this.processing = false;
         this.errors = null;
         this.hasErrors = false;
         this.result.constant = EncounterResultConst.AVAILABLE;
         this.result.species = null;
         this.result.nickname = null;
         this.result.destination = null;
         this.result.replacement = null;
         this.$emit('close-dialog');
      },
      async newEncounter() {
         // validate for data errors
         let errors = routeController.getEncounterErrors(this.result);
         if (errors) {
            this.errors = errors;
            this.hasErrors = true;
            return;
         }
         // ignore when they confirm on available
         if (routeController.isAvailable(this.result.constant)) {
            this.closeDialog();
            return;
         }
         // start process
         this.processing = true;
         // TODO can i put this in the controller? no. this _SHOULD_ go in the controller
         // set result
         this.encounter.result = EncounterResult.builder()
            .withNickname(this.result.nickname)
            .withSpecies(this.result.species.text)
            .withConstant(this.result.constant)
            .build();
         // pokeapi and set new user pokemon
         const newPokemon = await pokeapiController.buildUserPokemon(
            this.result.species.text,
            this.result.nickname,
            undefined
         );
         if (newPokemon.errors) {
            this.processing = false;
            this.errors = newPokemon.errors;
            this.hasErrors = true;
            return;
         }
         this.encounter.result.sprite_url = newPokemon.sprite_url;
         // handle capture situations
         if (routeController.isCaught(this.result.constant)) {
            this.encounter.result.pokemon_id = newPokemon.id;
            if (pokemonController.isParty(this.result.destination)) {
               newPokemon.party_state = PartyState.PARTY;
               const replacement = pokemonController.getPokemonById(
                  this.result.replacement.value
               );
               replacement.party_state = PartyState.PC;
               pokemonController.updatePokemonInStore(replacement);
            } else if (!this.showPartyManagerOptions) {
               newPokemon.party_state = PartyState.PARTY;
            } else {
               newPokemon.party_state = PartyState.PC;
            }
            pokemonController.pushNewPokemon(newPokemon);
         }
         routeController.updateEncounterInStore(this.encounter);
         errors = await gameController.updateEncountersAndPokemonsInDB();
         if (errors) {
            this.processing = false;
            this.hasErrors = true;
            this.errors = errors;
            return;
         }
         userController.updateSnapshotPartyUrls(this.game.id);
         errors = await userController.updateUserGames();
         if (errors) {
            this.processing = false;
            this.hasErrors = true;
            this.errors = errors;
            return;
         }
         this.closeDialog();
      },
   },
   computed: {
      game() {
         return this.$store.state.game;
      },
      pokemons() {
         return this.encounter.pokemons.map(p =>
            Object({ value: p.sprite_url, text: p.species })
         );
      },
      partyIsFull() {
         return pokemonController.getPartyLength() === pokemonController.PARTY_MAX_SIZE;
      },
      showPartyManagerOptions() {
         const caught = routeController.isCaught(this.result.constant);
         return this.partyIsFull && caught;
      },
      partyPokemons() {
         return this.game.pokemons
            .filter(p => p.party_state === PartyState.PARTY)
            .map(p =>
               Object({
                  value: p.id,
                  text: p.species,
                  disabled: false,
               })
            );
      },
   },
};
</script>

<style></style>
