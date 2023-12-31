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

                    var elementoLista = `<div class="card ms-4 btn-abrir-modal" data-pokemon-id=${pokemonData.id}>
                                        <div class="pokemon-image-container mt-3">
                                            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonData.id}.png"
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

    //Funciones para abrir y cerrar modal con información
    //Abrir modal
    $(document).on('click', '.btn-abrir-modal', function () {
        $('.modal-title').empty();
        $('#imgModal img').remove();
        $('.tipo1').remove();
        $('.tipo2').remove();
        $('#peso').empty();
        $('#altura').empty();
        $('#myModal').show();
        let idPokemon = $(this).data('pokemon-id');
        $.ajax({
            url: 'https://pokeapi.co/api/v2/pokemon/' + idPokemon,
            type: 'GET'
        }).done(function (pokemon) {
            let tipo1 = pokemon.types[0].type.name;
            let tipo2 = pokemon.types.length > 1 ? pokemon.types[1].type.name : null;
            let nombre = pokemon.name;
            let peso = Math.round((pokemon.weight)/10, 2);
            let altura =(pokemon.height)*10;
            let stats = pokemon.stats;
            let imgTemplate = 
            `
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png" style="width: 100px; height: 100px;">
            `
            let tipo1Template = 
            `
            <span class="tipo1 col-2 etiqueta-peq et-${tipo1}">
                ${tipo1}
            </span>
            `;
            $('.modal-title').append(nombre);
            $('#imgModal').append(imgTemplate);
            $('#etiquetas').append(tipo1Template);
            if(tipo2 != null) {
                $('#etiquetas').append(
                    `
                    <span class="tipo2 col-2 etiqueta-peq et-${tipo2}">
                        ${tipo2}
                    </span>
                    `)
                }
            $('#altura').append(`${altura}cm`);
            $('#peso').append(`${peso}kg`);
            stats.forEach(function (stat) {
                $(`#${stat.stat.name} p`).empty().append(stat.base_stat);
                $(`#${stat.stat.name} div div`).css({'width':`${stat.base_stat}`})
            });
        });
    });
    //Cerrar el modal

    $(document).on('click', '.btn-cerrar-modal', function () {
        $('#myModal').hide();
    });
});
