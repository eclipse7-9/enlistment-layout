
import { useState } from 'react'
import { TwFollowCard } from './TwFollowCard'

export function Card({ usuario }) {
  const { nombre, correo, foto } = usuario;
  const [grande, setGrande] = useState(false)

  const handleClick = (e) => {
    // Solo abrir modal si se hace click fuera del botón seguir
    if (e.target.closest('.tw-followCard-button')) return;
    setGrande(true)
  }
  const handleClose = (e) => {
    // Cerrar si se hace click fuera de la carta grande o en el fondo
    if (e.target.classList.contains('card-modal-bg')) setGrande(false)
  }

  return (
    <>
      <div
        className="card"
        onClick={handleClick}
        style={{ transition: 'transform 0.3s', cursor: 'pointer' }}
      >
        <img
          className="card-img"
          src={foto || 'https://via.placeholder.com/400x200'}
          alt={`Foto de ${nombre}`}
        />
        <div className="card-content">
          <h2 className="card-name">{nombre}</h2>
          <p className="card-email">{correo}</p>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
            <TwFollowCard
              name={nombre}
              userName={correo}
              formatUserName={(u) => u}
              disabled={true}
            />
          </div>
        </div>
      </div>
      {grande && (
        <div className="card-modal-bg" onClick={handleClose}>
          <div className="card card-modal-content">
            <img
              className="card-img"
              src={foto || 'https://via.placeholder.com/400x200'}
              alt={`Foto de ${nombre}`}
            />
            <div className="card-content">
              <h2 className="card-name">{nombre}</h2>
              <p className="card-email">{correo}</p>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                <TwFollowCard
                  name={nombre}
                  userName={correo}
                  formatUserName={(u) => u}
                  disabled={false}
                />
              </div>
              <button className="card-modal-close" onClick={() => setGrande(false)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Card;
