<template>
   <c-dialog-card
      :props="dialogCard"
      v-on:close-dialog="closeDialog"
      v-on:confirm-evolve="confirmEvolve"
   >
      <v-slide-y-transition>
         <c-progress-spinner v-show="processingPokemon"></c-progress-spinner>
      </v-slide-y-transition>
      <v-slide-y-transition>
         <div v-show="!processingPokemon">
            <div class="text-body mb-3">
               {{ computedName }} can evolve into one of the following Pokemon. Which one
               is it evolving into?
            </div>
            <c-combobox label="Evolution" :items="evolutionPokemon" v-model="evolvesTo">
            </c-combobox>
         </div>
      </v-slide-y-transition>
      <c-error-messages
         :errors="errors"
         v-if="hasErrors"
         :full-width="true"
      ></c-error-messages>
   </c-dialog-card>
</template>

<script>
import Combobox from '../form-controls/Combobox.vue';
import ProgressSpinner from '../../components/ProgressSpinner.vue';
import DialogCard from '../../components/dialogs/DialogCard.vue';
import { evolvePokemon } from '../../controllers/pokemon';
import Icons from '../../constants/Icons';
import ErrorMessagesVue from '../ErrorMessages.vue';

export default {
   name: 'EvolvePokemon',
   components: {
      'c-combobox': Combobox,
      'c-progress-spinner': ProgressSpinner,
      'c-dialog-card': DialogCard,
      'c-error-messages': ErrorMessagesVue,
   },
   props: { pokemon: { required: true } },
   data() {
      return {
         processingPokemon: false,
         evolvesTo: null,
         dialogCard: {
            title: null,
            text: null,
            primaryBtn: {
               color: 'primary',
               icon: Icons.CONTROLS.EVOLVE,
               text: 'Evolve',
               action: 'confirm-evolve',
            },
         },
      };
   },
   computed: {
      evolutionPokemon() {
         return this.pokemon.evolves_to;
      },
      computedName() {
         return this.pokemon.nickname ? this.pokemon.nickname : this.pokemon.species;
      },
   },
   methods: {
      closeDialog() {
         this.evolvesTo = null;
         this.$emit('close-dialog');
      },
      async confirmEvolve() {
         this.processingPokemon = true;
         let errors = await evolvePokemon(this.pokemon, this.evolvesTo);
         if (errors) {
            this.processingPokemon = false;
            this.errors = errors;
            this.hasErrors = true;
            return;
         }
         this.closeDialog();
      },
   },
   mounted() {
      this.dialogCard.text = `Are you sure you want to evolve ${this.computedName}? This action cannot be undone!`;
      this.dialogCard.title = `Evolve ${this.computedName}?`;
   },
};
</script>

<style></style>
