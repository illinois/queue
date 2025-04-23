# Illinois Open Source Queue

**Disclaimer:** This is a legacy student project repo. Pending longer-term maintenance updates (see outstanding issues) from internal or external collaborators, there may be vulnerabilities and/or bugs.

---

[![Build Status](https://travis-ci.org/illinois/queue.svg?branch=master)](https://travis-ci.org/illinois/queue)

A micro-service queue for holding open office hours.

Join the #queue-general channel on the [UIUC OSS Slack team](https://illinois-oss.slack.com) to keep up with the queue! (Note: You can use the "create an account" option in the corner of the screen as long as you have an `illinois.edu` email address. However, this Slack is little-used as of 2025.)

## Using the Queue at Illinois

At UIUC, this queue is hosted as a free service by Computer Science and EngrIT.

- View the queue at https://queue.illinois.edu/
- [Request to have a queue created for your course by filling out this short form](https://forms.illinois.edu/sec/691281)

## Contribution Guidelines

- Join the #queue-dev channel on the [UIUC OSS Slack team](https://illinois-oss.slack.com) to seek development support
- Claim an issue by commenting on an open issue in order to indicate to others that you are working on the task
- Once you are ready to submit for review make sure to:
  - Include a `CHANGELOG.md` entry following existing format
  - If making API changes, note the change in `API.md`
  - If your change requires new dependencies, add them to `package.json`
  - Tag a lead developer in the reviewers section

If you wish to report a bug, feature request, etc., please open a new issue (first checking that your issue has not already been filed).

## Configuration

The Queue can be configured via a variety of environment variables:

- `PORT`: controls which port the app will be served from.
- `BASE_URL`: allows the app to be served from somewhere other than the server
  root. This affects asset and API routes, websocket endpoints, generated links,
  and more. Note that for this to work effectively, the app must still receive
  the base URL as part of the request; this is important if the app is
  reverse-proxied behind Apache. For instance, if the queue is served from
  `/my/path/`, then you should run with `BASE_URL=/my/path` (note the lack of
  trailing slash), and a request for queue 1 should be received as `/my/path/queue/1`.
- `JWT_SECRET`: a secret key used to sign JSON Web Tokens for our users.
- `UID_NAME`: official name for user ids (default: `email`)
- `UID_ARTICLE`: article used in reference to `UID_NAME` (default: `an`)
- `EPPN_SUFFIX`: the expected suffix for all valid Shibboleth eppn attributes. If this variable is not present, then all Shibboleth responses will be accepted.
- `INSTITUTION_NAME`: to set branding other than 'Illinois'.

There are also a number of environment variables that are used to configure the database connection; see `src/models/index.js` for the list of environment variables that are used. Note that the failure to set `DB_DIALECT` will result in an error like the following:

```
Dialect needs to be explicitly supplied as of v4.0.0
```

Environment variables can be set however you prefer. If you like to store your environment variables in files on disk, the Queue supports [`dotenv-flow`](https://www.npmjs.com/package/dotenv-flow), a variant of the popular `dotenv` library with built-in support for multiple environments and local overrides that aren't tracked by git. Check out the [`dotenv-flow` README](https://www.npmjs.com/package/dotenv-flow#README) for more information on the different config files that can be used and their precedence.

The Queue includes a default `.env.development` file, which points at a local sqlite database. This ensures that local dev mode works out of the box!

## Running the Queue from Source

### Running locally in `dev` mode

- Clone the repository
- Install [`node` and `npm`](https://nodejs.org/en/download/package-manager/)
- Install dependencies: `npm install` in the cloned directory
- Start the server: `npm run dev`
  - Access the queue from a browser at `localhost:3000`
  - You can run it on a different port by setting the `PORT` environment variable

### Builing and running for production

Before running the queue in production mode, ensure you have a `.env.production.local` file containing the relevant database connection details. If you're running in production mode locally for testing, you can simply copy the values from `.env.development` to a `.env.production.local` file.

Run `npm run build` to build assets for production, then run `npm run start` to start the application.
