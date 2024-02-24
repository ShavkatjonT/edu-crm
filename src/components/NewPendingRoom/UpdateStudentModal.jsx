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

const UpdateStudentModal = ({itemData, closeFun, updateFun, loaderStart, loaderStop}) => {
    const { user } = useContext(Context);
    const navigate = useNavigate();
    const [genderUpdate, setGenderUpdate] = useState(itemData?.gender);
    const [firstnameUpdate, setFirstnameUpdate] = useState(itemData?.firstname);
    const [birthdayUpdate, setBirthdayUpdate] = useState(itemData?.birthday);
    const [lastnameUpdate, setLastnameUpdate] = useState(itemData?.lastname);
    const [fathernameUpdate, setFathernameUpdate] = useState(itemData?.fathername?.trim() ? itemData?.fathername : '');
    const [classValueUpdate, setClassValueUpdate] = useState(itemData?.class?.trim() ? itemData?.class : '');
    const [addressUpdate, setAddressUpdate] = useState(itemData?.address?.trim() ? itemData?.address : '');
    const [phoneFathUpdate, setPhoneFathUpdate] = useState({
        textmask: itemData?.fatherPhone?.length == 19 ? itemData?.fatherPhone : '+998',
    });
    const [phoneMothUpdate, setPhoneMothUpdate] = useState({
        textmask: itemData?.motherPhone?.length == 19 ? itemData?.motherPhone : '+998',
    });
    const [errorDataUpdate, setErrorDataUpdate] = useState(false);
    const [studentLastName, setStudentLastName] = useState(itemData?.lastname);
    const [studentName, setStudentName] = useState(itemData?.firstname);
    const [whereUpdateStudent, setWhereUpdateStudent] = useState(itemData?.where_user);
    const [updateStudentId, setUpdateStudentId] = useState(itemData?.id);
   
    const changeUpdateWhere = (e) => {
        setWhereUpdateStudent(e.target.value);
    };

    const fatherPhoneUpdate = (event) => {
        setPhoneFathUpdate({
            [event.target.name]: event.target.value,
        });
        setErrorDataUpdate(false);
    };

    const motherPhoneUpdate = (event) => {
        setPhoneMothUpdate({
            [event.target.name]: event.target.value,
        });
        setErrorDataUpdate(false);
    };

    const handleChangeUpdate = (event) => {
        setGenderUpdate(event.target.value);
        setErrorDataUpdate(false);
    };

    const handleChangeClassUpdate = (event) => {
        setClassValueUpdate(event.target.value);
        setErrorDataUpdate(false);
    };

    const itemsUpdate = () => {
        if (whereUpdateStudent && firstnameUpdate && !/^\s*$/.test(firstnameUpdate) &&
            lastnameUpdate && !/^\s*$/.test(lastnameUpdate) &&
            genderUpdate &&
            phoneFathUpdate.textmask.length == 19) {
            loaderStart();
            http
                .post(
                    import.meta.env.VITE_API_URL + `api/new-pending-student/put/${updateStudentId}`,
                    {
                        firstname: firstnameUpdate,
                        lastname: lastnameUpdate,
                        gender: genderUpdate,
                        birthday: birthdayUpdate ? birthdayUpdate : ' ',
                        fathername: fathernameUpdate.length > 1 ? fathernameUpdate : ' ',
                        address: addressUpdate ? addressUpdate : ' ',
                        fatherPhone: phoneFathUpdate.textmask.length == 19 ? phoneFathUpdate.textmask : ' ',
                        motherPhone: phoneMothUpdate.textmask.length == 19 ? phoneMothUpdate.textmask : ' ',
                        classStudentdent: classValueUpdate ? classValueUpdate : ' ',
                        where: whereUpdateStudent
                    }
                )
                .then(() => {
                    loaderStop();
                    setStudentLastName('');
                    setStudentName('');
                    setUpdateStudentId('');
                    updateFun();
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
        }else{
            setErrorDataUpdate(true);
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
                    onClick={() => closeFun()}
                />
                <h2 style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }}>{studentName + ' ' + studentLastName}</h2>
                <p style={{ marginTop: '0.5rem' }}>
                    o&apos;quvchi ma&apos;lumotlarini tahrirlash
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
                            onChange={(e) => { setFirstnameUpdate(e.target.value); setErrorDataUpdate(false); }}
                            value={firstnameUpdate}
                            type={'search'}
                        />
                    </div>
                    <div>
                        <TextField
                            fullWidth
                            label="O'quvchi familyani kiriting..."
                            id="outlined-size-large"
                            onChange={(e) => {
                                setLastnameUpdate(e.target.value);
                                setErrorDataUpdate(false);
                            }}
                            value={lastnameUpdate}
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
                                setFathernameUpdate(e.target.value);
                                setErrorDataUpdate(false);
                            }}
                            value={fathernameUpdate}
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
                                value={genderUpdate}
                                label="Jinsini tanlang..."
                                onChange={handleChangeUpdate}
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
                                setBirthdayUpdate(e.target.value);
                                setErrorDataUpdate(false);
                            }}
                            value={birthdayUpdate}
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
                                setAddressUpdate(e.target.value);
                                setErrorDataUpdate(false);
                            }}
                            value={addressUpdate}
                            type={'search'}
                        />
                    </div>
                    <div>
                        <TextField
                            fullWidth
                            label="Otasining telefon raqamini kiriting..."
                            value={phoneFathUpdate.textmask}
                            onChange={fatherPhoneUpdate}
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
                            value={phoneMothUpdate.textmask}
                            onChange={motherPhoneUpdate}
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
                                value={classValueUpdate}
                                label="O'quvchi sinfini tanlang"
                                onChange={handleChangeClassUpdate}
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
                        <RadioGroup row value={whereUpdateStudent} onChange={changeUpdateWhere}>
                            <FormControlLabel value='default' control={<Radio />} label="O'zi tashrif buyurdi" />
                            <FormControlLabel value='instagram' control={<Radio />} label="Instagram" />
                            <FormControlLabel value='telegram' control={<Radio />} label="Telegram" />
                            <FormControlLabel value='website' control={<Radio />} label="Web sayt" />
                        </RadioGroup>
                    </FormControl>
                </div>
                <p
                    style={{
                        display: errorDataUpdate ? 'block' : 'none',
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
                        onClick={itemsUpdate}
                    >
                        Saqlash
                    </Button>
                </div>
            </div>
        </div>
    );
};

UpdateStudentModal.propTypes = {
    itemData: PropTypes.object.isRequired,
    closeFun: PropTypes.func.isRequired,
    updateFun: PropTypes.func.isRequired,
    loaderStart: PropTypes.func.isRequired,
    loaderStop: PropTypes.func.isRequired,
};

export default UpdateStudentModal;