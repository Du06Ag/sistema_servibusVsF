function buscarContrato(form){
    //alert('/api/solicitud/buscar/'+form.filtro.value+'/'+form.valor.value);
    $.get('/api/contrato/busquedas/'+form.busqueda.value+'/'+form.valor.value, function(data, status){
        innerHTML = '';
        data.forEach(function(solicitud, index){
            color = "red darken-1";
            if(solicitud.estado != "Sin agendar")
              color = "grey lighten-3"

            innerHTML += '<tr>';
            innerHTML += `<td class=${color} >${solicitud.id_contrato}</td>
                          <td>${solicitud.fecha_contrato}</td>
                          <td>$  ${solicitud.anticipo_numero}</td>
                          <td>$  ${solicitud.importe_restante}</td>
                          <td>$  ${solicitud.importe}</td>
                          <td>${solicitud.estatus}</td>
                          <td>${solicitud.id_cotizacion}</td>
                          <td align="center" valign="center">
                                <a class="tooltipped margin-lados" data-position="top" data-tooltip="Imprimir contrato" target="_blank" href="/contrato/pdf/${solicitud.id_contrato}">
                                  <i class="material-icons" style="color:#ee6a29"> picture_as_pdf</i></a>
                          </td>
                          <td>
                                <a class="tooltipped margin-lados" data-position="top" data-delay="50" data-tooltip="Editar contrato" target="_blank" href="/editar_contrato${solicitud.id_contrato}">
                                  <i class="material-icons">edit</i></a>
                          </td>
                          <td>
                                <a class="tooltipped margin-lados" data-position="top" data-tooltip="Cancelar contrato" target="_blank" href="/cancelar_contrato${solicitud.id_contrato}">
                                  <i class="material-icons" style="color:#f00808">cancel</i></a>
                          </td>`;

            innerHTML += '</tr>';
        });
        $('#rows_reportes').html(innerHTML);
    });
    return false;
}
