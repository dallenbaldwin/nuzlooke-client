export const initFacebookSDK = () => {
   return new Promise(resolve => {
      // wait for facebook sdk to initialize before starting the vue app
      window.fbAsyncInit = function() {
         FB.init({
            // FIXME this needs to be an env variable in netlify
            appId: process.env.FACEBOOK_APP_ID || '503771524156657',
            cookie: true,
            xfbml: true,
            version: 'v10.0',
         });

         // auto authenticate with the api if already logged in with facebook
         FB.getLoginStatus(({ authResponse }) => {
            if (authResponse) {
               // TODO
               // accountService.apiAuthenticate(authResponse.accessToken).then(resolve);
            } else {
               resolve();
            }
         });
      };

      // load facebook sdk script
      (function(d, s, id) {
         var js,
            fjs = d.getElementsByTagName(s)[0];
         if (d.getElementById(id)) {
            return;
         }
         js = d.createElement(s);
         js.id = id;
         js.src = 'https://connect.facebook.net/en_US/sdk.js';
         fjs.parentNode.insertBefore(js, fjs);
      })(document, 'script', 'facebook-jssdk');
   });
};
