$(document).ready(function () {
    var limit = 21; // Cantidad de tarjetas por página
    var offset = 0; // Desplazamiento inicial
    var totalPages = 0; // Número total de páginas
    var currentPage = 1;

    function cargarPokemon(offset, limit) {
        $.ajax({
            url: 'https://pokeapi.co/api/v2/berry',
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
                }).done(function (berryData) {

                    var elementoLista = `<div class="card ms-4 btn-abrir-modal" data-pokemon-id=${berryData.id}>
                                        <div class="pokemon-image-container mt-3">
                                            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/berries/${berryData.name}-berry.png"
                                                class="card-img-top rounded" alt="...">
                                        </div>
                                        <div class="card-body">
                                        </div>
                                        <div class="card-footer">
                                            <h5 class="card-title font-title titulo-tarjeta">${berryData.name}</h5>
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

    //Funciones para abrir y cerrar modal con información
    //Abrir modal
    $(document).on('click', '.btn-abrir-modal', function () {
        let idBerry = $(this).data('berry-id');
        $.ajax({
            url: 'https://pokeapi.co/api/v2/item/' + idBerry,
            type: 'GET'
        }).done(function (berry) {
            let nombre = berry.name;
            let sabores = berry.flavors;
            let firmeza = berry.firmess.name;

            $('.modal-title').empty().append(nombre);
            $('#imgModal img').remove();
            $('#imgModal').append(
                `
              <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/berries/${nombre}-berry.png" style="width: 100px; height: 100px;">
              `
            );

            sabores.forEach(function (sabor) {
                $(`#${sabor.flavor.name} div div`)
                    .empty()
                    .css({ 'width': `${sabor.potency}` }
                        .append(`${sabor.potency}%`))
            });
            $('#firmess div').empty().append(firmeza);
        });
    });
    //Cerrar el modal

    $(document).on('click', '.btn-cerrar-modal', function () {
        $('#myModal').hide();
    });
});
