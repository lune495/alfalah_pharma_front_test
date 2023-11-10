
import React from "react";
import { NavLink } from "react-router-dom";
import { Nav } from "reactstrap";
import { getApiUrl } from "../../methodes";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";

import logo from "logo.svg";
import log2 from "../../assets/img/logo.png"

var ps;

function Sidebar(props) {
  const sidebar = React.useRef();
  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
  };
  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(sidebar.current, {
        suppressScrollX: true,
        suppressScrollY: false
      });
    }
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
      }
    };
  });
  return (
    <div
    // style={{backgroundColor:"!#2d7d23"}}
      className="sidebar"
      data-color={props.bgColor}
      data-active-color={props.activeColor}
    >
      <div className="logo">
        <a
          href= {require("assets/img/logo.png")}
          className="simple-text logo-mini"
        >
          <div className="logo-img">
            <img src={require("assets/img/logo.png")} alt="react-logo" />
          </div>
        </a>
        <a
          href= {require("assets/img/logo.png")}
          className="simple-text logo-normal"
        >
          ALFALAH
        </a>
      </div>
      <div className="sidebar-wrapper" ref={sidebar}>
        <Nav>
          {props.routes.map((prop, key) => {
            return (
              <li
                className={
                  activeRoute(prop.path) + (prop.pro ? " active-pro" : "")
                }
                key={key}
              >
                <NavLink
                  to={prop.layout + prop.path}
                  className="nav-link"
                  activeClassName="active"
                  style={{marginTop:0}}
                >
                  <i style={{fontSize:18}} className={prop.icon} />
                  <p style={{fontSize:12}}>{prop.name}</p>
                </NavLink>
                
              </li>
            );
          })}
        </Nav>
      </div>
    </div>
  );
}

export default Sidebar;
