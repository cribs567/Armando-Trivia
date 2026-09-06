from bd import crear_bd, guardar, top10

@app.route("/Ranking")
def ver_Ranking():

    rankings = {}

    categorias = [
        "naturaleza",
        "historia",
        "cultura",
        "geografia"
    ]

    for categoria in categorias:

        rankings[categoria] = sorted(
            jugadores,
            key=lambda x: x[categoria],
            reverse=True
        )

    return render_template(
        "Ranking.html",
        rankings=rankings
    )