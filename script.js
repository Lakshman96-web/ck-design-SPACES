const header = document.querySelector('.site-header');
const menu = document.querySelector('.menu-toggle');

menu?.addEventListener('click', () => {
  const open = header.classList.toggle('open');
  menu.setAttribute('aria-expanded', open);
});

window.addEventListener('scroll', () => header?.classList.toggle('scrolled', scrollY > 80), { passive: true });

const io = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) {
    entry.target.classList.add('in');
    io.unobserve(entry.target);
  }
}), { threshold: .12 });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));

const SUPABASE_URL = "https://rznpysjqnshssspifxen.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6bnB5c2pxbnNoc3NzcGlmeGVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIwNTI1NTAsImV4cCI6MjA5NzYyODU1MH0.VVWZoHDMIPBRb9V0k28g5bzKHMvUaWNK_MF_fyaUtig";
const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);
console.log(window.supabase);
const form = document.querySelector('#lead-form');

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const { error } = await supabaseClient
    .from('leads')
    .insert([
      {
        name: formData.get('name'),
        email: form.querySelector('input[type="email"]').value,
        phone: form.querySelector('input[type="tel"]').value,
        project_type: form.querySelector('select').value,
        message: form.querySelector('textarea').value
      }
    ]);

  if (!error) {
    const toast = document.querySelector('.toast');
    toast?.classList.add('show');
    form.reset();

    setTimeout(() => {
      toast?.classList.remove('show');
    }, 5000);
  } else {
    alert('Error saving enquiry');
    console.error(error);
  }
});

const portfolioCards = document.querySelectorAll('.gallery-page .project-card');

if (portfolioCards.length) {
  const modal = document.createElement('div');
  modal.className = 'project-modal';
  modal.innerHTML = `
    <button class="modal-close" type="button" aria-label="Close project">×</button>
    <div class="modal-blueprint" aria-hidden="true"></div>
    <div class="modal-board">
      <div class="modal-image"><img alt=""></div>
      <div class="modal-copy">
        <p class="eyebrow"><span></span> Project preview</p>
        <h2></h2>
        <p class="modal-category"></p>
        <p class="modal-description">A closer look at the design language, material mood and spatial composition behind this CK Design Spaces project.</p>
        <a class="button gold" href="contact.html">Start a similar project <span>↗</span></a>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  const modalImg = modal.querySelector('img');
  const modalTitle = modal.querySelector('h2');
  const modalCategory = modal.querySelector('.modal-category');
  const closeProject = () => {
    modal.classList.remove('open');
    document.body.classList.remove('modal-lock');
  };

  portfolioCards.forEach(card => {
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Open ${card.querySelector('h3')?.textContent || 'project'} preview`);

    const openProject = () => {
      const image = card.querySelector('img');
      const title = card.querySelector('h3')?.textContent || 'CK Design Spaces project';
      const category = card.querySelector('.project-meta p')?.textContent || 'Interior design';
      const description = card.dataset.description || 'A closer look at the design language, material mood and spatial composition behind this CK Design Spaces project.';

      modalImg.src = image?.src || '';
      modalImg.alt = image?.alt || title;
      modalTitle.textContent = title;
      modalCategory.textContent = category;
      modal.querySelector('.modal-description').textContent = description;
      modal.classList.add('open');
      document.body.classList.add('modal-lock');
    };

    card.addEventListener('click', openProject);
    card.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openProject();
      }
    });
  });

  modal.querySelector('.modal-close')?.addEventListener('click', closeProject);
  modal.addEventListener('click', event => {
    if (event.target === modal) closeProject();
  });
  window.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeProject();
  });
}
