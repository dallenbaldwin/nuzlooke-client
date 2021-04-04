<template>
   <v-expansion-panel>
      <v-expansion-panel-header
         disable-icon-rotate
         :expand-icon="consoleIcon"
         class="text-h6"
         >{{ game.label }}</v-expansion-panel-header
      >
      <v-expansion-panel-content>
         <v-container>
            <v-row id="manageBtns" class="d-flex justify-end mb-3 mt-1">
               <c-btn :click="clickDeleteGame" color="red" :icon="Icons.CONTROLS.DELETE"
                  >Delete</c-btn
               >
               <c-btn :click="clickEditGame" color="warning" :icon="Icons.CONTROLS.EDIT"
                  >Edit</c-btn
               >
            </v-row>
            <v-row class="d-flex justify-space-around">
               <div id="box-art">
                  <div>{{ game.version.label }}</div>
                  <v-img
                     class="mt-2"
                     :alt="game.version.label"
                     :lazy-src="Icons.MISC.NUZLOOKE"
                     :src="game.version.artwork_url"
                     max-height="150"
                     max-width="150"
                     position="center left"
                     contain
                  ></v-img>
               </div>
               <div id="party">
                  <div>Party</div>
                  <div
                     v-for="(group, i) of ofSix(game.party_icon_urls)"
                     :key="`${group}-${i}`"
                     class="d-inline-flex flex-column mr-3"
                  >
                     <c-poke-sprite
                        v-for="(url, i) of group"
                        class="mt-2"
                        :key="`${url}-${i}`"
                        :src="url"
                        outlineColor=""
                        size="small"
                     ></c-poke-sprite>
                  </div>
               </div>
               <div id="gym-badges">
                  <div>Gym Badges</div>
                  <div
                     v-for="(group, i) of ofEight(game.gym_badge_icon_urls)"
                     :key="`${group}-${i}`"
                     class="d-inline-flex flex-column mr-3"
                  >
                     <c-badge-sprite
                        class="mt-2"
                        v-for="(url, i) of group"
                        :key="`${url}-${i}`"
                        :src="url"
                     ></c-badge-sprite>
                  </div>
               </div>
               <div id="game-links">
                  <div>Game Links</div>
                  <div v-for="btn of gameBtns" :key="btn.label">
                     <div class="d-inline-flex mt-1">
                        <v-btn
                           class="align-self-center"
                           fab
                           dark
                           small
                           @click="toMobileOrDesktop(btn)"
                           ><v-icon>{{ btn.icon }}</v-icon></v-btn
                        >
                        <span class="ml-3 align-self-center">{{ btn.label }}</span>
                     </div>
                  </div>
               </div>
            </v-row>
         </v-container>
      </v-expansion-panel-content>
      <v-dialog v-model="editGame.flag" width="500">
         <c-dialog-card
            :props="editGame.dialogCard"
            v-on:close-dialog="closeDialog"
            v-on:edit-game="confirmEdit"
         >
            <v-fade-transition>
               <c-progress-spinner v-show="processingGame"></c-progress-spinner>
            </v-fade-transition>
            <v-fade-transition>
               <div v-show="!processingGame">
                  <c-text-field
                     label="Name"
                     v-model="editGame.values.label"
                  ></c-text-field>
                  <c-error
                     v-for="(error, i) of editGame.errors.errors"
                     :key="i"
                     :error="error"
                  ></c-error>
               </div>
            </v-fade-transition>
         </c-dialog-card>
      </v-dialog>
      <v-dialog v-model="deleteGame.flag" width="500">
         <c-dialog-card
            :props="deleteGame.dialogCard"
            v-on:close-dialog="closeDialog"
            v-on:delete-game="confirmDelete(game.game_id)"
         >
            <v-fade-transition>
               <c-progress-spinner v-show="processingGame"></c-progress-spinner>
            </v-fade-transition>
         </c-dialog-card>
      </v-dialog>
   </v-expansion-panel>
</template>

<script>
import DialogCard from '../DialogCard.vue';
import Button from '../Button.vue';
import ProgressSpinner from '../ProgressSpinner.vue';
import PokeSprite from '../pokemon/PokeSprite.vue';
import BadgeSprite from '../gyms/BadgeSprite.vue';
import TextField from '../form-controls/TextField.vue';
import Errors from '../Errors.vue';
import * as gameController from '../../controllers/game';
import Icons from '../../constants/Icons';
import TabMap from '../../constants/TabMap';
import Pages from '../../constants/Pages';
import { mobile } from '../../util/util';

export default {
   name: 'Gamecordian',
   props: { game: { required: true } },
   components: {
      'c-dialog-card': DialogCard,
      'c-btn': Button,
      'c-progress-spinner': ProgressSpinner,
      'c-poke-sprite': PokeSprite,
      'c-badge-sprite': BadgeSprite,
      'c-error': Errors,
      'c-text-field': TextField,
   },
   data() {
      return {
         processingGame: false,
         gameBtns: [
            {
               label: 'Pokemon',
               mobileRoute: Pages.POKEMON,
               desktopRoute: TabMap.POKEMON,
               icon: Icons.PAGES.POKEMON,
            },
            {
               label: 'Routes',
               mobileRoute: Pages.ROUTES,
               desktopRoute: TabMap.ROUTES,
               icon: Icons.PAGES.ROUTES,
            },
            {
               label: 'Gyms',
               mobileRoute: Pages.GYMS,
               desktopRoute: TabMap.GYMS,
               icon: Icons.PAGES.GYMS,
            },
            {
               label: 'Rules',
               mobileRoute: Pages.RULES,
               desktopRoute: TabMap.RULES,
               icon: Icons.PAGES.RULES,
            },
         ],
         editGame: {
            flag: false,
            values: {
               label: null,
            },
            dialogCard: {
               title: `Edit ${this.game.label}?`,
               text: `Edit settings for ${this.game.label}`,
               primaryBtn: {
                  action: 'edit-game',
               },
            },
            errors: {
               errors: [],
               hasErrors: false,
            },
         },
         deleteGame: {
            flag: false,
            dialogCard: {
               title: `Delete ${this.game.label}?`,
               text: 'This action cannot be undone. Are you sure you want to continue?',
               secondaryBtn: {
                  action: 'delete-game',
               },
            },
         },
      };
   },
   computed: {
      consoleIcon() {
         return gameController.getConsoleIcon(this.game.version.version_group);
      },
   },
   methods: {
      ofSix(array) {
         const twoD = [];
         twoD.push(array.filter((e, i) => i / 6 < 0.5));
         twoD.push(array.filter((e, i) => i / 6 >= 0.5));
         return twoD;
      },
      ofEight(array) {
         const twoD = [];
         twoD.push(array.filter((e, i) => i / 9 < 0.44));
         twoD.push(array.filter((e, i) => i / 9 > 0.44));
         return twoD;
      },
      closeDialog() {
         this.processingGame = false;
         this.editGame.flag = false;
         this.editGame.values = {};
         this.deleteGame.flag = false;
      },
      clickDeleteGame() {
         this.deleteGame.flag = true;
      },
      async confirmDelete() {
         this.processingGame = true;
         await gameController.deleteExistingGame(this.game.game_id);
         this.closeDialog();
      },
      clickEditGame() {
         this.editGame.values.label = this.game.label;
         this.editGame.flag = true;
      },
      async confirmEdit() {
         this.editGame.errors = gameController.getValidationErrors(
            this.editGame.values,
            true
         );
         if (this.editGame.errors.hasErrors) return;
         this.processingGame = true;
         await gameController.updateGameLabel(
            this.game.game_id,
            this.editGame.values.label
         );
         this.closeDialog();
      },
      async toMobileOrDesktop(btn) {
         if (mobile()) await this.toGame(btn.mobileRoute);
         else await this.toGame(btn.desktopRoute);
      },
      async toGame(route) {
         await gameController.goToGame(this.game.game_id, route);
      },
   },
};
</script>

<style></style>
