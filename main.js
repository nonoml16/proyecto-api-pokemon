$(document).reay(a => {
    //Lista de pokemons
    let pokemons;
    //Lista de items
    //Lista de berries
    //Función para obtener todos los pokemos
    $.ajax({
        url: 'https://pokeapi.co/api/v2/pokemon/',
        type: 'GET'
    }).done(function (resp) {
        pokemons = resp.results;
    });

    $(document).on('click', 'btn-ordenar-nombre', function () {
        pokemons.sort(function (a, b) {
            if (a.name > b.name)
                return 1;
            if (a.name < b.name)
                return -1;

            return 0;
        });
    });

    $(document).on('click', 'btn-ordenar-pokedex', function () {
        pokemons.sort(function (a, b) {
            if (a.id > b.id)
                return 1;
            if (a.id < b.id)
                return -1;

            return 0;
        });
    });

    $(document).on('click', 'btn-ordenar-tipo', function () {
        pokemons.sort(function (a, b) {
            if (a.type[0].name > b.type[0].name)
                return 1;
            if (a.type[0].name < b.type[0].name)
                return 1;

            return 0;
        });
    });
});