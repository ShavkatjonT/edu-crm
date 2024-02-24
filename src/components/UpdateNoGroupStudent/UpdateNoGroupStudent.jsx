import React, { useEffect, useState, useContext } from 'react';
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
import http from '../../http/index';
import { useNavigate } from 'react-router-dom';
import Snackbar from '../Snackbar/Snackbar';
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

function UpdateNoGroupStudent() {
  const { user } = useContext(Context);
  const [gender, setGender] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [fathername, setFathername] = useState('');
  const [birthday, setBirthday] = useState('');
  const [address, setAddress] = useState('');
  const [phoneFath, setPhoneFath] = useState('');
  const [phoneMoth, setPhoneMoth] = useState('');
  const [inError, setInError] = useState(false);
  const [open, setOpen] = useState(false);
  const [skeletonTime, setSkeletonTime] = useState(true);
  let data = window.location.href.split('/');
  const navigate = useNavigate();

  useEffect(() => {
    http
      .get(
        import.meta.env.VITE_API_URL + `api/student_pending/get/one/${data[4]}`
      )
      .then((r) => {
        console.log(128,r.data);
        setSkeletonTime(false);
        setFirstname(r.data.firstname);
        setLastname(r.data.lastname);
        setFathername(r.data.fathername);
        setBirthday(r.data.birthday);
        setAddress(r.data.address);
        setPhoneFath(r.data.fatherPhone);
        setPhoneMoth(r.data.motherPhone);
        setGender(r.data.gender);
      })
      .catch((error) => {
        if (
          error.response.data.message == 'ro\'yxattan o\'tmagan foydalanuvchi!'
        ) {
          user.setIsAuth(false);
          localStorage.clear();
          navigate('/');
        } else if (
         error.response.data.message.original.routine == 'string_to_uuid'
        ) {
          navigate('*');
        } else {
          console.log(error);
        }
      });
  }, []);

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
      birthday &&
      address && !/^\s*$/.test(address) &&
      phoneFath.length == 19
    ) {
      setInError(true);
      setOpen(true);
      setSkeletonTime(true);
      http
        .post(
          import.meta.env.VITE_API_URL + `api/student_pending/put/${data[4]}`,
          {
            firstname: firstname,
            lastname: lastname,
            gender: gender,
            birthday: birthday,
            fathername: fathername ? fathername : ' ',
            address: address,
            fatherPhone: phoneFath,
            motherPhone: phoneMoth.length == 19 ? phoneMoth : ' ',
          }
        )
        .then(() => {
          setSkeletonTime(false);
          navigate(`/not-group-student-page/${data[4]}`);
        })
        .catch((error) => {
          if (
            error.response.data.message == 'ro\'yxattan o\'tmagan foydalanuvchi!'
          ) {
            user.setIsAuth(false);
            localStorage.clear();
            navigate('/');
          } else if (
           error.response.data.message.original.routine == 'string_to_uuid'
          ) {
            navigate('*');
          } else {
            console.log(error);
          }
        });
    } else {
      setInError(false);
      setOpen(true);
    }
  };

  const handleChange = (event) => {
    setGender(event.target.value);
  };

  return (
    <div>
      <Container>
        {
          skeletonTime ? (
            <ContentSkeleton>
          <Box sx={{ width: '100%' }}>
            <Skeleton width="50%" height="2rem" />
            <Skeleton width="70%" height="2rem" />
            <Skeleton width="85%" height="2rem" />
            <Skeleton width="100%" height="2rem" />
          </Box>
        </ContentSkeleton>
          ) : (
            <div>
                <Header>
          <div>
            <h3>O&apos;quvchi ma&apos;lumotlarini tahrirlash</h3>
          </div>
          <div>
            <i onClick={() => {navigate(`/not-group-student-page/${data[4]}`);}} className='fa-solid exit fa-xmark'></i>
          </div>
        </Header>
        <hr />
        <Main>
          <FormControl fullWidth>
            <Forma>
              <Box sx={{ width: '100%', pr: 3 }}>
                <TextField
                  fullWidth
                  label="O'quvchi ismi"
                  id='outlined-size-large'
                  size='large'
                  onChange={(e) => {
                    setFirstname(e.target.value);
                  }}
                  value={firstname}
                />
              </Box>

              <Box sx={{ width: '100%', px: 3 }}>
                <TextField
                  fullWidth
                  label="O'quvchi familiyasi"
                  id='outlined-size-large'
                  onChange={(e) => {
                    setLastname(e.target.value);
                  }}
                  value={lastname}
                  size='large'
                />
              </Box>

              <Box sx={{ width: '100%', pl: 3 }}>
                <TextField
                  fullWidth
                  label='Otasining ismi'
                  id='outlined-size-large'
                  onChange={(e) => {
                    setFathername(e.target.value);
                  }}
                  value={fathername}
                  size='large'
                />
              </Box>
            </Forma>

            <Forma>
              <Box sx={{ width: '100%', pr: 3 }}>
                <FormControl fullWidth>
                  <InputLabel id='demo-simple-select-label'>
                    Jinsini tanlang!
                  </InputLabel>
                  <Select
                    labelId='demo-simple-select-label'
                    id='demo-simple-select'
                    value={gender}
                    label='Jinsini tanlang!'
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
                  label="Tug'ilgan kunni kiriting!"
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
                  label='Manzilni kiriting!'
                  id='outlined-size-large'
                  size='large'
                  onChange={(e) => {
                    setAddress(e.target.value);
                  }}
                  value={address}
                />
              </Box>
            </Forma>

            <Forma>
              <Box sx={{ width: '33%', pr: 3 }}>
                <TextField
                  fullWidth
                  label='Otasining telefon raqami'
                  value={phoneFath}
                  onChange={(e) => {
                    setPhoneFath(e.target.value);
                  }}
                  id='formatted-text-mask-input'
                  InputProps={{
                    inputComponent: TextMaskCustom,
                  }}
                  name='textmask'
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Box>
              <Box sx={{ width: '34%', px: 3 }}>
                <TextField
                  fullWidth
                  label='Onasining telefon raqami'
                  value={phoneMoth}
                  onChange={(e) => {
                    setPhoneMoth(e.target.value);
                  }}
                  id='formatted-text-mask-input'
                  InputProps={{
                    inputComponent: TextMaskCustom,
                  }}
                  name='textmask'
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Box>
            </Forma>
          </FormControl>
          <br />
          <button
            onClick={() => {
              studentAdd();
            }}
            className='btn-add'
          >
            Saqlash
          </button>
          <Snackbar
            open={open}
            onClose={handleClose}
            severity={inError ? 'success' : 'error'}
            massage={
              inError
                ? 'O\'quvchi ma\'lumotlari muvaffaqiyatli o\'zgartirildi'
                : 'Ma`lumotlar to`liq kiritilmadi!!!'
            }
          />
        </Main>
            </div>
          )
        }
      </Container>
    </div>
  );
}

export default UpdateNoGroupStudent;
