# Open Research Platform MVP

Developed by Ethan Arrowood

This repository contains an MVP application for our concept of an open research platform.

The fundamental feature is anonymization of posts. A researcher can create a post and make it _anonymous_ until they'd like to release it with their name. Because posts are retrieved from a server, we can strip away the researchers name before sending it back to the client so it is truly anonymous. Furthermore, a researcher can modify their own post and deanonymize it at any time.

Warning! This application is not meant for actual user data. Do not sign up with your actual email or password. They are not encrypted and are stored in plaintext on the database. Feel free to use this set of fake users:

```
Username: test
Password: abc123
```

```
Username: test2
Password: abc123
```

```
Username: test3
Password: abc123
```

## Set Up

1. Create a HarperDB Instance. Recommend using their Cloud database service.
2. Create a .env file and set these two variables:
	- `HDB_URL` : the HarperDB Cloud database url
	- `AUTH_BOT_PWD` : the password for an authentication super user from HarperDB
3. Run `npm i`

To run locally use:

`npm run dev`

To generate a production build use:

`npm run build`

A test deployment exists at `https://open-research-platform.now.sh/`.

## How its built

The app is built using TypeScript, React, Parcel, and Bootstrap.

The app is based on 3 high level entities: Users, Researchers, Posts. Users are the native HarperDB User objects, these are linked to Researcher profiles which can manage Post entites.

## Key Features

While there is a lot of things to share in the code of this application, these are some of the key features we want to highlight.

### Auth

The client stores the user's session in a custom authentication context that is cached locally with localStorage. The authentication is controlled by HarperDB and uses a custom Sign Up and Sign In flow. The context is provided at the top level of the app so any page or component that needs to use it can import and call the `useAuth` hook:

```ts
import { useAuth } from 'utils/auth'

const { user } = useAuth()
```

### Client Bundler

The client is bundled with a beta module: Parcel 2. Parcel is fast and very easy to configure. The `index.html` file directly imports `index.tsx` and `App.scss` and Parcel is smart enough to load the necessary bundler modules in order to process them.

### HarperDB Service

The server is based mainly on HarperDB (of course), and it does so through a service contained in the `HarperService.ts` file. This file exports a class that contains many CRUD-like methods for the different entities in the app.

## Previously

An initial version of this app utilized a Node.js API based on Fastify. This interfaced with the same database service the client now uses. This piece was removed for sake of simplicity as the server wasn't doing anything of true value. In a more complete application it would probably be more useful.