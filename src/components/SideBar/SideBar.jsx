import React from 'react';
import './styles.css';

import { Navbar, Nav } from 'rsuite';
import HomeIcon from '@rsuite/icons/legacy/Home';
import ExitIcon from '@rsuite/icons/Exit';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { useAuth } from '../../services/useAuth';


const custm = {
    width: 240,
    display: 'inline-table',
    marginRight: 100
  };

export const SideBar = ({ onSelect, activeKey, ...props }) => {
    const { user }  = useAuth()
    return (
        <Navbar {...props}>
      <Navbar.Brand>
      <Link to='/'>
          <img style={{ width: 120, height: 28.24 }} src={logo} alt="Logo"/>
      </Link>
      </Navbar.Brand>
      <Nav onSelect={onSelect} activeKey={activeKey}>
        <Nav.Item as={Link} to="/" eventKey="1" icon={<HomeIcon color="#000"/>}>Home</Nav.Item>
        <Nav.Menu title="Reporting">
          <Nav.Item as={Link} to="/back-office" eventKey="2">Back-Office Reports</Nav.Item>
          <Nav.Item as={Link} to="/front-office" eventKey="3">Front-Office Reports</Nav.Item>
        </Nav.Menu>
        <Nav.Menu title="Deliverables">
          <Nav.Item as={Link} to="/drillingBit" eventKey="4">Drilling Bit</Nav.Item>
          <Nav.Item as={Link} to="/drillingState" eventKey="5">Drilling State</Nav.Item>
          <Nav.Item as={Link} to="/trippingSpeed" eventKey="6">Tripping Spead</Nav.Item>
          <Nav.Item as={Link} to="/reamBream" eventKey="7">Ream-Back Ream</Nav.Item>
        </Nav.Menu>
        <Nav.Menu title="About">
          <Nav.Item eventKey="8">Company</Nav.Item>
          <Nav.Item eventKey="9">Team</Nav.Item>
          <Nav.Item eventKey="10">Contact</Nav.Item>
        </Nav.Menu>
      </Nav>
      {user?<Nav pullRight>
        <Nav.Item as={Link} to="/logout" icon={<ExitIcon />}>Logout</Nav.Item>
      </Nav>:<></>}
      
    </Navbar>
    );
}