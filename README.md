# Rain Glass

Hugo blog theme.

- Home: profile sidebar and post cards
- Post: article card and sticky right TOC
- Background: `raindrop-fx`

## Layout Notes

- The top bar stays in normal document flow; it is not sticky.
- On desktop and tablet layouts, only the post TOC follows scroll.
- `.toc-panel` uses `position: sticky` with `--toc-sticky-offset`.
- `.toc-body` owns vertical scrolling when the TOC is taller than the viewport.
- At `max-width: 980px`, the TOC returns to static document flow.
- Keep `.site-shell` free of vertical overflow clipping so sticky positioning can work.
- `theme.js` adds TOC collapse buttons and active-section highlighting.

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
