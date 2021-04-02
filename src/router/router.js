import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home';
import Login from '../views/Login';
import Register from '../views/Register';
import Games from '../views/Games';
import Game from '../views/Game';
import Pokemon from '../views/Pokemon';
import Routes from '../views/Routes';
import Gyms from '../views/Gyms';
import Rules from '../views/Rules';

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
      path: '/games/:gameId',
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
