import React, { useState, useContext } from 'react';
import http from '../../http/index';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';
import { Context } from '../../index';
import { TextField, Button, FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton, Select, MenuItem, FormHelperText } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import styled from 'styled-components';
import { IMaskInput } from 'react-imask';

const AddTeacherContent = styled.div`
  width: 750px;
  height: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border: none;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  padding-bottom: 1rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  padding-bottom: 1.5rem;
  -webkit-box-shadow: -1px 12px 8px 0px rgba(34, 60, 80, 0.2);
  -moz-box-shadow: -1px 12px 8px 0px rgba(34, 60, 80, 0.2);
  box-shadow: -1px 12px 8px 0px rgba(34, 60, 80, 0.2);
  .addModalHeader {
    position: absolute;
    top: 0;
    left: 0;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    width: 100%;
    padding-right: 0.5rem;
    padding-top: 0.7rem;
    padding-left: 1.5rem;
    background-color: #fdc600;
    height: 5rem;
    z-index: 1;
    .addModalHeaderName {
      margin-top: 1rem;
      font-family: sans-serif;
      color: #191919;
    }
  }
  .errorPassword {
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
  .close_modal_btn {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    border: none;
    background-color: initial;
    font-size: 1.3rem;
    cursor: pointer;
    color: #272727;
    font-weight: 600;
    transition: all 0.5s;
    &:hover {
      color: #3a3939;
    }
  }
  .addModalContent {
    margin-top: 7rem;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-bottom: 25px;
  }
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

const UpdateAdminModal = ({ closeFun, updateFun, openLoader, stopLoader, adminData, }) => {
    const navigate = useNavigate();
    const { user } = useContext(Context);
    const [addAdminName, setAddAdminName] = useState(adminData?.data?.firstname);
    const [addAdminFatherName, setAddAdminFatherName] = useState(adminData?.data?.fathername);
    const [addAdminLastName, setAddAdminLastName] = useState(adminData?.data?.lastname);
    const [addAdminAddress, setAddAdminAddress] = useState(adminData?.data?.address);
    const [addAdminBirthday, setAddAdminBirthday] = useState(adminData?.data?.birthday);
    const [addAdminPhone, setAddAdminPhone] = useState({
        textmask: adminData?.data?.phone,
    });
    const [addAdminPhoneSecond, setAddAdminPhoneSecond] = useState({
        textmask: adminData?.data?.phone_2,
    });
    const [addAdminGender, setAddAdminGender] = useState(adminData?.data?.gender);
    const [addAdminLoginTextfield, setAddAdminLoginTextfield] = useState(adminData?.email);
    const [addAdminTelegramIdTextfield, setAddAdminTelegramIdTextfield] = useState(adminData?.telegram_id);
    const [addAdminPasswordTextfield, setAddAdminPasswordTextfield] = useState('');
    const [errorAddAdminName, setErrorAddAdminName] = useState(false);
    const [errorAddAdminLastName, setErrorAddAdminLastName] = useState(false);
    const [errorAddAdminBirthday, setErrorAddAdminBirthday] = useState(false);
    const [errorAddAdminAddress, setErrorAddAdminAddress] = useState(false);
    const [errorAddAdminPhone, setErrorAddAdminPhone] = useState(false);
    const [errorAddAdminPhoneSecond, setErrorAddAdminPhoneSecond] = useState(false);
    const [errorAddAdminGender, setErrorAddAdminGender] = useState(false);
    const [errorAddAdminLogin, setErrorAddAdminLogin] = useState(false);
    const [errorAddAdminFalseLogin, setErrorAddAdminFalseLogin] = useState(false);
    const [errorAddAdminLoginNotComplate, setErrorAddAdminFalseLoginNotComplate] = useState(false);
    const [errorAddAdminPassword, setErrorAddAdminPassword] = useState(false);
    const [errorAddAdminPasswordNotComplate, setErrorAddAdminFalsePasswordNotComplate] = useState(false);
    const [showPasswordAddModal, setShowPasswordAddModal] = useState(false);

    const addAdminNameChange = (e) => {
        setAddAdminName(e.target.value);
        setErrorAddAdminName(false);
    };
    const addAdminLastNameChange = (e) => {
        setAddAdminLastName(e.target.value);
        setErrorAddAdminLastName(false);
    };
    const addAdminLastFatherChange = (e) => {
        setAddAdminFatherName(e.target.value);
    };
    const addAdminAddressChange = (e) => {
        setAddAdminAddress(e.target.value);
        setErrorAddAdminAddress(false);
    };
    const addAdminTelegramIdChange = (e) => {
        setAddAdminTelegramIdTextfield(e.target.value);
    };
    const addAdminBirthdayChange = (e) => {
        setAddAdminBirthday(e.target.value);
        setErrorAddAdminBirthday(false);
    };
    const addAdminPhoneChange = (event) => {
        setAddAdminPhone({
            [event.target.name]: event.target.value,
        });
        setErrorAddAdminPhone(false);
    };
    const addAdminPhoneSecondChange = (event) => {
        setAddAdminPhoneSecond({
            [event.target.name]: event.target.value,
        });
        setErrorAddAdminPhoneSecond(false);
    };
    const addAdminGenderChange = (e) => {
        setAddAdminGender(e.target.value);
        setErrorAddAdminGender(false);
    };
    const addAdminLoginChange = (e) => {
        setAddAdminLoginTextfield(e.target.value);
        setErrorAddAdminLogin(false);
    };

    const addAdminPasswordChange = (e) => {
        setAddAdminPasswordTextfield(e.target.value);
        setErrorAddAdminPassword(false);
    };
    const handleClickShowPasswordAddModal = () =>
        setShowPasswordAddModal((showAdd) => !showAdd);

    const handleMouseDownPasswordAddModal = (eventAdd) => {
        eventAdd.preventDefault();
    };

    const updateAdmin = () => {
        if (
            addAdminName && !/^\s*$/.test(addAdminName) &&
            addAdminLastName && !/^\s*$/.test(addAdminLastName) &&
            addAdminPhone.textmask.length == 19 &&
            addAdminPhoneSecond.textmask.length == 19 &&
            addAdminBirthday &&
            addAdminGender &&
            addAdminAddress &&
            addAdminLoginTextfield && !/^\s*$/.test(addAdminLoginTextfield) &&
            addAdminPasswordTextfield && !/^\s*$/.test(addAdminPasswordTextfield)) {
            if (
                addAdminLoginTextfield.length >= 4 &&
                addAdminPasswordTextfield.length >= 4
            ) {
                openLoader();
                http
                    .post(import.meta.env.VITE_API_URL + 'api/teacher/cabinet-data-update', {
                        id: adminData?.data.id,
                        user_id:  adminData.id,
                        firstname: addAdminName,
                        lastname: addAdminLastName,
                        fathername: addAdminFatherName ? addAdminFatherName : '',
                        gender: addAdminGender,
                        birthday: addAdminBirthday,
                        address: addAdminAddress,
                        phone: addAdminPhone.textmask,
                        phone_2: addAdminPhoneSecond.textmask,
                        telegram_id: addAdminTelegramIdTextfield ? addAdminTelegramIdTextfield : '',
                        email: addAdminLoginTextfield,
                        password: addAdminPasswordTextfield,
                    })

                    .then(() => {
                        stopLoader();
                        updateFun();
                    })
                    .catch((error) => {
                        stopLoader();
                        setErrorAddAdminFalseLogin(true);
                        setErrorAddAdminLogin(false);
                        setErrorAddAdminPassword(false);
                        setErrorAddAdminFalseLoginNotComplate(false);
                        setErrorAddAdminFalsePasswordNotComplate(false);
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
                if (addAdminLoginTextfield.length < 4) {
                    setErrorAddAdminFalseLoginNotComplate(true);
                    setErrorAddAdminLogin(false);
                    setErrorAddAdminFalseLogin(false);
                } else {
                    setErrorAddAdminFalseLoginNotComplate(false);
                }
                if (addAdminPasswordTextfield.length < 4) {
                    setErrorAddAdminFalsePasswordNotComplate(true);
                    setErrorAddAdminPassword(false);
                    setErrorAddAdminFalseLogin(false);
                } else {
                    setErrorAddAdminFalsePasswordNotComplate(false);
                }
            }
        } else {
            if (!addAdminName || /^\s*$/.test(addAdminName)) {
                setErrorAddAdminName(true);
            } else {
                setErrorAddAdminName(false);
            }
            if (!addAdminLastName || /^\s*$/.test(addAdminLastName)) {
                setErrorAddAdminLastName(true);
            } else {
                setErrorAddAdminLastName(false);
            }
            if (addAdminPhone.textmask.length !== 19) {
                setErrorAddAdminPhone(true);
            } else {
                setErrorAddAdminPhone(false);
            }
            if (addAdminPhoneSecond.textmask.length !== 19) {
                setErrorAddAdminPhoneSecond(true);
            } else {
                setErrorAddAdminPhoneSecond(false);
            }
            if (!addAdminGender) {
                setErrorAddAdminGender(true);
            } else {
                setErrorAddAdminGender(false);
            }
            if (!addAdminBirthday) {
                setErrorAddAdminBirthday(true);
            } else {
                setErrorAddAdminBirthday(false);
            }
            if (!addAdminAddress) {
                setErrorAddAdminAddress(true);
            } else {
                setErrorAddAdminAddress(false);
            }
            if (!addAdminLoginTextfield || /^\s*$/.test(addAdminLoginTextfield)) {
                setErrorAddAdminLogin(true);
                setErrorAddAdminFalseLogin(false);
                setErrorAddAdminFalseLoginNotComplate(false);
            } else {
                setErrorAddAdminLogin(false);
            }
            if (!addAdminPasswordTextfield || /^\s*$/.test(addAdminPasswordTextfield)) {
                setErrorAddAdminPassword(true);
                setErrorAddAdminFalsePasswordNotComplate(false);
            } else {
                setErrorAddAdminPassword(false);
            }
        }
    };

    return (
        <AddTeacherContent>
            <div className="addModalHeader">
                <button
                    className="close_modal_btn"
                    onClick={() => closeFun()}
                >
                    <CloseIcon />
                </button>
                <h2 className="addModalHeaderName">
                    {adminData?.data?.firstname + ' ' + adminData?.data?.lastname}
                </h2>
            </div>
            <div className="addModalContent">
                <TextField
                    fullWidth
                    label="Ism"
                    id="outlined-size-large"
                    size="large"
                    value={addAdminName}
                    onChange={addAdminNameChange}
                    type={'text'}
                    helperText={errorAddAdminName ? 'Ismingizni kiriting' : null}
                />
                <TextField
                    fullWidth
                    label="Familiya"
                    id="outlined-size-large"
                    size="large"
                    value={addAdminLastName}
                    onChange={addAdminLastNameChange}
                    type={'text'}
                    helperText={errorAddAdminLastName ? 'Familiyangizni kiriting' : null}
                />
                <TextField
                    fullWidth
                    label="Otasining ismi"
                    id="outlined-size-large"
                    size="large"
                    value={addAdminFatherName}
                    onChange={addAdminLastFatherChange}
                    type={'text'}
                />
                <FormControl fullWidth>
                    <InputLabel id='demo-simple-select-label'>
                        Jinsini tanlang
                    </InputLabel>
                    <Select
                        labelId='demo-simple-select-label'
                        id='demo-simple-select'
                        value={addAdminGender}
                        label='Jinsini tanlang'
                        onChange={addAdminGenderChange}
                    >
                        <MenuItem value={'erkak'}>Erkak</MenuItem>
                        <MenuItem value={'ayol'}>Ayol</MenuItem>
                    </Select>
                    <FormHelperText style={{ display: errorAddAdminGender ? 'block' : 'none' }}>Jinsni tanlang</FormHelperText>
                </FormControl>
                <TextField
                    fullWidth
                    className='databirthday'
                    id='date'
                    label="Tug'ilgan sanani kiriting"
                    type='date'
                    onChange={addAdminBirthdayChange}
                    value={addAdminBirthday}
                    helperText={errorAddAdminBirthday ? 'Tug\'ilgan sanani kiriting' : null}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    fullWidth
                    label="Manzil"
                    id="outlined-size-large"
                    size="large"
                    value={addAdminAddress}
                    onChange={addAdminAddressChange}
                    type={'text'}
                    helperText={errorAddAdminAddress ? 'Manzilni kiriting' : null}
                />
                <TextField
                    fullWidth
                    label='Telefon raqam'
                    value={addAdminPhone.textmask}
                    onChange={addAdminPhoneChange}
                    name='textmask'
                    id='formatted-text-mask-input'
                    helperText={errorAddAdminPhone ? 'Telefon raqamni kiriting' : null}
                    InputProps={{
                        inputComponent: TextMaskCustom,
                    }}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    fullWidth
                    label='Ikkinchi telefon raqam'
                    value={addAdminPhoneSecond.textmask}
                    onChange={addAdminPhoneSecondChange}
                    name='textmask'
                    id='formatted-text-mask-input'
                    helperText={errorAddAdminPhoneSecond ? 'Ikkinchi telefon raqamni kiriting' : null}
                    InputProps={{
                        inputComponent: TextMaskCustom,
                    }}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    fullWidth
                    label="Telegram ID"
                    id="outlined-size-large"
                    size="large"
                    value={addAdminTelegramIdTextfield}
                    onChange={addAdminTelegramIdChange}
                    type={'text'}
                />
                <div>
                    <TextField
                        fullWidth
                        label="Login"
                        id="outlined-size-large"
                        size="large"
                        value={addAdminLoginTextfield}
                        onChange={addAdminLoginChange}
                        type={'text'}
                        helperText={errorAddAdminLogin ? 'Loginni kiriting' : null}
                    />
                    <p
                        className="errorEmailPart"
                        style={{ display: errorAddAdminFalseLogin ? 'block' : 'none' }}
                    >
                        Ushbu loginga tegishli foydalanuvchi mavjud
                    </p>
                    <p
                        className="errorEmailPart"
                        style={{
                            display: errorAddAdminLoginNotComplate ? 'block' : 'none',
                        }}
                    >
                        Eng kamida 4 ta belgi kiritish zarur
                    </p>
                </div>
                <FormControl sx={{ width: '100%' }} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">
                        Parol
                    </InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        value={addAdminPasswordTextfield}
                        onChange={addAdminPasswordChange}
                        type={showPasswordAddModal ? 'text' : 'password'}
                        // onKeyPress={(event) => {
                        //   if (event.key === 'Enter') {
                        //     addTeacherCall();
                        //   }
                        // }}
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
                        className="errorPassword"
                        style={{
                            display: errorAddAdminPassword ? 'block' : 'none',
                        }}
                    >
                        Parolni kiriting
                    </p>
                    <p
                        className="errorPassword"
                        style={{
                            display: errorAddAdminPasswordNotComplate
                                ? 'block'
                                : 'none',
                        }}
                    >
                        Eng kamida 4 ta belgi kiritish zarur
                    </p>
                </FormControl>
            </div>
            <Button
                sx={{ pt: 1, pb: 1 }}
                fullWidth
                className="buy_btn_modal"
                variant="contained"
                onClick={updateAdmin}
            >
                Saqlash
            </Button>
        </AddTeacherContent>
    );
};

UpdateAdminModal.propTypes = {
    closeFun: PropTypes.func.isRequired,
    updateFun: PropTypes.func.isRequired,
    openLoader: PropTypes.func.isRequired,
    stopLoader: PropTypes.func.isRequired,
    adminData: PropTypes.object.isRequired,
    ceoUpdate: PropTypes.bool.isRequired,
    isCeo: PropTypes.bool.isRequired,
};


export default UpdateAdminModal;