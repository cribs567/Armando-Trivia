import random
import re
from flask import Flask, render_template, request, session, redirect, url_for
from preguntas import Geografía, Cultura, Historia, Naturaleza
from bd import crear_bd, guardar, obtener_ranking_completo
usuarios_activos = set()

app = Flask(__name__)
app.secret_key = "clave_secreta"

crear_bd()   # Crea la base de datos si no existe
usuarios_activos = set()
contrasenas_activas = set()

def asegurar_ordenes():
    if "ordenes" not in session:
        session["ordenes"] = {
            "geografia": random.sample(range(len(Geografía)), len(Geografía)),
            "historia": random.sample(range(len(Historia)), len(Historia)),
            "cultura": random.sample(range(len(Cultura)), len(Cultura)),
            "naturaleza": random.sample(range(len(Naturaleza)), len(Naturaleza))
        }
    return session["ordenes"]

@app.route("/", methods=["GET", "POST"])
def login():
    error = ""

    if request.method == "POST":
        usuario = request.form["usuario"].strip()
        contrasena = request.form["contrasena"].strip()

        if not usuario or not contrasena:
            error = "Por favor ingresa usuario y contraseña"

        elif len(contrasena) < 6:
            error = "La contraseña debe tener al menos 6 caracteres."

        elif not re.fullmatch(r"[A-Za-z0-9]+", contrasena):
            error = "La contraseña solo puede contener letras y números."

        elif usuario in usuarios_activos:
            error = "Ese usuario ya está en uso."

        elif contrasena in contrasenas_activas:
            error = "Esa contraseña ya está siendo utilizada."

        else:
            usuarios_activos.add(usuario)
            contrasenas_activas.add(contrasena)

            session["usuario"] = usuario
            session["indice"] = 0
            session["puntaje"] = 0
            session["vidas"] = 3
            asegurar_ordenes()

            return redirect(url_for("inicio"))

    return render_template("login.html", error=error)

@app.route("/inicio")
def inicio():
    if "usuario" not in session:
        return redirect(url_for("login"))
    return render_template("inicio.html", usuario=session.get("usuario"))

@app.route("/Geografía", methods=["GET", "POST"])
def geografia_preguntas():

    if "usuario" not in session:
        return redirect(url_for("login"))

    indice = session.get("indice", 0)
    puntaje = session.get("puntaje", 0)
    vidas = session.get("vidas", 3)

    # Evitar salirnos de las preguntas
    if indice >= len(Geografía):
        session["razon_fin"] = "completo"
        return redirect(url_for("fin"))

    orden = asegurar_ordenes()["geografia"]
    pregunta_actual = Geografía[orden[indice]]

    if request.method == "POST":

        respuesta_usuario = request.form.get("respuesta")

        # COMPROBAR RESPUESTA
        if respuesta_usuario == pregunta_actual["respuesta"]:

            # CORRECTA
            puntaje += 1
            mensaje = "🎉 ¡Correcto! ¡Eres increíble!"

        else:

            # INCORRECTA
            vidas -= 1
            mensaje = f"😢 ¡Incorrecto! La respuesta era: {pregunta_actual['respuesta']}"

        # Guardar cambios
        session["puntaje"] = puntaje
        session["vidas"] = vidas

        # Pasar a la siguiente pregunta
        indice += 1
        session["indice"] = indice

        # Si perdió todas las vidas
        if vidas <= 0:
            guardar(session["usuario"], "geografia", puntaje)
            session["razon_fin"] = "vidas"
            return redirect(url_for("fin"))

        # Si terminó las preguntas
        if indice >= len(Geografía):
            guardar(session["usuario"], "geografia", puntaje)
            session["razon_fin"] = "completo"
            return redirect(url_for("fin"))

        return render_template(
            "Geografía.html",
            pregunta=Geografía[orden[indice]],
            indice=indice,
            total_preguntas=len(Geografía),
            puntaje=puntaje,
            vidas=vidas,
            mensaje=mensaje
        )

    return render_template(
        "Geografía.html",
        pregunta=pregunta_actual,
        indice=indice,
        total_preguntas=len(Geografía),
        puntaje=puntaje,
        vidas=vidas,
        mensaje=None
    )
    
    if indice >= len(Geografía):
         guardar(session["usuario"], "geografia", puntaje)
    return redirect(url_for("fin"))
    
@app.route("/Naturaleza", methods=["GET", "POST"])
def naturaleza_preguntas():

    if "usuario" not in session:
        return redirect(url_for("login"))

    indice = session.get("indice", 0)
    puntaje = session.get("puntaje", 0)
    vidas = session.get("vidas", 3)

    # Evitar salirnos de las preguntas
    if indice >= len(Naturaleza):
        session["razon_fin"] = "completo"
        return redirect(url_for("fin"))

    orden = asegurar_ordenes()["naturaleza"]
    pregunta_actual = Naturaleza[orden[indice]]

    if request.method == "POST":

        respuesta_usuario = request.form.get("respuesta")

        # COMPROBAR RESPUESTA
        if respuesta_usuario == pregunta_actual["respuesta"]:

            # CORRECTA
            puntaje += 1
            mensaje = "🎉 ¡Correcto! ¡Eres increíble!"

        else:

            # INCORRECTA
            vidas -= 1
            mensaje = f"😢 ¡Incorrecto! La respuesta era: {pregunta_actual['respuesta']}"

        # Guardar cambios
        session["puntaje"] = puntaje
        session["vidas"] = vidas

        # Pasar a la siguiente pregunta
        indice += 1
        session["indice"] = indice

        # Si perdió todas las vidas
        if vidas <= 0:
            guardar(session["usuario"], "naturaleza", puntaje)
            session["razon_fin"] = "vidas"
            return redirect(url_for("fin"))

        # Si terminó las preguntas
        if indice >= len(Naturaleza):
            guardar(session["usuario"], "naturaleza", puntaje)
            session["razon_fin"] = "completo"
            return redirect(url_for("fin"))

        return render_template(
            "Naturaleza.html",
            pregunta=Naturaleza[orden[indice]],
            indice=indice,
            total_preguntas=len(Naturaleza),
            puntaje=puntaje,
            vidas=vidas,
            mensaje=mensaje
        )

    return render_template(
        "Naturaleza.html",
        pregunta=pregunta_actual,
        indice=indice,
        total_preguntas=len(Naturaleza),
        puntaje=puntaje,
        vidas=vidas,
        mensaje=None
    )
    
    if indice >= len(Naturaleza):
         guardar(session["usuario"], "naturaleza", puntaje)
    return redirect(url_for("fin"))
    
@app.route("/Cultura", methods=["GET", "POST"])
def cultura_preguntas():

    if "usuario" not in session:
        return redirect(url_for("login"))

    indice = session.get("indice", 0)
    puntaje = session.get("puntaje", 0)
    vidas = session.get("vidas", 3)

    # Evitar salirnos de las preguntas
    if indice >= len(Cultura):
        session["razon_fin"] = "completo"
        return redirect(url_for("fin"))

    orden = asegurar_ordenes()["cultura"]
    pregunta_actual = Cultura[orden[indice]]

    if request.method == "POST":

        respuesta_usuario = request.form.get("respuesta")

        # COMPROBAR RESPUESTA
        if respuesta_usuario == pregunta_actual["respuesta"]:

            # CORRECTA
            puntaje += 1
            mensaje = "🎉 ¡Correcto! ¡Eres increíble!"

        else:

            # INCORRECTA
            vidas -= 1
            mensaje = f"😢 ¡Incorrecto! La respuesta era: {pregunta_actual['respuesta']}"

        # Guardar cambios
        session["puntaje"] = puntaje
        session["vidas"] = vidas

        # Pasar a la siguiente pregunta
        indice += 1
        session["indice"] = indice

        # Si perdió todas las vidas
        if vidas <= 0:
            guardar(session["usuario"], "cultura", puntaje)
            session["razon_fin"] = "vidas"
            return redirect(url_for("fin"))

        # Si terminó las preguntas
        if indice >= len(Cultura):
            guardar(session["usuario"], "cultura", puntaje)
            session["razon_fin"] = "completo"
            return redirect(url_for("fin"))

        return render_template(
            "Cultura.html",
            pregunta=Cultura[orden[indice]],
            indice=indice,
            total_preguntas=len(Cultura),
            puntaje=puntaje,
            vidas=vidas,
            mensaje=mensaje
        )

    return render_template(
        "Cultura.html",
        pregunta=pregunta_actual,
        indice=indice,
        total_preguntas=len(Cultura),
        puntaje=puntaje,
        vidas=vidas,
        mensaje=None
    )
    
    if indice >= len(Cultura):
         guardar(session["usuario"], "cultura", puntaje)
    return redirect(url_for("fin"))
    
@app.route("/Historia", methods=["GET", "POST"])
def historia_preguntas():

    if "usuario" not in session:
        return redirect(url_for("login"))

    indice = session.get("indice", 0)
    puntaje = session.get("puntaje", 0)
    vidas = session.get("vidas", 3)

    # Evitar salirnos de las preguntas
    if indice >= len(Historia):
        session["razon_fin"] = "completo"
        return redirect(url_for("fin"))

    orden = asegurar_ordenes()["historia"]
    pregunta_actual = Historia[orden[indice]]

    if request.method == "POST":

        respuesta_usuario = request.form.get("respuesta")

        # COMPROBAR RESPUESTA
        if respuesta_usuario == pregunta_actual["respuesta"]:

            # CORRECTA
            puntaje += 1
            mensaje = "🎉 ¡Correcto! ¡Eres increíble!"

        else:

            # INCORRECTA
            vidas -= 1
            mensaje = f"😢 ¡Incorrecto! La respuesta era: {pregunta_actual['respuesta']}"

        # Guardar cambios
        session["puntaje"] = puntaje
        session["vidas"] = vidas

        # Pasar a la siguiente pregunta
        indice += 1
        session["indice"] = indice

        # Si perdió todas las vidas
        if vidas <= 0:
            guardar(session["usuario"], "historia", puntaje)
            session["razon_fin"] = "vidas"
            return redirect(url_for("fin"))

        # Si terminó las preguntas
        if indice >= len(Historia):
            guardar(session["usuario"], "historia", puntaje)
            session["razon_fin"] = "completo"
            return redirect(url_for("fin"))
        
        return render_template(
            "Historia.html",
            pregunta=Historia[orden[indice]],
            indice=indice,
            total_preguntas=len(Historia),
            puntaje=puntaje,
            vidas=vidas,
            mensaje=mensaje
        )

    return render_template(
        "Historia.html",
        pregunta=pregunta_actual,
        indice=indice,
        total_preguntas=len(Historia),
        puntaje=puntaje,
        vidas=vidas,
        mensaje=None
    )
    
    if indice >= len(Historia):
         guardar(session["usuario"], "historia", puntaje)
    return redirect(url_for("fin"))

@app.route("/fin", methods=["GET", "POST"])
def fin():
    return render_template(
        "fin.html",
        puntaje=session.get("puntaje", 0),
        vidas=session.get("vidas", 0),
        razon=session.get("razon_fin", "completo")
    )

@app.route("/intentar-de-nuevo")
def intentar_de_nuevo():
    if "usuario" not in session:
        return redirect(url_for("login"))

    session["indice"] = 0
    session["puntaje"] = 0
    session["vidas"] = 3
    session["razon_fin"] = None
    session.pop("ordenes", None)

    return redirect(url_for("inicio"))

@app.route("/Ranking")
def ver_Ranking():
    jugadores = obtener_ranking_completo()
    return render_template(
        "Ranking.html",
        jugadores=jugadores
    )

@app.route("/logout")
def logout():
    usuario = session.get("usuario")

    if usuario in usuarios_activos:
        usuarios_activos.remove(usuario)

    session.clear()
    return redirect(url_for("login"))
        
    session.clear()
    return redirect(url_for("login"))

if __name__ == "__main__":
    app.run(debug=True)
