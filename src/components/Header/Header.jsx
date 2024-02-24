import React, { useState } from 'react';
import styled from 'styled-components';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import logo from '/images/navbarLogo.png';
import { Logout } from '@mui/icons-material';
import {
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import { Settings } from '@material-ui/icons';
import { Box } from '@mui/system';
import AdminIcon from '../../assets/Avatar.png';
import PropTypes from 'prop-types';
import useMediaQueries from 'media-queries-in-react';
import { useContext } from 'react';
import { Context } from '../../index';
import { useNavigate } from 'react-router-dom';
import { LOGIN_ROUTE } from '../../utils/consts';
import './Header.css';
const Global = styled.div``;

const Container = styled.div``;



const Title = styled.div``;

const Text2 = styled.div``;

const Admin = styled.div``;

const Logo = styled.div``;

const UserImage = styled.div``;

const UserName = styled.div``;
const Name = styled.div``;
const Content1 = styled.div``;

const User = styled.div``;

const Header = (props) => {
  const { state, width } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const minWidthStyle = {
    width: width ? width : props.state ? '86%' : '96%',
  };

  const maxWidhtStyle = {
    width: width ? width : props.state ? '83%' : '96%',
  };

  // const styleHeader = function(){
  //   if (window.innerWidth > 1900) {
  //     return minWidthStyle;
  //   }else{
  //     return maxWidhtStyle;
  //   }
  // };

  const mediaQueries = useMediaQueries({
    narrow: 'screen and (min-width: 1900px)',
  });

  const responsiveHeader = function () {
    if (mediaQueries.narrow) {
      return minWidthStyle;
    } else {
      return maxWidhtStyle;
    }
  };


  const { user } = useContext(Context);
  const history = useNavigate();
  const logout = () => {
    user.setUser({});
    user.setIsAuth(false);
    localStorage.setItem('token', '');
    history(LOGIN_ROUTE);
  };
  return (
    <Global
      open={state}
      style={responsiveHeader()}
      id='globalId'
    >
      <Container id='containerId'>
        <Content1 id='content1Id'>
          <Logo id='logoId'>
            <img src={logo} width={35} height={35} />
          </Logo>
          <Title id='titleId'>
            Vim <Text2 id='text2Id'>English house</Text2>{' '}
          </Title>
        </Content1>
        <User id='userIDStyle'>
          <UserImage id='userImageID'>
            <Box
              component='img'
              sx={{
                height: 32,
                width: 32,
                maxHeight: { xs: 233, md: 167 },
                maxWidth: { xs: 350, md: 250 },
              }}
              alt='user'
              src={AdminIcon}
            />
          </UserImage>
          <Admin id='adminId'>
            <UserName id='userNameId'>
              Vim
              <Box>
                <Tooltip title='Foydalanuvchi Sozlamalari'>
                  <IconButton
                    onClick={handleClick}
                    size='small'
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup='true'
                    aria-expanded={open ? 'true' : undefined}
                  >
                    <KeyboardArrowDownIcon fontSize='small' />
                  </IconButton>
                </Tooltip>
              </Box>
              <Menu
                anchorEl={anchorEl}
                id='account-menu'
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    '& .MuiAvatar-root': {},
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem>
                  <ListItemIcon>
                    <Settings fontSize='small' />
                  </ListItemIcon>
                  Sozlamalar
                </MenuItem>
                <MenuItem onClick={() => logout()}>
                  <ListItemIcon>
                    <Logout fontSize='small' />
                  </ListItemIcon>
                  Chiqish
                </MenuItem>
              </Menu>
            </UserName>

            <Name id='nameId'>Teacher</Name>
          </Admin>
        </User>
      </Container>
    </Global>
  );
};

Header.propTypes = {
  state: PropTypes.bool.isRequired,
  width: PropTypes.string.isRequired
};

export default Header;
