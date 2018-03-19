import { mapGetters } from 'vuex'
import newTechCardIngredientTPL from '@/assets/model_templates/new_tech_card_ingredient.tpl.js'
import _cloneDeep from 'lodash/cloneDeep'
import _sumBy from 'lodash/sumBy'
import _sum from 'lodash/sum'
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
      return !!this.newTechCard.name
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
        this.extraPrice = (resp.body.price / _sumBy(resp.body.techCardIngredients, d => d.ingredient.averagePrice * d.grossWeight) - 1) * 100
      })
    }
  },
  methods: {
    _sum,
    saveTechCard() {
      this.$http.post(`api/tech_cards/${this.isNew ? 'add' : 'edit'}`, this.newTechCard).then(resp => {
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
    loadImage: function (e) {
      utils.loadImage(e, e => {
        this.newTechCard.image = e.target.result
      })
    },
    changeNetWeight: function (e, techCardIngredient) {
      techCardIngredient.netWeight = techCardIngredient.grossWeight
    },
    getIngredientPrice: function (techCardIngredient) {
      if (techCardIngredient.ingredient.id === null) return 0
      return Math.ceil(techCardIngredient.ingredient.averagePrice * techCardIngredient.grossWeight)
    },
    calcTotalPrice: function () {
      this.newTechCard.price = this.selfPrice + Math.ceil(this.selfPrice * (this.extraPrice * 0.01))
    },
    calcExtraPrice: function () {
      this.extraPrice = Math.round((this.newTechCard.price / this.selfPrice - 1) * 100)
    }
  },
  watch: {
    'newTechCard.techCardIngredients': {
      handler: function () {
        this.calcTotalPrice()
      },
      deep: true
    }
  }
}
