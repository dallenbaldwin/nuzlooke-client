<template>
   <v-container class="text-justify">
      <v-row>
         <v-col> <c-speed-dial v-if="!mobile()"></c-speed-dial></v-col>
      </v-row>
      <v-row>
         <v-col>
            <div class="ma-3 text-h3">About Nuzlooke</div>
         </v-col>
      </v-row>
      <v-row id="about">
         <v-col>
            <div class="ma-3 text-h4">Why Nuzlooke?</div>
            <div class="ma-3">
               Hi! I'm Dallen. I'm the
               <a
                  href="https://github.com/dallenbaldwin"
                  target="_black"
                  class="text-decoration-none"
                  >developer</a
               >. This application was built for my Senior Capstone at Utah Valley
               University. I graduated in Spring 2021 in Computer Science with an Emphasis
               in Full Stack Web Development. Want to
               <a
                  class="text-decoration-none"
                  href="https://linkedin.com/in/dallenbaldwin"
                  target="_blank"
                  >hire me</a
               >?
            </div>
            <div class="ma-3">
               I love playing the mainline Pokemon games. I still have fond memories of
               playing Blue version on my teal Gameboy Color, pressed up against the
               window in the back seat of my family's minivan, catching the light from
               passing streetlights; yeah that's right, backlights didn't exist on
               handheld consoles back then. Today, I particularly enjoy playing with the
               <a
                  href="https://bulbapedia.bulbagarden.net/wiki/Nuzlocke_Challenge"
                  target="_blank"
                  class="text-decoration-none"
                  >Nuzlocke</a
               >
               ruleset once I've finished a normal playthrough.
            </div>
            <div class="ma-3">
               The only issue with playing Nuzlockes, especially when you can't sit down
               and play all at once or have a memory as bad as mine, is having to remember
               everything. Did I already catch something in this route? What level does my
               team need to be at to fight the next Gym? Am I overleveled so much it won't
               be fun anymore? What were the extra rules I determined to play with before
               hand?
            </div>
            <div class="ma-3">
               Other applications exist out there to help manage a Nuzlocke playthrough,
               but I really didn't enjoy using them. There were just enough shortcomings,
               or missing features that I would spend more time in the manager than
               playing the game, need to reference a bunch of external information, or
               find it super difficult to use.
            </div>
            <div class="ma-3">
               Enter my Senior Capstone. My Professor gave me and the class a lot of
               autonomy in coming up with our Capstone projects. I had a list of project
               ideas and felt Nuzlooke was big enough, and small enough, to fit the bill
               for a full semester's worth of work; especially since I would be
               responsible for <i>everything</i> from design, to code, to hosting. Many
               long days were spent on Nuzlooke and my wife counted the minutes until
               graduation, when I would finally be able go to bed at a reasonable hour and
               not sleep in until noon on Saturdays. I spent at least 300 hours over 4
               months on this project.
            </div>
            <div class="ma-3">
               Is the name an intential pun on Nuzlocke? Yes.
            </div>
         </v-col>
      </v-row>
      <v-row id="terms-service">
         <v-col>
            <div class="ma-3 text-h4">Terms of Service</div>
            <div class="ma-3">
               Nuzlooke is a small project. Be cool. Please don't make me write a formal
               Terms of Service
            </div>
         </v-col>
      </v-row>
      <v-row id="privacy-policy">
         <v-col>
            <div class="ma-3 text-h4">
               Privacy Policy <small class="text-caption">5/2021</small>
            </div>
            <div class="ma-3 text-h5">What data does Nuzlooke collect and store?</div>
            <div class="ma-3">Data is stored on the AWS platform in DynamoDB</div>
            <div class="ma-3">
               Nuzlooke only collects what is necessary for the application to function
            </div>
            <div class="ma-3">
               <ul>
                  <li>
                     The email address used to register the account (Nuzlooke doesn't even
                     use robust email verification right now)
                  </li>
                  <li>The password used to register an account</li>
                  <ul>
                     <li>
                        Users who register and log in with Google or Facebook
                        <i>don't even have a password saved in the database</i>. Nuzlooke
                        uses those services to confirm the existence of a user and make
                        logging quick and easy. It is recommended to use these services
                     </li>
                     <li>
                        Passwords are encrypted using the
                        <a
                           class="text-decoration-none"
                           href="https://www.npmjs.com/package/bcryptjs"
                           target="_blank"
                           >bcryptjs</a
                        >
                        library in the database
                     </li>
                     <li>
                        Passwords are encrypted with a salt length of 10 (at this time)
                     </li>
                     <li>
                        Passwords are only transmitted <i>to</i> the server. Responses
                        from the server do not include passwords. All communication is
                        through HTTPS
                     </li>
                  </ul>
                  <li>
                     A current list of Nuzlocke games. Deleting games in the application
                     will remove them from this list and the database
                  </li>
                  <li>
                     A username. This can be edited in the application and is not
                     encrypted
                  </li>
               </ul>
            </div>
            <div class="ma-3 text-h5">
               Does Nuzlooke share data with 3rd Parties?
            </div>
            <div class="ma-3">
               No. The only useful data would be your email address and 3rd Parties don't
               need Nuzlooke to get an email address
            </div>
            <div class="ma-3 text-h5">How does Nuzlooke make money?</div>
            <div class="ma-3">
               It doesn't. If you'd like to buy me a meal, family sized pack of Sour Patch
               Watermelons, or SweeTARTS Ropes... that'd be cool...
            </div>
            <div class="ma-3">
               Nuzlooke's front end is hosted on Netlify's free tier, which is why the URL
               is kind of funny. The back end is hosted on AWS Elastic Beanstalk using a
               t2-Micro, AWS' cheapest service. This t2-Micro is technically owned by a
               professor at Utah Valley University right now and HTTPS on the back end is
               provided by their AWS account. If Nuzlooke needs to find a new back end
               hosting service and get a custom domain for HTTPS, I will definitely start
               losing money on this venture
            </div>
         </v-col>
      </v-row>
      <v-row id="data-deletion">
         <v-col>
            <div class="ma-3 text-h4">Data Deletion Instructions</div>
            <div class="ma-3">
               Nuzlooke is a pretty small scale application completely managed by me. I am
               the development team, support team, marketing team, President, and CEO.
               Deleting your data is pretty painless.
            </div>
            <div class="ma-3">
               <ol>
                  <li>
                     Send an email to
                     <a
                        href="mailto:babaldwin.codes@gmail.com"
                        class="text-decoration-none"
                        target="_black"
                        >babaldwin.codes@gmail.com</a
                     >
                  </li>
                  <li>
                     Include the email you used to create the account or the email
                     associated with your Google or Facebook account
                  </li>
                  <li>
                     You may receive a survey or some questions to get some feedback about
                     your experience with the application. Nuzlooke will not force you to
                     complete a survey to delete data
                  </li>
                  <li>
                     Within 2-3 business days, a confirmation email will be sent,
                     indicating the associated profile and games no longer appear in the
                     Nuzlooke database
                  </li>
               </ol>
            </div>
         </v-col>
      </v-row>
   </v-container>
</template>

<script>
import SpeedDialVue from '../components/speed-dial/SpeedDial.vue';

export default {
   name: 'About',
   components: {
      'c-speed-dial': SpeedDialVue,
   },
};
</script>

<style></style>
