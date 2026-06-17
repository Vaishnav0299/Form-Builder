const express = require("express");
const router = express.Router();

const { submitResponse } = require("../controllers/response.controller");

// POST /api/forms/:id/submit
router.post("/:id/submit", submitResponse);



module.exports = router;