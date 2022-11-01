import React from 'react';
import './styles.css';

import { Navbar, Nav } from 'rsuite';
import HomeIcon from '@rsuite/icons/legacy/Home';
import CogIcon from '@rsuite/icons/legacy/Cog';
import { Link } from 'react-router-dom';
import {SMARTEST_LOGO} from '../../constants/logos'
import logo from '../../assets/logo.png';


const custm = {
    width: 240,
    display: 'inline-table',
    marginRight: 100
  };

export const SideBar = ({ onSelect, activeKey, ...props }) => {
    return (
        <Navbar {...props}>
      <Navbar.Brand>
      <Link to='/'>
          <img style={{ width: 120, height: 28.24 }} src={logo} alt="Logo"/>
      </Link>
      </Navbar.Brand>
      <Nav onSelect={onSelect} activeKey={activeKey}>
        <Nav.Item eventKey="1" icon={<HomeIcon color="#000"/>}>
        <Link to='/' style={{textDecoration: 'none', color: '#000'}}>Home</Link>
        </Nav.Item>
        <Nav.Menu title="Reporting">
          <Nav.Item eventKey="4">
          <Link to='/back-office' style={{textDecoration: 'none', color: '#000'}}>Back-Office Reports</Link></Nav.Item>
          <Nav.Item eventKey="5">
          <Link to='/front-office' style={{textDecoration: 'none', color: '#000'}}>Front-Office Reports</Link></Nav.Item>
        </Nav.Menu>
        <Nav.Menu title="Deliverables">
          <Nav.Item eventKey="4">Drilling Bit</Nav.Item>
          <Nav.Item eventKey="5">Drilling State</Nav.Item>
          <Nav.Item eventKey="6">Tripping Spead</Nav.Item>
          <Nav.Item eventKey="6">Ream-Back Ream</Nav.Item>
        </Nav.Menu>
        <Nav.Menu title="About">
          <Nav.Item eventKey="4">Company</Nav.Item>
          <Nav.Item eventKey="5">Team</Nav.Item>
          <Nav.Item eventKey="6">Contact</Nav.Item>
        </Nav.Menu>
      </Nav>
      <Nav pullRight>
        <Nav.Item icon={<CogIcon />}>Settings</Nav.Item>
      </Nav>
    </Navbar>
    );
}