import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import TextField from '@mui/material/TextField';
import http from '../../http/index';
import { useNavigate, Link } from 'react-router-dom';
import ButtonGroup from '@mui/material/ButtonGroup';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Snackbar from '../Snackbar/Snackbar';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import Skeleton from '@mui/material/Skeleton';
import { Context } from '../../index';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import NumericInput from 'material-ui-numeric-input';

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
  padding: 15px 20px;
  display: flex;
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
  margin-top: 1.2rem;
  margin-bottom: 1rem;
  -webkit-justify-content: flex-start;
  justify-content: flex-start;
  padding: 0 30px;
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

const Btnadd = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

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

function UpdateGroups() {
  const { user } = useContext(Context);
  const navigate = useNavigate();
  const [nameGroup, setNameGroup] = useState('');
  const [teacherName, setTeacherName] = useState([]);
  const [sale, setSale] = useState('');
  const [skeletonTime, setSkeletonTime] = useState(true);
  const [teacherId, setTeacherId] = useState('');
  const [payment, setPayment] = useState('0');
  const [inError, setInError] = useState(false);
  const [openCheckModal, setOpenCheckModal] = useState(false);
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [open, setOpen] = useState(false);
  const [roomsData, setRoomsData] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedTimeEnd, setSelectedTimeEnd] = useState('');
  const [roomValue, setRoomValue] = useState('');
  const [weekDaysGet, setWeekDaysGet] = useState('');
  const [startTimeLessonGet, setStartTimeLessonGet] = useState('');
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [openErrorTimeSnackbar, setOpenErrorTimeSnackbar] = useState(false);
  const [openLinkState, setOpenLinkState] = useState(false);
  const [checkPartGet, setCheckPartGet] = useState([]);
  const [daysOfWeekSecond, setDaysOfWeekSecond] = useState([
    { name: 'Dushanba', selected: false, day: 1 },
    { name: 'Seshanba', selected: false, day: 2 },
    { name: 'Chorshanba', selected: false, day: 3 },
    { name: 'Payshanba', selected: false, day: 4 },
    { name: 'Juma', selected: false, day: 5 },
    { name: 'Shanba', selected: false, day: 6 },
    { name: 'Yakshanba', selected: false, day: 7 },
  ]);

  const [selectedRows, setSelectedRows] = useState([]);

  const [rooms, setRooms] = useState(Array(daysOfWeekSecond.length).fill(''));
  const [startTimes, setStartTimes] = useState(
    Array(daysOfWeekSecond.length).fill('')
  );
  const [endTimes, setEndTimes] = useState(
    Array(daysOfWeekSecond.length).fill('')
  );
  let data = window.location.href.split('/');

  useEffect(() => {
    http
      .get(import.meta.env.VITE_API_URL + `api/group/get/one/${data[4]}`)
      .then((res) => {
        console.log(159, res.data);
        setSale(res.data.sale);
        setNameGroup(res.data.name);
        setPayment(res.data.month_payment);
        setTeacherId(res.data.teacher_id);
        setRoomValue(
          res.data.lesson_group ? res.data.lesson_group.room_id : ''
        );
        setWeekDaysGet(
          res.data.lesson_group ? res.data.lesson_group.lesson_day : ''
        );
        setStartTimeLessonGet(
          res.data.lesson_group ? res.data.lesson_group.lesson_time : ''
        );
        setCheckPartGet(
          res.data.groupSchedule.length > 0 ? res.data.groupSchedule : []
        );
        if (res.data.groupSchedule.length > 0) {
          setOpenLinkState(true);
        }else{
          setOpenLinkState(false);
        }
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
    http
      .get(import.meta.env.VITE_API_URL + 'api/teacher/label/get')
      .then((r) => {
        setTeacherName(r.data);
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
  

  useEffect(() => {
    const filterWeek = weekDaysGet
      .split(',')
      .map(Number)
      .filter((e) => e > 0);
    setSelectedDays(filterWeek);
  }, [weekDaysGet]);

  useEffect(() => {
    const filterStart = startTimeLessonGet.split('-');
    setSelectedTime(filterStart.length > 1 ? filterStart[0] : '');
    setSelectedTimeEnd(filterStart.length > 1 ? filterStart[1] : '');
  }, [startTimeLessonGet]);

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

  const handleChangeRoom = (event) => {
    setRoomValue(event.target.value);
  };

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
  };
  const handleTimeChangeTimeEnd = (newTime) => {
    setSelectedTimeEnd(newTime.target.value);
  };

  const validateOpenModal = () => {
    let isTrue = false;
    if (
      !openLinkState &&
      selectedTime &&
      selectedTimeEnd &&
      roomValue &&
      selectedDays.length > 0
    ) {
      isTrue = true;
    } else {
      isTrue = false;
    }
    return isTrue;
  };

  const closeAndSave = () => {
    setOpenCheckModal(false);
    setCheckboxValue(false);
  };

  const changeCheckbox = (event) => {
    setCheckboxValue(event.target.checked);
  };

  const changeLinkState = () => {
    setOpenLinkState(!openLinkState);
  };

  const handleDayOfWeekChange = (index) => {
    const updatedDaysOfWeek = [...daysOfWeekSecond];
    updatedDaysOfWeek[index].selected = !updatedDaysOfWeek[index].selected;
    setDaysOfWeekSecond(updatedDaysOfWeek);
  };

  let isVali = false;

  useEffect(() => {
    if (checkPartGet.length > 0) {
      const filterData = [];
      checkPartGet.forEach((e, index) => {
        const timeFilter = e.lesson_time.split('-');
        filterData.push({
          room_id: rooms[index],
          week_day: e.day_of_week,
          time: timeFilter[0] + '-' + timeFilter[1],
        });
        const updatedDaysOfWeek = [...daysOfWeekSecond];
        updatedDaysOfWeek[e.day_of_week - 1].selected = !updatedDaysOfWeek[e.day_of_week - 1].selected;
        setDaysOfWeekSecond(updatedDaysOfWeek);
      });
      setSelectedRows(filterData);
    }
    if (checkPartGet.length > 0) {
      checkPartGet.forEach((e) => {
        const filterLessonTime = e.lesson_time.split('-');
        rooms[e.day_of_week - 1] = e.room_id;
        startTimes[e.day_of_week - 1] = filterLessonTime[0];
        endTimes[e.day_of_week - 1] = filterLessonTime[1];
      });
    }
  }, [checkPartGet]);

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
      if (
        openLinkState &&
        e.room_id &&
        e.week_day &&
        splitFilter[0] &&
        splitFilter[1]
      ) {
        isVali = true;
      } else {
        isVali = false;
      }
    });
    return isVali;
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

    return true; // all objects pass the validation
  }
  const groupAddition = () => {
    if (
      nameGroup &&
      !/^\s*$/.test(nameGroup) &&
      teacherId &&
      payment &&
      sale >= 0 &&
      sale <= 100
    ) {
      setSkeletonTime(true);
      http
        .post(
          import.meta.env.VITE_API_URL + `api/group/lesson-put/${data[4]}`,
          {
            name: nameGroup,
            teacher_id: teacherId,
            month_payment: Number(payment),
            sale: Number(sale),
            month_pay_intrue: checkboxValue,
            week_data: selectedRows,
          }
        )
        .then(() => {
          setOpen(true);
          setInError(true);
          setCheckboxValue(false);
          setOpenCheckModal(false);
          setTimeout(() => {
            navigate('/groups/');
          }, 1500);
          setSkeletonTime(false);
        })
        .catch((error) => {
          if (
            error.response.data.message ==
            'At this time there is a lesson in the room'
          ) {
            setOpenCheckModal(false);
            setSkeletonTime(false);
            setOpenErrorSnackbar(true);
          }
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

  const UpdateInformations = () => {
    setOpenCheckModal(false);
    setSkeletonTime(true);
    http
      .post(
        import.meta.env.VITE_API_URL + `api/group/put/${data[4]}`,
        bodyParameters
      )
      .then(() => {
        setOpen(true);
        setInError(true);
        setCheckboxValue(false);
        setOpenCheckModal(false);
        setTimeout(() => {
          navigate('/groups/');
        }, 1500);
        setSkeletonTime(false);
      })
      .catch((error) => {
        if (
          error.response.data.message ==
          'At this time there is a lesson in the room'
        ) {
          setOpenCheckModal(false);
          setSkeletonTime(false);
          setCheckboxValue(false);
          setOpenErrorSnackbar(true);
        }
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
  };
  4;

  const bodyParameters = {
    name: nameGroup,
    teacher_id: teacherId,
    month_payment: Number(payment),
    sale: Number(sale),
    month_pay_intrue: checkboxValue,
    time: selectedTime + '-' + selectedTimeEnd,
    day: selectedDays,
    room_id: roomValue,
  };

  const min = 0;
  const max = 10000000;
  const minSale = 0;
  const maxSale = 100;
  const paymentFun = (e) => {
    let paymetValue = Number(parseInt(e.target.value && e.target.value, 10));
    if (paymetValue > max) paymetValue = max;
    if (paymetValue < min) paymetValue = min;
    setPayment(paymetValue);
  };

  const saleFun = (e) => {
    let paymetValue = Number(parseInt(e.target.value && e.target.value, 10));
    if (paymetValue > maxSale) paymetValue = maxSale;
    if (paymetValue < minSale) paymetValue = minSale;
    setSale(paymetValue);
  };

  const openModalFun = () => {
    const isCheckForm = validateCheck();
    const isComplateForm = validateOpenModal();
    const isValid = validateTime(selectedRows);
    if (
      (nameGroup &&
        !/^\s*$/.test(nameGroup) &&
        teacherId &&
        payment &&
        sale >= 0 &&
        sale <= 100 &&
        isComplateForm) ||
      isCheckForm
    ) {
      if (openLinkState && isValid) {
        setOpenCheckModal(true);
        setOpenErrorTimeSnackbar(false);
      } else {
        setOpenErrorTimeSnackbar(true);
      }
      if (
        !openLinkState &&
        selectedTime !== selectedTimeEnd &&
        selectedTime < selectedTimeEnd
      ) {
        setOpenCheckModal(true);
        setOpenErrorTimeSnackbar(false);
      } else {
        if (
          !openLinkState &&
        selectedTime == selectedTimeEnd &&
        selectedTime > selectedTimeEnd
        ) {
          setOpenErrorTimeSnackbar(true);
        }
      }
    } else {
      setInError(false);
      setOpen(true);
    }
  };

  return (
    <div>
      <Container>
        {skeletonTime ? (
          <ContentSkeleton>
            <Box sx={{ width: '100%' }}>
              <Skeleton width="65%" height="2rem" />
              <Skeleton width="70%" height="2rem" />
              <Skeleton width="80%" height="2rem" />
              <Skeleton width="85%" height="2rem" />
            </Box>
          </ContentSkeleton>
        ) : (
          <div>
            <Header>
              <div>
                <h3>Guruhni tahrirlash</h3>
              </div>
              <div>
                <i
                  onClick={() => {
                    navigate('/groups');
                  }}
                  className="fa-solid exit fa-xmark"
                ></i>
              </div>
            </Header>
            <hr />
            <Main>
              <Forma>
                <Box sx={{ width: '100%', pr: 5 }}>
                  <TextField
                    fullWidth
                    label="Guruh nomini tahrirlash"
                    id="outlined-size-large"
                    size="large"
                    value={nameGroup}
                    onChange={(e) => setNameGroup(e.target.value)}
                  />
                </Box>
                <Box sx={{ width: '100%', pr: 5 }}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      O&apos;qituvchisi
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={teacherId}
                      label="Jinsini tanlang!"
                      onChange={(e) => setTeacherId(e.target.value)}
                    >
                      {teacherName &&
                        teacherName.map((e) => {
                          return (
                            <MenuItem value={e.id} key={e.id}>
                              {e.name}
                            </MenuItem>
                          );
                        })}
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
                    label="Oylik to'lov summasi"
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
                    label="O'qtuvchi foizi..."
                    id="outlined-size-large"
                    size="large"
                    value={sale}
                    onChange={saleFun}
                    type={'number'}
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
                    mt: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
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
              <Btnadd>
                <Box sx={{ pr: 5 }}>
                  <Button
                    variant="contained"
                    size="large"
                    className="buy_btn_modal"
                    onClick={() => openModalFun()}
                  >
                    Saqlash
                  </Button>
                </Box>
              </Btnadd>
              <Modal open={openCheckModal}>
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
                  <div>
                    <FormControlLabel
                      sx={{ mt: 1, lineHeight: '10px' }}
                      control={
                        <Checkbox
                          checked={checkboxValue}
                          onChange={(e) => changeCheckbox(e)}
                        />
                      }
                      label="Guruhdagi barcha o'quvchilar to'lov summasi o'zgartirilsin"
                    />
                  </div>

                  <Button
                    sx={{ mt: 3, pt: 1, pb: 1 }}
                    fullWidth
                    className="buy_btn_modal"
                    variant="contained"
                    onClick={openLinkState ? groupAddition : UpdateInformations}
                  >
                    Saqlash
                  </Button>
                </Box>
              </Modal>
              <Snackbar
                open={open}
                onClose={handleClose}
                severity={inError ? 'success' : 'error'}
                massage={
                  inError
                    ? 'Sinf ma\'lumotlari muvafaqqiyatli o\'zgartirildi'
                    : sale < 0 || sale > 100
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
                massage={
                  'Darsning boshlanish va tugash vaqtini to\'g\'ri kiriting'
                }
              />
            </Main>
          </div>
        )}
      </Container>
    </div>
  );
}

export default UpdateGroups;
