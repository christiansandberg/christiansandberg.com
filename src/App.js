import React, {useEffect, useState, useRef} from 'react';
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
import imagesLoaded from 'imagesloaded';
import Home from './home';
import Music from './music';
import {Audio} from './music/audio-context';
import Photos from './photos';
import Menu from './Menu';
import './App.scss';


ReactGA.initialize('UA-335161-6', {
  debug: process.env.NODE_ENV === "development",
  testMode: process.env.NODE_ENV === "development",
  gaOptions: {siteSpeedSampleRate: 100}
});

function WebPage() {
  let location = useLocation();
  const [loaded, setLoaded] = useState(false);
  const appRef = useRef();

  useEffect(() => {
    imagesLoaded(appRef.current, { background: ".background" }, () => {
      document.body.classList.add("loaded");
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    ReactGA.pageview(location.pathname);
  }, [location.pathname]);

  return (
    <CSSTransition in={loaded} classNames="app" timeout={4000}>
      <div className="app" ref={appRef}>
        <Audio>
          <Menu/>
          <TransitionGroup>
            <CSSTransition key={location.key} classNames="page" timeout={2500}>
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
    </CSSTransition>
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
