# Asreen Zangana — Portfolio Website

Personal portfolio website for filmmaker and photographer Asreen Zangana.

## Structure

```
asreen-zangana-portfolio/
├── index.html          # Main HTML file
├── css/
│   └── style.css       # All styles
├── js/
│   └── main.js         # Scroll effects & interactions
├── images/             # Add your photos and film stills here
│   ├── about/
│   ├── films/
│   └── photography/
└── README.md
```

## Sections

- **Hero** — Full-screen landing with name and call to action
- **About** — Bio and portrait photo
- **Films** — Grid of film projects with thumbnail, title, and description
- **Photography** — Masonry-style photo gallery
- **Contact** — Email and social links

## How to Update

### Adding a film
In `index.html`, copy a `.film-card` block and update:
- `.film-thumb-placeholder` → replace with `<img src="images/films/your-thumb.jpg" alt="Film Title" />`
- `<h3>` → Film title
- `.film-info` → Year · Genre · Duration
- `<p>` → Short description

### Adding photos
In `index.html`, replace `.photo-placeholder` divs with `<img>` tags:
```html
<img src="images/photography/photo1.jpg" alt="Description" style="width:100%;height:100%;object-fit:cover;" />
```

### Updating contact info
- Change the `href="mailto:..."` link in the Contact section
- Update the Instagram, Vimeo, and LinkedIn `href="#"` links

## Deployment

This is a static site — no build step required.

**GitHub Pages (free hosting):**
1. Push this repo to GitHub
2. Go to Settings → Pages
3. Set source to `main` branch, `/ (root)`
4. Your site will be live at `https://yourusername.github.io/asreen-zangana-portfolio`

**Custom domain:**
Add a `CNAME` file with your domain (e.g. `asreenzangana.com`) and configure DNS with your registrar.

## Fonts

- [Cormorant Garamond](https://fonts.google.com/specimen/Cormorant+Garamond) — headings & name
- [Jost](https://fonts.google.com/specimen/Jost) — body & navigation

Both load from Google Fonts (internet connection required).
