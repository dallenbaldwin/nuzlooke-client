<template>
   <div>
      <v-card
         @click="authenticate(provider.label)"
         v-for="(provider, i) of providers"
         :key="i"
         min-width="262"
         class="ma-3"
         outlined
         elevation="1"
      >
         <v-card-text class="d-flex flex-row align-center">
            <v-icon v-if="provider.icon" x-large :color="provider.color">
               {{ provider.icon }}
            </v-icon>
            <v-img
               v-if="provider.label === 'Google'"
               src="../../../public/img/google.svg"
               contain
               max-height="40"
               max-width="40"
            ></v-img>
            <span class="mx-6 text-h5">{{ provider.label }}</span>
         </v-card-text>
      </v-card>
      <v-fade-transition group key="i">
         <c-error
            v-for="(error, i) of errors"
            :key="i"
            :error="error"
            :max-width="mobile() ? null : 262"
            class="ma-3"
         ></c-error>
      </v-fade-transition>
   </div>
</template>

<script>
import Errors from '../Errors.vue';
import Icons from '../../constants/Icons';
import * as authController from '../../controllers/auth';

export default {
   name: 'LoginProviders',
   components: {
      'c-error': Errors,
   },
   data() {
      return {
         errors: [],
         providers: [
            {
               label: 'Google',
            },
            {
               label: 'Facebook',
               icon: Icons.BRANDS.FACEBOOK,
               color: '#1778F2',
            },
         ],
      };
   },
   methods: {
      authenticate(provider) {
         this.errors = [];
         if (provider === 'Google') return this.withGoogle();
         else if (provider === 'Facebook') return this.withFacebook();
      },
      async withGoogle() {
         try {
            const GoogleUser = await this.$gAuth.signIn();
            await authController.loginWithGoogle(GoogleUser);
         } catch (err) {
            if (err.error === 'popup_closed_by_user') return;
            this.errors.push(err.error ? err.error : err);
         }
      },
      async withFacebook() {
         alert('facebook!');
      },
   },
};
// https://developers.google.com/identity/branding-guidelines
// https://jasonwatmore.com/post/2020/09/25/vue-facebook-login-tutorial-example
</script>

<style></style>
