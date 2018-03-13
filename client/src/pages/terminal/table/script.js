import {mapGetters} from 'vuex'
import _cloneDeep from 'lodash/cloneDeep'
import _last from 'lodash/last'
import _debounce from 'lodash/debounce'
import _sortBy from 'lodash/sortBy'
import _sumBy from 'lodash/sumBy'
import category from '@/pages/terminal/table/category/bundle'

export default {
  name: 'table-order',
  components: { category },
  data() {
    return {
      table: null,
      categories: null,
      techCards: null,
      goods: null,
      currentCategories: null,
      breadcrumbs: []
    }
  },
  mounted() {
    this.$http.get('api/tech_cards/list').then(resp => {
      this.techCards = resp.body
    })
    this.$http.get('api/goods/list').then(resp => {
      this.goods = resp.body
    })
    this.$http.get('api/categories/tree').then(resp => {
      this.categories = resp.body
      this.currentCategories = this.categories
    })
    this.$http.get('api/tables/get', {params: {id: this.tableId}}).then(resp => {
      this.table = resp.body
    })
  },
  computed: {
    ...mapGetters({
      alertMessage: 'alertMessage'
    }),
    tableId: function () {
      return this.$route.params.tableId
    },
    parentCategory: function () {
      return _last(this.breadcrumbs)
    }
  },
  methods: {
    _last,
    _sortBy,
    _sumBy,
    getTechCardsByCategory(category) {
      if (!this.techCards) return []
      return this.techCards.filter(d => category ? d.category && d.category.id === category.id : !d.category)
    },
    getGoodsByCategory(category) {
      if (!this.goods) return []
      return this.goods.filter(d => category ? d.category && d.category.id === category.id : !d.category)
    },
    showSubCategories(category) {
      this.currentCategories = category.subCategories
      this.breadcrumbs.push(category)
    },
    handleBreadcrumbClick(breadcrumb, i) {
      this.currentCategories = breadcrumb.subCategories
      this.breadcrumbs = this.breadcrumbs.slice(0, i + 1)
    },
    handleHomeBreadcrumbClick() {
      this.currentCategories = this.categories
      this.breadcrumbs = []
    },
    addGoodsToOrder(goods) {
      let sameOrderItem = this.table.activeOrder.orderItems.find(d => d.goods && d.goods.id === goods.id)
      if (sameOrderItem) {
        this.increaseOrderItemAmount(sameOrderItem)
        return false
      }
      this.table.activeOrder.orderItems.push({goods, amount: 1})
      this.sendUpdateTableReq()
    },
    addTechCardToOrder(techCard) {
      let sameOrderItem = this.table.activeOrder.orderItems.find(d => d.techCard && d.techCard.id === techCard.id)
      if (sameOrderItem) {
        this.increaseOrderItemAmount(sameOrderItem)
        return false
      }
      this.table.activeOrder.orderItems.push({techCard, amount: 1})
      this.sendUpdateTableReq()
    },
    increaseOrderItemAmount(orderItem) {
      orderItem.amount++
      this.sendUpdateTableReq()
    },
    decreaseOrderItemAmount(orderItem) {
      orderItem.amount--
      if (orderItem.amount === 0) this.table.activeOrder.orderItems.splice(this.table.activeOrder.orderItems.indexOf(orderItem), 1)
      this.sendUpdateTableReq()
    },
    sendUpdateTableReq(table, needRefreshClientModel = true) {
      return new Promise(resolve => {
        this.$http.post('api/tables/edit', table || this.table).then(resp => {
          if (needRefreshClientModel) this.table = resp.body
          resolve()
        })
      })
    },
    closeTable() {
      let clone = _cloneDeep(this.table)
      clone.activeOrder = null;
      clone.status = closed;
      this.sendUpdateTableReq(clone, false).then(() => {
        this.$router.push('/terminal/tables')
      })
    },
    callPrint(strid) {
      var prtContent = document.getElementById(strid);
      var WinPrint = window.open('','','left=50,top=50,width=750,height=640,toolbar=0,scrollbars=1,status=0');
      WinPrint.document.write('<div id="print" class="contentpane">');
      WinPrint.document.write(prtContent.innerHTML);
      WinPrint.document.write('</div>');
      WinPrint.document.close();
      WinPrint.focus();
      WinPrint.print();
      WinPrint.close();
    }
  }
}
