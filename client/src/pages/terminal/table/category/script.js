import {mapGetters} from 'vuex'

export default {
  name: 'category',
  props: {
    category: {
      type: Object
    }
  },
  methods: {
    emitClickCategory() {
      this.$emit('clickCategory', this.category)
    }
  }
}
