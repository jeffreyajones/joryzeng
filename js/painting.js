/**
 * painting.js
 * Script for displaying single painting info by id (from paintings.csv)
 * Depends on js/common.js for shared helpers.
 */

// Main logic
function displayPainting() {
  const paintingId = getQueryParam('id');
  const notFound = document.getElementById('not-found');
  const display = document.getElementById('painting-display');
  if (!paintingId || Number.isNaN(Number(paintingId))) {
    display.classList.add('hidden');
    notFound.classList.remove('hidden');
    return;
  }

  Promise.all([
    fetch('paintings.csv').then(r => { if (!r.ok) throw new Error("Cannot load paintings CSV"); return r.text(); }),
    fetch('artists.csv').then(r => { if (!r.ok) throw new Error("Cannot load artists CSV"); return r.text(); })
  ])
  .then(([paintingsCsvText, artistsCsvText]) => {
    const paintings = parseCSV(paintingsCsvText);
    const artists = parseCSV(artistsCsvText);
    const painting = paintings.find(r => r.id === paintingId);
    if (!painting) {
      display.classList.add('hidden');
      notFound.classList.remove('hidden');
      return;
    }

    setField('painting-title', painting.title);
    setField('painting-img', painting.image_path);
    setField('physical-desc', painting.physical_desc);
    setField('artist-desc', painting.artist_desc);
    setField('reviewer-desc', painting.reviewer_desc);
    setField('date-created', painting.date_created);
    setField('location', painting.location);

    // Always get artist name from artists.csv using artist_id
    let artistName = null;
    if (painting.artist_id) {
      const artist = artists.find(a => a.artist_id === painting.artist_id);
      if (artist && artist.name) {
        artistName = artist.name;
      }
    }
    if (painting.artist_id && artistName) {
      setField('artist-link', {
        href: "artist.html?id=" + painting.artist_id,
        text: artistName
      });
    } else {
      setField('artist-link', null);
    }

    display.classList.remove('hidden');
    notFound.classList.add('hidden');
  })
  .catch(() => {
    display.classList.add('hidden');
    notFound.textContent = "Data unavailable.";
    notFound.classList.remove('hidden');
  });
}

globalThis.addEventListener("DOMContentLoaded", displayPainting);