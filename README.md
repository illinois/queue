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
