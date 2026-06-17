const pool = require("../db");

exports.submitResponse = async (req, res) => {
  try {
    const { id } = req.params;
    const { answers } = req.body;

   /* // 1. Create response
    const responseResult = await pool.query(
  "INSERT INTO form_responses (form_id) VALUES ($1) RETURNING *",
  [formId]
);

const response = responseResult.rows[0];

    // 2. Insert answers
  for (const [fieldId, value] of Object.entries(answers)) {
    await pool.query(
       `INSERT INTO form_response_values (response_id, field_id, value)
        VALUES ($1, $2, $3)`,
       [response.id, fieldId, value]
    );
  }

    res.json({ message: "Submitted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error submitting response");
  }
    */
 console.log("SUBMIT HIT (controller)");
    console.log("formId:", id);
    console.log("answers:", answers);

    const result = await pool.query(
      "INSERT INTO responses (form_id, responses) VALUES ($1, $2) RETURNING *",
      [id, JSON.stringify(answers)]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit response" });
  }
};

