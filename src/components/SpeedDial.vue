<template>
   <div>
      <v-speed-dial
         open-on-hover
         top
         right
         direction="left"
         transition="scale-transition"
      >
         <template v-slot:activator>
            <v-btn dark fab x-large @click.prevent.stop
               ><v-icon>{{ Icons.CONTROLS.MENU }}</v-icon></v-btn
            >
         </template>
         <v-btn
            :color="link.color"
            fab
            v-for="link of pageLinks"
            :key="link.label"
            dark
            @click="linkActions(link)"
            class="mx-6"
         >
            <v-icon>{{ link.icon }}</v-icon>
            <div class="c-fab-bottom-text">{{ link.label }}</div>
         </v-btn>
         <v-btn
            fab
            v-for="action of actions"
            :key="action.label"
            dark
            @click="linkActions(action)"
            class="mx-6"
            :color="action.color"
         >
            <v-icon>{{ action.icon }}</v-icon>
            <div class="c-fab-bottom-text">{{ action.label }}</div>
         </v-btn>
      </v-speed-dial>
      <v-dialog v-model="settingsDialog.flag" width="500">
         <c-dialog-card
            :props="settingsDialog.dialogCard"
            v-on:close-dialog="closeDialog"
            v-on:save-settings="saveSettings"
         >
            <v-fade-transition>
               <c-progress-spinner
                  v-show="settingsDialog.processing"
               ></c-progress-spinner>
            </v-fade-transition>
            <v-fade-transition>
               <div v-show="!settingsDialog.processing">
                  <v-text-field
                     clearable
                     outlined
                     label="Username"
                     v-model="settingsDialog.options.username"
                  >
                  </v-text-field>
                  <c-error
                     v-for="(error, i) of settingsDialog.errors.errors"
                     :key="i"
                     :error="error"
                  ></c-error>
               </div>
            </v-fade-transition>
         </c-dialog-card>
      </v-dialog>
   </div>
</template>

<script>
import DialogCard from './DialogCard';
import ProgressSpinner from './ProgressSpinner';
import Errors from './Errors';
import Icons from '../constants/Icons';
import Pages from '../constants/Pages';
import * as appController from '../controllers/application';

export default {
   name: 'SpeedDial',
   props: ['actions'],
   components: {
      'c-dialog-card': DialogCard,
      'c-progress-spinner': ProgressSpinner,
      'c-error': Errors,
   },
   data() {
      return {
         settingsDialog: {
            flag: false,
            processing: false,
            options: {
               username: null,
            },
            errors: {
               errors: [],
               hasErrors: null,
            },
            dialogCard: {
               title: 'Application Settings',
               text: 'Edit application settings',
               primaryBtn: {
                  action: 'save-settings',
               },
            },
         },
         links: [
            {
               label: 'Home',
               icon: Icons.PAGES.HOME,
               route: Pages.HOME,
               requiresLoginAccess: false,
            },
            {
               label: 'Sign In',
               icon: Icons.PAGES.LOGIN,
               route: Pages.LOGIN,
               requiresLoginAccess: false,
            },
            {
               label: 'Register',
               icon: Icons.PAGES.REGISTER,
               route: Pages.REGISTER,
               requiresLoginAccess: false,
            },
            {
               label: 'Settings',
               icon: Icons.CONTROLS.SETTINGS,
               action: 'open-settings',
               requiresLoginAccess: true,
            },
            {
               label: 'Games',
               icon: Icons.PAGES.GAMES,
               route: Pages.GAMES,
               action: 'exit-game',
               requiresLoginAccess: true,
            },
            {
               label: 'Sign Out',
               icon: Icons.CONTROLS.LOGOUT,
               action: 'logout',
               requiresLoginAccess: true,
            },
         ],
      };
   },
   methods: {
      closeDialog() {
         this.settingsDialog.options = {};
         this.settingsDialog.errors = {};
         this.settingsDialog.flag = false;
         this.settingsDialog.processing = false;
      },
      openSettings() {
         this.settingsDialog.options.username = this.username;
         this.settingsDialog.flag = true;
      },
      async saveSettings() {
         // validate settings
         this.settingsDialog.errors = appController.getValidationErrors(
            this.settingsDialog.options
         );
         if (this.settingsDialog.errors.hasErrors) return;
         // save settings
         this.settingsDialog.processing = true;
         await appController.saveSettings(this.settingsDialog.options);
         this.closeDialog();
      },
      linkActions(link) {
         if (link.action) this.$emit(link.action);
         if (link.action === 'open-settings') {
            this.openSettings();
            return;
         }
         // hacky fix
         if (link.route && link.route !== Pages.GAMES)
            this.navigate({ name: link.route });
      },
   },
   computed: {
      isLoggedIn() {
         return this.$store.state.isLoggedIn;
      },
      username() {
         return this.$store.state.username;
      },
      pageLinks() {
         return this.links
            .filter(link => link.route !== this.$route.name)
            .filter(link => link.requiresLoginAccess === this.isLoggedIn);
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

.c-fab-bottom-text {
   position: absolute;
   top: 35px;
   color: #272727;
   padding: 10px;
}
</style>
