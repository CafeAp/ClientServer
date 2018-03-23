import utils from '@/assets/utils'
import _sumBy from 'lodash/sumBy'
import _sum from 'lodash/sum'
import _groupBy from 'lodash/groupBy'
import _map from 'lodash/map'
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
      dateRange: null,
      activeMonthNavItem: null,
      needRenderLine: true
    }
  },
  created: function () {
    this.activeMonthNavItem = this.monthNavItems[0]
    this.dateRange = [moment().subtract(1, 'months'), moment()]
    this.$http.get('api/orders/today/list').then(resp => {
      this.todayOrders = resp.body
    })
  },
  mounted: function () {
    this.lineChartWidth = this.$el.querySelector('.line-chart').clientWidth
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
    todayAverageCheck: function () {
      return this.todayProceeds / this.todayChecks
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
    monthAverageCheck: function () {
      return this.monthProceeds / this.monthChecks
    },
    formattedMonthLabels: function () {
      return Object.keys(this.rangeOrdersGroupedByDay)
    },
    rangeOrdersGroupedByDay: function () {
      return _groupBy(this.monthOrders, val => moment(val.createdAt).format('DD-MM-YYYY'))
    },
    dataForLineChart: function () {
      let methods = {
        proceeds: orders => _map(orders, (val, key) => this.getProceeds(val)),
        profit: orders => _map(orders, (val, key) => this.getProceeds(val) - this.getCosts(val)),
        checks: orders => _map(orders, (val, key) => val.length),
        averageCheck: orders => _map(orders, (val, key) => this.getProceeds(val) / val.length)
      }
      return methods[this.activeMonthNavItem.name](this.rangeOrdersGroupedByDay)
    },
    monthNavItems: function () {
      return [
        {displayName: 'Выручка', name: 'proceeds', getValue: () => `${this.monthProceeds}руб`},
        {displayName: 'Прибыль', name: 'profit', getValue: () => `${this.monthProfit}руб`},
        {displayName: 'Чеков', name: 'checks', getValue: () => this.monthChecks},
        {displayName: 'Средний чек', name: 'averageCheck', getValue: () => `${this.monthAverageCheck}руб`}
      ]
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
    },
    changeActiveMonthNavItem(navItem) {
      this.activeMonthNavItem = navItem
      this.refreshLine()
    },
    refreshLine: function () {
      this.needRenderLine = false
      this.$nextTick(() => {
        this.needRenderLine = true
      })
    }
  },
  watch: {
    dateRange: function () {
      this.updateSelectedRangeChecks()
    }
  }
}
