const ordenarPorFecha = (a, b) => new Date(b.fecha) - new Date(a.fecha);

module.exports = { ordenarPorFecha };
