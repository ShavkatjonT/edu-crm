import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom';
import http from '../../http/index';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import ButtonGroup from '@mui/material/ButtonGroup';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../index';
import NumericInput from 'material-ui-numeric-input';
import { Checkbox, FormControlLabel, TextField } from '@mui/material';
import Snackbar from '../Snackbar/Snackbar';
import { IMaskInput } from 'react-imask';
import PropTypes from 'prop-types';
import styled from 'styled-components';
const styleLaunchGroup = {
    position: 'relative',
    width: 950,
    bgcolor: 'background.paper',
    border: 'none',
    borderRadius: '6px',
    boxShadow: 24,
    p: 4,
};

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

const LaunchGroupModal = ({ column, updateFun, closeFun }) => {
    const navigate = useNavigate();
    const { user } = useContext(Context);
    const [launchGroupTextfiend, setLaunchGroupTextfiend] = useState('');
    const [launchGroupTeacherName, setLaunchGroupTeacherName] = useState('');
    const [monthlySumma, setMonthlySumma] = useState('');
    const [teacherId, setTeacherId] = useState('');
    const [selectedDays, setSelectedDays] = useState([]);
    const [sale, setSale] = useState({
        textmask: '',
    });
    const [selectTeacher, setSelectTeacher] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedTimeEnd, setSelectedTimeEnd] = useState('');
    const [roomsData, setRoomsData] = useState([]);
    const [roomValue, setRoomValue] = useState('');
    const [openErrorTimeSnackbar, setOpenErrorTimeSnackbar] = useState(false);
    const [openErrorNoComplateSnackbar, setOpenErrorNoComplateSnackbar] = useState(false);
    const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [openLinkState, setOpenLinkState] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [daysOfWeekSecond, setDaysOfWeekSecond] = useState([
        { name: 'Dushanba', selected: false },
        { name: 'Seshanba', selected: false },
        { name: 'Chorshanba', selected: false },
        { name: 'Payshanba', selected: false },
        { name: 'Juma', selected: false },
        { name: 'Shanba', selected: false },
        { name: 'Yakshanba', selected: false },
    ]);
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
                setSelectTeacher(r.data);
            })
            .catch((error) => {
                if (
                    error?.response?.data?.message == 'ro\'yxattan o\'tmagan foydalanuvchi!'
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
            })
            .catch((error) => {
                if (
                    error?.response?.data?.message == 'ro\'yxattan o\'tmagan foydalanuvchi!'
                ) {
                    user.setIsAuth(false);
                    localStorage.clear();
                    navigate('/');
                } else {
                    console.log(error);
                }
            });
    }, [])


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

    const handleChangeRoom = (event) => {
        setRoomValue(event.target.value);
    };


    const handleChangeLaunchGroup = (event) => {
        setLaunchGroupTextfiend(event.target.value);
    };

    const handleChangeGroupTeacher = (event, obj) => {
        setLaunchGroupTeacherName(event.target.value);
        const { key } = obj;
        const filterId = key.substring(2);
        setTeacherId(filterId);
    };

    const changeMonthSumma = (event) => {
        setMonthlySumma(event.target.value);
    };

    const changeSale = (event) => {
        setSale({
            [event.target.name]: event.target.value,
        });
    };

    const handleTimeChange = (newTime) => {
        setSelectedTime(newTime.target.value);
    };
    const handleTimeChangeTimeEnd = (newTime) => {
        setSelectedTimeEnd(newTime.target.value);
    };


    const closeAndSaveLaunch = () => {
        closeFun();
        setLaunchGroupTextfiend('');
        setLaunchGroupTeacherName('');
        setSelectedDays([]);
        setMonthlySumma('');
        setSelectedTime('');
        setSelectedTimeEnd('');
        setRoomValue('');
        setOpenLinkState(false);
        setSale(0);
    };

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

    const handleCloseErrorTime = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenErrorTimeSnackbar(false);
    };
    const handleCloseErrorComplate = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenErrorNoComplateSnackbar(false);
    };

    let isVali = false;

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


    const launchGroupFun = () => {
        if (
            launchGroupTextfiend && !/^\s/.test(launchGroupTextfiend) &&
            launchGroupTeacherName &&
            monthlySumma &&
            sale.textmask &&
            selectedDays.length > 0 &&
            roomValue &&
            selectedTime &&
            selectedTimeEnd
        ) {
            if (selectedTime !== selectedTimeEnd && selectedTime < selectedTimeEnd) {
                setLoadingData(true);
                http
                    .post(
                        import.meta.env.VITE_API_URL + 'api/columns/group-launch-2',
                        {
                            column_id: column.id,
                            name: launchGroupTextfiend,
                            month_payment: monthlySumma,
                            sale: sale.textmask,
                            teacher_id: teacherId,
                            time: selectedTime + '-' + selectedTimeEnd,
                            day: selectedDays,
                            room_id: roomValue,
                        }
                    )
                    .then(() => {
                        updateFun();
                        closeFun();
                        setLaunchGroupTeacherName('');
                        setMonthlySumma('');
                        setSale({
                            textmask: '',
                        });
                        setSelectedDays([]);
                        setRoomValue('');
                        setSelectedTime('');
                        setSelectedTimeEnd('');
                        setOpenLinkState(false);
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
                        setLoadingData(false);
                    })
                    .catch((error) => {
                        if (
                            error.response.data.message == 'At this time there is a lesson in the room'
                        ) {
                            setOpenErrorSnackbar(true);
                            setLoadingData(false);
                        }
                    });
            } else {
                if (selectedTime !== selectedTimeEnd && selectedTime < selectedTimeEnd) {
                    setOpenErrorTimeSnackbar(true);
                } else {
                    setOpenErrorTimeSnackbar(false);
                }
            }
        } else {
            setOpenErrorNoComplateSnackbar(true);
        }
    };

    const launchCheckFunGroup = () => {
        const isValid = validateTime(selectedRows);
        const isCheckForm = validateCheck();
        if (
            launchGroupTextfiend && !/^\s/.test(launchGroupTextfiend) &&
            launchGroupTeacherName &&
            monthlySumma &&
            sale.textmask &&
            isCheckForm
        ) {
            if (isValid) {
                setLoadingData(true);
                http
                    .post(
                        import.meta.env.VITE_API_URL + 'api/columns/group-launch-1',
                        {
                            column_id: column.id,
                            name: launchGroupTextfiend,
                            month_payment: monthlySumma,
                            sale: sale.textmask,
                            teacher_id: teacherId,
                            week_data: selectedRows
                        }
                    )
                    .then(() => {
                        setLoadingData(false);
                        updateFun();
                        closeFun();
                        setLaunchGroupTeacherName('');
                        setMonthlySumma('');
                        setSale({
                            textmask: '',
                        });
                        setSelectedDays([]);
                        setRoomValue('');
                        setSelectedTime('');
                        setSelectedTimeEnd('');
                        setOpenLinkState(false);
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
                    })
                    .catch((error) => {
                        if (
                            error.response.data.message == 'At this time there is a lesson in the room'
                        ) {
                            setLoadingData(false);
                            setOpenErrorSnackbar(true);
                        }
                    });
            } else {
                setOpenErrorTimeSnackbar(true);
            }
        } else {
            setOpenErrorNoComplateSnackbar(true);
        }
    };

    const handleCloseError = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenErrorSnackbar(false);
    };


    return (
        <div style={{ width: '100%', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Box sx={styleLaunchGroup}>
                <CloseIcon
                    style={{
                        position: 'absolute',
                        right: '1.2%',
                        top: '1.2%',
                        cursor: 'pointer',
                        zIndex: 2
                    }}
                    onClick={closeAndSaveLaunch}
                />
                <div
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '5.5rem',
                        left: 0,
                        borderTopLeftRadius: '6px',
                        borderTopRightRadius: '6px',
                        zIndex: '1',
                        paddingTop: '20px',
                        paddingBottom: '20px',
                        paddingLeft: '30px',
                        top: 0,
                        background: '#FDC600',
                    }}
                >
                    <h2>{column.name}</h2>
                    <p style={{ marginTop: '0.1rem' }}>
                        Guruhni ishga tushurish
                    </p>
                </div>
                <Box sx={{ mt: 10, display: 'flex' }}>
                    <Box sx={{ width: '50%', mr: 3 }}>
                        <TextField
                            fullWidth
                            label="Guruh nomi"
                            id="outlined-size-large"
                            size="large"
                            value={launchGroupTextfiend}
                            onChange={handleChangeLaunchGroup}
                            type={'search'}
                        />
                    </Box>
                    <Box sx={{ width: '50%' }}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">
                                Guruhga o`qituvchi biriktirish
                            </InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={launchGroupTeacherName}
                                label="Guruhga o`qituvchi biriktirish"
                                onChange={handleChangeGroupTeacher}
                            >
                                {selectTeacher &&
                                    selectTeacher.map((name) => (
                                        <MenuItem key={name.id} value={name.id}>
                                            {name.name}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                    </Box>
                </Box>
                <Box sx={{ mt: 3, display: 'flex' }}>
                    <Box sx={{ width: '50%', mr: 3 }}>
                        <NumericInput
                            fullWidth
                            precision={''}
                            decimalChar=","
                            thousandChar="."
                            label="Oylik to'lovni kiriting"
                            value={monthlySumma}
                            onChange={changeMonthSumma}
                            variant="outlined"
                            inputProps={{
                                maxLength: 8,
                                minLength: 0,
                            }}
                        />
                    </Box>
                    <Box sx={{ width: '50%' }}>
                        <TextField
                            fullWidth
                            label="Kelishilgan % ni kiriting...(0%-100%)"
                            value={sale.textmask}
                            onChange={changeSale}
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
                </Box>
                <Forma style={{ display: openLinkState ? 'none' : 'flex' }}>
                    <Box sx={{ width: '100%', mr: 3, pt: 1 }}>
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
                    <Box sx={{ width: '50%', pr: '11px' }}>
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
                                        mr: 3,
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
                <Button
                    sx={{ mt: 3, pt: 1, pb: 1 }}
                    fullWidth
                    className="buy_btn_modal"
                    variant="contained"
                    onClick={openLinkState ? launchCheckFunGroup : launchGroupFun}
                    disabled={loadingData}
                >
                    {loadingData ? <i className="fa-solid fa-circle-notch fa-spin" style={{fontSize: '24px', color: 'white'}}></i> : 'Ishga tushirish'}
                </Button>
            </Box>
            <Snackbar
                open={openErrorSnackbar}
                onClose={handleCloseError}
                severity={'warning'}
                massage={'Bu vaqtda ushbu xonada dars mavjud'}
            />
            <Snackbar
                open={openErrorNoComplateSnackbar}
                onClose={handleCloseErrorComplate}
                severity={'error'}
                massage={'Ma\'lumotlar to\'liq kiritilmadi'}
            />
            <Snackbar
                open={openErrorTimeSnackbar}
                onClose={handleCloseErrorTime}
                severity={'warning'}
                massage={'Darsning boshlanish va tugash vaqtini to\'g\'ri kiriting'}
            />
        </div>
    )
}

export default LaunchGroupModal