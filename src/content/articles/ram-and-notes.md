---
title: RAM and notes or Why I built a short-term notes app for Mac
description: Why I built RAMnotes, a small and fast macOS app for short-term notes.
updated: 2026-11-05
---

Everything started with a few ideas I wanted to save for later. And... classic! While I was deciding which app to use, I forgot what I wanted to remember. Those ideas are gone, but now we have RAMnotes, and I think that's an even better idea.

Let's go back to what I tried. First, I tried the Apple Notes app on macOS. It's great and it's fast, but getting back to a note takes longer than I want. Apple Notes is good for long and important things that you always want to have with you, and it syncs well across all your Apple devices. But for short, quick notes, it's more than I need. When I tried to use it this way, old notes piled up very quickly. You have to clean them up often. If you don't, the app becomes hard to manage, and the notes lose their value.

Then there are Notion, Coda, and similar apps built mainly for collaboration, and knowledge-base apps like Obsidian. All of these are good tools for many tasks. But so many features make an app big and heavy, and that doesn't fit this simple job: be fast, be there when I need it, and open with one click or one shortcut.

At that moment, I remembered how RAM (Random-Access Memory) works in computers. It's short-term memory, and it's very fast to write and read. I tried to bring this idea into an app, and it became RAMnotes. The more I worked on the app, the more interesting and useful things I found for myself and, I hope, for you. That's what I want to share.

## Blazingly fast

RAMnotes is written in Swift, the main language for macOS apps. It uses no extra frameworks or libraries. The app is smaller than 4 MB, and most of that is the icons. It has almost no effect on your computer's performance. It's just plain text.

RAMnotes can start when your computer starts,[^1] but it stays hidden until you need it. When you want it, press <kbd>⌃\\</kbd> (Control + Backslash),[^2] and your notes appear. Or one note, whatever you want. Press <kbd>Esc</kbd> or the same shortcut again to hide RAMnotes. Don't like shortcuts? No problem: scroll in the menu bar.[^3] Scroll once to show your notes, and scroll again to hide them. It's hard to think of anything simpler.

When you open your notes, the focus is always on the note you used last. You come back to exactly where you were.

You could use just one note all the time. It's your choice how to organize your short-term memory. But using several notes has its benefits.

## Divide and conquer

A long time ago, people invented sticky notes: small squares of colored paper you could stick on your monitor or anything else around you. It seems like a very natural way to remind yourself about something... but Hollywood has built more than one plot around a password written on a sticky note. A password on a sticky note isn't a reminder. It's a perfect example of short-term memory.[^4] Today our phones are full of reminders, but where are our sticky notes?[^5]

Sticky notes are a really quick way to put information in front of our brain. It's simply good design.

Colors help you tell notes apart. You remember where each note is, because it stays where you put it.

RAMnotes works the same way. You can use the default background or one of six color shades. Each shade adds a light tint to the background and gives your mind a simple visual signal.

For example, you can decide that Project A is green and your study notes are blue.

Every note also has its own font size. Make it larger or smaller with <kbd>⌘+</kbd> and <kbd>⌘−</kbd>. In the settings, you can also choose the default font size, the font itself, and the line spacing. These options are for accessibility and for making your notes look the way you like. Changing the font size of a single note is another way to show what matters. Whisper or shout with a note, if you want to.

You might find it limiting that notes have no formatting tools. That's on purpose. If you want to format text, it means you are starting to process the information, and that's not what RAMnotes is for. The app works with the simplest files: plain text (.txt). And that brings another benefit.

## Keep it. Use it.

What's unusual for a notes app is that RAMnotes lets you keep notes in different places.

First, choose the default folder in the settings. If you want your notes backed up and synced, choose iCloud, Dropbox, Google Drive, or another cloud service. It's up to you.

But what I enjoy most is keeping notes inside my AI projects.[^6]

There's a lot of talk about Andrej Karpathy's pattern for personal knowledge[^7] and other similar ideas. In short: let AI manage your notes. It works well with Obsidian and other apps that offer their own system for storing your 10,000 notes and show a beautiful graph of your knowledge.

What frustrates me about all these tools is how hard it is to do something small: write down a thought, save a link, and so on.

RAMnotes solves this problem flawlessly. Just keep the note inside your project folder. Then run a task (or schedule one) that reads the note (remind you, it's just a .txt file) and adds the information to your knowledge base the way you want. After that, AI can change the note: remove text, add a report, anything you want. You will see the changes the next time you open RAMnotes.

That's how RAM works in a computer: it gives programs fast, short-term storage. RAMnotes gives the same thing to your mind: a buffer for your thoughts.[^8]

[^1]: It's off by default. Turn on Launch at login in the settings. I recommend it. It makes life simpler.

[^2]: This is the default shortcut, and you can change it in the settings. Why Control (⌃) and not Command (⌘)? A long time ago I changed my Caps Lock key to work as Control, and it's so useful! I don't understand why this isn't the default. Really, who needs Caps Lock these days? You can do it in System Settings. You're welcome.

[^3]: The menu bar is the thin strip at the top of the screen with app menus and controls.

[^4]: I don't encourage you to keep passwords or keys in RAMnotes, even though I sometimes do it myself for a short time.

[^5]: macOS has had Stickies since 1994 (System 7.5), and it still comes with macOS today. Its design is so skeuomorphic that the notes look really glued to your screen. (I'm joking.)

[^6]: Remember, different notes (with different tints) can be saved in different projects. Do you see where this is going?

[^7]: [gist.github.com/karpathy](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)

[^8]: My other idea was to call the app “BufferNotes”. But then I realized that RAM is expensive and valuable these days (so it's good to have more of it). Also, a ram is a badass sheep. 🐏
