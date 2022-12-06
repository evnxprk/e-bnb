// backend/routes/api/index.js
const router = require("express").Router();

// backend/routes/index.js
// ...
const apiRouter = require('./api');

router.use('/api', apiRouter);

// backend/routes/api/index.js
// ...

router.post('/test', function(req, res) {
  res.json({ requestBody: req.body });
});

module.exports = router;
