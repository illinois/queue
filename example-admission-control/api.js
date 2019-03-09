const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const port = process.env.PORT || 4005

app.use(bodyParser.json())

app.post('/', (req, res) => {
  // eslint-disable-next-line no-console
  console.log(req.body)
  if (req.body.topic && req.body.topic.length >= 10) {
    res.status(200).json({ allowed: true })
  } else {
    res
      .status(200)
      .json({ allowed: false, reason: 'Topic must be at least 10 characters' })
  }
})

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Example admission control API listening on port ${port}`)
})
