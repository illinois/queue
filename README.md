# queue

### Running locally in `dev` mode:
- Clone the repository
- Install [`node` and `npm`](https://nodejs.org/en/download/package-manager/)
- Install `sqlite3`: `npm install sqlite3` in the `queue` directory
- Install dependencies: `npm install` in the `queue` directory
- In `models/index.js`, uncomment `sequelize.sync({force: true})`
  - Comment this line after the first run if you do not want databases to be dropped and rebuilt on startup
- Start the server: `npm run dev`
  - Access the queue from a browser at `localhost:3000`

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
