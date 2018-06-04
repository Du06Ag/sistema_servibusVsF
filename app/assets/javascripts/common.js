function toast(text) {
	Materialize.toast(text, 100, 'rounded');
}
function error(text) {
	vNotify.error({
	 text: JSON.stringify(text),
	 title: 'Error: ',
	 position: 'bottomRight'
	});
}
function errorTop(text) {
	vNotify.error({
	 text: text,
	 title: 'Error: ',
	 position: 'topRight'
	});
}
function success(text) {
	vNotify.success({text: text,
	 title: 'Información: ',
	 position: 'topRight'
	});
}
