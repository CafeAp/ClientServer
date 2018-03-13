import { mapGetters } from 'vuex'
import utils from '@/assets/utils'

export default {
  name: 'edit-goods',
  data() {
    return {
      newGoods: {
        name: null,
        category: null,
        price: 0,
        image: null,
        isWeighted: false
      },
      categories: null
    }
  },
  computed: {
    ...mapGetters({
      alertMessage: 'alertMessage'
    }),
    validForm() {
      return !!this.newGoods.name
    },
    isNew() {
      return this.$route.params.id === undefined
    }
  },
  mounted() {
    this.$http.get('api/categories/list').then(resp => {
      this.categories = resp.body
    })
    if (!this.isNew) {
      this.$http.get('api/goods/get', {params: {id: this.$route.params.id}}).then(resp => {
        this.$set(this, 'newGoods', resp.body)
      })
    }
  },
  methods: {
    saveGoods() {
      console.error(this.newGoods)
      this.$http.post(`api/goods/${this.isNew ? 'add' : 'edit'}`, this.newGoods).then(resp => {
        this.$store.dispatch('setAlertMessageForTime', 'success')
        setTimeout(() => {
          this.$router.push('/goods')
        }, 500)
      }, () => {
        this.$store.dispatch('setAlertMessageForTime', 'error')
      })
    },
    loadImage: function (e) {
      utils.loadImage(e, e => {
        this.newGoods.image = e.target.result
      })
    }
  }
}
