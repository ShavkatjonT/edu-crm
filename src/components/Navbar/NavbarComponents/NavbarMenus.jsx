import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import './NavbarMenus.css';
const NavbarMenus = styled.div`
`;

function NavbarComponent({ itemName, openData, icon, active }) {
  const styleNavbarMenus = {
    backgroundColor: active ? '#ECEFFF' : '#FFFFFF',
    justifyContent: openData ? 'center' : 'space-between',
    paddingLeft: openData ? '0%' : '10%',
    paddingRight: openData ? '0%' : '9%',
    color: active ? '#061DB2' : '#9C9C9C',
    borderRadius: openData ? '0px' : '8px'
  };

  return (
    <NavbarMenus
      id='navbarMenusId'
      active={active}
      state={openData}
      style={styleNavbarMenus}
    >
      <div className='navbar_menus_item'>
        <i
          className='navbarIcons'
          style={{ marginRight: openData ? '0rem' : '1rem' }}
        >
          {icon}
        </i>
        <div 
          className='navbarMenusItem'
        >
        <p
          style={{ display: openData ? 'none' : 'flex' }}
        >
          {itemName}
        </p>
        </div>
      </div>
      <i
        className={'navbar_menus_chevron_right_icon fa-solid fa-circle'}
        style={{ display: openData ? 'none' : active ? 'inline' : 'none'}}
      ></i>
    </NavbarMenus>
  );
}

NavbarComponent.propTypes = {
  itemName: PropTypes.string.isRequired,
  openData: PropTypes.bool.isRequired,
  icon: PropTypes.object.isRequired,
  active: PropTypes.bool.isRequired,
  rightIcon: PropTypes.string.isRequired,
};

export default NavbarComponent;
