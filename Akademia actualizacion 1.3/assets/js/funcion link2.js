
    // funcion para el enlace principal de grafana
    
    document.getElementById('enlaceFiltrar').addEventListener('click', function(event) {
    event.preventDefault(); // Evita que el enlace se comporte como un enlace normal
    const enlace = "https://isvanipioto0.grafana.net/dashboard/snapshot/WXaBfX2UsxtFwUMoSQnjXU5FCYUgwbpJ"; // Tu enlace
    const nombreVentana = "miVentanaEspecifica"; // Nombre único para la ventana
    window.open(enlace, nombreVentana); // Abre el enlace en una ventana con nombre
});
  