import Vue from 'vue';
import Router from 'vue-router';

import ingredients from '@/pages/ingredients/bundle.vue'
import ingredientsHeader from '@/pages/ingredients/header/bundle.vue'

import editIngredient from '@/pages/edit_ingredient/bundle.vue'
import editIngredientHeader from '@/pages/edit_ingredient/header/bundle.vue'

import goods from '@/pages/goods/bundle.vue'
import goodsHeader from '@/pages/goods/header/bundle.vue'

import editGoods from '@/pages/edit_goods/bundle.vue'
import editGoodsHeader from '@/pages/edit_goods/header/bundle.vue'

import techCards from '@/pages/tech_cards/bundle.vue'
import techCardsHeader from '@/pages/tech_cards/header/bundle.vue'

import editTechCard from '@/pages/edit_tech_card/bundle.vue'
import editTechCardHeader from '@/pages/edit_tech_card/header/bundle.vue'

import supplies from '@/pages/supplies/bundle.vue'
import suppliesHeader from '@/pages/supplies/header/bundle.vue'

import editSupply from '@/pages/edit_supply/bundle.vue'
import editSupplyHeader from '@/pages/edit_supply/header/bundle.vue'

Vue.use(Router);
export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/ingredients'
    },
    {
      path: '/ingredients',
      components: {
        header: ingredientsHeader,
        body: ingredients
      }
    },
    {
      path: '/edit_ingredient/:id?',
      components: {
        header: editIngredientHeader,
        body: editIngredient
      }
    },
    {
      path: '/goods',
      components: {
        header: goodsHeader,
        body: goods
      }
    },
    {
      path: '/edit_goods/:id?',
      components: {
        header: editGoodsHeader,
        body: editGoods
      }
    },
    {
      path: '/tech_cards',
      components: {
        header: techCardsHeader,
        body: techCards
      }
    },
    {
      path: '/edit_tech_card/:id?',
      components: {
        header: editTechCardHeader,
        body: editTechCard
      }
    },
    {
      path: '/supplies',
      components: {
        header: suppliesHeader,
        body: supplies
      }
    },
    {
      path: '/edit_supply/:id?',
      components: {
        header: editSupplyHeader,
        body: editSupply
      }
    }
  ],
});
