<template>
   <v-checkbox
      hide-details
      :checked="value"
      :value="value"
      @change="$emit('input', $event)"
      :label="label"
      :false-value="falseValue"
      :true-value="trueValue"
      class="ma-3 pt-0"
   >
   </v-checkbox>
</template>

<script>
export default {
   name: 'Checkbox',
   components: {},
   props: {
      value: { required: true },
      label: { required: true },
      'false-value': { required: false, default: false },
      'true-value': { required: false, default: true },
   },
   computed: {},
   data() {
      return {};
   },
   methods: {},
};
</script>

<style></style>
