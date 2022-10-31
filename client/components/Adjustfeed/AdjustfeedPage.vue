<!-- Page for account sign-in and registration -->
<!-- User should be NOT authenticated in order to see this page -->

<template>
  <main>
    <section>
      <header>
        <h2>Set Your Feed</h2>
      </header>
      <AdjustfeedForm />
    </section>
  </main>
</template>

<script>
import AdjustfeedForm from '@/components/Adjustfeed/AdjustfeedForm.vue';

export default {
  name: 'AdjustfeedPage',
  components: {
    AdjustfeedForm,
  }
};
</script>
