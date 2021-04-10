<template>
   <v-btn
      :fab="isFab"
      :icon="isIcon"
      :color="isFab ? color : null"
      :text="!isFab"
      :small="isFab"
      :dark="isFab"
      @click="$emit('click', $event)"
      :disabled="disabled"
   >
      <v-icon v-if="isFab">{{ icon }}</v-icon>
      <v-icon v-if="!isFab" :color="color" dark>{{ icon }}</v-icon>
      <span v-if="!isIcon && !isFab" class="ml-1">
         <slot></slot>
      </span>
   </v-btn>
</template>

<script>
export default {
   name: 'Button',
   props: {
      color: { default: undefined },
      icon: { required: true },
      disabled: { required: false, default: false },
      isIcon: { required: false, default: false },
      isFab: { required: false, default: false },
   },
};
</script>

<style></style>
