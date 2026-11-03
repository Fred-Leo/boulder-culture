# Boulder Culture

A public, multipage website helping CU Boulder students and Boulder residents find free local gatherings, learn what Boulder Culture is planning, and contact the organizer.

**[Live website](https://boulderculture.org/)** · **[Gatherings](https://boulderculture.org/gatherings)** · **[Source](https://github.com/Fred-Leo/boulder-culture)**

Boulder Culture Foundation is forming in Colorado. It is independent of CU Boulder and political campaigns. The site distinguishes existing local events from proposed gatherings and gives student voting information its own page.

## Architecture and stack

This is a buildless static site. Files in `dist/` are the editable production source, despite the conventional build-output directory name. There is no framework, package installation, database, authentication, or application server.

| Layer | Implementation |
| --- | --- |
| Pages | Semantic HTML documents with direct page-to-page navigation |
| Presentation | Shared CSS, responsive grids, media queries, and CSS gallery animation |
| Interaction | Browser JavaScript using DOM events, Fetch, FormData, and AbortController |
| Contact delivery | External FormSubmit service; native HTML POST fallback |
| Hosting | Existing public ChatGPT Sites deployment and custom domain |
| Verification | Python standard library, Node.js syntax checks and behavior checks |

### Repository map

| Path | Responsibility |
| --- | --- |
| `dist/*.html` | Homepage, gatherings, activity details, About, contact, voting, and legacy redirects |
| `dist/style.css` | Shared layout, typography, gallery, forms, and responsive styles |
| `dist/voting.css` | Voting page, election notice, branding, and homepage introduction styles |
| `dist/form.js` | Form validation, duplicate-send prevention, timeout, and submission feedback |
| `dist/gallery.js` | Pause/play control for the animated photo gallery |
| `dist/election.js` | Election-banner expiry using the America/Denver calendar date |
| `dist/countdown.js` | Student voting deadline display and timer cleanup |
| `dist/assets/` | Logo and activity photographs; see `dist/photos.html` for credits |
| `.openai/hosting.json` | Existing Site identity and static publishing directory |
| `scripts/` | Dependency-free repository and interaction checks |
| `docs/engineering-audit.md` | Findings, fixes, verification scope, and remaining work |
| `index.html` | Convenience redirect for repository-root previews |

## Local setup

Prerequisites: Git, Python 3.9+, and Node.js 18+ for checks. Only Python is needed to serve the site.

```bash
git clone https://github.com/Fred-Leo/boulder-culture.git
cd boulder-culture
python3 -m http.server 8000 --bind 127.0.0.1 --directory dist
```

Open [http://127.0.0.1:8000/](http://127.0.0.1:8000/). Use the `.html` links in local development; the Python server does not emulate production extensionless routes. Stop the server with Ctrl+C. Edit files directly and refresh the browser.

### Environment configuration

No `.env` file, API key, or environment variable is required. Do not place credentials in browser-delivered files.

- Contact forms declare the public FormSubmit destination in their HTML `action`. `form.js` derives the AJAX endpoint from that action. Update all three forms together when changing the recipient.
- FormSubmit must be activated by the recipient before delivery works. Activation is external to this repository. A successful provider response confirms submission, not inbox delivery.
- Election dates are explicit in `election.js`, `countdown.js`, and the voting HTML. Review all three before reusing the page for another election. Banner expiry does not remove the voting page or update its factual content.
- Preserve the `project_id` and `static.directory` in `.openai/hosting.json` when publishing to the existing site.

## Validation

Run from the repository root:

```bash
python3 scripts/check.py
node scripts/check-behavior.cjs
git diff --check
```

The structural check covers local HTML references and fragments, duplicate IDs and attributes, image alt attributes, JavaScript syntax, and debug statements. Behavior checks exercise Colorado banner expiry, countdown completion and interval cleanup, and contact success, inactive-recipient, timeout, and network-failure paths with controlled substitutes.

These checks do not replace browser QA. Before publication, check mobile and desktop navigation, keyboard focus, gallery pause/play, reduced-motion behavior, and form feedback. Verify a real contact delivery only with the recipient's involvement; automated checks never send messages.

## Deployment

Production is served by the original ChatGPT Sites project, `appgprj_6ad272c27fac8191905a5646509ed3a3`, at [boulderculture.org](https://boulderculture.org/). GitHub holds the editable source. GitHub Pages is not the production host.

1. Create a branch, edit `dist/`, and run the validation commands.
2. Commit, push the branch, and open a pull request against `main`.
3. Review and merge the pull request. The existing external ChatGPT publishing automation is configured to respond to merged pull requests. Direct pushes do not trigger it.
4. The publisher synchronizes the source into the original Site repository, packages `dist/`, saves a version, and deploys it while retaining the domain and public audience.
5. Check the deployment result and the changed pages on the live domain. A GitHub commit alone does not establish that production changed.

The publishing automation and its credentials are managed outside this repository. A clone cannot publish by itself, and there is no repository-owned GitHub Actions deployment workflow. If automation fails, use the Sites publishing workflow for the same project ID; do not create a replacement site or substitute an earlier single-page export.

## Engineering decisions and takeaways

- **Static HTML for a small content site.** Direct links and server-delivered content keep navigation usable without client-side routing or a JavaScript bundle. The tradeoff is repeated page markup that must be maintained consistently.
- **Progressive enhancement.** Forms retain their HTML POST action. JavaScript adds inline feedback, a honeypot check, duplicate-send prevention, and a 20-second timeout. Failures retain the visitor's text and provide a direct email alternative.
- **Shared assets instead of copied behavior.** The homepage uses the same stylesheet as other pages. Election expiry is centralized, and form code loads only where a form exists.
- **Explicit time semantics.** Banner expiry uses Colorado's calendar date; the countdown uses an absolute instant matching 7 p.m. MST on November 3, 2026. Tests cover both boundaries independently.
- **Accessible interaction.** The implementation includes skip links, focus styles, labeled forms, live submission feedback, a gallery motion control, and reduced-motion CSS. These features are implementation choices, not a claim of WCAG certification.
- **Compatibility during cleanup.** Historical redirect pages remain because existing external links may depend on them. Removing an unlinked route requires more evidence than an internal-link scan.

The audit demonstrates practical frontend maintenance: tracing shared behavior, reducing duplication without changing page content, checking failure paths, and documenting deployment boundaries honestly. Future improvements include generated shared headers/footers, a single event data source, automated browser coverage, and CI running the existing checks.

## Contact

Created by Leo Helzberg. Questions or ideas: [leo@boulderculture.org](mailto:leo@boulderculture.org).
