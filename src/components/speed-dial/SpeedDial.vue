<template>
   <div>
      <v-speed-dial top right direction="bottom" transition="scale-transition">
         <template v-slot:activator>
            <v-btn dark fab x-large @click.prevent
               ><v-icon>{{ Icons.CONTROLS.MENU }}</v-icon></v-btn
            >
         </template>
         <c-fab-btn
            v-show="btnSupport[link.btnSupport].includes(currentPage)"
            :color="link.color"
            v-for="(link, i) of links"
            :key="i"
            @click="goTo(link.route)"
            :icon="link.icon"
            :label="link.label"
            :disabled="false"
         ></c-fab-btn>
         <c-fab-btn
            v-show="btnSupport.GAMES.includes(currentPage)"
            :icon="Icons.PAGES.GAMES"
            label="games"
            @click="$emit('exit-game')"
         ></c-fab-btn>
         <c-fab-btn
            v-show="btnSupport.LOGOUT.includes(currentPage)"
            label="sign out"
            :icon="Icons.CONTROLS.LOGOUT"
            @click="logout"
         ></c-fab-btn>
         <c-fab-btn
            v-show="btnSupport.APPSETTINGS.includes(currentPage)"
            label="settings"
            :icon="Icons.CONTROLS.SETTINGS"
            :color="Colors.grey.darken2"
            @click="settings = !settings"
         ></c-fab-btn>
         <c-fab-btn
            v-show="btnSupport.FILTER.includes(currentPage)"
            label="filter"
            :icon="Icons.CONTROLS.FILTER"
            color="primary"
            @click="$emit('filter')"
         ></c-fab-btn>
         <c-fab-btn
            v-show="canAdd(currentPage)"
            :disabled="finished"
            :label="toCreate(currentPage)"
            :icon="Icons.CONTROLS.PLUS"
            color="success"
            @click="$emit('add')"
         ></c-fab-btn>
      </v-speed-dial>
      <c-dialog-wrapper v-model="settings">
         <app-settings v-on:close-dialog="settings = !settings"></app-settings>
      </c-dialog-wrapper>
   </div>
</template>

<script>
import ProgressSpinner from '../ProgressSpinner.vue';
import TextField from '../form-controls/TextField.vue';
import Button from '../Button.vue';
import Icons from '../../constants/Icons';
import Pages from '../../constants/Pages';
import FabBtn from './FabBtn.vue';
import TabMap from '../../constants/TabMap';
import * as authController from '../../controllers/auth';
import * as util from '../../util/util';
import DialogWrapperVue from '../dialogs/DialogWrapper.vue';

export default {
   name: 'SpeedDial',
   props: {
      finished: { required: false, default: false },
      tab: { required: false, default: null },
   },
   components: {
      AppSettings: () => import('../dialogs/AppSettings.vue'),
      'c-progress-spinner': ProgressSpinner,
      'c-text-field': TextField,
      'c-btn': Button,
      'c-fab-btn': FabBtn,
      'c-dialog-wrapper': DialogWrapperVue,
   },
   data() {
      return {
         settings: false,
         btnSupport: {
            FILTER: [Pages.GAMES, Pages.GAME],
            'ADD-PAGES': [Pages.GAMES, Pages.GAME],
            'ADD-TABS': [TabMap.RULES],
            APPSETTINGS: [Pages.GAMES, Pages.GAME],
            LOGOUT: [Pages.GAME, Pages.GAMES],
            HOME: [Pages.LOGIN, Pages.REGISTER, Pages.ABOUT],
            SIGNIN: [Pages.HOME, Pages.REGISTER, Pages.ABOUT],
            ABOUT: [Pages.HOME],
            REGISTER: [Pages.HOME, Pages.LOGIN, Pages.ABOUT],
            GAMES: [Pages.GAME],
         },
         links: [
            {
               label: 'Home',
               icon: Icons.PAGES.HOME,
               route: Pages.HOME,
               btnSupport: 'HOME',
            },
            {
               label: 'Sign In',
               icon: Icons.PAGES.LOGIN,
               route: Pages.LOGIN,
               btnSupport: 'SIGNIN',
            },
            {
               label: 'Register',
               icon: Icons.PAGES.REGISTER,
               route: Pages.REGISTER,
               btnSupport: 'REGISTER',
            },
            {
               label: 'About',
               icon: Icons.PAGES.ABOUT,
               route: Pages.ABOUT,
               btnSupport: 'ABOUT',
            },
         ],
      };
   },
   methods: {
      toCreate(page) {
         // hacky
         if (this.tab) return 'create rule';
         else return `create ${page.replace('s', '')}`;
      },
      goTo(route) {
         util.navigate({ name: route });
      },
      canAdd(page) {
         if (page !== Pages.GAME) return this.btnSupport['ADD-PAGES'].includes(page);
         else if (page === Pages.GAME)
            return this.btnSupport['ADD-TABS'].includes(this.tab);
      },
      logout() {
         authController.logout();
      },
   },
   computed: {
      isLoggedIn() {
         return this.$store.state.isLoggedIn;
      },
      currentPage() {
         return this.$route.name;
      },
   },
};
</script>

<style scoped>
.v-speed-dial {
   position: absolute;
   z-index: 2;
}

.v-btn--floating {
   position: relative;
}
</style>
