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
import About from '../views/About';
import Pages from '../constants/Pages';
import store from '../store/store';

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
   {
      path: '/about',
      name: 'about',
      component: About,
   },
];

const router = new VueRouter({
   routes,
});

router.beforeEach((to, from, next) => {
   // redirect to login page if not logged in and trying to access a restricted page
   const publicPages = [Pages.HOME, Pages.LOGIN, Pages.REGISTER, Pages.ABOUT];
   if (!publicPages.includes(to.name) && !store.state.isLoggedIn) {
      return next('/login');
   }
   next();
});

export default router;
