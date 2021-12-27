# Amo JS SDK

## Overview

Amo JS SDK provides the tools you need to develop [Amo | team messenger](https://amo.tm/) integrations.

For more information, visit:

- [Amo WSC](https://developers.amo.tm/docs) - The Amo WSC lets you embed a conversation page in your app.

### Install the SDK

Install the Amo JS SDK NPM module:

```bash
npm i amo-tm
```

### Use Amo JS SDK package in your app

Amo packages (like Amo WSC) are available to import within individual sub-packages.

The example below shows how you could use the Amo WSC package.

```javascript
import { initializeWscWidget } from 'amo-tm/wsc';
// Follow this pattern to import other Amo packages
// import { } from 'amo-tm/<package>';
```

### Use a module bundler for size reduction

The Amo JS SDK is designed to work with module bundlers to remove any unused code (tree-shaking). We strongly recommend using this approach for production apps. Tools such as the [Next.js](https://nextjs.org/), [Angular CLI](https://angular.io/cli), [Vue CLI](https://cli.vuejs.org/), or [Create React App](https://reactjs.org/docs/create-a-new-react-app.html) automatically handle module bundling for libraries installed through npm and imported into your codebase.
