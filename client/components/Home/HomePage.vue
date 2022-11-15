<!-- Default page that also displays freets -->

<template>
    <main>
      <section v-if="$store.state.username && $store.state.credibility > 5"> 
        <header>
          <h2>Welcome @{{ $store.state.username }}</h2>
        </header>
        <CreateFreetForm />
      </section>
      <section v-else-if="$store.state.username"> 
        <header>
          <h2>Welcome @{{ $store.state.username }}</h2>
        </header>
        <img src= "@/components/Home/sadface.jpeg" alt="sad face">
        <h4> You do not have enough Fritter points to post content yet. Earn Fritter points by gaining followers! </h4>
      </section>
      <section v-else>
        <header>
          <h2>Welcome to Fritter!</h2>
        </header>
        <article>
          <h3>
            <router-link to="/login">
              Sign in
            </router-link>
            to create and delete freets.
          </h3>
        </article>
        <!-- <CreateFreetForm /> -->
      </section>
    </main>
  </template>
  
  <script>
//   import FreetComponent from '@/components/Freet/FreetComponent.vue';
  import CreateFreetForm from '@/components/Freet/CreateFreetForm.vue';
  import GetFreetsForm from '@/components/Freet/GetFreetsForm.vue';
  
  export default {
    name: 'HomePage',
    components: {CreateFreetForm, GetFreetsForm},
    // components: {FreetComponent, GetFreetsForm, CreateFreetForm}, 
    computed: {
      showedFreets() {
        return this.$store.getters.getFreetsInCategories;
      }
    },
  
    // mounted() {
    //   this.$refs.getFreetsForm.submit();
    // }
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
  