<template>
   <div>
      <v-card max-width="300" min-width="300" class="ma-1">
         <v-card-title>{{ gameRule.label }} </v-card-title>
         <v-card-text>{{ gameRule.description }}</v-card-text>
         <v-card-actions>
            <v-spacer></v-spacer>
            <c-btn
               @click="deleteRule.flag = !deleteRule.flag"
               color="red"
               :disabled="gameFinished"
               :icon="Icons.CONTROLS.DELETE"
               >Delete</c-btn
            >
            <c-btn
               @click="clickEditRule"
               color="orange"
               :icon="Icons.CONTROLS.EDIT"
               :disabled="gameFinished"
               >Edit</c-btn
            >
         </v-card-actions>
      </v-card>
      <v-dialog v-model="editRule.flag" width="500">
         <c-dialog-card
            :finished="gameFinished"
            :props="editRule.dialogCard"
            v-on:confirm-edit="confirmEdit"
            v-on:close-dialog="closeDialog"
         >
            <v-slide-y-transition>
               <c-progress-spinner v-show="processingRule"></c-progress-spinner>
            </v-slide-y-transition>
            <v-slide-y-transition>
               <div v-show="!processingRule">
                  <div class="d-flex align-center justify-center">
                     <v-chip
                        @click="editRule.values.useStock = !editRule.values.useStock"
                        label
                        outlined
                        :color="editRule.values.useStock ? 'primary' : null"
                        class="mx-3 mb-6"
                        >Use Pre-defined Rule</v-chip
                     >
                     <v-chip
                        @click="editRule.values.useStock = !editRule.values.useStock"
                        label
                        outlined
                        :color="editRule.values.useStock ? null : 'primary'"
                        class="mx-3 mb-6"
                        >Use Custom Rule</v-chip
                     >
                  </div>
                  <c-combobox
                     :disabled="!editRule.values.useStock"
                     :items="defaultRules"
                     label="Pre-defined Rules"
                     v-model="editRule.values.stock"
                  ></c-combobox>
                  <c-text-field
                     :disabled="editRule.values.useStock"
                     label="Name"
                     v-model="editRule.values.label"
                  ></c-text-field>
                  <c-text-area
                     :disabled="editRule.values.useStock"
                     label="Description"
                     v-model="editRule.values.description"
                  ></c-text-area>
                  <c-error
                     v-for="(error, i) of editRule.errors.errors"
                     :key="i"
                     :error="error"
                  ></c-error>
               </div>
            </v-slide-y-transition>
         </c-dialog-card>
      </v-dialog>
      <v-dialog v-model="deleteRule.flag" width="500">
         <c-dialog-card
            :finished="gameFinished"
            :props="deleteRule.dialogCard"
            v-on:confirm-delete="confirmDelete"
            v-on:close-dialog="closeDialog"
         >
            <v-slide-y-transition>
               <c-progress-spinner v-show="processingRule"></c-progress-spinner>
            </v-slide-y-transition>
         </c-dialog-card>
      </v-dialog>
   </div>
</template>

<script>
import Button from '../Button.vue';
import DialogCard from '../dialogs/DialogCard.vue';
import TextArea from '../form-controls/TextArea.vue';
import TextField from '../form-controls/TextField.vue';
import ProgressSpinner from '../ProgressSpinner.vue';
import Combobox from '../form-controls/Combobox.vue';
import Errors from '../Errors.vue';
import * as util from '../../util/util';
import GameRules from '../../constants/GameRules';
import * as rulesController from '../../controllers/rules';

export default {
   name: 'RuleCard',
   components: {
      'c-btn': Button,
      'c-dialog-card': DialogCard,
      'c-text-field': TextField,
      'c-text-area': TextArea,
      'c-progress-spinner': ProgressSpinner,
      'c-combobox': Combobox,
      'c-error': Errors,
   },
   props: {
      gameRule: { required: true },
   },
   data() {
      return {
         processingRule: false,
         editRule: {
            flag: false,
            dialogCard: {
               title: `Edit ${this.gameRule.label}?`,
               primaryBtn: {
                  text: 'save',
                  action: 'confirm-edit',
               },
            },
            errors: {
               errors: [],
               hasErrors: false,
            },
            values: {
               isUpdate: true,
               useStock: false,
               label: null,
               description: null,
               stock: {},
            },
         },
         deleteRule: {
            flag: false,
            dialogCard: {
               title: `Delete ${this.gameRule.label}?`,
               text: `This action cannot be undone. Are you sure you want to continue?`,
               secondaryBtn: {
                  text: 'delete',
                  action: 'confirm-delete',
               },
            },
         },
      };
   },
   methods: {
      closeDialog() {
         this.editRule.flag = false;
         this.deleteRule.flag = false;
         this.processingRule = false;
         this.editRule.errors.errors = [];
      },
      clickEditRule() {
         if (this.gameRule.id === 0) {
            this.editRule.values.useStock = false;
            this.editRule.values.label = this.gameRule.label;
            this.editRule.values.description = this.gameRule.description;
            this.editRule.values.stock = null;
         } else {
            this.editRule.values.useStock = true;
            this.editRule.values.stock = {
               text: this.gameRule.label,
               value: this.gameRule.id,
            };
         }
         this.editRule.flag = true;
      },
      async confirmEdit() {
         // if (!confirm(util.prettySON(this.editRule.values))) return;
         this.editRule.errors = rulesController.getValidationErrors(this.editRule.values);
         if (this.editRule.errors.hasErrors) return;
         this.processingRule = true;
         this.editRule.values.oldId = this.gameRule.id;
         this.editRule.values.oldLabel = this.gameRule.label;
         await rulesController.updateRule(this.editRule.values);
         this.closeDialog();
      },
      async confirmDelete() {
         this.processingRule = true;
         await rulesController.deleteRule(this.gameRule);
         this.closeDialog();
      },
   },
   computed: {
      defaultRules() {
         return Object.values(GameRules).map(gr =>
            Object({ text: gr.label, value: gr.id })
         );
      },
      gameFinished() {
         return this.$store.state.game.is_finished;
      },
   },
};
</script>

<style></style>
