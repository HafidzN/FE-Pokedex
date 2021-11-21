import * as React from 'react'
import { useHistory } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import CatchingPokemonIcon from '@mui/icons-material/CatchingPokemon'

export default function ButtonAppBar() {
    const history = useHistory()
    const gotoHome = () => history.push('/')
    const gotoMyList = () => history.push('/mylist')

    return (
        <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
            <Toolbar>
            <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={gotoHome}
            >
                <CatchingPokemonIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} onClick={gotoHome}>
                Pokedex
            </Typography>
                <Button color="inherit" onClick={gotoMyList}>My List</Button>
            </Toolbar>
        </AppBar>
        </Box>
  )
}
