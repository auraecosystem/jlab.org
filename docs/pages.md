---
title: GitLab Pages
version: 0.1
hide_table_of_contents: false
lastUpdated: 2026-02-02
authors: Anil Panta and Casey Morean (STRIDE team)
---

# GitLab Pages

GitLab Pages lets you publish a **static website** (HTML/CSS/JS or built docs) directly from a repository hosted on `code.jlab.org`.

:::tip What gets published?
GitLab Pages publishes whatever you place in a directory named **`public/`** as a pipeline artifact.
:::

---

## Enable Pages for your project

1. Open your project in GitLab.
2. Go to **Settings → General**.
3. Expand **Visibility, project features, permissions**.
4. Ensure **Pages** is enabled (and set visibility appropriate for your use case).

:::note Visibility matters
If your project is private, Pages behavior depends on your instance configuration and access controls. When in doubt, start with an internal/private setting and adjust after verifying access.
:::

---

## Minimal `.gitlab-ci.yml` example (deploy raw static files)

If your repo already contains static content (for example an `index.html`), this is the simplest working pipeline:

```yaml
pages:
  stage: deploy
  script:
    - mkdir -p public
    - cp -r * public
  artifacts:
    paths:
      - public
  rules:
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
````

✅ Creates `public/`

✅ Copies site files into it

✅ Deploys on the default branch

:::warning Copying “everything”
`cp -r * public` will copy the whole repo contents (including things you may not want published). Prefer copying only the built output directory when you have one.
:::

---

## Example: Build Sphinx docs and publish HTML

This example builds Sphinx documentation and publishes the generated HTML.

```yaml
image: python:3.7-alpine

pages:
  stage: deploy
  before_script:
    - apk add --no-cache make
    - pip install -U sphinx sphinx-rtd-theme sphinx-copybutton
  script:
    - make html
    - mkdir -p public
    - cp -r docs/html/* public/
  artifacts:
    paths:
      - public
  rules:
    - if: $CI_COMMIT_REF_NAME == $CI_DEFAULT_BRANCH
```

---

## Example: Build Docusaurus docs and publish HTML

See [this repository](https://code.jlab.org/scicomp/software/code-gitlab-docs/) on GitLab and accompanying `.gitlab-ci.yml` for an example Docusaurus site.


---

## Where to find your deployed URL

After the pipeline succeeds:
* Your static website will appear at the same URL as the repository with `code` replaced with `pages`
* This website is an example of a pages where the repository is: `https://pages.jlab.org/scicomp/software/code-gitlab-docs/`

---

## References

* GitLab Docs: [GitLab Pages documentation](https://docs.gitlab.com/ee/user/project/pages/)
* Example repository: [https://code.jlab.org/scicomp/software/code-gitlab-docs](https://code.jlab.org/scicomp/software/code-gitlab-docs/)
* Example published site: [https://pages.jlab.org/scicomp/software/code-gitlab-docs](https://pages.jlab.org/scicomp/software/code-gitlab-docs/)
