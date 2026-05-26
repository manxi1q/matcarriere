/* ============================================
   MAT CARRIÈRE — Interactions
   ============================================ */

/* ---------- Année du footer ---------- */
document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- Navigation : style "scrolled" ---------- */
const nav = document.querySelector('.nav');
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (y > 60) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
  lastScroll = y;
}, { passive: true });

/* ============================================
   PARALLAX HERO
   Silhouette + montagnes + collines bougent à des vitesses différentes
   ============================================ */
const parallaxElements = document.querySelectorAll('[data-parallax]');
const hero = document.querySelector('.hero');

function updateParallax() {
  if (!hero) return;
  const scrollY = window.scrollY;
  const heroHeight = hero.offsetHeight;

  // On n'applique le parallax que tant que le hero est visible
  if (scrollY > heroHeight) return;

  parallaxElements.forEach(el => {
    const speed = parseFloat(el.dataset.parallax) || 0.3;
    const translateY = scrollY * speed;
    // La silhouette bouge un peu différemment (descend doucement et fade)
    if (el.classList.contains('hero__silhouette')) {
      const opacity = Math.max(0, 1 - (scrollY / (heroHeight * 0.8)));
      el.style.transform = `translateX(-50%) translateY(${translateY}px) scale(${1 + scrollY * 0.0003})`;
      el.style.opacity = opacity;
    } else {
      el.style.transform = `translateY(${translateY}px)`;
    }
  });
}

let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      updateParallax();
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

updateParallax(); // Initial

/* ============================================
   SPECTACLES — données + génération + auto-effacement
   Les spectacles dont la date est passée disparaissent automatiquement.
   Pour ajouter/modifier un spectacle, éditer le tableau "spectacles" ci-dessous.
   ============================================ */

const spectacles = [
  {
    date: '2026-06-14',
    heure: '20h00',
    salle: 'Festival Country de Gatineau',
    ville: 'Gatineau, QC',
    lien: '#'
  },
  {
    date: '2026-07-05',
    heure: '21h30',
    salle: 'Salle Odyssée — Maison de la Culture',
    ville: 'Gatineau, QC',
    lien: '#'
  },
  {
    date: '2026-07-18',
    heure: '19h00',
    salle: 'Festival western de Saint-Tite',
    ville: 'Saint-Tite, QC',
    lien: '#'
  },
  {
    date: '2026-08-08',
    heure: '20h30',
    salle: 'Bar Le Bistro Nord',
    ville: 'Maniwaki, QC',
    lien: '#'
  },
  {
    date: '2026-09-12',
    heure: '20h00',
    salle: 'Festival des couleurs',
    ville: 'Mont-Tremblant, QC',
    lien: '#'
  },
  {
    date: '2026-10-03',
    heure: '21h00',
    salle: 'Salle Pauline-Julien',
    ville: 'Sainte-Geneviève, QC',
    lien: '#'
  }
];

const moisFR = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'];

function renderShows() {
  const list = document.getElementById('showsList');
  const empty = document.getElementById('showsEmpty');
  if (!list) return;

  // Date d'aujourd'hui à minuit (les spectacles du jour restent visibles)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Filtrer : on garde seulement les dates >= aujourd'hui
  const upcoming = spectacles
    .filter(s => {
      const d = new Date(s.date + 'T00:00:00');
      return d >= today;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  if (upcoming.length === 0) {
    list.hidden = true;
    empty.hidden = false;
    return;
  }

  list.hidden = false;
  empty.hidden = true;

  list.innerHTML = upcoming.map(s => {
    const d = new Date(s.date + 'T00:00:00');
    const jour = d.getDate().toString().padStart(2, '0');
    const mois = moisFR[d.getMonth()];
    const annee = d.getFullYear();

    return `
      <article class="show">
        <div class="show__date">
          <span class="show__date-day">${jour}</span>
          <span class="show__date-month">${mois}</span>
          <span class="show__date-year">${annee}</span>
        </div>
        <div class="show__info">
          <h3 class="show__venue">${s.salle}</h3>
          <p class="show__city">${s.ville}</p>
        </div>
        <div class="show__time">${s.heure}</div>
        <a href="${s.lien}" class="show__action">
          Billets
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
        </a>
      </article>
    `;
  }).join('');
}

renderShows();

/* Re-vérifie une fois par jour (utile pour les sessions très longues) */
setInterval(renderShows, 1000 * 60 * 60 * 12);

/* ============================================
   REVEAL ON SCROLL — légère animation à l'entrée des sections
   ============================================ */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -80px 0px' });

document.querySelectorAll('.about, .shows, .music, .gallery').forEach(el => {
  observer.observe(el);
});
