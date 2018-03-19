import utils from '@/assets/utils'
import _cloneDeep from 'lodash/cloneDeep'
import _keyBy from 'lodash/keyBy'

export default {
  name: 'orders',
  data () {
    return {
      orders: [],
      tables: []
    }
  },
  created () {
    this.$http.get('api/tables/list').then(resp => {
      this.tables = resp.body
    })
    this.$http.get('api/orders/list').then(resp => {
      this.orders = resp.body
    })
  },
  computed: {
    freeTables: function () {
      return this.tables.filter(t => t.status !== 'opened')
    },
    tableOrdersMap: function () {
      return _keyBy(this.tables, 'activeOrder.id')
    }
  },
  methods: {
    formatDate: utils.formatDate,
    bindToTable(order, table) {
      let clone = _cloneDeep(table)
      clone.status = 'opened'
      clone.activeOrder = order
      this.$http.post('api/tables/edit', clone).then(resp => {
        this.$router.push(`terminal/table/${table.id}`)
      })
    }
  }
}
