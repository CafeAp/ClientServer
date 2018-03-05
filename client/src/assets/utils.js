export default {
  loadImage: function (e, callback) {
    let image = new Image(),
      reader = new FileReader(),
      vm = this

    reader.onload = callback
    reader.readAsDataURL(e.target.files[0])
  }
}
