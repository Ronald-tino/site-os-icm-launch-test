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
2. Connect it: `git remote add origin https://github.com/<your-account>/site-os-icm-launch-test.git`
3. The one-time first push of `main` (conventions section 7; only a human runs this, once): `git push --no-verify -u origin main`
4. Switch on branch protection for `main`: GitHub, the repository, Settings, Branches (or Rules), then add a rule for `main`: require a pull request before merging, and block direct pushes.

Note for real client sites: GitHub's free plan offers branch protection only on public repositories. A private client repository needs a paid GitHub plan (Pro or Team) for this step, or the repository stays public (the site's content is public anyway, but `docs/` and `tasks/` then are too). This is a decision for each client site.

## 3. Agent pushes the launch branch [agent, after step 2]
The agent pushes `agent/launch-config` and opens a pull request. It never pushes `main`.

## 4. Connect Netlify [you]
1. app.netlify.com, then Add new project, then Import an existing project, then GitHub, then choose `site-os-icm-launch-test`.
2. Production branch `main`. Netlify reads the publish folder `site` from `netlify.toml` once it is merged; for the very first deploy of `main` (before the merge) set Publish directory to `site` by hand, and leave Build command empty.
3. Under Site configuration, Build and deploy, Branches and deploy contexts: Deploy previews on for pull requests (the default).
4. Deploy. Note the `*.netlify.app` address here: [please fill in later]

## 5. Forms [agent, none]
No forms on this site.

## 6. Web editor sign-in [agent, not chosen]
Not chosen for this site.

## 7. Domain and HTTPS [you, skipped for the test]
A real site adds its domain in Netlify (Domain management) and sets the DNS records Netlify shows at the registrar. HTTPS is automatic.

## 8. Legal pages [agent]
Test site only: the footer says it is a fictional launch test. A real site needs a complete Impressum and a privacy policy naming Netlify as host, with Netlify's data processing agreement in place.

## 9. Launch checks on the deploy preview [agent, after step 4]
Every page loads, no console errors, no request to any third party, security headers present, fonts load from the site itself, and the page works on a phone. Results: [please fill in later]

## 10. Go live [you]
Open the pull request's deploy preview, check it, then merge the pull request yourself. The merge is what publishes.
