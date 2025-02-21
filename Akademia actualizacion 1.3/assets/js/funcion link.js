 document.getElementById('btnFiltrar').addEventListener('click', function() {
    const enlace = "https://isvanipioto0.grafana.net/dashboard/snapshot/WXaBfX2UsxtFwUMoSQnjXU5FCYUgwbpJ"; // Tu enlace
    const nombreVentana = "GrafanaNow"; // Nombre único para la ventana
    window.open(enlace, nombreVentana); // Abre el enlace en una ventana con nombre
    });

    
    // Funcionalidad para el modal de detalles
    const modalDetalles = document.getElementById('modalDetalles');
    const spanCerrar = document.getElementsByClassName('close')[0];
    const btnVer = document.querySelectorAll('.btnVer');

    btnVer.forEach(btn => {
        btn.addEventListener('click', () => {
            const fila = btn.closest('tr');
            const nombre = fila.querySelector('td:nth-child(1)').textContent;
            const asignatura = fila.querySelector('td:nth-child(2)').textContent;
            const grupos = fila.querySelector('td:nth-child(3)').textContent;
            const carrera = fila.querySelector('td:nth-child(4)').textContent;

            document.getElementById('detallesNombre').querySelector('span').textContent = nombre;
            document.getElementById('detallesAsignatura').querySelector('span').textContent = asignatura;
            document.getElementById('detallesGrupos').querySelector('span').textContent = grupos;
            document.getElementById('detallesCarrera').querySelector('span').textContent = carrera;

            modalDetalles.style.display = 'block';
        });
    });

    spanCerrar.onclick = () => {
        modalDetalles.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target === modalDetalles) {
            modalDetalles.style.display = 'none';
        }
    };

    document.getElementsByClassName('close')[1].onclick = () => {
        modalFormulario.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target === modalFormulario) {
            modalFormulario.style.display = 'none';
        }
    };


   