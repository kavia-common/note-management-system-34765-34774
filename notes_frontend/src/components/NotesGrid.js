import Blits from '@lightningjs/blits'
import NoteCard from './NoteCard.js'
import { spacing } from '../styles/theme.js'

export default Blits.Component('NotesGrid', {
  components: { NoteCard },

  props: ['notes'],

  template: `
    <Element :w="$w" :h="$h">
      <Element
        :for="(item, index) in $items"
        :key="$item.id"
        :x="($index % $cols) * ($cardW + $gap)"
        :y="Math.floor($index / $cols) * ($cardH + $gap)"
        :w="$cardW"
        :h="$cardH"
      >
        <NoteCard
          :note="$item"
          w="$cardW"
          h="$cardH"
          @edit="$emitEdit"
          @delete="$emitDelete"
        />
      </Element>
    </Element>
  `,

  state() {
    return {
      gap: spacing.lg,
      cardW: 300,
      cardH: 180,
      cols: 1,
      items: []
    }
  },

  watch: {
    w() { this.computeLayout() },
    h() { this.computeLayout() },
    notes() {
      this.items = this.notes || []
      this.computeLayout()
    }
  },

  mounted() {
    this.items = this.notes || []
    this.computeLayout()
  },

  methods: {
    computeLayout() {
      const available = Math.max(0, (this.w || 0))
      const minCard = this.cardW
      const gap = this.gap
      let cols = Math.max(1, Math.floor((available + gap) / (minCard + gap)))
      this.cols = cols
    },

    // PUBLIC_INTERFACE
    emitEdit({ detail }) {
      /** Bubble edit note event upward with note. */
      this.$emit('editNote', detail)
    },

    // PUBLIC_INTERFACE
    emitDelete({ detail }) {
      /** Bubble delete note event upward with { id }. */
      this.$emit('deleteNote', detail)
    }
  },

  computed: {
    items() { return this.items }
  }
})
