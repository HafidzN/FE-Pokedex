import React, { useState }  from 'react'
import axios from 'axios'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Stack from '@mui/material/Stack'
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline'
import HourglassFullIcon from '@mui/icons-material/HourglassFull'
import NewReleasesIcon from '@mui/icons-material/NewReleases'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'

const PokemonThumb = (pokemon) => {
    const [actionState, setActionState] = useState(false)
    const [isLoadingRelease, setIsLoadingRelease] = useState(false)
    const [isLoadingRename, setIsLoadingRename] = useState(false)

    const [snackbarMessage, setSnackbarMessage] = useState('')
    const [snackbarSeverity, setSnackbarSeverity] = useState('error')
    const [snackbarState, setSnackbarState] = useState(false)

    const Alert = React.forwardRef(function Alert(props, ref) {
       return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
    })

    const closeDialog = () => setActionState(false)
    const closeSnackbar = (event, reason) => {
       if (reason === 'clickaway') return
       setSnackbarState(false)
    }
    const openDialog = () => setActionState(true)

    const refreshPage = ()=> window.location.reload()

    const releasePokemon = async () => {
        let currentMylist = [...JSON.parse(localStorage.getItem('mylist'))]
        try {
          setIsLoadingRelease(true)
          const { data: { data } } = await axios.get('http://localhost:5000/release')
          console.log(data)
          if (data) {
              let deletedItem = (currentMylist.find((pokem) => pokem.id === pokemon.id)),
              updatedMylist = currentMylist.filter(pokemons => pokemons.id !== deletedItem.id)
              console.log(deletedItem.id, updatedMylist)
              localStorage.setItem("mylist", JSON.stringify(updatedMylist))

              setSnackbarSeverity('success')
              setSnackbarMessage('Succesfully release Pokemon')
              setSnackbarState(true)    
              
              setTimeout(() => refreshPage(), 1500)              
          } else {
              setSnackbarSeverity('warning')
              setSnackbarMessage('Fail to release Pokemon')
              setSnackbarState(true)
          }
        } catch (error) {
            setSnackbarSeverity('error')
            setSnackbarMessage(`Something's not right, Try again`)
            setSnackbarState(true)
            console.error(error)
        } finally {
          setIsLoadingRelease(false)
        }
    }

    const renamePokemon = async (pokemon) => {
        if (pokemon.prevNum >= 1  && pokemon.curNum >= 1){
            try {
                setIsLoadingRename(true)
                let params = JSON.stringify({
                    "prevNum": pokemon.prevNum,
                    "curNum": pokemon.curNum,
                    })
                const { data: { data } } = await axios.post('http://localhost:5000/rename', params,{
                    "headers": {
                        "content-type": "application/json",
                    },
                })
                console.log(data)
                renamePokemon2(pokemon.id, `${pokemon.originalName}-${data}`, pokemon.curNum, data)

                setSnackbarSeverity('success')
                setSnackbarMessage('Succesfully rename Pokemon')
                setSnackbarState(true)  
                
            } catch (error) {
                setSnackbarSeverity('error')
                setSnackbarMessage(`Something's not right, Try again`)
                setSnackbarState(true)
                console.error(error)
            } finally {
                setIsLoadingRename(false)
            }
        }
        if (!pokemon.prevNum && !pokemon.curNum){
            renamePokemon2(pokemon.id, `${pokemon.name}-0`, null, 0, pokemon.name)

            setSnackbarSeverity('success')
            setSnackbarMessage('Succesfully rename Pokemon')
            setSnackbarState(true)  
        }
        if (!pokemon.prevNum && pokemon.curNum === 0){
            try {
                setIsLoadingRename(true)
                let params = JSON.stringify({
                    "prevNum": 0,
                    "curNum": 1,
                    })
                const { data: { data } } = await axios.post('http://localhost:5000/rename', params,{
                    "headers": {
                        "content-type": "application/json",
                    },
                })
                console.log(data)
                renamePokemon2(pokemon.id, `${pokemon.originalName}-1`, 0, 1, pokemon.originalName)

                setSnackbarSeverity('success')
                setSnackbarMessage('Succesfully rename Pokemon')
                setSnackbarState(true)  
                
            } catch (error) {
                setSnackbarSeverity('error')
                setSnackbarMessage(`Something's not right, Try again`)
                setSnackbarState(true)
                console.error(error)
            } finally {
                setIsLoadingRename(false)
            }
        }
        if (pokemon.prevNum === 0 && pokemon.curNum === 1){
            try {
                setIsLoadingRename(true)
                let params = JSON.stringify({
                    "prevNum": 0,
                    "curNum": 1,
                    })
                const { data: { data } } = await axios.post('http://localhost:5000/rename', params,{
                    "headers": {
                        "content-type": "application/json",
                    },
                })
                console.log(data)
                renamePokemon2(pokemon.id, pokemon.name, 1, 1)

                setSnackbarSeverity('success')
                setSnackbarMessage('Succesfully rename Pokemon')
                setSnackbarState(true)  
                
            } catch (error) {
                setSnackbarSeverity('error')
                setSnackbarMessage(`Something's not right, Try again`)
                setSnackbarState(true)
                console.error(error)
            } finally {
                setIsLoadingRename(false)
            }
        }

        setTimeout(() => refreshPage(), 1500)       
    }

    const renamePokemon2 = (id, newName, prevNum, curNum, originalName) => {
        let currentMylist = [...JSON.parse(localStorage.getItem('mylist'))]
        if (originalName){
            let updatedMylist = currentMylist.map(item => {
                return (item.id === id) ? {...item, originalName, name: newName, prevNum, curNum}: item
            })
            localStorage.setItem("mylist", JSON.stringify(updatedMylist))
        } else {
            let updatedMylist = currentMylist.map(item => {
                return (item.id === id) ? {...item, name: newName, prevNum, curNum}: item
            })
            localStorage.setItem("mylist", JSON.stringify(updatedMylist))
        }
    }

    return (
        <div className={`l-container-thumb ${pokemon.types[0].type.name}`}>
            <div className="number"><small>#0{pokemon.id}</small></div>
            <img src={pokemon.sprites.other.dream_world.front_default} alt={pokemon.name} onClick={openDialog}/>
            <div className="l-container-detail">
                <h3>{pokemon.name}</h3>
                <small>Type: {pokemon.types[0].type.name}</small>
            </div>

            <Dialog onClose={closeDialog} open={actionState}>
                <div className={`l-container-thumb ${pokemon.types[0].type.name}`}>
                    <div className="number"><small>#0{pokemon.id}</small></div>
                    <img src={pokemon.sprites.other.dream_world.front_default} alt={pokemon.name} />
                    <div className="l-container-detail h-mb2">
                        <h3>{pokemon.name}</h3>
                        <small>Type: {pokemon.types[0].type.name}</small>
                    </div>
                    <div className="h-pd1">
                        <Stack direction="row" spacing={2}>
                            { isLoadingRelease? 
                                <Button variant="contained" color="error" startIcon={<HourglassFullIcon />} onClick={releasePokemon}>
                                    Release
                                </Button>
                            : <Button variant="contained" color="error" startIcon={<NewReleasesIcon />} onClick={releasePokemon}>
                                    Release
                                </Button>
                            }
                            { isLoadingRename? 
                                <Button variant="contained" color="primary" endIcon={<HourglassFullIcon />}>
                                    Rename
                                </Button> 
                            : <Button variant="contained" color="primary" endIcon={<DriveFileRenameOutlineIcon />} onClick={() => renamePokemon(pokemon)}>
                                    Rename
                                </Button>
                            }
                        </Stack>
                    </div>
                </div>
            </Dialog>

            <Snackbar open={snackbarState} autoHideDuration={6000} onClose={closeSnackbar}>
                <Alert onClose={closeSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>

        </div>
    )
}

export default PokemonThumb