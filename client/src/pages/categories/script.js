import _cloneDeep from 'lodash/cloneDeep'

export default {
  name: 'categories',
  data () {
    return {
      categories: [],
      expandedCategories: []
    }
  },
  created () {
    this.updateCategoriesTree()
  },
  computed: {
    sortedCategories() {
      let sortedCategories = _cloneDeep(this.categories)
      this.categories.forEach(c => {
        this.insertSubCategories(c, sortedCategories)
      })
      return sortedCategories
    }
  },
  methods: {
    updateCategoriesTree() {
      this.$http.get('api/categories/tree').then(resp => {
        this.categories = resp.body
      })
    },
    insertSubCategories(category, sortedCategories, parentLevel) {
      let level = parentLevel !== undefined ? parentLevel + 1 : 0
      if (category.parentCategory) {
        let parentIndex = sortedCategories.findIndex(c => c.id === category.parentCategory.id)
        sortedCategories.splice(parentIndex + 1, 0, {
          ...category,
          level
        })
      }
      if (category.subCategories) {
        category.subCategories.forEach(c => {
          this.insertSubCategories(c, sortedCategories, level)
        })
      }
    },
    editCategory(category, i) {
      this.$router.push(`/edit_category/${category.id}`)
    },
    deleteCategory(categories, i) {
      this.$http.delete('api/categories/delete', {params: {id: categories.id}}).then(resp => {
        this.updateCategoriesTree()
      })
    },
    toggleCategory(category) {
      let index = this.expandedCategories.indexOf(category)
      index === -1 ? this.expandedCategories.push(category) : this.expandedCategories.splice(index, 1)
    },
    getIndentersCount(category) {
      return category.level || 0
    }
  }
}
