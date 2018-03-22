import Vue from 'vue'

Vue.directive('focus', {
  inserted: function (el, binding) {
    // timeout - kostyl for firefox
    setTimeout(() => {
      el.focus()
    if (el.select) { el.select() }
  }, 100)
  }
})

Vue.directive('click-focus', {
  inserted: function (el, binding) {
    el.addEventListener('focus', function () {
      if (el.select) { el.select() }
    })
  }
})

Vue.directive('active', {
  bind: function (el) {
    el.addEventListener('click', function () {
      el.classList.toggle('active')
    })
  }
})
