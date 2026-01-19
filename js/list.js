/**
 * list.js
 * Populates the painting list page.
 */

function renderPaintingRow(painting, artist, showArtistCol) {
  // Painting link is to painting.html?id={id}
  // Artist link is to artist.html?id={artist_id}
  const imgCell = document.createElement('td');
  if (painting.image_path) {
    const img = document.createElement('img');
    img.src = painting.image_path;
    img.alt = painting.title || '';
    img.style.maxWidth = '60px';
    img.style.maxHeight = '60px';
    img.onerror = () => { img.src = ''; img.alt = 'No image'; };
    imgCell.appendChild(img);
  }

  const titleCell = document.createElement('td');
  const titleLink = document.createElement('a');
  titleLink.href = `painting.html?id=${painting.id}`;
  titleLink.textContent = painting.title || '';
  titleCell.appendChild(titleLink);

  let artistCell = null;
  if (showArtistCol) {
    artistCell = document.createElement('td');
    if (artist) {
      const artistLink = document.createElement('a');
      artistLink.href = `artist.html?id=${painting.artist_id}`;
      artistLink.textContent = artist.name || '';
      artistCell.appendChild(artistLink);
    }
  }

  const dateCell = document.createElement('td');
  dateCell.textContent = painting.date_created || '';

  const locationCell = document.createElement('td');
  locationCell.textContent = painting.location || '';

  const row = document.createElement('tr');
  row.appendChild(imgCell);
  row.appendChild(titleCell);
  if (showArtistCol) row.appendChild(artistCell);
  row.appendChild(dateCell);
  row.appendChild(locationCell);
  return row;
}

function populatePaintingList() {
  const tableBody = document.querySelector('#paintings-table tbody');
  const noMsg = document.getElementById('no-paintings-msg');
  const tableHeadRow = document.querySelector('#paintings-table thead tr');

  const ARTIST_PARAM = getQueryParam('artist');
  const PAINTINGS_PER_PAGE = 10;

  let paintings = [];
  let artists = [];
  let currentPage = 1;
  let filteredPaintings = [];
  let artistMap = {};
  let totalPages = 1;

  // Build thead appropriately (with or without "Artist" col)
  function updateTableHead(includeArtist) {
    tableHeadRow.innerHTML = '';
    tableHeadRow.appendChild(document.createElement('th')).textContent = "Image";
    tableHeadRow.appendChild(document.createElement('th')).textContent = "Title";
    if (includeArtist) tableHeadRow.appendChild(document.createElement('th')).textContent = "Artist";
    tableHeadRow.appendChild(document.createElement('th')).textContent = "Date";
    tableHeadRow.appendChild(document.createElement('th')).textContent = "Location";
  }

  function renderPagingControls() {
    // Remove old controls
    let oldControls = document.getElementById("pagination-controls");
    if (oldControls) oldControls.remove();

    if (totalPages <= 1) return;
    const controls = document.createElement('div');
    controls.id = "pagination-controls";
    controls.style.textAlign = "center";
    controls.style.margin = "1em 0";

    const prev = document.createElement('button');
    prev.textContent = "Prev";
    prev.disabled = currentPage <= 1;
    prev.onclick = () => { if (currentPage > 1) { currentPage--; renderPage(); } };

    const pageInfo = document.createElement('span');
    pageInfo.textContent = ` Page ${currentPage} of ${totalPages} `;

    const next = document.createElement('button');
    next.textContent = "Next";
    next.disabled = currentPage >= totalPages;
    next.onclick = () => { if (currentPage < totalPages) { currentPage++; renderPage(); } };

    controls.appendChild(prev);
    controls.appendChild(pageInfo);
    controls.appendChild(next);

    tableBody.parentNode.appendChild(controls);
  }

  function renderPage() {
    const showArtistCol = !ARTIST_PARAM;
    updateTableHead(showArtistCol);

    tableBody.innerHTML = '';
    if (filteredPaintings.length === 0) {
      noMsg.classList.remove('hidden');
      renderPagingControls();
      return;
    }
    noMsg.classList.add('hidden');
    // Compute paging
    totalPages = Math.ceil(filteredPaintings.length / PAINTINGS_PER_PAGE) || 1;
    const startIdx = (currentPage - 1) * PAINTINGS_PER_PAGE;
    const pagePaintings = filteredPaintings.slice(startIdx, startIdx + PAINTINGS_PER_PAGE);

    pagePaintings.forEach(painting => {
      const artist = artistMap[painting.artist_id] || null;
      tableBody.appendChild(renderPaintingRow(painting, artist, showArtistCol));
    });

    renderPagingControls();
  }

  Promise.all([
    fetch('paintings.csv').then(r => r.ok ? r.text() : Promise.reject('Paintings CSV failed')),
    fetch('artists.csv').then(r => r.ok ? r.text() : Promise.reject('Artists CSV failed'))
  ])
    .then(([paintingsText, artistsText]) => {
      paintings = parseCSV(paintingsText);
      artists = parseCSV(artistsText);

      // Index artists by id for quick lookup
      artistMap = {};
      for (const artist of artists) {
        artistMap[artist.artist_id] = artist;
      }

      // Filter paintings by artist param if present
      if (ARTIST_PARAM) {
        filteredPaintings = paintings.filter(p => p.artist_id === ARTIST_PARAM);
      } else {
        filteredPaintings = paintings;
      }
      currentPage = 1;
      renderPage();
    })
    .catch(() => {
      tableBody.innerHTML = '';
      noMsg.textContent = "Error loading painting or artist data.";
      noMsg.classList.remove('hidden');
    });
}

globalThis.addEventListener("DOMContentLoaded", populatePaintingList);