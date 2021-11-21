import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Details from './screen/Details.jsx'
import Home from './screen/Home.jsx'
import MyList from './screen/MyList.jsx'
import Navbar from './components/Navbar.jsx'

function App() {
  return (
    <Router>
        <Navbar />
        <Switch>
            <Route exact path='/'>
                <Home />
            </Route>
            <Route path='/details/:name'>
                <Details />
            </Route>
            <Route path='/mylist'>
                <MyList />
            </Route>
        </Switch>
    </Router>
  )
}

export default App
