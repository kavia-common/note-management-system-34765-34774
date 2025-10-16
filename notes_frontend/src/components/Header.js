import Blits from '@lightningjs/blits'
import { colors, radii, shadows } from '../styles/theme.js'

export default Blits.Component('Header', {
  template: `
    <Element :w="$w" :h="$h">
      <!-- Header surface with subtle shadow -->
      <Element
        w="$w"
        h="$h"
        :color="$surface"
        :shadowColor="$shadowColor"
        :shadowBlur="$shadowBlur"
        radius="$radius"
        alpha="0.98"
      />

      <!-- App Title -->
      <Text
        x="24"
        y="22"
        :content="$title"
        :textColor="$text"
        fontSize="36"
      />

      <!-- New Note Button -->
      <Element
        :x="$w - 160 - 16"
        y="16"
        w="160"
        h="48"
        :color="$primary"
        radius="12"
        :alpha="$btnAlpha"
        @enter="$newNote"
        @up="$bubble"
        @down="$bubble"
        @left="$bubble"
        @right="$bubble"
      >
        <Text
          x="24"
          y="10"
          content="New Note"
          textColor="0xffffffff"
          fontSize="24"
        />
      </Element>
    </Element>
  `,

  state() {
    return {
      title: 'Ocean Notes',
      primary: colors.primary,
      surface: colors.surface,
      text: colors.text,
      shadowColor: shadows.color,
      shadowBlur: shadows.blur,
      radius: radii.lg,
      btnAlpha: 0.98,
    }
  },

  methods: {
    bubble(e) {
      if (this.parent && this.parent.focus) this.parent.focus(e)
    },
    // PUBLIC_INTERFACE
    newNote() {
      /** Emit newNote event upward. */
      this.$emit('newNote')
    }
  }
})
