export default {
  name: 'ingredients',
  data () {
    return {
      ingredients: []
    }
  },
  created () {
    this.$http.get('api/ingredients/list').then(resp => {
      this.ingredients = resp.body
    })
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
