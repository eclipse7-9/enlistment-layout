import { useState } from 'react'


 //../assets/react.svg
export function TwFollowCard({ formatUserName, userName, name, disabled }) {
  // Se usa el hook useState para manejar el estado del botón de seguir/siguiendo
const [isFollowing, setIsFollowing] = useState(false)


  // Se crea una constante exclusivamente para la imagen    const imageSrc = reactLogo
 
  // Se crean las constantes para el texto y la clase del botón según el estado de isFollowing
  const text = isFollowing ? "Siguiendo" : "Seguir"
  // Se usa un operador ternario para asignar la clase correspondiente
  const buttonClassName = isFollowing 
    ? "tw-followCard-button is-following" 
    : "tw-followCard-button"

  const isDisabled = !!disabled

  // Se crea una función para manejar el clic en el botón y cambiar el estado
  const handleclick = () => {
    if (isDisabled) return;
    setIsFollowing(!isFollowing)
  }

  return (
    <article className='tw-followCard' style={{ display: 'flex', color: '#fff', alignItems: 'center' }}>
      <header className='tw-followCard-header'>
        
        <div className='tw-followCard-info'>
          <strong>{name}</strong>
          <span className="tw-followCard-userName">{formatUserName(userName)}</span>
        </div>
      </header>
      <aside> 
      <button className={buttonClassName} onClick={handleclick} disabled={isDisabled} style={isDisabled ? { opacity: 0.5, pointerEvents: 'none' } : {}}>
        {text}
        </button>
      </aside>
    </article>
  )
}