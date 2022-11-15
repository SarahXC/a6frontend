<!-- Form for creating freets (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'CreateFreetForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/freets',
      method: 'POST',
      hasBody: true,
      fields: [
        {id: 'content', label: 'Content', value: ''},
        {id: 'category', label: 'Category (politics/entertainment/sports/news)', value: ''} 
      ],
      // categories: [
      // {id: 'bleh', items: ['hi', 'bye']},
      // ]
      title: 'Create a freet',
      //TODO: implement checkCategory: true, 
      buttonText: 'post',
      refreshFreets: true,
      checkCategory: true, //checks that it's a valid category
      callback: () => {
        const message = 'Successfully created a freet!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);

      }
    };
  }
};
</script>
