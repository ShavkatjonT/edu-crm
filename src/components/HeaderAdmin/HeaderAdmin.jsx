import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import './HeaderAdmin.css';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import hand from '/images/handImg.png';
import CloseIcon from '@mui/icons-material/Close';
import { Logout } from '@mui/icons-material';
import NumericInput from 'material-ui-numeric-input';
import { AiOutlineUsergroupAdd } from 'react-icons/ai';
import { FiSearch } from 'react-icons/fi';
import {
    IconButton,
    MenuItem,
    Tooltip,
    TextField,
    Box,
    Modal,
    Button,
    InputLabel,
    FormControl,
    Select,
    FormHelperText,
    Fade,
    FormControlLabel,
    Checkbox,
} from '@mui/material';
import { IMaskInput } from 'react-imask';
import PersonIcon from '@mui/icons-material/Person';
// import { Settings } from '@material-ui/icons';
import AdminIcon from '/images/headerAvatarSvg.svg';
import PropTypes from 'prop-types';
import useMediaQueries from 'media-queries-in-react';
import { useContext } from 'react';
import { Context } from '../../index';
import { Link, useNavigate } from 'react-router-dom';
import { LOGIN_ROUTE } from '../../utils/consts';
import http from '../../http';
import Snackbar from '../Snackbar/Snackbar';
const Global = styled.div``;

const Container = styled.div``;



// const Title = styled.div``;

// const Text2 = styled.div``;

const Admin = styled.div``;

// const Logo = styled.div``;

const UserImage = styled.div``;

const UserName = styled.div``;
const Name = styled.div``;
const Content1 = styled.div``;

const User = styled.div``;

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

const styleLimit = {
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
    zIndex: 10,
};

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

const HeaderAdmin = (props) => {
    const { state, width } = props;
    const { user } = useContext(Context);
    const [payModal, setPayModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const [saleInfo, setSaleInfo] = useState(0);
    const [groupName, setGroupName] = useState([]);
    const [payMethod, setPayMethod] = useState('');
    const [limitOpen, setLimitOpen] = useState(false);
    const [errorSum, setErrorSum] = useState(false);
    const [errorSelect, setErrorSelect] = useState(false);
    const [messageLimit, setMessageLimit] = useState(false);
    const [selectGroup, setSelectGroup] = useState('');
    const [studentId, setStudentId] = useState('');
    const [name, setName] = useState([]);
    const [allMonthGiven, setAllMonthGiven] = useState(0);
    const [successSnackbar, setSuccessSnackbar] = useState(false);
    const [snackbarStatus, setSnackbarStatus] = useState('');
    const [addStudentModal, setAddStudentModal] = useState(false);
    const [inputSearchFocus, setInputSearchFocus] = useState(false);
    const [gender, setGender] = useState('');
    const [firstname, setFirstname] = useState('');
    const [birthday, setBirthday] = useState('');
    const [lastname, setLastname] = useState('');
    const [fathername, setFathername] = useState('');
    const [classValue, setClassValue] = useState('');
    const [address, setAddress] = useState('');
    const [phoneFath, setPhoneFath] = useState({
        textmask: '+998',
    });
    const [phoneMoth, setPhoneMoth] = useState({
        textmask: '+998',
    });
    const [monthlySummModal, setMonthlySummModal] = useState(false);
    const [teacherList, setTeacherList] = useState([]);
    const [teacherValue, setTeacherValue] = useState('');
    const [teacherGroupsList, setTeacherGroupsList] = useState([]);
    const [groupValue, setGroupValue] = useState('');
    const [studentName, setStudentName] = useState('');
    const [monthlySumma, setMonthlySumma] = useState('');
    const [filterGroupsSumma, setFilterGroupsSumma] = useState('');
    const [errorData, setErrorData] = useState(false);
    const [errorSumma, setErrorSumma] = useState(false);
    const [successAddSnackbar, setSuccessAddSnackbar] = useState(false);
    const [testLesson, setTestLesson] = useState(false);
    const [errorPayMethod, setErrorPayMethod] = useState(false);
    const [successAdd, setSuccessAdd] = useState('');
    const [disabledPay, setDisabledPay] = useState(false);
    const history = useNavigate();
    const handleClick = () => {
        setOpen(!open);
    };
    const handleOnBlur = () => {
        setOpen(false);
    };

    const logout = () => {
        user.setUser({});
        user.setIsAuth(false);
        localStorage.setItem('token', '');
        history(LOGIN_ROUTE);
    };

    const minWidthStyle = {
        width: width ? width : props.state ? '86%' : '96%',
    };

    const maxWidhtStyle = {
        width: width ? width : props.state ? '83%' : '96%',
    };

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

    const fetchDataFromApi = (searchTerm) => {
        http
            .get(
                import.meta.env.VITE_API_URL +
                `api/student/list/get/search/?text=${searchTerm}`
            )
            .then((res) => {
                if (res.data == 0) {
                    setOptions([]);
                } else {
                    setOptions(res.data);
                }
            })
            .catch((error) => {
                if (
                    error.response.data.message == 'ro\'yxattan o\'tmagan foydalanuvchi!'
                ) {
                    user.setIsAuth(false);
                    localStorage.clear();
                    history('/');
                } else {
                    console.log(error);
                }
            });
    };

    const handleInputChange = (newInputValue) => {
        setSearchTerm(newInputValue.target.value);
        const value = newInputValue.target.value;
        // You can set a minimum character limit here before making the API call
        if (value.length >= 3) {
            fetchDataFromApi(value);
        } else {
            setOptions([]); // Clear options if input is too short
        }
    };

    const functionOpenModal = (e) => {
        setPayModal(true);
        setGroupName(e.groups);
        setStudentId(e.id);
        setName(e);
    };


    useEffect(() => {
        if (selectGroup !== '') {
            let moneyMonth = groupName.month_payment;
            setAllMonthGiven(moneyMonth);
            setFilterGroupsSumma(moneyMonth);
        }
    }, [selectGroup]);


    const handleChangeSelect = (event) => {
        setSelectGroup(event.target.value);
    };

    const changeSelect = (e) => {
        handleChangeSelect(e);
    };

    const closeAndSave = () => {
        setPayModal(false);
        setSaleInfo(0);
        setErrorSum(false);
        setMessageLimit(false);
        setSelectGroup('');
        setPayMethod('');
        setErrorSelect(false);
        setAllMonthGiven(0);
        setInputSearchFocus(false);
    };

    const saveBuyModal = () => {
        if (
            allMonthGiven && selectGroup || allMonthGiven !== 0 && saleInfo !== 0 && payMethod
        ) {
            if (allMonthGiven > filterGroupsSumma) {
                setLimitOpen(true);
            } else {
                setDisabledPay(true);
                setLimitOpen(false);
                http
                    .post(import.meta.env.VITE_API_URL + 'api/payment/add', {
                        student_id: studentId,
                        group_id: selectGroup,
                        all_summa: Number(filterGroupsSumma),
                        given_summa: Number(allMonthGiven),
                        sale: Number(saleInfo),
                        payment_type: payMethod
                    })
                    .then(() => {
                        setDisabledPay(false);
                        setPayModal(false);
                        setSaleInfo(0);
                        setErrorSum(false);
                        setErrorSelect(false);
                        setAllMonthGiven(0);
                        setSelectGroup('');
                        setPayMethod('');
                        setSuccessSnackbar(true);
                        setSnackbarStatus('success');
                    })
                    .catch((e) => {
                        console.log(e);
                        setSnackbarStatus('error');
                    });
            }
        } else {
            if (!selectGroup) {
                setErrorSelect(true);
            } else {
                setErrorSelect(false);
            }
            if (!allMonthGiven || allMonthGiven == 0 && saleInfo == 0) {
                setErrorSum(true);
                setMessageLimit(true);
            } else {
                setErrorSum(false);
                setMessageLimit(false);
            }
            if (!payMethod) {
                setErrorPayMethod(true);
            } else {
                setErrorPayMethod(false);
            }
        }
    };

    const limitYes = () => {
        setDisabledPay(true);
        setLimitOpen(false);
        http
            .post(import.meta.env.VITE_API_URL + 'api/payment/add', {
                student_id: studentId,
                group_id: selectGroup,
                all_summa: filterGroupsSumma,
                given_summa: allMonthGiven,
                sale: Number(saleInfo),
                payment_type: payMethod
            })
            .then(() => {
                setDisabledPay(false);
                setPayModal(false);
                setSaleInfo(0);
                setErrorSum(false);
                setErrorSelect(false);
                setAllMonthGiven(0);
                setSelectGroup('');
                setPayMethod('');
                setSuccessSnackbar(true);
                setSnackbarStatus('success');
            })
            .catch((e) => {
                console.log(e);
                setSnackbarStatus('error');
            });
    };

    const limitNow = () => {
        setLimitOpen(false);
        setMessageLimit(true);
    };

    const hedelSum = (e) => {
        setAllMonthGiven(e.target.value);
        setErrorSum(false);
        setMessageLimit(false);
    };

    const saleChangeFun = (value) => {
        setSaleInfo(value.target.value);
    };

    const selectedOption = (value) => {
        setSearchTerm('');
        const selectedStudentObject = options.find(
            (student) => student.id === value.id
        );
        if (selectedStudentObject) {
            if (user?.user?.role == 'admin') {
                history(`student/${selectedStudentObject?.id}`);
                setInputSearchFocus(false);
                setOptions([]);
            } else {
                functionOpenModal(selectedStudentObject);
                setInputSearchFocus(false);
                setOptions([]);
            }
        }
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setSuccessSnackbar(false);
    };
    const handleAddCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setSuccessAddSnackbar(false);
    };

    const handleClickAddStudent = () => {
        http
            .get(import.meta.env.VITE_API_URL + 'api/teacher/all/list/get')
            .then((r) => {
                setTeacherList(r.data);
            })
            .catch((error) => {
                if (
                    error.response.data.message == 'ro\'yxattan o\'tmagan foydalanuvchi!'
                ) {
                    user.setIsAuth(false);
                    localStorage.clear();
                    history('/');
                } else {
                    console.log(error);
                }
            });
        setAddStudentModal(true);
    };

    const closeAddStudentModal = () => {
        setAddStudentModal(false);
        setTeacherValue('');
        setGroupValue('');
        setFirstname('');
        setLastname('');
        setFathername('');
        setGender('');
        setBirthday('');
        setAddress('');
        setPhoneFath({
            textmask: '+998',
        });
        setPhoneMoth({
            textmask: '+998',
        });
        setClassValue('');
    };

    const changeTeacherFun = (event) => {
        setTeacherValue(event.target.value);
        http
            .get(import.meta.env.VITE_API_URL + `api/group/get/${event.target.value}`)
            .then((r) => {
                setTeacherGroupsList(r.data?.groupList);
            })
            .catch((error) => {
                if (
                    error.response.data.message == 'ro\'yxattan o\'tmagan foydalanuvchi!'
                ) {
                    user.setIsAuth(false);
                    localStorage.clear();
                    history('/');
                } else {
                    console.log(error);
                }
            });
        setErrorData(false);
    };

    const changeGroupFun = (e) => {
        setGroupValue(e.target.value);
        setErrorData(false);
    };

    useEffect(() => {
        const result = teacherGroupsList && teacherGroupsList.find((e) => e.id == groupValue);
        setMonthlySumma(result?.month_payment);
    }, [groupValue]);


    const fatherPhone = (event) => {
        setPhoneFath({
            [event.target.name]: event.target.value,
        });
        setErrorData(false);
    };
    const motherPhone = (event) => {
        setPhoneMoth({
            [event.target.name]: event.target.value,
        });
        setErrorData(false);
    };

    const handleChange = (event) => {
        setGender(event.target.value);
        setErrorData(false);
    };

    const handleChangeClass = (event) => {
        setClassValue(event.target.value);
        setErrorData(false);
    };

    const funGroupAdd = () => {
        if (monthlySumma) {
            setAddStudentModal(false);
            setMonthlySummModal(false);
            http
                .post(import.meta.env.VITE_API_URL + 'api/student/add', {
                    firstname: firstname,
                    gender: gender,
                    birthday: birthday ? birthday : ' ',
                    lastname: lastname,
                    fathername: fathername ? fathername : ' ',
                    address: address ? address : ' ',
                    fatherPhone: phoneFath.textmask,
                    motherPhone: phoneMoth.textmask.length == 19 ? phoneMoth.textmask : ' ',
                    classStudentdent: classValue ? classValue : ' ',
                    group_id: groupValue,
                })
                .then((res) => {
                    http
                        .post(import.meta.env.VITE_API_URL + 'api/group-students/add', {
                            student_id: res.data.student.id,
                            group_id: groupValue,
                            summa: monthlySumma,
                            status: testLesson
                        })
                        .then(() => {
                            setSuccessAddSnackbar(true);
                            setSuccessAdd('success');
                            closeAddStudentModal();
                        })
                        .catch((error) => {
                            if (
                                error.response.data.message ==
                                'ro\'yxattan o\'tmagan foydalanuvchi!'
                            ) {
                                user.setIsAuth(false);
                                localStorage.clear();
                                history('/');
                            } else {
                                console.log(error);
                                setSuccessAddSnackbar(true);
                                setSuccessAdd('error');
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
                        history('/');
                    } else {
                        console.log(error);
                        setSuccessAddSnackbar(true);
                        setSuccessAdd('error');
                    }
                });
        } else {
            setErrorSumma(true);
        }
    };

    const addStudentGroup = () => {
        if (teacherValue && groupValue && firstname && !/^\s*$/.test(firstname) &&
            lastname && !/^\s*$/.test(lastname) &&
            gender && phoneFath.textmask.length == 19) {
            setStudentName(firstname + ' ' + lastname);
            setMonthlySummModal(true);
        } else {
            setErrorData(true);
        }
    };

    const handleSumma = (e) => {
        setMonthlySumma(e.target.value);
        setErrorSumma(false);
    };

    const changePayMethod = (e) => {
        setPayMethod(e.target.value);
    };

    const onInputFocus = () => {
        setInputSearchFocus(true);
    };
    const onInputBlur = () => {
        setInputSearchFocus(false);
    };
    return (
        <Global
            open={state}
            style={responsiveHeader()}
            id='globalId'
        >
            <Container id='containerId'>
                <Content1 id='content1Id'>
                    <div className='title-hello'>
                        <h1>Assalomu alaykum</h1>
                        <img src={hand} alt="" />
                    </div>
                    <p>Kabinetingizga xush kelibsiz!</p>
                </Content1>
                <User id='userIDStyle'>
                    <div className='headerSearch'>
                        <div className='autocomplate-part'>
                            <div className='input-btn-part' style={{ borderColor: inputSearchFocus && '#607AFB' }}>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={handleInputChange}
                                    onFocus={onInputFocus}
                                    onBlur={onInputBlur}
                                    placeholder="O'quvchilarni qidirish..."
                                />
                                <button>
                                    <FiSearch />
                                </button>
                            </div>
                            <div className={`search-result ${inputSearchFocus && searchTerm.length > 3 ? 'active' : 'inactive'}`}>
                                <ul>
                                    {options.length > 0 ? options.map((option, index) => (
                                        <li key={index} onMouseDown={() => { selectedOption(option); }}>
                                            {option.firstname + ' ' + option.lastname}
                                        </li>
                                    )) : (searchTerm.length > 3 && <li>O&apos;quvchi topilmadi</li>)}
                                </ul>
                            </div>
                        </div>
                        <Tooltip
                            title="O'quvchi qo'shish"
                            arrow
                            TransitionComponent={Fade}
                            placement="top"
                        >
                            <button className='addStudent' onClick={handleClickAddStudent}>
                                <AiOutlineUsergroupAdd />
                            </button>
                        </Tooltip>
                    </div>
                    <Admin id='adminId'>
                        <UserImage id='userImageID'>
                            <div style={{ borderRadius: '76px', width: '40px', height: '40px' }}>
                                <img src={AdminIcon} alt="" style={{ width: '100%' }} />
                            </div>
                        </UserImage>
                        <UserName id='userNameId'>
                            <Box sx={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                                <h4 className='company-name'>VIM</h4>
                                <Tooltip title='Foydalanuvchi Sozlamalari'>
                                    <IconButton
                                        onClick={handleClick}
                                        onBlur={handleOnBlur}
                                        size='small'
                                        aria-controls={open ? 'account-menu' : undefined}
                                        aria-haspopup='true'
                                        aria-expanded={open ? 'true' : undefined}
                                    >
                                        <KeyboardArrowDownIcon fontSize='small' />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            <Name id='nameId'>{user?.user?.role == 'super' ? 'CEO' : user?.user?.role == 'casher' ? 'Hisobchi' : 'Admin'}</Name>
                            <div className={`user-dropdown ${open ? 'active' : 'inactive'}`}
                                style={{ width: user?.user?.role == 'super' ? '180px' : user?.user?.role == 'admin' ? '240px' : user?.user?.role == 'casher' ? '200px' : '200px'}}>
                                <ul>
                                    <li onMouseDown={() => history('/admin-cobinet')}>
                                        <PersonIcon fontSize='small' />
                                        <p>
                                            {user?.user?.role == 'super' ? 'CEO ma\'lumotlari' : user?.user?.role == 'admin' ? 'Administrator ma\'lumotlari' : user?.user?.role == 'casher' ? 'Hisobchi ma\'lumotlari' : 'Ma\'lumotlar'}
                                        </p>
                                    </li>
                                    {/* <li>
                                        <Settings fontSize='small' />
                                        Sozlamalar
                                    </li> */}
                                    <li onMouseDown={() => logout()}>
                                        <Logout fontSize='small' />
                                        <p>
                                            Chiqish
                                        </p>
                                    </li>
                                </ul>
                            </div>
                            {/* <Menu
                                anchorEl={anchorEl}
                                id='account-menu'
                                open={open}
                                onClose={handleClose}
                                onClick={handleClose}
                                PaperProps={{
                                    elevation: 0,
                                    sx: {
                                        overflow: 'visible',
                                        boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
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
                                <MenuItem style={{ display: user?.user?.role == 'teacher' ? 'none' : 'block' }} onClick={() => history('/admin-cobinet')}>
                                    <ListItemIcon>
                                        <PersonIcon fontSize='small' />
                                    </ListItemIcon>
                                    {user?.user?.role == 'super' ? 'CEO ma\'lumotlari' : user?.user?.role == 'admin' ? 'Administrator ma\'lumotlari' : user?.user?.role == 'casher' ? 'Hisobchi ma\'lumotlari' : 'Ma\'lumotlar'}
                                </MenuItem>
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
                            </Menu> */}
                        </UserName>

                    </Admin>
                </User>
            </Container>
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
                            height: '6rem',
                            left: 0,
                            borderTopLeftRadius: '6px',
                            borderTopRightRadius: '6px',
                            zIndex: '-1',
                            padding: '20px 30px',
                            top: 0,
                            background: '#FDC600',
                        }}
                    >
                        <h2 style={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}>{name?.firstname + ' ' + name?.lastname}</h2>
                        <p style={{ marginTop: '0.5rem' }}>
                            Ushbu o&apos;quvchiga to&apos;lov qilish
                        </p>
                    </div>
                    <Box sx={{ minWidth: 120, mt: 10, pb: 3 }}>
                        <div style={{ marginBottom: '15px' }}>
                            <Link to={`student/${name?.id}`} onClick={() => setPayModal(false)}>O&apos;quvchi ma&apos;lumotlari</Link>
                        </div>
                        <FormControl fullWidth>
                            <InputLabel id='demo-simple-select-label'>
                                To&apos;lov qilinadigan guruh
                            </InputLabel>
                            <Select
                                labelId='demo-simple-select-label'
                                id='demo-simple-select'
                                value={selectGroup}
                                label="To'lov qilinadigan guruh"
                                onChange={changeSelect}
                            >
                                {groupName &&
                                    <MenuItem key={groupName.id} value={groupName.id}>
                                        {groupName.name}
                                    </MenuItem>}
                            </Select>
                            <FormHelperText
                                style={{
                                    display: errorSelect ? 'block' : 'none',
                                    color: '#d32f2f',
                                }}
                            >
                                Guruhni tanlang
                            </FormHelperText>
                        </FormControl>
                    </Box>
                    <NumericInput
                        sx={{ pb: 3 }}
                        fullWidth
                        precision={''}
                        decimalChar=','
                        thousandChar='.'
                        label="Oylik to'lov summasi"
                        value={allMonthGiven}
                        onChange={(e) => hedelSum(e)}
                        variant='outlined'
                        inputProps={{
                            maxLength: 8,
                            minLength: 0,
                        }}
                        color={messageLimit ? 'error' : 'info'}
                        helperText={errorSum ? 'Summa kiritilmadi' : null}
                        FormHelperTextProps={{ style: { color: '#d32f2f' } }}
                    />
                    <br />
                    <NumericInput
                        fullWidth
                        precision={''}
                        sx={{ pb: 3 }}
                        decimalChar=','
                        thousandChar='.'
                        inputProps={{
                            maxLength: 8,
                            minLength: 0,
                        }}
                        label='Chegirma summasi'
                        value={saleInfo}
                        onChange={(e) => saleChangeFun(e)}
                    />
                    <br />
                    <FormControl fullWidth>
                        <InputLabel id='demo-simple-select-label'>
                            To&apos;lov usuli
                        </InputLabel>
                        <Select
                            labelId='demo-simple-select-label'
                            id='demo-simple-select'
                            value={payMethod}
                            label="To'lov usuli"
                            onChange={changePayMethod}
                        >
                            <MenuItem value={'cash'}>Naqd pul orqali</MenuItem>
                            <MenuItem value={'Payme'}>Payme</MenuItem>
                            <MenuItem value={'Click'}>Click</MenuItem>
                            <MenuItem value={'Uzumpay'}>Uzumpay</MenuItem>
                            <MenuItem value={'Zoomrad'}>Zoomrad</MenuItem>
                            <MenuItem value={'Paynet'}>Paynet</MenuItem>
                            <MenuItem value={'Oson'}>Oson</MenuItem>
                            <MenuItem value={'AlifMobi'}>Alif mobi</MenuItem>
                            <MenuItem value={'Anorbank'}>Anorbank</MenuItem>
                            <MenuItem value={'Beepul'}>Beepul</MenuItem>
                            <MenuItem value={'Davrmobile'}>Davr Mobile</MenuItem>
                            <MenuItem value={'other'}>Boshqa...</MenuItem>
                        </Select>
                        <FormHelperText
                            style={{
                                display: errorPayMethod ? 'block' : 'none',
                                color: '#d32f2f',
                            }}
                        >
                            To&apos;lov usulini tanlang
                        </FormHelperText>
                    </FormControl>
                    <Button
                        sx={{ mt: 3, pt: 1, pb: 1 }}
                        fullWidth
                        disabled={disabledPay}
                        className='buy_btn_modal'
                        variant='contained'
                        onClick={saveBuyModal}
                    >
                        Saqlash
                    </Button>
                </Box>
            </Modal>
            <Modal open={limitOpen}>
                <Box sx={styleLimit}>
                    <p style={{ fontWeight: 'bold', color: '#FDC600' }}>
                        Siz to&apos;layotgan summa to&apos;lanishi kerak bo&apos;lgan
                        summadan yuqori
                    </p>
                    <p style={{ fontWeight: 'bold', marginTop: '1rem' }}>
                        Shunda ham davom etishni istaysizmi ?
                    </p>
                    <div
                        style={{
                            paddingTop: '2rem',
                            display: 'flex',
                            justifyContent: 'end',
                        }}
                    >
                        <Button variant='contained' color='error' onClick={limitNow}>
                            Yo&apos;q
                        </Button>
                        <Button
                            style={{ background: '#042954', marginLeft: '1rem' }}
                            variant='contained'
                            disabled={disabledPay}
                            onClick={limitYes}
                        >
                            Ha
                        </Button>
                    </div>
                </Box>
            </Modal>
            <Modal
                open={addStudentModal}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: '600' }}>
                <div id='addStudentModal'>
                    <div
                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: '6rem',
                            left: 0,
                            borderTopLeftRadius: '6px',
                            borderTopRightRadius: '6px',
                            padding: '20px 30px',
                            top: 0,
                            background: '#FDC600',
                        }}
                    >
                        <CloseIcon
                            style={{
                                position: 'absolute',
                                right: '1%',
                                top: '8%',
                                cursor: 'pointer',
                            }}
                            onClick={closeAddStudentModal}
                        />
                        <h2 style={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}>O&apos;quvchi qo&apos;shish</h2>
                        <p style={{ marginTop: '0.5rem' }}>
                            Yangi o&apos;quvchi qo&apos;shish
                        </p>
                    </div>
                    <div className='contentsPart'>
                        <div className='groupsPart'>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">
                                    O&apos;qituvchini tanlang
                                </InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={teacherValue}
                                    label="O'qituvchini tanlang"
                                    onChange={changeTeacherFun}
                                >
                                    {teacherList && teacherList.map((value, index) => (
                                        <MenuItem key={index} value={value.id}>{value.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth disabled={!teacherValue}>
                                <InputLabel id="demo-simple-select-label">
                                    Guruhni tanlang
                                </InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={groupValue}
                                    label="Guruhni tanlang"
                                    onChange={changeGroupFun}
                                >
                                    {teacherGroupsList && teacherGroupsList.length > 0 ? teacherGroupsList.map((value, index) => (
                                        <MenuItem key={index} value={value.id}>{value.name}</MenuItem>
                                    )) : <MenuItem disabled>Mavjud emas</MenuItem>}
                                </Select>
                            </FormControl>
                        </div>
                        <div className='inputsPart'>
                            <div>
                                <TextField
                                    fullWidth
                                    label=" O'quvchi ismni kiriting..."
                                    id="outlined-size-large"
                                    size="large"
                                    onChange={(e) => { setFirstname(e.target.value); setErrorData(false); }}
                                    value={firstname}
                                    type={'search'}
                                />
                            </div>
                            <div>
                                <TextField
                                    fullWidth
                                    label="O'quvchi familyani kiriting..."
                                    id="outlined-size-large"
                                    onChange={(e) => {
                                        setLastname(e.target.value);
                                        setErrorData(false);
                                    }}
                                    value={lastname}
                                    size="large"
                                    type={'search'}
                                />
                            </div>
                            <div>
                                <TextField
                                    fullWidth
                                    label="Otasining ismini kiriting..."
                                    id="outlined-size-large"
                                    onChange={(e) => {
                                        setFathername(e.target.value);
                                        setErrorData(false);
                                    }}
                                    value={fathername}
                                    size="large"
                                    type={'search'}
                                />
                            </div>
                            <div>
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
                            </div>
                            <div>
                                <TextField
                                    fullWidth
                                    className="databirthday"
                                    id="date"
                                    label="Tug'ilgan sanani kiriting..."
                                    type="date"
                                    onChange={(e) => {
                                        setBirthday(e.target.value);
                                        setErrorData(false);
                                    }}
                                    value={birthday}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </div>
                            <div>
                                <TextField
                                    fullWidth
                                    label="Manzilni kiriting..."
                                    id="outlined-size-large"
                                    size="large"
                                    onChange={(e) => {
                                        setAddress(e.target.value);
                                        setErrorData(false);
                                    }}
                                    value={address}
                                    type={'search'}
                                />
                            </div>
                            <div>
                                <TextField
                                    fullWidth
                                    label="Otasining telefon raqamini kiriting..."
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
                            </div>
                            <div>
                                <TextField
                                    fullWidth
                                    label="Onasining telefon raqamini kiriting..."
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
                            </div>
                            <div>
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
                            </div>
                        </div>
                        <p
                            style={{
                                display: errorData ? 'block' : 'none',
                                fontSize: ' 0.8rem',
                                color: ' #d32f2f',
                                fontFamily: 'sans-serif',
                                fontWeight: '600',
                                letterSpacing: '0.03333em',
                            }}
                        >
                            Ma&apos;lumotlar to&apos;liq kiritilmadi !
                        </p>
                        <div>
                            <Button
                                sx={{ pt: 1, pb: 1 }}
                                fullWidth
                                className='buy_btn_modal'
                                variant='contained'
                                onClick={addStudentGroup}
                            >
                                Qo&apos;shish
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>
            <Modal open={monthlySummModal}>
                <Box sx={style}>
                    <CloseIcon
                        style={{
                            position: 'absolute',
                            right: '2%',
                            top: '3%',
                            cursor: 'pointer',
                        }}
                        onClick={() => { setMonthlySummModal(false); }}
                    />
                    <div
                        style={{
                            position: 'fixed',
                            width: '100%',
                            height: '5.5rem',
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
                            value={monthlySumma}
                            onChange={handleSumma}
                            variant="outlined"
                            inputProps={{
                                maxLength: 8,
                                minLength: 0,
                            }}
                        />
                    </Box>
                    <Box sx={{ width: '100%', mt: 2 }}>
                        <FormControlLabel value={testLesson} onChange={() => setTestLesson(!testLesson)} control={<Checkbox />} label="Ushbu o'quvchini sinov darsiga qo'shish" />
                    </Box>
                    <p
                        style={{
                            display: errorSumma ? 'block' : 'none',
                            marginTop: '3px',
                            marginLeft: '14px',
                            fontSize: ' 0.75rem',
                            color: ' #d32f2f',
                            fontFamily: 'sans-serif',
                            fontWeight: '400',
                            lineHeight: '1.66',
                            letterSpacing: '0.03333em',
                        }}
                    >
                        Summani kirting
                    </p>
                    <Button
                        sx={{ mt: 3, pt: 1, pb: 1 }}
                        fullWidth
                        className="buy_btn_modal"
                        variant="contained"
                        onClick={funGroupAdd}
                    >
                        Saqlash
                    </Button>
                </Box>
            </Modal>
            <Snackbar
                open={successSnackbar}
                onClose={handleCloseSnackbar}
                severity={snackbarStatus == 'success' ? 'success' : 'error'}
                massage={snackbarStatus == 'success' ? 'To\'lov muvaffaqiyatli amalga oshirildi' : 'Xatolik yuz berdi'}
            />
            <Snackbar
                open={successAddSnackbar}
                onClose={handleAddCloseSnackbar}
                severity={successAdd == 'success' ? 'success' : 'error'}
                massage={successAdd == 'success' ? 'O\'quvchi muvaffaqiyatli qo\'shildi' : 'Xatolik yuz berdi'}
            />
        </Global>
    );
};

HeaderAdmin.propTypes = {
    state: PropTypes.bool.isRequired,
    width: PropTypes.string.isRequired
};

export default HeaderAdmin;
