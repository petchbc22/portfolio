import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Router, Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Col,
} from "reactstrap";
import Login from "./components/Login";
// import Register from "./components/Register";
import ListPage from "./components/ListPage";
import AddMovie from "./components/AddMovie";
import EditMovie from "./components/EditMovie";
import { logout } from "./actions/auth";
import { clearMessage } from "./actions/message";
import { history } from "./helpers/history";
import AuthVerify from "./common/AuthVerify";
import EventBus from "./common/EventBus";
import { Power, LogIn, Settings, User } from "react-feather";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "./components/Spinner";
import { setLoading, clearLoading } from "./actions/loading";
import { setErrorNetwork } from "./actions/noti";
import Profile from "./components/Profile";
import logo from "./assets/tk-logo.png";
toast.configure();

const App = () => {
  //----------------------------------- STATE AND CONST -------------------------------------------------

  const prevScrollY = useRef(0);
  const [goingUp, setGoingUp] = useState(false);
  const [contentLogo, setContentLogo] = useState("img-banner");
  const [logoImg, setLogoImg] = useState("img-logo-main-w");
  const [classRmTop, setClassRmTop] = useState("");
  const [classRmPdTop,setClassRmPdTop] = useState("");
  const [scrollText,setScrollText] = useState("")
  // global state

  const { loading } = useSelector((state) => state.loading);
  const { user: currentUser } = useSelector((state) => state.auth);
  const { message } = useSelector((state) => state.message);
  const { noti } = useSelector((state) => state.noti);
  const dispatch = useDispatch();
  // state
  const [showAdminBoard, setShowAdminBoard] = useState(false);
  //----------------------------------- FNC ALL -------------------------------------------------
  const logOut = useCallback(() => {
    dispatch(setLoading());
    dispatch(logout());
    dispatch(clearLoading());
  }, [dispatch]);
  //----------------------------------- USEEFFECT -------------------------------------------------
  //clear message
  useEffect(() => {
    history.listen(() => {
      dispatch(clearMessage()); // clear message when changing location
    });
    if (message === 404) {
      dispatch(setErrorNetwork());
    }
  }, [dispatch, message]);

  // if currentUser is true (login)
  useEffect(() => {
    if (currentUser) {
      if (
        currentUser.roles.includes("ROLE_ADMIN") ||
        currentUser.roles.includes("ROLE_TEAMLEADER")
      ) {
        setShowAdminBoard(true);
      }
    } else {
      setShowAdminBoard(false);
    }

    EventBus.on("logout", () => {
      logOut();
    });

    return () => {
      EventBus.remove("logout");
    };
  }, [currentUser, logOut]);

  // if global state noti is true render toast noti.
  useEffect(() => {
    if (noti === true) {
      toast.error(`Network Error.`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  }, [noti]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (prevScrollY.current < currentScrollY) {
        setGoingUp(false);
        setContentLogo("img-banner-resize");
        setLogoImg("img-logo-main-w-resize");
        setClassRmTop("remove-top");
        setClassRmPdTop("remove-pd-top");
        setScrollText("text-scroll")
      }
      if (prevScrollY.current > currentScrollY && !goingUp) {
        setGoingUp(true);
        setContentLogo("img-banner");
        setLogoImg("img-logo-main-w");
        setClassRmTop("");
        setClassRmPdTop("");
        setScrollText("")

      }

      prevScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [goingUp]);

  return (
    <Router history={history}>
      {/* for global state === setloading */}
      {loading === true ? <Spinner /> : null}
      <div>
        {/* <div className="header-section1">
          <div className="container">
            <ul className="navbar-nav mr-auto">
              <div className="nav-box-left">
                <li className="nav-item">Home</li>
                <li className="nav-item">About us</li>
                <li className="nav-item">To Be Dealer</li>
                <li className="nav-item">Career</li>
              </div>
              <div className="nav-box-right">
                <li className="nav-item">sss</li>
                <li className="nav-item">sss</li>
                <li className="nav-item">sss</li>
                <li className="nav-item">sss</li>
              </div>
            </ul>
          </div>
        </div> */}

        <div className={`header-section2 ${classRmTop}`}>
          <div className="container">
            <ul className={`navbar-nav mr-auto ${classRmPdTop}`}>
              <div className="nav-box-left">
                <li className="nav-item">
                  <a href="#" className={`${scrollText}`}>HOME</a>
                </li>
                <li className="nav-item">
                  <a href="#" className={`${scrollText}`}>ABOUT ME</a>
                </li>
                <li className="nav-item">
                  <a href="#" className={`${scrollText}`}>EXPRIENCE</a>
                </li>
              </div>
              <div className={contentLogo}>
                <img src={logo} className={logoImg} />
                {/* if state 
                  goingUp = false , currentScrollY = 100 
                  img width=60
                  .img-banner bottom 0 
                */}
              </div>
              <div className="nav-box-right">
                <li className="nav-item">
                  <a href="#" className={`${scrollText}`}>EDUCATION</a>
                </li>
                <li className="nav-item">
                  <a href="#" className={`${scrollText}`}>WORK SHOP</a>
                </li>
                <li className="nav-item">
                  <a href="#" className={`${scrollText}`}>CONTACT</a>
                </li>
              </div>
            </ul>
          </div>
        </div>

        <div className="">
          <Switch>
            <Route exact path={["/", "/listpage"]} component={ListPage} />
            <Route exact path="/login" component={Login} />
            {/* <Route exact path="/register" component={Register} /> */}
            <Route exact path="/listpage" component={ListPage} />
            <Route exact path="/editmovie/:movieId" component={EditMovie} />
            <Route exact path="/addmovie" component={AddMovie} />
            <Route exact path="/profile" component={Profile} />
          </Switch>
        </div>
        <AuthVerify logOut={logOut} />
      </div>
    </Router>
  );
};

export default App;
