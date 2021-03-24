<template>
   <v-row class="d-flex justify-center align-content flex-row">
      <c-route-card
         v-for="encounter of game.encounters"
         :key="encounter.label"
         :encounter="encounter"
         v-on:new-encounter="newEncounter"
         v-on:edit-encounter="editEncounter"
      ></c-route-card>
      <v-dialog v-model="newEncounterDialog" width="500">
         <c-dialog-card
            :props="newEncounterDialogCard"
            v-on:close-dialog="closeDialog"
            v-on:new-encounter="confirmNewEncounter"
         >
            <v-slide-y-transition>
               <div v-show="edittingEncounter">
                  <c-progress-spinner></c-progress-spinner>
               </div>
            </v-slide-y-transition>
            <v-slide-y-transition>
               <div v-show="!edittingEncounter">
                  <v-radio-group column v-model="encounterData.result.constant">
                     <v-radio
                        v-for="(result, i) of Object.values(EncounterResultConst)"
                        :key="`${result}-${i}`"
                        :label="result"
                        :value="result"
                     ></v-radio>
                  </v-radio-group>
                  <v-combobox
                     v-model="encounterData.result.species"
                     :items="encounterData.pokemons"
                     label="Pokemon"
                     outlined
                     clearable
                     :disabled="
                        encounterData.result.constant === EncounterResultConst.AVAILABLE
                     "
                  >
                  </v-combobox>
                  <v-text-field
                     label="Nickname"
                     v-model="encounterData.result.nickname"
                     outlined
                     clearable
                     :disabled="
                        encounterData.result.constant !== EncounterResultConst.CAUGHT
                     "
                  >
                  </v-text-field>
                  <v-slide-y-transition>
                     <v-card elevation="0" v-show="showPartyManagerOptions">
                        <v-card-title>You have 6 Pokemon in your Party!</v-card-title>
                        <v-card-subtitle
                           >You can only keep up to 6 Pokemon in your Party. Would you
                           like to switch a current party member for
                           {{ encounterData.result.nickname }}?</v-card-subtitle
                        >
                        <v-card-text>
                           <v-radio-group
                              v-model="encounterData.result.destination"
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
                              v-model="encounterData.result.replacement"
                              :disabled="
                                 encounterData.result.destination === PartyState.PC
                              "
                           >
                           </v-combobox>
                        </v-card-text>
                     </v-card>
                  </v-slide-y-transition>
                  <p v-for="error of encounterData.errors" :key="error" class="red--text">
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
            <v-radio-group column v-model="encounterData.result.constant">
               <v-radio
                  v-for="(result, i) of Object.values(EncounterResultConst)"
                  :key="`${result}-${i}`"
                  :label="result"
                  :value="result"
               ></v-radio>
            </v-radio-group>
            <v-combobox
               v-model="encounterData.result.species"
               :items="encounterData.pokemons"
               label="Pokemon"
               outlined
               clearable
               :disabled="
                  encounterData.result.constant === EncounterResultConst.AVAILABLE
               "
            >
            </v-combobox>
            <v-text-field
               label="Nickname"
               v-model="encounterData.result.nickname"
               outlined
               clearable
               :disabled="encounterData.result.constant !== EncounterResultConst.CAUGHT"
            >
            </v-text-field>
         </c-dialog-card>
      </v-dialog>
      <pre>{{ prettySON(game.encounters) }}</pre>
   </v-row>
</template>

<script>
import DialogCard from '../components/DialogCard.vue';
import EncounterResult from '../models/EncounterResult.js';
import EncounterResultConst from '../constants/EncounterResultConst.js';
import RouteCard from '../components/RouteCard.vue';
import Icons from '../constants/Icons';
import RuleCodes from '../constants/RuleCodes.js';
import PartyState from '../constants/PartyState.js';
import * as rulesController from '../controllers/rules.js';
import * as pokemonController from '../controllers/pokemon.js';
import * as routesController from '../controllers/route.js';
import * as pokeapiController from '../controllers/pokeapi.js';
import * as userController from '../controllers/user.js';
import * as util from '../util/util.js';
import * as gameServices from '../services/game.js';
import * as userServices from '../services/user.js';
import ProgressSpinner from '../components/ProgressSpinner.vue';

export default {
   name: 'Routes',
   components: {
      'c-dialog-card': DialogCard,
      'c-route-card': RouteCard,
      'c-progress-spinner': ProgressSpinner,
   },
   data() {
      return {
         // both encounter dialogs
         edittingEncounter: false,
         encounterData: {
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
            errors: [],
         },
         // new encounter
         newEncounterDialog: false,
         newEncounterDialogCard: {
            title: 'New Encounter',
            primaryBtn: { action: 'new-encounter' },
         },
         // edit encounter
         editEncounterDialog: false,
         editEncounterDialogCard: {
            title: 'Edit Encounter',
            primaryBtn: { action: 'edit-encounter' },
         },
         // party manager
         partyManagerDialog: false,
         partyManagerDialogCard: {
            title: 'You have 6 Pokemon in your Party!',
            text: `You can only keep up to 6 Pokemon in your Party. Would you like to switch a current party member for <insert nickname>?`,
            noCancel: true,
            primaryBtn: { action: 'confirm-party-options' },
            // cancelBtn: {
            //    icon: Icons.CONTROLS.STORAGE,
            //    action: 'to-storage',
            //    text: 'Send to Storage',
            // },
         },
         partyManagerData: {
            decision: null,
            pokemon: null,
            errors: null,
         },
      };
   },
   watch: {
      encounterData: {
         handler(newVal, oldVal) {
            if (
               newVal.result.constant === EncounterResultConst.FLED ||
               newVal.result.constant === EncounterResultConst.FAINTED
            ) {
               this.encounterData.result.nickname = null;
            } else if (newVal.result.constant === EncounterResultConst.AVAILABLE) {
               this.encounterData.result.nickname = null;
               this.encounterData.result.species = null;
            }
            if (newVal.result.destination === PartyState.PC) {
               this.encounterData.result.replacement = null;
            }
         },
         deep: true,
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
      showPartyManagerOptions() {
         const partySize = pokemonController.getPartyLength() >= 1; // FIXME: change me back to 6
         const nickname =
            !util.isUndefined(this.encounterData.result.nickname) ||
            !rulesController.isActive(RuleCodes.USE_NICKNAMES.code);
         const caught =
            this.encounterData.result.constant === EncounterResultConst.CAUGHT;
         const species = !util.isUndefined(this.encounterData.result.species);
         return partySize && nickname && caught && species;
      },
   },
   methods: {
      // filterRoutes() {
      //    alert('i want to filter my routes!');
      // },
      test() {},
      editEncounter(payload) {
         this.encounterData.label = payload.label;
         this.editEncounterDialogCard.title = `Edit ${payload.label}?`;
         this.encounterData.pokemons = payload.pokemons.map(p => p.species);
         this.encounterData.result.constant = payload.result.constant;
         this.encounterData.result.species = payload.result.species;
         this.encounterData.result.nickname = payload.result.nickname;
         this.editEncounterDialog = true;
      },
      confirmEditEncounter() {
         if (!confirm(this.prettySON(this.encounterData))) {
            return;
         }
         this.closeDialog();
      },
      newEncounter(payload) {
         this.newEncounterDialogCard.title = payload.label;
         this.encounterData.label = payload.label;
         this.encounterData.pokemons = payload.pokemons.map(p =>
            Object({ value: p.sprite_url, text: p.species })
         );
         this.encounterData.id = payload.id;
         this.encounterData.result.constant = EncounterResultConst.AVAILABLE;
         this.encounterData.result.species = null;
         this.encounterData.result.destination = null;
         this.encounterData.result.replacement = null;
         this.newEncounterDialog = true;
         this.encounterData.errors = [];
      },
      manageParty(payload) {
         this.partyManagerDialog = true;
      },
      async confirmNewEncounter() {
         // FIXME remove this line when it works
         // TODO test this big boy!
         if (!confirm(util.prettySON(this.encounterData))) return;
         // validate for data errors
         this.setEncounterErrors(this.encounterData.result);
         if (this.encounterData.errors.length > 0) return;
         // ignore when they confirm on available
         if (this.encounterData.result.constant === EncounterResultConst.AVAILABLE) {
            this.closeDialog();
            return;
         }
         // start process
         this.edittingEncounter = true;
         const selectedEncounter = routesController.getEncounterById(
            this.encounterData.id
         );
         // set result
         selectedEncounter.result = EncounterResult.builder()
            .withNickname(this.encounterData.result.nickname)
            .withSpecies(this.encounterData.result.species.text)
            .withSpriteUrl(this.encounterData.result.species.id)
            .withConstant(this.encounterData.result.constant)
            .build();
         routesController.updateEncounterById(selectedEncounter);
         // handle capture situations
         if (this.encounterData.result.constant === EncounterResultConst.CAUGHT) {
            // pokeapi and set new user pokemon
            const newPokemon = await pokeapiController.buildUserPokemon(
               this.encounterData.result
            );
            if (this.encounterData.result.destination === PartyState.PARTY) {
               newPokemon.party_state = PartyState.PARTY;
               const replacement = pokemonController.getPokemonById(
                  this.encounterData.result.replacement.value
               );
               replacement.party_state = PartyState.PC;
               pokemonController.updatePokemonById(replacement);
            } else {
               newPokemon.party_state = PartyState.PC;
            }
            pokemonController.pushNewPokemon(newPokemon);
         }
         await gameServices.updateGameById(this.game.id, {
            pokemons: this.game.pokemons,
            encounters: this.game.encounters,
         });
         userController.updateSnapshotPartyUrls(this.game.id);
         await userServices.updateUserById(this.userId, { games: this.userGames });
         this.edittingEncounter = false;
         this.closeDialog();
      },
      closeDialog() {
         this.newEncounterDialog = false;
         this.editEncounterDialog = false;
         this.partyManagerDialog = false;
         this.edittingEncounter = false;
      },
      setEncounterErrors(encounterResults) {
         this.encounterData.errors = [];
         if (encounterResults.constant === EncounterResultConst.CAUGHT) {
            if (
               rulesController.isActive(RuleCodes.USE_NICKNAMES.code) &&
               util.isUndefined(encounterResults.nickname)
            ) {
               this.encounterData.errors.push(
                  'You must give this captured Pokemon a nickname!'
               );
            }
            if (util.isUndefined(encounterResults.species)) {
               this.encounterData.errors.push(`You must select a Pokemon!`);
            }
         } else if (encounterResults.constant === EncounterResultConst.AVAILABLE) {
            if (!util.isUndefined(encounterResults.species)) {
               this.encounterData.errors.push(
                  `Something went wrong. Must be Fainted, Fled, or Caught, to have a Pokemon.`
               );
            }
            if (!util.isUndefined(encounterResults.nickname)) {
               this.encounterData.errors.push(
                  `Something went wrong. Must be Caught to have a nickname.`
               );
            }
         } else if (
            [EncounterResultConst.FAINTED, EncounterResultConst.FLED].includes(
               encounterResults.constant
            )
         ) {
            if (!util.isUndefined(encounterResults.nickname)) {
               this.encounterData.errors.push(
                  `Something went wrong. Must be Caught to have a nickname.`
               );
            }
            if (util.isUndefined(encounterResults.species)) {
               this.encounterData.errors.push(`You must select a Pokemon!`);
            }
         }
      },
   },
};
</script>

<style></style>
