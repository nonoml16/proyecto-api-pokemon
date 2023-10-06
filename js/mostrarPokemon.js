$(document).ready(function () {
    $.ajax({
        url: 'https://pokeapi.co/api/v2/pokemon?limit=100&offset=0',
        type: 'GET'
    }).done(function (resp) {
        var listaPokemon = resp.results;
        var i = 1;
        listaPokemon.forEach(function (pokemon) {
            var elementoLista = `<div class="card">
                                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${i}.gif"
                                        class="card-img-top" alt="...">
                                    <div class="card-body">
                                        </div>
                                        <div class="card-footer">
                                            <h5 class="card-title letra-pokemon-titulo">${pokemon.name}</h5>
                                            <div class="d-flex justify-content-around">
                                                <div class="p-2 badge rounded-pill bg-success letra-pokemon">Planta</div>
                                                <div class="p-2 badge rounded-pill bg-morado letra-pokemon">Planta</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>`
            $('#lista-pokemon').append(elementoLista);
            i++;
        });
    });
});