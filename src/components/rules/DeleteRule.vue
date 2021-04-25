<template>
   <c-dialog-card
      :finished="gameFinished"
      :props="dialogCard"
      v-on:confirm-delete="confirmDelete"
      v-on:close-dialog="closeDialog"
   >
      <v-slide-y-transition>
         <c-progress-spinner v-show="processing"></c-progress-spinner>
      </v-slide-y-transition>
   </c-dialog-card>
</template>

<script>
import DialogCardVue from '../dialogs/DialogCard.vue';
import ProgressSpinnerVue from '../ProgressSpinner.vue';
import * as rulesController from '../../controllers/rules';
import Icons from '../../constants/Icons';

export default {
   name: 'DeleteRule',
   components: {
      'c-dialog-card': DialogCardVue,
      'c-progress-spinner': ProgressSpinnerVue,
   },
   props: {
      rule: { required: true },
   },
   data() {
      return {
         processing: false,
         dialogCard: {
            title: `Delete ${this.rule.label}?`,
            text: `This action cannot be undone. Are you sure you want to continue?`,
            primaryBtn: {
               color: 'red',
               icon: Icons.CONTROLS.DELETE,
               text: 'delete',
               action: 'confirm-delete',
            },
         },
      };
   },
   computed: {
      gameFinished() {
         return this.$store.state.game.is_finished;
      },
   },
   methods: {
      closeDialog() {
         this.$emit('close-dialog');
      },
      async confirmDelete() {
         this.processing = true;
         await rulesController.deleteRule(this.rule);
         this.closeDialog();
      },
   },
};
</script>

<style></style>
