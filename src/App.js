import React from 'react';
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
import Music from './music';
import {Audio} from './music/audio-context';
import Photos from './photos';
import Menu from './Menu';
import './App.css';


function WebPage() {
  let location = useLocation();

  return (
    <div className="App">
      <Audio>
        <Menu/>
        <TransitionGroup>
          <CSSTransition key={location.key} appear classNames="page" timeout={3000}>
            <Switch location={location}>
              <Route path="/" exact>
                <Home/>
              </Route>
              <Route path="/music">
                <Music/>
              </Route>
              <Route path="/photos">
                <Photos/>
              </Route>
            </Switch>
          </CSSTransition>
        </TransitionGroup>
      </Audio>
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
