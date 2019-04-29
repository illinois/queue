# Illinois Open Source Queue

[![Build Status](https://travis-ci.org/illinois/queue.svg?branch=master)](https://travis-ci.org/illinois/queue)

A micro-service queue for holding open office hours.

Join the #queue-general channel on the [UIUC OSS Slack team](https://illinois-oss.slack.com) to keep up with the queue!

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

## Running the Queue from Source

### Running locally in `dev` mode:

- Clone the repository
- Install [`node` and `npm`](https://nodejs.org/en/download/package-manager/)
- Install dependencies: `npm install` in the cloned directory
- Start the server: `npm run dev`
  - Access the queue from a browser at `localhost:3000`
  - You can run it on a different port by setting the `PORT` environment variable

### Production config

Run `npm run build` to build assets for production; read more about the build process [in the docs](docs/Build.md). Run `npm run start` to start the application.

Several configuration options are exposed via environment variables:

- `PORT`: controls which port the app will be served from.
- `BASE_URL`: allows the app to be served from somewhere other than the server
  root. This affects asset and API routes, websocket endpoints, generated links,
  and more. Note that for this to work effectively, the app must still receive
  the base URL as part of the request; this is important if the app is
  reverse-proxied behind Apache. For instance, if the queue is served from
  `/my/path/`, then you should run with `BASE_URL=/my/path` (note the lack of
  trailing slash), and a request for queue 1 should be received as `/my/path/queue/1`.
- `JWT_SECRET`: a secret key used to sign JSON Web Tokens for our users.
