# Illinois Open Source Queue

[![Build Status](https://travis-ci.org/illinois/queue.svg?branch=master)](https://travis-ci.org/illinois/queue)

A micro-service queue for holding office hours (with shibboleth identity management)

## Using the Queue at Illinois

At UIUC, this queue is hosted as a free service by Computer Science and EngrIT.

* View the queue at https://edu.cs.illinois.edu/queue/
* [Request to have a queue created for your course by filling out this short form](https://forms.illinois.edu/sec/691281)

## Running the Queue from Source

### Running locally in `dev` mode:

* Clone the repository
* Install [`node` and `npm`](https://nodejs.org/en/download/package-manager/)
* Install `sqlite3`: `npm install sqlite3` in the `queue` directory
* Install dependencies: `npm install` in the `queue` directory
* In `models/index.js`, uncomment `sequelize.sync({force: true})`
  * Comment this line after the first run if you do not want databases to be dropped and rebuilt on startup
* Start the server: `npm run dev`
  * Access the queue from a browser at `localhost:3000`

### Multiple users in dev mode

In production, all auth is done my Shibboleth, and we just read out of the `eppn` header
to get a student's identity. In dev mode, we still want to be able to test with multiple
users (for instance, to assert that user roles work correctly, or to ensue that syncing
between multiple clients works correctly). To achieve that, we use `express-session` to
track users across page reloads. By default, you will assume the role of `dev`, an admin
user. To force a different user, you can append `?forceuser=NETID` to any URL (this creates
a user NETID if needed). All future requests from that browser will be associated with that
user, and you can add it to course staff, etc. like a normal user.

To test with multiple users at the same time, you can open up multiple browsers, or use
multiple incognito windows.

### Production config

Several configuration options are exposed via environment variables:

* `PORT`: controls which port the app will be served from.
* `BASE_URL`: allows the app to be served from somewhere other than the server
  root. This affects asset and API routes, websocket endpoints, generated links,
  and more. Note that for this to work effectively, the app must still receive
  the base URL as part of the request; this is important if the app is
  reverse-proxied behind Apache. For instance, if the queue is served from
  `/my/path/`, then you should run with `BASE_URL=/my/path` (note the lack of
  trailing slash), and a request for queue 1 should be received as `/my/path/queue/1`.
