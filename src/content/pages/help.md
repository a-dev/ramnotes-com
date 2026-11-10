---
title: Help
description: How to show, write, find, tint, and keep your notes in RAMnotes, and what to do when a note does not save.
updated: 2026-11-05
---

RAMnotes keeps short notes as plain `.txt` files in a folder you choose. Press one shortcut to show your notes. Press it again to hide them.

## Get started

1. Open RAMnotes. The note list opens.
2. Press <kbd>⌘N</kbd> to make a new note. Each note opens in its own window.
3. Type. RAMnotes saves your text automatically.
4. Press <kbd>Esc</kbd> to hide your notes.

RAMnotes saves each note as a UTF-8 `.txt` file. A blank note stays in the folder until you delete it.

RAMnotes has no Dock icon and no menu bar icon. To see all menus and commands, press <kbd>⇧⌘?</kbd> in any RAMnotes window.

## Show and hide your notes

The default shortcut is <kbd>⌃\\</kbd> (Control and Backslash). Press it to show the notes that were open. Press it again to hide them. Hiding a note does not close or delete it.

When your notes appear, the note you used last has the focus. If no notes were open, RAMnotes opens the note list.

A second shortcut, <kbd>⌃⌘\\</kbd>, shows your notes and the note list together.

You can also hide your notes with <kbd>Esc</kbd>. If a menu or a dialog is open, the first <kbd>Esc</kbd> closes it.

### Scroll over the menu bar

You can show your notes with a scroll gesture. The menu bar is the thin strip at the top of the screen. Turn on the gesture in **Settings → Keyboard → Menu Bar Scroll Gesture**:

- **Vertical menu-bar scroll shows notes.** Scroll up or down over the menu bar.
- **Horizontal menu-bar scroll shows notes and the note list.** Scroll left or right over the menu bar.

Scroll again to hide your notes. The gesture works with a trackpad or a mouse with precise scrolling. Both options are off by default. If the gesture does not work, read the status message below the options.

## Write a note

Notes are plain text. RAMnotes does not add bold, headings, or other formatting, and it does not show Markdown. macOS spelling, grammar, and Services work as in other Mac apps.

Each note has its own text size. Press <kbd>⌘+</kbd> to make the text larger and <kbd>⌘−</kbd> to make it smaller. Press <kbd>⌘0</kbd> to reset it. The size changes only on this Mac. The `.txt` file stays the same.

### Links

RAMnotes finds web links in your text. To open a link in your browser, hold <kbd>⌘</kbd> and click the link. You can also put the cursor on a link and press <kbd>⌥⌘Return</kbd>.

RAMnotes reads your clipboard only when you paste.

### Close a note window

Press <kbd>⌘W</kbd> or click the close button. RAMnotes saves your last edits first. The note stays in the note list. To open it again, select it in the list.

## Find a note

Press <kbd>⇧⌘F</kbd>. The note list opens with the cursor in the search field.

- Search looks at filenames and note text. Capital and small letters match the same.
- If you type two or more words, a note must contain all of them.
- Each result shows a short piece of the matching text.
- The most recently edited notes come first. With an empty search field, the list shows all notes.

Press <kbd>↑</kbd> and <kbd>↓</kbd> to move through the results. Press <kbd>Return</kbd> to open the selected note.

To search inside the open note, press <kbd>⌘F</kbd>.

## Tint a note

A tint gives a note a light background color. Use tints to tell notes apart. For example, make all notes for Project A green and all study notes blue.

To set a tint, click the palette button in the note window. Or choose **View → Background Tint**. The choices are **No color**, **Gray**, **Blue**, **Green**, **Yellow**, **Red**, and **Purple**.

In the note list, a small colored dot shows the tint of each note. RAMnotes keeps tints on this Mac. A tint does not change the `.txt` file, and it does not go with a copy of the file.

## Where your notes live

### The default folder

RAMnotes keeps new notes in the default folder. At first, this folder is in the RAMnotes Application Support data on your Mac.

To use a different folder:

1. Open **Settings → General**.
2. Click **Choose Default Folder…** and select a folder.
3. Keep **Move existing notes to the new location** selected to move your notes. Clear it to leave them where they are.
4. If macOS asks, give RAMnotes access to the folder.

The move option does not move notes that you added from other folders.

RAMnotes reads `.txt` files directly in the folder. It does not look in subfolders.

### Sync with iCloud Drive or another cloud service

To back up and sync your notes, choose a default folder in iCloud Drive, Dropbox, Google Drive, or a similar service. That service syncs the files. RAMnotes does not send your notes anywhere.

### Add files from other folders

A note can live in any folder, for example inside a project. To add `.txt` files that you already have, choose **File → Add Existing Files…**. RAMnotes keeps each file where it is.

### Move or rename a note

In the note list, click the folder name below a note. The **Note location** dialog opens. In this dialog you can:

- Change the folder or the filename.
- Move the note back to the default folder with **Move to default**.
- Show the file in Finder.
- Save a copy of the note.

You can also move or rename a `.txt` file in Finder. RAMnotes updates the list when it finds the change.

### Use another Mac

On a new Mac, choose your notes folder again in Settings. macOS gives folder access to one Mac at a time, so the access does not move with the app.

## Delete a note

To delete a note, click **Move to Trash** in the note window or press <kbd>⌘⌫</kbd>. RAMnotes asks you to confirm. Then it moves the file to the macOS Trash.

To get the note back, press <kbd>⌘Z</kbd>. This undoes your last deletion while RAMnotes is still open. If another note now has the same name, the restored note gets a new name. You can also restore the file from the Trash in Finder.

## If a note does not save

If RAMnotes cannot save a note, the note window shows an error. Do not close the window. Then do one of these steps:

- Click **Export** to save the text to a different file.
- Open **More Recovery Actions** for more choices, such as **Save a Copy…** or **Locate File…**.

When it can, RAMnotes also keeps a recovery copy of your text. Close the window only after the error is gone or after you export the text.

### When the file changes outside RAMnotes

A file can change or disappear while you have unsaved edits. For example, another app can edit it. In this case, RAMnotes keeps your text as a separate recovery note. The note window shows links to the original file and to the recovery copy.

If iCloud Drive or a disk is not available for a short time, wait until it comes back. Then open the note again.

## Settings

Press <kbd>⌘,</kbd> to open Settings.

- **General.** Choose the default notes folder. Turn on **Always on top** to keep note windows above other windows. Turn on **Launch at login**. Both are off by default.
- **Appearance.** Choose the font family, weight, size, and line spacing. Choose a System, Light, or Dark color theme.
- **Keyboard.** Turn on the menu bar scroll gesture. Change the global shortcuts and the RAMnotes shortcuts.

With **Launch at login** on, RAMnotes starts in the background and opens no windows. Use your shortcut to show the notes you left open.

## Keyboard shortcuts

You can change the shortcuts marked "Yes" in **Settings → Keyboard**.

| Action                               | Shortcut                         | Change |
| ------------------------------------ | -------------------------------- | ------ |
| Show or hide notes                   | <kbd>⌃\\</kbd>                   | Yes    |
| Show or hide notes and the note list | <kbd>⌃⌘\\</kbd>                  | Yes    |
| Show the note list                   | <kbd>⌘L</kbd>                    | Yes    |
| Next note                            | <kbd>⌘]</kbd>                    | Yes    |
| Previous note                        | <kbd>⌘[</kbd>                    | Yes    |
| Move the note to Trash               | <kbd>⌘⌫</kbd>                    | Yes    |
| New note                             | <kbd>⌘N</kbd>                    |        |
| Search all notes                     | <kbd>⇧⌘F</kbd>                   |        |
| Search inside the note               | <kbd>⌘F</kbd>                    |        |
| Open the link at the cursor          | <kbd>⌥⌘Return</kbd>              |        |
| Make text larger or smaller          | <kbd>⌘+</kbd> / <kbd>⌘−</kbd>    |        |
| Reset text size                      | <kbd>⌘0</kbd>                    |        |
| Hide notes or close a menu           | <kbd>Esc</kbd>                   |        |
| Close the window                     | <kbd>⌘W</kbd>                    |        |
| Next or previous window              | <kbd>⌘\`</kbd> / <kbd>⇧⌘\`</kbd> |        |
| Show all commands                    | <kbd>⇧⌘?</kbd>                   |        |
| Open Settings                        | <kbd>⌘,</kbd>                    |        |
| Quit RAMnotes                        | <kbd>⌘Q</kbd>                    |        |

Undo, redo, cut, copy, paste, and select all use the usual macOS shortcuts.

If one of your other shortcuts already uses <kbd>⌥⌘Return</kbd>, the open-link shortcut does not work.

## Update RAMnotes

If you installed RAMnotes from GitHub, choose **RAMnotes → Check for Updates…**.
