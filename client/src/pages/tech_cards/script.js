import _xor from 'lodash/xor'
import _sumBy from 'lodash/sumBy'

export default {
  name: 'tech-cards',
  data () {
    return {
      techCards: [],
      cardsIdsWithShownComposition: []
    }
  },
  created () {
    this.$http.get('api/tech_cards/list').then(resp => {
      this.techCards = resp.body
    })
  },
  methods: {
    _sumBy,
    editTechCard(techCard, i) {
      this.$router.push(`/edit_tech_card/${techCard.id}`)
    },
    deleteTechCard(techCard, i) {
      this.$http.delete('api/tech_cards/delete', {params: {id: techCard.id}}).then(resp => {
        this.techCards.splice(i, 1)
      })
    },
    toggleComposition(techCardId) {
      let index = this.cardsIdsWithShownComposition.indexOf(techCardId)
      index === -1 ? this.cardsIdsWithShownComposition.push(techCardId) : this.cardsIdsWithShownComposition.splice(index, 1)
    }
  }
}
