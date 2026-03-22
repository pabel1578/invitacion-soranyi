const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { Pool } = require("pg");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

pool.connect()
  .then(client => {
    console.log("Conectado correctamente a PostgreSQL");
    client.release();
  })
  .catch(err => {
    console.error("Error conectando a PostgreSQL:", err.message);
  });

app.get("/", (req, res) => {
  res.json({
    ok: true,
    message: "Backend de invitación funcionando"
  });
});

app.post("/api/rsvps", async (req, res) => {
  try {
    const { full_name, phone, attendance, guests_count, message } = req.body;

    if (!full_name || !attendance || !guests_count) {
      return res.status(400).json({
        error: "full_name, attendance y guests_count son obligatorios."
      });
    }

    const query = `
      INSERT INTO public.rsvps (full_name, phone, attendance, guests_count, message)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const values = [
      full_name,
      phone || null,
      attendance,
      Number(guests_count),
      message || null
    ];

    const result = await pool.query(query, values);

    res.status(201).json({
      ok: true,
      message: "Confirmación guardada correctamente.",
      data: result.rows[0]
    });
  } catch (error) {
    console.error("Error guardando RSVP:", error);
    res.status(500).json({
      error: error.message
    });
  }
});

app.get("/api/rsvps", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM public.rsvps
      ORDER BY created_at DESC
    `);

    res.json({
      ok: true,
      total: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error("Error obteniendo RSVPs:", error);
    res.status(500).json({
      error: "No se pudieron obtener las confirmaciones."
    });
  }
});

app.get("/api/rsvps/stats", async (req, res) => {
  try {
    const totalConfirmed = await pool.query(`
      SELECT COALESCE(SUM(guests_count), 0) AS total
      FROM public.rsvps
      WHERE attendance = 'Sí asistiré'
    `);

    const totalNo = await pool.query(`
      SELECT COUNT(*) AS total
      FROM public.rsvps
      WHERE attendance = 'No podré asistir'
    `);

    const totalYes = await pool.query(`
      SELECT COUNT(*) AS total
      FROM public.rsvps
      WHERE attendance = 'Sí asistiré'
    `);

    const totalRecords = await pool.query(`
      SELECT COUNT(*) AS total
      FROM public.rsvps
    `);

    res.json({
      ok: true,
      stats: {
        total_people_confirmed: Number(totalConfirmed.rows[0].total),
        total_declined: Number(totalNo.rows[0].total),
        total_yes_records: Number(totalYes.rows[0].total),
        total_records: Number(totalRecords.rows[0].total)
      }
    });
  } catch (error) {
    console.error("Error obteniendo estadísticas:", error);
    res.status(500).json({
      error: "No se pudieron obtener las estadísticas."
    });
  }
});

app.delete("/api/rsvps/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM public.rsvps WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Registro no encontrado." });
    }

    res.json({
      ok: true,
      message: "Registro eliminado correctamente.",
      data: result.rows[0]
    });
  } catch (error) {
    console.error("Error eliminando RSVP:", error);
    res.status(500).json({ error: "No se pudo eliminar el registro." });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});