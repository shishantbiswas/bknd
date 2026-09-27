# userbase starter: Next.js
A minimal Next.js (app router) project with userbase integration.

## Project Structure

Inside of your Next.js project, you'll see the following folders and files:

```text
/
├── ...
├── public
├── src
│   ├── app
│   │   ├── (main)
│   │   │   └── ...
│   │   ├── admin
│   │   │   └── [[...admin]]
│   │   │       └── page.tsx
│   │   ├── api
│   │   │   └── [[...userbase]]
│   │   │       └── route.ts
│   │   └── ...
│   └── userbase.ts
└── package.json
```

Here is a quick overview about how to adjust the behavior of `userbase`:
* Initialization of the `userbase` config with helper functions are located at `src/userbase.ts`
* API routes are exposed at `src/api/[[...userbase]]/route.ts`
* Admin UI is rendered at `src/admin/[[...admin]]/page.tsx`

## Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
|:--------------------------|:-------------------------------------------------|
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:3000`      |
| `npm run dev:turbo`       | Starts a local turso dev server                  |
| `npm run build`           | Build your production site                       |

## Want to learn more?

Feel free to check [our documentation](https://docs.userbase.io/integration/nextjs) or jump into our [Discord server](https://discord.gg/952SFk8Tb8).