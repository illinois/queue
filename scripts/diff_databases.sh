#!/bin/bash

# Check for the existence of mysqldbcompare
if ! [ -x "$(command -v mysqldbcompare)" ]; then
  echo 'Error: MySQL Utilities are required.' >&2
  echo 'Please install them from https://dev.mysql.com/downloads/utilities/' >&2
  exit 1
fi

# Get the directory we're in
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Set up the verification databases in Node
npx ts-node --project $DIR/../tsconfig.server.json -e "require('$DIR/../src/migrations/util').createVerificationDatabases()"

# Perform the actual diff
mysqldbcompare --server1="queue@localhost" --server2="queue@localhost" --run-all-tests --changes-for=server2 --character-set=utf8 queue_sequelize:queue_migrations
EXIT_CODE=$?

# Destroy the verification databases in Node
npx ts-node --project $DIR/../tsconfig.server.json -e "require('$DIR/../src/migrations/util').destroyVerificationDatabases()"

# Let the user know if the databases diffed cleanly or not
exit $EXIT_CODE
