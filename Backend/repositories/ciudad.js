import oracledb from "oracledb";
import { getConnection } from "../db/oracle.js";

export async function findAllCiudad(departamentoid) {
  let connection;

  try {
    connection = await getConnection();

    let sql = `
      SELECT
        CIUDADID,
        NOMBRE,
        DEPARTAMENTOID,
        CREATEDAT,
        UPDATEDAT
      FROM CIUDAD
    `;

    const binds = {};

    if (departamentoid !== undefined) {
      sql += ` WHERE DEPARTAMENTOID = :departamentoid `;
      binds.departamentoid = Number(departamentoid);
    }

    sql += ` ORDER BY NOMBRE `;

    const result = await connection.execute(sql, binds);
    return result.rows;
  } finally {
    if (connection) await connection.close();
  }
}

export async function findCiudadById(id) {
  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `
      SELECT
        CIUDADID,
        NOMBRE,
        DEPARTAMENTOID,
        CREATEDAT,
        UPDATEDAT
      FROM CIUDAD
      WHERE CIUDADID = :id
      `,
      { id: Number(id) }
    );

    return result.rows[0] || null;
  } finally {
    if (connection) await connection.close();
  }
}

export async function createCiudad(data) {
  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `
      INSERT INTO CIUDAD (
        NOMBRE,
        DEPARTAMENTOID
      ) VALUES (
        :nombre,
        :departamentoid
      )
      RETURNING CIUDADID INTO :id
      `,
      {
        nombre: data.nombre,
        departamentoid: Number(data.departamentoid),
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

export async function createManyCiudad(items = []) {
  let connection;

  try {
    connection = await getConnection();

    const sql = `
      INSERT INTO CIUDAD (
        NOMBRE,
        DEPARTAMENTOID
      ) VALUES (
        :nombre,
        :departamentoid
      )
    `;

    const binds = items.map((item) => ({
      nombre: item.nombre,
      departamentoid: Number(item.departamentoid),
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

export async function updateCiudad(id, data) {
  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `
      UPDATE CIUDAD
      SET
        NOMBRE = :nombre,
        DEPARTAMENTOID = :departamentoid
      WHERE CIUDADID = :id
      `,
      {
        id: Number(id),
        nombre: data.nombre,
        departamentoid: Number(data.departamentoid),
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

export async function deleteCiudad(id) {
  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `
      DELETE FROM CIUDAD
      WHERE CIUDADID = :id
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
