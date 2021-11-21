import { useState, useEffect} from 'react' 
import Thumbnails from '../components/Thumbnails.jsx'

function App() {
  const [allPokemons, setAllPokemons] = useState([])
  const [loadMore, setLoadMore] = useState('https://pokeapi.co/api/v2/pokemon?limit=100&offset=200')

  
  const getAllPokemons = async () => {
    const res = await fetch(loadMore)
    const data = await res.json()
    
    const createPokemonObject = (result) => {
      result.forEach(async ({name}) => {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
        const data = await res.json()
        setAllPokemons(currentList => [...currentList, data])
      })
    }

    createPokemonObject(data.results)
    console.log(allPokemons)
  }


  useEffect(() => {
    getAllPokemons()
  }, [])

  return (
    <div className="l-container-app">
      <h1>All Pokemon</h1>
      <div className="l-container-all">
        { allPokemons.map((pokemon, idx) => (
          <Thumbnails 
              id = {pokemon.id} 
              name = {pokemon.name}
              image = {pokemon.sprites.other.dream_world.front_default}
              type = {pokemon.types[0].type.name}          
              key={idx} /> 
        ))}
      </div>
      <button className="load-more" onClick={() => getAllPokemons()} >Load more</button>
    </div>
  )
}

export default App
