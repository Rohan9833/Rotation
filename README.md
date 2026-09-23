# Card Sequence App

Phone scans 3 ArUco cards -> the order (6 combinations) is sent to the server -> the
logged-in iPad switches to the matching page in real time.

    client/   Vite + React + Tailwind (login, scanner, display, 6 pages)
    server/   Express + Socket.IO + MongoDB (auth, scan API, realtime)

## 1. Server
    cd server
    cp .env.example .env         # put your MONGO_URI + a long random JWT_SECRET
    npm install
    npm run create-user -- bhai mypassword     # no sign-up: create users here
    npm run dev                  # http://localhost:5000

## 2. Client
    cd client
    npm install
    npm run dev                  # https://<your-ip>:5173 (accept the cert warning)

Open the https URL on both devices, log in with the same user:
- iPad   -> "Display"
- Phone  -> "Scanner"  (each device remembers its mode; "Switch" in the corner changes it)

## Customise
- `client/src/views/Page123.jsx` ... `Page321.jsx` -> the 6 pages (key = order left -> right)
- `client/src/actions.js` -> titles/colours shown in the scanner's bottom panel
- Print cards: `/cards.html` (48x75 mm, marker 28 mm)

## API
    POST /api/auth/login   {username,password} -> {token}
    GET  /api/auth/me
    POST /api/scan         {sequence:"231"}    (Bearer token) -> pushes to user's displays
    Socket.IO auth: {token, role: "display" | "scanner"}; events: sequence, state, presence

## Production (Nginx, same domain for client + API)
    root /var/www/card-app/client/dist;     # after `npm run build`
    location / { try_files $uri /index.html; }
    location /api/ { proxy_pass http://127.0.0.1:5000; proxy_set_header X-Forwarded-For $remote_addr; }
    location /socket.io/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 3600s;
    }
Run the server with `pm2 start src/index.js --name card-app`. HTTPS is required for the camera.
