# Boulder Culture

The complete original multipage website for https://boulderculture.org, preserved from its ChatGPT Sites deployment.

## Source

- `dist/`: all 23 original HTML pages, photos, styles, gallery and contact-form scripts; includes the nonpartisan student voting banner and homepage section.
- `.openai/hosting.json`: existing ChatGPT Site identity and static publishing directory. Keep this project ID unchanged.
- `index.html`: convenience redirect for repository-root previews.

No dependencies or build step. Serve `dist/` with any static server, for example `python -m http.server 8000 --directory dist`.

## Publishing

Production remains on the original ChatGPT Sites project, with the existing boulderculture.org domain and public audience. GitHub is the complete editable source. A ChatGPT automation publishes merged pull requests to the default branch through the original Site. Direct pushes do not trigger that automation; use a pull request for automatic publication.

The publishing automation validates the Site manifest, copies the source to the original Site repository, packages `dist/`, saves and deploys the exact commit, and checks the live domain. It must retain every existing page and never substitute the earlier single-page draft.

## Voting information

Official Colorado and Boulder County links; no candidate or party endorsements. The election banner expires automatically after November 3, 2026 in America/Denver. Review election-specific section copy before reuse for later elections.

## Contact

leo@boulderculture.org. Boulder Culture Foundation is forming in Colorado, independent of CU Boulder and political campaigns.
