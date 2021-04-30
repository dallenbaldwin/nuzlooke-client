<template>
   <div>
      <v-row>
         <c-toolbar
            :filter="true"
            :add="true"
            add-label="Create Rule"
            filter-label="Filter"
            v-on:filter="clickFilter"
            v-on:add="clickAdd"
            :sort="false"
         ></c-toolbar>
      </v-row>
      <v-row class="d-flex flex-row justify-space-around align-start">
         <c-rule-card
            v-show="getFilter(gameRule)"
            v-for="(gameRule, i) of gameRules"
            :key="i"
            :gameRule="gameRule"
         ></c-rule-card>
      </v-row>
      <c-dialog-wrapper v-model="filter.flag">
         <c-dialog-card :props="filter.dialogCard" v-on:close-dialog="closeDialog">
            <c-combobox
               :items="filter.isStockItems"
               label="Rule Type"
               :multiple="true"
               v-model="filter.values.isStock"
            ></c-combobox>
         </c-dialog-card>
      </c-dialog-wrapper>
      <c-dialog-wrapper v-model="createRule">
         <c-create-rule v-on:close-dialog="createRule = !createRule"></c-create-rule>
      </c-dialog-wrapper>
   </div>
</template>

<script>
import DialogCard from '../components/dialogs/DialogCard.vue';
import Combobox from '../components/form-controls/Combobox.vue';
import RuleCard from '../components/rules/RuleCard.vue';
import CreateRule from '../components/rules/CreateRule.vue';
import Toolbar from '../components/Toolbar.vue';
import * as util from '../util/util';
import DialogWrapperVue from '../components/dialogs/DialogWrapper.vue';

export default {
   name: 'Rules',
   components: {
      'c-rule-card': RuleCard,
      'c-dialog-card': DialogCard,
      'c-toolbar': Toolbar,
      'c-combobox': Combobox,
      'c-create-rule': CreateRule,
      'c-dialog-wrapper': DialogWrapperVue,
   },
   data() {
      return {
         createRule: false,
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
   },
   methods: {
      closeDialog() {
         this.filter.flag = false;
         this.createRule = false;
         this.filter.values.isStock = [];
      },
      clickFilter() {
         // this is inherited from Game.vue and App.vue
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
      clickAdd() {
         // this gets called in Game.vue and App.vue
         this.createRule = !this.createRule;
      },
   },
};
</script>

<style></style>
