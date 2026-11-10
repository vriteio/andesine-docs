# Andesine Docs

The source of the [Andesine documentation](https://andesine.app/docs), built with
[Andesine Pages](https://github.com/vriteio/andesine/tree/main/packages/public/pages).

The site reads the published Andesine docs collection when it builds, with AI answers in search.
GitHub Sync keeps a copy in `src/content/docs`, and each publish pushes a commit that rebuilds the
site. Edit the content in Andesine.

```sh
pnpm install
pnpm build
```
