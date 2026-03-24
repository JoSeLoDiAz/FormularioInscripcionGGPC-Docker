import oracledb from "oracledb";
import { getConnection } from "../db/oracle.js";

export async function findAllDatosBasicos() {
  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(`
      SELECT
        DB.DATOSBASICOSID,
        DB.TIPODOCUMENTOID,
        TD.NOMBRE        AS TIPODOCUMENTO_NOMBRE,
        DB.NUMEROIDENTIFICACION,
        DB.NOMBRES,
        DB.PRIMERAPELLIDO,
        DB.SEGUNDOAPELLIDO,
        DB.EMPRESAID,
        E.EMPRESA        AS EMPRESA_NOMBRE,
        DB.CELULAR,
        DB.CORREO,
        DB.DEPARTAMENTOID,
        D.NOMBRE         AS DEPARTAMENTO_NOMBRE,
        DB.CIUDADID,
        C.NOMBRE         AS CIUDAD_NOMBRE,
        DB.MODALIDAD,
        DB.CREATEDAT,
        DB.UPDATEDAT
      FROM DATOSBASICOS DB
      LEFT JOIN TIPODOCUMENTO TD ON DB.TIPODOCUMENTOID = TD.TIPODOCUMENTOID
      LEFT JOIN EMPRESA E        ON DB.EMPRESAID       = E.EMPRESAID
      LEFT JOIN DEPARTAMENTO D   ON DB.DEPARTAMENTOID  = D.DEPARTAMENTOID
      LEFT JOIN CIUDAD C         ON DB.CIUDADID        = C.CIUDADID
      ORDER BY DB.PRIMERAPELLIDO, DB.NOMBRES
    `);

    return result.rows;
  } finally {
    if (connection) await connection.close();
  }
}

export async function findDatosBasicosById(id) {
  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `
      SELECT
        DATOSBASICOSID,
        TIPODOCUMENTOID,
        NUMEROIDENTIFICACION,
        NOMBRES,
        PRIMERAPELLIDO,
        SEGUNDOAPELLIDO,
        EMPRESAID,
        CELULAR,
        CORREO,
        DEPARTAMENTOID,
        CIUDADID,
        MODALIDAD,
        CREATEDAT,
        UPDATEDAT
      FROM DATOSBASICOS
      WHERE DATOSBASICOSID = :id
      `,
      { id: Number(id) }
    );

    return result.rows[0] || null;
  } finally {
    if (connection) await connection.close();
  }
}

export async function findDatosBasicosByNumeroIdentificacion(numeroidentificacion) {
  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `
      SELECT
        DATOSBASICOSID,
        TIPODOCUMENTOID,
        NUMEROIDENTIFICACION,
        NOMBRES,
        PRIMERAPELLIDO,
        SEGUNDOAPELLIDO,
        EMPRESAID,
        CELULAR,
        CORREO,
        DEPARTAMENTOID,
        CIUDADID,
        MODALIDAD,
        CREATEDAT,
        UPDATEDAT
      FROM DATOSBASICOS
      WHERE NUMEROIDENTIFICACION = :numeroidentificacion
      `,
      { numeroidentificacion: String(numeroidentificacion) }
    );

    return result.rows[0] || null;
  } finally {
    if (connection) await connection.close();
  }
}

export async function countDatosBasicosByEmpresaId(empresaid) {
  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `
      SELECT COUNT(*) AS TOTAL
      FROM DATOSBASICOS
      WHERE EMPRESAID = :empresaid
      `,
      { empresaid: Number(empresaid) }
    );

    return Number(result.rows[0].TOTAL);
  } finally {
    if (connection) await connection.close();
  }
}

export async function getDatosBasicosStats() {
  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(`
      SELECT
        SUM(CASE WHEN MODALIDAD = 1 THEN 1 ELSE 0 END) AS PRESENCIAL,
        SUM(CASE WHEN MODALIDAD = 2 THEN 1 ELSE 0 END) AS VIRTUAL
      FROM DATOSBASICOS
    `);

    const row = result.rows[0];
    return {
      presencial: Number(row.PRESENCIAL ?? 0),
      virtual: Number(row.VIRTUAL ?? 0),
    };
  } finally {
    if (connection) await connection.close();
  }
}

export async function createDatosBasicos(data) {
  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `
      INSERT INTO DATOSBASICOS (
        TIPODOCUMENTOID,
        NUMEROIDENTIFICACION,
        NOMBRES,
        PRIMERAPELLIDO,
        SEGUNDOAPELLIDO,
        EMPRESAID,
        CELULAR,
        CORREO,
        DEPARTAMENTOID,
        CIUDADID,
        MODALIDAD
      ) VALUES (
        :tipodocumentoid,
        :numeroidentificacion,
        :nombres,
        :primerapellido,
        :segundoapellido,
        :empresaid,
        :celular,
        :correo,
        :departamentoid,
        :ciudadid,
        :modalidad
      )
      RETURNING DATOSBASICOSID INTO :id
      `,
      {
        tipodocumentoid: Number(data.tipodocumentoid),
        numeroidentificacion: String(data.numeroidentificacion),
        nombres: data.nombres,
        primerapellido: data.primerapellido,
        segundoapellido: data.segundoapellido || null,
        empresaid: Number(data.empresaid),
        celular: String(data.celular),
        correo: data.correo,
        departamentoid: Number(data.departamentoid),
        ciudadid: Number(data.ciudadid),
        modalidad: Number(data.modalidad),
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

export async function updateDatosBasicos(id, data) {
  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `
      UPDATE DATOSBASICOS
      SET
        TIPODOCUMENTOID = :tipodocumentoid,
        NUMEROIDENTIFICACION = :numeroidentificacion,
        NOMBRES = :nombres,
        PRIMERAPELLIDO = :primerapellido,
        SEGUNDOAPELLIDO = :segundoapellido,
        EMPRESAID = :empresaid,
        CELULAR = :celular,
        CORREO = :correo,
        DEPARTAMENTOID = :departamentoid,
        CIUDADID = :ciudadid,
        MODALIDAD = :modalidad
      WHERE DATOSBASICOSID = :id
      `,
      {
        id: Number(id),
        tipodocumentoid: Number(data.tipodocumentoid),
        numeroidentificacion: String(data.numeroidentificacion),
        nombres: data.nombres,
        primerapellido: data.primerapellido,
        segundoapellido: data.segundoapellido || null,
        empresaid: Number(data.empresaid),
        celular: String(data.celular),
        correo: data.correo,
        departamentoid: Number(data.departamentoid),
        ciudadid: Number(data.ciudadid),
        modalidad: Number(data.modalidad),
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

export async function deleteDatosBasicos(id) {
  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `
      DELETE FROM DATOSBASICOS
      WHERE DATOSBASICOSID = :id
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
