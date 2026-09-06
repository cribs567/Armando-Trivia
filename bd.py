import sqlite3

DB = "ranking.db"


def conectar():
    return sqlite3.connect(DB)


def crear_bd():
    con = conectar()
    cur = con.cursor()

    cur.execute("""
    CREATE TABLE IF NOT EXISTS ranking(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL UNIQUE,
        naturaleza INTEGER DEFAULT 0,
        historia INTEGER DEFAULT 0,
        cultura INTEGER DEFAULT 0,
        geografia INTEGER DEFAULT 0,
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    con.commit()
    con.close()


def guardar(nombre, categoria, puntaje):
    con = conectar()
    cur = con.cursor()

    # Crear jugador si no existe
    cur.execute("""
        INSERT OR IGNORE INTO ranking(nombre)
        VALUES(?)
    """, (nombre,))

    # Guardar puntaje de la categoría
    cur.execute(f"""
        UPDATE ranking
        SET {categoria} = ?
        WHERE nombre = ?
    """, (puntaje, nombre))

    con.commit()
    con.close()


def obtener_ranking(categoria):
    con = conectar()
    cur = con.cursor()

    cur.execute(f"""
        SELECT nombre, {categoria}
        FROM ranking
        ORDER BY {categoria} DESC
    """)

    datos = cur.fetchall()

    con.close()

    return datos


def obtener_ranking_completo():
    con = conectar()
    cur = con.cursor()

    cur.execute("""
        SELECT nombre, naturaleza, historia, cultura, geografia
        FROM ranking
        ORDER BY (naturaleza + historia + cultura + geografia) DESC, nombre ASC
    """)

    datos = cur.fetchall()
    con.close()
    return datos