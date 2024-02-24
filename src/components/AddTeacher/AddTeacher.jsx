import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import PropTypes from 'prop-types';
import { IMaskInput } from 'react-imask';
import { useNavigate } from 'react-router-dom';
import Snackbar from '../Snackbar/Snackbar';
import { Context } from '../../index';
import http from '../../http/index';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';

const ContentSkeleton = styled.div`
  padding-top: 2rem;
  padding-left: 2rem;
  padding-right: 2rem;
  padding-bottom: 2rem;
  background-color: white;
  border-radius: 6px;
  cursor: wait;
`;

const Container = styled.div`
  margin-top: 1.8rem;
  padding-top: 10px;
  padding-bottom: 10px;
  background-color: white;
  border-radius: 6px;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.25);
  hr {
    border: 1px solid #aaaaaa;
  }
  .errorEmailPart {
    margin-top: 3px;
    margin-left: 14px;
    font-size: 0.85rem;
    color: #d32f2f;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    font-weight: 400;
    font-size: 0.75rem;
    line-height: 1.66;
    letter-spacing: 0.03333em;
  }
`;

const Header = styled.div`
  display: flex;
  padding: 15px 20px;
  align-items: center;
  justify-content: space-between;
  a {
    i,
    .refresh {
      color: #00c335;
      cursor: pointer;
      font-size: 1.2rem;
      transition: all 0.8s;
      margin: 0 0.5rem;
      transform: rotateZ(20deg);
      &:hover {
        color: #229e43;
      }
    }
  }
  .arrow {
    color: #c3b600;
    cursor: pointer;
    font-size: 1.2rem;
    transition: all 0.8s;
    margin: 0 0.5rem;
    &:hover {
      color: #ffd000;
    }
  }
  .exit {
    color: #960d0d;
    cursor: pointer;
    font-size: 1.2rem;
    transition: all 0.8s;
    margin: 0 0.5rem;
    &:hover {
      color: #ff0000;
    }
  }
`;

const Main = styled.div`
  width: 100%;
  margin-top: 1.2rem;
  margin-bottom: 1rem;
  padding: 0 30px;
  .btn-add {
    margin-top: 2rem;
    border: none;
    background-color: #033a6b;
    width: 160px;
    border-radius: 5px;
    font-size: 1rem;
    height: 50px;
    cursor: pointer;
    color: white;
    transition: all 0.5s;
    &:hover {
      background-color: #135b99;
    }
  }
`;

const Forma = styled.div`
  padding-top: 1.5rem;
  width: 100%;
  display: flex;
  align-items: center;
  //justify-content: space-between;
`;

const TextMaskCustom = React.forwardRef(function TextMaskCustom(props, ref) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask='+998 (00) 000-00-00'
      definitions={{
        '#': /[1-9]/,
      }}
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  );
});

TextMaskCustom.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const AddTeacher = () => {
  const { user } = useContext(Context);
  const navigate = useNavigate();
  const [gender, setGender] = useState('');
  const [inError, setInError] = useState(false);
  const [open, setOpen] = useState(false);
  const [firstname, setFirstname] = useState('');
  const [birthday, setBirthday] = useState('');
  const [lastname, setLastname] = useState('');
  const [fathername, setFathername] = useState('');
  const [address, setAddress] = useState('');
  const [skeletonTime, setSkeletonTime] = useState(false);
  const [phone, setPhone] = useState({
    textmask: '+998',
  });
  const [phoneAddition, setPhoneAddition] = useState({
    textmask: '+998',
  });
  const [telegramIDValue, setTelegramIDValue] = useState('');
  const [roleEmployee, setRoleEmployee] = useState('');
  const [loginTextfield, setLoginTextfield] = useState('');
  const [passwordTextfield, setPasswordTextfield] = useState('');
  const [errorAddLogin, seterrorAddLogin] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorCallLimitEmailAdd, setErrorLimitEmailAdd] = useState(false);
  const [showPasswordAddModal, setShowPasswordAddModal] = useState(false);
  const [errorAddPassword, seterrorAddPassword] = useState(false);
  const [errorCallLimitPasswordAdd, setErrorCallLimitPasswordAdd] =
    useState(false);
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const studentAdd = () => {
    if (
      firstname && !/^\s*$/.test(firstname) &&
      gender &&
      birthday &&
      lastname && !/^\s*$/.test(lastname) &&
      address && !/^\s*$/.test(address) &&
      phone.textmask.length == 19 &&
      phoneAddition.textmask.length == 19 &&
      loginTextfield && passwordTextfield && roleEmployee
    ) {
      if (loginTextfield.length >= 4 && passwordTextfield.length >= 4) {
        setInError(true);
        setOpen(true);
        setSkeletonTime(true);
        http
          .post(import.meta.env.VITE_API_URL +  `${user?.user?.role == 'admin' ? 'api/teacher/add' : 'api/teacher/employee-add'}`, {
            firstname: firstname,
            gender: gender,
            birthday: birthday,
            lastname: lastname,
            fathername: fathername ? fathername : ' ',
            address: address,
            phone: phone.textmask,
            phone_2: phoneAddition.textmask,
            telegram_id: telegramIDValue,
            email: loginTextfield,
            password: passwordTextfield,
            job_type: roleEmployee,
          })
          .then(() => {
            navigate('/employees');
          })
          .catch((error) => {
            setSkeletonTime(false);
            setErrorEmail(true);
            if (
              error.response.data.message == 'ro\'yxattan o\'tmagan foydalanuvchi!'
            ) {
              user.setIsAuth(false);
              localStorage.clear();
              navigate('/');
            } else {
              console.log(error);
            }
          });
      } else {
        if (loginTextfield.length < 4) {
          setErrorLimitEmailAdd(true);
          seterrorAddLogin(false);
          setErrorEmail(false);
        } else {
          setErrorLimitEmailAdd(false);
        }
        if (passwordTextfield.length < 4) {
          setErrorCallLimitPasswordAdd(true);
          seterrorAddPassword(false);
          setErrorEmail(false);
        } else {
          setErrorCallLimitPasswordAdd(false);
        }
      }
    } else {
      setInError(false);
      setOpen(true);
    }
  };
  const teacherPhone = (event) => {
    setPhone({
      [event.target.name]: event.target.value,
    });
  };
  const teacherPhoneAddition = (event) => {
    setPhoneAddition({
      [event.target.name]: event.target.value,
    });
  };

  const handleChange = (event) => {
    setGender(event.target.value);
  };
  const changeTgId = (event) => {
    setTelegramIDValue(event.target.value);
  };

  const addLoginChange = (e) => {
    setLoginTextfield(e.target.value);
    seterrorAddLogin(false);
    setErrorEmail(false);
    setErrorLimitEmailAdd(false);
  };
  const addPasswordChange = (e) => {
    setPasswordTextfield(e.target.value);
    seterrorAddPassword(false);
    setErrorCallLimitPasswordAdd(false);
  };

  const handleClickShowPasswordAddModal = () =>
    setShowPasswordAddModal((showAdd) => !showAdd);

  const handleMouseDownPasswordAddModal = (eventAdd) => {
    eventAdd.preventDefault();
  };

  const handleChangeRoleEmployee = (e) => {
    setRoleEmployee(e.target.value);
  };


  return (
    <Container>
      {
        skeletonTime ? (
          <ContentSkeleton>
            <Box sx={{ width: '100%' }}>
              <Skeleton width="30%" height="2rem" />
              <Skeleton width="60%" height="2rem" />
              <Skeleton width="85%" height="2rem" />
              <Skeleton width="100%" height="2rem" />
            </Box>
          </ContentSkeleton>
        ) : (
          <div>
            <Header>
              <div>
                <h3>Xodim qo&apos;shish</h3>
              </div>
              <div>
                <i
                  className='fa-solid exit fa-xmark'
                  onClick={() => {
                    navigate('/employees');
                  }}
                ></i>
              </div>
            </Header>
            <hr />
            <Main>
              <Forma>
                <Box sx={{ width: '100%', pr: 3 }}>
                  <TextField
                    fullWidth
                    label='Ismni kiriting...'
                    id='outlined-size-large'
                    size='large'
                    onChange={(e) => {
                      setFirstname(e.target.value);
                    }}
                    value={firstname}
                    type={'search'}
                  />
                </Box>

                <Box sx={{ width: '100%', px: 3 }}>
                  <TextField
                    fullWidth
                    label='Familyani kiriting...'
                    id='outlined-size-large'
                    onChange={(e) => {
                      setLastname(e.target.value);
                    }}
                    value={lastname}
                    size='large'
                    type={'search'}
                  />
                </Box>

                <Box sx={{ width: '100%', pl: 3 }}>
                  <TextField
                    fullWidth
                    label='Otasini ismini kiriting...'
                    id='outlined-size-large'
                    onChange={(e) => {
                      setFathername(e.target.value);
                    }}
                    value={fathername}
                    size='large'
                    type={'search'}
                  />
                </Box>
              </Forma>

              <Forma>
                <Box sx={{ width: '100%', pr: 3 }}>
                  <FormControl fullWidth>
                    <InputLabel id='demo-simple-select-label'>
                      Jinsini tanlang...
                    </InputLabel>
                    <Select
                      labelId='demo-simple-select-label'
                      id='demo-simple-select'
                      value={gender}
                      label='Jinsini tanlang...'
                      onChange={handleChange}
                    >
                      <MenuItem value={'erkak'}>Erkak</MenuItem>
                      <MenuItem value={'ayol'}>Ayol</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Box sx={{ width: '100%', px: 3 }}>
                  <TextField
                    fullWidth
                    className='databirthday'
                    id='date'
                    label="Tug'ilgan kunni kiriting..."
                    type='date'
                    onChange={(e) => {
                      setBirthday(e.target.value);
                    }}
                    value={birthday}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Box>
                <Box sx={{ width: '100%', pl: 3 }}>
                  <TextField
                    fullWidth
                    label='Manzilni kiriting...'
                    id='outlined-size-large'
                    size='large'
                    onChange={(e) => {
                      setAddress(e.target.value);
                    }}
                    value={address}
                    type={'search'}
                  />
                </Box>
              </Forma>

              <Forma>
                <Box sx={{ width: '100%', pr: 3 }}>
                  <TextField
                    fullWidth
                    label='Telefon raqamni kiriting...'
                    value={phone.textmask}
                    onChange={teacherPhone}
                    name='textmask'
                    id='formatted-text-mask-input'
                    InputProps={{
                      inputComponent: TextMaskCustom,
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Box>
                <Box sx={{ width: '100%', px: 3 }}>
                  <TextField
                    fullWidth
                    label='Qo&apos;shimcha telefon raqamni kiriting...'
                    value={phoneAddition.textmask}
                    onChange={teacherPhoneAddition}
                    name='textmask'
                    id='formatted-text-mask-input'
                    InputProps={{
                      inputComponent: TextMaskCustom,
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Box>
                <Box sx={{ width: '100%', pl: 3 }}>
                  <TextField
                    id="outlined-number"
                    sx={{width: '100%'}}
                    label="Telegram ID"
                    value={telegramIDValue}
                    onChange={changeTgId}
                    type="number"
                  />
                </Box>
              </Forma>
              <Forma>
                <Box sx={{ width: '100%', pr: 3 }}>
                  <FormControl fullWidth>
                    <InputLabel id='demo-simple-select-label'>
                      Xodim vazifasini tanlang
                    </InputLabel>
                    <Select
                      labelId='demo-simple-select-label'
                      id='demo-simple-select'
                      value={roleEmployee}
                      label='Xodim vazifasini tanlang'
                      onChange={handleChangeRoleEmployee}
                    >
                     {user?.user?.role == 'supper' || user?.user?.role == 'super' && <MenuItem value={'ceo'}>CEO</MenuItem>}
                     {user?.user?.role == 'supper' || user?.user?.role == 'super' && <MenuItem value={'admin'}>Administrator</MenuItem>}
                     {user?.user?.role == 'supper' || user?.user?.role == 'super' && <MenuItem value={'casher'}>Hisobchi</MenuItem>}
                      <MenuItem value={'teacher'}>O&apos;qituvchi</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Box sx={{ width: '100%', px: 3 }}>
                  <TextField
                    fullWidth
                    label="Login"
                    id="outlined-size-large"
                    size="large"
                    value={loginTextfield}
                    onChange={addLoginChange}
                    type={'text'}
                    helperText={errorAddLogin ? 'Loginni kiriting' : null}
                  />
                  <p
                    className="errorEmailPart"
                    style={{ display: errorEmail ? 'block' : 'none' }}
                  >
                    Ushbu loginga tegishli foydalanuvchi mavjud
                  </p>
                  <p
                    className="errorEmailPart"
                    style={{
                      display: errorCallLimitEmailAdd ? 'block' : 'none',
                    }}
                  >
                    Eng kamida 4 ta belgi kiritish zarur
                  </p>
                </Box>
                <Box sx={{ width: '100%', pl: 3 }}>
                  <FormControl sx={{ width: '100%' }} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">
                      Parol
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-password"
                      value={passwordTextfield}
                      onChange={addPasswordChange}
                      type={showPasswordAddModal ? 'text' : 'password'}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPasswordAddModal}
                            onMouseDown={handleMouseDownPasswordAddModal}
                            edge="end"
                          >
                            {showPasswordAddModal ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Parol"
                    />
                    <p
                      className="errorEmailPart"
                      style={{
                        display: errorAddPassword ? 'block' : 'none',
                      }}
                    >
                      Parolni kiriting
                    </p>
                    <p
                      className="errorEmailPart"
                      style={{
                        display: errorCallLimitPasswordAdd
                          ? 'block'
                          : 'none',
                      }}
                    >
                      Eng kamida 4 ta belgi kiritish zarur
                    </p>
                  </FormControl>
                </Box>
              </Forma>
              <br />
              <button
                onClick={() => {
                  studentAdd();
                }}
                className='btn-add'
              >
                Qo&apos;shish
              </button>
              <Snackbar
                open={open}
                onClose={handleClose}
                severity={inError ? 'success' : 'error'}
                massage={
                  inError
                    ? 'Ma\'lumotlar muvaffaqiyatli qo\'shildi'
                    : 'Ma`lumotlar to`liq kiritilmadi!!!'
                }
              />
            </Main>
          </div>
        )
      }
    </Container>
  );
};

export default AddTeacher;
