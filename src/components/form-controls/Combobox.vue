<template>
   <v-combobox
      outlined
      :label="label"
      :items="items"
      clearable
      :clear-icon="Icons.CONTROLS.CLOSE"
      :disabled="disabled"
      :value="value"
      @input="$emit('input', $event)"
      :multiple="multiple"
      :chips="types"
   >
      <template v-slot:selection="data" v-if="types">
         <c-pokemon-type :type="data.item"></c-pokemon-type>
      </template>
   </v-combobox>
</template>

<script>
import PokemonType from '../pokemon/PokemonType.vue';

export default {
   name: 'Combobox',
   components: {
      'c-pokemon-type': PokemonType,
   },
   props: {
      label: { required: true },
      value: { required: true },
      items: { required: true },
      disabled: { required: false, default: false },
      multiple: { required: false, default: false },
      types: { required: false, default: false },
   },
};
</script>

<style></style>
