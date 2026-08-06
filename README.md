# AWS User Group Kolkata — Official Website

[![GitHub Pages](https://img.shields.io/badge/Live-awsugkol.github.io-4721d1?style=flat&logo=github)](https://awsugkol.github.io/)
[![Meetup](https://img.shields.io/badge/Meetup-3,000%2B%20Members-e51937?style=flat&logo=meetup)](https://www.meetup.com/awsugkol/)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-2,000%2B%20Followers-0077b5?style=flat&logo=linkedin)](https://www.linkedin.com/company/awsugkol/)

The official website for **AWS User Group Kolkata (AWSUGKOL)** — an independent, volunteer-led technical community serving cloud architects, developers, and engineers across Kolkata, India since 2016.

## 🌐 Live Site

**[awsugkol.github.io](https://awsugkol.github.io/)**

## ✨ Features

- **Event Listing** — Searchable, paginated display of 80+ community events with automatic date-based styling (upcoming vs past)
- **Volunteer Leaderboard** — Points-based recognition system with badges, Google Sheets integration, and search/filter
- **Organizer Profiles** — Leadership showcase with career timeline and social links
- **Dark & Light Themes** — Full theme toggle with persistent preference
- **10th Anniversary Celebration** — Interactive modal with confetti animation
- **Responsive Design** — Mobile-first with adaptive layouts across all pages
- **AI-Friendly** — `llms.txt`, structured data (JSON-LD), and comprehensive meta tags

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vanilla JavaScript (ES6+), HTML5, CSS3 |
| Fonts | Google Fonts (Inter, Outfit) |
| Icons | Font Awesome 7.0.1 (CDN) |
| Hosting | GitHub Pages |
| Data | Google Sheets CSV (volunteer points), embedded JSON (events) |
| Security | Client-side AES encryption for volunteer vault |

**No build step required.** Edit files directly and push to deploy.

## 📁 Project Structure

```
├── index.html              # Homepage
├── about/                  # About the community
├── events/                 # Full events archive
├── organizers/             # Leadership profiles
├── volunteers/             # Leaderboard & encrypted vault
├── resources/              # Community resources & downloads
├── assets/
│   ├── css/                # Bundled stylesheet
│   ├── js/                 # Homepage, layout, and event logic
│   └── images/             # Logos, badges, icons
├── components/             # Shared header & footer (fetched dynamically)
├── robots.txt              # Search engine & AI crawler directives
├── sitemap.xml             # XML sitemap for indexing
├── llms.txt                # AI agent discovery (llmstxt.org standard)
└── aigentemp/              # Admin utilities (gitignored, not deployed)
```

## 🚀 Development

No dependencies to install. Open any HTML file in a browser to preview:

```bash
# Clone and open
git clone https://github.com/awsugkol/awsugkol.github.io.git
cd awsugkol.github.io
start index.html
```

### Deployment

Push to `main` branch — GitHub Pages deploys automatically via Actions.

```bash
git add .
git commit -m "Update content"
git push origin main
```

## 📊 SEO & Indexing

- **Google/Bing** — XML sitemap, canonical URLs, Open Graph, Twitter Cards, JSON-LD structured data
- **AI Crawlers** — Explicitly allowed in `robots.txt` (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Amazonbot)
- **LLMs** — `llms.txt` provides a concise site summary for AI agents

## 🤝 Community

- **Meetup**: [meetup.com/awsugkol](https://www.meetup.com/awsugkol/)
- **LinkedIn**: [linkedin.com/company/awsugkol](https://www.linkedin.com/company/awsugkol/)
- **Twitter/X**: [@awsugkol](https://x.com/awsugkol)

## 📄 Disclaimer

This is an independent community website. AWS User Group Kolkata is not officially affiliated with Amazon Web Services, Inc. Event details are sourced from Meetup.com and may contain minor inaccuracies.

---

**Established 2016** · Celebrating 10 Years of Cloud Community in Kolkata 🎉
