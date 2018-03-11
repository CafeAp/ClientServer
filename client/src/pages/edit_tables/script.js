import VueDraggableResizable from 'vue-draggable-resizable'
import newTableConfigTPL from '@/assets/model_templates/new_table_config.tpl.js'
import _cloneDeep from 'lodash/cloneDeep'
import _last from 'lodash/last'
import {mapGetters} from 'vuex'

export default {
  name: 'edit-tables',
  components: {
    VueDraggableResizable
  },
  data() {
    return {
      roomConfig: null,
      edittingTable: null
    }
  },
  created() {
    this.$http.get('api/room_configs/get').then(resp => {
      this.roomConfig = resp.body[0]
    })
  },
  computed: {
    ...mapGetters({
      alertMessage: 'alertMessage'
    })
  },
  methods: {
    addNewTable() {
      let newTable = _cloneDeep(newTableConfigTPL)
      newTable.name = this.roomConfig.tables.length + 1
      this.roomConfig.tables.push(newTable)
    },
    deleteTable(tableIndex) {
      this.roomConfig.tables.splice(tableIndex, 1)
    },
    handleTableDragging(table, x, y) {
      table.x = x
      table.y = y
    },
    handleTableResizing(table, x, y, w, h) {
      table.x = x
      table.y = y
      table.width = w
      table.height = h
    },
    saveRoomConfig() {
      this.$http.post('api/room_configs/edit', this.roomConfig).then(resp => {
        this.$store.dispatch('setAlertMessageForTime', 'success')
      }, () => {
        this.$store.dispatch('setAlertMessageForTime', 'error')
      })
    },
    startEditTableName(table) {
      this.edittingTable = table
    },
    stopEditTableName() {
      this.edittingTable = null
    }
  }
}
