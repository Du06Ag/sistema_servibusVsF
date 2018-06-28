function buscarCotizacion(form){
    //alert('/api/solicitud/buscar/'+form.filtro.value+'/'+form.valor.value);
    $.get('/api/cotizacion/busquedas/'+form.busqueda.value+'/'+form.valor.value, function(data, status){
        innerHTML = '';
        data.forEach(function(solicitud, index){
            color = "red darken-1";
            if (solicitud.importe >= 1)
              color = 'yellow lighten-2'

            innerHTML += '<tr>';
            innerHTML += `<td> <a style="padding:0px;" href="#" onclick="modalDetalleCotizacion(${solicitud.id_cotizacion});"> ${solicitud.id_cotizacion} </a></td>
                          <td>${solicitud.fecha_salida}</td>
                          <td>${solicitud.fecha_regreso}</td>
                          <td>${solicitud.itinerario}</td>
                          <td>${solicitud.estatus}</td>
                          <td>${solicitud.nombre}</td>
                          <td class=${color} >$  ${solicitud.importe}</td>
                          <td align="center" valign="center">
                                <a class="tooltipped" data-position="top" data-tooltip="Editar cotizacion" href="/editar_cotizacionSecre${solicitud.id_cotizacion}">
                                  <i class="material-icons right">edit</i></a>
                          </td>`;

            innerHTML += '</tr>';
        });
        $('#rows_reportes').html(innerHTML);
    });
    return false;
}

function buscarCotizacionRecep(form){
    //alert('/api/solicitud/buscar/'+form.filtro.value+'/'+form.valor.value);
    $.get('/api/cotizacion/busquedasRecep/'+form.busqueda.value+'/'+form.valor.value, function(data, status){
        innerHTML = '';
        data.forEach(function(solicitud, index){
            color = "red darken-1";
            if (solicitud.importe >= 1)
              color = 'yellow lighten-2'

            innerHTML += '<tr>';
            innerHTML += `<td> <a style="padding:0px;" href="#" onclick="modalDetalleCotizacion(${solicitud.id_cotizacion});"> ${solicitud.id_cotizacion} </a></td>
                          <td>${solicitud.fecha_salida}</td>
                          <td>${solicitud.fecha_regreso}</td>
                          <td>${solicitud.itinerario}</td>
                          <td>${solicitud.estatus}</td>
                          <td>${solicitud.nombre}</td>
                          <td class=${color} >$  ${solicitud.importe}</td>
                          <td align="center" valign="center">
                                <a class="tooltipped" data-position="top" data-tooltip="Editar cotizacion" href="/editar_cotizacion${solicitud.id_cotizacion}">
                                  <i class="material-icons right">edit</i></a>
                          </td>`;

            innerHTML += '</tr>';
        });
        $('#rows_reportes').html(innerHTML);
    });
    return false;
}
