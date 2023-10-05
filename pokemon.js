$(document).ready(a => {
    $('myModal').hide();
    //Lista de pokemons
    let pokemons;

    //Función para obtener todos los pokemons
    $.ajax({
        url: 'https://pokeapi.co/api/v2/pokemon/',
        type: 'GET'
    }).done(function (resp) {
        pokemons = resp.results;
    });

    //ordenar por nombre
    $(document).on('click', 'btn-ordenar-nombre', function () {
        pokemons.sort(function (a, b) {
            if (a.name > b.name)
                return 1;
            if (a.name < b.name)
                return -1;

            return 0;
        });
    });

    //ordenar por número en la pokedex
    $(document).on('click', 'btn-ordenar-pokedex', function () {
        pokemons.sort(function (a, b) {
            return a - b;
        });
    });

    //ordenar por tipo
    $(document).on('click', 'btn-ordenar-tipo', function () {
        pokemons.sort(function (a, b) {
            if (a.type[0].name > b.type[0].name)
                return 1;
            if (a.type[0].name < b.type[0].name)
                return -1;

            return 0;
        });
    });

    //Funciones para abrir y cerrar modal con información
    //Abrir modal
    $(document).on('click', '.btn-abrir-modal', function () {
        $('#modal').show();
        let idPokemon = $(this).data('pokemon-id');
        $.ajax({
            url: 'https://pokeapi.co/api/v2/pokemon/' + idPokemon,
            type: 'GET'
        }).done(function (pokemon) {
            let nombre = pokemon.name;
            let peso = pokemon.weight;
            let altura = pokemon.height;
            let stats = pokemon.stats;
            stats.forEach(function (stat) {
                `
                <div class="">
                    ${stat.name}
                </div>
                `
            });
        })
    });
    //Cerrar el modal

    $(document).on('click', '.btn-cerrar-modal', function () {
        $('#modal').hide();
    });
});