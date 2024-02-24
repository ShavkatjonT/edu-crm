import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import http from '../../http/index';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { NumericFormat } from 'react-number-format';
import Box from '@mui/material/Box';
import dayjs from 'dayjs';
import NumericInput from 'material-ui-numeric-input';
import { Context } from '../../index';
import Skeleton from '@mui/material/Skeleton';
import { DatePicker } from 'antd';
const { MonthPicker } = DatePicker;

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
  .teacher_groups_name {
    background-color: #9db5b9;
    display: inline-block;
    padding-left: 0.5rem;
    margin-right: 0.3rem;
    border-radius: 3px;
    margin: 0.3rem;
  }

  .sale {
    background-color: #66878c;
    display: inline-block;
    color: white;
    text-align: center;
    margin: 0;
    width: 2rem;
    padding-top: 0.45rem;
    height: 2rem;
    font-size: 0.78rem;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }
`;
const Header = styled.div`
  display: flex;
  padding: 15px 20px;
  align-items: center;
  justify-content: space-between;
  .delete_student_icon {
    color: #c20404;
    cursor: pointer;
    font-size: 1.2rem;
    transition: all 0.8s;
    margin: 0 0.5rem;
    &:hover {
      color: #ff0808;
    }
  }
  .edit {
    i {
      font-size: 1.2rem;
    }
    background-color: initial;
    color: #585353;
    border: none;
    margin-right: 1rem;
    cursor: pointer;
    transition: all 0.5s;
    &:hover {
      color: #7d7d7d;
    }
  }
  .teacher_info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .teacher_give_money_btn {
      background-color: #ffaa2a !important;
      cursor: pointer;
      &:hover {
        background-color: #fdc600 !important;
      }
    }
    .teacher_info_div {
      margin-right: 1rem;
      .teacher_card {
        margin-right: 0.5rem;
      }
    }
    p {
      display: inline-block;
      margin-right: 1rem;
      &:first-child {
        background: green;
        color: white;
        padding-top: 0.3rem;
        padding-bottom: 0.4rem;
        padding-left: 1rem;
        padding-right: 1rem;
        border-radius: 4px;
      }
      &:last-child {
        background: #002fff;
        color: white;
        padding-top: 0.3rem;
        padding-bottom: 0.4rem;
        padding-left: 1rem;
        padding-right: 1rem;
        border-radius: 4px;
      }
    }
  }
`;
const Main = styled.div`
  margin-top: 1.2rem;
  padding: 0 20px;
  display: flex;
`;
const LeftImg = styled.div`
  img {
    width: 280px;
    height: 300px;
  }
`;
const Center = styled.div`
  margin-left: 1.5rem;
  table {
    width: 100%;
    tr {
      height: 50px;

      td {
        text-align: left;
        padding-left: 10px;
        &:nth-child(even) {
          font-weight: 600;
        }
      }
      &:nth-child(even) {
        background-color: #f8f8f8;
      }
    }
  }
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
const styleUpdate = {
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

const Table = styled.table`
  width: 100%;
  margin-top: 1rem;
  tr:nth-child(even) {
    background-color: #f8f8f8;
  }
  tr {
    text-align: center;
    height: 33px;
  }

  .delete_student_icon {
    color: #c20404;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.8s;
    margin: 0 0.5rem;
    &:hover {
      color: #ff0808;
    }
  }
  .edit {
    i {
      font-size: 1rem;
    }
    background-color: initial;
    color: #6cb324;
    border: none;
    margin-right: 1rem;
    cursor: pointer;
    transition: all 0.5s;
    &:hover {
      color: #74e007;
    }
  }
`;

const Report = styled.div`
  width: 744px;
  text-align: center;
  margin: 0.8rem;
`;

const Teachers = () => {
  const { user } = useContext(Context);
  const data = window.location.href.split('/');
  const [teacher, setTeacher] = useState('');
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteName, setDeleteName] = useState([]);
  const [getPayment, setGetPayment] = useState([]);
  const [payModal, setPayModal] = useState(false);
  const [moneyValue, setMoneyValue] = useState();
  const [deleteId, setDeleteId] = useState('');
  const [errorSum, setErrorSum] = useState(false);
  const [errorUpdateSum, setErrorUpdateSum] = useState(false);
  const [errorMonthUpdate, setErrorMonthUpdate] = useState(false);
  const [errorMonth, setErrorMonth] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [monthly, setMonthly] = useState([]);
  const [buySumma, setBuySumma] = useState(0);
  const [monthlData, setMonthlData] = useState();
  const [updateMonthValue, setUpdateMonthValue] = useState('');
  const [dataUpdate, setDataUpdate] = useState(false);
  const [skeletonTime, setSkeletonTime] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedMonthFilter, setSelectedMonthFilter] = useState(null);
  const [selectedMonthFilterUpdate, setSelectedMonthFilterUpdate] =
    useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    http
      .get(import.meta.env.VITE_API_URL + `api/teacher/get/one/${data[4]}`)
      .then((res) => {
        setTeacher(res.data);
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
      .post(import.meta.env.VITE_API_URL + `api/monthly/get/${data[4]}`, {})
      .then((res) => {
        setMonthly(res.data);
        setGetPayment(res.data);
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
        console.log(error);
      });
  }, []);


  useEffect(() => {
    if (dataUpdate) {
      http
        .get(import.meta.env.VITE_API_URL + `api/teacher/get/one/${data[4]}`)
        .then((res) => {
          setTeacher(res.data);
          setSkeletonTime(false);
          setDataUpdate(false);
        })
        .catch((error) => {
          setDataUpdate(false);
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
        .post(import.meta.env.VITE_API_URL + `api/monthly/get/${data[4]}`, {})
        .then((res) => {
          setMonthly(res.data);
          setGetPayment(res.data);
          setSkeletonTime(false);
          setDataUpdate(false);
        })
        .catch((error) => {
          setDataUpdate(false);
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
          console.log(error);
        });
    }
  }, [dataUpdate]);

  const deleteStudent = () => {
    if (user?.user?.role == 'admin') {
      http
        .post(import.meta.env.VITE_API_URL + `api/teacher/delete/${data[4]}`, {
          id: data[4]
        })
        .then(() => {
          navigate('/employees');
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
    if (user?.user?.role == 'super') {
      http
        .post(import.meta.env.VITE_API_URL + `api/teacher/employee-delete/${data[4]}`, {
          id: data[4]
        })
        .then(() => {
          navigate('/employees');
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
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const closeAndSave = () => {
    setPayModal(false);
    setMoneyValue('');
    setErrorSum(false);
    setErrorMonth(false);
  };

  const handleMonthChange = (date) => {
    setSelectedMonth(date);
    const selectedMonth = date ? dayjs(date).format('YYYY-MM') : '';
    setSelectedMonthFilter(selectedMonth);
    setErrorMonth(false);
  };
  const handleMonthChangeUpdate = (date) => {
    setUpdateMonthValue(date);
    const selectedMonth = date ? dayjs(date).format('YYYY-MM') : '';
    setSelectedMonthFilterUpdate(selectedMonth);
    setErrorMonthUpdate(false);
  };

  const saveBuyModal = () => {
    if (moneyValue && selectedMonthFilter) {
      setSkeletonTime(true);
      http
        .post(import.meta.env.VITE_API_URL + `api/teacher/payment/${data[4]}`, {
          month: selectedMonthFilter,
          payment: Number(moneyValue),
        })
        .then(() => {
          setPayModal(false);
          setErrorSum(false);
          setMoneyValue('');
          setSkeletonTime(false);
          setSelectedMonth(null);
          setSelectedMonthFilter(null);
          setDataUpdate(true);
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
    } else {
      if (!moneyValue) {
        setErrorSum(true);
      } else {
        setErrorSum(false);
      }
      if (!selectedMonthFilter) {
        setErrorMonth(true);
      } else {
        setErrorMonth(false);
      }
    }
  };

  let number = 1;

  const filterTime = (e) => {
    const timeDate = e;
    const filterYear = timeDate.substring(0, 10);
    const filterLocalClock = timeDate.substring(19, 11);
    const time = String(Number(filterLocalClock.substring(0, 2)) + 5);
    const minuts = filterLocalClock.substring(2);
    return (
      filterYear + ' ' + (Number(time) <= 9 ? '0' : '') + time + '' + minuts
    );
  };
  const monthlyDelete = (e) => {
    setOpenDelete(false);
    setSkeletonTime(true);
    const id = e.id;
    http
      .post(import.meta.env.VITE_API_URL + 'api/monthly/delete', {
        id: id,
      })
      .then(() => {
        setDataUpdate(true);
        setMonthlData();
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

  const updateInfoMonthly = () => {
    if (buySumma && selectedMonthFilterUpdate) {
      setSkeletonTime(true);
      http
        .post(import.meta.env.VITE_API_URL + 'api/monthly/put', {
          id: deleteId,
          sum: buySumma,
          date: selectedMonthFilterUpdate,
        })
        .then(() => {
          setOpenUpdateModal(false);
          setSelectedMonthFilterUpdate(null);
          setUpdateMonthValue('');
          setDataUpdate(true);
          setMonthlData();
          setErrorUpdateSum(false);
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
    } else {
      if (!buySumma) {
        setErrorUpdateSum(true);
      } else {
        setErrorUpdateSum(false);
      }
      if (!selectedMonthFilterUpdate) {
        setErrorMonthUpdate(true);
      } else {
        setErrorMonthUpdate(false);
      }
    }
  };

  let name;
  if (deleteName) {
    name = deleteName.filter((e) => {
      const id = deleteId;
      return e.id == id;
    });
  }

  const funUpdateModal = (el) => {
    setDeleteId(el.id),
      setBuySumma(el.payment),
      setUpdateMonthValue(dayjs(el.month));
    setSelectedMonthFilterUpdate(dayjs(el.month).format('YYYY-MM'));
    setOpenUpdateModal(true);
    setDeleteName(getPayment);
  };


  const closeUpdateModal = () => {
    setOpenUpdateModal(false);
    setBuySumma(0);
    setUpdateMonthValue('');
    setDeleteId('');
    setDeleteName('');
    setErrorUpdateSum(false);
  };

  const buySumFun = (e) => {
    setBuySumma(e.target.value);
    setErrorUpdateSum(false);
  };

  const monthlModalClose = () => {
    setOpenDelete(false);
    setMonthlData();
  };

  const monthlModalOpen = (el) => {
    setOpenDelete(true);
    setMonthlData(el);
  };

  return (
    <Container>
      {skeletonTime ? (
        <ContentSkeleton>
          <Box sx={{ width: '100%' }}>
            <Skeleton width="50%" height="2rem" />
            <Skeleton width="70%" height="2rem" />
            <Skeleton width="85%" height="2rem" />
            <Skeleton width="100%" height="2rem" />
          </Box>
        </ContentSkeleton>
      ) : (
        teacher && (
          <div>
            <Header>
              <div>
                <h3>
                  {teacher.firstname + ' ' + teacher.lastname} ma&apos;lumotlari
                </h3>
              </div>
              <div className="teacher_info">
                {teacher.job_type == 'teacher' &&
                  <p
                    className="teacher_give_money_btn"
                    onClick={() => setPayModal(true)}
                    style={{ display: user?.user?.role == 'super' || user?.user?.role == 'casher' ? 'block' : 'none' }}
                  >
                    Oylik berish
                  </p>
                }
                <div className="teacher_info_div">
                  {teacher.job_type == 'teacher' &&
                    <p style={{ display: user?.user?.role == 'super' || user?.user?.role == 'casher' ? 'block' : 'none' }}>
                      <i className="teacher_card fa-solid fa-credit-card"></i>
                      <NumericFormat
                        value={teacher.wallet ? teacher.wallet : 0}
                        displayType={'text'}
                        thousandSeparator={true}
                        prefix={''}
                      />
                    </p>
                  }
                </div>
                <Link to={`/update-employee/${data[4]}`}
                  style={{ display: user?.user?.role == 'casher' ? 'none' : 'inherit' }}
                >
                  <Tooltip
                    title="Tahrirlash"
                    arrow
                    TransitionComponent={Fade}
                    placement="top"
                  >
                    <button className="edit">
                      <i className="fa-solid fa-pen"></i>
                    </button>
                  </Tooltip>
                </Link>
                <Tooltip
                  title="O'chirish"
                  arrow
                  TransitionComponent={Fade}
                  placement="top"
                >
                  <i
                    className="delete_student_icon fa-solid fa-trash"
                    style={{ display: user?.user?.role == 'casher' ? 'none' : 'block' }}
                    onClick={handleOpen}
                  ></i>
                </Tooltip>
              </div>
            </Header>
            <hr />
            <Main>
              <LeftImg>
                {teacher.job_type == 'teacher' &&
                  <img
                    src={
                      teacher.gender == 'ayol'
                        ? '/images/admin4.png'
                        : '/images/admin3.png'
                    }
                    alt=""
                  />
                }
                {teacher.job_type == 'admin' || teacher.job_type == 'casher' || teacher.job_type == 'ceo' ?
                  <img
                    src={
                      teacher.gender == 'ayol'
                        ? '/images/adminTwo.png'
                        : '/images/adminOne.png'
                    }
                    alt=""
                  />
                  : ''}
              </LeftImg>
              <Center>
                <table>
                  <tbody>
                    <tr>
                      <td>Ismi familyasi: </td>
                      <td>
                        {teacher.firstname + ' ' + teacher.lastname}
                      </td>
                    </tr>
                    <tr>
                      <td>Otasining ismi: </td>
                      <td>{teacher.fathername}</td>
                    </tr>
                    <tr>
                      <td>Jinsi: </td>
                      <td>{teacher.gender}</td>
                    </tr>

                    <tr>
                      <td>Tug&apos;ilgan sana: </td>
                      <td>{teacher.birthday}</td>
                    </tr>
                    <tr>
                      <td>Manzili: </td>
                      <td>{teacher.address}</td>
                    </tr>
                    <tr>
                      <td>Telefon Raqami: </td>
                      <td>{teacher.phone}</td>
                    </tr>
                    <tr>
                      <td>Qo&apos;shimcha telefon Raqami: </td>
                      <td>{teacher.phone_2}</td>
                    </tr>
                    <tr>
                      <td>Login: </td>
                      <td>{teacher.email}</td>
                    </tr>
                    <tr>
                      <td>Telegram ID: </td>
                      <td>{teacher.telegram_id}</td>
                    </tr>
                    {teacher.job_type == 'teacher' &&
                      <tr>
                        <td>Guruhlari:</td>
                        <td>
                          {teacher.group.map(
                            (e) =>
                              e && (
                                <span key={e.id} className="teacher_groups_name">
                                  {e.name} <span className="sale">{e.sale}%</span>
                                </span>
                              )
                          )}
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>

                <Modal
                  open={open}
                  onClose={handleClose}
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
                        Rostdan ham ushbu{' '}
                        {(teacher.firstname.length > 15 ? `${teacher.firstname.slice(0, 15)}...` : teacher.firstname) +
                          ' ' +
                          (teacher.lastname.length > 15 ? `${teacher.lastname.slice(0, 15)}...` : teacher.lastname) +
                          ' ' +
                          (teacher.fathername.length > 15 ? `${teacher.fathername.slice(0, 15)}...` : teacher.fathername)}{' '}
                        ma&apos;lumotlarini o&apos;chirmoqchimisiz
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
                        onClick={deleteStudent}
                      >
                        O&apos;chirish
                      </Button>
                    </div>
                  </AllGroupsDeleteModal>
                </Modal>
                <Modal open={payModal} style={{ zIndex: 600 }}>
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
                        paddingTop: '20px',
                        paddingBottom: '20px',
                        paddingLeft: '30px',
                        top: 0,
                        background: '#FDC600',
                      }}
                    >
                      <h2>{(teacher.firstname.length > 10 ? `${teacher.firstname.slice(0, 10)}...` : teacher.firstname) + ' ' + (teacher.lastname.length > 10 ? `${teacher.lastname.slice(0, 10)}...` : teacher.lastname)}</h2>
                      <p style={{ marginTop: '0.5rem' }}>
                        Ushbu o&apos;qituvchiga oylik berish
                      </p>
                    </div>

                    <NumericInput
                      sx={{ pb: 3, mt: 12 }}
                      fullWidth
                      precision={''}
                      decimalChar=","
                      thousandChar="."
                      label="Summani kiriting"
                      value={moneyValue}
                      onChange={(e) => {
                        setMoneyValue(e.target.value);
                        setErrorSum(false);
                      }}
                      variant="outlined"
                      inputProps={{
                        maxLength: 8,
                        minLength: 0,
                      }}
                      helperText={errorSum ? 'Summa kiritilmadi' : null}
                      FormHelperTextProps={{ style: { color: '#d32f2f' } }}
                    />
                    <MonthPicker
                      value={selectedMonth}
                      onChange={handleMonthChange}
                      placeholder="Oyni tanlang"
                      format="MMMM YYYY"
                      allowClear={false}
                      style={{
                        width: '100%',
                        height: '55px',
                        border: '1.9px solid #C4C4C4',
                        borderRadius: '4px',
                        color: '#6E6E6E',
                        fontSize: '17px',
                      }}
                    />
                    <p
                      style={{
                        display: errorMonth ? 'block' : 'none',
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
                      Oyni tanlang
                    </p>
                    <br />
                    <br />
                    <Button
                      sx={{ mt: 3, pt: 1, pb: 1 }}
                      fullWidth
                      className="buy_btn_modal"
                      variant="contained"
                      onClick={saveBuyModal}
                    >
                      Saqlash
                    </Button>
                  </Box>
                </Modal>
              </Center>
            </Main>
            {monthly && monthly.length > 0 && (
              <Report>
                <h2>Oylik maosh bo&apos;yicha hisobot</h2>
                <Table>
                  <thead>
                    <tr>
                      <th>T/r</th>
                      <th>Summa</th>
                      <th>Sana</th>
                      <th>Yangilagan vaqt</th>
                      <th>Amalar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthly &&
                      monthly.map((el) => (
                        <tr key={el.id}>
                          <td>{number++}.</td>
                          <td>{el.payment}</td>
                          <td>{filterTime(el.createdAt)}</td>
                          <td>{filterTime(el.updatedAt)}</td>
                          <td style={{display: user?.user?.role == 'super' || user?.user?.role == 'casher' ? 'initial' : 'none'}}>
                            <button
                              className="edit"
                              style={{ display: el.deleteActive ? 'inline-block' : 'none' }}
                              onClick={() => { funUpdateModal(el); }}
                            >
                              <i className="fa-solid fa-pen-to-square"></i>
                            </button>
                            <i
                              className="delete_student_icon fa-solid fa-trash"
                              onClick={() => monthlModalOpen(el)}
                              style={{ display: el.deleteActive ? 'inline-block' : 'none' }}
                            ></i>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
                <Modal open={openUpdateModal} style={{ zIndex: 600 }}>
                  <Box sx={styleUpdate}>
                    <CloseIcon
                      style={{
                        position: 'absolute',
                        right: '2%',
                        top: '3%',
                        cursor: 'pointer',
                      }}
                      onClick={closeUpdateModal}
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
                        paddingTop: '20px',
                        paddingBottom: '20px',
                        paddingLeft: '30px',
                        top: 0,
                        background: '#FDC600',
                      }}
                    >
                      <h2>{teacher.firstname + ' ' + teacher.lastname}</h2>
                      <p style={{ marginTop: '0.5rem' }}>
                        To&apos;lov ma&apos;lumotlarini o&apos;zgartirish
                      </p>
                    </div>

                    {name &&
                      name.map((values) => (
                        <NumericInput
                          key={values.id}
                          sx={{ pb: 3, mt: 12 }}
                          fullWidth
                          precision={''}
                          decimalChar=","
                          thousandChar="."
                          label="To'langan summa"
                          value={buySumma}
                          onChange={buySumFun}
                          variant="outlined"
                          inputProps={{
                            maxLength: 8,
                            minLength: 0,
                          }}
                          helperText={
                            errorUpdateSum ? 'Summa kiritilmadi' : null
                          }
                          FormHelperTextProps={{ style: { color: '#d32f2f' } }}
                        />
                      ))}
                    {name &&
                      name.map((dataMonth) => (
                        <div key={dataMonth.id}>
                          <MonthPicker
                            value={updateMonthValue}
                            onChange={handleMonthChangeUpdate}
                            placeholder="Oyni tanlang"
                            format="MMMM YYYY"
                            allowClear={false}
                            style={{
                              width: '100%',
                              height: '55px',
                              border: '1.9px solid #C4C4C4',
                              borderRadius: '4px',
                              color: '#6E6E6E',
                              fontSize: '17px',
                            }}
                          />
                          <p
                            style={{
                              display: errorMonthUpdate ? 'block' : 'none',
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
                            Oyni tanlang
                          </p>
                        </div>
                      ))}

                    <br />
                    <br />
                    <Button
                      sx={{ mt: 3, pt: 1, pb: 1 }}
                      fullWidth
                      className="buy_btn_modal"
                      variant="contained"
                      onClick={updateInfoMonthly}
                    >
                      Saqlash
                    </Button>
                  </Box>
                </Modal>
                <Modal
                  open={openDelete}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <AllGroupsDeleteModal>
                    <div className="close_modal">
                      <button
                        className="close_modal_btn"
                        onClick={() => monthlModalClose()}
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
                        Rostdan ham ushbu to&apos;lov ma&apos;lumotlarini
                        o&apos;chirmoqchimisiz
                      </p>
                    </div>
                    <div className="allGroups_delete_modal_part">
                      <Button
                        className="delete_modal_btn_error"
                        variant="contained"
                        onClick={monthlModalClose}
                      >
                        Bekor qilish
                      </Button>
                      <Button
                        className="delete_modal_btn_success"
                        variant="contained"
                        color="error"
                        onClick={() => {
                          monthlData && monthlyDelete(monthlData);
                        }}
                      >
                        O&apos;chirish
                      </Button>
                    </div>
                  </AllGroupsDeleteModal>
                </Modal>
              </Report>
            )}
          </div>
        )
      )}
    </Container>
  );
};

export default Teachers;
