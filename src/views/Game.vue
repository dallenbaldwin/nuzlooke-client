<template>
   <v-container>
      <v-row class="mt-6 mb-3">
         <c-speed-dial
            :actions="actions"
            v-if="!mobile()"
            v-on:logout="logout"
            v-on:exit-game="exitGame"
            v-on:create-rule="createRuleDialog = true"
         ></c-speed-dial>
         <!-- v-on:filter-pokemon="filterPokemon"
            v-on:filter-routes="filterRoutes"
            v-on:filter-gyms="filterGyms"
            v-on:filter-rules="filterRules" -->
      </v-row>
      <v-row class="mt-3 mb-3">
         <div class="text-h2">
            {{ game.label }}
         </div>
      </v-row>
      <v-row class="mt-3 mb-3">
         <v-tabs v-model="tab" icons-and-text grow color="black">
            <v-tab v-for="tab of tabs" :key="tab.label">
               {{ tab.label }}
               <v-icon dark>{{ tab.icon }}</v-icon>
            </v-tab>
         </v-tabs>
      </v-row>
      <v-row class="d-flex" v-if="tab === TabMap.POKEMON">
         <pre>{{ prettySON(game.pokemons) }}</pre>
      </v-row>
      <v-row class="d-flex justify-space-around flex-column" v-if="tab === TabMap.ROUTES">
         <!-- need more to test this theory -->
         <div class="d-flex justify-space-around flex-row">
            <v-card
               min-width="300"
               max-width="300"
               class="mr-3 ml-3 mt-3 mb-3"
               elevation="1"
               outlined
               v-for="encounter of game.encounters"
               :key="encounter.label"
            >
               <c-available-route
                  v-if="encounter.result.result === EncounterResult.AVAILABLE"
                  :encounter="encounter"
                  v-on:new-encounter="newEncounter"
               />
               <c-result-route
                  v-if="encounter.result.result !== EncounterResult.AVAILABLE"
                  :encounter="encounter"
               />
            </v-card>
         </div>
         <v-dialog v-model="newEncounterDialog" width="500">
            <c-dialog-card
               :props="newEncounterDialogCard"
               v-on:close-dialog="closeDialog"
               v-on:new-encounter="confirmNewEncounter"
            >
               <v-radio-group column v-model="encounterData.result">
                  <v-radio
                     v-for="(result, i) of Object.values(EncounterResult)"
                     :key="`${result}-${i}`"
                     :label="result"
                     :value="result"
                  ></v-radio>
               </v-radio-group>
               <v-combobox
                  v-model="encounterData.pokemon"
                  :items="encounterData.pokemons"
                  label="Pokemon"
                  outlined
                  clearable
                  :disabled="encounterData.result === EncounterResult.AVAILABLE"
               >
               </v-combobox>
               <v-text-field
                  label="Nickname"
                  v-model="encounterData.nickname"
                  outlined
                  clearable
                  :disabled="encounterData.result !== EncounterResult.CAUGHT"
               >
               </v-text-field>
            </c-dialog-card>
         </v-dialog>
         <v-dialog v-model="editEncounterDialog" width="500">
            <c-dialog-card
               :props="editEncounterDialogCard"
               v-on:close-dialog="closeDialog"
               v-on:edit-encounter="editEncounter"
            >
            </c-dialog-card>
         </v-dialog>
         <pre>{{ prettySON(game.encounters) }}</pre>
      </v-row>
      <v-row class="d-flex" v-if="tab === TabMap.GYMS">
         <pre>{{ prettySON(game.gyms) }}</pre>
      </v-row>
      <v-row class="d-flex" v-if="tab === TabMap.RULES">
         <pre>{{ prettySON(game.game_rules) }}</pre>
         <v-dialog v-model="createRuleDialog" width="500">
            <c-dialog-card
               :props="createRuleDialogCard"
               v-on:create-rule="confirmCreateRule"
               v-on:close-dialog="closeDialog"
            >
            </c-dialog-card>
         </v-dialog>
      </v-row>
   </v-container>
</template>

<script>
import NavDrawer from '../components/NavDrawer.vue';
import SpeedDial from '../components/SpeedDial.vue';
import TabMap from '../constants/TabMap.js';
import Icons from '../constants/Icons.js';
import DialogCard from '../components/DialogCard.vue';
import AvailableRoute from '../components/AvailableRoute.vue';
import ResultRoute from '../components/ResultRoute.vue';
import EncounterResult from '../constants/EncounterResult.js';

export default {
   name: 'Game',
   components: {
      'c-nav-drawer': NavDrawer,
      'c-speed-dial': SpeedDial,
      'c-dialog-card': DialogCard,
      'c-available-route': AvailableRoute,
      'c-result-route': ResultRoute,
   },
   data() {
      return {
         tab: null,
         tabs: [
            { label: 'Pokemon', icon: Icons.PAGES.POKEMON },
            { label: 'Routes', icon: Icons.PAGES.ROUTES },
            { label: 'Gyms', icon: Icons.PAGES.GYM },
            { label: 'Rules', icon: Icons.PAGES.RULES },
         ],
         // both encounter dialogs
         encounterData: {
            result: null,
            pokemons: null,
            pokemon: null,
            nickname: null,
            label: null,
         },
         // new encounter
         newEncounterDialog: false,
         newEncounterDialogCard: {
            title: 'New Encounter',
            successBtn: { action: 'new-encounter' },
         },
         // edit encounter
         editEncounterDialog: false,
         editEncounterDialogCard: {
            title: 'Edit Encounter',
            successBtn: { action: 'edit-encounter' },
         },
         // create rule
         createRuleDialog: false,
         creatingRule: false,
         createRuleData: {
            label: null,
            description: null,
         },
         createRuleDialogCard: {
            title: 'Create a Rule',
            successBtn: {
               action: 'create-rule',
            },
         },
      };
   },
   computed: {
      game() {
         return this.$store.state.game;
      },
      actions() {
         const a = [
            {
               label: 'Create Rule',
               icon: Icons.CONTROLS.PLUS,
               route: null,
               dark: true,
               action: 'create-rule',
               color: 'green',
               tab: TabMap.RULES,
            },
            // {
            //    label: 'Filter',
            //    icon: Icons.CONTROLS.FILTER,
            //    route: null,
            //    dark: true,
            //    action: 'filter-pokemon',
            //    color: 'primary',
            //    tab: TabMap.POKEMON,
            // },
            // {
            //    label: 'Filter',
            //    icon: Icons.CONTROLS.FILTER,
            //    route: null,
            //    dark: true,
            //    action: 'filter-routes',
            //    color: 'primary',
            //    tab: TabMap.ROUTES,
            // },
            // {
            //    label: 'Filter',
            //    icon: Icons.CONTROLS.FILTER,
            //    route: null,
            //    dark: true,
            //    action: 'filter-gyms',
            //    color: 'primary',
            //    tab: TabMap.GYMS,
            // },
            // {
            //    label: 'Filter',
            //    icon: Icons.CONTROLS.FILTER,
            //    route: null,
            //    dark: true,
            //    action: 'filter-rules',
            //    color: 'primary',
            //    tab: TabMap.RULES,
            // },
         ];
         return a.filter(e => e.tab === this.tab);
      },
   },
   methods: {
      // filterPokemon() {
      //    alert('i want to filter my pokemon!');
      // },
      // filterRoutes() {
      //    alert('i want to filter my routes!');
      // },
      // filterGyms() {
      //    alert('i want to filter my gyms!');
      // },
      // filterRules() {
      //    alert('i want to filter my rules!');
      // },
      editEncounter() {
         this.editEncounterDialog = true;
      },
      confirmEditEncounter() {
         this.closeDialog();
      },
      newEncounter(payload) {
         this.encounterData.result = EncounterResult.AVAILABLE;
         this.encounterData.pokemons = payload.pokemons.map(p => p.species);
         this.encounterData.pokemon = null;
         this.encounterData.label = payload.label;
         this.newEncounterDialog = true;
      },
      confirmNewEncounter() {
         if (!confirm(this.prettySON(this.encounterData))) {
            return;
         }
         /* 
            if !validate
               display some error text in dialog
               return
            if caught
               new UserPokemon(options)
               if pokemons.party.length < 6
                  UserPokemon.setParty()
               else
                  closeDialog
                  open Party Manager Dialog
                  if send to party
                     choose pokemon to go to storage
                     search pokemons for pokemon by id
                     ThatPokemon.setStorage()
                     update game.pokemons in store
                     UserPokemon.setParty()
                  else 
                     UserPokemon.setStorage()
               start loading spinner
               push UserPokemon to game.pokemons in store
               search game.encounters by label
               update found encounter in store
               update game.pokemons in db with store
               update game.encounters in db with store
               stop spinner
            closeDialog
         */
         this.closeDialog();
      },
      closeDialog() {
         this.createRuleDialog = false;
         this.creatingRule = false;
         this.createRuleData.label = null;
         this.createRuleData.description = null;
         this.encounterData.result = null;
         this.encounterData.pokemon = null;
         this.encounterData.nickname = null;
         this.encounterData.label = null;
         this.newEncounterDialog = false;
         this.editEncounterDialog = false;
      },
      confirmCreateRule() {
         alert(this.prettySON(this.createRuleData));
         this.closeDialog();
      },
      toTab(routeName) {
         return [...Object.values(TabMap)].findIndex(route => route === routeName);
      },
      toRoute(tabIndex) {
         return TabMap[tabIndex];
      },
   },
   mounted() {
      this.tab = this.$route.params.tab;
   },
};
</script>

<style></style>
