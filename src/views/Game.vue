<template>
   <v-container>
      <v-row class="mt-6">
         <c-speed-dial
            :actions="actions"
            v-if="!mobile()"
            v-on:logout="logout"
            v-on:exit-game="exitGame"
            v-on:create-rule="createRule"
         ></c-speed-dial>
         <!-- v-on:filter-pokemon="filterPokemon"
            v-on:filter-routes="filterRoutes"
            v-on:filter-gyms="filterGyms"
            v-on:filter-rules="filterRules" -->
      </v-row>
      <v-row class="mt-6">
         <div class="text-h2">
            {{ game.label }}
         </div>
      </v-row>
      <v-row class="mt-6">
         <v-tabs v-model="tab" icons-and-text grow color="black">
            <v-tab v-for="tab of tabs" :key="tab.label">
               {{ tab.label }}
               <v-icon dark>{{ tab.icon }}</v-icon>
            </v-tab>
         </v-tabs>
      </v-row>
      <component class="mt-6" :is="currentTabComponent" ref="createRule"></component>
   </v-container>
</template>

<script>
import NavDrawer from '../components/NavDrawer.vue';
import SpeedDial from '../components/SpeedDial.vue';
import TabMap from '../constants/TabMap.js';
import Icons from '../constants/Icons.js';
import Pokemon from './Pokemon.vue';
import Routes from './Routes.vue';
import Gyms from './Gyms.vue';
import Rules from './Rules.vue';

export default {
   name: 'Game',
   components: {
      'c-nav-drawer': NavDrawer,
      'c-speed-dial': SpeedDial,
   },
   data() {
      return {
         eventBus: null,
         tab: null,
         tabs: [
            { label: 'Pokemon', icon: Icons.PAGES.POKEMON },
            { label: 'Routes', icon: Icons.PAGES.ROUTES },
            { label: 'Gyms', icon: Icons.PAGES.GYM },
            { label: 'Rules', icon: Icons.PAGES.RULES },
         ],
      };
   },
   computed: {
      currentTabComponent() {
         if (this.tab === TabMap.POKEMON) return Pokemon;
         if (this.tab === TabMap.ROUTES) return Routes;
         if (this.tab === TabMap.GYMS) return Gyms;
         if (this.tab === TabMap.RULES) return Rules;
      },
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
      toTab(routeName) {
         return [...Object.values(TabMap)].findIndex(route => route === routeName);
      },
      toRoute(tabIndex) {
         return TabMap[tabIndex];
      },
      createRule() {
         this.$refs.createRule.createRule();
      },
   },
   mounted() {
      this.tab = this.$route.params.tab;
   },
};
</script>

<style></style>
