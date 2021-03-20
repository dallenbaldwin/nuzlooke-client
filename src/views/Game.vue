<template>
   <v-container>
      <v-row class="mt-6 mb-3">
         <c-speed-dial
            :actions="actions"
            v-if="!mobile()"
            v-on:logout="logout"
            v-on:exit-game="exitGame"
            v-on:filter-pokemon="filterPokemon"
            v-on:filter-routes="filterRoutes"
            v-on:filter-gyms="filterGyms"
            v-on:filter-rules="filterRules"
            v-on:create-rule="createRule"
         ></c-speed-dial>
      </v-row>
      <v-row class="mt-6 mb-3">
         <div class="text-h2">
            {{ game.label }}
         </div>
      </v-row>
      <v-row>
         <v-tabs v-model="tab" icons-and-text grow>
            <v-tab v-for="tab of tabs" :key="tab.label">
               {{ tab.label }}
               <v-icon dark>{{ tab.icon }}</v-icon>
            </v-tab>
         </v-tabs>
      </v-row>
      <v-row v-if="tab === TabMap.POKEMON">
         <pre>{{ JSON.stringify(game.pokemons, null, 2) }}</pre>
      </v-row>
      <v-row v-if="tab === TabMap.ROUTES"
         ><pre>{{ JSON.stringify(game.encounters, null, 2) }}</pre></v-row
      >
      <v-row v-if="tab === TabMap.GYMS"
         ><pre>{{ JSON.stringify(game.gyms, null, 2) }}</pre></v-row
      >
      <v-row v-if="tab === TabMap.RULES"
         ><pre>{{ JSON.stringify(game.game_rules, null, 2) }}</pre></v-row
      >
   </v-container>
</template>

<script>
import NavDrawer from '../components/NavDrawer.vue';
import SpeedDial from '../components/SpeedDial.vue';
import TabMap from '../constants/TabMap.js';
import Pages from '../constants/Pages.js';
import Icons from '../constants/Icons.js';

export default {
   name: 'Game',
   components: {
      'c-nav-drawer': NavDrawer,
      'c-speed-dial': SpeedDial,
   },
   data() {
      return {
         tab: null,
         actions: null,
         tabs: [
            { label: 'Pokemon', icon: Icons.PAGES.POKEMON },
            { label: 'Routes', icon: Icons.PAGES.ROUTES },
            { label: 'Gyms', icon: Icons.PAGES.GYM },
            { label: 'Rules', icon: Icons.PAGES.RULES },
         ],
      };
   },
   computed: {
      game() {
         return this.$store.state.game;
      },
   },
   watch: {
      tab() {
         let route = this.toRoute(this.tab);
         if (route === 'pokemon') {
            this.actions = [
               {
                  label: 'Filter',
                  icon: 'mdi-filter',
                  route: null,
                  dark: true,
                  action: 'filter-pokemon',
                  color: 'primary',
               },
            ];
         } else if (route === 'routes') {
            this.actions = [
               {
                  label: 'Filter',
                  icon: 'mdi-filter',
                  route: null,
                  dark: true,
                  action: 'filter-routes',
                  color: 'primary',
               },
            ];
         } else if (route === 'gyms') {
            this.actions = [
               {
                  label: 'Filter',
                  icon: 'mdi-filter',
                  route: null,
                  dark: true,
                  action: 'filter-gyms',
                  color: 'primary',
               },
            ];
         } else if (route === 'rules') {
            this.actions = [
               {
                  label: 'Filter',
                  icon: 'mdi-filter',
                  route: null,
                  dark: true,
                  action: 'filter-rules',
                  color: 'primary',
               },
               {
                  label: 'Create Rule',
                  icon: 'mdi-plus',
                  route: null,
                  dark: true,
                  action: 'create-rule',
                  color: 'green',
               },
            ];
         }
         // FIXME: this throws a redundant navigation error... but it works so... i'm ok with it for now
         this.navigate({
            name: Pages.GAME,
            params: { gameId: this.game.id, tab: this.tab },
         });
      },
   },
   methods: {
      filterPokemon() {
         alert('i want to filter my pokemon!');
      },
      filterRoutes() {
         alert('i want to filter my routes!');
      },
      filterGyms() {
         alert('i want to filter my gyms!');
      },
      filterRules() {
         alert('i want to filter my rules!');
      },
      createRule() {
         alert('i want to create a rule!');
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
