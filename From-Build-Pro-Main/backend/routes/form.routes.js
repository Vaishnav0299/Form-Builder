const express = require("express");
const router = express.Router();
const pool = require("../db");

const {
  createForm,
  getForm,
  getAllForms,
  updateForm
} = require("../controllers/form.controller");

// ✅ CREATE form
router.post("/", createForm);

// ✅ GET all forms
router.get("/", getAllForms);

// ✅ GET responses 
router.get("/:formId/responses", async (req, res) => {
  try {
    const { formId } = req.params;

    const result = await pool.query(
      "SELECT * FROM responses WHERE form_id = $1 ORDER BY created_at DESC",
      [formId]
    );

    console.log("RESPONSES FETCHED:", result.rows);

    res.json(
      result.rows.map(row => ({
        ...row,
        responses: typeof row.responses === "string"
          ? JSON.parse(row.responses)
          : row.responses
      }))
    );

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch responses" });
  }
});


// ✅ GET single form
router.get("/:id", getForm);

// ✅ UPDATE form
router.put("/:id", updateForm);

const { deleteForm } = require("../controllers/form.controller");

// ✅ DELETE form
router.delete("/:id", deleteForm);


module.exports = router;