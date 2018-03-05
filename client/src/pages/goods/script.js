export default {
  name: 'goods',
  data () {
    return {
      goods: []
    }
  },
  created () {
    this.$http.get('api/goods/list').then(resp => {
      this.goods = resp.body
    })
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
