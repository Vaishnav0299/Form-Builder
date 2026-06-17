const pool = require("../db");

// ✅ Create form
exports.createForm = async (req, res) => {
  try {
    const { title, description, fields } = req.body;

  const formResult = await pool.query(
  "INSERT INTO forms (title, description) VALUES ($1, $2) RETURNING id",
  [title, description]
);

    const form = formResult.rows[0];

    for (let field of fields) {
      await pool.query(
        `INSERT INTO form_fields (form_id, label, type, required, options)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          form.id,
          field.label,
          field.type,
          field.required,
          field.options ? JSON.stringify(field.options) : null,
        ]
      );
    }
    
    console.log("CREATED FORM ID:", form.id);

    res.json({
  id: form.id,
  title,
  description,
  fields
});

  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating form");
  }
};

// ✅ Get single form
exports.getForm = async (req, res) => {
  try {
    const { id } = req.params;

    const form = await pool.query("SELECT * FROM forms WHERE id=$1", [id]);
    const fields = await pool.query(
      "SELECT * FROM form_fields WHERE form_id=$1",
      [id]
    );

    res.json({
      ...form.rows[0],
      fields: fields.rows.map(field => ({
  ...field,
  options: field.options ? JSON.parse(field.options) : null
}))
    });
  } catch (err) {
    console.error("GET FORM ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get all forms
exports.getAllForms = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM forms ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching forms");
  }
};

// ✅ ✅ FIXED: Update form (NOW OUTSIDE)
exports.updateForm = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, fields } = req.body;

    await pool.query(
      "UPDATE forms SET title=$1, description=$2 WHERE id=$3",
      [title, description, id]
    );

    await pool.query("DELETE FROM form_fields WHERE form_id=$1", [id]);

    for (let field of fields) {
      await pool.query(
        `INSERT INTO form_fields (form_id, label, type, required, options)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          id,
          field.label,
          field.type,
          field.required,
          field.options ? JSON.stringify(field.options) : null,
        ]
      );
    }

   res.json({
  id: id,
  title,
  description,
  fields
});


  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update form" });
  }


};

exports.deleteForm = async (req, res) => {
  try {
    const { id } = req.params;

    // delete responses first (important - foreign key)
    await pool.query("DELETE FROM responses WHERE form_id=$1", [id]);

    // delete fields
    await pool.query("DELETE FROM form_fields WHERE form_id=$1", [id]);

    // delete form
    await pool.query("DELETE FROM forms WHERE id=$1", [id]);

    res.json({ message: "Form deleted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete form" });
  }
};