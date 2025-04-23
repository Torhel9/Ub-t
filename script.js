const dummyData = [
  {
    "Stillingstittel": "Teststilling – Ubåt",
    "Organisasjon": "Forsvaret",
    "Lokasjon": "Bergen",
    "Søknadsfrist": "01.05.2025",
    "Kontakperson": "Carina Johansen",
    "Tlf kontaktperson": "12345678",
    "link": "https://www.finn.no"
  }
];

const jobList = document.getElementById('job-list');

dummyData.forEach(job => {
  const title = job['Stillingstittel'];
  const org = job['Organisasjon'];
  const location = job['Lokasjon'];
  const deadline = job['Søknadsfrist'];
  const link = job['link'];
  const contact = job['Kontakperson'];
  const phone = job['Tlf kontaktperson'].replace(/\s+/g, '');

  const card = document.createElement('div');
  card.className = 'job-card';

  card.innerHTML = `
    <h2>${title}</h2>
    <p><strong>Organisasjon:</strong> ${org}</p>
    <p><strong>Lokasjon:</strong> ${location}</p>
    <p><strong>Søknadsfrist:</strong> ${deadline}</p>
    <div class="button-row">
      <div class="top-buttons">
        <a href="${link}" target="_blank" class="btn">Les mer</a>
        <button class="btn secondary-btn share-btn" data-title="${title}">Del med en venn</button>
      </div>
      <button class="btn book-btn" data-title="${title}" data-phone="${phone}" data-name="${contact}">
        Book omvendt intervju
      </button>
    </div>
  `;

  jobList.appendChild(card);
});
