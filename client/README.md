# Card Sequence Scanner

Place 3 cards (ArUco markers 1, 2, 3) under the camera. The left-to-right order
selects one of 6 actions.

## Run
    npm install
    npm run dev        # https dev server; open the https://<your-ip>:5173 URL on the phone
                       # (accept the self-signed certificate warning)

## Print cards
Open `/cards.html` in the browser and print at 100% scale (matte paper).

## Customise
- `src/actions.js`  -> the 6 outcomes (title, detail, colour)
- `src/App.jsx`     -> `handleTrigger(sequence)`: put your real action here
- `src/components/CardSequenceScanner.jsx` -> STABLE_FRAMES, LOST_FRAMES, etc.

## Tips
Markers ~25-30 mm on a 48x75 mm card, keep the white border, avoid glare, fixed camera above the cards.
