# Medusa Store Credit

Give store credit to customers that they can spend in your shop.

<p>
  <a href="./LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue" alt="MedusaWP is released under the MIT license." />
  </a>
  <a href="https://nodejs.org/" target="_blank">
    <img src="https://img.shields.io/badge/Node.js-%5E20-brightgreen" alt="Node.js ^20">
  </a>
  <a href="https://twitter.com/intent/follow?screen_name=Agilo">
    <img src="https://img.shields.io/twitter/follow/Agilo" alt="X (formerly Twitter) Follow">
  </a>
</p>

## Features

- Give store credit to customers that they can spend in your shop.
- Store credit allows customers to make multiple purchases until the credit is exhausted.
- It can be used as a personal refund or compensation card in case there’s a problem with your product or service.

---

## Prerequisites

- [Medusa backend](https://docs.medusajs.com/development/backend/install)

---

## How to Install

1\. Run the following command in the directory of the Medusa backend:

```bash
npm i @agilo/medusa-plugin-store-credit
```

2\. In `medusa-config.js` add the following at the end of the `plugins` array:

```js
const plugins = [
  // ...
  {
    resolve: "@agilo/medusa-plugin-store-credit",
    options: {
      enableUI: true,
    },
  },
];
```

3\. Run the following command in the directory of the Medusa backend to run the migrations:

```bash
npx medusa migrations run
```

---

## Test the Plugin

1\. Start your Medusa backend and admin dashboard, eg.:

```bash
npm run dev
```

2\. todo

3\. todo

## Contributing

We welcome contributions from the community to help make this project even better. Please feel free to open pull requests or issues. Thank you for considering contributing, and we look forward to collaborating with you!

Below you can find the [plugin development guide](#plugin-development) that will help you get started with running Medusa Store Credit in your local environment.

### Plugin Development

#### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Node.js v20](https://nodejs.org/en/download/)
  - We suggest using [nvm](https://github.com/nvm-sh/nvm) or [fnm](https://github.com/Schniz/fnm) to manage your Node.js versions.
- [Yarn v3](https://v3.yarnpkg.com/getting-started/install)
- [Yalc](https://github.com/wclr/yalc)

#### Running Locally

Follow these step-by-step instructions to run the project locally:

1. `git clone https://github.com/Agilo/medusa-plugin-store-credit.git` - clone the monorepo
2. `cd medusa-plugin-store-credit` - position into the project directory
3. `cp .env.example .env` - set up docker-compose environment variables
4. `docker compose up` - start Medusa Docker containers
5. Open a new terminal tab
6. `yarn install && yarn run setup` - install dependencies in all packages
7. `cd packages/medusa && medusa migrations run && cd ../..` - run the migrations
8. `cd packages/medusa && yarn run seed:plugin && cd ../..` - seed the database
9. `yarn run start` - build the packages and start the Medusa dev server and plugin watcher

Medusa Admin is now available at http://localhost:7001 and Medusa Storefront at http://localhost:8000

Default credentials for Medusa Admin are:

```
admin@medusa-test.com
supersecret
```

Once you have the project running locally you can start making changes to the plugin in `packages/medusa-plugin-store-credit/src` and see them reflected in the Medusa Admin and Storefront.

#### Generating migrations

Unfortunately DX when generating migrations which extend or relate to core entities is not great, but here's a workflow that works:

1. `yarn run start` - make sure workflow is running
2. `cp packages/medusa-plugin-store-credit/.env.example packages/medusa-plugin-store-credit/.env` - copy and edit environment variables
3. `cd packages/medusa-plugin-store-credit/src/migrations` - navigate to the plugin dir
4. `npx typeorm migration:generate -d datasource.js src/migrations/StoreCreditUpdate` - this will generate a migration file with a bunch of migrations in `src/migrations/<timestamp>-StoreCreditUpdate.ts`, the migration file will contain migrations for both core medusa entities and your plugin entities. You can now cherry pick the migrations you want to run and delete the rest.
5. In the `packages/medusa` dir run `medusa migrations run`

#### Available Commands

- `yarn run setup` - install dependencies in all packages
- `yarn run start` - build the packages and start the Medusa dev server and plugin watcher
- `yarn run sync` - use yalc to publish and push `medusa-plugin-store-credit` to Medusa backend

#### Docker Services

Docker services are defined in `docker-compose.yml` file.

- `postgres` - PostgreSQL database server for Medusa available on localhost:5432, you can change credentials and port in `.env` and `packages/medusa/.env` files
- `pgadmin` - pgAdmin available on http://localhost:5050
- `redis` - Redis server for Medusa available on localhost:6379

## Additional Resources

- [Medusa Documentation](https://docs.medusajs.com/)
- [Medusa Development Documentation](https://docs.medusajs.com/development/overview)

## License

This project is licensed under the [MIT License](./LICENSE).

## Credits

MedusaWP is developed and maintained by [AGILO](https://agilo.co/).  
Huge thanks to [all contributors](https://github.com/Agilo/medusa-plugin-store-credit/graphs/contributors).
