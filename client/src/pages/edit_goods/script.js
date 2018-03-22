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
      let formData = new FormData(document.forms.goods)
      if (this.newGoods.category) formData.append('category', JSON.stringify(this.newGoods.category))
      if (this.newGoods.id !== undefined) formData.append('id', this.newGoods.id)
      this.$http.post(`api/goods/${this.isNew ? 'add' : 'edit'}`, formData).then(resp => {
        this.$store.dispatch('setAlertMessageForTime', 'success')
        setTimeout(() => {
          this.$router.push('/goods')
        }, 500)
      }, () => {
        this.$store.dispatch('setAlertMessageForTime', 'error')
      })
    }
  }
}
