/**
 * artist.js
 * Script to display a single artist's info by id (from artists.csv)
 */

// Common helpers are now loaded from js/common.js

function displayArtist() {
  const artistId = getQueryParam('id');
  const notFound = document.getElementById('not-found');
  const display = document.getElementById('artist-display');
  if (!artistId || Number.isNaN(Number(artistId))) {
    display.classList.add('hidden');
    notFound.classList.remove('hidden');
    return;
  }

  fetch('artists.csv')
    .then(response => {
      if (!response.ok) throw new Error("Cannot load artists.csv");
      return response.text();
    })
    .then(csvText => {
      const artists = parseCSV(csvText);
      const artist = artists.find(a => a.artist_id === artistId);
      if (!artist) {
        display.classList.add('hidden');
        notFound.classList.remove('hidden');
        return;
      }

      setField('artist-name', artist.name);
      setField('first-name', artist.first_name);
      setField('middle-name', artist.middle_name);
      setField('last-name', artist.last_name);
      setField('date-of-birth', artist.date_of_birth);
      setField('date-of-death', artist.date_of_death);
      setField('city', artist.city);

      // Artist image with fallback handled by setField from common.js
      setField('artist-img', {
        src: `img/artists/${artistId}.jpg`,
        alt: artist.name || 'Artist image'
      });

      // Set link to list.html?artist=n
      const paintingsLink = document.getElementById('artist-paintings-link');
      if (paintingsLink) {
        paintingsLink.href = `list.html?artist=${artistId}`;
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

globalThis.addEventListener("DOMContentLoaded", displayArtist);