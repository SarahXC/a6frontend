<!-- Form for creating freets (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'CreateAdjustfeedForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/adjustfeeds',
      method: 'POST',
      hasBody: true,
      fields: [
        {id: 'politics', label: 'Politics', value: ''} 
        {id: 'entertainment', label: 'Entertainment', value: ''} 
        {id: 'sports', label: 'Sports', value: ''} 
        {id: 'news', label: 'News', value: ''} 
      ],
      title: 'What content would you like to include?',
      refreshFreets: true,
      callback: () => {
        const message = 'Successfully set your feed!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
