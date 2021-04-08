<template>
   <div>
      <v-row class="d-flex flex-row justify-space-around align-start">
         <c-rule-card
            v-for="(gameRule, i) of gameRules"
            :key="i"
            :gameRule="gameRule"
         ></c-rule-card>
      </v-row>
      <v-row>
         <v-dialog v-model="filter.flag" width="500">
            <c-dialog-card
               :props="filter.dialogCard"
               v-on:close-dialog="closeDialog"
            ></c-dialog-card>
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
                     <c-combobox
                        :disabled="gameFinished"
                        label="Pre-defined Rules"
                        v-model="createRule.values.stock"
                        :items="stockRules"
                     >
                     </c-combobox>
                     <c-text-field
                        :disabled="gameFinished"
                        label="Name"
                        v-model="createRule.values.label"
                     ></c-text-field>
                     <c-text-area
                        :disabled="gameFinished"
                        label="Description"
                        v-model="createRule.values.description"
                     ></c-text-area>
                     <c-error
                        v-for="(error, i) of createRule.errors.errors"
                        :key="i"
                        :error="error"
                     >
                     </c-error>
                  </div>
               </v-slide-y-transition>
               <v-fade-transition>
                  <c-error
                     v-show="isPredefinedAndCustom"
                     error="You cannot select a Pre-defined Rule and define a Custom Rule at the same time!"
                  >
                  </c-error>
               </v-fade-transition>
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
      return {
         processingRule: false,
         createRule: {
            flag: false,
            dialogCard: {
               title: 'Create a Rule',
               text: `Rules are the most important part of any Nuzlocke. Pick a pre-defined rule or give yourself a new rule with memorable name and description.`,
               primaryBtn: {
                  action: 'create-rule',
               },
            },
            errors: { errors: [], hasErrors: false },
            values: {
               label: null,
               description: null,
               stock: null,
            },
         },
         filter: {
            flag: false,
            dialogCard: {
               title: 'Filter Rules',
               text: 'I want to filter Rules!',
               cancelBtn: { text: 'close' },
            },
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
      stockRules() {
         return rulesController.getAvailableStockRules();
      },
      isPredefinedAndCustom() {
         return (
            !util.isUndefined(this.createRule.values.stock) &&
            (!util.isUndefined(this.createRule.values.label) ||
               !util.isUndefined(this.createRule.values.description))
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
         this.createRule.predefined = null;
      },
      openFilter() {
         this.filter.flag = true;
      },
      clickCreateRule() {
         this.createRule.flag = true;
      },
      async confirmCreateRule() {
         if (!confirm(util.prettySON(this.createRule.values))) return;
         if (this.isPredefinedAndCustom) return;
         this.createRule.errors = rulesController.getValidationErrors(
            this.createRule.values
         );
         if (this.createRule.errors.hasErrors) return;
         await rulesController.createNewRule(this.createRule.values);
         this.processingRule = true;
         this.closeDialog();
      },
   },
};
</script>

<style></style>
