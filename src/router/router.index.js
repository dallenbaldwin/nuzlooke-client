import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Games from '../views/Games.vue';
import Game from '../views/Game.vue';

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
      path: '/games/:gameId/pokemon',
      name: 'pokemon',
      component: Game,
   },
   {
      path: '/games/:gameId/rules',
      name: 'rules',
      component: Game,
   },
   {
      path: '/games/:gameId/routes',
      name: 'routes',
      component: Game,
   },
   {
      path: '/games/:gameId/gyms',
      name: 'gyms',
      component: Game,
   },
];

const router = new VueRouter({
   routes,
});

export default router;
