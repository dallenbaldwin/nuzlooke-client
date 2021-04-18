<template>
   <div>
      <v-fade-transition group>
         <c-error v-for="(error, i) of errors" :key="i" :error="error"></c-error>
      </v-fade-transition>
      <c-text-field label="Email" v-model="email"></c-text-field>
      <c-text-field label="Password" v-model="password" :password="true"></c-text-field>
      <c-text-field
         v-if="isRegister"
         label="Confirm Password"
         v-model="confirmPassword"
         :password="true"
      ></c-text-field>
      <div class="d-flex flex-column align-end">
         <c-checkbox
            v-if="!isRegister"
            label="Remember me"
            v-model="remember"
         ></c-checkbox>
         <a v-if="!isRegister" class="ma-3 text-decoration-none" @click="forgotPassword"
            >Forgot your password?</a
         >
         <div>
            <c-btn
               @click="isRegister ? register() : authenticate()"
               :icon="Icons.CONTROLS.CONFIRM"
            >
               {{ isRegister ? 'Register' : 'Sign in' }}
            </c-btn>
         </div>
      </div>
   </div>
</template>

<script>
import * as util from '../../util/util';
import Button from '../Button.vue';
import Errors from '../Errors.vue';
import Checkbox from '../form-controls/Checkbox.vue';
import TextField from '../form-controls/TextField.vue';

export default {
   name: 'UserPass',
   props: {
      isRegister: { required: false, default: false },
   },
   components: {
      'c-text-field': TextField,
      'c-btn': Button,
      'c-checkbox': Checkbox,
      'c-error': Errors,
   },
   computed: {
      passwordsMatch() {
         return this.password === this.confirmPassword;
      },
      isEmail() {
         const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
         return pattern.test(this.email);
      },
   },
   data() {
      return {
         email: null,
         password: null,
         confirmPassword: null,
         remember: true,
         errors: [],
      };
   },
   methods: {
      validate() {
         this.errors = [];
         if (util.isUndefined(this.password))
            this.errors.push('You need to enter a password!');
         if (!this.isEmail) this.errors.push('Please enter a valid email!');
         if (this.isRegister && !this.passwordsMatch)
            this.errors.push('Your passwords need to match!');
         return this.errors.length === 0;
      },
      authenticate() {
         if (!this.validate()) return;
         alert('auth');
      },
      register() {
         if (!this.validate()) return;
         this.$store.dispatch('registerUser', {
            username: this.email,
            password: this.password,
            attributes: {
               email: this.email,
            },
         });
      },
      forgotPassword() {
         alert('well that sucks!');
      },
   },
};
</script>

<style></style>
