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

