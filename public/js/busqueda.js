document.getElementById('busqueda').addEventListener('input', function () {
    // Obtener el valor de búsqueda ingresado
    const searchTerm = this.value.toLowerCase();

    // Filtrar la tabla de datos según el término de búsqueda
    const rows = document.querySelectorAll('[data-table="table"] tbody tr');
    rows.forEach(function (row) {
        // Seleccionar las celdas relevantes para la búsqueda (por ejemplo, nombre, apellido, etc.)
        const cells = row.querySelectorAll('td'); // Ajusta esto según la estructura de tu tabla

        // Verificar si alguna de las celdas contiene el término de búsqueda
        let found = false;
        cells.forEach(function (cell) {
            const cellText = cell.textContent.toLowerCase();
            if (cellText.includes(searchTerm)) {
                found = true;
            }
        });

        // Mostrar u ocultar la fila según si se encontró una coincidencia
        if (found) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
});
