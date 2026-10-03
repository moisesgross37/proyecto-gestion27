require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const repararCentros = async () => {
  try {
    console.log("Viajando a la base de datos para reparar los centros educativos...");

    await pool.query(`
      ALTER TABLE centers 
      ADD COLUMN IF NOT EXISTS address VARCHAR(255),
      ADD COLUMN IF NOT EXISTS sector VARCHAR(255),
      ADD COLUMN IF NOT EXISTS contactname VARCHAR(255),
      ADD COLUMN IF NOT EXISTS contactnumber VARCHAR(255),
      ADD COLUMN IF NOT EXISTS etapa_venta VARCHAR(50) DEFAULT 'Prospecto',
      ADD COLUMN IF NOT EXISTS asesor VARCHAR(255);
    `);
    
    console.log("✅ Columnas instaladas. La tabla 'centers' está estructurada correctamente.");

  } catch (err) {
    console.error("❌ Error reparando la tabla:", err);
  } finally {
    pool.end();
  }
};

repararCentros();