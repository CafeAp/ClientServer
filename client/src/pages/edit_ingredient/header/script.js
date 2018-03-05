import contentHeader from '@/components/header/bundle'

export default {
  name: 'edit-ingredient-header',
  components: {contentHeader},
  computed: {
    isNew() {
      return this.$route.params.id === undefined
    }
  }
}
