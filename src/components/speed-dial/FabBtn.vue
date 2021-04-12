<template>
   <v-btn
      fab
      :color="color ? color : Colors.grey.darken4"
      @click="$emit('click', $event)"
      class="ma-4 white--text"
      :disabled="disabled"
   >
      <v-icon>{{ icon }}</v-icon>
      <div class="c-fab-bottom-text">{{ label }}</div>
   </v-btn>
</template>

<script>
export default {
   name: 'FabBtn',
   props: {
      color: { required: false, default: null },
      icon: { required: true },
      label: { required: true },
      disabled: { required: false, default: false },
   },
};
</script>

<style>
.c-fab-bottom-text {
   position: absolute;
   top: 35px;
   color: #272727;
   padding: 10px;
}
</style>
