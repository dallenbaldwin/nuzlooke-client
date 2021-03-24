<template>
   <v-row class="d-flex justify-center align-content flex-row">
      <c-route-card
         v-for="encounter of game.encounters"
         :key="encounter.label"
         :encounter="encounter"
         v-on:new-encounter="clickNewEncounter"
         v-on:edit-encounter="clickEditEncounter"
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
                  <p v-for="error of newEncounter.errors" :key="error" class="red--text">
                     <strong>{{ error }}</strong>
                  </p>
               </div>
            </v-slide-y-transition>
         </c-dialog-card>
      </v-dialog>
      <v-dialog v-model="editEncounterDialog" width="500">
         <c-dialog-card
            :props="editEncounterDialogCard"
            v-on:close-dialog="closeDialog"
            v-on:edit-encounter="confirmEditEncounter"
         >
            <v-slide-y-transition>
               <div v-show="processingEncounter">
                  <c-progress-spinner></c-progress-spinner>
               </div>
            </v-slide-y-transition>
            <v-slide-y-transition>
               <div v-if="!processingEncounter">
                  <v-radio-group column v-model="editEncounter.result.constant">
                     <v-radio
                        v-for="(result, i) of Object.values(EncounterResultConst)"
                        :key="`${result}-${i}`"
                        :label="result"
                        :value="result"
                     ></v-radio>
                  </v-radio-group>
                  <v-combobox
                     v-model="editEncounter.result.species"
                     :items="editEncounter.pokemons"
                     label="Pokemon"
                     outlined
                     clearable
                     :disabled="
                        editEncounter.result.constant === EncounterResultConst.AVAILABLE
                     "
                  >
                  </v-combobox>
                  <v-text-field
                     label="Nickname"
                     v-model="editEncounter.result.nickname"
                     outlined
                     clearable
                     :disabled="
                        editEncounter.result.constant !== EncounterResultConst.CAUGHT
                     "
                  >
                  </v-text-field>
               </div>
            </v-slide-y-transition>
         </c-dialog-card>
      </v-dialog>
      <pre>{{ prettySON(game.encounters) }}</pre>
   </v-row>
</template>

<script>
import ProgressSpinner from '../components/ProgressSpinner.vue';
import RouteCard from '../components/RouteCard.vue';
import DialogCard from '../components/DialogCard.vue';
import EncounterResult from '../models/EncounterResult.js';
import EncounterResultConst from '../constants/EncounterResultConst.js';
import RuleCodes from '../constants/RuleCodes.js';
import PartyState from '../constants/PartyState.js';
import * as rulesController from '../controllers/rules.js';
import * as pokemonController from '../controllers/pokemon.js';
import * as routeController from '../controllers/route.js';
import * as pokeapiController from '../controllers/pokeapi.js';
import * as userController from '../controllers/user.js';
import * as encounterController from '../controllers/encounter.js';
import * as gameController from '../controllers/game';
import * as util from '../util/util.js';

export default {
   name: 'Routes',
   components: {
      'c-dialog-card': DialogCard,
      'c-route-card': RouteCard,
      'c-progress-spinner': ProgressSpinner,
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
         // edit encounter
         editEncounter: {
            result: {
               constant: null,
               species: null,
               nickname: null,
            },

            id: null,
            pokemons: null,
            label: null,
            errors: null,
         },
         editEncounterDialog: false,
         editEncounterDialogCard: {
            title: 'Edit Encounter',
            primaryBtn: { action: 'edit-encounter' },
         },
      };
   },
   watch: {
      newEncounter: {
         handler(newVal, oldVal) {
            if (
               newVal.result.constant === EncounterResultConst.FLED ||
               newVal.result.constant === EncounterResultConst.FAINTED
            ) {
               this.newEncounter.result.nickname = null;
            } else if (newVal.result.constant === EncounterResultConst.AVAILABLE) {
               this.newEncounter.result.nickname = null;
               this.newEncounter.result.species = null;
            }
            if (newVal.result.destination === PartyState.PC) {
               this.newEncounter.result.replacement = null;
            }
         },
         deep: true,
      },
      editEncounter: {
         // TODO: add logic to watch the edit encounter (maybe)
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
            .map(p => Object({ value: p.id, text: p.species }));
      },
      showEditWarning() {
         // TODO: add logic to show the edit warning
      },
      showPartyManagerOptions() {
         const partySize = pokemonController.getPartyLength() >= 1; // FIXME: change me back to 6
         const nickname =
            !util.isUndefined(this.newEncounter.result.nickname) ||
            !rulesController.isActive(RuleCodes.USE_NICKNAMES.code);
         const caught = encounterController.isCaught(this.newEncounter.result.constant);
         const species = !util.isUndefined(this.newEncounter.result.species);
         return partySize && nickname && caught && species;
      },
   },
   methods: {
      // filterRoutes() {
      //    alert('i want to filter my routes!');
      // },
      clickEditEncounter(payload) {
         this.editEncounterDialogCard.title = `Edit ${payload.label}?`;
         this.editEncounter.id = payload.id;
         this.editEncounter.label = payload.label;
         this.editEncounter.pokemons = payload.pokemons.map(p => p.species);
         this.editEncounter.result.constant = payload.result.constant;
         this.editEncounter.result.species = payload.result.species;
         this.editEncounter.result.nickname = payload.result.nickname;
         this.editEncounterDialog = true;
      },
      confirmEditEncounter() {
         if (!confirm(this.prettySON(this.editEncounter))) return;

         /* TODO: figure out logic flow for editing an encounter
         
         */
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
         this.newEncounter.errors = encounterController.getEncounterErrors(
            this.newEncounter.result
         );
         if (util.isEmptyArray(this.newEncounter.errors)) return;
         // ignore when they confirm on available
         if (encounterController.isAvailable(this.newEncounter.result.constant)) {
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
            .withSpriteUrl(this.newEncounter.result.species.id)
            .withConstant(this.newEncounter.result.constant)
            .build();
         // TODO: update encounters by ID after adding the pokemonID
         routeController.updateEncounterById(selectedEncounter);
         // handle capture situations
         if (encounterController.isCaught(this.newEncounter.result.constant)) {
            // pokeapi and set new user pokemon
            const newPokemon = await pokeapiController.buildUserPokemon(
               this.newEncounter.result
            );
            if (pokemonController.isParty(this.newEncounter.result.destination)) {
               newPokemon.party_state = PartyState.PARTY;
               const replacement = pokemonController.getPokemonById(
                  this.newEncounter.result.replacement.value
               );
               replacement.party_state = PartyState.PC;
               pokemonController.updatePokemonById(replacement);
            } else {
               newPokemon.party_state = PartyState.PC;
            }
            pokemonController.pushNewPokemon(newPokemon);
         }
         await gameController.updateEncountersAndPokemons();
         userController.updateSnapshotPartyUrls(this.game.id);
         await userController.updateUserGames();
         this.processingEncounter = false;
         this.closeDialog();
      },
      closeDialog() {
         this.newEncounterDialog = false;
         this.editEncounterDialog = false;
         this.processingEncounter = false;
      },
   },
};
</script>

<style></style>
