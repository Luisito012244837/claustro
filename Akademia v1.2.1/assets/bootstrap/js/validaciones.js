
    document.addEventListener("DOMContentLoaded", function() {
        const form = document.querySelector("form");
        
        form.addEventListener("submit", function(event) {
            event.preventDefault(); // Evita el envío del formulario para realizar validaciones
            
            // Obtener los valores de los campos
            const username = document.getElementById("username").value.trim();
            const yearGraduated = document.getElementById("year_graduated").value.trim();
            const subjects = document.getElementById("subjects").value.trim();
            const groupCount = document.getElementById("group_count").value.trim();
            const career = document.getElementById("career").value.trim();
            const experienceYears = document.getElementById("experience_years").value.trim();
            const graduatedFrom = document.getElementById("graduated_from").value.trim();
            
            // Validaciones
            let valid = true;
            let errorMessage = "";

            if (username === "") {
                valid = false;
                errorMessage += "El nombre es obligatorio.\n";
            }

            if (yearGraduated === "" || isNaN(yearGraduated) || yearGraduated.length !== 4) {
                valid = false;
                errorMessage += "El año graduado debe ser un número de 4 dígitos.\n";
            }

            if (subjects === "") {
                valid = false;
                errorMessage += "Las asignaturas son obligatorias.\n";
            }

            if (groupCount === "" || isNaN(groupCount) || parseInt(groupCount) <= 0) {
                valid = false;
                errorMessage += "La cantidad de grupos debe ser un número positivo.\n";
            }

            if (career === "") {
                valid = false;
                errorMessage += "La carrera es obligatoria.\n";
            }

            if (experienceYears === "" || isNaN(experienceYears) || parseFloat(experienceYears) < 0) {
                valid = false;
                errorMessage += "Los años de experiencia deben ser un número positivo.\n";
            }

            if (graduatedFrom === "") {
                valid = false;
                errorMessage += "El campo 'Graduado de' es obligatorio.\n";
            }

            // Si hay errores, mostrar mensaje y no enviar el formulario
            if (!valid) {
                alert(errorMessage);
            } else {
                // Si todo es válido, puedes enviar el formulario
                form.submit();
            }
        });
    });
