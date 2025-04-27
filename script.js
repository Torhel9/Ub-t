document.addEventListener('DOMContentLoaded', () => {
  const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS-MFn5hb-J1M5kRB0h8denu5iHYTYma-z6uHUqcIOYMT9dHLLJ7wQ-yBQpPLGKws0nehC0_6p7RaOb/pub?gid=0&single=true&output=csv';
  const jobList = document.getElementById('job-list');
  const pwaUrl = 'https://DINEGITHUBURL.github.io/REPO'; // ← Bytt ut til din GitHub Pages URL

  Papa.parse(csvUrl, {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function(results) {
      const data = results.data;

      data.forEach(job => {
        const title = job['Stillingstittel'];
        const org = job['Organisasjon'];
        const location = job['Lokasjon'];
        const deadline = job['Søknadsfrist'];
        const link = job['link'];
        const contact = job['Kontakperson'];
        const phone = (job['Tlf kontaktperson'] || '').replace(/\s+/g, '');

        const card = document.createElement('div');
        card.className = 'job-card';

        // --- Ny og trygg dato-sjekk
        let deadlineText = '';
        if (deadline) {
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Nullstille klokkeslett

          const parts = deadline.split(/[-/]/);
          const deadlineDate = new Date(parts[0], parts[1] - 1, parts[2]);
          deadlineDate.setHours(0, 0, 0, 0); // Nullstille klokkeslett

          const timeDiff = deadlineDate.getTime() - today.getTime();
          const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

          if (daysLeft === 0) {
            card.classList.add('urgent-today');
            deadlineText = '<p class="warning-text">Søknadsfristen utløper i dag!</p>';
          } else if (daysLeft > 0 && daysLeft <= 7) {
            card.classList.add('urgent-soon');
            deadlineText = `<p class="warning-text">Kort tid igjen – ${daysLeft} dager til frist</p>`;
          }
        }

        card.innerHTML = `
          <h2>${title}</h2>
          <p><strong>Organisasjon:</strong> ${org}</p>
          <p><strong>Lokasjon:</strong> ${location}</p>
          <p><strong>Søknadsfrist:</strong> ${deadline}</p>
          ${deadlineText}
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

      // 📩 Book omvendt intervju (SMS)
      document.querySelectorAll('.book-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const title = btn.dataset.title;
          const phone = btn.dataset.phone;
          const name = btn.dataset.name;
          const message = `Hei ${name}, jeg ønsker å booke et omvendt intervju for stillingen "${title}". Her er noen forslag:\n- [Tidspunkt 1]\n- [Tidspunkt 2]\n- [Tidspunkt 3]\n\nHilsen [Ditt navn]`;
          const smsLink = `sms:${phone}?&body=${encodeURIComponent(message)}`;
          window.location.href = smsLink;
        });
      });

      // 🤝 Del med en venn (popup)
      document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const title = btn.dataset.title;
          const message = `Hei! Jeg tror denne stillingen kunne passe for deg:\n\n${title}\n${pwaUrl}`;

          const popup = document.createElement('div');
          popup.className = 'share-popup';
          popup.innerHTML = `
            <div class="popup-inner">
              <p>Del via:</p>
              <button class="btn" id="share-sms">📩 SMS</button>
              <button class="btn" id="share-messenger">💬 Messenger</button>
              <button class="btn secondary-btn" id="cancel-share">Avbryt</button>
            </div>
          `;
          document.body.appendChild(popup);

          document.getElementById('share-sms').addEventListener('click', () => {
            window.location.href = `sms:?&body=${encodeURIComponent(message)}`;
            popup.remove();
          });

          document.getElementById('share-messenger').addEventListener('click', () => {
            const messengerUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pwaUrl)}&quote=${encodeURIComponent(title)}`;
            window.open(messengerUrl, '_blank');
            popup.remove();
          });

          document.getElementById('cancel-share').addEventListener('click', () => {
            popup.remove();
          });
        });
      });
    },
    error: function(err) {
      console.error('❌ Feil ved CSV-parsing:', err);
      jobList.innerHTML = '<p>Kunne ikke hente stillingsannonser.</p>';
    }
  });
});
