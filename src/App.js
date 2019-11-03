import React, {useRef} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation
} from "react-router-dom";
import {
  TransitionGroup,
  CSSTransition
} from "react-transition-group";
import Home from './home';
import {Audio, Music} from './music';
import Photos from './photos';
import Menu from './Menu';
import './App.css';
// import 'bootstrap/dist/css/bootstrap.min.css';

function WebPage() {
  let location = useLocation();
  const audioRef = useRef(null);

  return (
    <div className="App">
      <Menu/>
      <Audio audioRef={audioRef}/>
      <TransitionGroup>
        <CSSTransition key={location.key} classNames="page" timeout={3000}>
          <Switch location={location}>
            <Route path="/" exact>
              <Home/>
            </Route>
            <Route path="/music">
              <Music audioRef={audioRef}/>
            </Route>
            <Route path="/photos">
              <Photos/>
            </Route>
          </Switch>
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
}

function AppRouter() {
  return (
    <Router>
      <WebPage/>
    </Router>
  );
}

export default AppRouter;
