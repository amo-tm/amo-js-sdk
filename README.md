# amo JS SDK

## Overview

amo JS SDK provides the tools you need to develop [amo](https://amo.tm/) applications.

For more information, visit:

- [amo WSC](./packages/wsc/README.md) - The amo WSC lets you embed a conversation from amo in your app.

### Use a module bundler for size reduction

The amo JS SDK is designed to work with module bundlers to remove any unused code (tree-shaking). We strongly recommend using this approach for production apps. Tools such as the [Next.js](https://nextjs.org/), [Angular CLI](https://angular.io/cli), [Vue CLI](https://cli.vuejs.org/), or [Create React App](https://reactjs.org/docs/create-a-new-react-app.html) automatically handle module bundling for libraries installed through npm and imported into your codebase.
