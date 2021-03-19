<template>
   <v-container>
      <v-row>
         <v-col>
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
            ></c-speed-dial
         ></v-col>
      </v-row>
      <v-row
         ><v-col>
            <div class="mt-6 text-h2">
               {{ game.name }}
            </div>
         </v-col>
      </v-row>
      <v-row>
         <v-col>
            <router-view></router-view>
            <v-tabs v-model="tab" icons-and-text grow>
               <v-tab>
                  Pokemon
                  <v-icon dark>mdi-pokeball</v-icon>
               </v-tab>
               <v-tab>
                  Routes
                  <v-icon dark>mdi-routes</v-icon>
               </v-tab>
               <v-tab>
                  Gyms
                  <v-icon dark>mdi-domain</v-icon>
               </v-tab>
               <v-tab>
                  Rules
                  <v-icon dark>mdi-book</v-icon>
               </v-tab>
            </v-tabs>
         </v-col>
      </v-row>
      <v-row><v-col> content</v-col></v-row>
   </v-container>
</template>

<script>
import NavDrawer from '../components/NavDrawer.vue';
import SpeedDial from '../components/SpeedDial.vue';

export default {
   name: 'Game',
   components: {
      'c-nav-drawer': NavDrawer,
      'c-speed-dial': SpeedDial,
   },
   data() {
      return {
         tab: null,
         tabMap: {
            0: 'pokemon',
            1: 'routes',
            2: 'gyms',
            3: 'rules',
         },
         actions: null,
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
            name: 'game',
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
         return [...Object.values(this.tabMap)].findIndex(route => route === routeName);
      },
      toRoute(tabIndex) {
         return this.tabMap[tabIndex];
      },
   },
   mounted() {
      this.tab = this.$route.params.tab;
   },
};
</script>

<style></style>
