# Location Tracker

A lightweight, mobile-first web app for tracking locations with treatment status.

## Features

- ✅ Add locations with address, date, description
- ✅ Track treatment status and treatment date
- ✅ Built-in geolocation capture (GPS)
- ✅ Edit and delete entries
- ✅ Filter by treatment status
- ✅ Mobile-optimized UI
- ✅ No authentication required - open access
- ✅ Data stored in local JSON file

## Tech Stack

- **Backend**: Node.js + native HTTP module (no dependencies)
- **Frontend**: Vanilla JavaScript + HTML/CSS (no build tools)
- **Data**: JSON file storage

## Quick Start

### Local Development

1. **Install Node.js** (if not already installed)
   - Download from https://nodejs.org

2. **Start the server**
   ```bash
   node backend.js
   ```

3. **Open in browser**
   - Visit http://localhost:3000

### Files

- `backend.js` - Express-less HTTP server with CRUD endpoints
- `index.html` - Complete frontend (single HTML file)
- `package.json` - Project metadata
- `entries.json` - Auto-created data file (no setup needed)

## Usage

### Adding an Entry

1. Fill in the address (manual or auto-captured via GPS)
2. Select the date found
3. Add a brief description
4. Check "Treated / Addressed" if applicable
5. If treated, select the treatment date
6. Click "Add Entry"

### Editing an Entry

1. Click "Edit" on any entry card
2. Update the fields
3. Click "Save Changes"

### Filtering

- **All** - Show all entries
- **Untreated** - Show only entries marked untreated
- **Treated** - Show only entries marked treated

### Geolocation

- Click the 📍 button next to the address field
- Grant permission to access your location
- Coordinates auto-populate and address is reverse-geocoded (when available)

## Deployment

### Option 1: Railway (Recommended)

1. Push files to GitHub repo
2. Go to https://railway.app
3. Create new project → Connect GitHub repo
4. Set start command: `node backend.js`
5. Deploy

Your app will be live at: `https://your-project.railway.app`

### Option 2: Render

1. Push files to GitHub repo
2. Go to https://render.com
3. Create new "Web Service" → Connect GitHub repo
4. Set build command: (leave empty)
5. Set start command: `node backend.js`
6. Deploy

### Option 3: Replit

1. Create new Replit project
2. Upload `backend.js` and `index.html`
3. Click "Run"
4. Share the generated URL

### Option 4: Self-hosted VPS

1. SSH into your server
2. Clone repo or upload files
3. `node backend.js`
4. Use nginx/Apache as reverse proxy (optional)

## API Endpoints

### GET /api/entries
Fetch all entries

```bash
curl http://localhost:3000/api/entries
```

### POST /api/entries
Create new entry

```bash
curl -X POST http://localhost:3000/api/entries \
  -H "Content-Type: application/json" \
  -d '{
    "address": "123 Main St",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "description": "Found invasive species",
    "entryDate": "2026-05-02",
    "treated": false,
    "treatmentDate": null
  }'
```

### PATCH /api/entries/:id
Update entry

```bash
curl -X PATCH http://localhost:3000/api/entries/1234567890 \
  -H "Content-Type: application/json" \
  -d '{"treated": true, "treatmentDate": "2026-05-02"}'
```

### DELETE /api/entries/:id
Delete entry

```bash
curl -X DELETE http://localhost:3000/api/entries/1234567890
```

## Data Storage

Entries are stored in `entries.json`. Each entry contains:

```json
{
  "id": "1234567890",
  "address": "123 Main St",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "description": "Description of location",
  "entryDate": "2026-05-02",
  "treated": false,
  "treatmentDate": null,
  "createdAt": "2026-05-02T12:34:56.789Z",
  "updatedAt": "2026-05-02T12:34:56.789Z"
}
```

## Limitations

- **JSON storage** - Works great for ~1000 entries, slower beyond that
- **No offline support** - Requires internet connection
- **No real-time sync** - Refresh page to see new entries from others
- **Single server** - Not designed for 100k+ concurrent users

## Future Enhancements

1. Map view of locations
2. Bulk edit (select multiple, mark treated)
3. CSV export
4. Advanced filters (date range, search)
5. SQLite or PostgreSQL upgrade
6. User authentication (if needed)
7. Offline sync with Service Workers

## Troubleshooting

### Port already in use
Change the PORT:
```bash
PORT=3001 node backend.js
```

### CORS errors
The API is configured to accept requests from any origin. If issues persist, check the backend CORS headers.

### Geolocation not working
- Make sure you're on HTTPS (or localhost)
- Grant permission when browser requests it
- Check browser console for errors

### Entries not persisting
- Check that `entries.json` exists in the same directory as `backend.js`
- Verify write permissions on the directory

## License

MIT
