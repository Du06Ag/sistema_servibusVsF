const db = require('../../config/database'),
      multer = require('multer'),
      path = require('path');
var pdfs = require('./pdfs');

exports.home = (req, res) => {
  console.log('Get /contadorIni/')
  data = {};
  db.query("select agenda.id_unidad, unidad.numero_economico as unidad, empleado.nombre as operador,cotizacion.destino,cotizacion.itinerario,cotizacion.importe,reporte_rendimiento.gastos_total,reporte_rendimiento.utilidad,orden_servicio.id_orden_servicio,contrato.id_contrato, reporte_rendimiento.id_reporte from orden_servicio join contrato on contrato.id_contrato=orden_servicio.id_contrato join reporte_rendimiento on reporte_rendimiento.id_orden_servicio=orden_servicio.id_orden_servicio join cotizacion on cotizacion.id_cotizacion= contrato.id_cotizacion join persona on persona.id_persona = cotizacion.id_persona join agenda on agenda.id_contrato = contrato.id_contrato join unidad on unidad.id_unidad = agenda.id_unidad join tipo_unidad on tipo_unidad.id_tipo_unidad = unidad.id_tipo_unidad join operador on operador.id_operador = agenda.id_operador join empleado on empleado.id_empleado = operador.id_empleado;", (err, rows) => {
    var reportes = JSON.parse(JSON.stringify(rows));
    db.query("select distinct numero_economico from unidad;", (err, rows) =>{
      var unidad = JSON.parse(JSON.stringify(rows));
      data['unidad'] = unidad;
      db.query("select * from tipo_unidad;", (err, rows) =>{
        var tipos = JSON.parse(JSON.stringify(rows));
        data['tipos'] = tipos;
        // console.log(usuarios)
        res.render('contador/index', {reportes: reportes,data});
      });
    })
  });

}

exports.bitacora = (req, res) => {
  console.log('GET /Reporte de mantenimiento');
  db.query("select unidad.id_unidad, unidad.numero_economico, unidad.numero_placas, unidad.kilometraje_actual, tipo_unidad.marca_unidad, tipo_unidad.modelo_unidad, reporte_mantenimiento.id_mantenimiento, reporte_mantenimiento.estatus from reporte_mantenimiento inner join unidad on unidad.id_unidad = reporte_mantenimiento.id_unidad inner join tipo_unidad on tipo_unidad.id_tipo_unidad = unidad.id_tipo_unidad where unidad.estado !='Baja';", (err, rows) => {
    var mantenimientos = JSON.parse(JSON.stringify(rows));
    res.render('contador/bitacora_manteni', {mantenimientos: mantenimientos});
  });
}

exports.updateMantenimiento = (req, res) => {
  console.log('GET /Update/reporte/mantenimiento',req.params.numero);
  db.query("update reporte_mantenimiento set estatus='Realizado' where id_unidad=?;", [req.params.numero], (err, rows) =>{
    if(err){
      console.log(err);
    }else{
      console.log('Success');
      res.redirect('/bitacora_manteni');
    }
  });
}

exports.reporte = (req, res) => {
  res.render('contador/reporte_rendimiento');
}

exports.newReporte = (req, res) => {
  console.log('POST /newReporte/');
  params=[req.body.numDias, req.body.kmLLegada, req.body.kmRecorridos, req.body.combustibleLts, req.body.combustiblePre, req.body.rendimiento, req.body.gastos_operador, req.body.pagoOperador, req.body.casetas, req.body.gastosEx, req.body.gastosTotal, req.body.utilidad, req.body.orden_servicioId]
  console.log('reporte ', params);
  db.query("insert into reporte_rendimiento (fecha_reporte, numero_dias,kilometros_llegada,kilometros_recorridos,combustible_litros,precio_combustible,rendimiento,importe_gastos,comision_operador,casetas,gastos_extra,gastos_total,utilidad,id_orden_servicio) values (current_date,?,?,?,?,?,?,?,?,?,?,?,?,?);", params, (err, rows) => {
    if(err){
      console.log(err);
    }else{
      parms=[req.body.kmLLegada, req.body.idunidad, req.body.tipoId];
      console.log('unidad ', parms);
      db.query("update unidad set kilometraje_actual=? where id_unidad=? and id_tipo_unidad=?;", parms, (err, rows) => {
        if(err){
          console.log(err);
        }else{
          if(req.body.kmRecorridos >= req.body.kmMantenimiento){
            db.query("update reporte_mantenimiento set estatus='Necesita' where id_unidad=?;",[req.body.idunidad],(err, rows) => {
              if(err){
                console.log(err);
              }else{
                console.log('Success ');
                res.redirect('/indexConta');
              }
            });
          }else{
            if(req.body.servicio >= .8){
              db.query("update reporte_mantenimiento set estatus='Proximo', where id_unidad=?;",[req.body.idunidad],(err, rows) => {
                if(err){
                  console.log(err);
                }else{
                  console.log('Success ');
                  res.redirect('/indexConta');
                }
              });
            }else{
              db.query("update reporte_mantenimiento set estatus='Realizado'where id_unidad=?;",[req.body.idunidad],(err, rows) => {
                if(err){
                  console.log(err);
                }else{
                  console.log('Success ');
                  res.redirect('/indexConta');
                }
              });
            }
          }
        }
      });
    }
  });
}

//api modal detalles del reporte
exports.APIReporteDetalles = (req, res) => {
  console.log('GET /APIReporteDetlles', req.params.id_contrato);
  query="select agenda.id_unidad, unidad.numero_economico as unidad,concat(empleado.nombre,' ',empleado.ap_paterno,' ',empleado.ap_materno) as operador,date_format(cotizacion.fecha_salida, '%e-%m-%Y') as fecha_salida,cotizacion.hora_salida, date_format(cotizacion.fecha_regreso, '%e-%m-%Y') as fecha_regreso,reporte_rendimiento.numero_dias,cotizacion.destino,cotizacion.itinerario,cotizacion.importe,orden_servicio.kilometros_salida,reporte_rendimiento.kilometros_llegada,reporte_rendimiento.combustible_litros, reporte_rendimiento.precio_combustible,reporte_rendimiento.kilometros_recorridos,reporte_rendimiento.rendimiento,concat(persona.nombre,' ',persona.ap_paterno,' ',persona.ap_materno) as responsable,persona.telefono,reporte_rendimiento.importe_gastos,reporte_rendimiento.casetas,reporte_rendimiento.comision_operador,reporte_rendimiento.gastos_total,reporte_rendimiento.gastos_extra,reporte_rendimiento.utilidad from orden_servicio join contrato on contrato.id_contrato=orden_servicio.id_contrato join reporte_rendimiento on reporte_rendimiento.id_orden_servicio = orden_servicio.id_orden_servicio join cotizacion on cotizacion.id_cotizacion = contrato.id_cotizacion join persona on persona.id_persona = cotizacion.id_persona join agenda on agenda.id_contrato = contrato.id_contrato join unidad on unidad.id_unidad = agenda.id_unidad join tipo_unidad on tipo_unidad.id_tipo_unidad = unidad.id_tipo_unidad join operador on operador.id_operador = agenda.id_operador join empleado on empleado.id_empleado = operador.id_empleado where contrato.id_contrato=?;";

  db.query(query, [req.params.id_contrato], function(err, rows){
    if(err){
      console.log(err);
      res.status(500).json({error: 'Error al realizar la busqueda'});
    }else{
      var reporte = JSON.parse(JSON.stringify(rows[0]));
      res.status(200).json(reporte);
      console.log(reporte);

    }
  });
}

exports.APIReporteServicio = (req, res) => {
  console.log('GET /APIReporteServicio/:contrato');
  query="select orden_servicio.id_orden_servicio, concat(empleado.nombre,' ',empleado.ap_paterno,' ',empleado.ap_materno) as operador, agenda.id_unidad, unidad.numero_economico, tipo_unidad.id_tipo_unidad, tipo_unidad.kilometraje_mantenimineto, date_format(cotizacion.fecha_salida, '%e-%m-%Y') as fecha_salida, cotizacion.hora_salida, date_format(cotizacion.fecha_regreso, '%e-%m-%Y') as fecha_regreso, datediff(fecha_regreso, fecha_salida) as dias, concat(cotizacion.destino,', ',cotizacion.lugar_destino) as destino, cotizacion.itinerario, concat(persona.nombre,' ',persona.ap_paterno,' ',persona.ap_materno) as responsable, persona.telefono, cotizacion.importe, orden_servicio.kilometros_salida from orden_servicio join contrato on contrato.id_contrato = orden_servicio.id_contrato join cotizacion on cotizacion.id_cotizacion = contrato.id_cotizacion join persona on persona.id_persona = cotizacion.id_persona join agenda on agenda.id_contrato = contrato.id_contrato join unidad on unidad.id_unidad = agenda.id_unidad join tipo_unidad on tipo_unidad.id_tipo_unidad = unidad.id_tipo_unidad join operador on operador.id_operador = agenda.id_operador join empleado on empleado.id_empleado = operador.id_empleado where contrato.id_contrato=?";
  data = {}
  db.query("select count(*) as resp, id_orden_servicio from orden_servicio where id_contrato=?;", req.params.contrato, (err, rows) => {
    data['res'] = JSON.parse(JSON.stringify(rows[0]));
    if(data.res.resp == "0"){
      console.log('Error!! no se encontro ningun contrato con ese folio!!');
      res.redirect('/reporte_rendimiento');
    }else{
      db.query('select count(*) as res from reporte_rendimiento where  id_orden_servicio=?;', data.res.id_orden_servicio, (err, rows) => {
        data['re'] = JSON.parse(JSON.stringify(rows[0]));
        if(data.re.res == "1"){
          console.log('Error!! Ya se genero un reporte con el mismo folio de contrato...');
          res.redirect('/reporte_rendimiento');
        }else{
          db.query("select count(*) as cont from agenda where estatus='Brindado' and id_contrato=?;", req.params.contrato, (err, rows) => {
            data['co'] = JSON.parse(JSON.stringify(rows[0]));
            if(data.co.cont == "0"){
              console.log('Error!! El servico aun no sea brindado...');
              res.redirect('/reporte_rendimiento');
            }else{
              db.query(query,req.params.contrato, (err, rows) => {
                data['info'] = JSON.parse(JSON.stringify(rows[0]));
                res.status(200).json(data);
                console.log(data);
              });
            }
          });
        }
      });
    }
  });
}

//-----------------------------Busquedas------------------------------
exports.APIbusquedaRepRendimiento = (req, res) =>{
  console.log('GET /APIbusquedaRepRendimiento', req.params.tipo,' ',req.params.unidad,' ',req.params.fecha);
  query="select agenda.id_unidad, unidad.numero_economico as unidad, empleado.nombre as operador, cotizacion.destino,cotizacion.itinerario,cotizacion.importe,reporte_rendimiento.gastos_total, reporte_rendimiento.utilidad,orden_servicio.id_orden_servicio,contrato.id_contrato, reporte_rendimiento.id_reporte from orden_servicio join contrato on contrato.id_contrato=orden_servicio.id_contrato join reporte_rendimiento on reporte_rendimiento.id_orden_servicio=orden_servicio.id_orden_servicio join cotizacion on cotizacion.id_cotizacion= contrato.id_cotizacion join persona on persona.id_persona = cotizacion.id_persona join agenda on agenda.id_contrato = contrato.id_contrato join unidad on unidad.id_unidad = agenda.id_unidad join tipo_unidad on tipo_unidad.id_tipo_unidad = unidad.id_tipo_unidad join operador on operador.id_operador = agenda.id_operador join empleado on empleado.id_empleado = operador.id_empleado where concat(YEAR(cotizacion.fecha_regreso),'-',MONTH(cotizacion.fecha_regreso))=? and unidad.id_tipo_unidad= ? and unidad.numero_economico=?;";
  data={}
  query1="Select count(*) as reporte from orden_servicio join contrato on contrato.id_contrato=orden_servicio.id_contrato join reporte_rendimiento on reporte_rendimiento.id_orden_servicio=orden_servicio.id_orden_servicio join cotizacion on cotizacion.id_cotizacion= contrato.id_cotizacion join persona on persona.id_persona = cotizacion.id_persona join agenda on agenda.id_contrato = contrato.id_contrato join unidad on unidad.id_unidad = agenda.id_unidad join tipo_unidad on tipo_unidad.id_tipo_unidad = unidad.id_tipo_unidad join operador on operador.id_operador = agenda.id_operador join empleado on empleado.id_empleado = operador.id_empleado where concat(YEAR(cotizacion.fecha_regreso),'-',MONTH(cotizacion.fecha_regreso))=? and unidad.id_tipo_unidad= ? and unidad.numero_economico=?;";

  db.query(query1, [req.params.fecha, req.params.tipo, req.params.unidad], (err, rows) => {
    data['re']=JSON.parse(JSON.stringify(rows[0]));
    if(data.re.reporte=="0"){
      db.query("select agenda.id_unidad, unidad.numero_economico as unidad, empleado.nombre as operador, cotizacion.destino,cotizacion.itinerario,cotizacion.importe,reporte_rendimiento.gastos_total, reporte_rendimiento.utilidad,orden_servicio.id_orden_servicio,contrato.id_contrato, reporte_rendimiento.id_reporte from orden_servicio join contrato on contrato.id_contrato=orden_servicio.id_contrato join reporte_rendimiento on reporte_rendimiento.id_orden_servicio=orden_servicio.id_orden_servicio join cotizacion on cotizacion.id_cotizacion= contrato.id_cotizacion join persona on persona.id_persona = cotizacion.id_persona join agenda on agenda.id_contrato = contrato.id_contrato join unidad on unidad.id_unidad = agenda.id_unidad join tipo_unidad on tipo_unidad.id_tipo_unidad = unidad.id_tipo_unidad join operador on operador.id_operador = agenda.id_operador join empleado on empleado.id_empleado = operador.id_empleado;", (err, rows) => {
        if(err){
          res.status(500).json({error: 'Error al realizar la busqueda'});
        }else{
          var reportes = JSON.parse(JSON.stringify(rows));
          res.status(200).json(reportes);
          console.log(reportes);
        }
      });
    }else{
      db.query(query, [req.params.fecha, req.params.tipo, req.params.unidad], (err, rows) => {
        if(err){
          res.status(500).json({error: 'Error al realizar la busqueda'});
        }else{
          var reportes = JSON.parse(JSON.stringify(rows));
          res.status(200).json(reportes);
          console.log(reportes);
        }
      });
    }
  });
}
