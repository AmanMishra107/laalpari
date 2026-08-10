# Window Seat Radio

Build a premium, minimalistic, nostalgic single-page music experience called:

BUS.WTF

TAGLINE:

"Window seat. Old songs. Long route."

The website is inspired by the feeling of sitting inside an old Maharashtra State Transport "Lal Pari" bus while travelling through Maharashtra and listening to old Bollywood music.

The website should NOT look like a normal music streaming website.

It should feel like a digital nostalgia experience.

IMPORTANT:

The entire website must fit inside ONE SINGLE VIEWPORT.

There must be NO PAGE SCROLLING.

There must be NO vertical scrolling.

There must be NO second section below the fold.

Everything must exist inside the initial viewport.

The experience should feel like an interactive poster / living illustration rather than a conventional website.

==================================================

1. CORE VISUAL DIRECTION

==================================================

Use the supplied bright vector-art bus reference as the primary visual inspiration.

The background should be a bright, colorful, hand-painted 2D vector illustration of an old Maharashtra ST "Lal Pari" bus interior.

Visual characteristics:

- bright vector illustration

- flat graphic shapes

- hand-painted feel

- slightly imperfect outlines

- vintage Indian poster aesthetic

- 90s Bollywood nostalgia

- Maharashtra countryside

- warm reds

- orange

- yellow

- cream

- green

- sky blue

- dark teal accents

- subtle paper grain

- subtle print texture

DO NOT make it:

- photorealistic

- 3D

- cyberpunk

- futuristic

- glossy SaaS

- modern Spotify clone

- overly detailed UI

- dark luxury dashboard

The artwork should be the primary visual element.

The UI should feel like it is sitting ON TOP of the illustration.

==================================================

2. BACKGROUND VIDEO / ANIMATION

==================================================

Use a looping video asset as the full-viewport background.

Expected asset:

/assets/bus-loop.mp4

The video should contain:

- old red Maharashtra ST bus interior

- passengers

- conductor

- young man sitting near window

- young man wearing headphones

- Maharashtra landscape outside

- roadside tea stall

- Western Ghats

- old houses

- electricity poles

- passing vehicles

- subtle bus movement

- subtle passenger movement

- hanging handles moving with bus physics

- window reflections

- subtle monsoon atmosphere

The video should be:

autoplay

muted

playsInline

loop

Do NOT add controls to the background video.

Use:

object-fit: cover;

The video should fill the entire viewport without creating scrolling.

Add a very subtle overlay only if required to make UI readable.

Do NOT darken the illustration heavily.

The background must remain bright and colorful.

==================================================

3. MAIN CHARACTER

==================================================

The background illustration/video contains one young male passenger sitting beside the bus window.

He represents the website visitor.

He should be visible but not treated as a hero character.

He is:

- young Indian male

- simple clothing

- sitting naturally

- wearing headphones

- looking outside the window

- listening to music

- calm

- slightly nostalgic

- not looking at camera

- not posing

The viewer should subconsciously think:

"That's me sitting in this bus."

Do not create a separate UI card around him.

He is part of the artwork.

==================================================

4. PAGE STRUCTURE

==================================================

Everything must fit inside:

100vw × 100dvh

Use:

min-height: 100dvh;

height: 100dvh;

overflow: hidden;

Do not allow body scrolling.

Desktop:

Full viewport experience.

Mobile:

Still one viewport.

Adapt the UI responsively without changing the overall concept.

Do NOT stack everything vertically on mobile.

Instead preserve the visual poster composition.

==================================================

5. TOP HEADER

==================================================

Top-left:

BUS.WTF

Use a bold but minimal wordmark.

Under it:

"WINDOW SEAT RADIO"

Small uppercase typography.

Top-right:

[SPOTIFY CONNECT]

[ABOUT]

Keep these extremely subtle.

Do not create a traditional navbar.

No hamburger menu unless absolutely necessary on very narrow mobile screens.

==================================================

6. NOSTALGIC BUS INFORMATION

==================================================

Add small pieces of bus-inspired metadata around the interface.

Example:

08:47 PM

MH • ST

MUMBAI → PUNE

WINDOW SEAT

These should look like tiny bus ticket / route information.

Another small label:

ROUTE 90s

or dynamically:

ROUTE 2000s

depending on the selected decade.

Use subtle monospaced typography.

Do not overuse this.

The interface should remain minimal.

==================================================

7. MAIN TYPOGRAPHY

==================================================

Large central typography should be inspired by the reference image.

Use a strong Indian display typeface.

Possible direction:

Devanagari-inspired typography.

Main text:

"खिडकी वाली सीट"

or:

"खिडकीची सीट"

Smaller English text:

WINDOW SEAT RADIO

The typography should feel like a vintage bus poster.

Do NOT put huge text over the face of the main character.

Use negative space in the illustration.

==================================================

8. DECADE SELECTOR

==================================================

Create a minimal horizontal decade selector.

Options:

60s

70s

80s

90s

00s

10s

20s

Example:

60s   70s   80s   [90s]   00s   10s   20s

The selected decade should have a subtle active state.

Do NOT use large cards.

Do NOT use giant buttons.

Use simple text / pill-like controls.

90s should be selected by default.

When the user selects a decade:

- update the current decade label

- update the playlist context

- update the visible song list / queue

- update the route-style metadata

- update the accent details subtly

Do NOT reload the page.

Do NOT change the background scene dramatically.

==================================================

9. DECADE PERSONALITIES

==================================================

Create these conceptual playlists:

60s:

"Golden Highway"

70s:

"Radio Window"

80s:

"Chai Stop Classics"

90s:

"Last Seat Legends"

00s:

"College Bus"

10s:

"Window Seat Diaries"

20s:

"New Route"

The actual Spotify content should come from Spotify rather than locally stored audio.

==================================================

10. SPOTIFY INTEGRATION

==================================================

IMPORTANT:

Do NOT download, store, or host copyrighted songs locally.

Do NOT create fake audio files.

Use Spotify as the music source.

Implement Spotify OAuth using Authorization Code with PKCE.

The Spotify Client ID should come from an environment variable:

VITE_SPOTIFY_CLIENT_ID

Do not hardcode secrets.

Use Spotify's official Web API for:

- searching tracks

- reading track metadata

- playlists

- current playback state

- user information where necessary

Use the Spotify Web Playback SDK where appropriate for actual browser playback.

The application should gracefully handle users who are not eligible for browser playback.

Spotify Web Playback requires Spotify Premium.

If browser playback is unavailable:

show a minimal message:

"Spotify Premium is required for browser playback."

Provide:

"Open in Spotify"

as the fallback.

Do not break the website.

==================================================

11. SPOTIFY LOGIN

==================================================

Top-right button:

CONNECT SPOTIFY

Click:

Spotify OAuth screen.

After successful authentication:

button becomes:

CONNECTED

Show a very small green status indicator.

Do not show the user's full profile unless needed.

Use Authorization Code + PKCE.

Implement:

- state protection

- PKCE verifier

- token exchange

- token refresh

- logout

- authentication error handling

Never expose a Spotify client secret in frontend code.

==================================================

12. SPOTIFY PLAYER

==================================================

Create a floating Spotify-style music player inspired by the reference screenshot.

Position:

bottom center / bottom-right depending on viewport.

It should look like a physical object floating over the bus illustration.

Use a translucent warm red/brown rounded container.

Not a generic modern dashboard card.

Player contents:

[album artwork]

SONG TITLE

ARTIST

progress bar

previous

play/pause

next

small:

0:31 / 5:03

Add:

shuffle

repeat

volume

Keep secondary controls very subtle.

The main play button should be circular.

Use a Spotify-green accent only where appropriate.

Do NOT reproduce Spotify's entire UI.

This should remain a BUS.WTF-designed player.

==================================================

13. CURRENT SONG

==================================================

When Spotify playback changes, automatically update:

album artwork

song title

artist

duration

progress

play/pause state

Example:

Mujhse Mohabbat Ka

Kumar Sanu

0:31 / 5:03

The player should stay synchronized with Spotify playback.

Use the currently playing track state from Spotify.

==================================================

14. SONG SELECTION

==================================================

When a decade is selected, show a compact list of approximately 5–8 tracks.

Do not create a large playlist page.

Example:

90s

01  Mujhse Mohabbat Ka

    Kumar Sanu

02  Pehla Nasha

    Udit Narayan

03  Aaye Ho Meri Zindagi Mein

    Udit Narayan

04  Dheere Dheere Se

    Kumar Sanu

Each row should be extremely compact.

Clicking a track should start playback when Spotify permits it.

Use Spotify track IDs / URIs rather than local audio files.

If playback is unavailable, provide:

OPEN IN SPOTIFY

==================================================

15. MUSIC DATA ARCHITECTURE

==================================================

Create a clean data structure:

decades.ts

Example conceptual structure:

60s

70s

80s

90s

00s

10s

20s

Each decade contains:

title

subtitle

routeLabel

playlistId OR trackIds

description

Prefer configurable Spotify playlist IDs stored in environment variables or a simple configuration file.

Do NOT hardcode hundreds of tracks into components.

Separate:

music data

Spotify service

player state

UI components

==================================================

16. PLAYLIST EXPERIENCE

==================================================

The website should feel like someone has turned on a bus radio.

When entering the website:

Default decade:

90s

Default state:

paused

Do NOT automatically start copyrighted music without a user interaction.

Show:

"PRESS PLAY TO START THE JOURNEY"

After the user presses play:

start Spotify playback if authorized and permitted.

==================================================

17. BUS DETAILS

==================================================

Add tiny visual details around the interface that reinforce the bus concept.

Examples:

"ST EXPRESS"

"WINDOW SEAT"

"MH"

"ROUTE 47"

"NEXT STOP"

"CHAI BREAK"

"PASSENGERS"

"DEPARTURE 20:47"

"EST. 1990"

"NO RESERVATION"

"LAST SEAT"

These should appear as tiny labels.

Do NOT overcrowd the page.

They should feel like found details on an old bus.

==================================================

18. LIVE BUS STATUS

==================================================

Create a small decorative status:

● 38 PASSENGERS

or:

● 38 ON BOARD

This is a fictional atmospheric element.

Do not connect it to real passenger tracking.

Animate the number very subtly between values if desired.

==================================================

19. VISUAL INTERACTIONS

==================================================

Interactions should be subtle.

Hovering over decade:

slight underline / highlight.

Hovering over song:

small play indicator.

Hovering over bus labels:

tiny shift / fade.

Play:

player button changes state.

Decade change:

playlist contents crossfade smoothly.

Do NOT use excessive animations.

No bouncing UI.

No glassmorphism everywhere.

No neon glow.

No huge cursor effects.

==================================================

20. MUSIC-SYNCHRONIZED VISUALS

==================================================

IMPORTANT:

Do NOT synchronize the background video or visual animation to the Spotify sound recording.

The background video should loop independently.

The website may respond visually to player state only:

playing

paused

loading

stopped

For example:

When playing:

small "ON AIR" indicator.

When paused:

"PAUSED AT THE WINDOW"

Do NOT animate the background video according to song beats or audio waveform.

==================================================

21. MOBILE EXPERIENCE

==================================================

The website must work beautifully on mobile.

Maintain one viewport.

No scrolling.

On mobile:

Background remains full screen.

Player becomes a compact floating bar.

Decade selector becomes horizontally scrollable ONLY within its own small control area if necessary.

The main artwork remains visible.

Do not cover the entire artwork with UI.

The player should resemble the music player shown in the reference image.

Use safe-area padding for phones.

Respect:

env(safe-area-inset-top)

env(safe-area-inset-bottom)

==================================================

22. DESKTOP EXPERIENCE

==================================================

Desktop should feel like a cinematic digital poster.

Background:

100% viewport.

UI distributed around the artwork.

Top-left:

BUS.WTF

Top-center/upper area:

route metadata.

Center:

large nostalgic typography.

Bottom:

Spotify player.

Side/bottom:

decade selector.

Everything should feel intentionally placed.

==================================================

23. TYPOGRAPHY

==================================================

Use two typography families.

DISPLAY:

bold Indian / Devanagari-inspired display font.

BODY:

clean modern sans-serif.

MONOSPACE:

route numbers / bus information.

Possible font direction:

display:

Noto Sans Devanagari / Hind / Mukta

body:

Inter / Geist

mono:

IBM Plex Mono

Use typography sparingly.

==================================================

24. COLOR SYSTEM

==================================================

Primary:

MSRTC-inspired red

Secondary:

warm cream

Accent:

sun yellow

Supporting:

deep green

dusty blue

dark teal

Spotify green should only appear in Spotify-specific states.

Do not make the entire website Spotify green.

The website belongs to BUS.WTF, not Spotify.

==================================================

25. LAYOUT RULES

==================================================

CRITICAL:

NO SCROLL.

NO SECTIONS BELOW THE FOLD.

NO LONG LANDING PAGE.

NO HERO → FEATURES → ABOUT → FOOTER structure.

The entire website IS the hero.

The entire experience should fit inside one viewport.

Think:

"interactive poster"

NOT:

"corporate website"

==================================================

26. UI HIERARCHY

==================================================

Priority order:

1. Background bus artwork/video

2. Main nostalgic typography

3. Spotify player

4. Decade selector

5. Current song

6. Tiny bus metadata

7. Secondary controls

The UI should NEVER overpower the artwork.

==================================================

27. VISUAL QUALITY

==================================================

Make it feel like an Awwwards-level experimental music website.

But keep it minimal.

Focus on:

- spacing

- typography

- composition

- subtle transitions

- visual hierarchy

- high-quality vector artwork

- nostalgic details

Avoid:

- generic gradients

- glassmorphism

- dashboard cards

- excessive shadows

- excessive rounded corners

- excessive icons

- huge buttons

- unnecessary sections

- stock images

- generic music-app design

==================================================

28. ACCESSIBILITY

==================================================

Add:

- keyboard navigation

- visible focus states

- aria labels

- accessible player buttons

- accessible decade selector

- sufficient contrast

- reduced-motion support

If prefers-reduced-motion is enabled:

disable decorative animations while keeping the interface functional.

==================================================

29. COMPONENT ARCHITECTURE

==================================================

Build clean reusable components:

App

BusScene

BusOverlay

RouteMeta

DecadeSelector

DecadePlaylist

SpotifyConnect

SpotifyPlayer

NowPlaying

PlayerControls

SongRow

StatusIndicator

Services:

spotifyAuth

spotifyApi

spotifyPlayer

State:

spotify authentication

current track

isPlaying

progress

selected decade

playlist

volume

shuffle

repeat

Keep components modular.

==================================================

30. ERROR STATES

==================================================

Spotify disconnected:

"CONNECT SPOTIFY"

Spotify Premium unavailable:

"Spotify Premium is required for browser playback."

Playback unavailable:

"OPEN IN SPOTIFY"

No internet:

"THE BUS LOST SIGNAL"

Spotify API error:

"RADIO SIGNAL LOST"

Do not show technical stack traces to users.

==================================================

31. LOADING EXPERIENCE

==================================================

Initial loading screen should be extremely minimal.

Show:

BUS.WTF

"WAITING FOR THE NEXT STOP..."

Then reveal the scene.

Do not use a conventional spinner.

==================================================

32. FINAL EXPERIENCE

==================================================

When the website opens, the user should immediately feel:

"I'm sitting in an old Maharashtra ST bus."

They see:

a bright illustrated Maharashtra landscape

red bus interior

ordinary passengers

a young man with headphones

the conductor

window reflections

route information

small nostalgic typography

Then:

BUS.WTF

WINDOW SEAT RADIO

90s

and the floating music player.

The user chooses:

60s

70s

80s

90s

00s

10s

20s

and discovers music from each era through Spotify.

The website should feel like:

an old bus journey

+

a window seat

+

Bollywood nostalgia

+

Spotify

+

a living illustrated memory.

FINAL DESIGN PHILOSOPHY:

LESS UI.

MORE ATMOSPHERE.

ONE VIEWPORT.

ONE BUS.

ONE WINDOW SEAT.

MANY DECADES OF MUSIC.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://bus-seat-radio.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/11fe6a6d-d989-4b1d-b111-d1c18490d752).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
