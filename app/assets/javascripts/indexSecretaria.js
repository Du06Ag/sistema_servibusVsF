function buscarCotizacion(form){
	cotizacion = form.cotizacion.value || "";
	if(cotizacion != ""){
		$.get('/../api/cotizaciones/'+cotizacion, function(data, status){
			info = `﻿
					<div class="row">
						<div class="input-field col s4">
							<input id="personaId" name="personaId" type="text" class="validate color-text-blue" value="${data.id_persona}" readonly style="visibility:hidden" ></input>
						</div>
						<div class="input-field col s4">
							<input id="cotizacionId" name="cotizacionId" type="text" class="validate color-text-blue" value="${data.id_cotizacion}" readonly style="visibility:hidden" ></input>
						</div>
					</div>
					<div class="row">
						<div class="input-field col s6 push-s1">
						  <input id="cliente" type="text" class="validate color-text-blue" value="${data.nombre}" readonly ></input>
						  <label class="active" style="color:blue"> Nombre del cliente </label>
					  </div>
					  <div class="input-field col s4 push-s1 pull-s1">
					    <input id="destino" type="text" class="validate color-text-blue" value="${data.destino}" readonly ></input>
					    <label class="active" for="destino" style="color:blue" > Lugar de destino </label>
					  </div>
					</div>
					<div class="row">
						<div class="input-field col s3 push-s1">
						  <i class="material-icons prefix"> date_range </i>
							<input type="text" class="validate" id="fecha_salida" value="${data.fecha_salida}" readonly></input>
							<label class="active" for="fecha_salida" style="color:blue"> Fecha salida </label>
						</div>
						<div class="input-field col s4 push-s1 pull-s1">
						  <input id="lugarSalida" type="text" class="validate color-text-blue" value="${data.origen}" readonly></input>
							<label class="active" for="lugarSalida" style="color:blue"> Lugar salida </label>
						</div>
						<div class="input-field col s3 push-s1">
							<i class="material-icons prefix"> access_time </i>
							<input type="text" class="validate" id="hora_salida" value="${data.hora_salida}" readonly></input>
							<label class="active" for="hora_salida" style="color:blue"> Hora salida </label>
						</div>
					</div>
					<div class="row">
					  <div class="input-field col s10 push-s1">
						  <input id="itinerario" type="text" class="validate color-text-blue" value="${data.itinerario}" readonly></input>
							<label class="active" for="itinerario" style="color:blue"> Itinerario </label>
						</div>
					</div>
					<div class="row">
					  <div class="input-field col s5 push-s1">
						  <i class="material-icons prefix"> date_range </i>
							<input type="text" class="validate" id="fecha_regreso" value="${data.fecha_regreso}" readonly></input>
							<label class="active" for="fecha_regreso" style="color:blue"> Fecha regreso </label>
						</div>
						<div class="input-field col s5 push-s1 pull-s1">
						  <input id="lugarSalida" type="text" class="validate color-text-blue" value="${data.origen}" readonly></input>
							<label class="active" for="lugarSalida" style="color:blue"> Lugar regreso </label>
					</div>
					<div class="row">
					  <div class="input-field col s10 push-s1 pull-s1">
							<input id="adelanto" name="adelanto" type="text" class="validate color-text-blue" pattern="^([A-Za-zÁÉÍÓÚ]{1}[A-Za-zñáéíóú]+[\\s]*)+$" minlength="8" maxlength="95" required></input>
							<label for="adelanto" style="color:blue"> Cantidad de adelanto </label>
						</div>
					</div>
					<div class="row">
						<div class="input-field col s3 push-s1">
							<input type="text" id="total" value="${data.importe}" readonly></input>
							<label class="active" for="total" style="color:blue"> Precio total $ </label>
						</div>
						<div class="input-field col s4 push-s1 pull-s1">
							<input id="anticipo" name="anticipo" type="text" onblur="findTotal()" class="validate color-text-blue" pattern="[1-9][0-9]*" minlength="4" maxlenght="5" required></input>
							<label for="anticipo" style="color:blue"> Anticipo $ </label>
						</div>
						<div class="input-field col s3 push-s1">
							<input type="text" class="validate" id="saldo" name="saldo" require></input>
							<label for="Saldo" style="color:blue"> Saldo $ </label>
						</div>
					</div>
					<div class="row">
						<div class="col s12">
							<button class="btn waves-effect waves-light col s3 push-s8 pull-s1" type="submit" name="generar"> Generar contrato
							<i class="material-icons right"> send </i>
							</button>

						</div>
					</div>
					`;
				$('#dataInfo').html(info);
		});

	}else{
		window.location('/');
	}
	return false;
}

function findTotal(){
	var importe = parseFloat(document.getElementById('total').value);
	var anticipo = parseFloat(document.getElementById('anticipo').value);
	var total=0;

	if(importe >= anticipo){
		total=(importe - anticipo);
		parseFloat(document.getElementById('saldo').value=total);
	}else{
		alert('El anticipo no puede se mayor que el precio total...'+anticipo +' '+importe);
	}

}

function buscarContrato(form){
	contrato = form.contrato.value || "";
	if(contrato != ""){
		$.get('/../api/contratos/'+contrato, function(data, status){

			info = `
					<div class="row">
							<input id="contratoId" name="contratoId" type="text" class="validate color-text-blue" value="${data.info.id_contrato}" readonly style="visibility:hidden" ></input>
					  <div class="input-field col s6 push-s1">
						  <input id="cliente" name="cliente" type="text" class="validate color-text-blue" value="${data.info.nombre}" readonly ></input>
						  <label class="active" style="color:blue"> Nombre del cliente </label>
					  </div>
					  <div class="input-field col s4 push-s1 pull-s1">
					    <input id="destino" type="text" class="validate color-text-blue" value="${data.info.destino}" readonly ></input>
					    <label class="active" for="destino" style="color:blue" > Lugar de destino </label>
					  </div>
					</div>
					<div class="row">
						<div class="input-field col s3 push-s1">
						  <i class="material-icons prefix"> date_range </i>
							<input type="text" class="validate" id="fecha_salida" value="${data.info.fecha_salida}" readonly></input>
							<label class="active" for="fecha_salida" style="color:blue"> Fecha salida </label>
						</div>
						<div class="input-field col s4 push-s1 pull-s1">
						  <input id="lugarSalida" type="text" class="validate color-text-blue" value="${data.info.salida}" readonly></input>
							<label class="active" for="lugarSalida" style="color:blue"> Lugar salida </label>
						</div>
						<div class="input-field col s3 push-s1">
							<i class="material-icons prefix"> access_time </i>
							<input type="text" class="validate" id="hora_salida" value="${data.info.hora_salida}" readonly></input>
							<label class="active" for="hora_salida" style="color:blue"> Hora salida </label>
						</div>
					</div>
					<div class="row">
						<div class="input-field col s3 push-s1">
						  <i class="material-icons prefix"> date_range </i>
							<input type="text" class="validate" id="fecha_regreso" value="${data.info.fecha_regreso}" readonly></input>
							<label class="active" for="fecha_regreso" style="color:blue"> Fecha regreso </label>
						</div>
						<div class="input-field col s4 push-s1 pull-s1">
						  <input id="lugarRegreso" type="text" class="validate color-text-blue" value="${data.info.salida}" readonly></input>
							<label class="active" for="lugarRegreso" style="color:blue"> Lugar regreso </label>
						</div>
						<div class="input-field col s3 push-s1">
							<i class="material-icons prefix"> access_time </i>
							<input type="text" class="validate" id="hora_regreso" value="${data.info.hora_regreso}" readonly></input>
							<label class="active" for="hora_regreso" style="color:blue"> Hora regreso </label>
						</div>
					</div>
					<div class="row">
						<div class="input-field col s3 push-s1">
							<input id="importe" name="importe" type="text" class="validate color-text-blue" value="${data.info.importe_restante}" readonly></input>
							<label for="importe" style="color:blue" class="active"> Importe restante $</label>
						</div>
					</div>
					`;
				$('#dataInfo').html(info);
		});
		$.get('/../api/contratoUnidad/'+contrato, function(data, status){

			innerHTML='';
			data.forEach(function(unidad, index){
				innerHTML+='<tr>';
				innerHTML+=`<td>${unidad.id_contrato}</td>
										<td>${unidad.tipo}</td>
										<td>${unidad.numero_plazas}</td>
										<td>${unidad.numero_unidades}</td>`;
				innerHTML+= '<td id="unidades">';
			  innerHTML+=		'<div class="row">';
				innerHTML+=			'<div class="input-field col s12 m12 l1" >';
			  innerHTML+=				'<a class="btn-floating pulse btn-tiny waves-effect waves-light green btn modal-trigger btn tooltipped left" data-position="bottom" data-tooltip="Asignar undad.." data-target="seleccionar_Unidad">';
				innerHTML+=					'<i class="material-icons" > add </i>';
				innerHTML+=				'</a>';
				innerHTML+=			'</div>';
				innerHTML+=			'<div class="input-field col s12 m12 l7 push-l2">';
				innerHTML+=			  '<input type="text" id="unid" name="unid" style="text-align:center;" class="validate color-text-blue" required readonly></input>';
				innerHTML+=			'</div>';
				innerHTML+=		'</div>';
				innerHTML+=	'</td>'
				innerHTML+=	'<td id="operadores">';
				innerHTML+=		'<div class="row">';
				innerHTML+=			'<div class="input-field col s12 m12 l1" >';
				innerHTML+=				'<a class="btn-floating pulse btn-tiny waves-effect waves-light green btn modal-trigger btn tooltipped left" data-position="bottom" data-tooltip="Asignar undad.." data-target="seleccionar_Operador">';
				innerHTML+=					'<i class="material-icons" > add </i>';
				innerHTML+=				'</a>';
				innerHTML+=			'</div>';
				innerHTML+=			'<div class="input-field col s12 m12 l7 push-l2">'
				innerHTML+=				'<input type="text" id="opera" name="opera" style="text-align:center;" class="validate color-text-blue" readonly required></input>';
				innerHTML+=			'</div>';
				innerHTML+=		'</div>';
				innerHTML+=	'</td>';
				innerHTML+='</tr>';

				$('#info_unidades').html(innerHTML);
			});
		});


	}else{
		window.location('/');
	}
	return false;
}

$(document).ready(function(){
 $('.tooltipped').tooltip();
});

function findContrato(form){
	contrato = form.contrato.value || "";
	if(contrato != "") {
		$.get('/../api/findContrato/'+contrato, function(data, status) {
			info = `
					<div class="row">
						<input id="contratoId" name="contratoId" type="text" class="validate color-text-blue" value="${data.info.contrato}" readonly style="visibility:hidden" ></input>
						<div class="input-field col s4 push-s1">
							<input type="text" class="validate" id="tipo_unidad" value="${data.info.tipo}" readonly></input>
							<label class="active" for="tipo_unidad" style="color:blue">Tipo de unidad </label>
						</div>
						<div class="input-field col s3 push-s1 pull-s1">
							<input id="marca" type="text" class="validate color-text-blue" value="${data.info.marca}" readonly></input>
							<label class="active" for="marca" style="color:blue"> Marca </label>
						</div>
						<div class="input-field col s3 push-s1">
							<input type="text" class="validate" id="modelo" value="${data.info.modelo}" readonly></input>
							<label class="active" for="modelo" style="color:blue"> Modelo </label>
						</div>
					</div>
					<div class="row">
					  <div class="input-field col s5 push-s1">
							<input type="text" class="validate" id="placas" value="${data.info.placas}" readonly></input>
							<label class="active" for="placas" style="color:blue">No. de placas</label>
						</div>
						<div class="input-field col s5 push-s1 pull-s1">
								<input id="no_economico" type="text" class="validate color-text-blue" value="${data.info.numero_economico}" readonly></input>
								<label class="active" for="no_economico" style="color:blue"> No economico </label>
						</div>
					</div>
					<div class="row">
						<div class="col s10 push-s1">
							<hr style="background: #31B404; height:3px">
						</div>
					</div>
					<div class="row">
						<div class="input-field col s8 push-s1 pull-s1">
							<input type="text" class="validate" id="operador" value="${data.info.operador}" readonly></input>
							<label class="active" for="operador" style="color:blue">Nombre del operador </label>
						</div>
						<div class="input-field col s2 push-s2 pull-s1" >

						</div>
					</div>
					<div class="row">
						<div class="input-field col s3 push-s1">
							<input type="text" class="validate" id="noLicencia" value="${data.info.numero_licencia}" readonly></input>
							<label class="active" for="noLicencia" style="color:blue"> No. licencia </label>
						</div>
						<div class="input-field col s3 push-s1 pull-s1">
							<input id="tipoLicencia" type="text" class="validate color-text-blue" value="${data.info.tipo_licencia}" readonly></input>
							<label class="active" for="tipoLicencia" style="color:blue"> Tipo de licencia </label>
						</div>
						<div class="input-field col s4 push-s1">
							<i class="material-icons prefix"> data_range </i>
							<input type="text" class="validate" id="vigencia" value="${data.info.vigencia_licencia}" readonly></input>
							<label class="active" for="vigencia" style="color:blue"> Vigencia</label>
						</div>
					</div>
					<div class="row">
						<div class="col s10 push-s1">
							<hr style="background: #31B404; height:3px">
						</div>
					</div>
					<div class="row">
						<div class="input-field col s3 push-s1">
							<input type="text" class="validate" id="origen" value="${data.info.salida}" readonly></input>
							<label class="active" for="origen" style="color:blue" > Origen </label>
						</div>
						<div class="input-field col s3 push-s1 pull-s1">
							<input id="destino" type="text" class="color-text-blue" value="${data.info.destino}" readonly></input>
							<label class="active" for="destino" style="color:blue"> Destino </label>
						</div>
						<div class="input-field col s2 push-s1">
							<i class="material-icons prefix"> access_time </i>
							<input type="text" id="horasalida" value="${data.info.hora_salida}" readonly></input>
							<label class="active" for="horasalida" style="color:blue; font-size:13px"> Hora de salida</label>
						</div>
						<div class="input-field col s2 push-s1">
						  <i class="material-icons prefix"> access_time </i>
						  <input type="text" id="horallegada" value="${data.info.hora_regreso}" readonly></input>
						  <label class="active" for="horallegada" style="color:blue; font-size:13px"> Hora de llegada</label>
						</div>
					</div>
			`;
			 $('#dataInfo').html(info);

		});

	}
	return false;

}

function findOrdenContrato(form){
	contrato = form.contrato.value || "";
	if(contrato != "") {
		$.get('/../api/OrdenContrato/'+contrato, function(data, status) {
			info = `
					<div class="row">
						<div class="input-field col s4">
							<input id="contratoId" name="contratoId" type="text" class="validate color-text-blue" value="${data.info.contrato}" readonly style="visibility:hidden" ></input>
						</div>
						<div class="input-field col s4">
							<input id="unidadId" name="unidadId" type="text" class="validate color-text-blue" value="${data.info.id_unidad}" readonly style="visibility:hidden" ></input>
						</div>
					</div>
					<div class="row">
						<div class="input-field col s6 push-s1">
							<input id="cliente" name="cliente" type="text" class="validate color-text-blue" value="${data.info.nombre}" readonly ></input>
							<label class="active" style="color:blue"> Nombre del cliente </label>
						</div>
						<div class="input-field col s4 push-s1 pull-s1">
							<input id="destino" type="text" class="validate color-text-blue" value="${data.info.telefono}" readonly ></input>
							<label class="active" for="destino" style="color:blue" > Lugar de destino </label>
						</div>
					</div>
					<div class="row">
						<div class="input-field col s3 push-s1">
							<i class="material-icons prefix"> date_range </i>
							<input type="text" class="validate" id="fecha_salida" value="${data.info.fecha_salida}" readonly></input>
							<label class="active" for="fecha_salida" style="color:blue"> Fecha salida </label>
						</div>
						<div class="input-field col s4 push-s1 pull-s1">
							<input id="lugarSalida" type="text" class="validate color-text-blue" value="${data.info.salida}" readonly></input>
							<label class="active" for="lugarSalida" style="color:blue"> Lugar salida </label>
						</div>
						<div class="input-field col s3 push-s1">
							<i class="material-icons prefix"> access_time </i>
							<input type="text" class="validate" id="hora_salida" value="${data.info.hora_salida}" readonly></input>
							<label class="active" for="hora_salida" style="color:blue"> Hora salida </label>
						</div>
					</div>
					<div class="row">
						<div class="input-field col s3 push-s1">
							<i class="material-icons prefix"> date_range </i>
							<input type="text" class="validate" id="fecha_regreso" value="${data.info.fecha_regreso}" readonly></input>
							<label class="active" for="fecha_regreso" style="color:blue"> Fecha regreso </label>
						</div>
						<div class="input-field col s4 push-s1 pull-s1">
							<input id="lugarRegreso" type="text" class="validate color-text-blue" value="${data.info.salida}" readonly></input>
							<label class="active" for="lugarRegreso" style="color:blue"> Lugar regreso </label>
						</div>
						<div class="input-field col s3 push-s1">
							<i class="material-icons prefix"> access_time </i>
							<input type="text" class="validate" id="hora_regreso" value="${data.info.hora_regreso}" readonly></input>
							<label class="active" for="hora_regreso" style="color:blue"> Hora regreso </label>
						</div>
					</div>
					<div class="row">
						<div class="input-field col s3 push-s1 pull-s1">
							<input id="destino" type="text" class="color-text-blue" value="${data.info.destino}" readonly></input>
							<label class="active" for="destino" style="color:blue"> Destino </label>
						</div>
						<div class="input-field col s7 push-s1">
							<input id="itinerario" type="text" class="color-text-blue" value="${data.info.itinerario}" readonly></input>
							<label class="active" for="itinerario" style="color:blue"> Itinerario</label>
						</div>
					</div>
					<div class="row">
						<div class="input-field col s3 push-s1 pull-s1">
							<input id="kmsalida" name="kmsalida" type="text" class="validate color-text-blue" value="${data.info.kilometraje_actual}" pattern="[1-9][0-9]*" minlength="1" maxlength="8" required></input>
							<label class="active" for="destino" style="color:blue"> Km. de salida	</label>
						</div>
						<div class="input-field col s7 push-s1">
							<input id="itinerario" type="text" class="color-text-blue" value="${data.info.operador}" readonly></input>
							<label for="itinerario" style="color:blue" class="active"> Operador</label>
						</div>
					</div>
					<div class="row">
						<div class="col s12">
							<button class="btn waves-effect waves-light col s4 push-s7 pull-s1" type="submit" name="generar"> Generar orden de servicio
								<i class="material-icons right> send </i>
							</button>
						</div>
					</div>
			`;
			 $('#dataInfo').html(info);
		});

	}
	return false;

}

function getunidad(form){
	unidad = form.unidad.value;
	$.get('/../api/unidad/buscar/tipo/'+unidad, function(data, status){
			unidades="";
      data.forEach(function (element, index){
				unidades += `<li>
              <div class="collapsible-header">
                <i class="material-icons left">
                  airport_shuttle
                </i>
                Numero economico ${element.numero}
                <i class="material-icons right" onclick="seleccionarUnidad(${element.id_unidad});">
                    add_circle
                </i>
              </div>
              <div class="collapsible-body">
								<strong style="font-weight: bold;"> identificador de unidad</strong>
								<span> ${element.id_unidad}  </span>
								<br>
                <strong style="font-weight: bold;"> Marca: </strong>
                <span>${element.marca} </span>
                <br>
                <strong style="font-weight: bold;"> Modelo: </strong>
                <span>${element.modelo} </span>
                <br>
                <strong style="font-weight: bold;"> No. de plazas: </strong>
                <span>${element.plazas} </span>
                <br>
                <strong style="font-weight: bold;"> placas </strong>
                <span>${element.numero_placas} </span>
                <br>
								<strong style="font-weight: bold;"> estatus </strong>
                <span>${element.estatus} </span>
              </div>
            </li>`;
			});
	    if(unidades == ""){
	      $('#all_unidades').html("<p class='red-text center'> No se encontraron resultados, seleccione un tipo de unidad....</p>")
	    }else{
	      $('#all_unidades').html(unidades);
	    }
	  });
	  return false;
}

function seleccionarUnidad (numero){
	$('#unid').val(numero);
	$('#seleccionar_Unidad').modal('close');
}

$(document).ready(function(){
		$('.seleccionar_Unidad').modal({opacity: .7});
});

$(document).ready(function(){
		$('.collapsible').collapsible();
});

function getoperador(form){
	$.get('/../api/operador/buscar/', function(data, status){
			choferes="";
      data.forEach(function (element, index){
				choferes += `<li>
              <div class="collapsible-header">
                <i class="material-icons left">
                  person_pin
                </i>
                 ${element.nombre}
                <i class="material-icons right" onclick="seleccionarOperador(${element.id_operador});">
                    add_circle
                </i>
              </div>
              <div class="collapsible-body">
								<strong style="font-weight: bold;"> ID </strong>
								<span> ${element.id_operador}  </span>
								<br>
                <strong style="font-weight: bold;"> Telefono: </strong>
                <span>${element.telefono} </span>
                <br>
                <strong style="font-weight: bold;"> Numero de licencia: </strong>
                <span>${element.numero_licencia} </span>
                <br>
                <strong style="font-weight: bold;"> Tipo de licencia: </strong>
                <span>${element.tipo_licencia} </span>
                <br>
                <strong style="font-weight: bold;"> Vigencia </strong>
                <span>${element.vigencia} </span>
                <br>
								<strong style="font-weight: bold;"> estatus </strong>
                <span>${element.estatus} </span>
              </div>
            </li>`;
			});
	    if(choferes == ""){
	      $('#all_operadores').html("<p class='red-text center'> No se encontraron resultados....</p>")
	    }else{
	      $('#all_operadores').html(choferes);
	    }
	  });
	  return false;
}

function seleccionarOperador (numero){
	$('#opera').val(numero);
	$('#seleccionar_Operador').modal('close');
}

$(document).ready(function(){
		$('.seleccionar_Operador').modal({opacity: .7});
});

$(document).ready(function(){
		$('.collapsible').collapsible();
});
