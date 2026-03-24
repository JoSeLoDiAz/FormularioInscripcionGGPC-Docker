import oracledb from "oracledb";
import { getConnection } from "../db/oracle.js";

export async function findLoginByEmail(email) {
  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `
      SELECT
        L.LOGINID,
        L.DATOSBASICOSID,
        L.EMAIL,
        L.PASSWORD,
        L.ESTADO,
        L.RESETTOKEN,
        L.CREATEDAT,
        L.UPDATEDAT,
        DB.NOMBRES,
        DB.PRIMERAPELLIDO
      FROM LOGIN L
      LEFT JOIN DATOSBASICOS DB ON L.DATOSBASICOSID = DB.DATOSBASICOSID
      WHERE L.EMAIL = :email
      `,
      { email: String(email) }
    );

    return result.rows[0] || null;
  } finally {
    if (connection) await connection.close();
  }
}

export async function findLoginById(id) {
  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `
      SELECT
        LOGINID,
        DATOSBASICOSID,
        EMAIL,
        PASSWORD,
        ESTADO,
        RESETTOKEN,
        CREATEDAT,
        UPDATEDAT
      FROM LOGIN
      WHERE LOGINID = :id
      `,
      { id: Number(id) }
    );

    return result.rows[0] || null;
  } finally {
    if (connection) await connection.close();
  }
}

export async function createLogin(data) {
  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `
      INSERT INTO LOGIN (
        DATOSBASICOSID,
        EMAIL,
        PASSWORD,
        ESTADO
      ) VALUES (
        :datosbasicosid,
        :email,
        :password,
        :estado
      )
      RETURNING LOGINID INTO :id
      `,
      {
        datosbasicosid: data.datosbasicosid ? Number(data.datosbasicosid) : null,
        email: String(data.email),
        password: String(data.password),
        estado: Number(data.estado),
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

export async function updateLogin(id, data) {
  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `
      UPDATE LOGIN
      SET
        EMAIL = :email,
        PASSWORD = :password
      WHERE LOGINID = :id
      `,
      {
        id: Number(id),
        email: String(data.email),
        password: String(data.password),
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

export async function updateLoginEstado(id, estado) {
  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `
      UPDATE LOGIN
      SET ESTADO = :estado
      WHERE LOGINID = :id
      `,
      {
        id: Number(id),
        estado: Number(estado),
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

export async function deleteLogin(id) {
  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `
      DELETE FROM LOGIN
      WHERE LOGINID = :id
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
