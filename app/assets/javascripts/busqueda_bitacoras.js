function buscarBitacora(form){
    //alert('/api/solicitud/buscar/'+form.filtro.value+'/'+form.valor.value);
    $.get('/api/bitacora/buscarBitacoras/'+form.valor.value, function(data, status){
        innerHTML = '';
        data.forEach(function(solicitud, index){

            innerHTML += '<tr>';
            innerHTML += `<td>${solicitud.id_contrato}</td>
                          <td>${solicitud.fecha_bitacora}</td>
                          <td>${solicitud.destino}</td>
                          <td>${solicitud.operador}</td>
                          <td>${solicitud.numero_economico}</td>
                          <td>${solicitud.fecha_salida}</td>
                          <td>${solicitud.fecha_regreso}</td>
                          <td align="center" valign="center">
                                <a class="tooltipped margin-lados" data-delay="50" target="_blank" data-position="top" data-tooltip="Imprimir Bitacora de viaje" href="/bitacora/pdf/${solicitud.id_contrato}">
                                  <i class="material-icons right">picture_as_pdf</i></a>
                          </td>`;

            innerHTML += '</tr>';
        });
        $('#rows_reportes').html(innerHTML);
    });
    return false;
}

function buscarOrdenServicio(form){
    //alert('/api/solicitud/buscar/'+form.filtro.value+'/'+form.valor.value);
    $.get('/api/ordenServicio/buscar/'+form.valor.value, function(data, status){
        innerHTML = '';
        data.forEach(function(solicitud, index){

            innerHTML += '<tr>';
            innerHTML += `<td>${solicitud.contrato}</td>
                          <td>${solicitud.fecha_orden_servicio}</td>
                          <td>${solicitud.nombre}</td>
                          <td>${solicitud.itinerario}</td>
                          <td>${solicitud.operador}</td>
                          <td>${solicitud.fecha_salida}</td>
                          <td>${solicitud.fecha_regreso}</td>
                          <td align="center" valign="center">
                                <a class="tooltipped margin-lados" data-delay="50" target="_blank" data-position="top" data-tooltip="Imprimir Orden de Servicio" href="/orden/pdf/${solicitud.contrato}">
                                  <i class="material-icons right">picture_as_pdf</i></a>
                          </td>`;

            innerHTML += '</tr>';
        });
        $('#rows_reportes').html(innerHTML);
    });
    return false;
}
