# cred-system-front-end-app

## Prerequisites

Knowledge: 
- [React with hooks](https://react.dev/reference/react) and [TypeScript](https://react.dev/learn/typescript)
- Familiarity with command line usage
	- IDEs may facilitate this process, but detailed guidance on configuring each IDE is beyond the scope of this guide

Have installed: 
- `node`: version 16 or higher
- `npm`: version 8, already included with `node` installation
- IDE or Text Editor of choice for web development

## Environments

Values in here have B2C auth configuration and other values that are meant to change between stages. Each of the following files have the same keys -- their values differ depending on the configuration that the application should run. For local development purposes, the `.env.development` one is in use.

- `cred-system-front-end-app/.env.development`
- `cred-system-front-end-app/.env.test`
- `cred-system-front-end-app/.env.production`

## Running frontend

### Dependencies Installation

Before executing anything, you need to have the project dependencies installed. Under the `cred-system-front-end-app` directory (where the `package.json` is located) run the following command:

```sh
npm install
```

This will install all the necessary dependencies for the subsequent commands. For a full list of the dependencies used in the project, run `npm list --omit=dev` or open the package.json file to view the `dependecies`, but some highlights are:

- [`react-router`](https://reactrouter.com/en/main): for SPA routing and navigation
- [`react-hook-form`](https://react-hook-form.com/): for managing forms along with React
- [`tanstack/react-query`](https://tanstack.com/query/v4/docs/framework/react/overview): for API data fetching and caching
- [`axios`](https://axios-http.com/docs/intro): for API calls, a popular HTTP client
- [`zustand`](https://docs.pmnd.rs/zustand/getting-started/introduction): for sharing state across different component hierarchies
- [@azure/msal-browser](https://www.npmjs.com/package/@azure/msal-browser "https://www.npmjs.com/package/@azure/msal-browser"): for integrating B2C authentication with the webapp
- [`trussworks/react-uswds`](https://trussworks.github.io/react-uswds/?path=/story/welcome--welcome): off-the-shelf UI library for a consistent design system
- [`tailwindcss`](https://tailwindcss.com/): to apply styles at the component level, avoids multiple stylesheets

Dependencies under the `devDependencies` object are not part of the final build, since they are simply tools for development.

### Run for local development

The project can be ran locally with the following command:

```sh
npm run dev
```

Over `localhost:5173` in your browser, this will run the application with hot reload (when source code changes there is no need for re-running the static build) and it will use the `.env.development` environment variables. 

### Checking for static errors

Running the TypeScript compiler will notify of any errors that may cause failures over CI pipelines. It is recommended to run this command before building the application for any environment stage (dev, prod, etc.).

```sh
npx tsc
```

If no errors were found, the command's output should not return anything.

### Creating build / release version

Executing this command will optimizing the application for deployment by minifying code, eliminating development-specific features, and enhancing performance. This ensures that the final output is error-free application and ready for production use.

```sh
npm run build-prod
```

This command uses the `.env.production` values, there are other `build` commands that use the other environments if you intend to build another static build of another stage. 

After execution, a `dist` folder will be generated that contains the final static webapp assets that can be served to the browser.

### Other commands

To view all the available commands for this project, see the object `scripts` inside the `package.json` or execute the `npm run` command with no arguments. Some of these are meant to run over CI/CD pipelines.

## Folder Structure

### `src/Application` directory

Contains assets that are shared across all frontend views, such as: images, UI components meant to be global, and some utility functions.

### `src/Infrastructure` directory

Responsible of "gluing together" external data repositories with the rest of the frontend application. Contains backend endpoint API functions, global stores for sharing data between components, and other configurations.

### `src/Presentation` directory

Contains the pages, layouts (what surrounds a page, such as headers or footers), and other frontend components that are only meant to rendered under a certain page.

One thing to note, the routing configuration occurs over the `App.tsx` file, this is where the page components map to the browser URLs.
