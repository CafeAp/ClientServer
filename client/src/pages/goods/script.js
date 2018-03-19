export default {
  name: 'goods',
  data () {
    return {
      goods: [],
      warehouse: null
    }
  },
  created () {
    this.$http.get('api/goods/list').then(resp => {
      this.goods = resp.body
    })
    this.$http.get('api/warehouse/get').then(resp => {
      this.warehouse = resp.body
    })
  },
  computed: {
    warehouseMap: function () {
      let obj = {}
      this.warehouse.warehouseItems.forEach(warehouseItem => {
        if (warehouseItem.type === 'goods') obj[warehouseItem.name] = warehouseItem
      })
      return obj
    }
  },
  methods: {
    editGoods(goods, i) {
      this.$router.push(`/edit_goods/${goods.id}`)
    },
    deleteGoods(goods, i) {
      this.$http.delete('api/goods/delete', {params: {id: goods.id}}).then(resp => {
        this.goods.splice(i, 1)
      })
    }
  }
}
