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

Vue.directive('active', {
  bind: function (el) {
    el.addEventListener('click', function () {
      el.classList.toggle('active')
    })
  }
})
