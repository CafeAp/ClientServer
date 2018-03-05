export default {
  name: 'content-header',
  props: {
    backLink: {
      type: String
    },
    headling: {
      type: String
    },
    buttons: {
      type: Array
      // Array of objects:
      // {
      //  text: <String>,
      //  link: <String>
      // }
    }
  }
}
