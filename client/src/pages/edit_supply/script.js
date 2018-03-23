import { mapGetters } from 'vuex'
import DatePicker from 'vue2-datepicker'
import _cloneDeep from 'lodash/cloneDeep'
import _concat from 'lodash/concat'
import _sumBy from 'lodash/sumBy'
import _isEqual from 'lodash/isEqual'
import _every from 'lodash/every'
import newSupplyItemTPL from '@/assets/model_templates/new_supply_item.tpl.js'

export default {
  name: 'edit-supply',
  components: { DatePicker },
  data() {
    return {
      concreteSupplyItems: [],
      newSupply: {
        date: null,
        supplyItems: []
      }
    }
  },
  computed: {
    ...mapGetters({
      alertMessage: 'alertMessage'
    }),
    validForm() {
      return this.newSupply.supplyItems.length !== 0 && _every(this.newSupply.supplyItems, d => !!d.concreteSupplyItem.type)
    },
    isNew() {
      return this.$route.params.id === undefined
    }
  },
  mounted() {
    this.newSupply.date = Date.now()
    this.$http.get('api/ingredients/list').then(resp => {
      this.concreteSupplyItems = _concat(this.concreteSupplyItems, resp.body.map(d => {
        return {
          type: 'ingredient',
          value: d
        }
      }))
    })
    this.$http.get('api/goods/list').then(resp => {
      this.concreteSupplyItems = _concat(this.concreteSupplyItems, resp.body.map(d => {
        return {
          type: 'goods',
          value: d
        }
      }))
    })
    if (!this.isNew) {
      this.$http.get('api/supplies/get', {params: {id: this.$route.params.id}}).then(resp => {
        let data = _cloneDeep(resp.body)
        data.supplyItems = data.supplyItems.map(d => {
          return {
            ...d,
            concreteSupplyItem: {
              type: d.ingredient ? 'ingredient' : 'goods',
              value: d.ingredient || d.goods
            }
          }
        })
        this.$set(this, 'newSupply', data)
      })
    }
  },
  methods: {
    _isEqual,
    saveSupply() {
      let body = _cloneDeep(this.newSupply)
      body.supplyItems = body.supplyItems.map(supplyItem => {
        supplyItem[supplyItem.concreteSupplyItem.type] = supplyItem.concreteSupplyItem.value
        delete supplyItem.concreteSupplyItem
        return supplyItem
      })
      this.$http.post(`api/supplies/${this.isNew ? 'add' : 'edit'}`, body).then(resp => {
        this.$store.dispatch('setAlertMessageForTime', 'success')
        setTimeout(() => {
          this.$router.push('/supplies')
        }, 500)
      }, () => {
        this.$store.dispatch('setAlertMessageForTime', 'error')
      })
    },
    addNewSupplyItem() {
      let newSupplyItem = _cloneDeep(newSupplyItemTPL)
      this.newSupply.supplyItems.push(newSupplyItem)
    },
    recalcTotalPrice(supplyItem) {
      supplyItem.totalPrice = supplyItem.priceForOne * supplyItem.amount
    },
    recalcPriceForOne(supplyItem) {
      supplyItem.priceForOne = supplyItem.totalPrice / supplyItem.amount
    },
    deleteSupplyItem: function (i) {
      this.newSupply.supplyItems.splice(i, 1)
    }
  }
}
