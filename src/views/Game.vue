<template>
   <v-container>
      <c-nav-drawer v-model="drawer" :links="links"></c-nav-drawer>
      <v-row>
         <v-col>
            <c-speed-dial
               :links="links"
               v-if="!mobile"
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
            <v-tabs v-model="tab" fixed-tabs icons-and-text>
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
         links: [
            {
               label: 'Sign Out',
               icon: 'mdi-logout',
               route: 'home',
               dark: true,
               action: 'logout',
            },
            {
               label: 'Games',
               icon: 'mdi-format-list-bulleted',
               route: 'games',
               dark: true,
               action: 'exit-game',
            },
         ],
      };
   },
   computed: {
      drawer() {
         return this.$store.state.drawer;
      },
      mobile() {
         return this.$store.state.mobile;
      },
      game() {
         return this.$store.state.game;
      },
   },
   watch: {
      tab() {
         let route = undefined;
         const routeInfo = this.getRouteInfo();
         if (this.tab === 0) {
            route = 'pokemon';
            this.links.splice(2);
            this.links.push({
               label: 'Filter',
               icon: 'mdi-filter',
               route: null,
               dark: true,
               action: 'filter-pokemon',
               color: 'primary',
            });
         } else if (this.tab === 1) {
            route = 'routes';
            this.links.splice(2);
            this.links.push({
               label: 'Filter',
               icon: 'mdi-filter',
               route: null,
               dark: true,
               action: 'filter-routes',
               color: 'primary',
            });
         } else if (this.tab === 2) {
            route = 'gyms';
            this.links.splice(2);
            this.links.push({
               label: 'Filter',
               icon: 'mdi-filter',
               route: null,
               dark: true,
               action: 'filter-gyms',
               color: 'primary',
            });
         } else if (this.tab === 3) {
            route = 'rules';
            this.links.splice(2);
            this.links.push({
               label: 'Filter',
               icon: 'mdi-filter',
               route: null,
               dark: true,
               action: 'filter-rules',
               color: 'primary',
            });
            this.links.push({
               label: 'Create Rule',
               icon: 'mdi-plus',
               route: null,
               dark: true,
               action: 'create-rule',
               color: 'green',
            });
         }
         this.navigate({ name: route, params: { gameId: routeInfo.params.gameId } });
      },
   },
   methods: {
      exitGame() {
         this.$store.commit('exitGame');
      },
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
   },
};
</script>

<style></style>
