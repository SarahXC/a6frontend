<!-- Page for account sign-in and registration -->
<!-- User should be NOT authenticated in order to see this page -->

<template>
  <main>
    <section>
      <header>
        <h2> @{{username}}</h2>
      </header>

      <header>
        <h2> Freets</h2>
      </header>
      <FollowUserComponent
        :username="username"
      />
      <FreetComponent
          v-for="freet in getFreetsByUser(username)"
          :key="freet.id"
          :freet="freet"
        />
    </section>
  </main>
</template>

<script>
// import CreateAdjustfeedForm from '@/components/Profile/FilteredFreets.vue';
import FreetComponent from '@/components/Freet/FreetComponent.vue';
import FollowUserComponent from '@/components/Follow/FollowUserComponent.vue';


export default {
  name: 'ProfilePage',
  components: {FreetComponent, FollowUserComponent},
  data() {
    return {
      username: this.$route.params.username,
    };
  },
  methods: {
    getFreetsByUser(username) {
      const allFreets = this.$store.state.freets;
      return allFreets.filter(freet => freet.author == username);
    },

    // async request(params) {
    //   /**
    //    * Submits a request to the freet's endpoint
    //    * @param params - Options for the request
    //    * @param params.body - Body for the request, if it exists
    //    * @param params.callback - Function to run if the the request succeeds
    //    */
    //   const options = {
    //     method: params.method, headers: {'Content-Type': 'application/json'}
    //   };
    //   if (params.body) {
    //     options.body = params.body;
    //   }

    //   try {
    //     const r = await fetch('/api/likes', options);
    //     if (!r.ok) {
    //       const res = await r.json();
    //       throw new Error(res.error);
    //     }

    //     this.$store.commit('refreshLikes');
    //     this.$store.commit('refreshFollows');
    //     this.$store.commit('refreshFreets');

    //     params.callback();
    //   } catch (e) {
    //     this.$set(this.alerts, e, 'error');
    //     setTimeout(() => this.$delete(this.alerts, e), 3000);
    //   }
    // }
  }
  // components: {
  //   // ToggleButton
  // }
};
</script>

