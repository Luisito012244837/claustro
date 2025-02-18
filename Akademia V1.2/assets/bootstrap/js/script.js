document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById("myModal");
    const span = document.getElementsByClassName("close")[0];

    document.querySelectorAll('.open-modal').forEach(button => {
        button.addEventListener('click', function() {
            const name = this.getAttribute('data-name');
            const details = this.getAttribute('data-details');
            document.getElementById('modal-title').innerText = name;
            document.getElementById('modal-details').innerText = details;
            modal.style.display = "block";
        });
    });

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
});