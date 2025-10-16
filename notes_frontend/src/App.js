import Blits from '@lightningjs/blits'
import Header from './components/Header.js'
import NotesGrid from './components/NotesGrid.js'
import NoteModal from './components/NoteModal.js'
import { NotesService } from './services/NotesService.js'
import { colors } from './styles/theme.js'

/**
 * Root Application for Ocean Notes.
 * - Renders header and notes grid
 * - Manages modal open/close state
 * - Manages in-memory notes state via NotesService
 */
export default Blits.Application({
  name: 'OceanNotesApp',

  components: { Header, NotesGrid, NoteModal },

  template: `
    <Element w="$w" h="$h" :color="$bg">
      <!-- Background surface -->
      <Element w="$w" h="$h" :color="$bg" />

      <!-- Header -->
      <Header
        y="24"
        x="40"
        w="$w - 80"
        h="80"
        @newNote="$openCreate"
      />

      <!-- Notes Grid area -->
      <Element
        x="40"
        :y="$contentY"
        :w="$w - 80"
        :h="$h - $contentY - 40"
      >
        <NotesGrid
          w="$w - 80"
          :h="$h - $contentY - 40"
          :notes="$notes"
          @editNote="$openEdit"
          @deleteNote="$deleteNote"
        />
      </Element>

      <!-- Floating Action Button -->
      <Element
        :x="$w - 40 - 72"
        :y="$h - 40 - 72"
        w="72"
        h="72"
        :color="$primary"
        radius="36"
        zIndex="5"
        alpha="0.95"
        @enter="$openCreate"
        @up="$focusUp"
        @down="$focusDown"
        @left="$focusLeft"
        @right="$focusRight"
      >
        <!-- Plus icon -->
        <Element
          x="16" y="16" w="40" h="40"
          :color="$surface"
          radius="6"
          alpha="0"
        />
        <Element x="20" y="34" w="32" h="4" color="0xffffffff" radius="2" />
        <Element x="34" y="20" w="4" h="32" color="0xffffffff" radius="2" />
        <Element
          x="0" y="0" w="72" h="72" color="0x00000000"
          @enter="$openCreate"
        />
      </Element>

      <!-- Modal -->
      <NoteModal
        :visible="$modalVisible"
        :editingNote="$editingNote"
        @save="$saveNote"
        @cancel="$closeModal"
      />
    </Element>
  `,

  state() {
    return {
      bg: colors.background,
      primary: colors.primary,
      surface: colors.surface,
      contentY: 120,
      notes: [],
      modalVisible: false,
      editingNote: null,
    }
  },

  created() {
    // Initialize service and load notes
    this.service = new NotesService()
  },

  async mounted() {
    this.notes = await this.service.listNotes()
  },

  methods: {
    // PUBLIC_INTERFACE
    async refreshNotes() {
      /** Reload notes from service. */
      this.notes = await this.service.listNotes()
    },

    // PUBLIC_INTERFACE
    openCreate() {
      /** Open modal in create mode. */
      this.editingNote = null
      this.modalVisible = true
    },

    // PUBLIC_INTERFACE
    openEdit({ detail }) {
      /** Open modal in edit mode with provided note. */
      this.editingNote = detail
      this.modalVisible = true
    },

    // PUBLIC_INTERFACE
    closeModal() {
      /** Close modal. */
      this.modalVisible = false
      this.editingNote = null
    },

    // PUBLIC_INTERFACE
    async saveNote({ detail }) {
      /**
       * Save note from modal. Creates or updates based on presence of id.
       * detail: { id?, title, content }
       */
      const payload = detail
      if (payload.id) {
        await this.service.updateNote(payload.id, {
          title: payload.title,
          content: payload.content,
        })
      } else {
        await this.service.createNote({
          title: payload.title,
          content: payload.content,
        })
      }
      this.closeModal()
      await this.refreshNotes()
    },

    // PUBLIC_INTERFACE
    async deleteNote({ detail }) {
      /** Delete note and refresh. detail: { id } */
      if (!detail || !detail.id) return
      await this.service.deleteNote(detail.id)
      await this.refreshNotes()
    },

    focusUp() { this.parent && this.parent.focus && this.parent.focus() },
    focusDown() { this.parent && this.parent.focus && this.parent.focus() },
    focusLeft() { this.parent && this.parent.focus && this.parent.focus() },
    focusRight() { this.parent && this.parent.focus && this.parent.focus() },
  },

  input: {
    back() {
      if (this.modalVisible) {
        this.closeModal()
        return
      }
      // bubble back
      if (this.parent && this.parent.focus) this.parent.focus()
    }
  }
})
