document.addEventListener('DOMContentLoaded', () => {
  const listaCitas = document.getElementById('lista-citas');

  const citas = [
    { id: 1, mascota: 'Luna', fecha: '2025-10-25', hora: '10:00' },
    { id: 2, mascota: 'Max', fecha: '2025-10-28', hora: '14:30' },
    { id: 3, mascota: 'Coco', fecha: '2025-11-02', hora: '09:00' }
  ];

  citas.forEach(cita => {
    const card = document.createElement('div');
    card.classList.add('cita-card');
    card.innerHTML = `
      <h3>${cita.mascota}</h3>
      <p><strong>Fecha:</strong> ${cita.fecha}</p>
      <p><strong>Hora:</strong> ${cita.hora}</p>
      <button class="btn" onclick="irACancelar('${cita.mascota}')">Cancelar</button>
      <button class="btn" onclick="irARegistrar('${cita.mascota}')">Registrar</button>
    `;
    listaCitas.appendChild(card);
  });
});

function irACancelar(nombreMascota) {
  window.location.href = `cancelar.html?mascota=${encodeURIComponent(nombreMascota)}`;
}

function irARegistrar(nombreMascota) {
  window.location.href = `registrar.html?mascota=${encodeURIComponent(nombreMascota)}`;
}