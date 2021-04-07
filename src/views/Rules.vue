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
         <v-dialog v-model="createRuleDialog" width="500">
            <c-dialog-card
               :props="createRuleDialogCard"
               v-on:create-rule="confirmCreateRule"
               v-on:close-dialog="closeDialog"
            >
            </c-dialog-card>
         </v-dialog>
         <v-dialog v-model="filter.flag" width="500">
            <c-dialog-card
               :props="filter.dialogCard"
               v-on:close-dialog="closeDialog"
            ></c-dialog-card>
         </v-dialog>
      </v-row>
   </div>
</template>

<script>
import DialogCard from '../components/DialogCard.vue';
import RuleCard from '../components/rules/RuleCard.vue';
import * as util from '../util/util';

export default {
   name: 'Rules',
   components: {
      'c-dialog-card': DialogCard,
      'c-rule-card': RuleCard,
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
      game() {
         return this.$store.state.game;
      },
      gameRules() {
         return this.$store.state.game.game_rules;
      },
   },
   methods: {
      closeDialog() {
         this.createRuleDialog = false;
         this.creatingRule = false;
         this.createRuleData.description = null;
         this.createRuleData.label = null;
      },
      createRule() {
         this.createRuleDialog = true;
      },
      confirmCreateRule() {
         alert(util.prettySON(this.createRuleData));
         this.closeDialog();
      },
      openFilter() {
         this.filter.flag = true;
      },
      closeDialog() {
         this.filter.flag = false;
      },
   },
};
</script>

<style></style>
