<template>
   <c-dialog-card
      :props="dialogCard"
      v-on:close-dialog="closeDialog"
      v-on:start-game="startGame"
   >
      <v-fade-transition>
         <c-progress-spinner v-show="processingGame"></c-progress-spinner>
      </v-fade-transition>
      <v-fade-transition>
         <div class="mt-3" v-show="!processingGame">
            <c-text-field label="Name" v-model="values.label"></c-text-field>
            <c-combobox
               label="Version"
               v-model="values.version"
               :items="gameVersions"
            ></c-combobox>
            <div
               v-for="(rule, i) of values.rules"
               :key="`${i}-rule`"
               class="d-flex flex-row"
            >
               <c-combobox
                  :items="rule.items"
                  v-model="rule.values"
                  label="Pre-defined Rule"
               ></c-combobox>
               <c-btn
                  class="align-self-center"
                  @click="removeRule(i)"
                  color="red"
                  :icon="Icons.CONTROLS.DELETE"
                  :isIcon="true"
               ></c-btn>
            </div>
            <div class="mb-3">
               <v-spacer></v-spacer>
               <c-btn @click="addRule" color="success" :icon="Icons.CONTROLS.ADD"
                  >Add Default Rule</c-btn
               >
            </div>
            <c-error
               v-for="(error, i) of errors.errors"
               :key="`${i}-error`"
               :error="error"
            >
            </c-error>
         </div>
      </v-fade-transition>
   </c-dialog-card>
</template>

<script>
import DialogCard from '../dialogs/DialogCard.vue';
import GameRules from '../../constants/GameRules';
import GameVersions from '../../constants/GameVersions';
import Button from '../Button.vue';
import TextField from '../form-controls/TextField.vue';
import Combobox from '../form-controls/Combobox.vue';
import ProgressSpinner from '../ProgressSpinner.vue';
import Errors from '../Errors.vue';
import * as util from '../../util/util';
import * as gameController from '../../controllers/game';

export default {
   name: 'CreateGame',
   props: {},
   components: {
      'c-dialog-card': DialogCard,
      'c-btn': Button,
      'c-text-field': TextField,
      'c-combobox': Combobox,
      'c-progress-spinner': ProgressSpinner,
      'c-error': Errors,
   },
   data() {
      return {
         processingGame: false,
         dialogCard: {
            title: 'Start a new Game',
            text:
               'Are you ready to set out on a new adventure? Give this playthrough a memorable name and pick a game version.',
            primaryBtn: {
               text: 'Start',
               action: 'start-game',
            },
         },
         errors: {
            errors: [],
            hasErrors: false,
         },
         defaultGameRules: Object.values(GameRules).map(gr =>
            Object({ value: gr.id, text: gr.label })
         ),
         values: {
            label: null,
            version: null,
            rules: [
               {
                  // have to do this for each one because of component hook event weirdness...
                  items: Object.values(GameRules).map(gr =>
                     Object({ value: gr.id, text: gr.label })
                  ),
                  values: {
                     text: GameRules.USE_NICKNAMES.label,
                     value: GameRules.USE_NICKNAMES.id,
                  },
               },
               {
                  items: Object.values(GameRules).map(gr =>
                     Object({ value: gr.id, text: gr.label })
                  ),
                  values: {
                     text: GameRules.FAINTING_KILLS.label,
                     value: GameRules.FAINTING_KILLS.id,
                  },
               },
               {
                  items: Object.values(GameRules).map(gr =>
                     Object({ value: gr.id, text: gr.label })
                  ),
                  values: {
                     text: GameRules.ONE_MON_ONE_AREA.label,
                     value: GameRules.ONE_MON_ONE_AREA.id,
                  },
               },
            ],
         },
      };
   },
   computed: {
      gameVersions() {
         return Object.values(GameVersions).map(v =>
            Object({
               value: v.version,
               text: v.label,
            })
         );
      },
   },
   methods: {
      addRule() {
         if (this.values.rules.some(r => util.isUndefined(r.values))) return;
         this.values.rules.push({
            items: this.defaultGameRules,
            values: null,
         });
      },
      removeRule(index) {
         this.values.rules.splice(index, 1);
      },
      async startGame() {
         // validate
         this.errors = gameController.getValidationErrors(this.values);
         if (this.errors.hasErrors) return;
         this.processingGame = true;
         const start = await gameController.createGame(
            this.values.label,
            this.values.version.value,
            this.values.rules.map(rule => rule.values.value)
         );
         if (start) {
            this.processingGame = false;
            this.errors.errors.push(...start);
            return;
         }
         this.closeDialog();
      },
      closeDialog() {
         this.processingGame = false;
         this.errors.errors = [];
         this.errors.hasErrors = false;
         this.$emit('close-dialog');
      },
   },
};
</script>

<style></style>
