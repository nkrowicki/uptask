import proyectos from './modulos/proyectos';
import tareas from './modulos/tareas';
import avance from './funciones/avance';
import { actualizarAvance } from './funciones/avance';

document.addEventListener('DOMContentLoaded', () => {
  actualizarAvance();
});
