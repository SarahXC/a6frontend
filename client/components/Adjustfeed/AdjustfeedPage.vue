<!-- Page for account sign-in and registration -->
<!-- User should be NOT authenticated in order to see this page -->

<template>
  <main>
    <section>
      <header>
        <h2>Set Your Feed</h2>
      </header>
      <CreateAdjustfeedForm />
    </section>
  </main>
</template>

<script>
import CreateAdjustfeedForm from '@/components/Adjustfeed/CreateAdjustfeedForm.vue';

export default {
  name: 'AdjustfeedPage',
  components: {
    CreateAdjustfeedForm,
  }
};
</script>
