const { Readable } = require('stream')

// The following code is based on https://github.com/joeybaker/sequelize-stream,
// with the only modification being that we also pass the `options` object from
// Sequelize. This is important so that we can access the transaction if necessary.
const PREFIX = 'sequelize-stream'
const EVENTS = {
  CREATE: 'create',
  UPDATE: 'update',
  DESTROY: 'destroy',
  // unsupported, just here so we can provide a test case and be alerted if
  // sequelize fixes this in the future.
  BULK_DESTROY: 'bulk destroy',
}

const addHooks = ({ sequelize, stream }) => {
  sequelize.addHook(
    'afterCreate',
    `${PREFIX}-afterCreate`,
    (instance, options) => {
      stream.push({ event: EVENTS.CREATE, instance, options })
    }
  )

  sequelize.addHook(
    'afterBulkCreate',
    `${PREFIX}-afterBulkCreate`,
    (instances, options) => {
      instances.forEach(instance => {
        stream.push({ event: EVENTS.CREATE, instance, options })
      })
    }
  )

  sequelize.addHook(
    'afterUpdate',
    `${PREFIX}-afterUpdate`,
    (instance, options) => {
      stream.push({ event: EVENTS.UPDATE, instance, options })
    }
  )

  sequelize.addHook('afterBulkUpdate', `${PREFIX}-afterBulkUpdate`, options => {
    // this is a hacky way to get the updated rows
    const { model, attributes } = options
    const { updatedAt } = attributes
    return model
      .findAll({ where: { updatedAt }, transaction: options.transaction })
      .then(instances => {
        instances.forEach(instance => {
          stream.push({ event: EVENTS.UPDATE, instance, options })
        })
      })
  })

  sequelize.addHook(
    'afterDestroy',
    `${PREFIX}-afterDestroy`,
    (instance, options) => {
      stream.push({ event: EVENTS.DESTROY, instance, options })
    }
  )

  // sequelize doesn't pass the instances to us, so all we can do is emit a
  // destroy event
  sequelize.addHook(
    'afterBulkDestroy',
    `${PREFIX}-afterBulkDestroy`,
    options => {
      stream.push({ event: EVENTS.BULK_DESTROY, options })
    }
  )
}

module.exports = sequelize => {
  const stream = new Readable({
    objectMode: true,
    read() {},
  })
  addHooks({ sequelize, stream })
  return stream
}
