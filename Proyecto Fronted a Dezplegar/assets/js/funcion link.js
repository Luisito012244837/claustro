// Abrir enlace en una ventana con nombre (Grafana)
document.getElementById('btnFiltrar').addEventListener('click', function () {
    const enlace = "https://isvanipioto0.grafana.net/login"; // Tu enlace
    const nombreVentana = "GrafanaNow"; // Nombre único para la ventana

    // Intenta abrir o reutilizar la ventana
    const ventanaGrafana = window.open(enlace, nombreVentana);

    // Si la ventana ya estaba abierta, enfócala
    if (ventanaGrafana && !ventanaGrafana.closed) {
        ventanaGrafana.focus(); // Enfoca la ventana existente
    }
});




        
// Función para obtener el total de trabajadores
async function obtenerTotalTrabajadores() {
    try {
        const response = await fetch('http://10.10.1.1:8000/apiv2/getParameters/'); // Cambia la URL según tu API
        if (!response.ok) {
            throw new Error('Error al obtener el total de trabajadores');
        }
        const data = await response.json();
        const totalTrabajadores = data.total_trabajadores; // Asegúrate de que 'total' sea la propiedad correcta en la respuesta

        // Actualizar el valor en el DOM
        document.querySelector('.h5.mb-0.font-weight-bold.text-gray-800').textContent = totalTrabajadores;
    } catch (error) {
        console.error('Error en la solicitud:', error);
        // Aquí puedes manejar el error, por ejemplo, mostrando un mensaje en el DOM
        document.querySelector('.h5.mb-0.font-weight-bold.text-gray-800').textContent = 'Error al cargar';
    }
}

// Llamar a la función al cargar la página
document.addEventListener('DOMContentLoaded', obtenerTotalTrabajadores);
