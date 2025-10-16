# Ocean Notes (Lightning.js / Blits)

A modern notes UI built with Lightning.js (Blits), following the Ocean Professional theme.

## Features
- Header with app title and New Note action
- Responsive grid of note cards (title, snippet, updated date)
- Create and Edit via modal with validation
- Delete notes
- In-memory state with optional localStorage persistence
- Organized for future backend integration via `NotesService`

## Project Structure
- `src/index.js` – App entrypoint; launches Blits Application with Theme plugin
- `src/App.js` – Root Application with Header, NotesGrid, floating action button, and NoteModal
- `src/components/Header.js` – App header and New Note button
- `src/components/NotesGrid.js` – Layout logic for the cards grid
- `src/components/NoteCard.js` – Individual card UI with Edit/Delete
- `src/components/NoteModal.js` – Modal for create/edit, with basic input handling and validation
- `src/services/NotesService.js` – Async CRUD stubs, in-memory with localStorage sync
- `src/styles/theme.js` – Ocean Professional theme tokens (colors, spacing, radii, shadows)
- `public/index.html` – Mount point and document metadata

## Theming (Ocean Professional)
- Primary: `#2563EB`
- Secondary/Success: `#F59E0B`
- Error: `#EF4444`
- Background: `#f9fafb`
- Surface: `#ffffff`
- Text: `#111827`
- Guidance: Modern, clean, subtle shadows, rounded corners, smooth transitions.

## Running
This project uses Vite (already configured). In the preview system it should run automatically.
To run locally:

```bash
npm install
npm run dev
```

Open http://localhost:3000 (port may vary) and you should see Ocean Notes.

## Usage
- Press Enter on the “New Note” button or the floating plus button to open the modal.
- Type characters to fill the Title and Content fields (press Enter on the field to focus it).
- Press Enter on “Save” to create or update the note. Escape cancels.

Note: This demo uses a minimal typing handler to input text due to Lightning’s TV-centric input model. For production, integrate with a proper text input plugin or a virtual keyboard.

## Backend-ready Architecture
`NotesService` methods are async and return Promises to mirror real API calls. Replace the in-memory logic with fetch/XHR to your backend later. Keep method signatures:
- `listNotes()`
- `createNote({ title, content })`
- `updateNote(id, { title, content })`
- `deleteNote(id)`

## License
MIT
