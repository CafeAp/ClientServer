import utils from '@/assets/utils'
import _sumBy from 'lodash/sumBy'
import _sum from 'lodash/sum'
import DatePicker from 'vue2-datepicker'
import moment from 'moment'

export default {
  name: 'report',
  components: { DatePicker },
  data: function () {
    return {
      lineChartWidth: 0,
      todayOrders: null,
      monthOrders: null,
      dateRange: null
    }
  },
  created: function () {
    this.dateRange = [moment().subtract(1, 'months'), moment()]
    this.$http.get('api/orders/today/list').then(resp => {
      this.todayOrders = resp.body
    })
  },
  mounted: function () {
    this.lineChartWidth = this.$el.clientWidth
  },
  computed: {
    todayProceeds: function () {
      return this.getProceeds(this.todayOrders)
    },
    todayCosts: function () {
      return this.getCosts(this.todayOrders)
    },
    todayProfit: function () {
      return this.todayProceeds - this.todayCosts
    },
    todayChecks: function () {
      return this.todayOrders.length
    },
    monthProceeds: function () {
      return this.getProceeds(this.monthOrders)
    },
    monthCosts: function () {
      return this.getCosts(this.monthOrders)
    },
    monthProfit: function () {
      return this.monthProceeds - this.monthCosts
    },
    monthChecks: function () {
      return this.monthOrders.length
    },
    averageCheck: function () {
      return this.todayProceeds / this.todayChecks
    },
    formattedMonthLabels: function () {
      return this.monthOrders.map(d => moment(d.createdAt).format('DD-MM-YYYY'))
    },
    dataForLineChart: function () {
      return this.monthOrders.map(d => this.getProceeds([d]))
    },
    dataLabelForLineChart: function () {
      return 'Прибыль'
    }
  },
  methods: {
    formatDate: utils.formatDate,
    updateSelectedRangeChecks() {
      this.$http.get('api/orders/list', {params: {dateRange: this.dateRange.map(d => d.toISOString())}}).then(resp => {
        this.monthOrders = resp.body
      })
    },
    getProceeds(orders) {
      return _sum(orders.map(order => {
        return _sumBy(order.orderItems, orderItem => {
          return orderItem.price * orderItem.amount
        })
      }))
    },
    getCosts(orders) {
      return _sum(orders.map(order => {
        return _sumBy(order.orderItems, orderItem => {
          return orderItem.selfPrice * orderItem.amount
        })
      }))
    }
  },
  watch: {
    dateRange: function () {
      this.updateSelectedRangeChecks()
    }
  }
}
