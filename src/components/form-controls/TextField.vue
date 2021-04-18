<template>
   <v-text-field
      :clear-icon="Icons.CONTROLS.CLOSE"
      hide-details
      clearable
      outlined
      :value="value"
      @input="$emit('input', $event)"
      :label="label"
      :disabled="disabled"
      class="ma-3"
      :type="password && hidePassword ? 'password' : null"
      :append-icon="getIcon()"
      @click:append="hidePassword = !hidePassword"
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
      password: { required: false, default: false },
   },
   data() {
      return {
         eye: 'mdi-eye',
         eyeOff: 'mdi-eye-off',
         hidePassword: true,
      };
   },
   methods: {
      getIcon() {
         if (this.password) {
            return this.hidePassword ? this.eyeOff : this.eye;
         }
         return null;
      },
   },
};
</script>

<style></style>
