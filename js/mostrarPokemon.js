$(document).ready(function () {
    $.ajax({
        url: 'https://pokeapi.co/api/v2/pokemon?limit=100&offset=0',
        type: 'GET',
    }).done(function (resp) {
        var listaPokemon = resp.results;
        var i = 1;

        function obtenerDatosPokemon(url) {
            $.ajax({
                url: url,
                type: 'GET',
            }).done(function (pokemonData) {
                var tipo1 = pokemonData.types[0].type.name;
                var tipo2 = pokemonData.types.length > 1 ? pokemonData.types[1].type.name : null;

                var elementoLista = `<div class="card ms-4">
                                        <div class="pokemon-image-container mt-3">
                                            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${i}.png"
                                                class="card-img-top rounded" alt="...">
                                        </div>
                                        <div class="card-body">
                                        </div>
                                        <div class="card-footer">
                                            <h5 class="card-title font-title titulo-tarjeta">${pokemonData.name}</h5>
                                            <div class="d-flex justify-content-around">
                                                <div class="etiqueta-peq et-${tipo1}">${tipo1}</div>`;

                if (tipo2) {
                    elementoLista += `<div class="etiqueta-peq et-${tipo2}">${tipo2}</div>`;
                }

                elementoLista += `</div>
                                    </div>
                                </div>`;

                $('#lista-pokemon').append(elementoLista);
                i++;
            });
        }

        listaPokemon.forEach(function (pokemon) {
            obtenerDatosPokemon(pokemon.url);
        });
    });
});
