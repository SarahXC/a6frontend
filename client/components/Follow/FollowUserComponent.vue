<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="follow"
  >
        <button
          v-if="!isFollowing()"
          @click="followUser"
        >
          Follow
        </button>

        <button
          v-if="isFollowing()"
          @click="unfollowUser"
        >
          Unfollow
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
    // Data from the stored freet
    user: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      alerts: {} // Displays success/error messages encountered during freet modification
    };
  },
  methods: {
    isFollowing() {
      /**
       * Returns whether the freet is currently liked
       */
      const follows = this.$store.state.follows; //TODO: create parameter follows
      return follows.filter(like => like.follower.username == this.$store.state.username && like.followed.username == this.user.username).length == 1
    },
    
    followUser() {
      if (this.$store.state.username === this.user.username) {
        const error = 'Error: You cannot follow yourself.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: 'POST', 
        callback: () => {
          this.$store.commit('alert', { //OH HELP: don't I need to specify somewhere
            message: 'Successfully followed user!', status: 'success'
          });
          setTimeout(() => this.$delete(this.alerts, error), 3000);
        }
      };
      this.request(params);
    },
    unfollowUser() {
      //TODO: implement
      return;
    }
  
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

        // this.editing = false;
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
.like {
    /* border: 1px solid #111; */
    padding: 5px;
    position: relative;
}
</style>
