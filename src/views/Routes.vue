<template>
   <v-row class="d-flex justify-center align-content-start flex-row">
      <c-route-card
         v-for="(encounter, i) of game.encounters"
         :key="i"
         :encounter="encounter"
         v-on:new-encounter="clickNewEncounter"
         v-on:reset-encounter="clickResetEncounter"
      ></c-route-card>
      <v-dialog v-model="newEncounterDialog" width="500">
         <c-dialog-card
            :props="newEncounterDialogCard"
            v-on:close-dialog="closeDialog"
            v-on:new-encounter="confirmNewEncounter"
         >
            <v-slide-y-transition>
               <div v-show="processingEncounter">
                  <c-progress-spinner></c-progress-spinner>
               </div>
            </v-slide-y-transition>
            <v-slide-y-transition>
               <div v-show="!processingEncounter">
                  <v-radio-group column v-model="newEncounter.result.constant">
                     <v-radio
                        v-for="(result, i) of Object.values(EncounterResultConst)"
                        :key="`${result}-${i}`"
                        :label="result"
                        :value="result"
                     ></v-radio>
                  </v-radio-group>
                  <v-combobox
                     v-model="newEncounter.result.species"
                     :items="newEncounter.pokemons"
                     label="Pokemon"
                     outlined
                     clearable
                     :disabled="
                        newEncounter.result.constant === EncounterResultConst.AVAILABLE
                     "
                  >
                  </v-combobox>
                  <v-text-field
                     label="Nickname"
                     v-model="newEncounter.result.nickname"
                     outlined
                     clearable
                     :disabled="
                        newEncounter.result.constant !== EncounterResultConst.CAUGHT
                     "
                  >
                  </v-text-field>
                  <v-slide-y-transition>
                     <v-card elevation="0" v-show="showPartyManagerOptions">
                        <v-card-title>You have 6 Pokemon in your Party!</v-card-title>
                        <v-card-subtitle
                           >You can only keep up to 6 Pokemon in your Party. Would you
                           like to switch a current party member for
                           {{ newEncounter.result.nickname }}?</v-card-subtitle
                        >
                        <v-card-text>
                           <v-radio-group
                              v-model="newEncounter.result.destination"
                              row
                              mandatory
                           >
                              <v-radio
                                 :value="PartyState.PC"
                                 label="Send to Storage"
                              ></v-radio>
                              <v-radio
                                 :value="PartyState.PARTY"
                                 label="Send to Party"
                              ></v-radio>
                           </v-radio-group>
                           <v-combobox
                              label="Party Member"
                              outlined
                              clearable
                              :items="partyPokemons"
                              v-model="newEncounter.result.replacement"
                              :disabled="
                                 newEncounter.result.destination === PartyState.PC
                              "
                           >
                           </v-combobox>
                        </v-card-text>
                     </v-card>
                  </v-slide-y-transition>
                  <c-errors
                     v-for="(error, i) of newEncounter.errors"
                     :key="i"
                     :error="error"
                  >
                  </c-errors>
               </div>
            </v-slide-y-transition>
         </c-dialog-card>
      </v-dialog>
      <v-dialog v-model="resetEncounterDialog" width="500">
         <c-dialog-card
            :props="resetEncounterDialogCard"
            v-on:close-dialog="closeDialog"
            v-on:reset-encounter="confirmResetEncounter"
         >
            <v-slide-y-transition>
               <div v-show="processingEncounter">
                  <c-progress-spinner></c-progress-spinner>
               </div>
            </v-slide-y-transition>
         </c-dialog-card>
      </v-dialog>
   </v-row>
</template>

<script>
import ProgressSpinner from '../components/ProgressSpinner';
import RouteCard from '../components/routes/RouteCard';
import DialogCard from '../components/DialogCard';
import Errors from '../components/Errors';
import EncounterResult from '../models/EncounterResult';
import EncounterResultConst from '../constants/EncounterResultConst';
import PartyState from '../constants/PartyState';
import * as pokemonController from '../controllers/pokemon';
import * as routeController from '../controllers/route';
import * as pokeapiController from '../controllers/pokeapi';
import * as userController from '../controllers/user';
import * as gameController from '../controllers/game';
import * as util from '../util/util';

export default {
   name: 'Routes',
   components: {
      'c-dialog-card': DialogCard,
      'c-route-card': RouteCard,
      'c-progress-spinner': ProgressSpinner,
      'c-errors': Errors,
   },
   data() {
      return {
         processingEncounter: false,
         // new encounter
         newEncounter: {
            result: {
               constant: null,
               species: null,
               nickname: null,
               destination: null,
               replacement: null,
            },
            id: null,
            pokemons: null,
            label: null,
            errors: null,
         },
         newEncounterDialog: false,
         newEncounterDialogCard: {
            title: 'New Encounter',
            primaryBtn: { action: 'new-encounter' },
         },
         // reset encounter
         resetEncounterDialog: false,
         resetEncounter: null,
         resetEncounterDialogCard: {
            title: 'Reset Encounter',
            primaryBtn: { action: 'reset-encounter', color: 'orange', text: 'Reset' },
         },
      };
   },
   watch: {
      newEncounter: {
         handler(newVal) {
            if (routeController.isFledFainted(newVal.result.constant)) {
               this.newEncounter.result.nickname = null;
            } else if (routeController.isAvailable(newVal.result.constant)) {
               this.newEncounter.result.nickname = null;
               this.newEncounter.result.species = null;
            }
            if (pokemonController.isPC(newVal.result.destination)) {
               this.newEncounter.result.replacement = null;
            }
         },
         deep: true,
      },
      showPartyManagerOptions(newVal) {
         if (newVal === false) {
            this.newEncounter.result.destination = null;
            this.newEncounter.result.replacement = null;
         }
      },
   },
   computed: {
      game() {
         return this.$store.state.game;
      },
      userId() {
         return this.$store.state.userId;
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
      partyIsFull() {
         return pokemonController.getPartyLength() === pokemonController.PARTY_MAX_SIZE;
      },
      showPartyManagerOptions() {
         const caught = routeController.isCaught(this.newEncounter.result.constant);
         return this.partyIsFull && caught;
      },
   },
   methods: {
      // filterRoutes() {
      //    alert('i want to filter my routes!');
      // },
      clickResetEncounter(payload) {
         this.resetEncounterDialogCard.title = `Reset ${payload.label}?`;
         this.resetEncounterDialogCard.text = `Are you sure you want to reset ${payload.label}? Any associated Pokemon will be removed from your list. This action cannot be undone.`;
         this.resetEncounterDialog = true;
         this.resetEncounter = payload;
      },
      async confirmResetEncounter() {
         this.processingEncounter = true;
         let pokemon = pokemonController.getPokemonById(
            this.resetEncounter.result.pokemon_id
         );
         if (pokemon) pokemonController.removeFromList(pokemon);
         const encounter = routeController.getEncounterById(this.resetEncounter.id);
         encounter.result.pokemon_id = null;
         encounter.result.species = null;
         encounter.result.constant = EncounterResultConst.AVAILABLE;
         encounter.result.sprite_url = null;
         encounter.result.nickname = null;
         routeController.updateEncounterInStore(encounter);
         await gameController.updateEncountersAndPokemonsInDB();
         userController.updateSnapshotPartyUrls(this.game.id);
         await userController.updateUserGames();
         this.closeDialog();
      },
      clickNewEncounter(payload) {
         this.newEncounterDialogCard.title = payload.label;
         this.newEncounter.label = payload.label;
         this.newEncounter.pokemons = payload.pokemons.map(p =>
            Object({ value: p.sprite_url, text: p.species })
         );
         this.newEncounter.id = payload.id;
         this.newEncounter.result.constant = EncounterResultConst.AVAILABLE;
         this.newEncounter.result.species = null;
         this.newEncounter.result.destination = null;
         this.newEncounter.result.replacement = null;
         this.newEncounterDialog = true;
         this.newEncounter.errors = [];
      },
      async confirmNewEncounter() {
         // validate for data errors
         this.newEncounter.errors = routeController.getEncounterErrors(
            this.newEncounter.result
         );
         if (!util.isEmptyArray(this.newEncounter.errors)) return;
         // ignore when they confirm on available
         if (routeController.isAvailable(this.newEncounter.result.constant)) {
            this.closeDialog();
            return;
         }
         // start process
         this.processingEncounter = true;
         const selectedEncounter = routeController.getEncounterById(this.newEncounter.id);
         // set result
         selectedEncounter.result = EncounterResult.builder()
            .withNickname(this.newEncounter.result.nickname)
            .withSpecies(this.newEncounter.result.species.text)
            .withConstant(this.newEncounter.result.constant)
            .build();
         // pokeapi and set new user pokemon
         const newPokemon = await pokeapiController.buildUserPokemon(
            this.newEncounter.result.species.text,
            this.newEncounter.result.nickname,
            undefined
         );
         selectedEncounter.result.sprite_url = newPokemon.sprite_url;
         // handle capture situations
         if (routeController.isCaught(this.newEncounter.result.constant)) {
            selectedEncounter.result.pokemon_id = newPokemon.id;
            if (pokemonController.isParty(this.newEncounter.result.destination)) {
               newPokemon.party_state = PartyState.PARTY;
               const replacement = pokemonController.getPokemonById(
                  this.newEncounter.result.replacement.value
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
         routeController.updateEncounterInStore(selectedEncounter);
         await gameController.updateEncountersAndPokemonsInDB();
         userController.updateSnapshotPartyUrls(this.game.id);
         await userController.updateUserGames();
         this.closeDialog();
      },
      closeDialog() {
         this.newEncounterDialog = false;
         this.resetEncounterDialog = false;
         this.processingEncounter = false;
      },
   },
};
</script>

<style></style>
