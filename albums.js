/**
 * Album Stack Component
 * ----------------------
 * Usage: See photography section in index.html
 * Each .album-stack holds data-title and child .album-card elements.
 * Hover → jiggle. Click stack → expand grid. Click image → lightbox.
 */

class AlbumStack {
  constructor(el) {
    this.el = el;
    this.title = el.dataset.title || 'Album';
    this.images = Array.from(el.querySelectorAll('.album-card'));
    this.expanded = false;
    this._bind();
  }

  _bind() {
    this.el.addEventListener('click', (e) => {
      if (!this.expanded) {
        e.stopPropagation();
        this.expand();
      }
    });
  }

  expand() {
    this.expanded = true;
    this.el.classList.add('is-open');

    // Build overlay
    const overlay = document.createElement('div');
    overlay.className = 'album-overlay';

    const inner = document.createElement('div');
    inner.className = 'album-overlay-inner';

    const header = document.createElement('div');
    header.className = 'album-overlay-header';
    header.innerHTML = `<span class="album-overlay-title">${this.title}</span>
      <button class="album-close" aria-label="Close album">&#x2715;</button>`;

    const grid = document.createElement('div');
    grid.className = 'album-overlay-grid';

    this.images.forEach((card, i) => {
      const img = card.querySelector('img') || card;
      const item = document.createElement('div');
      item.className = 'album-overlay-item';
      item.style.animationDelay = `${i * 0.05}s`;

      // Clone the image or placeholder
      const clone = img.tagName === 'IMG'
        ? img.cloneNode()
        : (() => { const d = document.createElement('div'); d.className = 'album-ph'; return d; })();
      item.appendChild(clone);
      item.addEventListener('click', () => this._openLightbox(i));
      grid.appendChild(item);
    });

    inner.appendChild(header);
    inner.appendChild(grid);
    overlay.appendChild(inner);
    document.body.appendChild(overlay);

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    // Close button
    overlay.querySelector('.album-close').addEventListener('click', () => this.close(overlay));

    // Click outside inner to close
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) this.close(overlay);
    });

    // Esc key
    this._onKeydown = (e) => { if (e.key === 'Escape') this.close(overlay); };
    document.addEventListener('keydown', this._onKeydown);

    // Animate in
    requestAnimationFrame(() => overlay.classList.add('visible'));
  }

  close(overlay) {
    overlay.classList.remove('visible');
    overlay.addEventListener('transitionend', () => {
      overlay.remove();
      document.body.style.overflow = '';
    }, { once: true });
    this.el.classList.remove('is-open');
    this.expanded = false;
    document.removeEventListener('keydown', this._onKeydown);
    if (this._lightbox) { this._lightbox.remove(); this._lightbox = null; }
  }

  _openLightbox(index) {
    if (this._lightbox) this._lightbox.remove();

    const lb = document.createElement('div');
    lb.className = 'album-lightbox';
    this._lightbox = lb;
    this._lbIndex = index;

    const img = this.images[index].querySelector('img');
    const content = document.createElement('div');
    content.className = 'album-lightbox-content';

    const display = img
      ? (() => { const i = img.cloneNode(); i.className = 'lb-img'; return i; })()
      : (() => { const d = document.createElement('div'); d.className = 'lb-ph'; return d; })();

    const prev = document.createElement('button');
    prev.className = 'lb-nav lb-prev'; prev.innerHTML = '&#8592;';
    const next = document.createElement('button');
    next.className = 'lb-nav lb-next'; next.innerHTML = '&#8594;';
    const close = document.createElement('button');
    close.className = 'lb-close'; close.innerHTML = '&#x2715;';
    const counter = document.createElement('span');
    counter.className = 'lb-counter';
    counter.textContent = `${index + 1} / ${this.images.length}`;

    content.appendChild(display);
    lb.appendChild(prev);
    lb.appendChild(content);
    lb.appendChild(next);
    lb.appendChild(close);
    lb.appendChild(counter);
    document.body.appendChild(lb);

    requestAnimationFrame(() => lb.classList.add('visible'));

    const go = (dir) => {
      this._lbIndex = (this._lbIndex + dir + this.images.length) % this.images.length;
      const newImg = this.images[this._lbIndex].querySelector('img');
      content.classList.add('lb-fade');
      setTimeout(() => {
        content.innerHTML = '';
        const newDisplay = newImg
          ? (() => { const i = newImg.cloneNode(); i.className = 'lb-img'; return i; })()
          : (() => { const d = document.createElement('div'); d.className = 'lb-ph'; return d; })();
        content.appendChild(newDisplay);
        counter.textContent = `${this._lbIndex + 1} / ${this.images.length}`;
        content.classList.remove('lb-fade');
      }, 180);
    };

    prev.addEventListener('click', (e) => { e.stopPropagation(); go(-1); });
    next.addEventListener('click', (e) => { e.stopPropagation(); go(1); });
    close.addEventListener('click', (e) => { e.stopPropagation(); lb.remove(); this._lightbox = null; });
    lb.addEventListener('click', (e) => { if (e.target === lb) { lb.remove(); this._lightbox = null; } });

    // Swipe support
    let startX = null;
    lb.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', (e) => {
      if (startX === null) return;
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
      startX = null;
    });

    // Arrow keys (on top of existing esc listener)
    const lbKey = (e) => {
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'Escape') { lb.remove(); this._lightbox = null; document.removeEventListener('keydown', lbKey); }
    };
    document.addEventListener('keydown', lbKey);
  }
}

// Init all stacks
document.querySelectorAll('.album-stack').forEach(el => new AlbumStack(el));
