const db = require('../../config/database'),
      multer = require('multer'),
      path = require('path');
var pdfs = require('./pdfs');

exports.inicio = (req, res) => {
  console.log('GET /indexSecretaria');
  data = {};
  db.query("select contrato.id_contrato, date_format(contrato.fecha_contrato, '%e-%m-%Y') as fecha_contrato, contrato.anticipo_numero, contrato.importe_restante, contrato.estatus, contrato.id_cotizacion, contrato.estado, cotizacion.importe from contrato inner join cotizacion on cotizacion.id_cotizacion = contrato.id_cotizacion order by id_contrato desc;", (err, rows) =>{
    var contrato = JSON.parse(JSON.stringify(rows));
    db.query("select count(id_contrato) as sin_agendar from contrato where estado='Sin agendar';", (err, rows) => {
      var sinAgendar = JSON.parse(JSON.stringify(rows));
      data['sinAgendar'] = sinAgendar;
      res.render('secretaria/index',{contrato : contrato, data});
    });
  });
}

exports.bitacoraV = (req, res) => {
  res.render('secretaria/generar_bitacora');
}

exports.contrato = (req, res) => {
  res.render('secretaria/generar_contrato');
}

exports.orden = (req, res) => {
  res.render('secretaria/generar_orden');
}

exports.agenda = (req, res) => {
  res.render('secretaria/agendar_servicio');
}

//api buscar cotizacion info
exports.APICotizacionInfo = (req, res) => {
  console.log('GET /api/APICotizacionInfo/:cotizacion');
  console.log(req.params.cotizacion);
  data ={}
  db.query("select count(*) as row from contrato where id_cotizacion=?;",[req.params.cotizacion], (err, rows) => {
    data['coti'] = JSON.parse(JSON.stringify(rows[0]));
    if(data.coti.row =="1"){
      console.log('Error!! ya se genero un contrato con el mismo numero de cotizacion..');
      //req.flash('danger','Error!! ya se genero un contrato con el mismo numero de cotizacion..');
      res.redirect('/generar_contrato');
    }else{
      db.query("select count(*) as coti from cotizacion where id_cotizacion=?",[req.params.cotizacion], (err, rows) => {
        data['resul'] = JSON.parse(JSON.stringify(rows[0]));
        if(data.resul.coti == "0"){
          console.log('Error!! el numero de cotizacion no existe!!');
          res.redirect('/generar_contrato');
        }else{
          db.query("select importe from cotizacion where id_cotizacion=?;",[req.params.cotizacion], (err, rows) => {
            data['importe'] = JSON.parse(JSON.stringify(rows[0]));
            if(data.importe.importe == ""){
              console.log('no se puede generar el contrato sin a ver puesto el importe de la misma');
              res.redirect('/generar_contrato');
            }else{
              db.query("select concat(persona.nombre,' ',persona.ap_paterno,' ',persona.ap_materno)as nombre, persona.estatus, persona.id_persona, cotizacion.id_cotizacion, concat(cotizacion.destino,', ',cotizacion.lugar_destino) as destino, date_format(fecha_salida, '%e-%m-%Y') as fecha_salida, concat(cotizacion.origen,', ',cotizacion.lugar_salida) as origen, cotizacion.hora_salida, cotizacion.itinerario, date_format(fecha_regreso, '%e-%m-%Y') as fecha_regreso, cotizacion.hora_regreso, cotizacion.importe,cotizacion_tipounidad.id_tipo_unidad,cotizacion_tipounidad.numero_unidades, concat(tipo_unidad.marca_unidad,' ',tipo_unidad.modelo_unidad,' ',tipo_unidad.numero_plazas) as modelo from cotizacion inner join persona on persona.id_persona =cotizacion.id_persona inner join cotizacion_tipounidad on cotizacion_tipounidad.id_cotizacion = cotizacion.id_cotizacion inner join tipo_unidad on tipo_unidad.id_tipo_unidad = cotizacion_tipounidad.id_tipo_unidad where cotizacion.id_cotizacion=?;",[req.params.cotizacion], (err, rows) => {
                var cotiza =JSON.parse(JSON.stringify(rows));
                res.status(200).json(cotiza[0]);
                console.log(cotiza[0]);
              });
            }
          });
        }
      });
    }
  });
}

exports.newContrato = (req, res) =>{
  console.log('POST /registrar/contrato');
  params = [req.body.adelanto, req.body.anticipo, req.body.saldo, req.body.cotizacionId];
  console.log(params);
  console.log(req.body.personaId);
  db.query("insert into contrato (fecha_contrato, anticipo_letra, anticipo_numero, importe_restante,estatus, id_cotizacion,estado) values (current_date,?,?,?,default,?,default);",params, (err, rows) => {
    if(err){
      console.log(err);
    }else{
      db.query("update persona set estatus='Cliente' where id_persona=?;", req.body.personaId, (err, rows) => {
        if(err){
          console.log(err);
        }else{
          console.log('Success ');
          res.redirect('/indexSecre');
        }
      });
    }
  });
}

exports.editContrato = (req, res) => {
  console.log('GET /editContrato:id_contrato', req.params.id_contrato);
  data={}
  db.query("select concat(persona.nombre,' ',persona.ap_paterno,' ',persona.ap_materno)as nombre, contrato.anticipo_letra, date_format(cotizacion.fecha_salida, '%e-%m-%Y') as fecha_salida, date_format(cotizacion.fecha_regreso, '%e-%m-%Y') as fecha_regreso, concat(cotizacion.origen,', ',cotizacion.lugar_salida) as salida, cotizacion.hora_salida, concat(cotizacion.origen,', ',cotizacion.lugar_salida) as regreso, cotizacion.hora_regreso, concat(cotizacion.destino,', ',cotizacion.lugar_destino) as destino,  cotizacion.itinerario, cotizacion.importe, contrato.id_contrato, contrato.anticipo_numero,contrato.importe_restante, date_format(contrato.fecha_contrato, '%e-%m-%Y')as fecha_contrato from cotizacion inner join contrato on contrato.id_cotizacion = cotizacion.id_cotizacion inner join persona on persona.id_persona = cotizacion.id_persona where contrato.id_contrato=?;", req.params.id_contrato, (err, rows) => {
    if(err) {
      console.log(err);
    }else {
      data['contrato'] = JSON.parse(JSON.stringify(rows[0]));
      res.render('secretaria/editar_contrato',data);
    }
  });
}

exports.updateContrato = (req, res) => {
  console.log('PUT /update/contrato', req.params.id_contrato);
  parms = [req.body.adelanto, req.body.anticipo, req.body.saldo, req.params.id_contrato];
  console.log(parms);
  db.query("update contrato set anticipo_letra=?, anticipo_numero=?, importe_restante=? where id_contrato=?;", parms, (err, rows) => {
    if(err){
      console.log(err);
    }else{
      console.log('update contrato Success');
      res.redirect('/indexSecre');
    }
  });
}

exports.cancelContrato = (req, res) => {
  console.log('GET /cancelar_contrato: ',req.params.id_contrato);
  data={}
  db.query("select COUNT(*) as result from contrato inner join agenda on agenda.id_contrato = contrato.id_contrato where agenda.estatus='Proximo' and contrato.id_contrato=?;", req.params.id_contrato, (err, rows) => {
    data['resultado'] = JSON.parse(JSON.stringify(rows[0]));
    if(err){
      console.log(err);
    }else{
      if(data.resultado.result =='0'){
        console.log('Ocurrio un error, verifique que el contrato no aya sido cancelado oh este en servicio');
        res.redirect('/indexSecre');
      }else{
        db.query("select numero_economico, id_operador, id_agenda from agenda where id_contrato=?", req.params.id_contrato, (err, rows) => {
          data['agenda'] = JSON.parse(JSON.stringify(rows[0]));
          if(err){
            console.log(err);
          }else{
            db.query("update unidad set estatus='Disponible' where numero_economico=?", data.agenda.numero_economico, (err, rows) => {
              if(err){
                console.log(err);
              }else{
                db.query("update operador set estatus='Disponible' where id_operador=?", data.agenda.id_operador, (err, rows) => {
                  if(err){
                    console.log(err);
                  }else{
                    db.query("update agenda set estatus='Cancelado' where id_agenda=?", data.agenda.id_agenda, (err, rows) => {
                      if(err){
                        console.log(err);
                      }else{
                        db.query("update contrato inner join agenda on agenda.id_contrato = contrato.id_contrato set contrato.estatus = 'Cancelado' where agenda.estatus = 'Proximo' and contrato.id_contrato=?;", req.params.id_contrato, (err, rows) => {
                          if(err){
                            console.log(err);
                          }else{
                            console.log('Contrato cancelado!!');
                            res.redirect('/indexSecre');
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    }
  });
}

exports.contratoPDF = (req, res) => {
  console.log('GET /contratoPDF/:folio');
  data = []
  query="select concat(persona.nombre,' ',persona.ap_paterno,' ',persona.ap_materno)as nombre, contrato.id_contrato, contrato.anticipo_letra, date_format(cotizacion.fecha_salida, '%e-%m-%Y') as fecha_salida, date_format(cotizacion.fecha_regreso, '%e-%m-%Y') as fecha_regreso, concat(cotizacion.origen,', ',cotizacion.lugar_salida,' a las ',cotizacion.hora_salida) as salida, concat(cotizacion.origen,', ',cotizacion.lugar_salida,' a las ',cotizacion.hora_regreso) as regreso, concat(cotizacion.destino,', ',cotizacion.lugar_destino) as destino, cotizacion.itinerario, cotizacion.importe,contrato.anticipo_numero,contrato.importe_restante, date_format(contrato.fecha_contrato, '%e-%m-%Y')as fecha_contrato from cotizacion inner join contrato on contrato.id_cotizacion = cotizacion.id_cotizacion inner join persona on persona.id_persona = cotizacion.id_persona where contrato.id_contrato=?;";
  db.query(query, [req.params.folio], (err, rows) => {
    contrato = JSON.parse(JSON.stringify(rows[0]));
    if(err)
        res.status(500).json(err);
    else
        pdfs.contratoPDF(contrato, res);
  });

}

//Agenda
exports.APIContratoInfo = (req, res) =>{
  console.log('GET /api/APIContratoInfo/:contrato', req.params.contrato);
  data ={}
  db.query("select count(*) as con from contrato where estado='Sin agendar' and id_contrato=?;", req.params.contrato, (err, rows) =>{
    data['cont']=JSON.parse(JSON.stringify(rows[0]));
    if(data.cont.con =="0"){
      console.log("Error el contrato ya se encuentra agendado..");
      res.redirect('/agendar_servicio');
    }else{
      db.query("select contrato.id_contrato, contrato.estatus, contrato.importe_restante, contrato.anticipo_numero, concat(persona.nombre,' ',persona.ap_paterno,' ',persona.ap_materno)as nombre, cotizacion.destino, date_format(cotizacion.fecha_salida, '%e-%m-%Y') as fecha_salida, concat(cotizacion.origen,', ',cotizacion.lugar_salida)as salida, date_format(cotizacion.fecha_regreso, '%e-%m-%Y') as fecha_regreso, cotizacion.hora_salida, cotizacion.hora_regreso, cotizacion.importe, cotizacion.id_cotizacion from contrato inner join cotizacion on cotizacion.id_cotizacion = contrato.id_cotizacion inner join persona on persona.id_persona = cotizacion.id_persona where contrato.id_contrato=?;", req.params.contrato, (err, rows) => {
          data['info'] = JSON.parse(JSON.stringify(rows[0]));
          if(data.info.nombre ==""){
            console.log('Error!! El servico ya se encuentra agendado...');
            res.redirect('/agendar_servicio');
          }else{
            db.query("select contrato.id_contrato, contrato.estado,cotizacion_tipounidad.id_cotizacion, cotizacion_tipounidad.id_tipo_unidad,cotizacion_tipounidad.numero_unidades, concat(tipo_unidad.marca_unidad,' ',tipo_unidad.modelo_unidad)as tipo, tipo_unidad.numero_plazas from contrato inner join cotizacion on cotizacion.id_cotizacion = contrato.id_cotizacion inner join cotizacion_tipounidad on cotizacion_tipounidad.id_cotizacion = cotizacion.id_cotizacion inner join tipo_unidad on tipo_unidad.id_tipo_unidad = cotizacion_tipounidad.id_tipo_unidad where contrato.id_contrato=?;", req.params.contrato, (err, rows) => {
              data['unidades'] = JSON.parse(JSON.stringify(rows[0]));
              if(err){
                console.log(err);
              }else{
                res.status(200).json(data);
                console.log(data);
              }
            });
          }
      });
    }
  });
}

exports.APIContratoUni = (req, res) => {
  console.log('GET /api/APIContratoUni:CONTRATO', req.params.contrato);
  data={}
  db.query("select count(*) as con from contrato where estado='Sin agendar' and id_contrato=?", req.params.contrato, (err, rows) => {
    data['cont']=JSON.parse(JSON.stringify(rows[0]));
    if(data.cont.con == "0"){
      console.log('Error!! El servico ya se encuentra agendado...');
    }else{
      db.query("select contrato.id_contrato, contrato.estado,cotizacion_tipounidad.id_cotizacion, cotizacion_tipounidad.id_tipo_unidad,cotizacion_tipounidad.numero_unidades, concat(tipo_unidad.marca_unidad,' ',tipo_unidad.modelo_unidad)as tipo, tipo_unidad.numero_plazas from contrato inner join cotizacion on cotizacion.id_cotizacion = contrato.id_cotizacion inner join cotizacion_tipounidad on cotizacion_tipounidad.id_cotizacion = cotizacion.id_cotizacion inner join tipo_unidad on tipo_unidad.id_tipo_unidad = cotizacion_tipounidad.id_tipo_unidad where contrato.id_contrato=?;", req.params.contrato, (err, rows) => {
        var unidades = JSON.parse(JSON.stringify(rows));
        if(err){
          console.log(err);
        }else{
          res.status(200).json(unidades);
          console.log(data);
        }
      });
    }
  });
}

//Agenda
exports.verAgenda = (req, res) => {
  console.log('GET /verAgenda');
  query = "select cotizacion.id_cotizacion as cotizacion, date_format(cotizacion.fecha_salida, '%e-%m-%Y') as fecha_salida, concat(cotizacion.destino,', ',cotizacion.lugar_destino) as destino, concat(cotizacion.origen,', ', cotizacion.lugar_salida) as salida, cotizacion.importe, date_format(cotizacion.fecha_regreso, '%e-%m-%Y') as fecha_regreso, concat(persona.nombre,' ',persona.ap_paterno,' ',persona.ap_materno) as nombre, contrato.id_contrato as contrato, date_format(contrato.fecha_contrato,'%e-%m-%Y') as fecha_contrato, agenda.id_agenda as agenda, agenda.estatus, unidad.numero_economico,unidad.numero_placas as placas, tipo_unidad.id_tipo_unidad, concat(tipo_unidad.marca_unidad,' ',tipo_unidad.modelo_unidad) as tipo, operador.id_operador, empleado.id_empleado, concat(empleado.nombre,' ',empleado.ap_paterno,' ',empleado.ap_materno) as operador from agenda join contrato on contrato.id_contrato = agenda.id_contrato join cotizacion on cotizacion.id_cotizacion = contrato.id_cotizacion join persona on persona.id_persona = cotizacion.id_persona join unidad on unidad.id_unidad = agenda.id_unidad join tipo_unidad on tipo_unidad.id_tipo_unidad = unidad.id_tipo_unidad join operador on operador.id_operador = agenda.id_operador join empleado on empleado.id_empleado = operador.id_empleado where agenda.estatus != 'Cancelado' order by id_agenda desc;";

  db.query(query, (err, rows) =>{
    agenda = JSON.parse(JSON.stringify(rows));
    if(err){
      console.log(err);
    }else{
      res.render('secretaria/ver_agenda',agenda);
    }
  });

}

exports.editarAgenda = (req, res) =>{
  console.log('GET /editar_agenda/', req.params.agenda);
  data = {}
  db.query("select concat(persona.nombre,' ',persona.ap_paterno,' ',persona.ap_materno) as nombre, cotizacion.id_cotizacion, concat(cotizacion.destino,', ',cotizacion.lugar_destino) as destino, date_format(cotizacion.fecha_salida, '%e-%m-%Y') as fecha_salida, concat(cotizacion.origen,', ', cotizacion.lugar_salida) as salida, cotizacion.hora_salida, cotizacion.hora_regreso, cotizacion.importe, date_format(cotizacion.fecha_regreso, '%e-%m-%Y') as fecha_regreso, contrato.importe_restante, agenda.estatus, agenda.id_agenda from agenda join contrato on contrato.id_contrato = agenda.id_contrato join cotizacion on cotizacion.id_cotizacion = contrato.id_cotizacion join persona on persona.id_persona = cotizacion.id_persona where id_agenda=?;", req.params.agenda, (err, rows) =>{
    data['info']=JSON.parse(JSON.stringify(rows[0]));
    if(err){
      console.log(err);
    }else{
      db.query("select contrato.id_contrato as contrato, concat(tipo_unidad.marca_unidad,' ',tipo_unidad.modelo_unidad) as tipo, tipo_unidad.numero_plazas,cotizacion_tipounidad.numero_unidades, agenda.id_unidad, agenda.id_operador from agenda join contrato on contrato.id_contrato = agenda.id_contrato join cotizacion on cotizacion.id_cotizacion = contrato.id_cotizacion join cotizacion_tipounidad on cotizacion_tipounidad.id_cotizacion = cotizacion.id_cotizacion join persona on persona.id_persona = cotizacion.id_persona join unidad on unidad.id_unidad = agenda.id_unidad join tipo_unidad on tipo_unidad.id_tipo_unidad = unidad.id_tipo_unidad join operador on operador.id_operador = agenda.id_operador join empleado on empleado.id_empleado = operador.id_empleado where id_agenda=?;", req.params.agenda, (err, rows) => {
        data['tabla']=JSON.parse(JSON.stringify(rows[0]));
        if(err){
          console.log(err);
        }else{
          res.render('secretaria/editar_agenda', data);
          console.log(data);
        }
      });
    }
  });
}

exports.updateAgenda = (req, res) => {
  console.log('PUT /updateAgenda/:', req.params.id_agenda);
  console.log('contrato ',req.body.contratoId,' cotizacion ',req.body.cotizacionId,' unidad ',req.body.uniAnterior, ' operador ', req.body.opeAnterior,' importe ',req.body.importe);
  console.log('new uni ', req.body.unid, ' new ope ', req.body.opera);
  coti=[req.body.hora_salida, req.body.hora_regreso, req.body.cotizacionId]
  db.query("update cotizacion set hora_salida=?, hora_regreso=? where id_cotizacion=?;", coti, (err, rows) => {
    if(err){
      console.log(err);
    }else{
      if(req.body.importe == "0"){
        contra=[req.body.importe,req.body.contratoId]
        db.query("update contrato set importe_restante=?, estatus='Liquidado' where id_contrato=?;", contra, (err, rows) => {
          if(err){
            console.log(err);
          }else{
            db.query("update unidad set estatus='Disponible' where id_unidad=?;", req.body.uniAnterior, (err, rows) => {
              if(err){
                console.log(err);
              }else{
                db.query("update operador set estatus='Disponible' where id_operador=?;", req.body.opeAnterior, (err, rows) => {
                  if(err){
                    console.log(err);
                  }else{
                    db.query("update unidad set estatus='Asignada' where id_unidad=?;", req.body.unid, (err, rows) => {
                      if(err){
                        console.log(err);
                      }else{
                        db.query("update operador set estatus='Asignado' where id_operador=?;", req.body.opera, (err, rows) => {
                          if(err){
                            console.log(err);
                          }else{
                            if(req.body.estatus =="En servicio"){
                              db.query("update unidad set estatus='En servicio' where id_unidad=?;", req.body.unid, (err, rows) => {
                                if(err){
                                  console.log(err);
                                }else{
                                  db.query("update operador set estatus='En servicio' where id_operador=?;", req.body.opera, (err, rows) => {
                                    if(err){
                                      console.log(err);
                                    }else{
                                      agen=[req.body.contratoId, req.body.unid, req.body.opera, req.body.estatus, req.params.id_agenda]
                                      db.query("update agenda set id_contrato=?, id_unidad=?, id_operador=?, estatus=? where id_agenda=?", agen, (err, rows) => {
                                        if(err){
                                          console.log(err);
                                        }else{
                                          console.log('Success update agenda');
                                          res.redirect('/ver_agenda');
                                        }
                                      });
                                    }
                                  });
                                }
                              });
                            }else{
                              if(req.body.estatus =="Brindado"){
                                db.query("update unidad set estatus='Disponible' where id_unidad=?;", req.body.unid, (err, rows) => {
                                  if(err){
                                    console.log(err);
                                  }else{
                                    db.query("update operador set estatus='Disponible' where id_operador=?;", req.body.opera, (err, rows) => {
                                      if(err){
                                        console.log(err);
                                      }else{
                                        agen=[req.body.contratoId, req.body.unid, req.body.opera, req.body.estatus, req.params.id_agenda]
                                        db.query("update agenda set id_contrato=?, id_unidad=?, id_operador=?, estatus=? where id_agenda=?", agen, (err, rows) => {
                                          if(err){
                                            console.log(err);
                                          }else{
                                            console.log('Success update agenda');
                                            res.redirect('/ver_agenda');
                                          }
                                        });
                                      }
                                    });
                                  }
                                });
                              }else{
                                if(req.body.estatus =="Proximo"){
                                  db.query("update unidad set estatus='Asignada' where id_unidad=?;", req.body.unid, (err, rows) => {
                                    if(err){
                                      console.log(err);
                                    }else{
                                      db.query("update operador set estatus='Asignado' where id_operador=?;", req.body.opera, (err, rows) => {
                                        if(err){
                                          console.log(err);
                                        }else{
                                          agen=[req.body.contratoId, req.body.unid, req.body.opera, req.body.estatus, req.params.id_agenda]
                                          db.query("update agenda set id_contrato=?, id_unidad=?, id_operador=?, estatus=? where id_agenda=?", agen, (err, rows) => {
                                            if(err){
                                              console.log(err);
                                            }else{
                                              console.log('Success update agenda');
                                              res.redirect('/ver_agenda');
                                            }
                                          });
                                        }
                                      });
                                    }
                                  });
                                }
                              }
                            }
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }else{
        contra=[req.body.importe,req.body.contratoId]
        console.log('llego antes de contrato ');
        db.query("update contrato set importe_restante=?, estatus='Pendiente' where id_contrato=?;", contra, (err, rows) => {
          if(err){
            console.log(err);
          }else{
            console.log('llego antes de unidad');
            db.query("update unidad set estatus='Disponible' where id_unidad=?;", req.body.uniAnterior, (err, rows) => {
              if(err){
                console.log(err);
              }else{
                db.query("update operador set estatus='Disponible' where id_operador=?;", req.body.opeAnterior, (err, rows) => {
                  if(err){
                    console.log(err);
                  }else{
                    db.query("update unidad set estatus='Asignada' where id_unidad=?;", req.body.unid, (err, rows) =>{
                      if(err){
                        console.log(err);
                      }else{
                        db.query("update operador set estatus='Asignado' where id_operador=?;", req.body.opera, (err, rows) =>{
                          if(err){
                            console.log(err);
                          }else{
                            if(req.body.estatus=="En servicio"){
                              db.query("update unidad set estatus='En servicio' where id_unidad=?;", req.body.unid, (err, rows) => {
                                if(err){
                                  console.log(err);
                                }else{
                                  db.query("update operador set estatus='En servicio' where id_operador=?;", req.body.opera, (err, rows) => {
                                    if(err){
                                      console.log(err);
                                    }else{
                                      agen=[req.body.contratoId, req.body.unid, req.body.opera, req.body.estatus, req.params.id_agenda]
                                      db.query("update agenda set id_contrato=?, id_unidad=?, id_operador=?, estatus=? where id_agenda=?", agen, (err, rows) => {
                                        if(err){
                                          console.log(err);
                                        }else{
                                          console.log('Success update agenda');
                                          res.redirect('/ver_agenda');
                                        }
                                      });
                                    }
                                  });
                                }
                              });
                            }else{
                              if(req.body.estatus=="Brindado"){
                                db.query("update unidad set estatus='Disponible' where id_unidad=?;", req.body.unid, (err, rows) => {
                                  if(err){
                                    console.log(err);
                                  }else{
                                    db.query("update operador set estatus='Disponible' where id_operador=?;", req.body.opera, (err, rows) => {
                                      if(err){
                                        console.log(err);
                                      }else{
                                        agen=[req.body.contratoId, req.body.unid, req.body.opera, req.body.estatus, req.params.id_agenda]
                                        db.query("update agenda set id_contrato=?, id_unidad=?, id_operador=?, estatus=? where id_agenda=?", agen, (err, rows) => {
                                          if(err){
                                            console.log(err);
                                          }else{
                                            console.log('Success update agenda');
                                            res.redirect('/ver_agenda');
                                          }
                                        });
                                      }
                                    });
                                  }
                                });

                              }else{
                                if(req.body.estatus=="Proximo"){
                                  db.query("update unidad set estatus='Asignada' where id_unidad=?;", req.body.unid, (err, rows) => {
                                    if(err){
                                      console.log(err);
                                    }else{
                                      db.query("update operador set estatus='Asignado' where id_operador=?;", req.body.opera, (err, rows) => {
                                        if(err){
                                          console.log(err);
                                        }else{
                                          agen=[req.body.contratoId, req.body.unid, req.body.opera, req.body.estatus, req.params.id_agenda]
                                          db.query("update agenda set id_contrato=?, id_unidad=?, id_operador=?, estatus=? where id_agenda=?", agen, (err, rows) => {
                                            if(err){
                                              console.log(err);
                                            }else{
                                              console.log('Success update agenda');
                                              res.redirect('/ver_agenda');
                                            }
                                          });
                                        }
                                      });
                                    }
                                  });
                                }
                              }
                            }
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    }
  });

}

exports.agendar = (req, res) => {
  console.log('POST/ /Agendar/contratos');
  params=[req.body.contratoId, req.body.unid, req.body.opera]
  console.log(params);

  db.query("insert into agenda (id_contrato,id_unidad,id_operador,estatus) values (?,?,?,default)",params, (err, rows) =>{
    if(err){
      console.log(err);
    }else{
      console.log('inserto en agenda');
      db.query("update contrato set estado='Agendado' where id_contrato=?;", req.body.contratoId, (err, rows) => {
        if(err){
          console.log(err);
        }else{
          console.log('actualizo contrato');
          db.query("update unidad set estatus='Asignada' where id_unidad=?;", req.body.unid, (err, rows) => {
            if(err){
              console.log(err);
            }else{
              console.log('actualizo unidad');
              db.query("update operador set estatus='Asignado' where id_operador=?;", req.body.opera, (err, rows) => {
                if(err){
                  console.log(err);
                }else{
                  console.log('actualizo operador');
                  console.log('Success :)');
                  res.redirect('/ver_agenda');
                }
              });
            }
          });
        }
      });
    }
  });
}

exports.APITipoUnidad = (req, res) => {
  console.log('GET /api/APITipoUnidad/', req.params.unidad);

  db.query("select tipo_unidad.id_tipo_unidad as id, tipo_unidad.marca_unidad as marca, tipo_unidad.modelo_unidad as modelo, tipo_unidad.numero_plazas as plazas, unidad.id_unidad, unidad.numero_economico as numero, unidad.numero_placas, unidad.estatus from tipo_unidad join unidad on unidad.id_tipo_unidad = tipo_unidad.id_tipo_unidad where tipo_unidad.id_tipo_unidad=?;", [req.params.unidad], (err, rows) => {
    var unidades = JSON.parse(JSON.stringify(rows));
    res.status(200).json(unidades);
    console.log(unidades);
  });
}

exports.APIOperadorDisponible = (req, res) => {
  console.log('GET /api/APIOperadorDisponible/');

  db.query("select concat(empleado.nombre,' ',empleado.ap_paterno,' ',empleado.ap_materno) as nombre, empleado.telefono, operador.id_operador, operador.numero_licencia, operador.tipo_licencia, operador.vigencia_licencia as vigencia, operador.estatus from operador join empleado on empleado.id_empleado = operador.id_empleado;", (err, rows) =>{
    var choferes = JSON.parse(JSON.stringify(rows));
    res.status(200).json(choferes)
    console.log(choferes);
  });
}

exports.APIFindContrato = (req, res) =>{
  console.log('GET /api/APIFindContrato/:contrato', req.params.contrato);
  query="select cotizacion.id_cotizacion as cotizacion, concat(cotizacion.destino,', ',cotizacion.lugar_destino) as destino, concat(cotizacion.origen,', ', cotizacion.lugar_salida) as salida, cotizacion.hora_salida, cotizacion.hora_regreso, concat(persona.nombre,' ',persona.ap_paterno,' ',persona.ap_materno) as nombre, contrato.id_contrato as contrato, agenda.id_agenda as agenda, agenda.estatus, unidad.numero_economico,unidad.numero_placas as placas, tipo_unidad.id_tipo_unidad, concat(tipo_unidad.marca_unidad,' ',tipo_unidad.modelo_unidad) as tipo, tipo_unidad.marca_unidad as marca, tipo_unidad.modelo_unidad as modelo, operador.id_operador, empleado.id_empleado, concat(empleado.nombre,' ',empleado.ap_paterno,' ',empleado.ap_materno) as operador, operador.numero_licencia, operador.tipo_licencia, operador.vigencia_licencia from agenda join contrato on contrato.id_contrato = agenda.id_contrato join cotizacion on cotizacion.id_cotizacion = contrato.id_cotizacion join persona on persona.id_persona = cotizacion.id_persona join unidad on unidad.id_unidad = agenda.id_unidad join tipo_unidad on tipo_unidad.id_tipo_unidad = unidad.id_tipo_unidad join operador on operador.id_operador = agenda.id_operador join empleado on empleado.id_empleado = operador.id_empleado where contrato.id_contrato=?;";
  data ={}
  db.query("select count(*) as agenda from agenda where estatus='Proximo' and id_contrato=?;", req.params.contrato, (err, rows) => {
    data['age']= JSON.parse(JSON.stringify(rows[0]));
    if(data.age.agenda == "0"){
      console.log('Error!! No se puede generar la bitacora sin antes a ver agendado el Servicio!!');
      res.redirect('/generar_bitacora');
    }else{
      db.query("select count(*) as bita from bitacora where id_contrato=?;", req.params.contrato, (err, rows) => {
        data['bit']= JSON.parse(JSON.stringify(rows[0]));
        if(data.bit.bita == "1"){
          console.log('Error!!! Ya se ah generador una bitacora de viaje con el mismo No. de contrato');
          res.redirect('/generar_bitacora');
        }else{
          db.query(query, req.params.contrato, (err, rows) => {
            data['info'] = JSON.parse(JSON.stringify(rows[0]));
            res.status(200).json(data);
            console.log('Success!');
            console.log(data);
          });
        }
      });
    }
  });
}

exports.newBitacora = (req, res) =>{
  console.log('POST /registrar/Bitacora');
  params = [req.body.viaje, req.body.contratoId];
  console.log(params);
  db.query("insert into bitacora (fecha_bitacora,tipo_traslado,id_contrato) values (current_date,?,?);",params, (err, rows) =>{
    if(err){
      console.log(err);
    }else{
      console.log('Success ');
      res.redirect('/ver_bitacoras');
    }
  });
}


exports.verBitacora = (req, res) => {
  console.log('GET /ver_Bitacoras');
  query="select contrato.id_contrato, date_format(bitacora.fecha_bitacora, '%e-%m-%Y') as fecha_bitacora, concat(cotizacion.destino,', ',cotizacion.lugar_destino) as destino, concat(empleado.nombre,' ',empleado.ap_paterno,' ',empleado.ap_materno) as operador, agenda.id_unidad, unidad.numero_economico, date_format(cotizacion.fecha_salida, '%e-%m-%Y') as fecha_salida, date_format(cotizacion.fecha_regreso, '%e-%m-%Y') as fecha_regreso from bitacora join contrato on contrato.id_contrato = bitacora.id_contrato join cotizacion on cotizacion.id_cotizacion = contrato.id_contrato join agenda on agenda.id_contrato = contrato.id_contrato join operador on operador.id_operador = agenda.id_operador join unidad on unidad.id_unidad = agenda.id_unidad join empleado on empleado.id_empleado = operador.id_empleado order by id_contrato desc;";
  db.query(query, (err, rows) =>{
    bitacoras = JSON.parse(JSON.stringify(rows));
    if(err){
      console.log(err);
    }else{
      res.render('secretaria/ver_bitacora',bitacoras);
    }
  });
}

exports.bitacoraPDF = (req, res) => {
  console.log('GET /bitacoraPDF/:folio', req.params.folio);
  data = []
  query="select contrato.id_contrato as contrato, tipo_unidad.marca_unidad as marca, tipo_unidad.modelo_unidad as modelo, unidad.numero_economico, unidad.numero_placas as placas, agenda.id_unidad, concat(empleado.nombre,' ',empleado.ap_paterno,' ',empleado.ap_materno) as operador, operador.numero_licencia, operador.tipo_licencia, date_format(operador.vigencia_licencia, '%e-%m-%Y') as vigencia_licencia, concat(cotizacion.origen,', ', cotizacion.lugar_salida) as origen, concat(cotizacion.destino,', ',cotizacion.lugar_destino) as destino, cotizacion.hora_salida, cotizacion.hora_regreso, bitacora.tipo_traslado, date_format(bitacora.fecha_bitacora, '%e-%m-%Y') as fecha_bitacora, concat(persona.nombre,' ',persona.ap_paterno,' ',persona.ap_materno) as nombre from bitacora join contrato on contrato.id_contrato = bitacora.id_contrato join cotizacion on cotizacion.id_cotizacion = contrato.id_cotizacion join persona on persona.id_persona = cotizacion.id_persona join agenda on agenda.id_contrato = contrato.id_contrato join unidad on unidad.id_unidad = agenda.id_unidad join tipo_unidad on tipo_unidad.id_tipo_unidad = unidad.id_tipo_unidad join operador on operador.id_operador = agenda.id_operador join empleado on empleado.id_empleado = operador.id_empleado where contrato.id_contrato=?;";
  db.query(query, [req.params.folio], (err, rows) => {
    bitacora = JSON.parse(JSON.stringify(rows[0]));
    if(err)
        res.status(500).json(err);
    else
        pdfs.bitacoraPDF(bitacora, res);
  });

}

exports.APIOrdenContrato = (req, res) =>{
  console.log('GET /api/APIOrdenContrato/:contrato', req.params.contrato);
  query="select contrato.id_contrato as contrato, concat(persona.nombre,' ',persona.ap_paterno,' ',persona.ap_materno) as nombre, persona.telefono, date_format(cotizacion.fecha_salida, '%e-%m-%Y') as fecha_salida, concat(cotizacion.origen,', ', cotizacion.lugar_salida) as salida, cotizacion.hora_salida, date_format(cotizacion.fecha_regreso, '%e-%m-%Y') as fecha_regreso, cotizacion.hora_regreso, concat(cotizacion.destino,', ',cotizacion.lugar_destino) as destino, cotizacion.itinerario, concat(empleado.nombre,' ',empleado.ap_paterno,' ',empleado.ap_materno) as operador, unidad.kilometraje_actual, unidad.numero_economico, unidad.id_unidad from contrato join cotizacion on cotizacion.id_cotizacion = contrato.id_cotizacion join persona on persona.id_persona = cotizacion.id_persona join agenda on agenda.id_contrato = contrato.id_contrato join unidad on unidad.id_unidad = agenda.id_unidad join tipo_unidad on tipo_unidad.id_tipo_unidad = unidad.id_tipo_unidad join operador on operador.id_operador = agenda.id_operador join empleado on empleado.id_empleado = operador.id_empleado where contrato.id_contrato=?;";
  data ={}
  db.query("select count(*) as agen from agenda where estatus='Proximo' and id_contrato=?;", req.params.contrato, (err, rows) => {
    data['agend']=JSON.parse(JSON.stringify(rows[0]));
    if(data.agend.agen =="0"){
      console.log("Error!! verifique que el numero de contrato es correcto..");
      res.redirect('/generar_orden');
    }else{
      db.query("select count(*) as ord from orden_servicio where id_contrato=?;", req.params.contrato, (err, rows) => {
        data['orde']=JSON.parse(JSON.stringify(rows[0]));
        if(data.orde.ord == "1") {
          console.log("Error! Ya se aregistrado una orden de servicio con el mismo No. de contrato...");
          res.redirect('/generar_orden');
        }else{
          db.query(query, req.params.contrato, (err, rows) => {
            data['info'] = JSON.parse(JSON.stringify(rows[0]));
            res.status(200).json(data);
            console.log('Success');
            console.log(data);
          });
        }
      });
    }
  });
}

exports.newOrden = (req, res) =>{
  console.log('POST /registrar/orden_servicio');
  params = [req.body.kmsalida, req.body.contratoId];
  console.log(params, req.body.unidadId);
  db.query("insert into orden_servicio (fecha_orden_servicio,kilometros_salida,id_contrato) values (current_date,?,?);",params, (err, rows) =>{
    if(err){
      console.log(err);
    }else{
      parms=[req.body.kmsalida, req.body.unidadId];
      db.query("update unidad set kilometraje_actual=? where id_unidad=?;", parms, (err, rows) => {
        if(err){
          console.log(err);
        }else{
          console.log('Success');
          res.redirect('/ver_ordenServicio');
        }
      });
    }
  });
}

//falta hacer la consulta
exports.verOrden = (req, res) => {
  console.log('GET /ver_Bitacoras');
  query="select orden_servicio.id_contrato as contrato, date_format(orden_servicio.fecha_orden_servicio, '%e-%m-%Y')as fecha_orden_servicio, orden_servicio.id_orden_servicio, concat(persona.nombre,' ',persona.ap_paterno,' ',persona.ap_materno) as nombre, persona.telefono, date_format(cotizacion.fecha_salida, '%e-%m-%Y') as fecha_salida, concat(cotizacion.origen,', ', cotizacion.lugar_salida) as salida, cotizacion.hora_salida, date_format(cotizacion.fecha_regreso, '%e-%m-%Y') as fecha_regreso, cotizacion.hora_regreso, concat(cotizacion.destino,', ',cotizacion.lugar_destino) as destino, cotizacion.itinerario, unidad.id_unidad, unidad.kilometraje_actual, concat(empleado.nombre,' ',empleado.ap_paterno,' ',empleado.ap_materno) as operador from orden_servicio join contrato on contrato.id_contrato = orden_servicio.id_contrato join cotizacion on cotizacion.id_cotizacion = contrato.id_cotizacion join persona on persona.id_persona = cotizacion.id_persona join agenda on agenda.id_contrato = contrato.id_contrato join unidad on unidad.id_unidad = agenda.id_unidad join tipo_unidad on tipo_unidad.id_tipo_unidad = unidad.id_tipo_unidad join operador on operador.id_operador = agenda.id_operador join empleado on empleado.id_empleado = operador.id_empleado order by contrato desc;";
  db.query(query, (err, rows) =>{
    ordenes = JSON.parse(JSON.stringify(rows));
    if(err){
      console.log(err);
    }else{
      res.render('secretaria/ver_orden',ordenes);
    }
  });
}

exports.ordenPDF = (req, res) => {
  console.log('GET /ordenPDF/:folio', req.params.folio);
  data = []
  query="select contrato.id_contrato,date_format(orden_servicio.fecha_orden_servicio, '%e-%m-%Y') as fecha_orden_servicio, concat(persona.nombre,' ',persona.ap_paterno,' ',persona.ap_materno) as responsable, persona.telefono, date_format(cotizacion.fecha_salida, '%e-%m-%Y') as fecha_salida, date_format(cotizacion.fecha_regreso, '%e-%m-%Y') as fecha_regreso, cotizacion.hora_regreso, concat(cotizacion.origen,', ', cotizacion.lugar_salida,', a las ',cotizacion.hora_salida) as salida, concat(cotizacion.origen,', ', cotizacion.lugar_salida) as regreso, concat(cotizacion.destino,', ',cotizacion.lugar_destino) as destino, cotizacion.itinerario, orden_servicio.kilometros_salida, concat(empleado.nombre,' ',empleado.ap_paterno,' ',empleado.ap_materno) as operador from orden_servicio join contrato on contrato.id_contrato = orden_servicio.id_contrato join cotizacion on cotizacion.id_cotizacion = contrato.id_cotizacion join persona on persona.id_persona = cotizacion.id_persona join agenda on agenda.id_contrato = contrato.id_contrato join unidad on unidad.id_unidad = agenda.id_unidad join tipo_unidad on tipo_unidad.id_tipo_unidad = unidad.id_tipo_unidad join operador on operador.id_operador = agenda.id_operador join empleado on empleado.id_empleado = operador.id_empleado where contrato.id_contrato=?;";
  db.query(query, [req.params.folio], (err, rows) => {
    orden = JSON.parse(JSON.stringify(rows[0]));
    if(err)
        res.status(500).json(err);
    else
        pdfs.ordenPDF(orden, res);
  });

}

//---------------------------------Cotizacion
exports.verCotizaciones = (req, res) => {
  console.log('GET /ver_cotizacionesSecre');
  data = {}
  db.query("select concat(persona.nombre,' ',persona.ap_paterno,' ',persona.ap_materno)as nombre, persona.estatus,persona.telefono, persona.correo_electronico, concat(persona.calle,' ',persona.numero_interior,' ',persona.colonia,' ',persona.codigo_postal)as direccion, cotizacion.id_cotizacion, date_format(fecha_salida, '%e-%m-%Y') as fecha_salida, cotizacion.itinerario,  date_format(fecha_regreso, '%e-%m-%Y') as fecha_regreso, cotizacion.importe, cotizacion.id_persona, cotizacion_tipounidad.id_tipo_unidad, cotizacion_tipounidad.numero_unidades, concat(tipo_unidad.marca_unidad,' ',tipo_unidad.modelo_unidad,' ',tipo_unidad.numero_plazas) as modelo from cotizacion inner join persona on persona.id_persona =cotizacion.id_persona inner join cotizacion_tipounidad on cotizacion_tipounidad.id_cotizacion = cotizacion.id_cotizacion inner join tipo_unidad on tipo_unidad.id_tipo_unidad = cotizacion_tipounidad.id_tipo_unidad order by id_cotizacion desc;", function(err, rows){
      var cotizaciones = JSON.parse(JSON.stringify(rows));
      db.query("select count(id_cotizacion) as cotizaciones_pendientes from cotizacion where importe=0;", function(err, rows){
        var pendientes = JSON.parse(JSON.stringify(rows));
        data['pendientes']=pendientes;
        res.render('secretaria/ver_cotizaciones', {cotizaciones: cotizaciones,data});
        console.log(data);
      });
      // console.log(usuarios)
  });
}

exports.cotiza = (req, res) => {
  console.log('GET /cotizacion personal Secre');
        data = {};

        db.query("select * from tipo_unidad;", function(err, rows){
            var unidades = JSON.parse(JSON.stringify(rows));
            data['unidades'] = unidades;

            res.render('secretaria/cotizacion_nueva', data);
        });
}

//API :- Info Cotizacion
exports.APIDetalleCotizacion = function(req, res){
  console.log('llego api');
  query = "select concat(persona.nombre,' ',persona.ap_paterno,' ',persona.ap_materno)as nombre, persona.estatus, persona.telefono, persona.correo_electronico, concat('Calle   ',persona.calle,'      ',persona.numero_interior,'      Colonia    ',persona.colonia,'     Codigo postal    ',persona.codigo_postal)as direccion, cotizacion.id_cotizacion, concat(cotizacion.destino,', ',cotizacion.lugar_destino) as destino, date_format(fecha_salida, '%e-%m-%Y') as fecha_salida, concat(cotizacion.origen,', ',cotizacion.lugar_salida) as origen, cotizacion.hora_salida, cotizacion.itinerario, date_format(fecha_regreso, '%e-%m-%Y') as fecha_regreso, cotizacion.hora_regreso, cotizacion.importe,cotizacion_tipounidad.id_tipo_unidad,cotizacion_tipounidad.numero_unidades, concat(tipo_unidad.marca_unidad,' ',tipo_unidad.modelo_unidad,' ',tipo_unidad.numero_plazas) as modelo from cotizacion inner join persona on persona.id_persona =cotizacion.id_persona inner join cotizacion_tipounidad on cotizacion_tipounidad.id_cotizacion = cotizacion.id_cotizacion inner join tipo_unidad on tipo_unidad.id_tipo_unidad = cotizacion_tipounidad.id_tipo_unidad where cotizacion.id_cotizacion=?;";
  console.log(req.params.id_cotizacion);
  db.query(query, [req.params.id_cotizacion], function(err, rows){
    if(err){
      res.status(500).json({error: 'Error al realizar la busqueda'});
    }else{
      var cotizacion = JSON.parse(JSON.stringify(rows[0]));
      res.status(200).json(cotizacion);
      console.log(cotizacion);
    }
  });
}

exports.verPersona = (req, res) =>{
  console.log('GET /persona/editar/:id_persona');
  data={}
  db.query("select * from persona where id_persona=?", [req.params.id_persona], (err, rows) =>{
    data['persona'] = JSON.parse(JSON.stringify(rows[0]));
    res.render('secretaria/editar_personas', data);
    console.log(data);
  });
}

exports.editarPersona = (req, res) => {
  console.log('PUT /persona/update');
  parms=[req.body.nombre, req.body.ap_paterno, req.body.ap_materno, req.body.telefono, req.body.correo, req.body.calle, req.body.num_interior, req.body.colonia, req.body.codigo_postal, req.body.estado, req.body.idpersona]
  console.log(parms);
  db.query("update persona set nombre=?, ap_paterno=?, ap_materno=?, telefono=?, correo_electronico=?, calle=?, numero_interior=?, colonia=?, codigo_postal=?, estatus=? where id_persona=?;", parms, (err, result) =>{
    if(err){
      console.log('error al actualizar persona ' + err);
    }else{
      console.log('se actualizo cotizacion');
      res.redirect('/cotizacion_presencialSecre');
    }
  });

}

exports.APIBuscarPorPersonaNombre = function(req, res){
        console.log('GET /api/persona/buscar/nombre/:nombre/')
        db.query('select * from persona where nombre LIKE "%'+req.params.nombre+'%";', function(err, rows){
            var personas = JSON.parse(JSON.stringify(rows));
            res.status(200).json(personas);
            console.log(personas);
        });
    }

exports.registrar_coti = (req, res) => {
  console.log('POST /registrar_coti');
  id=req.body.id_persona;
  console.log(id);
  if(id == ""){
    console.log('Nuevo cliente');
    params=[req.body.nombre, req.body.ap_paterno, req.body.ap_materno, req.body.telefono, req.body.correo, req.body.calle, req.body.num_interior, req.body.colonia, req.body.codigo_postal]
    console.log(params);
    db.query("insert into persona (nombre, ap_paterno, ap_materno, telefono, correo_electronico, calle, numero_interior, colonia, codigo_postal, estatus) values (?,?,?,?,?,?,?,?,?,'Solicitante');", params, function(err, rows){
      if(err){
        console.log('error al insertar persona ' + err);
      }else{
        console.log('inserto persona su id: ' + rows.insertId);
        parmms1=[req.body.ciudad_destino, req.body.lugar_destino, req.body.fecha_salida, req.body.ciudad_origen, req.body.lugar_origen, req.body.hora_salida, req.body.itinerario, req.body.fecha_regreso, req.body.hora_regreso, rows.insertId]
        console.log(parmms1);
        db.query("insert into cotizacion (destino, lugar_destino, fecha_salida, origen, lugar_salida, hora_salida, itinerario, fecha_regreso, hora_regreso, importe, id_persona) values (?,?,?,?,?,?,?,?,?,default,?);", parmms1, function(err, rows){
          if(err){
            console.log('error al insertar cotizacion ' + err);
          }else{
            console.log('inserto cotizacion su id: ' + rows.insertId);
            console.log(rows.insertId + ' ' + req.body.tipo);
            db.query("insert into cotizacion_tipounidad (id_cotizacion, id_tipo_unidad, numero_unidades) values ("+rows.insertId+","+req.body.tipo+",1);", function(err, rows){
              if(err){
                console.log('error al insertar cotizacion_tipounidad ' + err);
              }else{
                console.log('success');
                res.redirect('/ver_cotizacionesSecre');
              }
            });
          }
        });
      }
    });
  }else{
    console.log('persona registrada su id: ' + id);
    parmms1=[req.body.ciudad_destino, req.body.lugar_destino, req.body.fecha_salida, req.body.ciudad_origen, req.body.lugar_origen, req.body.hora_salida, req.body.itinerario, req.body.fecha_regreso, req.body.hora_regreso, req.body.id_persona]
    console.log(parmms1);
    db.query("insert into cotizacion (destino, lugar_destino, fecha_salida, origen, lugar_salida, hora_salida, itinerario, fecha_regreso, hora_regreso, importe, id_persona) values (?,?,?,?,?,?,?,?,?,default,?);", parmms1, function(err, rows){
      if(err){
        console.log('error al insertar cotizacion ' + err);
      }else{
        console.log('inserto cotizacion su id: ' + rows.insertId);
        console.log(rows.insertId + ' ' + req.body.tipo );
        db.query("insert into cotizacion_tipounidad (id_cotizacion, id_tipo_unidad, numero_unidades) values ("+rows.insertId+","+req.body.tipo+",1);", function(err, rows){
          if(err){
            console.log('error al insertar cotizacion_tipounidad ' + err);
          }else{
            console.log('success');
            res.redirect('/ver_cotizacionesSecre');
          }
        });
      }
    });
  }

}

exports.editar_cotizacion = (req, res) =>{
  console.log('GET /editar_cotizacionSecre/:id_cotizacion');
  data = {}
  query = "select persona.id_persona, concat(persona.nombre,' ',persona.ap_paterno,' ',persona.ap_materno) as nombre, persona.estatus, persona.telefono, persona.correo_electronico, cotizacion.id_cotizacion,cotizacion.destino, cotizacion.lugar_destino, date_format(fecha_salida, '%Y-%m-%e') as fecha_salida, cotizacion.origen, cotizacion.lugar_salida, cotizacion.hora_salida, cotizacion.itinerario, date_format(fecha_regreso, '%Y-%m-%e') as fecha_regreso, cotizacion.hora_regreso, cotizacion.importe,cotizacion_tipounidad.id_tipo_unidad,cotizacion_tipounidad.numero_unidades, tipo_unidad.marca_unidad ,tipo_unidad.modelo_unidad, tipo_unidad.numero_plazas from cotizacion inner join persona on persona.id_persona =cotizacion.id_persona inner join cotizacion_tipounidad on cotizacion_tipounidad.id_cotizacion = cotizacion.id_cotizacion inner join tipo_unidad on tipo_unidad.id_tipo_unidad = cotizacion_tipounidad.id_tipo_unidad where cotizacion.id_cotizacion=?;";
  db.query("select * from tipo_unidad", (err, rows) =>{
    data['tipo_unidad'] = JSON.parse(JSON.stringify(rows));
    db.query(query, [req.params.id_cotizacion], function(err, rows){
      data['cotizacion'] = JSON.parse(JSON.stringify(rows[0]));
      res.render('secretaria/editar_cotizacion', data);
      console.log(data);
    });
  });
}

exports.update_coti = (req, res) =>{
  console.log('PUT /cotiza/editSecre/:id_cotizacion');
  parms1=[req.body.ciudad_destino, req.body.lugar_destino, req.body.fecha_salida, req.body.ciudad_origen, req.body.lugar_origen, req.body.hora_salida, req.body.itinerario, req.body.fecha_regreso, req.body.hora_regreso, req.body.importe, req.body.idpersona, req.params.id_cotizacion]
  console.log(parms1);
  db.query("update cotizacion set destino=?, lugar_destino=?, fecha_salida=?, origen=?, lugar_salida=?, hora_salida=?, itinerario=?, fecha_regreso=?, hora_regreso=?, importe=?, id_persona=? where id_cotizacion=?;", parms1, (err, result) =>{
    if(err){
      console.log('error al actualizar cotizacion ' + err);
    }else{
      console.log('se actualizo cotizacion');
      console.log('success');
      res.redirect('/ver_cotizacionesSecre');
    }
  });
}
