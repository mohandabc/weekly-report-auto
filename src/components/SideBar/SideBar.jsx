/***********************************************************************************************
 *   A NAV BAR COMPONENT FOR NAVIGATION AT THE TOP OF THE PAGE USING RSUITE NAVBAR COMPONENT   *
 *                                          # PROPS #                                          *
 * <NAVBAR (AS) (APPEARANCE='DEFAULT' | 'INVERSE' | 'SUBTLE') (CLASSPREFIX=STRING ('NAVBAR'))> *
 ***********************************************************************************************/

import React, { useEffect } from "react";

import { Navbar, Nav } from "rsuite";
import HomeIcon from "@rsuite/icons/legacy/Home";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useAuth } from "../../services/useAuth";
import { IconButton } from "rsuite";
import { useRecoilState } from "recoil";
import { darkModeState } from "../../shared/globalState";
import lightModeIcon from "../../assets/light-mode-icon.png";
import darkModeIcon from "../../assets/dark-mode-icon.png";
import logOut from "../../assets/logout.png"


// TODO : this sidebar was replaced with a navbar now, consider renaming the component to Navbar

// Exports a rsuite navbar component.
export const SideBar = ({ onSelect, activeKey, ...props }) => {
  const [darkMode, setDarkMode] = useRecoilState(darkModeState);
  const { user } = useAuth();

  useEffect(() => {
        document.body.className = (darkMode===true) ? "dark" : "light";
      }, [darkMode]);

  return (
    <Navbar {...props}>
      <Navbar.Brand>
        <img style={{ width: 120, height: 28.24 }} src={logo} alt="Logo" />
      </Navbar.Brand>
      <Nav onSelect={onSelect} activeKey={activeKey}>
        <Nav.Item
          as={Link}
          to="/"
          eventKey="1"
          icon={<HomeIcon color="#000" />}
        >
          Home
        </Nav.Item>
        <Nav.Menu title="Reporting">
          <Nav.Item as={Link} to="/back-office" eventKey="2">
            Back-Office Reports
          </Nav.Item>
          <Nav.Item as={Link} to="/front-office" eventKey="3">
            Front-Office Reports
          </Nav.Item>
        </Nav.Menu>
        <Nav.Menu title="Deliverables">
          <Nav.Item as={Link} to="/run" eventKey="4">
            Run Deliverable
          </Nav.Item>
          <Nav.Item as={Link} to="/data" eventKey="5">
            Data Uploader
          </Nav.Item>
        </Nav.Menu>
        <Nav.Menu title="About">
          <Nav.Item eventKey="6">Company</Nav.Item>
          <Nav.Item eventKey="7">Team</Nav.Item>
          <Nav.Item eventKey="8">Contact</Nav.Item>
        </Nav.Menu>
      </Nav>
      { // if user is signed in show logout button and darkmode preference button
      user ? (
        <>
          <Nav pullRight>
            <Nav.Item as={Link} to="/logout">
            <img className="h-8" src={logOut} alt="..."/>

            </Nav.Item>
          </Nav>

          <Nav pullRight>
              <IconButton
                onClick={() => setDarkMode(!darkMode)}
                className="my-2"
                appearance="link">
                  
                {darkMode?(
                  <img className="h-6" src={lightModeIcon} alt="..."/>
                ):
                (
                  <img className="h-6" src={darkModeIcon} alt="..."/>
                )
                }
              </IconButton>

          </Nav>
        </>
      ) : (
        <></>
      )}
    </Navbar>
  );
};
