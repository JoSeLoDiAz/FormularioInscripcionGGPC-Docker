import oracledb from "oracledb";
import { getConnection } from "../db/oracle.js";

export async function findAllTipoDocumento(documentoempresa) {
  let connection;

  try {
    connection = await getConnection();

    let sql = `
      SELECT
        TIPODOCUMENTOID,
        CODIGO,
        NOMBRE,
        DOCUMENTOEMPRESA,
        CREATED_AT,
        UPDATED_AT
      FROM TIPODOCUMENTO
    `;

    const binds = {};

    if (documentoempresa !== undefined) {
      sql += ` WHERE DOCUMENTOEMPRESA = :documentoempresa `;
      binds.documentoempresa = Number(documentoempresa);
    }

    sql += ` ORDER BY CODIGO `;

    const result = await connection.execute(sql, binds);
    return result.rows;
  } finally {
    if (connection) await connection.close();
  }
}

export async function findTipoDocumentoById(id) {
  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `
      SELECT
        TIPODOCUMENTOID,
        CODIGO,
        NOMBRE,
        DOCUMENTOEMPRESA,
        CREATED_AT,
        UPDATED_AT
      FROM TIPODOCUMENTO
      WHERE TIPODOCUMENTOID = :id
      `,
      { id: Number(id) }
    );

    return result.rows[0] || null;
  } finally {
    if (connection) await connection.close();
  }
}

export async function findTipoDocumentoByCodigo(codigo) {
  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `
      SELECT
        TIPODOCUMENTOID,
        CODIGO,
        NOMBRE,
        DOCUMENTOEMPRESA,
        CREATED_AT,
        UPDATED_AT
      FROM TIPODOCUMENTO
      WHERE CODIGO = :codigo
      `,
      { codigo: Number(codigo) }
    );

    return result.rows[0] || null;
  } finally {
    if (connection) await connection.close();
  }
}

export async function findCodigosExistentes(codigos = []) {
  let connection;

  try {
    connection = await getConnection();

    if (!codigos.length) return [];

    const binds = {};
    const placeholders = codigos.map((codigo, i) => {
      const key = `c${i}`;
      binds[key] = Number(codigo);
      return `:${key}`;
    });

    const result = await connection.execute(
      `
      SELECT CODIGO
      FROM TIPODOCUMENTO
      WHERE CODIGO IN (${placeholders.join(",")})
      ORDER BY CODIGO
      `,
      binds
    );

    return result.rows.map((row) => row.CODIGO);
  } finally {
    if (connection) await connection.close();
  }
}

export async function createTipoDocumento(data) {
  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `
      INSERT INTO TIPODOCUMENTO (
        CODIGO,
        NOMBRE,
        DOCUMENTOEMPRESA
      ) VALUES (
        :codigo,
        :nombre,
        :documentoempresa
      )
      RETURNING TIPODOCUMENTOID INTO :id
      `,
      {
        codigo: Number(data.codigo),
        nombre: data.nombre,
        documentoempresa: Number(data.documentoempresa),
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

export async function createManyTipoDocumento(items = []) {
  let connection;

  try {
    connection = await getConnection();

    const sql = `
      INSERT INTO TIPODOCUMENTO (
        CODIGO,
        NOMBRE,
        DOCUMENTOEMPRESA
      ) VALUES (
        :codigo,
        :nombre,
        :documentoempresa
      )
    `;

    const binds = items.map((item) => ({
      codigo: Number(item.codigo),
      nombre: item.nombre,
      documentoempresa: Number(item.documentoempresa),
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

export async function updateTipoDocumento(id, data) {
  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `
      UPDATE TIPODOCUMENTO
      SET
        CODIGO = :codigo,
        NOMBRE = :nombre,
        DOCUMENTOEMPRESA = :documentoempresa
      WHERE TIPODOCUMENTOID = :id
      `,
      {
        id: Number(id),
        codigo: Number(data.codigo),
        nombre: data.nombre,
        documentoempresa: Number(data.documentoempresa),
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

export async function deleteTipoDocumento(id) {
  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `
      DELETE FROM TIPODOCUMENTO
      WHERE TIPODOCUMENTOID = :id
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
