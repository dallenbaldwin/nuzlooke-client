import Vue from 'vue';

// https://github.com/mejiamanuel57/vue-facebook-signin-button-directive/blob/master/index.js
// added scope and auth_type to FB.login since I needed more than the name
// tweaked the onfail to better suite my needs
// increased the version number

export default Vue.directive('facebook-signin-button', {
   bind: function(el, binding, vnode) {
      CheckComponentMethods();
      let appId = binding.value;
      let facebookSignInAPI = document.createElement('script');
      facebookSignInAPI.setAttribute('src', '//connect.facebook.net/en_US/sdk.js');
      document.head.appendChild(facebookSignInAPI);

      facebookSignInAPI.onload = InitFacebookButton;

      function InitFacebookButton() {
         FB.init({
            appId: appId,
            xfbml: true,
            version: 'v10.0',
         });
      }

      el.addEventListener('click', PopUp);

      function PopUp() {
         try {
            FB.login(
               function(facebookResponse) {
                  if (facebookResponse.status === 'connected') {
                     OnSuccess(facebookResponse.authResponse.accessToken);
                  }
               },
               { scope: 'email', auth_type: 'rerequest' }
            );
         } catch (err) {
            Onfail(err);
         }
      }
      function OnSuccess(token) {
         vnode.context.OnFacebookAuthSuccess(token);
      }
      function Onfail(err) {
         vnode.context.OnFacebookAuthFail(err);
      }
      function CheckComponentMethods() {
         if (!vnode.context.OnFacebookAuthSuccess) {
            throw new Error(
               'The method OnFacebookAuthSuccess must be defined on the component'
            );
         }

         if (!vnode.context.OnFacebookAuthFail) {
            throw new Error(
               'The method OnFacebookAuthFail must be defined on the component'
            );
         }
      }
   },
});
