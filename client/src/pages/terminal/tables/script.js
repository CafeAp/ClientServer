import {mapGetters} from 'vuex'
import _cloneDeep from 'lodash/cloneDeep'

export default {
  name: 'terminal-tables',
  data() {
    return {
      room: null
    }
  },
  mounted() {
    this.$http.get('api/rooms/list').then(resp => {
      this.room = resp.body[0]
    })
  },
  computed: {
    ...mapGetters({
      alertMessage: 'alertMessage'
    })
  },
  methods: {
    getTablesWrapperSize() {
      let $wrapper = this.$el.querySelector('.room')
      return {
        width: $wrapper.clientWidth,
        height: $wrapper.clientHeight
      }
    },
    getTableStyles(table) {
      let wrapperSize = this.getTablesWrapperSize()
      return {
        left: `${wrapperSize.width * table.x / 800}px`,
        top: `${wrapperSize.height * table.y / 500}px`,
        width: `${wrapperSize.width * table.width / 800}px`,
        height: `${wrapperSize.height * table.height / 500}px`
      }
    },
    openTable(table) {
      if (table.status === 'opened') {
        this.$router.push(`/terminal/table/${table.id}`)
        return false
      }
      let clone = _cloneDeep(table)
      clone.status = 'opened'
      clone.activeOrder = {}
      this.$http.post('api/tables/edit', clone).then(resp => {
        this.$router.push(`/terminal/table/${table.id}`)
      })
    }
  }
}
