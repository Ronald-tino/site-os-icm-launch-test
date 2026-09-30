---
title: "Launch"
type: plan
updated: 2026-09-29
summary: "How this site goes live: what the agent prepared, and the exact steps for the human. Throwaway launch test of the kit."
---

# Launch: Linden Family Dental (launch test)

Host: **Netlify** (kit default). Git host: **GitHub**, repository `site-os-icm-launch-test`, **public**, because it is a fictional test site. See the note in step 2. Domain: none for the test; the free `*.netlify.app` address is used. Forms: none. Web editor: not chosen.

Agent-done items are marked [agent]. Everything marked [you] publishes something, so only a human does it.

## 1. Host config [agent, done]
- `netlify.toml` on branch `agent/launch-config`: publishes `site/` with no build step, adds security headers and long caching for fonts.
- Fonts are served from `site/fonts/` (conventions section 11), so the live site makes no third-party requests.

## 2. Repository and first push [you]
Run these from this folder, one at a time:
1. Create the empty repository: `gh repo create site-os-icm-launch-test --public --description "Throwaway launch test of the Site OS ICM kit"`
2. Connect it: `git remote add origin https://github.com/Ronald-tino/site-os-icm-launch-test.git`
3. The one-time first push of `main` (conventions section 7; only a human runs this, once): `git push --no-verify -u origin main`
4. Switch on branch protection for `main`: GitHub, the repository, Settings, Branches (or Rules), then add a rule for `main`: require a pull request before merging, and block direct pushes.

Note for real client sites: GitHub's free plan offers branch protection only on public repositories. A private client repository needs a paid GitHub plan (Pro or Team) for this step, or the repository stays public (the site's content is public anyway, but `docs/` and `tasks/` then are too). This is a decision for each client site.

## 3. Agent pushes the launch branch [agent, after step 2]
The agent pushes `agent/launch-config` and opens a pull request. It never pushes `main`.

## 4. Connect Netlify [you]
1. app.netlify.com, then Add new project, then Import an existing project, then GitHub, then choose `site-os-icm-launch-test`.
2. Production branch `main`. Netlify reads the publish folder `site` from `netlify.toml` once it is merged; for the very first deploy of `main` (before the merge) set Publish directory to `site` by hand, and leave Build command empty.
3. Under Site configuration, Build and deploy, Branches and deploy contexts: Deploy previews on for pull requests (the default).
4. Deploy. Address: `https://roaring-duckanoo-e4cf9c.netlify.app` (Netlify project connected by Tobias, 2026-09-29).
5. After the merge of PR #1 (2026-09-29 18:10 UTC) Netlify published the merge commit automatically. On 2026-09-30 at 05:58 the older pre-merge build was published again (probably a "Publish deploy" click in the Deploys list), so production showed 404 until Tobias triggered a fresh production deploy of the merge commit (06:15). Check the Published badge, not only that a deploy exists.

## 5. Forms [agent, none]
No forms on this site.

## 6. Web editor sign-in [agent, not chosen]
Not chosen for this site.

## 7. Domain and HTTPS [you, skipped for the test]
A real site adds its domain in Netlify (Domain management) and sets the DNS records Netlify shows at the registrar. HTTPS is automatic.

## 8. Legal pages [agent]
Test site only: the footer says it is a fictional launch test. A real site needs a complete Impressum and a privacy policy naming Netlify as host, with Netlify's data processing agreement in place.

## 9. Visitor access [you, done]
Netlify protected the whole project by default (HTTP 401 on production and previews). Tobias set Project configuration, General, Visitor access to public, which also makes deploy previews public. Accepted for this fictional test site.

## 9b. Launch checks [agent, done 2026-09-30]
Run from outside, without a login, on the live address:
- `GET /` returns 200, title "Linden Family Dental (launch test)"; HTTP redirects to HTTPS (301); an unknown path returns 404.
- `css/tokens.css`, `fonts/fonts.css` and the woff2 files return 200; fonts are cached with `max-age=31536000, immutable`.
- Headers present: X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy, plus Netlify's HSTS.
- No requests to third parties from the page's own code. Netlify injects `/.netlify/scripts/hud` into public pages (its collaboration toolbar); a real client site switches that off.

## 10. Go live [you]
Open the pull request's deploy preview, check it, then merge the pull request yourself. The merge is what publishes.
