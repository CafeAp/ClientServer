export default {
  loadImage: function (e, callback) {
    let image = new Image(),
      reader = new FileReader(),
      vm = this

    reader.onload = callback
    reader.readAsDataURL(e.target.files[0])
  },
  formatDate: function (date, isWithTime) {
    let options = {
      weekday: 'short',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    }
    if (isWithTime) {
      options.hour = '2-digit'
      options.minute = '2-digit'
    }
    options
    return new Date(date).toLocaleString(
      'ru-RU',
      options
    )
  }
}
