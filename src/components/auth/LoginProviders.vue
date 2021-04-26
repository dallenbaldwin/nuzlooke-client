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
      <c-error-messages v-if="hasErrors" :errors="errors"></c-error-messages>
   </div>
</template>

<script>
import { loginWithGoogle } from '../../controllers/auth';
import ErrorsMessagesVue from '../ErrorMessages.vue';

export default {
   name: 'LoginProviders',
   components: {
      'c-error-messages': ErrorsMessagesVue,
   },
   data() {
      return {
         errors: null,
         hasErrors: false,
         providers: [
            {
               label: 'Google',
            },
            // {
            //    label: 'Facebook',
            //    icon: Icons.BRANDS.FACEBOOK,
            //    color: '#1778F2',
            // },
         ],
      };
   },
   methods: {
      authenticate(provider) {
         this.errors = null;
         if (provider === 'Google') return this.withGoogle();
         else if (provider === 'Facebook') return this.withFacebook();
      },
      async withGoogle() {
         const GoogleUser = await this.$gAuth.signIn();
         let errors = await loginWithGoogle(GoogleUser);
         if (errors && errors.errors.includes('popup_closed_by_user')) return;
         else if (errors) {
            this.hasErrors = true;
            this.errors = errors;
         }
      },
      // TODO facebook auth
      async withFacebook() {
         alert('facebook!');
      },
   },
};
// https://developers.google.com/identity/branding-guidelines
// https://jasonwatmore.com/post/2020/09/25/vue-facebook-login-tutorial-example
</script>

<style></style>
