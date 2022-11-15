<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="follow"
  >
        <button
          v-if="!isFollowing() && !ownAccount()"
          @click="followUser"
        >
          ➕ Follow
        </button>

        <button
          v-if="isFollowing() && !ownAccount()"
          @click="unfollowUser"
        >
          ➕ Unfollow
        </button>

    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </article>
</template>

<script>
export default {
  name: 'FollowUserComponent',
  props: {
    // Data from the stored user
    username: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      alerts: {} 
    };
  },
  methods: {
    ownAccount() {
      return this.$store.state.username === this.username; 
    },
    isFollowing() {
      /**
       * Returns whether the user is already follow the user
       */
      const follows = this.$store.state.follows;
      console.log(JSON.stringify(follows))
      return follows.filter(f => ((f.follower == this.$store.state.username) && (f.followed == this.username))).length == 1;
    },
    followUser() {
      const params = {
        method: 'POST', 
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin', // Sends express-session credentials with request
        body: JSON.stringify({username: this.username}), //TODO: add to follow
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully followed user!', status: 'success'
          });
          setTimeout(() => this.$delete(this.alerts, error), 3000);
          // this.$store.commit('updateFollows', this.user); //TODO: add
        }
      };
      this.request(params);
      this.$store.commit('refreshFollows');
      this.$store.commit('refreshFollows');
    },
    unfollowUser() {

      const params = {
        method: 'DELETE', 
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin', // Sends express-session credentials with request
        body: JSON.stringify({username: this.username}), //TODO: add to follow
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully unfollowed user!', status: 'success'
          });
          setTimeout(() => this.$delete(this.alerts, error), 3000);
        }
      };
      this.request(params);
      this.$store.commit('refreshFollows');
    },
  
    async request(params) {
      /**
       * Submits a request to the freet's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method, headers: {'Content-Type': 'application/json'}
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch('/api/follows', options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.editing = false;
        this.$store.commit('refreshFollows');

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>

<style scoped>
.follow {
    /* border: 1px solid #111; */
    padding: 5px;
    position: relative;
}
</style>
