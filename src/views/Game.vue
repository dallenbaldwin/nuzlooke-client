<template>
   <v-container>
      <v-row class="mt-6 pb-6">
         <c-speed-dial
            :actions="actions"
            v-if="!mobile()"
            v-on:logout="logout"
            v-on:exit-game="exitGame"
            v-on:create-rule="createRule"
            v-on:filter="openFilter"
         ></c-speed-dial>
      </v-row>
      <v-row class="mt-6 pt-6">
         <div class="text-h2">
            {{ game.label }}
         </div>
      </v-row>
      <v-row class="mt-6 mb-6">
         <v-tabs v-model="tab" icons-and-text grow color="black">
            <v-tab v-for="tab of tabs" :key="tab.label">
               {{ tab.label }}
               <v-icon dark>{{ tab.icon }}</v-icon>
            </v-tab>
         </v-tabs>
      </v-row>
      <component :is="currentTabComponent" ref="eventBus"></component>
   </v-container>
</template>

<script>
import NavDrawer from '../components/NavDrawer.vue';
import SpeedDial from '../components/SpeedDial.vue';
import DialogCard from '../components/DialogCard.vue';
import TabMap from '../constants/TabMap';
import Icons from '../constants/Icons';
import Pokemon from './Pokemon';
import Routes from './Routes';
import Gyms from './Gyms';
import Rules from './Rules';

export default {
   name: 'Game',
   components: {
      'c-nav-drawer': NavDrawer,
      'c-speed-dial': SpeedDial,
      'c-dialog-card': DialogCard,
   },
   data() {
      return {
         gameFinished: false,
         filter: false,
         tab: null,
         tabs: [
            { label: 'Pokemon', icon: Icons.PAGES.POKEMON },
            { label: 'Routes', icon: Icons.PAGES.ROUTES },
            { label: 'Gyms', icon: Icons.PAGES.GYMS },
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
               label: 'Filter',
               icon: Icons.CONTROLS.FILTER,
               route: null,
               dark: true,
               action: 'filter',
               color: 'primary',
               tab: TabMap.POKEMON,
               disabled: false,
            },
            {
               label: 'Filter',
               icon: Icons.CONTROLS.FILTER,
               route: null,
               dark: true,
               action: 'filter',
               color: 'primary',
               tab: TabMap.ROUTES,
               disabled: false,
            },
            {
               label: 'Filter',
               icon: Icons.CONTROLS.FILTER,
               route: null,
               dark: true,
               action: 'filter',
               color: 'primary',
               tab: TabMap.GYMS,
               disabled: false,
            },
            {
               label: 'Filter',
               icon: Icons.CONTROLS.FILTER,
               route: null,
               dark: true,
               action: 'filter',
               color: 'primary',
               tab: TabMap.RULES,
               disabled: false,
            },
            {
               label: 'Create Rule',
               icon: Icons.CONTROLS.PLUS,
               route: null,
               dark: true,
               action: 'create-rule',
               color: 'green',
               tab: TabMap.RULES,
               disabled: this.game.is_finished,
            },
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
         this.$refs.eventBus.clickCreateRule();
      },
      openFilter() {
         this.$refs.eventBus.openFilter();
      },
   },
   mounted() {
      this.tab = this.$route.params.tab;
   },
};
</script>

<style></style>
