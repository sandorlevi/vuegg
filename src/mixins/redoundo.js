import cloneDeep from 'clone-deep'

const MAX_HISTORY = 100

/**
 * Vue Mixin to control the State history and undo/redo functionality
 *
 * @type {Vue.mixin}
 * @see {@link https://vuejs.org/v2/guide/mixins.html|Vue Mixins}
 */
const redoundo = {
  data: function () {
    return {
      done: [],
      undone: []
    }
  },
  created: function () {
    this.$store.subscribe((mutation, state) => {
      // If the history size is reached, the eldest state will be removed
      if (this.done.length === MAX_HISTORY) this.done.shift()
      console.log(state)
      // It won't save the state of mutations leaded by '_'
      if (mutation.type.charAt(0) !== '_') {
        console.log('push done')
        this.done.push(cloneDeep(state))
        this.undone = []
      }
    })
  },
  computed: {
    canUndo () {
    // There should always be at least one state (initialState)
      return this.done.length > 1
    },
    canRedo () {
      return this.undone.length > 0
    }
  },
  methods: {
    undo () {
      this.undone.push(this.done.pop())
      let undoState = this.done[this.done.length - 1]
      this.$store.replaceState(cloneDeep(undoState))
    },
    redo () {
      let redoState = this.undone.pop()
      this.done.push(redoState)
      this.$store.replaceState(cloneDeep(redoState))
    }
  }
}

export default redoundo
