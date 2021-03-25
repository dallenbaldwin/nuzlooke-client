<template>
   <div class="c-circle" :class="outlineClass">
      <v-img
         :lazy-src="defaultImagePath"
         :src="src || defaultImagePath"
         :width="radius"
         :height="radius"
         contain
         position="center center"
      >
      </v-img>
   </div>
</template>

<script>
import Icons from '../constants/Icons.js';

export default {
   name: 'PokeSprite',
   props: {
      src: {
         required: true,
      },
      size: {
         default: '',
      },
      'outline-color': {
         default: 'black',
      },
   },
   data() {
      return {
         defaultImagePath: Icons.MISC.POKEBALL,
      };
   },
   computed: {
      radius() {
         switch (this.size) {
            case 'small':
               return 36;
            case 'large':
               return 100;
            default:
               return 68;
         }
      },
      outlineClass() {
         switch (this.outlineColor) {
            case 'red':
               return 'c-red';
            case 'green':
               return 'c-green';
            case 'orange':
               return 'c-orange';
            default:
               return 'c-black';
         }
      },
   },
};
</script>

<style scoped>
.c-circle {
   border-radius: 50%;
   border-width: 2px;
   border-style: solid;
   /* stolen from v-btn */
   box-shadow: 0px 3px 5px -1px rgb(0 0 0 / 20%), 0px 6px 10px 0px rgb(0 0 0 / 14%),
      0px 1px 18px 0px rgb(0 0 0 / 12%);
}
.c-black {
   border-color: #272727;
}
.c-green {
   border-color: #4caf50;
}
.c-orange {
   border-color: #ff9800;
}
.c-red {
   border-color: #f44336;
}
</style>
