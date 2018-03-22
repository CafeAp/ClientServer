import { mapGetters } from 'vuex'

export default {
  name: 'edit-ingredient',
  data() {
    return {
      newIngredient: {
        name: null,
        measure: 'кг',
        lostClean: 0,
        lostBoil: 0,
        lostFry: 0,
        lostStew: 0,
        lostBake: 0
      }
    }
  },
  computed: {
    ...mapGetters({
      alertMessage: 'alertMessage'
    }),
    validForm() {
      return !!this.newIngredient.name
    },
    isNew() {
      return this.$route.params.id === undefined
    }
  },
  mounted() {
    if (!this.isNew) {
      this.$http.get('api/ingredients/get', {params: {id: this.$route.params.id}}).then(resp => {
        this.$set(this, 'newIngredient', resp.body)
      })
    }
  },
  methods: {
    saveIngredient() {
      this.$http.post(`api/ingredients/${this.isNew ? 'add' : 'edit'}`, this.newIngredient).then(resp => {
        this.$store.dispatch('setAlertMessageForTime', 'success')
        setTimeout(() => {
          this.$router.push('/ingredients')
        }, 500)
      }, () => {
        this.$store.dispatch('setAlertMessageForTime', 'error')
      })
    }
  }
}
