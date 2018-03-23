import VueDraggableResizable from 'vue-draggable-resizable'
import newTableTPL from '@/assets/model_templates/new_table.tpl.js'
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
      room: null,
      edittingTable: null,
      saveInProgress: false
    }
  },
  created() {
    this.$http.get('api/rooms/list').then(resp => {
      this.room = resp.body[0]
    })
  },
  computed: {
    ...mapGetters({
      alertMessage: 'alertMessage'
    })
  },
  methods: {
    addNewTable() {
      let newTable = _cloneDeep(newTableTPL)
      newTable.name = this.room.tables.length + 1
      this.room.tables.push(newTable)
    },
    deleteTable(tableIndex) {
      this.room.tables.splice(tableIndex, 1)
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
      if (this.saveInProgress) return false
      this.saveInProgress = true
      this.$http.post('api/rooms/edit', this.room).then(resp => {
        this.saveInProgress = false
        this.room = resp.body
        this.$store.dispatch('setAlertMessageForTime', 'success')
      }, () => {
        this.saveInProgress = false
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
