import { mapGetters } from 'vuex'
import newTechCardIngredientTPL from '@/assets/model_templates/new_tech_card_ingredient.tpl.js'
import _cloneDeep from 'lodash/cloneDeep'
import _sumBy from 'lodash/sumBy'
import _sum from 'lodash/sum'
import _capitalize from 'lodash/capitalize'
import _max from 'lodash/max'
import _every from 'lodash/every'
import utils from '@/assets/utils'

export default {
  name: 'edit-tech-card',
  data() {
    return {
      ingredients: null,
      newTechCard: {
        name: null,
        category: null,
        image: null,
        price: 0,
        techCardIngredients: []
      },
      extraPrice: 0,
      warehouse: null,
      categories: null
    }
  },
  computed: {
    ...mapGetters({
      alertMessage: 'alertMessage'
    }),
    validForm() {
      return !!this.newTechCard.name && this.newTechCard.techCardIngredients.length !== 0 && _every(this.newTechCard.techCardIngredients, d => d.ingredient.id !== null)
    },
    isNew() {
      return this.$route.params.id === undefined
    },
    exitWeight() {
      return _sumBy(this.newTechCard.techCardIngredients, 'netWeight')
    },
    selfPrice() {
      return _sum(this.newTechCard.techCardIngredients.map(d => this.getIngredientPrice(d)))
    }
  },
  created() {
    this.$http.get('api/categories/list').then(resp => {
      this.categories = resp.body
    })
    this.$http.get('api/ingredients/list').then(resp => {
      this.ingredients = resp.body
    })
    this.$http.get('api/warehouse/get', {params: {id: this.$route.params.id}}).then(resp => {
      this.warehouse = resp.body
    })
    if (!this.isNew) {
      this.$http.get('api/tech_cards/get', {params: {id: this.$route.params.id}}).then(resp => {
        this.$set(this, 'newTechCard', resp.body)
        this.calcExtraPrice()
      })
    }
  },
  methods: {
    _sum,
    saveTechCard() {
      let formData = new FormData(document.forms.techCard)
      if (this.newTechCard.id !== undefined) formData.append('id', this.newTechCard.id)
      if (this.newTechCard.category) formData.append('category', JSON.stringify(this.newTechCard.category))
      formData.append('price', this.newTechCard.price)
      formData.append('techCardIngredients', JSON.stringify(this.newTechCard.techCardIngredients))
      this.$http.post(`api/tech_cards/${this.isNew ? 'add' : 'edit'}`, formData).then(resp => {
        this.$store.dispatch('setAlertMessageForTime', 'success')
        setTimeout(() => {
          this.$router.push('/tech_cards')
        }, 500)
      }, () => {
        this.$store.dispatch('setAlertMessageForTime', 'error')
      })
    },
    addNewIngredient() {
      let newTechCardIngredient = _cloneDeep(newTechCardIngredientTPL)
      this.newTechCard.techCardIngredients.push(newTechCardIngredient)
    },
    changeNetWeight: function (e, techCardIngredient) {
      techCardIngredient.netWeight = techCardIngredient.grossWeight - techCardIngredient.grossWeight * this.getNumberOfLosses(techCardIngredient) * 0.01
    },
    changeGrossWeight: function (e, techCardIngredient) {
      techCardIngredient.grossWeight = techCardIngredient.netWeight + techCardIngredient.netWeight * this.getNumberOfLosses(techCardIngredient) * 0.01
    },
    getNumberOfLosses: function (techCardIngredient) {
      let lossesNumber = 0,
        maxLoss
      if (techCardIngredient.cookingMethods.includes('clean')) lossesNumber += techCardIngredient.ingredient.lostClean
      maxLoss = _max(techCardIngredient.cookingMethods.filter(c => c !== 'clean').map(c => techCardIngredient.ingredient[`lost${_capitalize(c)}`]))
      lossesNumber += maxLoss || 0
      return lossesNumber
    },
    getIngredientPrice: function (techCardIngredient) {
      if (techCardIngredient.ingredient.id === null) return 0
      return Math.round(techCardIngredient.ingredient.averagePrice * techCardIngredient.grossWeight / 1000 * 100) / 100
    },
    calcTotalPrice: function () {
      this.newTechCard.price = this.selfPrice + Math.round(this.selfPrice * (this.extraPrice * 0.01) * 100) / 100
    },
    calcExtraPrice: function () {
      this.extraPrice = Math.round((this.newTechCard.price / this.selfPrice - 1) * 100 * 100) / 100
    },
    deleteTechCardIngredient: function (i) {
      this.newTechCard.techCardIngredients.splice(i, 1)
    },
    setZeroIfEmpty: function (e, object, modelName) {
      if (!object[modelName]) object[modelName] = 0
    }
  },
  watch: {
    'newTechCard.techCardIngredients': {
      handler: function () {
        this.calcExtraPrice()
      },
      deep: true
    }
  }
}
