<template>
   <div>
      <v-row class="d-flex flex-row justify-space-around align-start">
         <c-rule-card
            v-show="getFilter(gameRule)"
            v-for="(gameRule, i) of gameRules"
            :key="i"
            :gameRule="gameRule"
         ></c-rule-card>
      </v-row>
      <v-row>
         <v-dialog v-model="filter.flag" width="500">
            <c-dialog-card :props="filter.dialogCard" v-on:close-dialog="closeDialog">
               <c-combobox
                  :items="filter.isStockItems"
                  label="Rule Type"
                  :multiple="true"
                  v-model="filter.values.isStock"
               ></c-combobox>
            </c-dialog-card>
         </v-dialog>
         <v-dialog v-model="createRule.flag" width="500">
            <c-dialog-card
               :props="createRule.dialogCard"
               v-on:create-rule="confirmCreateRule"
               v-on:close-dialog="closeDialog"
            >
               <v-slide-y-transition>
                  <c-progress-spinner v-show="processingRule"></c-progress-spinner>
               </v-slide-y-transition>
               <v-slide-y-transition>
                  <div v-show="!processingRule">
                     <div class="d-flex align-center justify-center">
                        <v-chip
                           @click="
                              createRule.values.useStock = !createRule.values.useStock
                           "
                           label
                           outlined
                           :color="createRule.values.useStock ? 'primary' : null"
                           class="mx-3 mb-6"
                           >Use Pre-defined Rule</v-chip
                        >
                        <v-chip
                           @click="
                              createRule.values.useStock = !createRule.values.useStock
                           "
                           label
                           outlined
                           :color="createRule.values.useStock ? null : 'primary'"
                           class="mx-3 mb-6"
                           >Use Custom Rule</v-chip
                        >
                     </div>
                     <c-combobox
                        :disabled="!createRule.values.useStock"
                        :items="defaultRules"
                        label="Pre-defined Rules"
                        v-model="createRule.values.stock"
                     ></c-combobox>
                     <c-text-field
                        :disabled="createRule.values.useStock"
                        label="Name"
                        v-model="createRule.values.label"
                     ></c-text-field>
                     <c-text-area
                        :disabled="createRule.values.useStock"
                        label="Description"
                        v-model="createRule.values.description"
                     ></c-text-area>
                     <c-error
                        v-for="(error, i) of createRule.errors.errors"
                        :key="i"
                        :error="error"
                     ></c-error>
                  </div>
               </v-slide-y-transition>
            </c-dialog-card>
         </v-dialog>
      </v-row>
   </div>
</template>

<script>
import DialogCard from '../components/DialogCard.vue';
import Combobox from '../components/form-controls/Combobox.vue';
import TextField from '../components/form-controls/TextField.vue';
import TextArea from '../components/form-controls/TextArea.vue';
import ProgressSpinner from '../components/ProgressSpinner.vue';
import RuleCard from '../components/rules/RuleCard.vue';
import Errors from '../components/Errors.vue';
import * as util from '../util/util';
import * as rulesController from '../controllers/rules';
import GameRules from '../constants/GameRules';

export default {
   name: 'Rules',
   components: {
      'c-dialog-card': DialogCard,
      'c-rule-card': RuleCard,
      'c-text-field': TextField,
      'c-combobox': Combobox,
      'c-progress-spinner': ProgressSpinner,
      'c-text-area': TextArea,
      'c-error': Errors,
   },
   data() {
      // TODO move speed dial actions into toolbar
      return {
         processingRule: false,
         createRule: {
            flag: false,
            dialogCard: {
               title: 'Create a Rule',
               text: `Rules are the most important part of any Nuzlocke. Pick a pre-defined rule or make your own rule with a memorable name and description.`,
               primaryBtn: {
                  action: 'create-rule',
               },
            },
            errors: { errors: [], hasErrors: false },
            values: {
               label: null,
               description: null,
               stock: null,
               useStock: null,
            },
         },
         filter: {
            flag: false,
            dialogCard: {
               title: 'Filter Rules',
               cancelBtn: { text: 'close' },
            },
            values: {
               isStock: [],
            },
            isStockItems: [
               { value: true, text: 'Pre-defined' },
               { value: false, text: 'Custom' },
            ],
         },
      };
   },
   computed: {
      gameFinished() {
         return this.$store.state.game.is_finished;
      },
      gameRules() {
         return this.$store.state.game.game_rules;
      },
      defaultRules() {
         return Object.values(GameRules).map(gr =>
            Object({ text: gr.label, value: gr.id })
         );
      },
   },
   methods: {
      closeDialog() {
         this.processingRule = false;
         this.filter.flag = false;
         this.createRule.flag = false;
         this.createRule.values.label = null;
         this.createRule.values.description = null;
         this.createRule.values.stock = null;
         this.createRule.errors.errors = [];
         this.filter.values.isStock = [];
      },
      openFilter() {
         this.filter.flag = true;
      },
      getStockStatus(boolean) {
         return boolean ? 1 : 0;
      },
      getFilter(rule) {
         const isStock = util.includesOrEmptyArray(
            this.getStockStatus(rule.id !== 0),
            this.filter.values.isStock.map(v => this.getStockStatus(v.value))
         );
         return isStock;
      },
      clickCreateRule() {
         // this gets called in Game.vue
         this.createRule.values.useStock = true;
         this.createRule.flag = true;
      },
      async confirmCreateRule() {
         // if (!confirm(util.prettySON(this.createRule.values))) return;
         this.createRule.errors = rulesController.getValidationErrors(
            this.createRule.values
         );
         if (this.createRule.errors.hasErrors) return;
         this.processingRule = true;
         await rulesController.createNewRule(this.createRule.values);
         this.closeDialog();
      },
   },
};
</script>

<style></style>
