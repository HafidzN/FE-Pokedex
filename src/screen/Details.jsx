import React from 'react'
import { useState } from 'react' 
import axios from 'axios'
import { useParams } from 'react-router-dom'
import useFetch from '../hooks/useFetch.js'
import {Chip, Container} from '@material-ui/core'
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import Fab from '@mui/material/Fab'
import CatchingPokemonIcon from '@mui/icons-material/CatchingPokemon'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';


import './Details.scss'

const Details = () => {
    const [isCatching, setIsCatching] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState('')
    const [snackbarSeverity, setSnackbarSeverity] = useState('error')
    const [snackbarState, setSnackbarState] = useState(false)
    const {name} = useParams()
    const { data: pokemon, hasError, isPending } = useFetch(`https://pokeapi.co/api/v2/pokemon/${name}`)

    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
    })
   
    const catchPokemon = async () => {
        let currentMylist = JSON.parse(localStorage.getItem("mylist"))
        if (Array.isArray(currentMylist) && (currentMylist.findIndex((pokem) => pokem.id === pokemon.id)) > -1){
            setSnackbarSeverity('error')
            setSnackbarMessage('You already have the Pokemon')
            setSnackbarState(true)
        } else {
            try {
                setIsCatching(true)
                const { data: { data } } = await axios.get('http://localhost:5000/catch')
                console.log(data)
                if (data) {
                    if (Array.isArray(currentMylist) && currentMylist.length) {
                        let updatedMylist = [...currentMylist]
                        updatedMylist.push(pokemon)
                        localStorage.setItem("mylist", JSON.stringify(updatedMylist))
                    } else {
                        localStorage.setItem("mylist", JSON.stringify([{...pokemon}]))
                    }
    
                    setSnackbarSeverity('success')
                    setSnackbarMessage('Succesfully catch Pokemon')
                    setSnackbarState(true)
                    
                    // history.push('/mylist')
                } else {
                    setSnackbarSeverity('warning')
                    setSnackbarMessage('Fail to catch Pokemon')
                    setSnackbarState(true)
                }
            } catch (error) {
                setSnackbarSeverity('error')
                setSnackbarMessage(`Something's not right, Try again`)
                setSnackbarState(true)
                console.error(error)
            } finally {
                setIsCatching(false)
            }
        }
    }

    const closeSnackbar = (event, reason) => {
        if (reason === 'clickaway') return
        setSnackbarState(false)
    }
    
    return (
      <div className="c-profile">
          { hasError && <div>Error</div> }
          { isPending && <Dialog open fullScreen>
              <div className="c-profile__spinner h-d-flex h-justify-center h-align-center">
                <CircularProgress />
              </div>
            </Dialog>}
          { pokemon &&  <Container maxWidth="md">
                <div className="c-profile__title">
                    {pokemon.name}
                    <span className="c-profile__number">#0{pokemon.id}</span>
                </div>
                <div className="l-profile-container">
                    <div className="l-profile-container-2">
                        <div className={`c-profile__images h-flex-1 `}>
                            <img src={pokemon.sprites.other.dream_world.front_default} alt={pokemon.name} />
                        </div>
                        <div className="h-flex-1 h-mld1">
                            <div className="c-profile__details h-d-flex h-mb2">
                                <ul className="h-flex-1">
                                    <li>
                                        <span className="c-profile__titled">Height</span>
                                        <span className="c-profile__value">{pokemon.height}"</span>
                                    </li>
                                    <li>
                                        <span className="c-profile__titled">Weight</span>
                                        <span className="c-profile__value">{pokemon.weight} lbs</span>
                                    </li>
                                    <li>
                                        <span className="c-profile__titled">Order</span>
                                        <span className="c-profile__value">{pokemon.order}</span>
                                    </li>
                                    {/* <li>
                                        <span className="c-profile__titled">Gender</span>
                                        <span className="c-profile__value">
                                            <i className="c-profile__icon-male"></i>
                                            <i className="c-profile__icon-female"></i>
                                        </span>
                                    </li> */}
                                </ul>
                                <ul className="h-flex-1">
                                    <li>
                                        <span className="c-profile__titled">Types</span>
                                        <span className="c-profile__value">
                                            {pokemon.types.length && pokemon.types.map(({type: {name}}, index)=> (
                                                    <div key={index} className="h-mr05 h-mb05 h-d-inline-block">
                                                        <Chip label={`${name}`} color="secondary"/>
                                                    </div>
                                                ))}
                                        </span>
                                    </li>         
                                    <li>
                                        <span className="c-profile__titled">Abilities</span>
                                        <div className="c-profile__value">
                                                {pokemon.abilities.length && pokemon.abilities.map(({ability: {name}}, index)=> (
                                                    <div key={index} className="h-mr05 h-mb05 h-d-inline-block">
                                                        <Chip label={`${name}`} color="primary"/>
                                                    </div>
                                                ))}
                                        </div>

                                    </li>
                                </ul>
                            </div>
                            <div className="l-stat-container">
                                <h2 className="c-profile__subtitle">Stats</h2>
                                <Box sx={{ width: '100%', borderRadius: '5px', border: '1px solid powderblue' }}>
                                    { pokemon.stats.length && pokemon.stats.map( (stat, index) => (
                                        <div className="h-d-flex h-align-center" key={index}>
                                            <div className="c-profile__stat-title h-mr1">{stat.stat.name}</div>
                                            <div className="c-profile__stat-bar h-flex-1 h-mr05">
                                                <LinearProgress variant="determinate" value={stat.base_stat} />
                                            </div>
                                            <div className="h-mr1">
                                                <Chip label={`${stat.base_stat}`}/>
                                            </div>
                                        </div>
                                    ))}
                                </Box>
                            </div>
                        </div>
                    </div>

                    <div className="l-moves-container">
                    <h2 className="c-profile__subtitle">Moves</h2>
                        {pokemon.moves.length && pokemon.moves.map((move, index)=> (
                            <div key={index} className="h-mr05 h-mb05 h-d-inline-block">
                                <Chip label={`${move.move.name}`} color="primary"/>
                            </div>
                        ))}
                    </div>
                </div>
            </Container> }
            <Fab variant="extended" color="primary" aria-label="catch" style={{position:'absolute', left: '50%', transform: 'translate(-50%, -75px)'}} onClick={catchPokemon}>
                {isCatching ? <MoreHorizIcon />: <CatchingPokemonIcon sx={{ mr: 1 }} />}  
                {isCatching ? 'Is Catching Pokemon': 'Catch Pokemon'}                 
            </Fab>
            <Snackbar open={snackbarState} autoHideDuration={6000} onClose={closeSnackbar}>
                <Alert onClose={closeSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>

      </div>
    )
}

export default Details
