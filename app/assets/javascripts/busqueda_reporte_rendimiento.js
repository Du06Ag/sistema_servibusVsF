function buscarRepRendimiento(form){
    //alert('/api/solicitud/buscar/'+form.filtro.value+'/'+form.valor.value);
    $.get('/api/rendimiento/buscarXfecha/'+form.tipo.value+'/'+form.unidad.value+'/'+form.fecha.value, function(data, status){
        innerHTML = '';
        data.forEach(function(solicitud, index){

            innerHTML += '<tr>';
            innerHTML += `<td>${solicitud.id_unidad}</td>
                          <td>${solicitud.unidad}</td>
                          <td>${solicitud.operador}</td>
                          <td>${solicitud.destino}</td>
                          <td>${solicitud.itinerario}</td>
                          <td>$  ${solicitud.importe}</td>
                          <td>$  ${solicitud.gastos_total}</td>
                          <td>$  ${solicitud.utilidad}</td>
                          <td>
                                <a style="padding:0px;" href="#" onclick="modalDetalleReportes(${solicitud.id_contrato});"> Ver detalles</a>
                          </td>`;

            innerHTML += '</tr>';
        });
        $('#body_usuarios').html(innerHTML);
    });
    return false;
}
