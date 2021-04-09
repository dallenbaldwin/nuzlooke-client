<template>
   <v-textarea
      hide-details
      :clear-icon="Icons.CONTROLS.CLOSE"
      clearable
      outlined
      :value="value"
      @input="$emit('input', $event)"
      :label="label"
      :disabled="disabled"
      auto-grow
      rows="1"
      class="ma-3"
   >
   </v-textarea>
</template>

<script>
export default {
   name: 'TextField',
   props: {
      label: { required: true },
      value: { required: false },
      disabled: { required: false, default: false },
   },
};
</script>

<style></style>
