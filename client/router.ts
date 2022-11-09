import Vue from 'vue';
import VueRouter from 'vue-router';
import FreetsPage from './components/Freet/FreetsPage.vue';
import AccountPage from './components/Account/AccountPage.vue';
import LoginPage from './components/Login/LoginPage.vue';
import AdjustfeedPage from './components/Adjustfeed/AdjustfeedPage.vue';
import ProfilePage from './components/Profile/ProfilePage.vue';
import NotFound from './NotFound.vue';
import store from './store';

Vue.use(VueRouter);

const routes = [
  {path: '/', name: 'Home', component: FreetsPage},
  {path: '/account', name: 'Account', component: AccountPage},
  {path: '/login', name: 'Login', component: LoginPage},
  {path: '/adjustfeeds', name: 'Adjust Feed', component: AdjustfeedPage},
  // {path: '/users', name: 'Profile', component: ProfilePage},
  {path: '/users/:username', name: 'Profile', component: ProfilePage},
  {path: '*', name: 'Not Found', component: NotFound}
];

const router = new VueRouter({routes});

/**
 * Navigation guards to prevent user from accessing wrong pages.
 */
router.beforeEach(async (to, from, next) => {
  await store.dispatch('getUser');
  // await store.dispatch('getCategories'); //TODO: is this correct
 
  if (to.name === 'Login' && store.state.username) {
    next({name: 'Account'}); // Go to Account page if user navigates to Login and are signed in
    return;
  }

  if (to.name === 'Account' && !store.state.username) {
    next({name: 'Login'}); // Go to Login page if user navigates to Account and are not signed in
    return;
  }

  next();
});

export default router;
