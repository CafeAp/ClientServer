import contentHeader from '@/components/header/bundle'

export default {
  name: 'table-header',
  components: {contentHeader},
  computed: {
    isNew() {
      return this.$route.params.id === undefined
    }
  }
}
