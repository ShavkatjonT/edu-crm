import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../index';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import http from '../../http/index';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import { Select, FormControl, InputLabel } from '@mui/material';
import { IMaskInput } from 'react-imask';
import PropTypes from 'prop-types';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormLabel from '@mui/material/FormLabel';
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

const AddStudentModal = ({ closeFun, updateFun, loaderStart, loaderStop }) => {
    const { user } = useContext(Context);
    const navigate = useNavigate();
    const [whereAddStudent, setWhereAddStudent] = useState('default');
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
    const [errorData, setErrorData] = useState(false);
    const closeAddStudentModal = () => {
        closeFun();
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

    const changeAddWhere = (e) => {
        setWhereAddStudent(e.target.value);
    };

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

    const itemsAdd = () => {
        if (whereAddStudent && firstname && !/^\s*$/.test(firstname) &&
            lastname && !/^\s*$/.test(lastname) &&
            gender &&
            phoneFath.textmask.length == 19) {
            loaderStart();
            http
                .post(import.meta.env.VITE_API_URL + 'api/new-pending-student/add', {
                    firstname: firstname,
                    gender: gender,
                    birthday: birthday ? birthday : ' ',
                    lastname: lastname,
                    fathername: fathername ? fathername : ' ',
                    address: address ? address : ' ',
                    fatherPhone: phoneFath.textmask.length == 19 ? phoneFath.textmask : ' ',
                    motherPhone: phoneMoth.textmask.length == 19 ? phoneMoth.textmask : ' ',
                    classStudentdent: classValue ? classValue : ' ',
                    where: whereAddStudent
                })
                .then(() => {
                    closeAddStudentModal();
                    loaderStop();
                    updateFun();
                })
                .catch((error) => {
                    if (error.response.data.message == 'ro\'yxattan o\'tmagan foydalanuvchi!') {
                        user.setIsAuth(false);
                        localStorage.clear();
                        navigate('/');
                    } else {
                        console.log(error);
                    }
                    console.log(94, error);
                });
        } else {
            setErrorData(true);
        }
    };

    return (
        <div id='addStudentPendingModal'>
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
            <div className='contentsPartPending'>
                <div className='inputsPartPending'>
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
                <div>
                    <FormControl>
                        <FormLabel>Qaysi yo&apos;l bilan tashrif buyurdi</FormLabel>
                        <RadioGroup row value={whereAddStudent} onChange={changeAddWhere}>
                            <FormControlLabel value='default' control={<Radio />} label="O'zi tashrif buyurdi" />
                            <FormControlLabel value='instagram' control={<Radio />} label="Instagram" />
                            <FormControlLabel value='telegram' control={<Radio />} label="Telegram" />
                            <FormControlLabel value='website' control={<Radio />} label="Web sayt" />
                        </RadioGroup>
                    </FormControl>
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
                        onClick={itemsAdd}
                    >
                        Qo&apos;shish
                    </Button>
                </div>
            </div>
        </div>
    );
};

AddStudentModal.propTypes = {
    closeFun: PropTypes.func.isRequired,
    updateFun: PropTypes.func.isRequired,
    loaderStart: PropTypes.func.isRequired,
    loaderStop: PropTypes.func.isRequired,
};

export default AddStudentModal;