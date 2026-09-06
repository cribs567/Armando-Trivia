import sqlite3

# Conectar o crear la base de datos
conexion = sqlite3.connect("ranking.db")
cursor = conexion.cursor()

# Crear tabla
cursor.execute("""
CREATE TABLE IF NOT EXISTS ranking (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    puntaje INTEGER NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
""")

conexion.commit()
conexion.close()

print("Base de datos creada correctamente.")