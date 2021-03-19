<template>
   <div class="c-circle" :class="outlineClass">
      <v-img
         class="c-scaled"
         :lazy-src="src"
         :src="src"
         :width="radius"
         :height="radius"
         position="center center"
      >
      </v-img>
   </div>
</template>

<script>
export default {
   name: 'PokeSprite',
   props: ['src', 'size', 'outlineColor'],
   data() {
      return {};
   },
   computed: {
      radius() {
         switch (this.size) {
            case 'small':
               return 40;
            case 'large':
               return 160;
            default:
               return 80;
         }
      },
      outlineClass() {
         switch (this.outlineColor) {
            case 'red':
               return 'c-red';
            case 'green':
               return 'c-green';
            case 'yellow':
               return 'c-yellow';
            default:
               return 'c-black';
         }
      },
   },
};
</script>

<style scoped>
.c-scaled {
   transform: scale(0.8, 0.8);
}
.c-circle {
   border-radius: 50%;
   border-width: 2px;
   max-height: 40px;
   max-width: 40px;
   border-style: solid;
   /* stolen from v-btn */
   box-shadow: 0px 3px 5px -1px rgb(0 0 0 / 20%), 0px 6px 10px 0px rgb(0 0 0 / 14%),
      0px 1px 18px 0px rgb(0 0 0 / 12%);
}
.c-black {
   border-color: black;
}
</style>
