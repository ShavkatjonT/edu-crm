import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../index';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import { TextField } from '@mui/material';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Loder from '../loder/Loder';
import http from '../../http/index';
import FormHelperText from '@mui/material/FormHelperText';
import Tooltip from '@mui/material/Tooltip';
import Skeleton from '@mui/material/Skeleton';
import Fade from '@mui/material/Fade';
import { HiUserAdd } from 'react-icons/hi';
import Snackbar from '../Snackbar/Snackbar';


const ContentSkeleton = styled.div`
  margin-top: 1.8rem;
  padding-top: 2rem;
  padding-left: 2rem;
  padding-right: 2rem;
  padding-bottom: 2rem;
  background-color: white;
  border-radius: 6px;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.25);
  cursor: wait;
`;

const Container = styled.div`
  margin-top: 1.8rem;
  padding-top: 10px;
  padding-bottom: 10px;
  background-color: white;
  border-radius: 6px;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.25);
`;
const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 20px;
  justify-content: space-between;
  h2{
    color: rgb(4,41,84);
  }
`;
const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;
  width: 50%;
  a {
    color: #00c335;
    cursor: pointer;
    font-size: 1.2rem;
    transition: all 0.8s;
    margin: 0 4%;
    transform: rotateZ(20deg);
    &:hover {
      color: #229e43;
      transform: rotateZ(200deg);
    }
  }
`;
const SectionOne = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  .addTeacher {
    border: none;
    background-color: initial;
    width: 2.2rem;
    font-size: 24px;
    height: 2.15rem;
    cursor: pointer;
    color: #033a6b;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    outline: 1.5px solid #033a6b;
    border-radius: 50%;
    border: none;
    &:hover {
      background-color: #033a6b;
      color: #fff;
    }
  }
`;
const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
  border: 1px solid #efefef;
  color: #7d7d7d;
  background-color: #ffffff;
  border-bottom: none;
  th,
  td {
    border-left: none;
    border-top: none;
    border-collapse: collapse;
    border-bottom: none;
    border-right: none;
    text-align: center;
  }
  tr {
    border-left: none;
    border-bottom: none;
    border-collapse: collapse;
    border-right: none;
  }
  .number {
    text-align: center;
  }
`;
const TableHeader = styled.tr`
  width: 100%;
  display: flex;

  border-bottom: 1px solid #efefef;
  .number_th {
    width: 20%;
    text-align: left;
    padding-left: 1.5%;
  }
  .teacher_th {
    width: 45%;
    text-align: left;
  }
  .login_th {
    width: 35%;
    text-align: left;
  }

  .action_th {
    width: 15%;
    text-align: right;
    padding-right: 2%;
  }
`;

const Section = styled.tbody`
  width: 100%;
  tr {
    height: 50px;
    &:nth-child(even) {
      background-color: #f8f8f8;
    }
    display: flex;
  }
  td {
    padding-top: 1%;
  }
  .number_table {
    width: 20%;
    text-align: left;
    padding-left: 1.5%;
  }
  .teacher_table {
    width: 45%;
    text-align: left;
  }
  .login_table {
    width: 35%;
    text-align: left;
  }

  .action_table {
    width: 15%;
    text-align: right;
    padding-right: 2%;
  }

  .edit {
    background-color: initial;
    color: #585353;
    border: none;
    font-size: 1rem;
    margin-left: 1rem;
    margin-right: 1rem;
    cursor: pointer;
    transition: all 0.5;
    &:hover {
      color: #7d7d7d;
    }
  }
  .delete {
    background-color: initial;
    color: #c20404;
    border: none;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.5;
    &:hover {
      color: #ff0808;
    }
  }
`;

const ModalBuyUpdate = styled.div`
  width: 400px;
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
  .updateModalHeader {
    position: absolute;
    top: 0;
    left: 0;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    width: 100%;
    padding: 0.7rem 1.5rem;
    background-color: #fdc600;
    height: 6.5rem;
    z-index: 1;
    .updateModalHeaderName {
      margin-top: 1rem;
      margin-bottom: 0.6rem;
      font-family: sans-serif;
      color: #191919;
    }
  }
  .errorPasswordUpdateText {
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

  .errorEmailPartUpdate {
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
  .updateModalContent {
    margin-top: 8rem;
  }
`;
const AddTeacherContent = styled.div`
  width: 400px;
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
  }
`;

const AllGroupsDeleteModal = styled.div`
  width: 500px;
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
  padding-left: 1rem;
  padding-right: 1rem;
  -webkit-box-shadow: -1px 12px 8px 0px rgba(34, 60, 80, 0.2);
  -moz-box-shadow: -1px 12px 8px 0px rgba(34, 60, 80, 0.2);
  box-shadow: -1px 12px 8px 0px rgba(34, 60, 80, 0.2);
  .close_modal {
    display: flex;
    justify-content: end;
    padding-top: 0.8rem;
  }
  .close_modal_btn {
    border: none;
    background-color: initial;
    font-size: 1.3rem;
    cursor: pointer;
    color: #929292;
    font-weight: 600;
    transition: all 0.5s;
    &:hover {
      color: #272727;
    }
  }
  .delete_icon_div {
    display: flex;
    justify-content: center;
    align-items: center;
    .delete_icon {
      width: 16%;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      padding-top: 0.8rem;
      padding-bottom: 0.8rem;
      background: #ebe9e9;
      img {
        width: 3rem;
      }
    }
  }

  .header_Modal {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1rem 0.8rem;
    p {
      font-size: 1.1rem;
      font-weight: 600;
    }
  }
  .allGroups_delete_modal_part {
    display: flex;
    justify-content: flex-end;
    button {
      text-transform: capitalize;
      margin: 1rem 10px 0;
    }
    .delete_modal_btn_error {
      background-color: #b9b9b9;
    }
  }
  .allGroups_delete_notification_part {
    display: flex;
    justify-content: center;
    text-align: center;
    font-size: 1.3rem;
    margin-top: 1.1rem;
    margin-bottom: 1.1rem;
  }
`;

function PrivateCabinet() {
  const navigate = useNavigate();
  const { user } = useContext(Context);
  const [updateTeacherModal, setupdateTeacherModal] = useState(false);
  const [updateLoginTextfield, setupdateLoginTextfield] = useState('');
  const [updatePasswordTextfield, setupdatePasswordTextfield] = useState('');
  const [addTeacherModal, setaddTeacherModal] = useState(false);
  const [addTeacherLoginPart, setaddTeacherLoginPart] = useState('');
  const [addTeacherPasswordPart, setaddTeacherPasswordPart] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordAddModal, setShowPasswordAddModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [teacherSelect, setTeacherSelect] = useState('');
  const [cabinetData, setcabinetData] = useState();
  const [cabinetDataAddTeacher, setcabinetDataAddTeacher] = useState();
  const [loderTime, setLoderTime] = useState(false);
  const [errorSelectTeacher, seterrorSelectTeacher] = useState(false);
  const [errorAddLogin, seterrorAddLogin] = useState(false);
  const [errorAddPassword, seterrorAddPassword] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [deleteName, setDeleteName] = useState([]);
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorEmailUpdate, setErrorEmailUpdate] = useState(false);
  const [errorPasswordUpdate, setErrorPasswordUpdate] = useState(false);
  const [errorCallEmail, setErrorCallEmail] = useState(false);
  const [errorCallLimitEmailAdd, setErrorLimitEmailAdd] = useState(false);
  const [skeletonTime, setSkeletonTime] = useState(true);
  const [errorCallLimitPasswordAdd, setErrorCallLimitPasswordAdd] =
    useState(false);
  const [errorLimitUpdateLogin, setErrorLimitUpdateLogin] = useState(false);
  const [successAddTeacher, setSuccessAddTeacher] = useState(false);
  const [successUpdateTeacher, setSuccessUpdateTeacher] = useState(false);
  const [successDeleteTeacher, setSuccessDeleteTeacher] = useState(false);
  const [successAddAdmin, setSuccessAddAdmin] = useState(false);
  const [successUpdateAdmin, setSuccessUpdateAdmin] = useState(false);
  const [successDeleteAdmin, setSuccessDeleteAdmin] = useState(false);
  const [errorLimitUpdatePassword, setErrorLimitUpdatePassword] =
    useState(false);
  const [dataUpdate, setDataUpdate] = useState(false);
  const [openAddAdminModal, setOpenAddAdminModal] = useState(false);
  const [addAdminLoginTextfield, setAddAdminLoginTextfield] = useState('');
  const [addAdminPasswordTextfield, setAddAdminPasswordTextfield] = useState('');
  const [addAdminTelegramIDTextfield, setAddAdminTelegramIDTextfield] = useState('');
  const [errorAddAdminLogin, setErrorAddAdminLogin] = useState(false);
  const [errorAddAdminFalseLogin, setErrorAddAdminFalseLogin] = useState(false);
  const [errorAddAdminLoginNotComplate, setErrorAddAdminFalseLoginNotComplate] = useState(false);
  const [errorAddAdminPassword, setErrorAddAdminPassword] = useState(false);
  const [errorAddAdminPasswordNotComplate, setErrorAddAdminFalsePasswordNotComplate] = useState(false);
  const [errorAddAdminTelegramID, setErrorAddAdminTelegramID] = useState(false);
  const [adminsData, setAminsData] = useState([]);
  const [infoAdmin, setInfoAdmin] = useState({});
  const [updateAdminModal, setUpdateAdminModal] = useState(false);
  const [updateAdminLoginTextfield, setUpdateAdminLoginTextfield] = useState('');
  const [updateAdminPasswordTextfield, setUpdateAdminPasswordTextfield] = useState('');
  const [updateAdminTelegramIDTextfield, setUpdateAdminTelegramIDTextfield] = useState('');
  const [errorUpdateAdminLogin, setErrorUpdateAdminLogin] = useState(false);
  const [errorUpdateAdminFalseLogin, setErrorUpdateAdminFalseLogin] = useState(false);
  const [errorUpdateAdminLoginNotComplate, setErrorUpdateAdminFalseLoginNotComplate] = useState(false);
  const [errorUpdateAdminPassword, setErrorUpdateAdminPassword] = useState(false);
  const [errorUpdateAdminPasswordNotComplate, setErrorUpdateAdminFalsePasswordNotComplate] = useState(false);
  const [errorUpdateAdminTelegramID, setErrorUpdateAdminTelegramID] = useState(false);
  const [deleteAdminModal, setDeleteAdminModal] = useState(false);

  useEffect(() => {
    http
      .get(import.meta.env.VITE_API_URL + 'api/teacher/all/cabinet/list/get')
      .then((r) => {
        setcabinetData(r.data.filterData);
        setAminsData(r.data.adminData);
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

    http
      .get(import.meta.env.VITE_API_URL + 'api/teacher/all/login/list/get')
      .then((res) => {
        setcabinetDataAddTeacher(res.data);
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
    if (dataUpdate) {
      http
        .get(import.meta.env.VITE_API_URL + 'api/teacher/all/cabinet/list/get')
        .then((r) => {
          setcabinetData(r.data.filterData);
          setAminsData(r.data.adminData);
          setDataUpdate(false);
          setLoderTime(false);
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

      http
        .get(import.meta.env.VITE_API_URL + 'api/teacher/all/login/list/get')
        .then((res) => {
          setLoderTime(false);
          setcabinetDataAddTeacher(res.data);
          setDataUpdate(false);
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
    }
  }, [dataUpdate]);

  const teacherChange = (event) => {
    setTeacherSelect(event.target.value);
  };

  const updateTeacherFun = (e) => {
    setupdateTeacherModal(true);
    setDeleteName(e);
  };

  const handleOpen = (e) => {
    setOpen(true);
    setDeleteName(e);
  };


  const updateLoginChange = (e) => {
    setupdateLoginTextfield(e.target.value);
  };
  const updatePasswordChange = (e) => {
    setupdatePasswordTextfield(e.target.value);
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleClickShowPasswordAddModal = () =>
    setShowPasswordAddModal((showAdd) => !showAdd);

  const handleMouseDownPasswordAddModal = (eventAdd) => {
    eventAdd.preventDefault();
  };

  const handleClose = () => {
    setOpen(false);
  };

  const addTeacherFunction = () => {
    setaddTeacherModal(true);
  };

  const addLoginChange = (e) => {
    setaddTeacherLoginPart(e.target.value);
  };

  const addPasswordChange = (e) => {
    setaddTeacherPasswordPart(e.target.value);
  };
  const addAdminLoginChange = (e) => {
    setAddAdminLoginTextfield(e.target.value);
    setErrorAddAdminLogin(false);
  };
  const updateAdminLoginChange = (e) => {
    setUpdateAdminLoginTextfield(e.target.value);
    setErrorUpdateAdminLogin(false);
  };

  const addAdminPasswordChange = (e) => {
    setAddAdminPasswordTextfield(e.target.value);
    setErrorAddAdminPassword(false);
  };
  const addUpdatePasswordChange = (e) => {
    setUpdateAdminPasswordTextfield(e.target.value);
    setErrorUpdateAdminPassword(false);
  };
  const addAdminTelegramIDChange = (e) => {
    setAddAdminTelegramIDTextfield(e.target.value);
  };
  const updateAdminTelegramIDChange = (e) => {
    setUpdateAdminTelegramIDTextfield(e.target.value);
  };

  const updateAdminFun = (e) => {
    setInfoAdmin(e);
    setUpdateAdminLoginTextfield(e.email);
    setUpdateAdminTelegramIDTextfield(e.telegram_id);
    setUpdateAdminModal(true);
  };

  const closeUpdateAdmin = () => {
    setUpdateAdminModal(false);
    setUpdateAdminLoginTextfield('');
    setUpdateAdminPasswordTextfield('');
    setUpdateAdminTelegramIDTextfield('');
    setErrorUpdateAdminLogin(false);
    setErrorUpdateAdminFalseLogin(false);
    setErrorUpdateAdminFalseLoginNotComplate(false);
    setErrorUpdateAdminPassword(false);
    setErrorUpdateAdminFalsePasswordNotComplate(false);
    setErrorUpdateAdminTelegramID(false);
  };

  const openDeleteAdminFun = (e) => {
    setInfoAdmin(e);
    setDeleteAdminModal(true);
  };

  const closeDeleteAdminFun = () => {
    setDeleteAdminModal(false);
  };


  let data = [];
  let dataAdmins = [];

  if (adminsData) {
    dataAdmins =
      adminsData &&
      adminsData.map((e, index) => {
        return (
          e && (
            <tr className="teacher_information" key={e.id}>
              <td className="number_table">{index + 1}</td>
              <td className="teacher_table">{e.email}</td>
              <td className="login_table">{e.telegram_id ? e.telegram_id : 'Mavjud emas'}</td>
              <td className="action_table">
                <Tooltip
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 600 }}
                  placement="top"
                  title="Tahrirlash"
                  arrow
                >
                  <button
                    className="edit"
                    onClick={() => {
                      updateAdminFun(e);
                    }}
                  >
                    <i className="fa-solid fa-pen"></i>
                  </button>
                </Tooltip>
                <Tooltip
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 600 }}
                  placement="top"
                  title="O'chirish"
                  arrow
                >
                  <button
                    className="delete"
                    onClick={() => {
                      openDeleteAdminFun(e);
                    }}
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </Tooltip>
              </td>
            </tr>
          )
        );
      });
  }
  if (cabinetData) {
    data =
      cabinetData &&
      cabinetData.map((e, index) => {
        return (
          e && (
            <tr className="teacher_information" key={e.id}>
              <td className="number_table">{index + 1}</td>
              <td className="teacher_table">{e.name}</td>
              <td className="login_table">{e.email}</td>
              <td className="action_table">
                <Tooltip
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 600 }}
                  placement="top"
                  title="Tahrirlash"
                  arrow
                >
                  <button
                    className="edit"
                    onClick={() => {
                      updateTeacherFun(e),
                        setDeleteId(e.id),
                        setupdateLoginTextfield(e.email);
                    }}
                  >
                    <i className="fa-solid fa-pen"></i>
                  </button>
                </Tooltip>
                <Tooltip
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 600 }}
                  placement="top"
                  title="O'chirish"
                  arrow
                >
                  <button
                    className="delete"
                    onClick={() => {
                      setDeleteId(e.id), handleOpen(e);
                    }}
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </Tooltip>
              </td>
            </tr>
          )
        );
      });
  }

  const addTeacherCall = () => {
    if (teacherSelect && addTeacherLoginPart && !/^\s*$/.test(addTeacherLoginPart) && addTeacherPasswordPart && !/^\s*$/.test(addTeacherPasswordPart)) {
      if (
        addTeacherLoginPart.length >= 4 &&
        addTeacherPasswordPart.length >= 4
      ) {
        setLoderTime(true);
        http
          .post(import.meta.env.VITE_API_URL + 'api/user/teacher-registration', {
            teacher_id: teacherSelect,
            email: addTeacherLoginPart,
            password: addTeacherPasswordPart,
          })

          .then(() => {
            setDataUpdate(true);
            setaddTeacherModal(false);
            setaddTeacherLoginPart('');
            setaddTeacherPasswordPart('');
            setTeacherSelect('');
            seterrorSelectTeacher(false);
            seterrorAddLogin(false);
            seterrorAddPassword(false);
            setErrorEmail(false);
            setErrorLimitEmailAdd(false);
            setErrorCallLimitPasswordAdd(false);
            setLoderTime(false);
            setSuccessAddTeacher(true);
          })
          .catch((error) => {
            setLoderTime(false);
            setErrorEmail(true);
            seterrorAddLogin(false);
            seterrorAddPassword(false);
            seterrorSelectTeacher(false);
            setErrorLimitEmailAdd(false);
            setErrorCallLimitPasswordAdd(false);
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
        if (addTeacherLoginPart.length < 4) {
          setErrorLimitEmailAdd(true);
          seterrorAddLogin(false);
          setErrorEmail(false);
          seterrorSelectTeacher(false);
        } else {
          setErrorLimitEmailAdd(false);
        }
        if (addTeacherPasswordPart.length < 4) {
          setErrorCallLimitPasswordAdd(true);
          seterrorAddPassword(false);
          setErrorEmail(false);
          seterrorSelectTeacher(false);
        } else {
          setErrorCallLimitPasswordAdd(false);
        }
      }
    } else {
      if (!teacherSelect) {
        seterrorSelectTeacher(true);
      } else {
        seterrorSelectTeacher(false);
      }
      if (!addTeacherLoginPart || /^\s*$/.test(addTeacherLoginPart)) {
        seterrorAddLogin(true);
        setErrorEmail(false);
        setErrorLimitEmailAdd(false);
      } else {
        seterrorAddLogin(false);
      }
      if (!addTeacherPasswordPart || /^\s*$/.test(addTeacherPasswordPart)) {
        seterrorAddPassword(true);
        setErrorCallLimitPasswordAdd(false);
      } else {
        seterrorAddPassword(false);
      }
    }
  };

  const updateTacherCall = () => {
    if (updateLoginTextfield && !/^\s*$/.test(updateLoginTextfield) && updatePasswordTextfield && !/^\s*$/.test(updatePasswordTextfield)) {
      if (
        updateLoginTextfield.length >= 4 &&
        updatePasswordTextfield.length >= 4
      ) {
        setLoderTime(true);
        http
          .post(import.meta.env.VITE_API_URL + 'api/user/put', {
            id: deleteId,
            email: updateLoginTextfield,
            password: updatePasswordTextfield,
          })
          .then(() => {
            setDataUpdate(true);
            setErrorCallEmail(false);
            setErrorEmailUpdate(false);
            setupdateTeacherModal(false);
            setErrorPasswordUpdate(false);
            setErrorLimitUpdateLogin(false);
            setErrorLimitUpdatePassword(false);
            setupdatePasswordTextfield('');
            setSkeletonTime(false);
            setSuccessUpdateTeacher(true);
          })
          .catch((error) => {
            setLoderTime(false);
            setErrorCallEmail(true);
            setErrorEmailUpdate(false);
            setErrorPasswordUpdate(false);
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
        if (updateLoginTextfield.length < 4) {
          setErrorLimitUpdateLogin(true);
          setErrorEmailUpdate(false);
          setErrorCallEmail(false);
        } else {
          setErrorLimitUpdateLogin(false);
        }
        if (updatePasswordTextfield.length < 4) {
          setErrorLimitUpdatePassword(true);
          setErrorPasswordUpdate(false);
          setErrorCallEmail(false);
        } else {
          setErrorLimitUpdatePassword(false);
        }
      }
    } else {
      if (!updateLoginTextfield || /^\s*$/.test(updateLoginTextfield)) {
        setErrorEmailUpdate(true);
        setErrorLimitUpdateLogin(false);
      } else {
        setErrorEmailUpdate(false);
      }
      if (!updatePasswordTextfield || /^\s*$/.test(updatePasswordTextfield)) {
        setErrorPasswordUpdate(true);
        setErrorLimitUpdatePassword(false);
      } else {
        setErrorPasswordUpdate(false);
      }
    }
  };

  const deleteTeacherFunCall = () => {
    setOpen(false);
    setSkeletonTime(true);
    http
      .post(import.meta.env.VITE_API_URL + 'api/user/delete', {
        id: deleteId,
      })
      .then(() => {
        setDataUpdate(true);
        setSkeletonTime(false);
        setSuccessDeleteTeacher(true);
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
  };

  const addTeacherModalClose = () => {
    setaddTeacherModal(false);
    setaddTeacherLoginPart('');
    setaddTeacherPasswordPart('');
    setTeacherSelect('');
    seterrorSelectTeacher(false);
    seterrorAddLogin(false);
    seterrorAddPassword(false);
    setErrorEmail(false);
    setErrorLimitEmailAdd(false);
    setErrorCallLimitPasswordAdd(false);
  };

  const updateModalClose = () => {
    setupdateTeacherModal(false);
    setupdateLoginTextfield('');
    setupdatePasswordTextfield('');
    setErrorCallEmail(false);
    setErrorPasswordUpdate(false);
    setErrorEmailUpdate(false);
    setupdateTeacherModal(false);
    setErrorPasswordUpdate(false);
    setErrorLimitUpdateLogin(false);
    setErrorLimitUpdatePassword(false);
  };

  const handleCloseBarSuccessAdd = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSuccessAddTeacher(false);
  };
  const handleCloseBarSuccessUpdate = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSuccessUpdateTeacher(false);
  };
  const handleCloseBarSuccessDelete = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSuccessDeleteTeacher(false);
  };
  const handleCloseBarSuccessAdminAdd = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSuccessAddAdmin(false);
  };
  const handleCloseBarSuccessAdminUpdate = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSuccessUpdateAdmin(false);
  };
  const handleCloseBarSuccessAdminDelete = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSuccessDeleteAdmin(false);
  };

  const openAddAdmin = () => {
    setOpenAddAdminModal(true);
  };
  const closeAddAdmin = () => {
    setOpenAddAdminModal(false);
    setAddAdminLoginTextfield('');
    setAddAdminPasswordTextfield('');
    setAddAdminTelegramIDTextfield('');
    setErrorAddAdminLogin(false);
    setErrorAddAdminFalseLogin(false);
    setErrorAddAdminFalseLoginNotComplate(false);
    setErrorAddAdminPassword(false);
    setErrorAddAdminFalsePasswordNotComplate(false);
    setErrorAddAdminTelegramID(false);
    setShowPasswordAddModal(false);
  };

  const addAdmin = () => {
    if (addAdminLoginTextfield && !/^\s*$/.test(addAdminLoginTextfield) && addAdminPasswordTextfield && !/^\s*$/.test(addAdminPasswordTextfield)) {
      if (
        addAdminLoginTextfield.length >= 4 &&
        addAdminPasswordTextfield.length >= 4
      ) {
        setLoderTime(true);
        http
          .post(import.meta.env.VITE_API_URL + 'api/user/registration', {
            email: addAdminLoginTextfield,
            password: addAdminPasswordTextfield,
            telegram_id: addAdminTelegramIDTextfield
          })

          .then(() => {
            setDataUpdate(true);
            closeAddAdmin();
            setSuccessAddAdmin(true);
          })
          .catch((error) => {
            setLoderTime(false);
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

  const updateAdmin = () => {
    if (updateAdminLoginTextfield && !/^\s*$/.test(updateAdminLoginTextfield) && updateAdminPasswordTextfield && !/^\s*$/.test(updateAdminPasswordTextfield)) {
      if (
        updateAdminLoginTextfield.length >= 4 &&
        updateAdminPasswordTextfield.length >= 4
      ) {
        setLoderTime(true);
        http
          .post(import.meta.env.VITE_API_URL + 'api/user/put', {
            id: infoAdmin.id,
            email: updateAdminLoginTextfield,
            password: updateAdminPasswordTextfield,
            telegram_id: updateAdminTelegramIDTextfield
          })
          .then(() => {
            setDataUpdate(true);
            closeUpdateAdmin();
            setSuccessUpdateAdmin(true);
          })
          .catch((error) => {
            setLoderTime(false);
            setErrorUpdateAdminFalseLogin(true);
            setErrorUpdateAdminLogin(false);
            setErrorUpdateAdminPassword(false);
            setErrorUpdateAdminFalseLoginNotComplate(false);
            setErrorUpdateAdminFalsePasswordNotComplate(false);
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
        if (updateAdminLoginTextfield.length < 4) {
          setErrorUpdateAdminFalseLoginNotComplate(true);
          setErrorUpdateAdminLogin(false);
          setErrorUpdateAdminFalseLogin(false);
        } else {
          setErrorUpdateAdminFalseLoginNotComplate(false);
        }
        if (updateAdminPasswordTextfield.length < 4) {
          setErrorUpdateAdminFalsePasswordNotComplate(true);
          setErrorUpdateAdminPassword(false);
          setErrorUpdateAdminFalseLogin(false);
        } else {
          setErrorUpdateAdminFalsePasswordNotComplate(false);
        }
      }
    } else {
      if (!updateAdminLoginTextfield || /^\s*$/.test(updateAdminLoginTextfield)) {
        setErrorUpdateAdminLogin(true);
        setErrorUpdateAdminFalseLogin(false);
        setErrorUpdateAdminFalseLoginNotComplate(false);
      } else {
        setErrorUpdateAdminLogin(false);
      }
      if (!updateAdminPasswordTextfield || /^\s*$/.test(updateAdminPasswordTextfield)) {
        setErrorUpdateAdminPassword(true);
        setErrorUpdateAdminFalsePasswordNotComplate(false);
      } else {
        setErrorUpdateAdminPassword(false);
      }
    }
  };

  const deleteAdmin = () => {
    setDeleteAdminModal(false);
    setLoderTime(true);
    http
      .post(import.meta.env.VITE_API_URL + 'api/user/delete', {
        id: infoAdmin.id,
      })
      .then(() => {
        setDataUpdate(true);
        setLoderTime(false);
        setSuccessDeleteAdmin(true);
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
  };

  return (
    <div>
      <Loder stop={loderTime} />
      {skeletonTime ? (
        <ContentSkeleton>
          <Box sx={{ width: '100%' }}>
            <Skeleton width="20%" height="2rem" />
            <Skeleton width="50%" height="2rem" />
            <Skeleton width="85%" height="2rem" />
            <Skeleton width="100%" height="2rem" />
          </Box>
        </ContentSkeleton>
      ) : (
        <div>
          <Container>
            <Header>
              <div>
                <h2>Shaxsiy kabinet</h2>
              </div>
              <HeaderRight>
                <SectionOne>
                  <Tooltip
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                    placement="top"
                    title="Administrator qo'shish"
                    arrow
                  >
                    <button className="addTeacher" onClick={openAddAdmin} style={{display: user?.user?.role == 'supper' || user?.user?.role == 'super' ? 'block' : 'none', fontSize: '22px' }}>
                      <i className="fa-solid fa-headset"></i>
                    </button>
                  </Tooltip>
                  <Tooltip
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                    placement="top"
                    title="O'qituvchi qo'shish"
                    arrow
                  >
                    <button onClick={addTeacherFunction} className="addTeacher">
                      <HiUserAdd></HiUserAdd>
                    </button>
                  </Tooltip>
                </SectionOne>
              </HeaderRight>
            </Header>
            <div style={{ display: user?.user?.role == 'supper' || user?.user?.role == 'super' ? 'block' : 'none', width: '100%', borderBottom: '2px dashed gray', paddingBottom: '20px' }}>
              <h3 style={{ padding: '20px 20px', fontSize: '18px', color: '#151552' }}>Administratorlar</h3>
              <Table>
                <thead>
                  <TableHeader>
                    <th className="number_th">
                      <p>T/r</p>
                    </th>
                    <th className="teacher_th">
                      <p>Login</p>
                    </th>
                    <th className="login_th">
                      <p>Telegram ID</p>
                    </th>
                    <th className="action_th">
                      <p>Amallar</p>
                    </th>
                  </TableHeader>
                </thead>
                <Section>
                  {dataAdmins.length > 0 ? dataAdmins : <em style={{ display: 'block', color: '#ababab', fontSize: '14px', paddingLeft: '20px', paddingTop: '15px' }}>Mavjud emas</em>}
                </Section>
              </Table>
            </div>
            <div style={{ display: user?.user?.role == 'supper' || user?.user?.role == 'super' ? 'block' : 'none', width: '100%', borderBottom: '2px dashed gray', paddingBottom: '20px' }}>
              <h3 style={{ padding: '20px 20px', fontSize: '18px', color: '#151552' }}>O&apos;qituvchilar</h3>
              <Table>
                <thead>
                  <TableHeader>
                    <th className="number_th">
                      <p>T/r</p>
                    </th>
                    <th className="teacher_th">
                      <p>Ismi familyasi</p>
                    </th>
                    <th className="login_th">
                      <p>Login</p>
                    </th>
                    <th className="action_th">
                      <p>Amallar</p>
                    </th>
                  </TableHeader>
                </thead>
                <Section>
                  {data.length > 0 ? data : <em style={{ display: 'block', color: '#ababab', fontSize: '14px', paddingLeft: '20px', paddingTop: '15px' }}>Mavjud emas</em>}
                </Section>
              </Table>
            </div>
            <Table style={{display: user?.user?.role == 'supper' || user?.user?.role == 'super' ? 'none' : ''}}>
              <thead>
                <TableHeader>
                  <th className="number_th">
                    <p>T/r</p>
                  </th>
                  <th className="teacher_th">
                    <p>Ismi familyasi</p>
                  </th>
                  <th className="login_th">
                    <p>Login</p>
                  </th>
                  <th className="action_th">
                    <p>Amallar</p>
                  </th>
                </TableHeader>
              </thead>
              <Section>
                {data.length > 0 ? data : <em style={{ display: 'block', color: '#ababab', fontSize: '14px', paddingLeft: '20px', paddingTop: '15px' }}>Mavjud emas</em>}
              </Section>
            </Table>
            <Modal
              open={addTeacherModal}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <AddTeacherContent>
                <div className="addModalHeader">
                  <button
                    className="close_modal_btn"
                    onClick={() => addTeacherModalClose()}
                  >
                    <CloseIcon />
                  </button>
                  <h2 className="addModalHeaderName">
                    O&apos;qituvchi qo&apos;shish
                  </h2>
                </div>
                <div className="addModalContent">
                  <Box sx={{ width: '100%', mb: 3 }}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        O&apos;qituvchini tanlang
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={teacherSelect}
                        label="O'qituvchini tanlang"
                        onChange={teacherChange}
                      >
                        {cabinetDataAddTeacher &&
                          cabinetDataAddTeacher.map(
                            (name) =>
                              name && (
                                <MenuItem key={name.id} value={name.id}>
                                  {name.name}
                                </MenuItem>
                              )
                          )}
                      </Select>
                      <FormHelperText
                        style={{
                          display: errorSelectTeacher ? 'block' : 'none',
                          color: '#d32f2f',
                        }}
                      >
                        O&apos;qituvchini tanlang
                      </FormHelperText>
                    </FormControl>
                  </Box>

                  <Box sx={{ width: '100%', mb: 3 }}>
                    <TextField
                      fullWidth
                      label="Login"
                      id="outlined-size-large"
                      size="large"
                      value={addTeacherLoginPart}
                      onChange={addLoginChange}
                      onKeyPress={(event) => {
                        if (event.key === 'Enter') {
                          addTeacherCall();
                        }
                      }}
                      type={'text'}
                      helperText={errorAddLogin ? 'Loginni kiriting' : null}
                    />
                    <p
                      className="errorEmailPart"
                      style={{ display: errorEmail ? 'block' : 'none' }}
                    >
                      Ushbu loginga tegishli foydalanuvchi mavjud
                    </p>
                    <p
                      className="errorEmailPart"
                      style={{
                        display: errorCallLimitEmailAdd ? 'block' : 'none',
                      }}
                    >
                      Eng kamida 4 ta belgi kiritish zarur
                    </p>
                  </Box>
                  <Box sx={{ width: '100%', mb: 5 }}>
                    <FormControl sx={{ width: '100%' }} variant="outlined">
                      <InputLabel htmlFor="outlined-adornment-password">
                        Parol
                      </InputLabel>
                      <OutlinedInput
                        id="outlined-adornment-password"
                        value={addTeacherPasswordPart}
                        onChange={addPasswordChange}
                        type={showPasswordAddModal ? 'text' : 'password'}
                        onKeyPress={(event) => {
                          if (event.key === 'Enter') {
                            addTeacherCall();
                          }
                        }}
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
                          display: errorAddPassword ? 'block' : 'none',
                        }}
                      >
                        Parolni kiriting
                      </p>
                      <p
                        className="errorPassword"
                        style={{
                          display: errorCallLimitPasswordAdd
                            ? 'block'
                            : 'none',
                        }}
                      >
                        Eng kamida 4 ta belgi kiritish zarur
                      </p>
                    </FormControl>
                  </Box>

                  <Button
                    sx={{ pt: 1, pb: 1 }}
                    fullWidth
                    className="buy_btn_modal"
                    variant="contained"
                    onClick={addTeacherCall}
                  >
                    Qo&apos;shish
                  </Button>
                </div>
              </AddTeacherContent>
            </Modal>
            <Modal
              open={updateTeacherModal}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <ModalBuyUpdate>
                <div className="updateModalHeader">
                  <button
                    className="close_modal_btn"
                    onClick={() => updateModalClose()}
                  >
                    <CloseIcon />
                  </button>
                  <h3 className="updateModalHeaderName" style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {deleteName.name}
                  </h3>
                  <p>Login va parolni o&apos;zgartirish</p>
                </div>
                <div className="updateModalContent">
                  <Box sx={{ width: '100%', mb: 3 }}>
                    <TextField
                      fullWidth
                      label="Login"
                      id="outlined-size-large"
                      size="large"
                      value={updateLoginTextfield}
                      onChange={updateLoginChange}
                      type={'text'}
                      helperText={
                        errorEmailUpdate ? 'Loginni kiriting' : null
                      }
                    />
                    <p
                      className="errorEmailPartUpdate"
                      style={{ display: errorCallEmail ? 'block' : 'none' }}
                    >
                      Ushbu loginga tegishli foydalanuvchi mavjud
                    </p>
                    <p
                      className="errorEmailPartUpdate"
                      style={{
                        display: errorLimitUpdateLogin ? 'block' : 'none',
                      }}
                    >
                      Eng kamida 4 ta belgi kiritilishi zarur
                    </p>
                  </Box>
                  <Box sx={{ width: '100%', mb: 5 }}>
                    <FormControl sx={{ width: '100%' }} variant="outlined">
                      <InputLabel htmlFor="outlined-adornment-password">
                        Parol
                      </InputLabel>
                      <OutlinedInput
                        id="outlined-adornment-password"
                        value={updatePasswordTextfield}
                        onChange={updatePasswordChange}
                        type={showPassword ? 'text' : 'password'}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {showPassword ? (
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
                        className="errorPasswordUpdateText"
                        style={{
                          display: errorPasswordUpdate ? 'block' : 'none',
                        }}
                      >
                        Parolni kiriting
                      </p>
                      <p
                        className="errorPasswordUpdateText"
                        style={{
                          display: errorLimitUpdatePassword
                            ? 'block'
                            : 'none',
                        }}
                      >
                        Eng kamida 4 ta belgi kiritilishi zarur
                      </p>
                    </FormControl>
                  </Box>

                  <Button
                    sx={{ pt: 1, pb: 1 }}
                    fullWidth
                    className="buy_btn_modal"
                    variant="contained"
                    onClick={updateTacherCall}
                  >
                    Saqlash
                  </Button>
                </div>
              </ModalBuyUpdate>
            </Modal>
            <Modal
              open={open}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <AllGroupsDeleteModal>
                <div className="close_modal">
                  <button
                    className="close_modal_btn"
                    onClick={() => handleClose()}
                  >
                    <CloseIcon />
                  </button>
                </div>
                <div className="delete_icon_div">
                  <div className="delete_icon">
                    <img src="/images/trash.svg" alt="" />
                  </div>
                </div>
                <div className="allGroups_delete_notification_part">
                  <p>
                    Rostdan ham ushbu {deleteName?.name?.length > 20 ? `
                          ${deleteName?.name?.slice(0, 20)}...` : deleteName.name}ni shaxsiy kabinetdan
                    o&apos;chirmoqchimisiz
                  </p>
                </div>
                <div className="allGroups_delete_modal_part">
                  <Button
                    className="delete_modal_btn_error"
                    variant="contained"
                    onClick={handleClose}
                  >
                    Bekor qilish
                  </Button>
                  <Button
                    className="delete_modal_btn_success"
                    variant="contained"
                    color="error"
                    onClick={deleteTeacherFunCall}
                  >
                    O&apos;chirish
                  </Button>
                </div>
              </AllGroupsDeleteModal>
            </Modal>
            <Modal open={openAddAdminModal}>
              <AddTeacherContent>
                <div className="addModalHeader">
                  <button
                    className="close_modal_btn"
                    onClick={() => closeAddAdmin()}
                  >
                    <CloseIcon />
                  </button>
                  <h2 className="addModalHeaderName">
                    Administrator qo&apos;shish
                  </h2>
                </div>
                <div className="addModalContent">
                  <Box sx={{ width: '100%', mb: 3 }}>
                    <TextField
                      fullWidth
                      label="Login"
                      id="outlined-size-large"
                      size="large"
                      value={addAdminLoginTextfield}
                      onChange={addAdminLoginChange}
                      // onKeyPress={(event) => {
                      //   if (event.key === 'Enter') {
                      //     addTeacherCall();
                      //   }
                      // }}
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
                  </Box>
                  <Box sx={{ width: '100%', mb: 3 }}>
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
                  </Box>
                  <Box sx={{ width: '100%', mb: 5 }}>
                    <TextField
                      fullWidth
                      label="Telegram ID"
                      id="outlined-size-large"
                      size="large"
                      value={addAdminTelegramIDTextfield}
                      onChange={addAdminTelegramIDChange}
                      // onKeyPress={(event) => {
                      //   if (event.key === 'Enter') {
                      //     addTeacherCall();
                      //   }
                      // }}
                      type={'text'}
                      helperText={errorAddAdminTelegramID ? 'Telegram IDni kiriting' : null}
                    />
                    {/* <p
                          className="errorEmailPart"
                          style={{ display: errorEmail ? 'block' : 'none' }}
                        >
                          Ushbu loginga tegishli foydalanuvchi mavjud
                        </p>
                        <p
                          className="errorEmailPart"
                          style={{
                            display: errorCallLimitEmailAdd ? 'block' : 'none',
                          }}
                        >
                          Eng kamida 4 ta belgi kiritish zarur
                        </p> */}
                  </Box>
                  <Button
                    sx={{ pt: 1, pb: 1 }}
                    fullWidth
                    className="buy_btn_modal"
                    variant="contained"
                    onClick={addAdmin}
                  >
                    Qo&apos;shish
                  </Button>
                </div>
              </AddTeacherContent>
            </Modal>
            <Modal open={updateAdminModal}>
              <AddTeacherContent>
                <div className="addModalHeader">
                  <button
                    className="close_modal_btn"
                    onClick={() => closeUpdateAdmin()}
                  >
                    <CloseIcon />
                  </button>
                  <h2 className="updateModalHeaderName">
                    {infoAdmin.email}
                  </h2>
                  <p>Administrator ma&apos;lumotlarini tahrirlash</p>
                </div>
                <div className="addModalContent">
                  <Box sx={{ width: '100%', mb: 3 }}>
                    <TextField
                      fullWidth
                      label="Login"
                      id="outlined-size-large"
                      size="large"
                      value={updateAdminLoginTextfield}
                      onChange={updateAdminLoginChange}
                      // onKeyPress={(event) => {
                      //   if (event.key === 'Enter') {
                      //     addTeacherCall();
                      //   }
                      // }}
                      type={'text'}
                      helperText={errorUpdateAdminLogin ? 'Loginni kiriting' : null}
                    />
                    <p
                      className="errorEmailPart"
                      style={{ display: errorUpdateAdminFalseLogin ? 'block' : 'none' }}
                    >
                      Ushbu loginga tegishli foydalanuvchi mavjud
                    </p>
                    <p
                      className="errorEmailPart"
                      style={{
                        display: errorUpdateAdminLoginNotComplate ? 'block' : 'none',
                      }}
                    >
                      Eng kamida 4 ta belgi kiritish zarur
                    </p>
                  </Box>
                  <Box sx={{ width: '100%', mb: 3 }}>
                    <FormControl sx={{ width: '100%' }} variant="outlined">
                      <InputLabel htmlFor="outlined-adornment-password">
                        Parol
                      </InputLabel>
                      <OutlinedInput
                        id="outlined-adornment-password"
                        value={updateAdminPasswordTextfield}
                        onChange={addUpdatePasswordChange}
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
                          display: errorUpdateAdminPassword ? 'block' : 'none',
                        }}
                      >
                        Parolni kiriting
                      </p>
                      <p
                        className="errorPassword"
                        style={{
                          display: errorUpdateAdminPasswordNotComplate
                            ? 'block'
                            : 'none',
                        }}
                      >
                        Eng kamida 4 ta belgi kiritish zarur
                      </p>
                    </FormControl>
                  </Box>
                  <Box sx={{ width: '100%', mb: 5 }}>
                    <TextField
                      fullWidth
                      label="Telegram ID"
                      id="outlined-size-large"
                      size="large"
                      value={updateAdminTelegramIDTextfield}
                      onChange={updateAdminTelegramIDChange}
                      // onKeyPress={(event) => {
                      //   if (event.key === 'Enter') {
                      //     addTeacherCall();
                      //   }
                      // }}
                      type={'text'}
                      helperText={errorUpdateAdminTelegramID ? 'Telegram IDni kiriting' : null}
                    />
                    {/* <p
                          className="errorEmailPart"
                          style={{ display: errorEmail ? 'block' : 'none' }}
                        >
                          Ushbu loginga tegishli foydalanuvchi mavjud
                        </p>
                        <p
                          className="errorEmailPart"
                          style={{
                            display: errorCallLimitEmailAdd ? 'block' : 'none',
                          }}
                        >
                          Eng kamida 4 ta belgi kiritish zarur
                        </p> */}
                  </Box>
                  <Button
                    sx={{ pt: 1, pb: 1 }}
                    fullWidth
                    className="buy_btn_modal"
                    variant="contained"
                    onClick={updateAdmin}
                  >
                    Saqlash
                  </Button>
                </div>
              </AddTeacherContent>
            </Modal>
            <Modal
              open={deleteAdminModal}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <AllGroupsDeleteModal>
                <div className="close_modal">
                  <button
                    className="close_modal_btn"
                    onClick={() => closeDeleteAdminFun()}
                  >
                    <CloseIcon />
                  </button>
                </div>
                <div className="delete_icon_div">
                  <div className="delete_icon">
                    <img src="/images/trash.svg" alt="" />
                  </div>
                </div>
                <div className="allGroups_delete_notification_part">
                  <p>
                    Rostdan ham ushbu {infoAdmin?.email?.length > 20 ? `
                          ${infoAdmin?.email?.slice(0, 20)}...` : infoAdmin.email} nomli loginga tegishli administratorni shaxsiy kabinetdan
                    o&apos;chirmoqchimisiz
                  </p>
                </div>
                <div className="allGroups_delete_modal_part">
                  <Button
                    className="delete_modal_btn_error"
                    variant="contained"
                    onClick={closeDeleteAdminFun}
                  >
                    Bekor qilish
                  </Button>
                  <Button
                    className="delete_modal_btn_success"
                    variant="contained"
                    color="error"
                    onClick={deleteAdmin}
                  >
                    O&apos;chirish
                  </Button>
                </div>
              </AllGroupsDeleteModal>
            </Modal>
            <Snackbar
              open={successAddTeacher}
              onClose={handleCloseBarSuccessAdd}
              severity={'success'}
              massage={'O\'qituvchi muvaffaqiyatli qo\'shildi'}
            />
            <Snackbar
              open={successUpdateTeacher}
              onClose={handleCloseBarSuccessUpdate}
              severity={'success'}
              massage={'O\'qituvchi ma\'lumotlari muvaffaqiyalti o\'zgartirildi'}
            />
            <Snackbar
              open={successDeleteTeacher}
              onClose={handleCloseBarSuccessDelete}
              severity={'success'}
              massage={'O\'qituvchi muvaffaqiyatli o\'chirildi'}
            />
            <Snackbar
              open={successAddAdmin}
              onClose={handleCloseBarSuccessAdminAdd}
              severity={'success'}
              massage={'Administrator muvaffaqiyatli qo\'shildi'}
            />
            <Snackbar
              open={successUpdateAdmin}
              onClose={handleCloseBarSuccessAdminUpdate}
              severity={'success'}
              massage={'Administrator ma\'lumotlari muvaffaqiyalti o\'zgartirildi'}
            />
            <Snackbar
              open={successDeleteAdmin}
              onClose={handleCloseBarSuccessAdminDelete}
              severity={'success'}
              massage={'Administrator muvaffaqiyatli o\'chirildi'}
            />
          </Container>
        </div>
      )}
    </div>
  );
}

export default PrivateCabinet;
