import { storage } from '../styles/theme.js'

/**
 * PUBLIC_INTERFACE
 * NotesService provides async CRUD methods for notes.
 * For now it stores data in-memory and syncs to localStorage if available.
 */
export class NotesService {
  constructor() {
    this._notes = []
    this._loadFromStorage()
  }

  _loadFromStorage() {
    try {
      const s = storage.get('ocean_notes') || '[]'
      const parsed = JSON.parse(s)
      if (Array.isArray(parsed)) this._notes = parsed
    } catch {
      // Swallow storage parse errors and reset notes
      this._notes = []
    }
  }

  _saveToStorage() {
    try {
      storage.set('ocean_notes', JSON.stringify(this._notes))
    } catch {
      // Swallow storage write errors (non-fatal for in-memory state)
    }
  }

  _nowISO() {
    return new Date().toISOString()
  }

  // PUBLIC_INTERFACE
  async listNotes() {
    /** Return all notes in descending updatedAt order. */
    return [...this._notes].sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''))
  }

  // PUBLIC_INTERFACE
  async createNote({ title, content }) {
    /** Create a new note. */
    const id = cryptoRandomId()
    const now = this._nowISO()
    const note = { id, title: title || '(Untitled)', content: content || '', createdAt: now, updatedAt: now }
    this._notes.push(note)
    this._saveToStorage()
    return note
  }

  // PUBLIC_INTERFACE
  async updateNote(id, { title, content }) {
    /** Update an existing note by id. */
    const idx = this._notes.findIndex(n => n.id === id)
    if (idx === -1) return null
    const now = this._nowISO()
    this._notes[idx] = {
      ...this._notes[idx],
      title: title ?? this._notes[idx].title,
      content: content ?? this._notes[idx].content,
      updatedAt: now
    }
    this._saveToStorage()
    return this._notes[idx]
  }

  // PUBLIC_INTERFACE
  async deleteNote(id) {
    /** Delete a note by id. */
    const before = this._notes.length
    this._notes = this._notes.filter(n => n.id !== id)
    if (this._notes.length !== before) this._saveToStorage()
    return true
  }
}

// Simple random id generator avoiding external deps
function cryptoRandomId() {
  try {
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const buf = new Uint32Array(4)
      crypto.getRandomValues(buf)
      return Array.from(buf).map(n => n.toString(16)).join('')
    }
  } catch {
    // Fallback to Math.random below
  }
  return Math.random().toString(16).slice(2) + Date.now().toString(16)
}
