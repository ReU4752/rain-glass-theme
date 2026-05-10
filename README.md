# Rain Glass

Hugo blog theme.

- Home: profile sidebar and post cards
- Post: article card, sticky right TOC, previous/next navigation, and Disqus comments
- Background: `raindrop-fx`

## Layout Notes

- The top bar stays in normal document flow; it is not sticky.
- On desktop and tablet layouts, only the post TOC follows scroll.
- `.toc-panel` uses `position: sticky` with `--toc-sticky-offset`.
- `.toc-body` owns vertical scrolling when the TOC is taller than the viewport.
- At `max-width: 980px`, the TOC returns to static document flow.
- Keep `.site-shell` free of vertical overflow clipping so sticky positioning can work.
- Markdown tables are wrapped by `layouts/_markup/render-table.html` and scroll horizontally when wider than the article.
- Article Markdown tables use theme-provided borders and header styling.
- Posts in the `posts` section render footer navigation and comments below the article.
- Previous and next post cards are based on Hugo `Pages.Prev` and `Pages.Next`.
- Disqus comments render only when `[services.disqus].shortname` is configured.
- Category terms render as a tree with `root` as the single top-level item.
- Posts with missing, empty, or whitespace-only categories are listed under `root`.
- `theme.js` adds TOC collapse buttons and active-section highlighting.

## Category Options

```toml
[params.categories]
  maxDepth = 1
  rootName = 'root'
```

## Comments

Rain Glass uses Hugo's embedded Disqus partial. Add your Disqus site shortname to the project config:

```toml
[services]
  [services.disqus]
    shortname = 'your-disqus-shortname'
```

Replace `your-disqus-shortname` before deploying.

## Apply

`hugo.toml`

```powershell
theme = 'rain-glass'
```

Run:

```powershell
hugo server
```

## Docs

- Structure and options: `STRUCTURE.md`
