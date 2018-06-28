function buscarServicio(form){
    //alert('/api/solicitud/buscar/'+form.filtro.value+'/'+form.valor.value);
    $.get('/api/agenda/buscarCliente/'+form.valor.value, function(data, status){
        innerHTML = '';
        data.forEach(function(solicitud, index){

            innerHTML += '<tr>';
            innerHTML += `<td>${solicitud.agenda}</td>
                          <td>${solicitud.nombre}</td>
                          <td>${solicitud.destino}</td>
                          <td>${solicitud.numero_economico} ${solicitud.tipo}</td>
                          <td>${solicitud.operador}</td>
                          <td>${solicitud.fecha_salida}</td>
                          <td>${solicitud.fecha_regreso}</td>
                          <td>${solicitud.importe}</td>
                          <td>${solicitud.estatus}</td>
                          <td align="center" valign="center">
                                <a class="tooltipped" data-position="top" data-tooltip="Editar servicio agendado" href="/editar_agenda${solicitud.agenda}">
                                  <i class="material-icons right">edit</i></a>
                          </td>`;

            innerHTML += '</tr>';
        });
        $('#rows_reportes').html(innerHTML);
    });
    return false;
}
