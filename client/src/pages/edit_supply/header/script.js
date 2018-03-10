import contentHeader from '@/components/header/bundle'

export default {
  name: 'edit-supply-header',
  components: {contentHeader},
  computed: {
    isNew() {
      return this.$route.params.id === undefined
    }
  }
}
