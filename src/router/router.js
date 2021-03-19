import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Games from '../views/Games.vue';
import Game from '../views/Game.vue';
import Pokemon from '../views/Pokemon.vue';
import Routes from '../views/Routes.vue';
import Gyms from '../views/Gyms.vue';
import Rules from '../views/Rules.vue';

Vue.use(VueRouter);

const routes = [
   {
      path: '/',
      name: 'home',
      component: Home,
   },
   {
      path: '/login',
      name: 'login',
      component: Login,
   },
   {
      path: '/register',
      name: 'register',
      component: Register,
   },
   {
      path: '/games',
      name: 'games',
      component: Games,
   },
   {
      path: '/games/:gameId/tab/:tab',
      name: 'game',
      component: Game,
   },
   {
      path: '/games/:gameId/pokemon',
      name: 'pokemon',
      component: Pokemon,
   },
   {
      path: '/games/:gameId/rules',
      name: 'rules',
      component: Rules,
   },
   {
      path: '/games/:gameId/routes',
      name: 'routes',
      component: Routes,
   },
   {
      path: '/games/:gameId/gyms',
      name: 'gyms',
      component: Gyms,
   },
];

const router = new VueRouter({
   routes,
});

export default router;
