/**
 * common.js
 * Shared JS helpers for the painting and artist pages
 */

// Get a query string parameter by name
function getQueryParam(name) {
  const regex = new RegExp("[?&]" + name + "=([^&]+)");
  const execResult = regex.exec(globalThis.location.search);
  return execResult ? decodeURIComponent(execResult[1]) : null;
}

// Basic CSV parser with quoted comma support
function parseCSV(data) {
  const lines = data.trim().split(/\r?\n/);
  const headers = lines[0].split(",").map(h => h.trim());
  return lines.slice(1).map(line => {
    // Handle quoted commas
    const tokens = [];
    let cur = '', inQuotes = false;
    for (let i = 0; i < line.length; ++i) {
      const char = line[i];
      if (char === '"' && line[i + 1] !== '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        tokens.push(cur);
        cur = '';
      } else {
        cur += char;
      }
    }
    tokens.push(cur);
    // Remove surrounding quotes and whitespaces
    return Object.fromEntries(headers.map((h, i) => [h, (tokens[i] ?? '').replace(/^"(.*)"$/,'$1').trim()]));
  });
}

// General setField: for string content or hiding element if missing
function setField(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  if (!value) {
    // For <img>, don't set textContent
    if (el.tagName === 'IMG') {
      el.classList.add('hidden');
      el.src = '';
      el.alt = 'Image not available';
    } else {
      el.textContent = '';
      el.classList.add('hidden');
    }
    return;
  }
  el.classList.remove('hidden');
  if (el.tagName === 'IMG') {
    el.src = typeof value === 'object' && value.src ? value.src : value;
    el.alt = (typeof value === 'object' && value.alt) ? value.alt : 'Image';
    el.onerror = () => {
      el.src = '';
      el.alt = 'Image not available';
      el.classList.add('hidden');
    };
  } else if (id === 'artist-link' && typeof value === 'object') {
    el.href = value.href;
    el.textContent = value.text;
  } else {
    el.textContent = value;
  }
}