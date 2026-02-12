# GitLab @ JLab Documentation

This repository contains the GitLab @ JLab documentation site built with
[Docusaurus](https://docusaurus.io/).

Docusaurus is a modern static site generator built on Node.js and React. It
converts Markdown files into a versioned documentation website and produces a
static HTML build suitable for GitLab Pages.

---

## Local development

### 1. Clone the repository

```bash
git clone <this repo>
cd <repo>
````

### 2. Install dependencies

This project uses Node.js 20+.

Install dependencies (only needed once or after dependency updates):

```bash
npm install
```

or, for clean CI-style installs:

```bash
npm ci
```

### 3. Run the local dev server

```bash
npm run start
```

This launches a live-reloading development server. The docs will be available
at:

```
http://localhost:3000
```

Changes to Markdown files automatically refresh the browser.

---

## Build the static site

To generate the production HTML build:

```bash
npm run build
```

The compiled site will be written to:

```
build/
```

This directory contains static HTML assets ready for deployment.

You can preview the production build locally with:

```bash
npm run serve
```

---

## Deployment (GitLab Pages)

The documentation site is automatically deployed using GitLab CI.

The pipeline:

1. Builds the Docusaurus site
2. Moves the compiled output to `public/`
3. Publishes it via GitLab Pages

### CI configuration overview

The CI uses Node 20 and runs two stages

* **build** → compile the Docusaurus site
* **deploy** → publish artifacts to GitLab Pages

The code will only build and deploy on the default branch.  Simplified pipeline:

```yaml
stages:
  - build
  - deploy

build_docs:
  image: node:20
  stage: build
  script:
    - npm ci
    - DEPLOY_ENV=production npm run build
  artifacts:
    paths:
      - build/

pages:
  image: node:20
  stage: deploy
  script:
    - mv build public
  artifacts:
    paths:
      - public
```

No Python, Sphinx, or virtual environments are required anymore.

---

## Writing documentation

Docs are written in Markdown and live in:

```
docs/
```

You can:

* add new Markdown files
* edit existing pages
* include images and diagrams
* use Docusaurus features (admonitions, tabs, versioning)

Example admonition:

```md
:::tip
This is a helpful tip.
:::
```

See the Docusaurus documentation for advanced features:

👉 [https://docusaurus.io/docs](https://docusaurus.io/docs)
