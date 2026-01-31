# ParkNear — Smart Parking (MERN)

ParkNear is a smart parking application that helps users find nearby parking locations, view real-time slot availability by level, and book slots for cars or bikes. The frontend is built with React + Vite and Tailwind CSS. It consumes a REST backend API and supports Google Maps for a richer location experience.

## Demo Flow

- Choose vehicle type (car/bike)
- View nearby locations in a list (Google Map view can be enabled)
- Open a location to view slot availability by level
- Select a slot and proceed with booking
- Confirm booking

## Features

- Vehicle-specific availability (car/bike)
- Nearby locations listing with pricing per hour
- Slot selection grouped by levels
- Responsive UI with Tailwind CSS
- Environment-driven API base URL
- Optional Google Maps integration (markers, info windows)

## Tech Stack

- Frontend: React 18, Vite, Tailwind CSS, React Router
- Maps (optional): @react-google-maps/api
- Backend API: REST (Node.js/Express expected)
- Database (expected): MongoDB via Mongoose

> Note: Backend details may vary in your setup. The frontend expects specific API responses detailed below.

---

## Project Structure (frontend)

```
frontend/
  ├─ src/
  │  ├─ components/
  │  │  ├─ MapView.jsx          // List view + optional Google Map
  │  │  ├─ SlotSelection.jsx    // Slot grid grouped by levels
  │  │  ├─ CarBooking.jsx       // Booking panel for car
  │  │  ├─ BikeBooking.jsx      // Booking panel for bike
  │  ├─ pages/                  // Route-level pages (if present)
  │  ├─ App.jsx                 // Routing
  │  └─ main.jsx                // Vite bootstrap
  ├─ index.html
  ├─ package.json
  └─ .env                       // Vite env vars
```

---

## Requirements

- Node.js 18+
- npm 9+ (or yarn/pnpm)
- A running backend API
- Optional: Google Maps API key

---

## Getting Started

1) Clone the repo
```
git clone https://github.com/kavinkumar1603/parknear.git
cd parknear/frontend
```

2) Install dependencies
```
npm install
```

3) Configure environment variables (frontend/.env)
```
VITE_API_BASE_URL=http://localhost:3000
VITE_GOOGLE_MAPS_API_KEY=YOUR_API_KEY_HERE
```

4) Run the frontend (Windows)
```
npm run dev
```
Open http://localhost:5173 in the browser.

5) Run the backend (example)
```
cd ../backend
npm install
npm run dev
```
Ensure the backend base URL matches `VITE_API_BASE_URL`.

---

## Configuration

### API Base URL
- The frontend reads `VITE_API_BASE_URL`. Default is `http://localhost:3000`.
- Set it in `frontend/.env`.

### Google Maps (optional)
- Map support is present but commented out in `MapView.jsx`.
- To enable:
  - Add `VITE_GOOGLE_MAPS_API_KEY` to `.env`
  - Uncomment the `LoadScript`, `GoogleMap`, `Marker`, and `InfoWindow` code in `MapView.jsx`.

---

## Frontend Routing

- `/map/:vehicleType` — List nearby locations for the selected vehicle type
- `/slots/:locationId` — Slot selection page for a location

Navigation passes state like:
```js
navigate(`/slots/${location._id}`, { state: { location, vehicleType } })
```

---

## API Contract (as used by the frontend)

Your backend should provide endpoints that match these shapes:

### GET /locations/nearby?lat={number}&lng={number}
Response:
```json
[
  {
    "_id": "64f...",
    "name": "Parking Plaza",
    "address": "123 Main St",
    "coordinates": { "lat": 11.0168, "lng": 76.9558 },
    "totalSlots": { "car": 20, "bike": 35 },
    "pricePerHour": { "car": 50, "bike": 20 },
    "distance": "1.2 km"
  }
]
```

### GET /slots/:locationId
Response:
```json
{
  "locationId": "64f...",
  "vehicleType": "car",
  "levels": [
    {
      "level": 1,
      "slots": [
        { "id": "C101", "type": "car", "status": "available" },
        { "id": "C102", "type": "car", "status": "booked" }
      ]
    },
    {
      "level": 2,
      "slots": [
        { "id": "C201", "type": "car", "status": "available" }
      ]
    }
  ]
}
```

### POST /bookings
Body:
```json
{
  "locationId": "64f...",
  "slotId": "C201",
  "vehicleType": "car",
  "startTime": "2026-01-31T10:00:00Z",
  "endTime": "2026-01-31T12:00:00Z"
}
```
Response:
```json
{
  "bookingId": "bkg_123",
  "status": "confirmed",
  "amount": 100
}
```

> Adjust to match your actual backend. The frontend reads fields like `totalSlots`, `pricePerHour`, `coordinates`, `distance`, and slot `id/status`.

---

## UI Details

- Tailwind CSS is used for responsive UI.
- `MapView.jsx` shows a list view by default; Google Map can be enabled.
- Level display in booking components should be derived from slot IDs (e.g., `C201` → level `2`).

---

## Development Notes

- Environment variables must start with `VITE_` to be accessible in the frontend.
- When Google Maps is disabled or unavailable, the list view remains functional.
- Use React Router’s `useNavigate` and route state to pass location and vehicle type.

---

## Troubleshooting

- Blank page or fetch errors:
  - Verify `VITE_API_BASE_URL` points to a running backend.
  - Check CORS settings on the backend.

- Env vars not loading:
  - Ensure `.env` is in `frontend/` and restart `npm run dev`.

- Google Maps not rendering:
  - Confirm `VITE_GOOGLE_MAPS_API_KEY`.
  - Uncomment map code in `MapView.jsx`.

- Level mapping wrong:
  - Ensure level derivation uses the slot ID format (e.g., second character of `B201`/`C201` → `2`).

---

## Build & Deploy

- Production build:
```
npm run build
```
- Preview locally:
```
npm run preview
```

Deploy the built `dist/` to a static host (e.g., Netlify/Vercel). Point the app to the production API via `VITE_API_BASE_URL`.

---

## License

Proprietary or choose a license (e.g., MIT).

---

## Acknowledgements

- React + Vite
- Tailwind CSS
- @react-google-maps/api (optional)
