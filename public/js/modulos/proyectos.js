import Swal from 'sweetalert2';
import axios from 'axios';

const btnEliminar = document.querySelector('#eliminar-proyecto');

if (btnEliminar) {
  btnEliminar.addEventListener('click', e => {
    const urlProyecto = e.target.dataset.proyectoUrl;

    Swal.fire({
      title: 'Estás seguro?',
      text: 'No podras revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar'
    }).then(result => {
      if (result.isConfirmed) {
        const url = `${location.origin}/proyectos/${urlProyecto}`;
        axios
          .delete(url, { params: { urlProyecto } })
          .then(function (res) {
            console.log(res);

            Swal.fire('Eliminado!', 'El proyecto se ha eliminado.', 'success');
            setTimeout(() => {
              window.location.href = '/';
            }, 3000);
          })
          .catch(() => {
            Swal.fire({
              type: 'error',
              title: 'Hubo un error',
              text: 'No se pudo eliminar el proyecto'
            });
          });
      }
    });
  });
}

export default btnEliminar;
