import IconButton from '@mui/material/IconButton';
import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../../index';
import styled from 'styled-components';
import NavbarMenus from './NavbarComponents/NavbarMenus';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';
import logo from '/images/loginLogo.png';
const NavbarContent = styled.div`
  width: ${(props) => (props.show ? '4%' : '17%')};
  height: 100vh;
  position: fixed;
  transition: all 0.2s ease-in;
  background-color: #FFFFFF;
  border-right: 1px solid #DBDBDB;
  z-index: 500;
  @media screen and (min-width: 1900px) {
    & {
      width: ${(props) => (props.show ? '4%' : '14%')};
    }
  }
  .navbarElementsDiv {
    height: 90vh;
    padding-left: ${(props) => (props.show ? '0px': '10px')};
    padding-right: ${(props) => (props.show ? '0px': '10px')};
    @media screen and (min-width: 1920px){
      height: 92vh;
    }
    overflow-y: overlay;
    position: relative;
    width: 100%;
    ::-webkit-scrollbar {
      width: 7px;
    }

    ::-webkit-scrollbar-track {
      backdrop-filter: 10px;
      background-color: rgba(0, 0, 0, 0.05);
    }

    ::-webkit-scrollbar-thumb {
      background-color: #6b79d4;
      border-radius: 3px;
    }

    /* style the component container */
    .accordion_container {
      width: 100%;
      min-height: 45px;
      overflow: hidden;
      border-radius: ${(props) => (props.show ? '0px' : '8px')};
      margin-bottom: 10px;
    }

    /* style the title button of the accordion menu */
    .accordion_title {
      width: 100%;
      border: none;
      outline: none;
      cursor: pointer;
      width: 100%;
      border-radius: ${(props) => (props.show ? '0px' : '8px')};
    }

    .accordion_content{
      .links-part{
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
    }
    .accordion_content, .hidden_content {
      height: 0px;
      transition: height 0.5s ease-in;
      opacity: 0;
      visibility: hidden;
    }

    .show_content {
      height: 180px;
      opacity: 1;
      visibility: visible;
      transition: height 1s ease;
      &.info-part{
          height: 210px;
        }
        @media screen and (min-width: 1919px) {
        &.info-part{
          height: 251px;
        }
      }
      @media screen and (min-width: 1919px) {
        &{
          height: 213px;
        }
      }
    }

    .list_item_container {
      width: 100%;
      min-height: 60px;
    }

    .dropControlIcon {
      display: ${(props) => (props.show ? 'none' : 'block')};
    }
    .dropMenu {
      border-radius: ${(props) => (props.show ? '0px' : '8px')};
      display: flex;
      height: 45px;
      transition: all 0.1s ease-in;
      background-color: #FFFFFF;
      width: 100%;
      justify-content: ${(props) => (props.show ? 'center' : 'space-between')};
      align-items: center;
      padding-left: ${(props) => (props.show ? '0%' : '10%')};
      padding-right: ${(props) => (props.show ? '0%' : '9%')};
      &:hover {
        background-color: #ECEFFF !important;
      }
      p {
        font-weight: 600;
        width: 100%;
        text-align: start;
        font-size: 0.9rem;
        display: ${(props) => (props.show ? 'none' : 'block')};
      }
      .dropIcon {
        font-size: 1.2rem;
        margin-right: ${(props) => (props.show ? '0rem' : '1rem')};
      }
      @media screen and (min-width: 1900px) {
        & {
          height: 55px;
        }
      }
    }
    .dropMenuLinks {
      display: flex;
      transition: all 0.1s ease-in;
      width: 100%;
      height: 45px;
      align-items: center;
      border-radius: ${(props) => (props.show ? '0px' : '8px')};
      padding-left: ${(props) => (props.show ? '0%' : '10%')};
      justify-content: ${(props) => (props.show ? 'center' : 'space-between')};
      padding-right: ${(props) => (props.show ? '0%' : '9%')};
      &:hover {
        background-color: #ECEFFF !important;
      }
      @media screen and (min-width: 1900px) {
        & {
          height: 55px;
        }
      }
      i {
        margin-right: ${(props) => (props.show ? '0rem' : '1rem')};
      }
      p {
        font-weight: 600;
        width: 100%;
        display: ${(props) => (props.show ? 'none' : 'block')};
      }
    }
  }
`;
const NavbarHeader = styled.div`
  /* width: ${(props) => (props.show ? '100%' : '80%')}; */
  height: 65px;
  position: relative;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.show ? 'center' : 'space-between')};
  padding-left: ${(props) => (props.show ? '0%' : '10%')};
  padding-right: ${(props) => (props.show ? '0%' : '6%')};
  @media screen and (min-width: 1900px) {
    & {
      height: 70px;
    }
  }
  .top-basic-logo{
    display: ${(props) => (props.show ? 'none' : 'flex')};
    align-items: center;
  }
  h1 {
    margin: 0;
    font-size: 2.7rem;
    font-weight: bolder;
    transition: all 0.3s;
    position: relative;
    opacity: ${(props) => (props.show ? '0' : '1')};
    @media screen and (min-width: 1900px) {
      & {
        font-size: 2.2rem;
      }
    }
    @media screen and (max-width: 1300px) {
      & {
        font-size: 1.8rem;
      }
    }
  }
  .navbar_header_menu {
    cursor: pointer;
    font-size: 1rem;
    margin-left: 0.05rem;
    margin-right: 0.15rem;
    @media screen and (min-width: 1900px) {
      & {
        font-size: 1rem;
      }
    }
  }
`;
const Navbar = observer(({ setOpen, open }) => {
  const { user } = useContext(Context);
  const [openNavbar, setopenNavbar] = useState(!open);
  const [navbarAct, setNavbarAct] = useState('');
  const [contentVisible, setContentVisible] = useState(false);
  const [informationcontentVisible, setInformationContentVisible] = useState(false);
  const locationOriginal = window.location.href.split('/');
  const location = locationOriginal[3];

  // const toggleContentVisible = () => {
  //   setContentVisible((prevState) => !prevState);
  //   setDropClick(!dropClick);
  // };

  useEffect(() => {
    setNavbarAct(location == '' ? 'groups' : location);
  }, [location]);
  const handleNavbarClick = (page) => {
    setNavbarAct(page);
    localStorage.setItem('navbarAct', page);
  };
  useEffect(() => {
    const storedPage = localStorage.getItem('navbarAct');
    if (storedPage) {
      setNavbarAct(storedPage);
    }
  }, []);

  const setOpendata = () => {
    setOpen(openNavbar);
    setContentVisible(false);
  };
  const informationClicked = () => {
    if (navbarAct !== 'informationChart') {
      setopenNavbar(!openNavbar);
      setOpen(openNavbar);
      setContentVisible(false);
    }
  };
  useEffect(() => {
    const storedAccordionState = localStorage.getItem('accordionOpen');
    const storedInfoAccordionState = localStorage.getItem('infoAccordionOpen');
    if (storedAccordionState) {
      setContentVisible(storedAccordionState === 'true');
    }
    if (storedInfoAccordionState) {
      setInformationContentVisible(storedInfoAccordionState === 'true');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('accordionOpen', contentVisible.toString());
    localStorage.setItem('infoAccordionOpen', informationcontentVisible.toString());
  }, [contentVisible, informationcontentVisible]);

  const toggleContentVisible = () => {
    setContentVisible((prevState) => !prevState);
  };
  const toggleInfoContentVisible = () => {
    setInformationContentVisible((prevState) => !prevState);
  };

  return (
    <NavbarContent className="Navbar" show={openNavbar}>
      <NavbarHeader show={openNavbar}>
        <div className='top-basic-logo'>
          <img src={logo} alt="" width={150} height={37} style={{ marginRight: '4px' }} />
        </div>
        <IconButton
          onClick={() => {
            setOpendata();
            setopenNavbar(!openNavbar);
          }}
        >
          <i className="navbar_header_menu fa-solid fa-bars"></i>
        </IconButton>
      </NavbarHeader>
      <div className="navbarElementsDiv">
        <Link
          to="/pending"
          onClick={() => handleNavbarClick('pending')}
          className="link_navbar_router"
          style={{ display: user?.user?.role == 'admin' || user?.user?.role == 'super' ? 'inherit' : 'none' }}
        >
          <NavbarMenus
            active={navbarAct == 'pending' ? true : false}
            openData={openNavbar}
            rightIcon={'fa-solid fa-chevron-right'}
            icon={
              <i
                className="fa-solid fa-person-shelter"
                id="navbar_menus_item_icon"
              ></i>
            }
            itemName="Lidlar"
          ></NavbarMenus>
        </Link>
        <Link
          to="/lesson-table"
          onClick={() => handleNavbarClick('lesson-table')}
          className="link_navbar_router"
        >
          <NavbarMenus
            active={navbarAct == 'lesson-table' ? true : false}
            openData={openNavbar}
            rightIcon={'fa-solid fa-chevron-right'}
            icon={
              <i
                className="fa-solid fa-table"
                id="navbar_menus_item_icon"
              ></i>
            }
            itemName="Dars jadvali"
          ></NavbarMenus>
        </Link>
        <Link
          to="/groups"
          onClick={() => handleNavbarClick('groups')}
          className="link_navbar_router"
        >
          <NavbarMenus
            active={navbarAct == 'groups' ? true : false}
            openData={openNavbar}
            rightIcon={'fa-solid fa-chevron-right'}
            icon={
              <i
                className="fa-solid fa-layer-group"
                id="navbar_menus_item_icon"
              ></i>
            }
            itemName="Guruhlar"
          ></NavbarMenus>
        </Link>
        <Link
          to="/employees"
          onClick={() => handleNavbarClick('employees')}
          className="link_navbar_router"
        >
          <NavbarMenus
            active={navbarAct == 'employees' ? true : false}
            openData={openNavbar}
            rightIcon={'fa-solid fa-chevron-right'}
            icon={
              <i
                className="fa-solid fa-users"
                id="navbar_menus_item_icon"
              ></i>
            }
            itemName="Xodimlar"
          ></NavbarMenus>
        </Link>
        <Link
          to="/general-students"
          onClick={() => handleNavbarClick('general-students')}
          className="link_navbar_router"
        >
          <NavbarMenus
            active={navbarAct == 'general-students' ? true : false}
            openData={openNavbar}
            rightIcon={'fa-solid fa-chevron-right'}
            icon={
              <i
                className="fa-solid fa-people-roof"
                id="navbar_menus_item_icon"
              ></i>
            }
            itemName="O'quvchilar"
          ></NavbarMenus>
        </Link>
        <Link
          to="/buy"
          onClick={() => handleNavbarClick('buy')}
          className="link_navbar_router"
          style={{ display: user?.user?.role == 'casher' || user?.user?.role == 'super' ? 'inherit' : 'none' }}
        >
          <NavbarMenus
            active={navbarAct == 'buy' ? true : false}
            openData={openNavbar}
            rightIcon={'fa-solid fa-chevron-right'}
            icon={
              <i
                className="fa-regular fa-credit-card"
                id="navbar_menus_item_icon"
              ></i>
            }
            itemName="To'lovlar"
          ></NavbarMenus>
        </Link>
        <Link
          to="/basic-debtors"
          onClick={() => handleNavbarClick('basic-debtors')}
          className="link_navbar_router"
          style={{ display: user?.user?.role == 'casher' || user?.user?.role == 'super' ? 'inherit' : 'none' }}
        >
          <NavbarMenus
            active={navbarAct == 'basic-debtors' ? true : false}
            openData={openNavbar}
            rightIcon={'fa-solid fa-chevron-right'}
            icon={
              <i
                className="fa-solid fa-money-check-dollar"
                id="navbar_menus_item_icon"
              ></i>
            }
            itemName="Qarzdorlar"
          ></NavbarMenus>
        </Link>
        {user?.user?.role == 'super' &&
          <div className='accordion_container'>
            <div className="accordion">
              <button
                type="button"
                className="accordion_title"
                style={{marginBottom: informationcontentVisible ? '10px' : '0px'}}
                onClick={toggleInfoContentVisible}
              >
                <div
                  className="dropMenu"
                  style={{ color: '#9C9C9C' }}
                >
                  <i className="dropIcon fa-solid fa-chart-simple"></i>
                  <p>Hisobotlar</p>
                  <i
                    style={{ fontSize: '11px' }}
                    className={
                      !informationcontentVisible
                        ? 'fa-solid fa-chevron-down dropControlIcon'
                        : 'fa-solid fa-chevron-up dropControlIcon'
                    }
                  ></i>
                </div>
              </button>
            </div>
            <div className={`accordion_content ${informationcontentVisible ? 'show_content info-part' : 'hidden_content'}`}>
              <div className='links-part'>
                <Link
                  to="/logs"
                  onClick={() => {
                    handleNavbarClick('logs');
                  }}
                  className="link_navbar_router"
                >
                  <div
                    className="dropMenuLinks"
                    style={{
                      backgroundColor:
                        navbarAct == 'logs' ? '#ECEFFF' : '#FFFFFF',
                      color: navbarAct == 'logs' ? '#061DB2' : '#9C9C9C'
                    }}
                  >
                    <i
                      className="fa-solid fa-list"
                      id="navbar_menus_item_icon"
                    ></i>
                    <p>Loglar</p>
                  </div>
                </Link>
                <Link
                  to="/buy-statistics"
                  onClick={() => {
                    handleNavbarClick('buy-statistics');
                  }}
                  className="link_navbar_router"
                >
                  <div
                    className="dropMenuLinks"
                    style={{
                      backgroundColor:
                        navbarAct == 'buy-statistics' ? '#ECEFFF' : '#FFFFFF',
                      color: navbarAct == 'buy-statistics' ? '#061DB2' : '#9C9C9C'
                    }}
                  >
                    <i
                      className="fa-solid fa-receipt"
                      id="navbar_menus_item_icon"
                    ></i>
                    <p>To&apos;lov statistikalar</p>
                  </div>
                </Link>
                <Link
                  to="/information-charts"
                  onClick={() => {
                    handleNavbarClick('information-charts');
                    informationClicked();
                  }}
                  className="link_navbar_router"
                >
                  <div
                    className="dropMenuLinks"
                    style={{
                      backgroundColor:
                        navbarAct == 'information-charts' ? '#ECEFFF' : '#FFFFFF',
                      color: navbarAct == 'information-charts' ? '#061DB2' : '#9C9C9C'
                    }}
                  >
                    <i
                      className="fa-solid fa-chart-column"
                      id="navbar_menus_item_icon"
                    ></i>
                    <p>O&apos;quvchilar hisoboti</p>
                  </div>
                </Link>
                <Link
                  to="/arrivals-report"
                  onClick={() => {
                    handleNavbarClick('arrivals-report');
                  }}
                  className="link_navbar_router"
                >
                  <div
                    className="dropMenuLinks"
                    style={{
                      backgroundColor:
                        navbarAct == 'arrivals-report' ? '#ECEFFF' : '#FFFFFF',
                      color: navbarAct == 'arrivals-report' ? '#061DB2' : '#9C9C9C'
                    }}
                  >
                    <i
                      className="fa-solid fa-people-group"
                      id="navbar_menus_item_icon"
                    ></i>
                    <p>Kelib ketganlar hisoboti</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        }
        <div className='accordion_container'>
          <div className="accordion">
            <button
              type="button"
              className="accordion_title"
              style={{marginBottom: contentVisible ? '10px' : '0px'}}
              onClick={toggleContentVisible}
            >
              <div
                className="dropMenu"
                style={{ color: '#9C9C9C' }}
              >
                <i className="dropIcon fa-solid fa-chart-pie"></i>
                <p>Qo&apos;shimcha</p>
                <i
                  style={{ fontSize: '11px' }}
                  className={
                    !contentVisible
                      ? 'fa-solid fa-chevron-down dropControlIcon'
                      : 'fa-solid fa-chevron-up dropControlIcon'
                  }
                ></i>
              </div>
            </button>
          </div>
          <div className={`accordion_content ${contentVisible ? 'show_content' : 'hidden_content'}`}>
            <div className='links-part'>
              <Link
                to="/rooms"
                onClick={() => handleNavbarClick('rooms')}
                className="link_navbar_router"
              >
                <div
                  className="dropMenuLinks"
                  style={{
                    backgroundColor:
                      navbarAct == 'rooms' ? '#ECEFFF' : '#FFFFFF',
                    color: navbarAct == 'rooms' ? '#061DB2' : '#9C9C9C'
                  }}
                >
                  <i
                    className="fa-solid fa-door-open"
                    id="navbar_menus_item_icon"
                  ></i>
                  <p>Xonalar</p>
                </div>
              </Link>
              <Link
                to="/not-group-students"
                onClick={() => handleNavbarClick('not-group-students')}
                className="link_navbar_router"
              >
                <div
                  className="dropMenuLinks"
                  style={{
                    backgroundColor:
                      navbarAct == 'not-group-students' ? '#ECEFFF' : '#FFFFFF',
                    color: navbarAct == 'not-group-students' ? '#061DB2' : '#9C9C9C'
                  }}
                >
                  <i
                    className="fa-solid fa-users-slash"
                    id="navbar_menus_item_icon"
                  ></i>
                  <p>Guruhlanmagan o&apos;quvchilar</p>
                </div>
              </Link>
              <Link
                to="/all-messages"
                onClick={() => {
                  handleNavbarClick('all-messages');
                }}
                className="link_navbar_router"
              >
                <div
                  className="dropMenuLinks"
                  style={{
                    backgroundColor:
                      navbarAct == 'all-messages' ? '#ECEFFF' : '#FFFFFF',
                    color: navbarAct == 'all-messages' ? '#061DB2' : '#9C9C9C'
                  }}
                >
                  <i
                    className="fa-solid fa-message"
                    id="navbar_menus_item_icon"
                  ></i>
                  <p>Yuborilgan Xabarlar</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </NavbarContent>
  );
});

Navbar.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};

export default Navbar;
