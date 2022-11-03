import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

/**
 * Storage for data that needs to be accessed from various compoentns.
 */
const store = new Vuex.Store({
  state: {
    filter: null, // Username to filter shown freets by (null = show all)
    freets: [], // All freets created in the app
    username: null, // Username of the logged in user
    alerts: {}, // global success/error messages encountered during submissions to non-visible forms
    categories: [], 
  },
  mutations: {
    alert(state, payload) {
      /**
       * Add a new message to the global alerts.
       */
      Vue.set(state.alerts, payload.message, payload.status);
      setTimeout(() => {
        Vue.delete(state.alerts, payload.message);
      }, 3000);
    },
    setCategories(state, categories) { 
      /**
       * @param categories - categories of freets to show
       */
      state.categories = categories;
    },
    setUsername(state, username) {
      /**
       * Update the stored username to the specified one.
       * @param username - new username to set
       */
      state.username = username;
    },
    updateFilter(state, filter) {
      /**
       * Update the stored freets filter to the specified one.
       * @param filter - Username of the user to fitler freets by
       */
      state.filter = filter;
    },
    updateFreets(state, freets) {
      /**
       * Update the stored freets to the provided freets.
       * @param freets - Freets to store
       */
      state.freets = freets;
    },
    async refreshFreets(state) {
      /**
       * Request the server for the currently available freets.
       */
      const url = state.filter ? `/api/users/${state.filter}/freets` : '/api/freets';
      const res = await fetch(url).then(async r => r.json());
      state.freets = res;
    }
  },
  actions: {
    async getUser(state) {
      const r = await fetch('/api/users/session', {
        credentials: 'same-origin',
      });
      const res = await r.json();
      const user = res.user;
      state.commit('setUsername', user ? user.username : null);  

      if (user) {
        await state.dispatch('getCategories');
      }
    },

    async getCategories(state) {
      const r = await fetch('/api/adjustfeeds/breakdown', {
        credentials: 'same-origin',
      });
      const res = await r.json();
      const categories = res.categories;
      console.log(categories);
      state.commit('setCategories', categories ? categories : null);  
    }



  },
  //TODO: add getters
  getters: {
    getFreetsInCategories: state => {
      if (!state.freets) return [];
      // return state.freets.filter(f => state.categories.includes(f.category)) //TODO: use getters
      return state.freets.filter(f => state.categories.includes(f.category)) //TODO: use getters
    }
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
