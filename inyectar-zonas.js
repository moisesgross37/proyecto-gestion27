require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const inyectarZonas = async () => {
  try {
    console.log("Viajando a la base de datos para preparar zonas...");

    // 1. Demolemos la tabla vieja mal construida
    await pool.query(`DROP TABLE IF EXISTS zones;`);

    // 2. La reconstruimos con la regla UNIQUE (sin duplicados)
    await pool.query(`
      CREATE TABLE zones (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        createdat TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 3. Lista de zonas a inyectar
    const zonas = [
      'Santo Domingo Este',
      'Distrito Nacional',
      'Santo Domingo Norte',
      'Santo Domingo Oeste',
      'Interior Cercano'
    ];

    console.log("Inyectando nombres...");
    
    // 4. Insertamos una por una
    for (let zona of zonas) {
      await pool.query(
        `INSERT INTO zones (name) VALUES ($1) ON CONFLICT (name) DO NOTHING;`,
        [zona]
      );
    }

    console.log("✅ Zonas inyectadas con éxito. Ya puedes cotizar.");

  } catch (err) {
    console.error("❌ Error inyectando zonas:", err);
  } finally {
    pool.end();
  }
};

inyectarZonas();