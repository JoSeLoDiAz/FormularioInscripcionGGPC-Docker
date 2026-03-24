import oracledb from "oracledb";
import { getConnection } from "../db/oracle.js";

export async function findAllTamanoEmpresa() {
  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(`
      SELECT
        TAMANOEMPRESAID,
        NOMBRE,
        CREATEDAT,
        UPDATEDAT
      FROM TAMANOEMPRESA
      ORDER BY NOMBRE
    `);

    return result.rows;
  } finally {
    if (connection) await connection.close();
  }
}

export async function findTamanoEmpresaById(id) {
  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `
      SELECT
        TAMANOEMPRESAID,
        NOMBRE,
        CREATEDAT,
        UPDATEDAT
      FROM TAMANOEMPRESA
      WHERE TAMANOEMPRESAID = :id
      `,
      { id: Number(id) }
    );

    return result.rows[0] || null;
  } finally {
    if (connection) await connection.close();
  }
}

export async function createTamanoEmpresa(data) {
  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `
      INSERT INTO TAMANOEMPRESA (
        NOMBRE
      ) VALUES (
        :nombre
      )
      RETURNING TAMANOEMPRESAID INTO :id
      `,
      {
        nombre: data.nombre,
        id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      }
    );

    await connection.commit();

    return Number(result.outBinds.id[0]);
  } catch (error) {
    if (connection) await connection.rollback();
    throw error;
  } finally {
    if (connection) await connection.close();
  }
}

export async function createManyTamanoEmpresa(items = []) {
  let connection;

  try {
    connection = await getConnection();

    const sql = `
      INSERT INTO TAMANOEMPRESA (
        NOMBRE
      ) VALUES (
        :nombre
      )
    `;

    const binds = items.map((item) => ({
      nombre: item.nombre,
    }));

    await connection.executeMany(sql, binds, {
      autoCommit: false,
    });

    await connection.commit();

    return items.length;
  } catch (error) {
    if (connection) await connection.rollback();
    throw error;
  } finally {
    if (connection) await connection.close();
  }
}

export async function updateTamanoEmpresa(id, data) {
  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `
      UPDATE TAMANOEMPRESA
      SET
        NOMBRE = :nombre
      WHERE TAMANOEMPRESAID = :id
      `,
      {
        id: Number(id),
        nombre: data.nombre,
      }
    );

    await connection.commit();

    return result.rowsAffected;
  } catch (error) {
    if (connection) await connection.rollback();
    throw error;
  } finally {
    if (connection) await connection.close();
  }
}

export async function deleteTamanoEmpresa(id) {
  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `
      DELETE FROM TAMANOEMPRESA
      WHERE TAMANOEMPRESAID = :id
      `,
      { id: Number(id) }
    );

    await connection.commit();

    return result.rowsAffected;
  } catch (error) {
    if (connection) await connection.rollback();
    throw error;
  } finally {
    if (connection) await connection.close();
  }
}
