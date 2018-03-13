import { mapGetters } from 'vuex'
import utils from '@/assets/utils'
import _cloneDeep from 'lodash/cloneDeep'

export default {
  name: 'edit-category',
  data() {
    return {
      newCategory: {
        name: null,
        parentCategory: null
      },
      categories: null,
      filteredCategories: null
    }
  },
  computed: {
    ...mapGetters({
      alertMessage: 'alertMessage'
    }),
    validForm() {
      return !!this.newCategory.name
    },
    isNew() {
      return this.$route.params.id === undefined
    }
  },
  mounted() {
    this.$http.get('api/categories/list').then(resp => {
      this.categories = resp.body
      if (!this.isNew) {
        this.$http.get('api/categories/get', {params: {id: this.$route.params.id}}).then(resp => {
          this.$set(this, 'newCategory', resp.body)
          this.newCategory.parentCategory = resp.body.parentCategory ? this.categories.find(c => c.id == resp.body.parentCategory.id) : null
          this.filteredCategories = this.filterCategories()
        })
      } else {
        this.filteredCategories = this.filterCategories()
      }
    })
  },
  methods: {
    filterCategories() {
      let result = _cloneDeep(this.categories)
      if (!this.isNew && this.newCategory.id !== undefined) {
        this.removeSubCategories(this.newCategory, result)
        result.splice(result.findIndex(c => c.id === this.newCategory.id), 1)
      }
      return result
    },
    removeSubCategories(category, result) {
      if (category.subCategories) {
        category.subCategories.forEach(subCategory => {
          result.splice(result.findIndex(c => c.id === subCategory.id), 1)
          this.removeSubCategories(subCategory, result)
        })
      }
    },
    removeParentCategories(category, result) {
      if (!category.parentCategory) return false
      let parentIndex = result.findIndex(c => c.id === category.parentCategory.id)
      this.removeParentCategories(result[parentIndex], result)
      result.splice(parentIndex, 1)
    },
    saveCategory() {
      this.$http.post(`api/categories/${this.isNew ? 'add' : 'edit'}`, this.newCategory).then(resp => {
        this.$store.dispatch('setAlertMessageForTime', 'success')
        setTimeout(() => {
          this.$router.push('/categories')
        }, 500)
      }, () => {
        this.$store.dispatch('setAlertMessageForTime', 'error')
      })
    },
    loadImage: function (e) {
      utils.loadImage(e, e => {
        this.newCategory.image = e.target.result
      })
    }
  }
}
