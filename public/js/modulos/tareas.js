import axios from 'axios';
import Swal from 'sweetalert2';
import { actualizarAvance } from '../funciones/avance';

const tareas = document.querySelector('.listado-pendientes');

if (tareas) {
  tareas.addEventListener('click', e => {
    if (e.target.classList.contains('fa-check-circle')) {
      const icono = e.target;
      const idTarea = icono.parentElement.parentElement.dataset.tarea;
      console.log(`idTarea`, idTarea);

      const url = `${location.origin}/tareas/${idTarea}`;

      axios.patch(url, { idTarea }).then(function (res) {
        if (res.status === 200) {
          icono.classList.toggle('completo');
          actualizarAvance();
        }
      });
    }

    if (e.target.classList.contains('fa-trash')) {
      const tareaHTML = e.target.parentElement.parentElement;
      const idTarea = tareaHTML.dataset.tarea;

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
          const url = `${location.origin}/tareas/${idTarea}`;
          axios
            .delete(url, { params: { idTarea } })
            .then(function (res) {
              if (res.status === 200) {
                tareaHTML.parentElement.removeChild(tareaHTML);
                Swal.fire('Tarea eliminada', res.data, 'success');
                actualizarAvance();
              }
            })
            .catch(() => {
              Swal.fire({
                // type: 'error',
                title: 'Hubo un error',
                text: 'No se pudo eliminar el proyecto'
              });
            });
        }
      });
    }
  });
}
