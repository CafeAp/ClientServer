import contentHeader from '@/components/header/bundle'

export default {
  name: 'table-header',
  components: {contentHeader},
  data() {
    return {
      table: null
    }
  },
  created() {
    this.$http.get('api/tables/get', {params: {id: this.$route.params.tableId}}).then(resp => {
      this.table = resp.body
    })
  },
  computed: {
    isNew() {
      return this.$route.params.id === undefined
    }
  }
}
