# raindrop-fx vendor

This folder tracks the upstream source used to refresh the vendored browser bundle.

- Runtime file: `../../static/vendor/raindrop-fx.js`
- Source URL format: `https://raw.githubusercontent.com/SardineFish/raindrop-fx/<ref>/bundle/index.js`
- `Ref` can be a branch, tag, or commit hash.

## Update

```powershell
powershell -ExecutionPolicy Bypass -File .\themes\rain-glass\third_party\raindrop-fx\update.ps1 -Ref master
```

After update:

1. Check the diff for `static/vendor/raindrop-fx.js`.
2. Run `hugo`.
3. Commit the updated vendor files.
