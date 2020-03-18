# fractal-demo

This monorepo is made as an example for fractal issue to demonstrate a bug.

The monorepo is managed by [Lerna](https://lernajs.io/).

### Installation instructions
1. Run `npm ci` in root. This will install all hoisted dependencies.
2. Run `npm run bootstrap` in root. This will symlink all hoisted and local packages together.
3. To work on a package:
    - Run `npm run dev:project-1` to work on `project-1`.
    - Run `npm run dev:project-2` to work on `project-2`.
