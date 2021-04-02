<template>
   <v-row>
      Rules
      <pre>{{ prettySON(game.game_rules) }}</pre>
      <v-dialog v-model="createRuleDialog" width="500">
         <c-dialog-card
            :props="createRuleDialogCard"
            v-on:create-rule="confirmCreateRule"
            v-on:close-dialog="closeDialog"
         >
         </c-dialog-card>
      </v-dialog>
   </v-row>
</template>

<script>
import DialogCardVue from '../components/DialogCard.vue';
import * as util from '../util/util';

export default {
   name: 'Rules',
   components: {
      'c-dialog-card': DialogCardVue,
   },
   data() {
      return {
         // create rule
         createRuleDialog: false,
         creatingRule: false,
         createRuleData: {
            label: null,
            description: null,
         },
         createRuleDialogCard: {
            title: 'Create a Rule',
            primaryBtn: {
               action: 'create-rule',
            },
         },
      };
   },
   computed: {
      game() {
         return this.$store.state.game;
      },
   },
   methods: {
      closeDialog() {
         this.createRuleDialog = false;
         this.creatingRule = false;
         this.createRuleData.description = null;
         this.createRuleData.label = null;
      },
      // filterRules() {
      //    alert('i want to filter my rules!');
      // },
      createRule() {
         this.createRuleDialog = true;
      },
      confirmCreateRule() {
         alert(util.prettySON(this.createRuleData));
         this.closeDialog();
      },
   },
};
</script>

<style></style>
