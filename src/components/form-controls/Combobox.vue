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
   ></v-combobox>
</template>

<script>
export default {
   name: 'Combobox',
   props: {
      label: { required: true },
      value: { required: true },
      items: { required: true },
      disabled: { required: false, default: false },
   },
};
</script>

<style></style>
