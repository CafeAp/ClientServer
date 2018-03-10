import _sumBy from 'lodash/sumBy'
export default {
  name: 'supplies',
  data () {
    return {
      supplies: []
    }
  },
  created () {
    this.$http.get('api/supplies/list').then(resp => {
      this.supplies = resp.body
    })
  },
  methods: {
    _sumBy,
    editSupply(supply, i) {
      this.$router.push(`/edit_supply/${supply.id}`)
    },
    deleteSupply(supply, i) {
      this.$http.delete('api/supplies/delete', {params: {id: supply.id}}).then(resp => {
        this.supplies.splice(i, 1)
      })
    },
    getConcreteSupplyItem(supplyItem) {
      return supplyItem.ingredient || supplyItem.goods
    }
  }
}
