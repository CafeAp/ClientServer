export default {
  name: 'ingredients',
  data () {
    return {
      ingredients: [],
      warehouse: null
    }
  },
  created () {
    this.$http.get('api/ingredients/list').then(resp => {
      this.ingredients = resp.body
    })
    this.$http.get('api/warehouse/get').then(resp => {
      this.warehouse = resp.body
    })
  },
  computed: {
    warehouseMap: function () {
      let obj = {}
      this.warehouse.warehouseItems.forEach(warehouseItem => {
        if (warehouseItem.type === 'ingredient') obj[warehouseItem.name] = warehouseItem
      })
      return obj
    }
  },
  methods: {
    editIngredient(ingredient, i) {
      this.$router.push(`/edit_ingredient/${ingredient.id}`)
    },
    deleteIngredient(ingredient, i) {
      this.$http.delete('api/ingredients/delete', {params: {id: ingredient.id}}).then(resp => {
        this.ingredients.splice(i, 1)
      })
    }
  }
}
