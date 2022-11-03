<!-- Form for creating freets (block style) -->

<script>
import ToggleForm from '@/components/common/ToggleForm.vue';
// import ToggleButton from 'vue-js-toggle-button'
// Vue.use(ToggleButton)

export default {
  name: 'CreateAdjustfeedForm',
  mixins: [ToggleForm],
  data() {
    return {
      url: '/api/adjustfeeds',
      method: 'PUT',
      hasBody: true,
      fields: [
        {id: 'politics', label: 'Politics', value: ''}, 
        {id: 'entertainment', label: 'Entertainment', value: ''}, 
        {id: 'sports', label: 'Sports', value: ''},
        {id: 'news', label: 'News', value: ''}
      ],
      title: 'What content would you like to include?',
      buttonText: 'set',
      refreshCategories: true,
      callback: () => {
        const message = 'Successfully set your feed!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
