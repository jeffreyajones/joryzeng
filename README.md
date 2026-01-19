# Painting Gallery Web App

This is a simple, data-driven web gallery for paintings and artists. It is built with plain HTML, JavaScript, and CSV data files, designed for easy extensibility and maintenance.

## Features

- **Painting detail page:** View full details for a single painting (`painting.html?id=N`).
- **Artist detail page:** View details and photo for an artist (`artist.html?id=M`), with a link to all their paintings.
- **Gallery list page:** View all paintings, or filter by artist with pagination (`list.html` or `list.html?artist=M`).
- **All data is stored in CSV files:** 
  - Paintings in `paintings.csv`
  - Artists in `artists.csv`
- **Images:** 
  - Paintings: stored per row in `img/`
  - Artists: named by ID in `img/artists/`

## Project Structure

```
/
├── painting.html        # Single painting view
├── artist.html          # Single artist view
├── list.html            # List (gallery) of all paintings, filterable and paginated
├── paintings.csv        # Paintings data
├── artists.csv          # Artists data
├── css/
│   └── styles.css
├── js/
│   ├── common.js        # Shared helpers
│   ├── painting.js      # Logic for painting page
│   ├── artist.js        # Logic for artist page
│   └── list.js          # Logic for painting list page
├── img/
│   ├── [painting images]
│   └── artists/
│       └── [artist_id].jpg
└── .gitignore
```

## Usage & Local Development

**Important:** due to browser security restrictions, you must run an HTTP server (not open the HTML files with `file://`) for the CSV fetches to work.

### Start a local server (Python 3.x)

```
python3 -m http.server
```
Then open `http://localhost:8000/list.html` in your browser.

### Pages

- **All paintings:** [list.html](list.html)
- **Filter to one artist:** [list.html?artist=M](list.html?artist=1) (M is artist_id)
- **Single painting:** [painting.html?id=N](painting.html?id=1)
- **Single artist:** [artist.html?id=N](artist.html?id=1)

You can navigate between artist and painting pages via links in the gallery and detail pages.

### Data Formats

#### `paintings.csv`
```
id,image_path,title,artist_id,physical_desc,artist_desc,reviewer_desc,date_created,location
1,img/starry_night.jpg,Starry Night,1,"Oil on canvas, 29 x 36 in.","A swirling night sky...","A masterpiece...",1889,"Museum of Modern Art, New York"
...
```

#### `artists.csv`
```
artist_id,first_name,middle_name,last_name,name,date_of_birth,date_of_death,city
1,Vincent,,van Gogh,Vincent van Gogh,1853-03-30,1890-07-29,Zundert
...
```
- Store artist photos as `img/artists/[artist_id].jpg`

### Filtering and Pagination

- Go to `list.html` to view all paintings.
- Go to `artist.html?id=N` and click the link to see only that artist's works (`list.html?artist=N`).
- The list page paginates results (10 per page).

### Customization

- Extend CSV headers and add new page elements as needed.
- Images autoscale for gallery use.
- Minimal CSS included; style as needed in `css/styles.css`.

### Dependencies

- Works in any browser.
- Only requirement: an HTTP server for CSV fetches.
~~~~