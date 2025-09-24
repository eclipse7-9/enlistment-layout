// Se importa el componente "TwFollowCard" desde la carpeta "components"

import { TwFollowCard } from "./TwFollowCard";
export function App () {

// Se crea una función para agregar el "@" al nombre de usuario 
  const formatUserName = (userName) => `@${userName}`
// Se crea un objeto con todos los props para usar el operador spread
  const allprops = { isFollowing: true, userName: 'queteimporta' }  

  
  return (
// Se llaman los elementos del componente "TwFollowCard" y se les pasan los valores de los props 
// Se usa <> (fragment) para envolver múltiples elementos sin que haya un error
<section className="App">

   <TwFollowCard 
  formatUserName={formatUserName}
  name="Que te importa"
  {...allprops}
/>
   <TwFollowCard 
   formatUserName={formatUserName} 
   userName={"eclipse79"} 
   name={"que te importa"} />

   <TwFollowCard
    formatUserName={formatUserName}
    userName={"eclipse79"} 
   name={"que te importa"} />

   <TwFollowCard 
    formatUserName={formatUserName} 
 
   userName={"eclipse79"}
    name={"que te importa"} />

   </section>
  )
}
