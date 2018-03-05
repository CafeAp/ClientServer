import { mapGetters } from 'vuex'
import newTechCardIngredientTPL from '@/assets/model_templates/new_tech_card_ingredient.tpl.js'
import _cloneDeep from 'lodash/cloneDeep'
import _sumBy from 'lodash/sumBy'
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
      extraPrice: 0
    }
  },
  created() {
    this.$http.get('api/ingredients/list').then(resp => {
      this.ingredients = resp.body
    })
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
    }
  },
  mounted() {
    if (!this.isNew) {
      this.$http.get('api/tech_cards/get', {params: {id: this.$route.params.id}}).then(resp => {
        this.$set(this, 'newTechCard', resp.body)
      })
    }
  },
  methods: {
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
    }
  }
}
