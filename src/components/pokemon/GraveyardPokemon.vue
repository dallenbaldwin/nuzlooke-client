<template>
   <c-dialog-card
      :props="dialogCard"
      v-on:close-dialog="closeDialog"
      v-on:confirm-graveyard="confirmSendToGraveyard"
   >
      <v-slide-y-transition>
         <c-progress-spinner v-show="processingPokemon"></c-progress-spinner>
      </v-slide-y-transition>
      <v-slide-y-transition>
         <div v-show="!processingPokemon">
            <c-text-field v-model="faintedMessage" :label="faintedLabel"></c-text-field>
         </div>
      </v-slide-y-transition>
      <c-error-messages
         :errors="errors"
         :full-width="true"
         v-if="hasErrors"
      ></c-error-messages>
   </c-dialog-card>
</template>

<script>
import TextField from '../form-controls/TextField.vue';
import ProgressSpinner from '../../components/ProgressSpinner.vue';
import DialogCard from '../../components/dialogs/DialogCard.vue';
import Icons from '../../constants/Icons';
import ErrorMessagesVue from '../ErrorMessages.vue';
import { sendToGraveyard } from '../../controllers/pokemon';

export default {
   name: 'GraveyardPokemon',
   components: {
      'c-text-field': TextField,
      'c-progress-spinner': ProgressSpinner,
      'c-dialog-card': DialogCard,
      'c-error-messages': ErrorMessagesVue,
   },
   props: { pokemon: { required: true } },
   data() {
      return {
         errors: null,
         hasErrors: false,
         processingPokemon: false,
         faintedMessage: null,
         faintedLabel: null,
         dialogCard: {
            title: null,
            text: null,
            primaryBtn: {
               color: 'black',
               icon: Icons.CONTROLS.TOMBSTONE,
               text: 'Send to Graveyard',
               action: 'confirm-graveyard',
            },
         },
      };
   },
   computed: {
      computedName() {
         return this.pokemon.nickname ? this.pokemon.nickname : this.pokemon.species;
      },
   },
   methods: {
      closeDialog() {
         this.errors = null;
         this.hasErrors = false;
         this.faintedMessage = null;
         this.$emit('close-dialog');
      },
      async confirmSendToGraveyard() {
         this.processingPokemon = true;
         this.pokemon.fainted_message = this.faintedMessage;
         let errors = await sendToGraveyard(this.pokemon);
         if (errors) {
            this.pokemon.fainted_message = undefined;
            this.processingPokemon = false;
            this.errors = errors;
            this.hasErrors = true;
            return;
         }
         this.closeDialog();
      },
   },
   mounted() {
      this.faintedLabel = `What happened to ${this.computedName}?`;
      this.dialogCard.title = `Send ${this.computedName} to the Graveyard?`;
      this.dialogCard.text = `Are you sure you want to send ${this.computedName} to the Graveyard? This action cannot be undone!`;
   },
};
</script>

<style></style>
