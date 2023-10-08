$(document).ready(function () {
    var limit = 21; // Cantidad de tarjetas por página
    var offset = 0; // Desplazamiento inicial
    var totalPages = 0; // Número total de páginas
    var currentPage = 1;

    function cargarPokemon(offset, limit) {
        $.ajax({
            url: 'https://pokeapi.co/api/v2/pokemon',
            type: 'GET',
            data: {
                offset: offset,
                limit: limit
            }
        }).done(function (resp) {
            var listaPokemon = resp.results;
            var i = offset + 1;

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
    }

    function generarElementosDePagina(totalPages, currentPage) {
        var paginationHtml = '<li class="page-item"><a class="page-link" href="javascript:void(0);" id="pagina-anterior">Previous</a></li>';

        for (var i = currentPage - 2; i <= currentPage + 2; i++) {
            if (i >= 1 && i <= totalPages) {
                if (i === currentPage) {
                    paginationHtml += '<li class="page-item active"><a class="page-link" href="javascript:void(0);" numpage="' + i + '">' + i + '</a></li>';
                } else {
                    paginationHtml += '<li class="page-item"><a class="page-link" href="javascript:void(0);" numpage="' + i + '">' + i + '</a></li>';
                }
            }
        }

        paginationHtml += '<li class="page-item"><a class="page-link" href="javascript:void(0);" id="pagina-siguiente">Next</a></li>';
        $('#pagination').html(paginationHtml);
    }

    $.ajax({
        url: 'https://pokeapi.co/api/v2/pokemon?limit=1000&offset=0',
        type: 'GET',
    }).done(function (resp) {
        var totalCount = resp.count;
        totalPages = Math.ceil(totalCount / limit);

        // Generar los elementos de página
        generarElementosDePagina(totalPages, currentPage);
    });

    // Manejar clics en los elementos de página
    $('#pagination').on('click', 'a.page-link', function (e) {
        e.preventDefault();
        var numpage = parseInt($(this).attr('numpage'));

        if (!isNaN(numpage)) {
            currentPage = numpage;
            offset = (currentPage - 1) * limit;
            $('#lista-pokemon').empty(); // Limpiar la lista de tarjetas
            cargarPokemon(offset, limit);

            // Actualizar los elementos de página
            generarElementosDePagina(totalPages, currentPage);
        } else if ($(this).attr('id') === 'pagina-anterior') {
            if (currentPage > 1) {
                currentPage--;
                offset = (currentPage - 1) * limit;
                $('#lista-pokemon').empty(); // Limpiar la lista de tarjetas
                cargarPokemon(offset, limit);

                // Actualizar los elementos de página
                generarElementosDePagina(totalPages, currentPage);
            }
        } else if ($(this).attr('id') === 'pagina-siguiente') {
            if (currentPage < totalPages) {
                currentPage++;
                offset = (currentPage - 1) * limit;
                $('#lista-pokemon').empty(); // Limpiar la lista de tarjetas
                cargarPokemon(offset, limit);

                // Actualizar los elementos de página
                generarElementosDePagina(totalPages, currentPage);
            }
        } else if ($(this).attr('id') === 'pagina-primera') {
            currentPage = 1;
            offset = 0;
            $('#lista-pokemon').empty(); // Limpiar la lista de tarjetas
            cargarPokemon(offset, limit);

            // Actualizar los elementos de página
            generarElementosDePagina(totalPages, currentPage);
        } else if ($(this).attr('id') === 'pagina-ultima') {
            currentPage = totalPages;
            offset = (totalPages - 1) * limit;
            $('#lista-pokemon').empty(); // Limpiar la lista de tarjetas
            cargarPokemon(offset, limit);

            // Actualizar los elementos de página
            generarElementosDePagina(totalPages, currentPage);
        }
    });

    // Cargar la primera página al cargar la página
    cargarPokemon(offset, limit);
});
