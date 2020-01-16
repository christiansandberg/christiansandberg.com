import React, {useEffect} from 'react';
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
import ReactGA from 'react-ga';
import Home from './home';
import Music from './music';
import {Audio} from './music/audio-context';
import Photos from './photos';
import Menu from './Menu';
import './App.scss';


ReactGA.initialize('UA-335161-6', {
  debug: process.env.NODE_ENV === "development",
  gaOptions: {siteSpeedSampleRate: 100}
});

function WebPage() {
  let location = useLocation();

  useEffect(() => {
    window.addEventListener("load", () => {
      document.querySelector(".loading").style.display = "none";
    });
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    if (process.env.NODE_ENV === "production") {
      ReactGA.pageview(location.pathname);
    }
  }, [location.pathname]);

  return (
    <div className="App">
      <Audio>
        <Menu/>
        <TransitionGroup>
          <CSSTransition key={location.key} appear classNames="page" timeout={5000}>
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
