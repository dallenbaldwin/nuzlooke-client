<template>
   <v-text-field
      :clear-icon="Icons.CONTROLS.CLOSE"
      clearable
      outlined
      :value="value"
      @input="$emit('input', $event)"
      :label="label"
      :disabled="disabled"
   >
   </v-text-field>
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
