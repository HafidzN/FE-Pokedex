import React, { useState, useEffect} from 'react' 
import ThumbnailsList from '../components/ThumbnailsList.jsx'

function MyList() {
  const [allPokemons, setAllPokemons] = useState([])  

  const getCatchedPokemons = () => {
    let mylist = JSON.parse(localStorage.getItem('mylist'))
    if (Array.isArray(mylist) && mylist.length) setAllPokemons([...JSON.parse(localStorage.getItem('mylist'))])
    else setAllPokemons([])
  }

  useEffect(() => {
    getCatchedPokemons()
  }, [])

  return (
    <div className="l-container-app">
      <h1>My List</h1>
      <div className="l-container-all">
        { allPokemons.map((pokemon, idx) => (
          <ThumbnailsList 
              {...pokemon}       
              key={idx} /> 
        ))}
      </div>
    </div>
  )
}

export default MyList
