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
            <v-row id="manageBtns" class="d-flex flex-row justify-end ma-3">
               <c-btn
                  @click="deleteGame = !deleteGame"
                  color="red"
                  :icon="Icons.CONTROLS.DELETE"
                  >Delete
               </c-btn>
               <c-btn
                  @click="finishGame = !finishGame"
                  :icon="Icons.CONTROLS.CONFIRM"
                  :disabled="game.is_finished"
                  >Finish
               </c-btn>
               <c-btn
                  @click="editGame = !editGame"
                  color="warning"
                  :icon="Icons.CONTROLS.EDIT"
                  >Edit
               </c-btn>
            </v-row>
            <v-row class="d-flex justify-space-around">
               <div id="box-art" class="ma-3">
                  <div>{{ game.version.label }}</div>
                  <c-resource-image
                     :alt-text="game.version.label"
                     :image="game.version.cover_art"
                     max-width="150"
                  ></c-resource-image>
               </div>
               <div id="party" class="ma-3">
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
               <div id="gym-badges" class="ma-3">
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
               <div id="game-links" class="ma-3">
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
      <c-dialog-wrapper v-model="finishGame" v-on:close-dialog="closeDialog">
         <c-finish-game :game="game" v-on:close-dialog="closeDialog"></c-finish-game>
      </c-dialog-wrapper>
      <c-dialog-wrapper v-model="editGame" v-on:close-dialog="closeDialog">
         <c-edit-game :game="game" v-on:close-dialog="closeDialog"></c-edit-game>
      </c-dialog-wrapper>
      <c-dialog-wrapper v-model="deleteGame" v-on:close-dialog="closeDialog">
         <c-delete-game :game="game" v-on:close-dialog="closeDialog"></c-delete-game>
      </c-dialog-wrapper>
      <c-dialog-wrapper v-model="hasErrors" v-on:close-dialog="closeDialog">
         <c-error-card :errors="errors" v-on:close-dialog="closeDialog"></c-error-card>
      </c-dialog-wrapper>
   </v-expansion-panel>
</template>

<script>
import DialogCard from '../dialogs/DialogCard.vue';
import Button from '../Button.vue';
import PokeSprite from '../pokemon/PokeSprite.vue';
import BadgeSprite from '../gyms/BadgeSprite.vue';
import DeleteGame from './DeleteGame.vue';
import EditGame from './EditGame.vue';
import FinishGame from './FinishGame.vue';
import { getConsoleIcon, goToGame } from '../../controllers/game';
import Icons from '../../constants/Icons';
import TabMap from '../../constants/TabMap';
import Pages from '../../constants/Pages';
import { mobile } from '../../util/util';
import ErrorCardVue from '../dialogs/ErrorCard.vue';
import DialogWrapperVue from '../dialogs/DialogWrapper.vue';
import ResourceImageVue from '../ResourceImage.vue';

export default {
   name: 'Gamecordian',
   props: { game: { required: true } },
   components: {
      'c-dialog-card': DialogCard,
      'c-btn': Button,
      'c-poke-sprite': PokeSprite,
      'c-badge-sprite': BadgeSprite,
      'c-delete-game': DeleteGame,
      'c-edit-game': EditGame,
      'c-finish-game': FinishGame,
      'c-error-card': ErrorCardVue,
      'c-dialog-wrapper': DialogWrapperVue,
      'c-resource-image': ResourceImageVue,
   },
   data() {
      return {
         errors: null,
         hasErrors: false,
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
         editGame: false,
         deleteGame: false,
         finishGame: false,
      };
   },
   computed: {
      consoleIcon() {
         return getConsoleIcon(this.game.version.version_group);
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
         this.errors = null;
         this.hasErrors = false;
         this.editGame = false;
         this.deleteGame = false;
         this.finishGame = false;
      },
      async toMobileOrDesktop(btn) {
         if (mobile()) await this.toGame(btn.mobileRoute);
         else await this.toGame(btn.desktopRoute);
      },
      async toGame(route) {
         const goToResponse = await goToGame(this.game.game_id, route);
         if (goToResponse) {
            this.errors = goToResponse;
            this.hasErrors = true;
            return;
         }
      },
   },
};
</script>

<style></style>
