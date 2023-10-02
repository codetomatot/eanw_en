import React, { useEffect, useState, useRef } from 'react'
import './App.css';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import Library from './img_data/libstock.jpg';
import { AiOutlineArrowLeft, AiOutlineSetting } from "react-icons/ai";
import {BiCog} from "react-icons/bi";
import { FaChevronRight } from "react-icons/fa";

function App() {
  return (
    <div className="App">
      <div className='d_k'></div>
      <Navbar>
        <NavItem icon={<AiOutlineSetting />}>
          <DropDown />
        </NavItem>
      </Navbar>
      <div className='scrollable-bgimg'></div>
      <div id="detail">
        <Outlet />
      </div>
    </div>
  );
}

function Navbar(props) {
  return (
    <nav className='navbar'>
      <ul className='navbar-nav'>{props.children}</ul>
    </nav>
  );
}
function NavItem(props) {
  const [open, setOpen] = useState(false);
  return (
    <li className='nav-item'>
      <a href={props.linkTo} title={props.title} className='icon-button' onClick={() => setOpen(!open)}>{props.icon}</a>
      {open && props.children}
    </li>
  );
}
function DropDown(props) {
  const [activeMenu, setActiveMenu] = useState('main');
  const [menuHeight, setMenuHeight] = useState(null);
  function calcHeight(element) {
    const height = element.offsetHeight; //offset changes due to box-sizing css property
    setMenuHeight(height);
  }
  function DropDownItem(props) {
    return (
      <div>
        {!props.speclassName ? 
          <a href="#" className='menu-item' style={{color: "#fff", textDecoration: "none"}} onClick={() => props.goToMenu && setActiveMenu(props.goToMenu)}>
            <span className='icon-button'>{props.leftIcon}</span>
            {props.children}
            <span className='icon-right'>{props.rightIcon}</span>
          </a> : 
        <a href="#" className='red-important' style={{color: "#fff", textDecoration: "none"}}>
          <span className='icon-button'>{props.leftIcon}</span>
          {props.children}
          <span className='icon-right'>{props.rightIcon}</span>
        </a>
        }
      </div>
    )
  }
  return (
    <div className='dropdown' style={{height: menuHeight, zIndex: "3"}}>
      <CSSTransition in={activeMenu === "main"}
      unmountOnExit 
      timeout={500}
      classNames="menu-primary"
      onEnter={calcHeight}>
        <div className='menu'>
          <DropDownItem leftIcon={<BiCog />} rightIcon={<FaChevronRight />} goToMenu="settings">Set Language</DropDownItem>
        </div>
      </CSSTransition>

      <CSSTransition in={activeMenu === "settings"}
      unmountOnExit 
      timeout={500}
      classNames="menu-secondary"
      onEnter={calcHeight}>
        <div className='menu'>
          <DropDownItem leftIcon={<AiOutlineArrowLeft />} goToMenu="main">Back</DropDownItem>
          <DropDownItem><Link to={""+(window.location.pathname).toString()} style={{color: '#fff', textDecoration: 'none', fontSize: '16px'}}>Русский</Link></DropDownItem>
          <DropDownItem><Link to={"/en"+(window.location.pathname).toString()} style={{color: '#fff', textDecoration: 'none', fontSize: '16px'}}>English</Link></DropDownItem>
          <DropDownItem><Link to={"/de"+(window.location.pathname).toString()} style={{color: '#fff', textDecoration: 'none', fontSize: '16px'}}>Deutsch</Link></DropDownItem>
        </div>
      </CSSTransition>
    </div>
  )
}

export default App;