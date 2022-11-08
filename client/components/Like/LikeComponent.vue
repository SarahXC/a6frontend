<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="like"
  >
        <button
          v-if="!isLiked()"
          @click="likePost"
        >
          👍 Like
        </button>

        <button
          v-if="isLiked()"
          @click="unlikePost"
        >
          👎 Unlike
        </button>

        <p class="info">
          Current Likes: {{ freet.numLikes }}
        </p>

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
  name: 'LikeComponent',
  props: {
    // Data from the stored freet
    freet: {
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
    isLiked() {
      /**
       * Returns whether the freet is currently liked
       */
      const likes = this.$store.state.likes;
      return likes.filter(like => like.post._id == this.freet._id && like.userLike.username === this.$store.state.username).length == 1
    },
    likePost() {
      if (this.$store.state.username === this.freet.authorId) {
        const error = 'Error: You cannot like your own post.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: 'POST', 
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully liked freet!', status: 'success'
          });
          setTimeout(() => this.$delete(this.alerts, error), 3000);
        }
      };
      this.request(params);
    },
    unlikePost() {
      if (this.$store.state.username === this.freet.authorId) {
        const error = 'Error: You cannot unlike your own post.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: 'DELETE', 
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully unliked freet!', status: 'success'
          });
          setTimeout(() => this.$delete(this.alerts, error), 3000);
        }
      };
      this.request(params);
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
        const r = await fetch('/api/likes', options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.editing = false;
        this.$store.commit('refreshLikes');

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
