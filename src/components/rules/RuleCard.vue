<template>
   <v-card max-width="300" min-width="300" class="ma-1">
      <v-card-title>{{ gameRule.label }} </v-card-title>
      <v-card-text>{{ gameRule.description }}</v-card-text>
      <v-card-actions>
         <v-spacer></v-spacer>
         <c-btn
            @click="deleteRule = !deleteRule"
            color="red"
            :disabled="gameFinished"
            :icon="Icons.CONTROLS.DELETE"
            >Delete</c-btn
         >
         <c-btn
            @click="editRule = !editRule"
            color="orange"
            :icon="Icons.CONTROLS.EDIT"
            :disabled="gameFinished"
            >Edit</c-btn
         >
      </v-card-actions>
      <c-dialog-wrapper v-model="editRule">
         <c-edit-rule
            :rule="gameRule"
            v-on:close-dialog="closeDialog"
            @click:outside="closeDialog"
         ></c-edit-rule>
      </c-dialog-wrapper>
      <c-dialog-wrapper v-model="deleteRule">
         <c-delete-rule
            :rule="gameRule"
            v-on:close-dialog="closeDialog"
            @click:outside="closeDialog"
         ></c-delete-rule>
      </c-dialog-wrapper>
   </v-card>
</template>

<script>
import Button from '../Button.vue';
import DialogCard from '../dialogs/DialogCard.vue';
import TextArea from '../form-controls/TextArea.vue';
import TextField from '../form-controls/TextField.vue';
import ProgressSpinner from '../ProgressSpinner.vue';
import Combobox from '../form-controls/Combobox.vue';
import EditRule from './EditRule.vue';
import DeleteRule from './DeleteRule.vue';
import DialogWrapperVue from '../dialogs/DialogWrapper.vue';

export default {
   name: 'RuleCard',
   components: {
      'c-btn': Button,
      'c-dialog-card': DialogCard,
      'c-text-field': TextField,
      'c-text-area': TextArea,
      'c-progress-spinner': ProgressSpinner,
      'c-combobox': Combobox,
      'c-edit-rule': EditRule,
      'c-delete-rule': DeleteRule,
      'c-dialog-wrapper': DialogWrapperVue,
   },
   props: {
      gameRule: { required: true },
   },
   data() {
      return {
         editRule: false,
         deleteRule: false,
      };
   },
   methods: {
      closeDialog() {
         this.editRule = false;
         this.deleteRule = false;
      },
   },
   computed: {
      gameFinished() {
         return this.$store.state.game.is_finished;
      },
   },
};
</script>

<style></style>
