import oracledb from "oracledb";
import { getConnection } from "../db/oracle.js";

export async function findAllEmpresa() {
  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(`
      SELECT
        EMPRESAID,
        TIPODOCUMENTOID,
        NUMEROIDENTIFICACION,
        DV,
        EMPRESA,
        TAMANOEMPRESAID,
        CREATEDAT,
        UPDATEDAT
      FROM EMPRESA
      ORDER BY EMPRESA
    `);

    return result.rows;
  } finally {
    if (connection) await connection.close();
  }
}

export async function findEmpresaById(id) {
  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `
      SELECT
        EMPRESAID,
        TIPODOCUMENTOID,
        NUMEROIDENTIFICACION,
        DV,
        EMPRESA,
        TAMANOEMPRESAID,
        CREATEDAT,
        UPDATEDAT
      FROM EMPRESA
      WHERE EMPRESAID = :id
      `,
      { id: Number(id) }
    );

    return result.rows[0] || null;
  } finally {
    if (connection) await connection.close();
  }
}

export async function findEmpresaByNumeroIdentificacion(numeroidentificacion) {
  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `
      SELECT
        EMPRESAID,
        TIPODOCUMENTOID,
        NUMEROIDENTIFICACION,
        DV,
        EMPRESA,
        TAMANOEMPRESAID,
        CREATEDAT,
        UPDATEDAT
      FROM EMPRESA
      WHERE NUMEROIDENTIFICACION = :numeroidentificacion
      `,
      { numeroidentificacion: String(numeroidentificacion) }
    );

    return result.rows[0] || null;
  } finally {
    if (connection) await connection.close();
  }
}

export async function createEmpresa(data) {
  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `
      INSERT INTO EMPRESA (
        TIPODOCUMENTOID,
        NUMEROIDENTIFICACION,
        DV,
        EMPRESA,
        TAMANOEMPRESAID
      ) VALUES (
        :tipodocumentoid,
        :numeroidentificacion,
        :dv,
        :empresa,
        :tamanoempresaid
      )
      RETURNING EMPRESAID INTO :id
      `,
      {
        tipodocumentoid: Number(data.tipodocumentoid),
        numeroidentificacion: String(data.numeroidentificacion),
        dv: String(data.dv),
        empresa: data.empresa,
        tamanoempresaid: Number(data.tamanoempresaid),
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

export async function createManyEmpresa(items = []) {
  let connection;

  try {
    connection = await getConnection();

    const sql = `
      INSERT INTO EMPRESA (
        TIPODOCUMENTOID,
        NUMEROIDENTIFICACION,
        DV,
        EMPRESA,
        TAMANOEMPRESAID
      ) VALUES (
        :tipodocumentoid,
        :numeroidentificacion,
        :dv,
        :empresa,
        :tamanoempresaid
      )
    `;

    const binds = items.map((item) => ({
      tipodocumentoid: Number(item.tipodocumentoid),
      numeroidentificacion: String(item.numeroidentificacion),
      dv: String(item.dv),
      empresa: item.empresa,
      tamanoempresaid: Number(item.tamanoempresaid),
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

export async function updateEmpresa(id, data) {
  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `
      UPDATE EMPRESA
      SET
        TIPODOCUMENTOID = :tipodocumentoid,
        NUMEROIDENTIFICACION = :numeroidentificacion,
        DV = :dv,
        EMPRESA = :empresa,
        TAMANOEMPRESAID = :tamanoempresaid
      WHERE EMPRESAID = :id
      `,
      {
        id: Number(id),
        tipodocumentoid: Number(data.tipodocumentoid),
        numeroidentificacion: String(data.numeroidentificacion),
        dv: String(data.dv),
        empresa: data.empresa,
        tamanoempresaid: Number(data.tamanoempresaid),
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

export async function deleteEmpresa(id) {
  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `
      DELETE FROM EMPRESA
      WHERE EMPRESAID = :id
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
