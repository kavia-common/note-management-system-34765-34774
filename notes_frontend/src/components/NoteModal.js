import Blits from '@lightningjs/blits'
import { colors, radii, shadows } from '../styles/theme.js'

export default Blits.Component('NoteModal', {
  props: ['visible', 'editingNote'],

  template: `
    <Element :w="$w" :h="$h" :alpha="$alpha">
      <!-- Overlay -->
      <Element
        w="$w"
        h="$h"
        color="0x000000cc"
        :alpha="$visibleAlpha"
      />

      <!-- Modal Surface -->
      <Element
        :x="($w - 720) / 2"
        :y="($h - 480) / 2"
        w="720"
        h="480"
        :color="$surface"
        radius="$radius"
        :shadowColor="$shadowColor"
        :shadowBlur="$shadowBlur"
        :alpha="$visibleAlpha"
      >
        <Text x="24" y="20" :content="$titleLabel" :textColor="$text" fontSize="28" />

        <!-- Title Field -->
        <Text x="24" y="70" content="Title" :textColor="$muted" fontSize="18" />
        <Element x="24" y="98" w="672" h="48" :color="$fieldBg" radius="10">
          <Text x="12" y="10" :content="$titleValue" :textColor="$text" fontSize="22" />
        </Element>

        <!-- Content Field -->
        <Text x="24" y="160" content="Content" :textColor="$muted" fontSize="18" />
        <Element x="24" y="188" w="672" h="200" :color="$fieldBg" radius="10">
          <Text x="12" y="10" :content="$contentValue" :textColor="$text" fontSize="20" />
        </Element>

        <!-- Error -->
        <Text
          x="24"
          y="394"
          :content="$errorMsg"
          :textColor="$error"
          fontSize="18"
        />

        <!-- Actions -->
        <Element x="24" y="420" w="672" h="44">
          <Element
            x="0" y="0" w="120" h="44"
            :color="$primary"
            radius="10"
            @enter="$save"
          >
            <Text x="20" y="8" content="Save" textColor="0xffffffff" fontSize="22" />
          </Element>
          <Element
            x="140" y="0" w="120" h="44"
            :color="$cancelColor"
            radius="10"
            @enter="$cancel"
          >
            <Text x="18" y="8" content="Cancel" textColor="0xffffffff" fontSize="22" />
          </Element>
        </Element>

        <!-- Invisible input catchers for typing -->
        <Element x="24" y="98" w="672" h="48" color="0x00000000" @enter="$focusTitle" />
        <Element x="24" y="188" w="672" h="200" color="0x00000000" @enter="$focusContent" />
      </Element>
    </Element>
  `,

  state() {
    return {
      alpha: 0,
      visibleAlpha: 0,
      surface: colors.surface,
      text: colors.text,
      muted: colors.muted,
      primary: colors.primary,
      error: colors.error,
      cancelColor: 0xff6b7280, // slate gray-ish
      radius: radii.xl,
      shadowColor: shadows.color,
      shadowBlur: shadows.blur,
      fieldBg: 0xfff3f4f6,

      titleLabel: 'New Note',
      titleValue: '',
      contentValue: '',
      errorMsg: '',

      focusField: 'title', // 'title' | 'content'
      editingId: null
    }
  },

  watch: {
    visible(v) {
      this.visibleAlpha = v ? 1 : 0
      this.alpha = v ? 1 : 0
      if (!v) return
      // when opening, seed from editingNote
      if (this.editingNote) {
        this.titleLabel = 'Edit Note'
        this.titleValue = this.editingNote.title || ''
        this.contentValue = this.editingNote.content || ''
        this.editingId = this.editingNote.id || null
      } else {
        this.titleLabel = 'New Note'
        this.titleValue = ''
        this.contentValue = ''
        this.editingId = null
      }
      this.errorMsg = ''
      this.focusField = 'title'
    },
    editingNote() {
      // handled when visible turns true
    }
  },

  methods: {
    // PUBLIC_INTERFACE
    save() {
      /** Validate and emit save payload. */
      const title = (this.titleValue || '').trim()
      if (!title) {
        this.errorMsg = 'Title is required.'
        return
      }
      const content = (this.contentValue || '').trim()
      this.$emit('save', {
        id: this.editingId || undefined,
        title,
        content
      })
    },

    // PUBLIC_INTERFACE
    cancel() {
      /** Emit cancel to close modal. */
      this.$emit('cancel')
    },

    focusTitle() { this.focusField = 'title' },
    focusContent() { this.focusField = 'content' },
  },

  input: {
    // basic typing handler: append characters to focused field
    enter() { /* handled by buttons/fields */ },
    back() { /* bubble to app, which closes modal */ },
    left() {},
    right() {},
    up() {},
    down() {},
    // Simulate text input with key events provided by environment
    // For this environment, we only handle a limited set for demo purposes.
    // In a real app, integrate a proper input plugin.
    key(e) {
      if (!this.visibleAlpha) return
      const code = e && e.code
      const key = e && (e.key || '')
      if (code === 'Backspace') {
        if (this.focusField === 'title') this.titleValue = this.titleValue.slice(0, -1)
        else this.contentValue = this.contentValue.slice(0, -1)
        return
      }
      if (key.length === 1) {
        if (this.focusField === 'title') this.titleValue += key
        else this.contentValue += key
      } else if (code === 'Enter') {
        // save shortcut
        this.save()
      } else if (code === 'Escape') {
        this.cancel()
      }
    }
  }
})
