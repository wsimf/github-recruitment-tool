const express = require('express');
const router = express.Router();

//Test path to check if the Server endpoint is responding
router.get('test', (req, res) => {
  res.status(200);
  res.json({
    "success" : "Server API endpoint is working successfully"
  });
})

module.exports = router;
