import oracledb from "oracledb";
import { getConnection } from "../db/oracle.js";

export async function findAllDepartamento() {
  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(`
      SELECT
        DEPARTAMENTOID,
        NOMBRE,
        CREATEDAT,
        UPDATEDAT
      FROM DEPARTAMENTO
      ORDER BY NOMBRE
    `);

    return result.rows;
  } finally {
    if (connection) await connection.close();
  }
}

export async function findDepartamentoById(id) {
  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `
      SELECT
        DEPARTAMENTOID,
        NOMBRE,
        CREATEDAT,
        UPDATEDAT
      FROM DEPARTAMENTO
      WHERE DEPARTAMENTOID = :id
      `,
      { id: Number(id) }
    );

    return result.rows[0] || null;
  } finally {
    if (connection) await connection.close();
  }
}

export async function createDepartamento(data) {
  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `
      INSERT INTO DEPARTAMENTO (
        NOMBRE
      ) VALUES (
        :nombre
      )
      RETURNING DEPARTAMENTOID INTO :id
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

export async function createManyDepartamento(items = []) {
  let connection;

  try {
    connection = await getConnection();

    const sql = `
      INSERT INTO DEPARTAMENTO (
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

export async function updateDepartamento(id, data) {
  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `
      UPDATE DEPARTAMENTO
      SET
        NOMBRE = :nombre
      WHERE DEPARTAMENTOID = :id
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

export async function deleteDepartamento(id) {
  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `
      DELETE FROM DEPARTAMENTO
      WHERE DEPARTAMENTOID = :id
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