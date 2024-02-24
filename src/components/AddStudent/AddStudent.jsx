import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import NumericInput from 'material-ui-numeric-input';
import Skeleton from '@mui/material/Skeleton';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import CloseIcon from '@mui/icons-material/Close';
import Modal from '@mui/material/Modal';
import FormControlLabel from '@mui/material/FormControlLabel';
import Autocomplete from '@mui/material/Autocomplete';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { IMaskInput } from 'react-imask';
import Snackbar from '../Snackbar/Snackbar';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../index';
import http from '../../http/index';

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
  .helperText {
    margin-top: 3px;
    margin-left: 14px;
    font-size: 0.8rem;
    color: #67677f;
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

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: 'none',
  borderRadius: '6px',
  boxShadow: 24,
  p: 4,
};

TextMaskCustom.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const AddStudent = () => {
  const { user } = useContext(Context);
  const [inError, setInError] = useState(false);
  const [open, setOpen] = useState(false);
  const [inDisebled, setInDisebled] = useState(true);
  const [gender, setGender] = useState('');
  const [firstname, setFirstname] = useState('');
  const [birthday, setBirthday] = useState('');
  const [lastname, setLastname] = useState('');
  const [fathername, setFathername] = useState('');
  const [address, setAddress] = useState('');
  const [studentName, setStudentName] = useState('');
  const [fromPending, setFromPending] = useState([]);
  const [groupOne, setGroupOne] = useState([]);
  const [skeletonTime, setSkeletonTime] = useState(true);
  const [groupName, setGroupName] = useState('');
  const [classValue, setClassValue] = useState('');
  const [payModal, setPayModal] = useState(false);
  const [testLesson, setTestLesson] = useState(false);
  const [padding, setPadding] = useState([]);
  let data = window.location.href.split('/');
  const navigate = useNavigate();
  const [phoneFath, setPhoneFath] = useState({
    textmask: '+998',
  });
  const [phoneMoth, setPhoneMoth] = useState({
    textmask: '+998',
  });

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  useEffect(() => {
    http
      .get(
        import.meta.env.VITE_API_URL +
        'api/student_pending/all/list/get'
      )
      .then((r) => {
        setPadding(r.data.studentList);
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

  useEffect(() => {
    http
      .get(import.meta.env.VITE_API_URL + `api/group/get/one/${data[4]}`)
      .then((r) => {
        setGroupName(r.data.month_payment);
        setGroupOne(r.data);
        setSkeletonTime(false);
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

  const changeFromPending = (e, values) => {
    setFromPending({
      studentPendingId: values && values.id,
      group_id: data[4]
    });
    setStudentName(values && values.name);
  };

  const payMonthAdd = () => {
    if (inDisebled && fromPending.studentPendingId) {
      setInError(true);
      setSkeletonTime(true);
      setOpen(true);
      http
        .post(import.meta.env.VITE_API_URL + 'api/student/add', fromPending)
        .then((res) => {
          http
            .post(import.meta.env.VITE_API_URL + 'api/group-students/add', {
              student_id: res.data.studentOne.id,
              group_id: data[4],
              summa: groupName ? groupName : 0,
              status: testLesson
            })
            .then(() => {
              navigate(`/group-one/${data[4]}`);
              setSkeletonTime(false);
            })
            .catch((error) => {
              if (
                error.response.data.message ==
                'ro\'yxattan o\'tmagan foydalanuvchi!'
              ) {
                user.setIsAuth(false);
                localStorage.clear();
                navigate('/');
              } else {
                console.log(error);
              }
            });
        })
        .catch((error) => {
          if (
            error.response.data.message ==
            'ro\'yxattan o\'tmagan foydalanuvchi!'
          ) {
            user.setIsAuth(false);
            localStorage.clear();
            navigate('/');
          } else {
            console.log(error);
          }
        });
    } else {
      if (
        firstname &&
        gender &&
        birthday &&
        lastname &&
        address &&
        data[4] &&
        phoneFath.textmask.length == 19
      ) {
        setInError(true);
        setOpen(true);
        setSkeletonTime(true);
        http
          .post(import.meta.env.VITE_API_URL + 'api/student/add', {
            firstname: firstname,
            gender: gender,
            birthday: birthday,
            lastname: lastname,
            fathername: fathername ? fathername : ' ',
            address: address,
            fatherPhone: phoneFath.textmask,
            motherPhone: phoneMoth.textmask.length == 19 ? phoneMoth.textmask : ' ',
            classStudentdent: classValue ? classValue : ' ',
            group_id: data[4],
          })
          .then((res) => {
            http
              .post(import.meta.env.VITE_API_URL + 'api/group-students/add', {
                student_id: res.data.student.id,
                group_id: data[4],
                summa: groupName ? groupName : groupName == null ? 0 : 0,
                status: testLesson
              })
              .then(() => {
                navigate(`/group-one/${data[4]}`);
              })
              .catch((error) => {
                if (
                  error.response.data.message ==
                  'ro\'yxattan o\'tmagan foydalanuvchi!'
                ) {
                  user.setIsAuth(false);
                  localStorage.clear();
                  navigate('/');
                } else {
                  console.log(error);
                }
              });
          })
          .catch((error) => {
            if (
              error.response.data.message ==
              'ro\'yxattan o\'tmagan foydalanuvchi!'
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
    }
  };

  console.log(440, groupName);

  const studentAdd = () => {
    if (inDisebled && fromPending.studentPendingId) {
      setPayModal(true);
    } else {
      if (
        firstname && !/^\s*$/.test(firstname) &&
        gender &&
        birthday &&
        lastname && !/^\s*$/.test(lastname) &&
        address && !/^\s*$/.test(address) &&
        data[4] &&
        phoneFath.textmask.length == 19
      ) {
        setStudentName(firstname + ' ' + lastname);
        setPayModal(true);
      } else {
        setInError(false);
        setOpen(true);
      }
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

  const radioDiseblend = (e) => {
    const { value } = e.target;
    if (value == 'female') {
      setInDisebled(true);
    } else if (value == 'male') {
      // setFromPending([]);
      setInDisebled(false);
    }
  };

  const handleName = (event) => {
    setGroupName(event.target.value);
  };

  const closeAndSave = () => {
    setPayModal(false);
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
                onClick={() => {
                  navigate(`/group-one/${data[4]}`);
                }}
                className="fa-solid exit fa-xmark"
              ></i>
            </div>
          </Header>
          <hr />
          <Main>
            <FormControl fullWidth>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="female"
                name="radio-buttons-group"
              >
                <FormControlLabel
                  value="female"
                  onChange={(e) => {
                    radioDiseblend(e);
                  }}
                  control={<Radio />}
                  label={`Guruhlanmagan o'quvchilardan ${groupOne && groupOne.name
                    } guruhiga qo'shish`}
                />

                <Forma>
                  <Autocomplete
                    fullWidth
                    disablePortal={inDisebled ? true : false}
                    disabled={inDisebled ? false : true}
                    //   value = {fromPending}
                    id="combo-box-demo"
                    options={
                      padding &&
                      padding.map((option) => {
                        if (option) {
                          return {
                            name: option.name,
                            id: option.id,
                          };
                        }
                      })
                    }
                    getOptionLabel={(option) => {
                      if (option) {
                        return option.name;
                      }
                    }}
                    renderOption={(props, option) => {
                      return (
                        <li {...props} key={option.id}>
                          {option.name}
                        </li>
                      );
                    }}
                    onChange={changeFromPending}
                    renderInput={(params) => {
                      return (
                        <TextField {...params} label="O'quvchini tanlang..." />

                      );
                    }
                    }
                  />
                </Forma>

                <Box sx={{ width: '100%', pt: 4 }}>
                  <FormControlLabel
                    value="male"
                    onChange={(e) => radioDiseblend(e)}
                    control={<Radio />}
                    label={`Yangi o'quvchini  ${groupOne && groupOne.name
                      } guruhiga qo'shish`}
                  />
                </Box>

                {inDisebled ? (
                  <div>
                    <Forma>
                      <Box sx={{ width: '100%', pr: 3 }}>
                        <TextField
                          fullWidth
                          disabled
                          label="Ismni kiriting..."
                          id="outlined-size-large"
                          size="large"
                          type={'search'}
                        />
                      </Box>

                      <Box sx={{ width: '100%', px: 3 }}>
                        <TextField
                          fullWidth
                          disabled
                          label="Familyani kiriting..."
                          id="outlined-size-large"
                          size="large"
                          type={'search'}
                        />
                      </Box>

                      <Box sx={{ width: '100%', pl: 3 }}>
                        <TextField
                          fullWidth
                          disabled
                          label="Otasini ismini kiriting..."
                          id="outlined-size-large"
                          size="large"
                          type={'search'}
                        />
                      </Box>
                    </Forma>

                    <Forma>
                      <Box sx={{ width: '100%', pr: 3 }}>
                        <FormControl fullWidth>
                          <InputLabel disabled id="demo-simple-select-label">
                            Jinsini tanlang...
                          </InputLabel>
                          <Select
                            disabled
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
                          disabled
                          className="databirthday"
                          id="date"
                          label="Tug'ilgan kunni kiriting..."
                          type="date"
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Box>
                      <Box sx={{ width: '100%', pl: 3 }}>
                        <TextField
                          fullWidth
                          disabled
                          label="Manzilni kiriting..."
                          id="outlined-size-large"
                          size="large"
                          type={'search'}
                        />
                      </Box>
                    </Forma>

                    <Forma>
                      <Box sx={{ width: '33%', pr: 3 }}>
                        <TextField
                          disabled
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
                          disabled
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
                      <Box sx={{ width: '33%', pl: 3.5 }}>
                        <FormControl fullWidth>
                          <InputLabel disabled id="demo-simple-select-label">
                            O&apos;quvchi sinfini tanlang
                          </InputLabel>
                          <Select
                            disabled
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
                  </div>
                ) : (
                  <>
                    <Forma>
                      <Box sx={{ width: '100%', pr: 3 }}>
                        <TextField
                          fullWidth
                          label="Ismni kiriting..."
                          id="outlined-size-large"
                          size="large"
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
                      <Box sx={{ width: '32%', pl: 3 }}>
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
                      <Box sx={{ width: '35%', pl: 6 }}>
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
                  </>
                )}
              </RadioGroup>
            </FormControl>
            <br />
            <Modal open={payModal}>
              <Box sx={style}>
                <CloseIcon
                  style={{
                    position: 'absolute',
                    right: '2%',
                    top: '3%',
                    cursor: 'pointer',
                  }}
                  onClick={closeAndSave}
                />
                <div
                  style={{
                    position: 'fixed',
                    width: '100%',
                    height: '7rem',
                    left: 0,
                    borderTopLeftRadius: '6px',
                    borderTopRightRadius: '6px',
                    zIndex: '-1',
                    paddingTop: '20px',
                    paddingBottom: '20px',
                    paddingLeft: '30px',
                    paddingRight: '30px',
                    top: 0,
                    background: '#FDC600',
                  }}
                >
                  <h2 style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>{studentName}</h2>
                  <p>
                    ushbu o&apos;quvchi uchun to&apos;lov summasini belgilash
                  </p>
                </div>

                <Box sx={{ width: '100%', mt: 13 }}>
                  <NumericInput
                    fullWidth
                    precision={''}
                    decimalChar=","
                    thousandChar="."
                    label="To'lov summasi"
                    value={groupName}
                    onChange={handleName}
                    variant="outlined"
                    inputProps={{
                      maxLength: 8,
                    }}
                  />
                </Box>
                <Box sx={{ width: '100%', mt: 2 }}>
                  <FormControlLabel value={testLesson} onChange={() => setTestLesson(!testLesson)} control={<Checkbox />} label="Ushbu o'quvchini sinov darsiga qo'shish" />
                </Box>
                <Button
                  sx={{ mt: 3, pt: 1, pb: 1 }}
                  fullWidth
                  className="buy_btn_modal"
                  variant="contained"
                  onClick={payMonthAdd}
                >
                  Saqlash
                </Button>
              </Box>
            </Modal>
            <button
              onClick={() => {
                studentAdd();
              }}
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
      )
      }
    </Container >
  );
};

export default AddStudent;
