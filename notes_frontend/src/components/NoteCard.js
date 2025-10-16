import Blits from '@lightningjs/blits'
import { colors, radii, shadows } from '../styles/theme.js'

export default Blits.Component('NoteCard', {
  props: ['note'],

  template: `
    <Element :w="$w" :h="$h">
      <!-- Card Surface -->
      <Element
        w="$w"
        h="$h"
        :color="$surface"
        radius="$radius"
        :shadowColor="$shadowColor"
        :shadowBlur="$shadowBlur"
      />

      <!-- Title -->
      <Text
        x="16"
        y="14"
        :content="$title"
        :textColor="$text"
        fontSize="24"
      />

      <!-- Updated At -->
      <Text
        :x="$w - 16 - 180"
        y="18"
        :content="$updated"
        :textColor="$muted"
        fontSize="16"
      />

      <!-- Snippet -->
      <Text
        x="16"
        y="52"
        :content="$snippet"
        :textColor="$muted"
        fontSize="18"
      />

      <!-- Actions -->
      <Element x="16" :y="$h - 16 - 40" w="200" h="40">
        <Element
          x="0" y="0" w="88" h="40"
          :color="$primary"
          radius="$btnRadius"
          @enter="$edit"
        >
          <Text x="16" y="8" content="Edit" textColor="0xffffffff" fontSize="20" />
        </Element>
        <Element
          x="104" y="0" w="96" h="40"
          :color="$error"
          radius="$btnRadius"
          @enter="$del"
        >
          <Text x="16" y="8" content="Delete" textColor="0xffffffff" fontSize="20" />
        </Element>
      </Element>
    </Element>
  `,

  state() {
    return {
      surface: colors.surface,
      text: colors.text,
      muted: colors.muted,
      primary: colors.primary,
      error: colors.error,
      radius: radii.lg,
      btnRadius: radii.md,
      shadowColor: shadows.color,
      shadowBlur: shadows.blur,

      title: '',
      snippet: '',
      updated: '',
    }
  },

  mounted() {
    this.sync(this.note)
  },

  watch: {
    note(val) { this.sync(val) }
  },

  methods: {
    sync(n) {
      if (!n) return
      this.title = n.title || '(Untitled)'
      const content = n.content || ''
      this.snippet = content.length > 90 ? content.slice(0, 90) + '…' : content
      const d = n.updatedAt ? new Date(n.updatedAt) : new Date()
      this.updated = `Updated ${d.toLocaleDateString()}`
    },

    // PUBLIC_INTERFACE
    edit() {
      /** Emit edit event with full note payload. */
      this.$emit('edit', this.note)
    },

    // PUBLIC_INTERFACE
    del() {
      /** Emit delete event with id only. */
      this.$emit('delete', { id: this.note?.id })
    }
  }
})
