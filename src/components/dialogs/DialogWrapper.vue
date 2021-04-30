<template>
   <v-dialog
      scrollable
      :value="value"
      @input="$emit('input', $event)"
      max-width="500"
      @click:outside="$emit('close-dialog')"
      ><slot></slot
   ></v-dialog>
</template>

<script>
export default {
   name: 'DialogWrapper',
   props: {
      value: { required: true },
   },
};
</script>

<style></style>
