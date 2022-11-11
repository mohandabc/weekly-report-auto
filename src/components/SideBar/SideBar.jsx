/***********************************************************************************************
 *   A NAV BAR COMPONENT FOR NAVIGATION AT THE TOP OF THE PAGE USING RSUITE NAVBAR COMPONENT   *
 *                                          # PROPS #                                          *
 * <NAVBAR (AS) (APPEARANCE='DEFAULT' | 'INVERSE' | 'SUBTLE') (CLASSPREFIX=STRING ('NAVBAR'))> *
 ***********************************************************************************************/

import React, { useEffect } from "react";

import { Navbar, Nav } from "rsuite";
import HomeIcon from "@rsuite/icons/legacy/Home";
import ExitIcon from "@rsuite/icons/Exit";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useAuth } from "../../services/useAuth";
import { IconButton } from "rsuite";
import CreativeIcon from "@rsuite/icons/Creative";
import { useRecoilState } from "recoil";
import { darkModeState } from "../../shared/globalState";

const custm = {
  width: 240,
  display: "inline-table",
  marginRight: 100,
};

// TODO : this sidebar was replaced with a navbar now, consider renaming the component to Navbar
export const SideBar = ({ onSelect, activeKey, ...props }) => {
  const [darkMode, setDarkMode] = useRecoilState(darkModeState);

  const { user } = useAuth();

  return (
    <Navbar {...props}>
      <Navbar.Brand href="/">
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
      {user ? (
        <>
          <Nav pullRight>
            <Nav.Item as={Link} to="/logout" icon={<ExitIcon />}>
              Logout
            </Nav.Item>
          </Nav>
          <Nav pullRight>
            {darkMode ? (
              <IconButton
                onClick={() =>
                  darkMode ? setDarkMode(false) : setDarkMode(true)
                }
                className="my-2"
                icon={<CreativeIcon color="yellow" />}
                appearance="link"
                circle
              />
            ) : (
              <IconButton
                onClick={() =>
                  darkMode ? setDarkMode(false) : setDarkMode(true)
                }
                className="my-2"
                icon={<CreativeIcon color="grey" />}
                appearance="link"
                circle
              />
            )}
          </Nav>
        </>
      ) : (
        <></>
      )}
    </Navbar>
  );
};
