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
      <v-row
         class="d-flex justify-center align-content flex-row"
         v-if="tab === TabMap.ROUTES"
      >
         <c-route-card
            v-for="encounter of game.encounters"
            :key="encounter.label"
            :encounter="encounter"
            v-on:new-encounter="newEncounter"
            v-on:edit-encounter="editEncounter"
         ></c-route-card>
         <c-route-card
            v-for="encounter of game.encounters"
            :key="encounter.label"
            :encounter="encounter"
            v-on:new-encounter="newEncounter"
            v-on:edit-encounter="editEncounter"
         ></c-route-card>
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
               v-on:edit-encounter="confirmEditEncounter"
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
import EncounterResult from '../constants/EncounterResult.js';
import RouteCard from '../components/RouteCard.vue';

export default {
   name: 'Game',
   components: {
      'c-nav-drawer': NavDrawer,
      'c-speed-dial': SpeedDial,
      'c-dialog-card': DialogCard,
      'c-route-card': RouteCard,
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
            result: {
               constant: null,
               species: null,
               nickname: null,
            },
            pokemons: null,
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
      editEncounter(payload) {
         this.editEncounterDialog = true;
         this.encounterData.result = payload.result.result;
         this.encounterData.pokemons = payload.pokemons.map(p => p.species);
         this.encounterData.pokemon = payload.result.species;
         this.encounterData.nickname = payload.result.nickname;
      },
      confirmEditEncounter() {
         this.closeDialog();
      },
      newEncounter(payload) {
         this.encounterData.constant = EncounterResult.AVAILABLE;
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
