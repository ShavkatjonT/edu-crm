import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import { TextField } from '@mui/material';
import NumericInput from 'material-ui-numeric-input';
import Box from '@mui/material/Box';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import Skeleton from '@mui/material/Skeleton';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Link, useNavigate } from 'react-router-dom';
import Snackbar from '../Snackbar/Snackbar';
import PropTypes from 'prop-types';
import { IMaskInput } from 'react-imask';
import { Context } from '../../index';
import http from '../../http/index';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
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
    margin-top: 1.2rem;
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

const Btnadd = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;
const Forma = styled.div`
  padding-top: 1.5rem;
  width: 100%;
  display: flex;
  align-items: center;
  .weekText {
    font-weight: 400;
    font-size: 0.98rem;
    line-height: 1.4375em;
    letter-spacing: 0.00938em;
    color: #67677f;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    margin-left: 12px;
    margin-bottom: 10px;
  }
  //justify-content: space-between;
`;
const TextMaskCustom = React.forwardRef(function TextMaskCustom(props, ref) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="000"
      definitions={{
        '#': /[0-9]/,
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

const AddGroups = () => {
  const { user } = useContext(Context);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState('');
  const [sale, setSale] = useState({
    textmask: '',
  });
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedTimeEnd, setSelectedTimeEnd] = useState('');
  const [teachId, setTeachId] = useState('');
  const [roomValue, setRoomValue] = useState('');
  const [payment, setPayment] = useState('');
  const [skeletonTime, setSkeletonTime] = useState(false);
  const [inError, setInError] = useState(false);
  const [name, setName] = useState('');
  const [selectedDays, setSelectedDays] = useState([]);
  const [roomsData, setRoomsData] = useState([]);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [openErrorTimeSnackbar, setOpenErrorTimeSnackbar] = useState(false);
  const [openLinkState, setOpenLinkState] = useState(false);
  const [daysOfWeekSecond, setDaysOfWeekSecond] = useState([
    { name: 'Dushanba', selected: false },
    { name: 'Seshanba', selected: false },
    { name: 'Chorshanba', selected: false },
    { name: 'Payshanba', selected: false },
    { name: 'Juma', selected: false },
    { name: 'Shanba', selected: false },
    { name: 'Yakshanba', selected: false },
  ]);

  const [selectedRows, setSelectedRows] = useState([]);

  const [rooms, setRooms] = useState(Array(daysOfWeekSecond.length).fill(''));
  const [startTimes, setStartTimes] = useState(
    Array(daysOfWeekSecond.length).fill('')
  );
  const [endTimes, setEndTimes] = useState(
    Array(daysOfWeekSecond.length).fill('')
  );

  useEffect(() => {
    http
      .get(import.meta.env.VITE_API_URL + 'api/teacher/label/get')
      .then((r) => {
        setName(r.data);
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
    http
      .get(import.meta.env.VITE_API_URL + 'api/rooms/get')
      .then((res) => {
        setRoomsData(res.data);
        setSkeletonTime(false);
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
  }, []);

  const handleDayClick = (value) => {
    const dayIndex = selectedDays.indexOf(value);
    const newSelectedDays = [...selectedDays];

    if (dayIndex === -1) {
      newSelectedDays.push(value);
    } else {
      newSelectedDays.splice(dayIndex, 1);
    }

    setSelectedDays(newSelectedDays);
  };

  const daysOfWeek = [
    { label: 'Dush', value: 1 },
    { label: 'Sesh', value: 2 },
    { label: 'Chor', value: 3 },
    { label: 'Pay', value: 4 },
    { label: 'Jum', value: 5 },
    { label: 'Shan', value: 6 },
    { label: 'Yak', value: 7 },
  ];

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const handleCloseError = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenErrorSnackbar(false);
  };

  const handleCloseErrorTime = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenErrorTimeSnackbar(false);
  };

  const min = 0;
  const max = 10000000;

  const handleChange = (event) => {
    setTeachId(event.target.value);
  };
  const handleChangeRoom = (event) => {
    setRoomValue(event.target.value);
  };

  const handleName = (event) => {
    setGroupName(event.target.value);
  };

  const inputSale = (event) => {
    setSale({
      [event.target.name]: event.target.value,
    });
  };

  const paymentFun = (e) => {
    let paymetValue = Number(parseInt(e.target.value && e.target.value, 10));
    if (paymetValue && paymetValue > max) paymetValue = max;
    if (paymetValue && paymetValue < min) paymetValue = min;
    setPayment(paymetValue);
  };

  const handleTimeChange = (newTime) => {
    setSelectedTime(newTime.target.value);
  };
  const handleTimeChangeTimeEnd = (newTime) => {
    setSelectedTimeEnd(newTime.target.value);
  };

  const changeLinkState = () => {
    setOpenLinkState(!openLinkState);
    setSelectedRows([]);
    setDaysOfWeekSecond([
      { name: 'Dushanba', selected: false },
      { name: 'Seshanba', selected: false },
      { name: 'Chorshanba', selected: false },
      { name: 'Payshanba', selected: false },
      { name: 'Juma', selected: false },
      { name: 'Shanba', selected: false },
      { name: 'Yakshanba', selected: false },
    ]);
    setRooms(Array(daysOfWeekSecond.length).fill(''));
    setStartTimes(Array(daysOfWeekSecond.length).fill(''));
    setEndTimes(Array(daysOfWeekSecond.length).fill(''));
    if (selectedRows.length > 0) {
      setSelectedTime('');
      setSelectedTimeEnd('');
      setRoomValue('');
      setSelectedDays([]);
    }
  };

  const handleDayOfWeekChange = (index) => {
    const updatedDaysOfWeek = [...daysOfWeekSecond];
    updatedDaysOfWeek[index].selected = !updatedDaysOfWeek[index].selected;
    setDaysOfWeekSecond(updatedDaysOfWeek);
  };

  let isVali = false;

  useEffect(() => {
    const updatedSelectedRows = [];
    daysOfWeekSecond.forEach((day, index) => {
      if (day.selected) {
        updatedSelectedRows.push({
          room_id: rooms[index],
          week_day: index + 1,
          time: startTimes[index] + '-' + endTimes[index],
        });
      } else {
        isVali = false;
      }
    });
    setSelectedRows(updatedSelectedRows);
  }, [daysOfWeekSecond, rooms, startTimes, endTimes]);

  const validateCheck = () => {
    selectedRows.forEach((e) => {
      const filterTime = e.time;
      const splitFilter = filterTime.split('-');
      if (e.room_id && e.week_day && splitFilter[0] && splitFilter[1]) {
        isVali = true;
      } else {
        isVali = false;
      }
    });
    return isVali;
  };


  const groupAdd = () => {
    if (
      groupName &&
      !/^\s*$/.test(groupName) &&
      teachId &&
      payment &&
      sale.textmask &&
      sale.textmask >= 0 &&
      sale.textmask <= 100 &&
      selectedTime &&
      selectedTimeEnd &&
      selectedDays.length > 0 &&
      roomValue
    ) {
      if (selectedTime !== selectedTimeEnd && selectedTime < selectedTimeEnd) {
        setSkeletonTime(true);
        http
          .post(import.meta.env.VITE_API_URL + 'api/group/add', {
            name: groupName,
            teacher_id: teachId,
            month_payment: Number(payment),
            sale: Number(sale.textmask),
            time: selectedTime + '-' + selectedTimeEnd,
            day: selectedDays,
            room_id: roomValue,
          })
          .then((res) => {
            http
              .post(import.meta.env.VITE_API_URL + 'api/teacher-groups/add', {
                teacher_id: teachId,
                group_id: res.data.group.id,
              })
              .then(() => {
                navigate('/groups');
                setInError(true);
                setOpen(true);
              })
              .catch((err) => {
                console.log(112, err);
              });
          })
          .catch((error) => {
            if (
              error.response.data.message ==
              'At this time there is a lesson in the room'
            ) {
              setSkeletonTime(false);
              setOpenErrorSnackbar(true);
            }
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
        setOpenErrorTimeSnackbar(true);
      }
    } else {
      setInError(false);
      setOpen(true);
    }
  };

  function validateTime(array) {
    for (let i = 0; i < array.length; i++) {
      const { time } = array[i];
      const [startTime, endTime] = time.split('-');

      if (startTime >= endTime) {
        return false; // start time is not less than end time
      }

      if (startTime === endTime) {
        return false; // start time is equal to end time
      }
    }

    return true; 
  }
  const groupAddition = () => {
    const isValid = validateTime(selectedRows);
    const isCheckForm = validateCheck();
    if (
      groupName &&
      !/^\s*$/.test(groupName) &&
      teachId &&
      payment &&
      sale.textmask &&
      sale.textmask >= 0 &&
      sale.textmask <= 100 &&
      isCheckForm
    ) {
      if (isValid) {
        setSkeletonTime(true);
        http
          .post(import.meta.env.VITE_API_URL + 'api/group/lesson-add', {
            name: groupName,
            teacher_id: teachId,
            month_payment: Number(payment),
            sale: Number(sale.textmask),
            week_data: selectedRows,
          })
          .then((res) => {
            http
              .post(import.meta.env.VITE_API_URL + 'api/teacher-groups/add', {
                teacher_id: teachId,
                group_id: res.data.group.id,
              })
              .then(() => {
                navigate('/groups');
                setInError(true);
                setOpen(true);
              })
              .catch((err) => {
                console.log(112, err);
              });
          })
          .catch((error) => {
            if (
              error.response.data.message ==
              'At this time there is a lesson in the room'
            ) {
              setSkeletonTime(false);
              setOpenErrorSnackbar(true);
            }
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
        setOpenErrorTimeSnackbar(true);
      }
    } else {
      setInError(false);
      setOpen(true);
    }
  };

  return (
    <Container>
      {skeletonTime ? (
        <ContentSkeleton>
          <Box sx={{ width: '100%' }}>
            <Skeleton width="40%" height="2rem" />
            <Skeleton width="50%" height="2rem" />
            <Skeleton width="85%" height="2rem" />
            <Skeleton width="100%" height="2rem" />
          </Box>
        </ContentSkeleton>
      ) : (
        <div>
          <Header>
            <div>
              <h3>Guruh qo&apos;shish</h3>
            </div>
            <div>
              <i
                className="fa-solid exit fa-xmark"
                onClick={() => {
                  navigate('/groups');
                }}
              ></i>
            </div>
          </Header>
          <hr />
          <Main>
            <Forma>
              <Box sx={{ width: '100%', pr: 5 }}>
                <TextField
                  fullWidth
                  label="Guruh nomini kiriting..."
                  id="outlined-size-large"
                  size="large"
                  value={groupName}
                  onChange={handleName}
                  type={'search'}
                />
              </Box>

              <Box sx={{ width: '100%', pr: 5 }}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Guruhga o`qituvchi biriktirish...
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={teachId}
                    label="Guruhga o`qituvchi biriktirish..."
                    onChange={handleChange}
                  >
                    {name &&
                      name.map((name) => (
                        <MenuItem key={name.id} value={name.id}>
                          {name.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Box>
            </Forma>
            <Forma>
              <Box sx={{ width: '100%', pr: 5 }}>
                <NumericInput
                  fullWidth
                  precision={''}
                  decimalChar=","
                  thousandChar="."
                  label="Oylik to'lovni kiriting..."
                  value={payment}
                  onChange={paymentFun}
                  variant="outlined"
                  inputProps={{
                    maxLength: 8,
                    minLength: 0,
                  }}
                />
              </Box>
              <Box sx={{ width: '100%', pr: 5 }}>
                <TextField
                  fullWidth
                  label="Kelishilgan % ni kiriting...(0%-100%)"
                  value={sale.textmask}
                  onChange={inputSale}
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
            </Forma>
            <Forma style={{ display: openLinkState ? 'none' : 'flex' }}>
              <Box sx={{ width: '100%', pr: 5, pt: 1 }}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Xonani tanlang
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={roomValue}
                    label="Xonani tanlang"
                    onChange={handleChangeRoom}
                  >
                    {roomsData &&
                      roomsData.map((name) => (
                        <MenuItem key={name.id} value={name.id}>
                          {name.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Box>
              <Box
                sx={{
                  width: '100%',
                  pr: 5,
                  display: 'flex',
                  justifyContent: 'space-between',
                  mt: 1,
                }}
              >
                <Box sx={{ width: '48%' }}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Darsning boshlanish vaqti
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={selectedTime}
                      label="Darsning boshlanish vaqti"
                      onChange={handleTimeChange}
                    >
                      <MenuItem value={'05:00'}>05:00</MenuItem>
                      <MenuItem value={'05:30'}>05:30</MenuItem>
                      <MenuItem value={'06:00'}>06:00</MenuItem>
                      <MenuItem value={'06:30'}>06:30</MenuItem>
                      <MenuItem value={'07:00'}>07:00</MenuItem>
                      <MenuItem value={'07:30'}>07:30</MenuItem>
                      <MenuItem value={'08:00'}>08:00</MenuItem>
                      <MenuItem value={'08:30'}>08:30</MenuItem>
                      <MenuItem value={'09:00'}>09:00</MenuItem>
                      <MenuItem value={'09:30'}>09:30</MenuItem>
                      <MenuItem value={'10:00'}>10:00</MenuItem>
                      <MenuItem value={'10:30'}>10:30</MenuItem>
                      <MenuItem value={'11:00'}>11:00</MenuItem>
                      <MenuItem value={'11:30'}>11:30</MenuItem>
                      <MenuItem value={'12:00'}>12:00</MenuItem>
                      <MenuItem value={'12:30'}>12:30</MenuItem>
                      <MenuItem value={'13:00'}>13:00</MenuItem>
                      <MenuItem value={'13:30'}>13:30</MenuItem>
                      <MenuItem value={'14:00'}>14:00</MenuItem>
                      <MenuItem value={'14:30'}>14:30</MenuItem>
                      <MenuItem value={'15:00'}>15:00</MenuItem>
                      <MenuItem value={'15:30'}>15:30</MenuItem>
                      <MenuItem value={'16:00'}>16:00</MenuItem>
                      <MenuItem value={'16:30'}>16:30</MenuItem>
                      <MenuItem value={'17:00'}>17:00</MenuItem>
                      <MenuItem value={'17:30'}>17:30</MenuItem>
                      <MenuItem value={'18:00'}>18:00</MenuItem>
                      <MenuItem value={'18:30'}>18:30</MenuItem>
                      <MenuItem value={'19:00'}>19:00</MenuItem>
                      <MenuItem value={'19:30'}>19:30</MenuItem>
                      <MenuItem value={'20:00'}>20:00</MenuItem>
                      <MenuItem value={'20:30'}>20:30</MenuItem>
                      <MenuItem value={'21:00'}>21:00</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Box sx={{ width: '48%' }}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Darsning tugash vaqti
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={selectedTimeEnd}
                      label="Darsning tugash vaqti"
                      onChange={handleTimeChangeTimeEnd}
                    >
                      <MenuItem value={'05:00'}>05:00</MenuItem>
                      <MenuItem value={'05:30'}>05:30</MenuItem>
                      <MenuItem value={'06:00'}>06:00</MenuItem>
                      <MenuItem value={'06:30'}>06:30</MenuItem>
                      <MenuItem value={'07:00'}>07:00</MenuItem>
                      <MenuItem value={'07:30'}>07:30</MenuItem>
                      <MenuItem value={'08:00'}>08:00</MenuItem>
                      <MenuItem value={'08:30'}>08:30</MenuItem>
                      <MenuItem value={'09:00'}>09:00</MenuItem>
                      <MenuItem value={'09:30'}>09:30</MenuItem>
                      <MenuItem value={'10:00'}>10:00</MenuItem>
                      <MenuItem value={'10:30'}>10:30</MenuItem>
                      <MenuItem value={'11:00'}>11:00</MenuItem>
                      <MenuItem value={'11:30'}>11:30</MenuItem>
                      <MenuItem value={'12:00'}>12:00</MenuItem>
                      <MenuItem value={'12:30'}>12:30</MenuItem>
                      <MenuItem value={'13:00'}>13:00</MenuItem>
                      <MenuItem value={'13:30'}>13:30</MenuItem>
                      <MenuItem value={'14:00'}>14:00</MenuItem>
                      <MenuItem value={'14:30'}>14:30</MenuItem>
                      <MenuItem value={'15:00'}>15:00</MenuItem>
                      <MenuItem value={'15:30'}>15:30</MenuItem>
                      <MenuItem value={'16:00'}>16:00</MenuItem>
                      <MenuItem value={'16:30'}>16:30</MenuItem>
                      <MenuItem value={'17:00'}>17:00</MenuItem>
                      <MenuItem value={'17:30'}>17:30</MenuItem>
                      <MenuItem value={'18:00'}>18:00</MenuItem>
                      <MenuItem value={'18:30'}>18:30</MenuItem>
                      <MenuItem value={'19:00'}>19:00</MenuItem>
                      <MenuItem value={'19:30'}>19:30</MenuItem>
                      <MenuItem value={'20:00'}>20:00</MenuItem>
                      <MenuItem value={'20:30'}>20:30</MenuItem>
                      <MenuItem value={'21:00'}>21:00</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            </Forma>
            <Forma style={{ display: openLinkState ? 'none' : 'flex' }}>
              <Box sx={{ width: '50%', pr: 5 }}>
                <p className="weekText">Hafta kuni belgilang:</p>
                <ButtonGroup
                  sx={{}}
                  fullWidth
                  color="primary"
                  aria-label="outlined primary button group"
                >
                  {daysOfWeek.map((day) => (
                    <Button
                      key={day.value}
                      onClick={() => handleDayClick(day.value)}
                      variant={
                        selectedDays.includes(day.value)
                          ? 'contained'
                          : 'outlined'
                      }
                    >
                      {day.label}
                    </Button>
                  ))}
                </ButtonGroup>
              </Box>
            </Forma>
            <Forma style={{ display: openLinkState ? 'flex' : 'none' }}>
              <Box sx={{ width: '100%' }}>
                {daysOfWeekSecond.map((day, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      paddingBottom: '1.5rem',
                    }}
                  >
                    <Box
                      sx={{
                        width: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        pr: 5,
                      }}
                    >
                      <div style={{ width: '50%' }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={day.selected}
                              onChange={() => handleDayOfWeekChange(index)}
                            />
                          }
                          label={day.name}
                        />
                      </div>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          Xonani tanlang
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          disabled={!day.selected}
                          value={rooms[index]}
                          label="Xonani tanlang"
                          onChange={(e) => {
                            const updatedRooms = [...rooms];
                            updatedRooms[index] = e.target.value;
                            setRooms(updatedRooms);
                          }}
                        >
                          {roomsData &&
                            roomsData.map((name) => (
                              <MenuItem key={name.id} value={name.id}>
                                {name.name}
                              </MenuItem>
                            ))}
                        </Select>

                      </FormControl>
                    </Box>
                    <Box
                      sx={{
                        width: '50%',
                        pr: 5,
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Box sx={{ width: '48%' }}>
                        <FormControl fullWidth disabled={!day.selected}>
                          <InputLabel id="demo-simple-select-label">
                            Darsning boshlanish vaqti
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={startTimes[index]}
                            onChange={(e) => {
                              const updatedStartTimes = [...startTimes];
                              updatedStartTimes[index] = e.target.value;
                              setStartTimes(updatedStartTimes);
                            }}
                            label="Darsning boshlanish vaqti"
                          >
                            <MenuItem value={'05:00'}>05:00</MenuItem>
                            <MenuItem value={'05:30'}>05:30</MenuItem>
                            <MenuItem value={'06:00'}>06:00</MenuItem>
                            <MenuItem value={'06:30'}>06:30</MenuItem>
                            <MenuItem value={'07:00'}>07:00</MenuItem>
                            <MenuItem value={'07:30'}>07:30</MenuItem>
                            <MenuItem value={'08:00'}>08:00</MenuItem>
                            <MenuItem value={'08:30'}>08:30</MenuItem>
                            <MenuItem value={'09:00'}>09:00</MenuItem>
                            <MenuItem value={'09:30'}>09:30</MenuItem>
                            <MenuItem value={'10:00'}>10:00</MenuItem>
                            <MenuItem value={'10:30'}>10:30</MenuItem>
                            <MenuItem value={'11:00'}>11:00</MenuItem>
                            <MenuItem value={'11:30'}>11:30</MenuItem>
                            <MenuItem value={'12:00'}>12:00</MenuItem>
                            <MenuItem value={'12:30'}>12:30</MenuItem>
                            <MenuItem value={'13:00'}>13:00</MenuItem>
                            <MenuItem value={'13:30'}>13:30</MenuItem>
                            <MenuItem value={'14:00'}>14:00</MenuItem>
                            <MenuItem value={'14:30'}>14:30</MenuItem>
                            <MenuItem value={'15:00'}>15:00</MenuItem>
                            <MenuItem value={'15:30'}>15:30</MenuItem>
                            <MenuItem value={'16:00'}>16:00</MenuItem>
                            <MenuItem value={'16:30'}>16:30</MenuItem>
                            <MenuItem value={'17:00'}>17:00</MenuItem>
                            <MenuItem value={'17:30'}>17:30</MenuItem>
                            <MenuItem value={'18:00'}>18:00</MenuItem>
                            <MenuItem value={'18:30'}>18:30</MenuItem>
                            <MenuItem value={'19:00'}>19:00</MenuItem>
                            <MenuItem value={'19:30'}>19:30</MenuItem>
                            <MenuItem value={'20:00'}>20:00</MenuItem>
                            <MenuItem value={'20:30'}>20:30</MenuItem>
                            <MenuItem value={'21:00'}>21:00</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                      <Box sx={{ width: '48%' }}>
                        <FormControl fullWidth disabled={!day.selected}>
                          <InputLabel id="demo-simple-select-label">
                            Darsning tugash vaqti
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={endTimes[index]}
                            onChange={(e) => {
                              const updatedEndTimes = [...endTimes];
                              updatedEndTimes[index] = e.target.value;
                              setEndTimes(updatedEndTimes);
                            }}
                            label="Darsning tugash vaqti"
                          >
                            <MenuItem value={'05:00'}>05:00</MenuItem>
                            <MenuItem value={'05:30'}>05:30</MenuItem>
                            <MenuItem value={'06:00'}>06:00</MenuItem>
                            <MenuItem value={'06:30'}>06:30</MenuItem>
                            <MenuItem value={'07:00'}>07:00</MenuItem>
                            <MenuItem value={'07:30'}>07:30</MenuItem>
                            <MenuItem value={'08:00'}>08:00</MenuItem>
                            <MenuItem value={'08:30'}>08:30</MenuItem>
                            <MenuItem value={'09:00'}>09:00</MenuItem>
                            <MenuItem value={'09:30'}>09:30</MenuItem>
                            <MenuItem value={'10:00'}>10:00</MenuItem>
                            <MenuItem value={'10:30'}>10:30</MenuItem>
                            <MenuItem value={'11:00'}>11:00</MenuItem>
                            <MenuItem value={'11:30'}>11:30</MenuItem>
                            <MenuItem value={'12:00'}>12:00</MenuItem>
                            <MenuItem value={'12:30'}>12:30</MenuItem>
                            <MenuItem value={'13:00'}>13:00</MenuItem>
                            <MenuItem value={'13:30'}>13:30</MenuItem>
                            <MenuItem value={'14:00'}>14:00</MenuItem>
                            <MenuItem value={'14:30'}>14:30</MenuItem>
                            <MenuItem value={'15:00'}>15:00</MenuItem>
                            <MenuItem value={'15:30'}>15:30</MenuItem>
                            <MenuItem value={'16:00'}>16:00</MenuItem>
                            <MenuItem value={'16:30'}>16:30</MenuItem>
                            <MenuItem value={'17:00'}>17:00</MenuItem>
                            <MenuItem value={'17:30'}>17:30</MenuItem>
                            <MenuItem value={'18:00'}>18:00</MenuItem>
                            <MenuItem value={'18:30'}>18:30</MenuItem>
                            <MenuItem value={'19:00'}>19:00</MenuItem>
                            <MenuItem value={'19:30'}>19:30</MenuItem>
                            <MenuItem value={'20:00'}>20:00</MenuItem>
                            <MenuItem value={'20:30'}>20:30</MenuItem>
                            <MenuItem value={'21:00'}>21:00</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    </Box>
                  </div>
                ))}
              </Box>
            </Forma>
            <Forma>
              <Link
                style={{ textDecoration: 'underline' }}
                onClick={changeLinkState}
              >
                {openLinkState ? 'Yopish' : 'Batafsil'}
              </Link>
            </Forma>

            <br />
            <Btnadd>
              <Box sx={{ pr: 5 }}>
                <Button
                  variant="contained"
                  size="large"
                  className="buy_btn_modal"
                  onClick={() => {
                    openLinkState ? groupAddition() : groupAdd();
                  }}
                >
                  Qo&apos;shish
                </Button>
              </Box>
            </Btnadd>
            <Snackbar
              open={open}
              onClose={handleClose}
              severity={inError ? 'success' : 'error'}
              massage={
                inError
                  ? 'sinf muvaffaqiyatli qo\'shildi'
                  : sale.textmask < 0 || sale.textmask > 100
                    ? 'Foiz 100 va 0 oralig\'da bo\'lsin'
                    : 'Ma`lumotlar to`liq kiritilmadi!!!'
              }
            />
            <Snackbar
              open={openErrorSnackbar}
              onClose={handleCloseError}
              severity={'warning'}
              massage={'Bu vaqtda ushbu xonada dars mavjud'}
            />
            <Snackbar
              open={openErrorTimeSnackbar}
              onClose={handleCloseErrorTime}
              severity={'warning'}
              massage={'Darsning boshlanish va tugash vaqtini to\'g\'ri kiriting'}
            />
          </Main>
        </div>
      )}
    </Container>
  );
};

export default AddGroups;
