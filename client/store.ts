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
    credibility: 0,
    //TODO: add likes and can do it based on freets 
    likes: [], //all of the likes
    follows: [],
    // isFollowing: [], // all the accounts the signed in user is following
    // followedBy: [] // all the accounts that follow the signed in user
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
    // setIsFollowing(state, isFollowing) { 
    //   state.isFollowing = isFollowing;
    // },
    // setFollowedBy(state, followedBy) { 
    //   state.followedBy = followedBy;
    // },
    setCategories(state, categories) { 
      /**
       * @param categories - categories of freets to show
       */
      state.categories = categories;
    },
    setCredibility(state, credibility) { 
      /**
       * @param credibility - categories of freets to show
       */
      state.credibility = credibility;
    },
    setLikes(state, likes) {
      /**
       * Update the stored likes to the provided likes.
       * @param likes - likes to store
       */
      state.likes = likes;
    },
    setFollows(state, follows) {
      /**
       * Update the stored likes to the provided likes.
       * @param likes - likes to store
       */
      state.follows = follows;
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
    },
    async refreshLikes(state) {
      /**
       * Request the server for the currently available freets.
       */
      const url = '/api/likes';
      const res = await fetch(url).then(async r => r.json());
      state.likes = res;
    },
    async refreshFollows(state) {
      /**
       * Request the server for the currently available freets.
       */
      const url = '/api/follows';
      const res = await fetch(url).then(async r => r.json());
      state.follows = res;
    },
    updateLikes(state, postId){ //NEW
      const newFreets = state.freets.map(freet => {
        if (freet._id === postId) {
          return {
            ...freet,
            numLikes: freet.numLikes + 1,
          };
        }
        return freet;
      })
      state.freets = newFreets;
    },
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
        await state.dispatch('getCredibility');
        await state.dispatch('getLikes');
        await state.dispatch('getFollows');
        // await state.dispatch('getIsFollowing');
        // await state.dispatch('getFollowedBy');
      }
      // state.alerts = {};
    },
    // async getIsFollowing(state) {
    //   const r = await fetch('/api/follows/followings', {
    //     credentials: 'same-origin',
    //   });
    //   const res = await r.json();
    //   const isFollowing = res.isFollowing;
    //   // console.log(categories);
    //   state.commit('setIsFollowing', isFollowing ? isFollowing : null);  
    // },

    // async getFollowedBy(state) {
    //   const r = await fetch('/api/follows/followers', {
    //     credentials: 'same-origin',
    //   });
    //   const res = await r.json();
    //   const followedBy = res.followedBy;
    //   console.log(followedBy);
    //   state.commit('setFollowedBy', followedBy ? followedBy : null);  
    // },

    async getCategories(state) {
      const r = await fetch('/api/adjustfeeds/breakdown', {
        credentials: 'same-origin',
      });
      const res = await r.json();
      const categories = res.categories;
      console.log(categories);
      state.commit('setCategories', categories ? categories : null);  
    },

    async getCredibility(state) {
      const r = await fetch('/api/credibilities', {
        credentials: 'same-origin',
      });
      const res = await r.json();
      const credibilityScore = res.score;
      console.log(credibilityScore);
      state.commit('setCredibility', credibilityScore ? credibilityScore : 0);  
    },

    async getLikes(state) {
      const r = await fetch('/api/likes', {
        credentials: 'same-origin',
      });
      const res = await r.json();
      const likes = res;
      console.log("likes is: ", likes);
      state.commit('setLikes', likes ? likes : []);  
    },

    async getFollows(state) {
      const r = await fetch('/api/follows', {
        credentials: 'same-origin',
      });
      const res = await r.json();
      const follows = res;
      console.log("follows is : ", follows);
      state.commit('setFollows', follows ? follows : []);  
    }



  },
  //TODO: add getters
  getters: {
    getFreetsInCategories: state => {
      if (!state.freets) return [];
      return state.freets.filter(f => state.categories.includes(f.category)) 
    }
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
