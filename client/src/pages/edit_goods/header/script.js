import contentHeader from '@/components/header/bundle'

export default {
  name: 'edit-goods-header',
  components: {contentHeader},
  computed: {
    isNew() {
      return this.$route.params.id === undefined
    }
  }
}
