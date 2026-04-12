# Rain Glass Structure

## Overview

`rain-glass` is a Hugo blog theme.

- Home: profile sidebar and post list
- Post: article card and right TOC
- Background: `raindrop-fx`

## Folder Layout

```text
themes/rain-glass/
  layouts/
    _default/
      baseof.html
      list.html
      single.html
      term.html
      terms.html
    partials/
      article-meta.html
      head.html
      header.html
      home-sidebar.html
      post-card.html
    index.html
  static/
    css/
      theme.css
    images/
      avatar-default.svg
      rain-background.png
    js/
      theme.js
    vendor/
      raindrop-fx.js
  i18n/
    en.toml
    ko.toml
  third_party/
    raindrop-fx/
      README.md
      VERSION
      SHA256
      SOURCE.txt
      update.ps1
  README.md
  STRUCTURE.md
  theme.toml
```

## Main Files

### `layouts/_default/baseof.html`

- Shared page layout
- Includes static background layer and FX canvas
- Includes top bar and page content area

### `layouts/index.html`

- Home page layout
- Renders hero post and post list

### `layouts/_default/single.html`

- Single post layout
- Renders article content and `.TableOfContents`

### `layouts/partials/home-sidebar.html`

- Home sidebar
- Renders profile info
- Renders `categories` and `tags` from taxonomies

### `static/css/theme.css`

- Main theme styles
- Defines glass cards, layout, top bar, background, responsive rules

### `static/js/theme.js`

- Initializes `raindrop-fx`
- Controls static background and FX transition
- Handles resize

### `static/vendor/raindrop-fx.js`

- Vendored runtime bundle loaded by the theme

### `third_party/raindrop-fx/`

- Vendor update metadata and update script

## Config Options

### Base Hugo Config

```toml
theme = 'rain-glass'
languageCode = 'ko-kr'
defaultContentLanguage = 'ko'
```

### Taxonomies

```toml
[taxonomies]
tag = 'tags'
category = 'categories'
```

- Sidebar category and tag sections use these taxonomies.

### `menu.main`

```toml
[menu]
  [[menu.main]]
    name = 'Home'
    pageRef = '/'
```

- Top navigation reads `menu.main`.
- Current example: `Home`, `About`, `Categories`, `Tags`

### `params.description`

```toml
[params]
  description = 'Site description'
```

- Used for the default meta description.

### `params.profile`

```toml
[params.profile]
  name = 'Your name'
  avatar = '/images/avatar.png'
  bio = 'Short bio'
```

- `name`: sidebar name and default author name
- `avatar`: sidebar avatar image
- `bio`: sidebar profile text

### `params.background`

```toml
[params.background]
  image = '/images/rain-background.png'
  raindropEnabled = true
```

- `image`: static background and FX background source
- `raindropEnabled`: enables or disables the rain effect

## Content Front Matter

Post front matter used by the theme:

```toml
title = 'Post title'
date = '2026-04-13T01:09:18+09:00'
description = 'Post description'
tags = ['Guide', 'WebGL']
categories = ['CSS']
cover = '/images/cover.png'
draft = false
```

- `title`: post title
- `date`: publish date
- `description`: card and article summary
- `tags`: tag taxonomy
- `categories`: category taxonomy
- `cover`: card or hero background image

## i18n Keys

- `recent_posts`
- `categories`
- `tags`
- `contents`
- `no_posts`
- `no_terms`

## `raindrop-fx` Vendor Management

Runtime file:

```text
static/vendor/raindrop-fx.js
```

Update metadata and script:

```text
third_party/raindrop-fx/
```

Update command:

```powershell
powershell -ExecutionPolicy Bypass -File .\themes\rain-glass\third_party\raindrop-fx\update.ps1 -Ref master
```
