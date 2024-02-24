import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import { IMaskInput } from 'react-imask';
import http from '../../http/index';
import { useNavigate } from 'react-router-dom';
import Snackbar from '../Snackbar/Snackbar';
import Skeleton from '@mui/material/Skeleton';
import { Context } from '../../index';

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
  .helperText{
    margin-top: 3px;
    margin-left: 14px;
    font-size: 0.80rem;
    color: #67677F;
    font-family: sans-serif;
    font-weight: 400;
    line-height: 1.66;
    letter-spacing: 0.03333em;
  }
`;

const TextMaskCustom = React.forwardRef(function TextMaskCustom(props, ref) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="+998 (00) 000-00-00"
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

const PendingAddStudent = () => {
  const navigate = useNavigate();
  const { user } = useContext(Context);
  const [gender, setGender] = useState('');
  const [inError, setInError] = useState(false);
  const [open, setOpen] = useState(false);
  const [firstname, setFirstname] = useState('');
  const [birthday, setBirthday] = useState('');
  const [lastname, setLastname] = useState('');
  const [fathername, setFathername] = useState('');
  const [classValue, setClassValue] = useState('');
  const [address, setAddress] = useState('');
  const [skeletonTime, setSkeletonTime] = useState(false);
  const [phoneFath, setPhoneFath] = useState({
    textmask: '+998',
  });
  const [phoneMoth, setPhoneMoth] = useState({
    textmask: '+998',
  });
  const urlID = window.location.href.split('/');

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const studentAdd = () => {
    if (
      firstname && !/^\s*$/.test(firstname) &&
      lastname && !/^\s*$/.test(lastname) &&
      gender && 
      birthday &&
      address && !/^\s*$/.test(address) &&
      phoneFath.textmask.length == 19
    ) {
      setInError(true);
      setOpen(true);
      setSkeletonTime(true);
      http
        .post(import.meta.env.VITE_API_URL + 'api/new-pending-student/add', {
          firstname: firstname,
          gender: gender,
          birthday: birthday,
          lastname: lastname,
          fathername: fathername ? fathername : ' ',
          address: address,
          fatherPhone: phoneFath.textmask,
          motherPhone: phoneMoth.textmask.length == 19 ? phoneMoth.textmask : ' ',
          group_id: urlID[4],
          classStudentdent: classValue ? classValue : ' ',
        })
        .then(() => {
          navigate(`/pending-group-one/${urlID[4]}`);
        })
        .catch((error) => {
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
      setInError(false);
      setOpen(true);
    }
  };
  const fatherPhone = (event) => {
    setPhoneFath({
      [event.target.name]: event.target.value,
    });
  };
  const motherPhone = (event) => {
    setPhoneMoth({
      [event.target.name]: event.target.value,
    });
  };

  const handleChange = (event) => {
    setGender(event.target.value);
  };

  const handleChangeClass = (event) => {
    setClassValue(event.target.value);
  };


  return (
    <Container>
      {skeletonTime ? (
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
              <h3>O&apos;quvchi qo&apos;shish</h3>
            </div>
            <div>
              <i
                className="fa-solid exit fa-xmark"
                onClick={() => {
                  navigate(`/pending-group-one/${urlID[4]}`);
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
                  label="Ismni kiriting..."
                  id="outlined-size-large"
                  size="large"
                  onChange={(e) => setFirstname(e.target.value)}
                  value={firstname}
                  type={'search'}
                />
              </Box>

              <Box sx={{ width: '100%', px: 3 }}>
                <TextField
                  fullWidth
                  label="Familyani kiriting..."
                  id="outlined-size-large"
                  onChange={(e) => {
                    setLastname(e.target.value);
                  }}
                  value={lastname}
                  size="large"
                  type={'search'}
                />
              </Box>

              <Box sx={{ width: '100%', pl: 3 }}>
                <TextField
                  fullWidth
                  label="Otasini ismini kiriting..."
                  id="outlined-size-large"
                  onChange={(e) => {
                    setFathername(e.target.value);
                  }}
                  value={fathername}
                  size="large"
                  type={'search'}
                />
              </Box>
            </Forma>

            <Forma>
              <Box sx={{ width: '100%', pr: 3 }}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Jinsini tanlang...
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={gender}
                    label="Jinsini tanlang..."
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
                  className="databirthday"
                  id="date"
                  label="Tug'ilgan kunni kiriting..."
                  type="date"
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
                  label="Manzilni kiriting..."
                  id="outlined-size-large"
                  size="large"
                  onChange={(e) => {
                    setAddress(e.target.value);
                  }}
                  value={address}
                  type={'search'}
                />
              </Box>
            </Forma>

            <Forma>
              <Box sx={{ width: '33%', pr: 3 }}>
                <TextField
                  fullWidth
                  label="Otasining telefon nomerini kiriting..."
                  value={phoneFath.textmask}
                  onChange={fatherPhone}
                  name="textmask"
                  id="formatted-text-mask-input"
                  InputProps={{
                    inputComponent: TextMaskCustom,
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Box>
              <Box sx={{ width: '34%', px: 3 }}>
                <TextField
                  fullWidth
                  label="Onasining telefon nomerini kiriting..."
                  value={phoneMoth.textmask}
                  onChange={motherPhone}
                  name="textmask"
                  id="formatted-text-mask-input"
                  InputProps={{
                    inputComponent: TextMaskCustom,
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Box>
              <Box sx={{ width: '33%', pl: 3.5}}>
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">
                            O&apos;quvchi sinfini tanlang
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={classValue}
                            label="O'quvchi sinfini tanlang"
                            onChange={handleChangeClass}
                          >
                            <MenuItem value={'1-sinf'}>1-sinf</MenuItem>
                            <MenuItem value={'2-sinf'}>2-sinf</MenuItem>
                            <MenuItem value={'3-sinf'}>3-sinf</MenuItem>
                            <MenuItem value={'4-sinf'}>4-sinf</MenuItem>
                            <MenuItem value={'5-sinf'}>5-sinf</MenuItem>
                            <MenuItem value={'6-sinf'}>6-sinf</MenuItem>
                            <MenuItem value={'7-sinf'}>7-sinf</MenuItem>
                            <MenuItem value={'8-sinf'}>8-sinf</MenuItem>
                            <MenuItem value={'9-sinf'}>9-sinf</MenuItem>
                            <MenuItem value={'10-sinf'}>10-sinf</MenuItem>
                            <MenuItem value={'11-sinf'}>11-sinf</MenuItem>
                            <MenuItem value={'Bitirgan'}>Bitirgan</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
            </Forma>
            <br />
            <button
              onClick={studentAdd}
              className="btn-add"
            >
              Qo&apos;shish
            </button>
            <Snackbar
              open={open}
              onClose={handleClose}
              severity={inError ? 'success' : 'error'}
              massage={
                inError
                  ? 'O\'quvchi muvaffaqiyatli qo\'shildi'
                  : 'Ma`lumotlar to`liq kiritilmadi!!!'
              }
            />
          </Main>
        </div>
      )}
    </Container>
  );
};

export default PendingAddStudent;
