<!-- Default page that also displays freets -->

<template>
  <main>
    <section v-if="$store.state.username && $store.state.credibility > 5"> 
      <header>
        <h2>Welcome @{{ $store.state.username }}</h2>
      </header>
      <CreateFreetForm />
    </section>
    <section>
      <header>
        <div class="left">
          <h2>
            Check out who else is on Fritter
          </h2>
          <FollowComponent
          v-for="username in ['howdy', 'heyooo']"
          :username="username"
        />
        </div>
        <div class="right">
        </div>
      </header>
      <header>
        <div class="left">
          <h2>
            Viewing freets from accounts you're following
            <span v-if="$store.state.filter">
              by @{{ $store.state.filter }}
            </span>
          </h2>
        </div>
        <div class="right">
        </div>
      </header>
      <section
        v-if="$store.state.freets.length"
      >
        <FreetComponent
          v-for="freet in followedFreets"
          :key="freet.id"
          :freet="freet"

        />
      </section>
      <article
        v-else
      >
        <h3>No freets found.</h3>
      </article>
    </section>
  </main>
</template>

<script>
import FollowComponent from '@/components/Follow/FollowComponent.vue';
import FreetComponent from '@/components/Freet/FreetComponent.vue';
import CreateFreetForm from '@/components/Freet/CreateFreetForm.vue';
import GetFreetsForm from '@/components/Freet/GetFreetsForm.vue';

export default {
  name: 'FreetPage',
  components: {FollowComponent, FreetComponent, GetFreetsForm, CreateFreetForm}, 
  computed: {
    followedFreets() {
      const allFollows = this.$store.state.follows;
      console.log('allFollows:', allFollows);
      const myFollows = allFollows.filter(f => f.follower == this.$store.state.username);
      console.log('myfollows:', myFollows);
      let isFollowing = []
      for (const follow of myFollows){ //get everyone they are following
        isFollowing.push(follow.followed);
      }
      console.log('isFollowing:', isFollowing);
      return this.$store.state.freets.filter(f => isFollowing.includes(f.author));
    }
  },

  mounted() {
    this.$refs.getFreetsForm.submit();
  }
};
</script>

<style scoped>
section {
  display: flex;
  flex-direction: column;
}

header, header > * {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

button {
    margin-right: 10px;
}

section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}
</style>
