import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import Checkbox from '@mui/material/Checkbox';
import { observer } from 'mobx-react-lite';
import { useNavigate, useLocation } from 'react-router-dom';
import { GROUPS_ROUTE, LOGIN_ROUTE } from '../../utils/consts';
import { Context } from '../../index';
import { login } from '../../http/userApi';
const Container = styled.div`
  @import url('https://fonts.googleapis.com/css2?family=Nunito&display=swap');
  font-family: 'Nunito', sans-serif;
  letter-spacing: 0.1rem;
  width: 100%;
  height: 100vh;
  display: flex;
  /* align-items: center; */
  justify-content: space-around;
`;

const LoginLeftContent = styled.div`
  width: 35%;
  transform: scale(0.8);
  h1 {
    color: #444b59;
    @media screen and (min-width: 1500px) {
      & {
        font-size: 2.2rem;
      }
    }
    @media screen and (min-width: 1800px) {
      & {
        font-size: 2.7rem;
      }
    }
  }
  .registration_text {
    font-size: 1.2rem;
    color: #444b59;
    margin-bottom: 0rem;
    @media screen and (min-width: 1500px) {
      & {
        font-size: 1.4rem;
      }
    }
    @media screen and (min-width: 1800px) {
      & {
        font-size: 1.8rem;
      }
    }
    a {
      text-decoration: none;
      color: #658af7;
    }
  }
  form {
    label {
      font-size: 1.4rem;
      color: #444b59;
      font-weight: 600;
      @media screen and (min-width: 1500px) {
        & {
          font-size: 1.7rem;
        }
      }
      @media screen and (min-width: 1800px) {
        & {
          font-size: 1.8rem;
        }
      }
    }
    .login_email_input {
      width: 105%;
      height: 3rem;
      background: #ffffff;
      color: #222222;
      border: 2px solid #789ade;
      border-radius: 5px;
      margin-top: 1.5rem;
      margin-bottom: 2rem;
      padding-left: 3%;
      padding-right: 2%;
      font-size: 1.2rem;
      &::placeholder {
        color: #c0c0c0;
      }
      &:focus {
        outline: none;
      }
      @media screen and (min-width: 1500px) {
        & {
          height: 3.5rem;
          font-size: 1.5rem;
        }
      }
      @media screen and (min-width: 1800px) {
        & {
          height: 4.5rem;
          font-size: 1.8rem;
        }
      }
    }
    .login_label_checkbox {
      font-size: 0.9rem;
      font-weight: 600;
      @media screen and (min-width: 1500px) {
        & {
          font-size: 1.7rem;
        }
      }
      @media screen and (min-width: 1800px) {
        & {
          font-size: 1.1rem;
        }
      }
    }
    .password_input_part {
      input[type='password'],
      [type='text'] {
        width: 85%;
        height: 3rem;
        border: none;
        font-size: 1.2rem;
        color: #222222;
        transition: 0.1s ease-in-out;
        &:focus {
          outline: none;
        }
        &::placeholder {
          font-size: 0.9rem;
        }
        @media screen and (min-width: 1500px) {
          & {
            font-size: 1.5rem;
          }
        }
        @media screen and (min-width: 1800px) {
          & {
            font-size: 1.8rem;
          }
        }
      }

      button {
        border: none;
        background-color: initial;
        font-size: 1rem;
        color: #686868;
        cursor: pointer;
      }
      width: 105%;
      background: #ffffff;
      border: 2px solid #789ade;
      border-radius: 5px;
      margin-top: 1.5rem;
      margin-bottom: 1.5rem;
      padding-left: 3%;
      padding-right: 2%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      @media screen and (min-width: 1500px) {
        & {
          height: 3.5rem;
        }
      }
      @media screen and (min-width: 1800px) {
        & {
          height: 4.5rem;
        }
      }
    }
    .login_checkbox {
      margin-left: -0.6rem;
    }
    .login_signIn {
      width: 105%;
      height: 3rem;
      border: none;
      background-color: #6482e4;
      -webkit-box-shadow: 1px 5px 8px 0px rgba(34, 60, 80, 0.2);
      -moz-box-shadow: 1px 5px 8px 0px rgba(34, 60, 80, 0.2);
      box-shadow: 1px 5px 8px 0px rgba(34, 60, 80, 0.2);
      border-radius: 5px;
      cursor: pointer;
      color: #ffffff;
      font-size: 1.4rem;
      margin-top: 1rem;
      margin-bottom: 2rem;
      letter-spacing: 0.2rem;
      font-family: 'Nunito', sans-serif;
      transition: 0.3s ease-in-out;
      &:hover {
        background-color: #446ae7;
      }
      @media screen and (min-width: 1500px) {
        & {
          height: 3.5rem;
        }
      }
      @media screen and (min-width: 1800px) {
        & {
          height: 4.5rem;
        }
      }
    }
  }
  .signOther {
    text-align: center;
    width: 105%;
    border-top: 1.5px solid #afafaf;
    p {
      margin-top: -0.82rem;
      background-color: #ffffff;
      border-radius: 15px;
      width: 40%;
      text-align: center;
    }
    .signOther_text {
      display: flex;
      justify-content: center;
    }
    .signOther_icons {
      display: flex;
      align-items: center;
      margin-top: 2rem;
      justify-content: space-around;
      button {
        width: 24%;
        height: 3.5rem;
        background: #ffffff;
        border: 2px solid #789ade;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: 0.2s ease-in-out;
        cursor: pointer;
        img {
          width: 40%;
          height: 2rem;
        }
        &:hover {
          border: 2px solid #2661d8;
        }
        .login_other_icon_apple {
          width: 37%;
          height: 1.8rem;
          margin-top: -0.2rem;
        }
      }
    }
  }
`;

const LoginRightContent = styled.div`
  width: 41%;
  display: flex;
  justify-content: center;
  align-items: center;
  @media screen and (min-width: 1500px) {
    & {
      width: 45%;
    }
  }
  img {
    width: 100%;
  }
`;

const Login = observer(() => {
  const { user } = useContext(Context);
  const [password, setPassword] = useState(true);
  const [value, setValue] = useState('');
  const [valuePassword, setValuePassword] = useState('');
  const location = useLocation();
  const isLogin = location.pathname === LOGIN_ROUTE;

  const passwordClick = (click) => {
    click.preventDefault();
    setPassword(!password);
  };

  const changePassword = (e) => {
    setValuePassword(e.target.value);
  };

  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

  const googleLogin = (event) => {
    event.preventDefault();
  };
  const facebookLogin = (event) => {
    event.preventDefault();
  };
  const appleLogin = (event) => {
    event.preventDefault();
  };
  const history = useNavigate();

  const loginClick = async () => {
    try {
      let data;
      if (isLogin) {
        data = await login(value, valuePassword);
        user.setUser(data);
        user.setIsAuth(true);
        history(GROUPS_ROUTE);
      }
    } catch (error) {
      console.log(311, error);
    }
  };

  return (
    <Container>
      <LoginLeftContent>
        <h1>Xush kelibsiz</h1>
        <p className='registration_text'>
          sizda accaunt yo&apos;qmi <a href='#'>Ro&apos;yxatdan o&apos;ting</a>
        </p>
        <form>
          <label htmlFor='login_email'>Loginni kiriting</label>
          <br />

          <input
            className='login_email_input'
            type='text'
            name='login_email'
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder='Ahmadjon@gmail.com'
          />
          <br />

          <label htmlFor='login_password'>Parolni kiriting</label>
          <br />

          <div className='password_input_part'>
            <input
              placeholder='&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;'
              name='login_password'
              type={`${password ? 'password' : 'text'}`}
              value={valuePassword}
              onChange={(e) => changePassword(e)}
            />

            <button onClick={passwordClick}>
              {password ? (
                <i className='fa-solid fa-eye-slash'></i>
              ) : (
                <i className='fa-solid fa-eye'></i>
              )}
            </button>
          </div>

          <Checkbox
            {...label}
            name='login_checkbox'
            id='login_checkbox'
            className='login_checkbox'
          />

          <label htmlFor='login_checkbox' className='login_label_checkbox'>
            Eslab qolish
          </label>
          <br />

          <button
            type='button'
            className='login_signIn'
            onClick={() => loginClick()}
          >
            Kirish
          </button>
        </form>

        <div className='signOther'>
          <div className='signOther_text'>
            <p>yoki bular bilan</p>
          </div>

          <div className='signOther_icons'>
            <button>
              <img src='/images/google.svg' onClick={googleLogin} />
            </button>

            <button>
              <img src='/images/facebook.svg' onClick={facebookLogin} />
            </button>

            <button>
              <img
                className='login_other_icon_apple'
                src='/images/apple.svg'
                onClick={appleLogin}
              />
            </button>
          </div>
        </div>
      </LoginLeftContent>

      <LoginRightContent>
        <img src='/images/loginBackground.svg' alt='' />
      </LoginRightContent>
    </Container>
  );
});

export default Login;
