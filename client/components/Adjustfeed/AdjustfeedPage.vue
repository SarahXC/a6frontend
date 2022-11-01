<!-- Page for account sign-in and registration -->
<!-- User should be NOT authenticated in order to see this page -->

<template>
  <main>
    <section>
      <header>
        <h2>Set Your Feed</h2>
      </header>
      <CreateAdjustfeedForm />
      <!-- <toggle-button :value="true"
                    :labels="{checked: 'Yes', unchecked: 'No'}"/> -->
          </section>
  </main>
</template>

<script>
import CreateAdjustfeedForm from '@/components/Adjustfeed/CreateAdjustfeedForm.vue';
// import { ToggleButton } from 'vue-js-toggle-button'

export default {
  name: 'AdjustfeedPage',
  components: {
    CreateAdjustfeedForm,
    // ToggleButton
  }
};
</script>

