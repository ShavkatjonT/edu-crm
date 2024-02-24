import React, { useState, useContext } from 'react';
import Loder from '../loder/Loder';
import styled from 'styled-components';
import Button from '../../ui/Button/Button';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { GROUPS_ROUTE } from '../../utils/consts';
import { Context } from '../../index';
import { login } from '../../http/userApi';
import Snackbar from '../Snackbar/Snackbar';
import logo from '../../../public/images/loginLogo.png';
import rightImg from '/images/loginRightImg.png';
import Input from '../../ui/Input';
import PasswordInput from '../../ui/PasswordInput';

const Container = styled.div`
  width: 100%;
  height: 100vh;
  z-index: 100;
  background-color: #FFFFFF;
  display: flex;
  justify-content: space-around;
  align-items: center;
  #rightImgContent{
    width: 40%;
    img{
      width: 100%;
    }
    @media screen and (max-width: 992px){
      &{
        display: none;
      }
    }
  }
`;

const Content = styled.div`
  @font-face {
    font-family: 'sfPro';
    src: url(/fonts/sf-pro-display/SFPRODISPLAYREGULAR.OTF);
  }
  @font-face {
    font-family: 'sfProBold';
    src: url(/fonts/sf-pro-display/SFPRODISPLAYMEDIUM.OTF);
  }
  font-family: 'sfPro';
  width: 400px;
  height: 100vh;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  position: relative;
  gap: 40px;
  padding-top: 20px;
  @media screen and (min-width: 1600px) {
    &{
      width: 500px;
    }
  }
  @media screen and (max-width: 445px) {
    &{
      width: 90%;
    }
  }
  .login_content_logo {
    position: absolute;
    @media screen and (min-width: 1600px) {
      &{
        top: 8%;
        width: 50%;
        height: 80px;
      }
    }
    width: 40%;
    height: 60px;
    top: 5%;
    bottom: 0;
    right: 0;
    left: 0;
    margin: 0 auto;
    img{
      width: 100%;
    }
  }

  .title-part{
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    h1{
      font-size: 45px;
      margin: 0;
      font-family: 'sfProBold';
      color: #252525;
      @media screen and (min-width: 1600px) {
        &{
          font-size: 60px;
        }
      }
      @media screen and (max-width: 600px) {
        &{
          font-size: 30px;
        }
      }
    }
    p{
      color: #4B4B4B;
      font-size: 16px;
      @media screen and (min-width: 1600px) {
        &{
          font-size: 22px;
        }
      }
      @media screen and (max-width: 600px) {
        &{
          font-size: 13px;
        }
      }
    }
  }
  form {
    .input-part{
      display: flex;
      flex-direction: column;
      gap: 5px;
      label{
        font-family: 'sfProBold';
        color: #252525;
        font-size: 16px;
        @media screen and (min-width: 1600px) {
          &{
            font-size: 20px;
          }
        }
        @media screen and (max-width: 600px) {
          &{
            font-size: 13px;
          }
        }
      }
    }
  }
`;

const LoginUser = observer(() => {
  const { user } = useContext(Context);
  const [signIn, setSignIn] = useState(false);
  const [signInPassword, setSignInPassword] = useState(false);
  // const [allValuePassword, setAllValuePassword] = useState(false);
  const [value, setValue] = useState('');
  const [valuePassword, setValuePassword] = useState('');
  const [inError, setInError] = useState(false);
  const [open, setOpen] = useState(false);
  const [openLoader, setOpenLoader] = useState(false);
  // const location = useLocation();
  // const isLogin = location.pathname === LOGIN_ROUTE;
  const history = useNavigate();

  const changePassword = (e) => {
    setValuePassword(e.target.value);
    setSignInPassword(false);
  };

  const loginClick = async (click) => {
    click.preventDefault();
    try {
      let data;
      if (value && valuePassword) {
        setOpenLoader(true);
        data = await login(value, valuePassword);
        if (data.role == 'teacher') {
          user.setUser(data);
          user.setIsAuth(true);
          history(`/cabinet/${data.teacher_id}`);
          setInError(true);
          setOpen(true);
          setSignIn(false);
          setSignInPassword(false);
        } else {
          user.setUser(data);
          user.setIsAuth(true);
          history(GROUPS_ROUTE);
          setInError(true);
          setOpen(true);
          setSignIn(false);
          setSignInPassword(false);
        }

      } else {
        setSignIn(true);
        if (!value) {
          setSignIn(true);
        } else {
          setSignIn(false);
        }
        if (!valuePassword) {
          setSignInPassword(true);
        } else {
          setSignInPassword(false);
        }
      }
    } catch (error) {
      setOpenLoader(false);
      setInError(false);
      setOpen(true);
      setValue('');
      setValuePassword('');
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const changeLogin = (e) => {
    setValue(e.target.value);
    setSignIn(false);
  };

  return (
    <div>
      <Loder stop={openLoader} />
      <Container>
        <Content>
          <div className='login_content_logo'>
            <img src={logo} />
          </div>
          <div className='title-part'>
            <h1>Xush kelibsiz!</h1>
            <p>Login parolingizni kiritib o&apos;z kabinetingizga kiring.</p>
          </div>
          <form>
            <div className='input-part'>
              <label>Login</label>
              <Input value={value} isResponsive={true} onChange={changeLogin} invalid={signIn} placeholder='Loginingizni kiriting' errorMessage='Maydonni to&apos;ldiring' />
            </div>
            <div className='input-part'>
              <label>Parol</label>
              <PasswordInput value={valuePassword} isResponsive={true} onChange={changePassword} invalid={signInPassword} placeholder='Parolingizni kiriting' errorMessage='Maydonni to&apos;ldiring' />
            </div>
            <div style={{marginTop: '10px'}}>
              <Button
                value='Kirish'
                onClick={loginClick}
                isResponsive={true}
              />
            </div>
          </form>
        </Content>
        <div id='rightImgContent'>
          <img src={rightImg} loading="lazy" alt="login Page Image" />
        </div>
      </Container>
      <Snackbar
        open={open}
        onClose={handleClose}
        severity={inError ? 'success' : 'error'}
        massage={
          inError
            ? 'Kirish muvafaqqiyatli amalga oshirildi'
            : 'Login yoki Parol noto\'g\'ri kiritildi'
        }
      />
    </div>
  );
});

export default LoginUser;
