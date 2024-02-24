/* eslint-disable react/jsx-key */
import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import http from '../../http/index';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
// import Rating from '@mui/material/Rating';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../index';
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
  overflow-x: hidden;
  hr {
    border: 1px solid #aaaaaa;
  }
  .teacher_groups_name {
    background-color: #9db5b9;
    display: inline-block;
    padding-left: 0.5rem;
    margin-right: 0.5rem;
    border-radius: 3px;
    position: relative;

    span {
      background-color: #66878c;
      display: inline-block;
      padding-left: 0.5rem;
      padding-top: 0.2rem;
      padding-bottom: 0.3rem;
      padding-right: 0.5rem;
      border-radius: 3px;
      margin-left: 5px;
    }
  }
`;
const Header = styled.div`
  display: flex;
  padding: 15px 20px;
  align-items: center;
  justify-content: space-between;
  .header_left{
    width: 33.3%;
  }
  .header_center{
    width: 33.3%;
    text-align: center;      
  }
  .header_right{
    width: 33.3%;
    text-align: end;
    display: flex;
    justify-content: end;
    align-items: center;
  }
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
  width: 100%;
  margin-left: 1.5rem;
  display: flex;
  table {
    width: 50%;
    tr {
      height: 60px;
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
  #boardContent {
    width: 50%;
    #board_num_part {
      display: flex;
      flex-direction: column;
    }
    .board_number {
      width: 50px;
      height: 60px;
      position: relative;
      font-size: 20px;
      font-family: sans-serif;
      font-weight: 600;
      color: #8f8f8f;
      margin-bottom: 10px;
      p {
        position: absolute;
        left: 25%;
        top: 30%;
      }
    }
  }
`;
const CenterBottom = styled.div`
  margin-top: 1.5rem;
  h3 {
    /* font-size: 1.4rem; */
    margin-top: 1rem;
    margin-left: 2rem;
    margin-bottom: 1rem;
  }
  table {
    margin-left: 1.5rem;
    border-collapse: collapse;
    width: 100%;
    tr {
      height: 50px;
      td {
        text-align: center;
      }
      .numberList {
        width: 45px;
      }
      &:nth-child(even) {
        background-color: #f8f8f8;
      }
    }
  }
`;

const CenterRatingBottom = styled.div`
    margin: 0 auto;
    display: flex;
    margin-top: 1rem;
    margin-bottom: 1rem;
    width: 97%;
    border-radius: 6px;
    padding: 15px 35px;
    padding-right: 15px;
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.45);
    .ratingCheckBoxBtnPart{
      width: 85%;
    }
    .ratingAddBtnPart{
      width: 15%;
      display: flex;
      justify-content: end;
      align-items: start;
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

const Student = () => {
  const data = window.location.href.split('/');
  const [student, setStudent] = useState();
  const [open, setOpen] = useState(false);
  // const [columnName, setColumnName] = useState('');
  const [skeletonTime, setSkeletonTime] = useState(true);
  const [isDisable, setIsDisable] = useState(true);
  const [isCheckDisable, setIsCheckDisable] = useState(true);
  // const [ratingStar, setRatingStar] = useState(3.5);
  const [blacklist, setBlacklist] = useState([]);
  const [inChekend, setInChekend] = useState([]);
  const [sendCheck, setSendCheck] = useState([]);
  const [valueCheck, setValueCheck] = useState();
  const { user } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    http
      .get(import.meta.env.VITE_API_URL + `api/student/get/one/${data[4]}`)
      .then((res) => {
        // console.log(360, res.data);
        // setRatingStar(res.data.rating);
        setInChekend(res.data.blacklist_id);
        setSendCheck(res.data.blacklist_id);
        setStudent(res.data);
        setSkeletonTime(false);
        filterTime(res.data.paymentList);
      })
      .catch((error) => {
        if (
          error &&
          error.response &&
          error.response.data && error.response.data.message == 'ro\'yxattan o\'tmagan foydalanuvchi!'
        ) {
          user.setIsAuth(false);
          localStorage.clear();
          navigate('/');
        } else {
          console.log(error);
        }
      });

    http
      .get(import.meta.env.VITE_API_URL + 'api/blacklist/get') // blacklist get 
      .then((res) => {
        console.log(357, res);
        setBlacklist(res.data);
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

  const deleteStudent = () => {
    setSkeletonTime(true);
    http
      .post(
        import.meta.env.VITE_API_URL + `api/student/delete/one/${data[4]}`,
        {
          delete: 'student delete',
        }
      )
      .then(() => {
        setSkeletonTime(false);
        navigate('/groups');
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
  };

  let numberCicles = 1;
  // const filterTime = (e) => {
  //     const timeDate = e;
  //     const filterYear = timeDate.substring(0, 10);
  //     const filterLocalClock = timeDate.substring(19, 11);
  //     return filterYear + ' ' + filterLocalClock;
  // };

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

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  let number = 0;

  const handleClick = (e) => {
    const { id, checked } = e.target;
    if (checked) {
      setInChekend([...inChekend, id]);
    } else {
      const chekedFiliter = inChekend.filter((e) => e != id);
      setInChekend(chekedFiliter);
    }
    if (checked) {
      setSendCheck([...sendCheck, id]);
    } else {
      const sendFilter = sendCheck.filter((e) => e != id);
      setSendCheck(sendFilter);
    }
    setValueCheck(checked);
  };


  const ratingCall = () => {
    setIsDisable(!isDisable);
    if (isDisable) {
      setIsCheckDisable(false);
    } else {
      setIsCheckDisable(true);
    }
    if (!isCheckDisable) {
      SendFun();
    }
  };


  const SendFun = () => {
    http
      .post(import.meta.env.VITE_API_URL + 'api/blacklist/cheked', {
        sendCheck,
        in_chekend: valueCheck,
        student_id: data[4]
      }) // blacklist get 
      .then((res) => {
        console.log(res);
        // setRatingStar(res.data.rating);
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
        student && (
          <div>
            <Header>
              <div className='header_left'>
                <h3>
                  {(student?.firstname?.length > 30 ? `${student?.firstname?.slice(0, 30)}...` : student?.firstname) + ' ' + (student?.lastname?.length > 30 ? `${student?.lastname?.slice(0, 30)}...` : student?.lastname)} ma&apos;lumotlari
                </h3>
              </div>
              <div className='header_center'>
                {/* <Rating name="read-only" value={ratingStar} max={10} precision={0.1} readOnly /> */}
              </div>
              <div className='header_right'>
                <Link to={`/update-student/${data[4]}`} style={{display: user?.user?.role == 'admin' || user?.user?.role == 'super' ? 'inherit' : 'none'}}>
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
                    style={{display: user?.user?.role == 'admin' || user?.user?.role == 'super' ? 'inherit' : 'none'}}
                    className="delete_student_icon fa-solid fa-trash"
                    onClick={handleOpen}
                  ></i>
                </Tooltip>
              </div>
            </Header>
            <hr />
            <Main>
              <LeftImg>
                <img
                  src={
                    student.gender == 'ayol'
                      ? '/images/admin2.png'
                      : '/images/admin1.png'
                  }
                  alt=""
                />
              </LeftImg>
              <Center>
                <table>
                  <tbody>
                    <tr>
                      <td className="tableThead">Ismi familyasi: </td>
                      <td>
                        {student?.firstname?.length > 40 ? `${student?.firstname?.slice(0, 40)}...` : student?.firstname} <br /> {student?.lastname?.length > 40 ? `${student?.lastname?.slice(0, 40)}...` : student?.lastname}
                      </td>
                    </tr>
                    <tr>
                      <td className="tableThead">Otasining ismi: </td>
                      <td>{student.fathername}</td>
                    </tr>
                    <tr>
                      <td className="tableThead">Jinsi: </td>
                      <td>{student.gender}</td>
                    </tr>

                    <tr>
                      <td className="tableThead">Tug&apos;ilgan sana: </td>
                      <td>{student.birthday}</td>
                    </tr>
                    <tr>
                      <td className="tableThead">Guruh: </td>
                      <td>
                        {student.group &&
                          student.group.map(
                            (e) =>
                              e && (
                                <span
                                  key={number++}
                                  className="teacher_groups_name"
                                >
                                  {e.name?.length > 40 ? `${e.name?.slice(0, 30)}...` : e?.name}
                                  <span> {e.wallet}</span>
                                </span>
                              )
                          )}
                      </td>
                    </tr>
                    <tr>
                      <td className="tableThead">Manzili: </td>
                      <td>{student.address}</td>
                    </tr>
                    <tr>
                      <td className="tableThead">Otasini telefon raqami: </td>
                      <td>{student.fatherPhone}</td>
                    </tr>
                    <tr>
                      <td className="tableThead">Onasini telefon raqami: </td>
                      <td>{student.motherPhone}</td>
                    </tr>
                    <tr>
                      <td className="tableThead">Sinfi: </td>
                      <td>{student.class}</td>
                    </tr>
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
                        {(student?.firstname?.length > 20 ? `${student?.firstname?.slice(0, 20)}..` : student?.firstname) +
                          ' ' +
                          (student?.lastname?.length > 20 ? `${student?.lastname?.slice(0, 20)}..` : student?.lastname) +
                          ' ' +
                          (student?.fathername?.length > 20 ? `${student?.fathername?.slice(0, 20)}..` : student?.fathername)}{' '}
                        ma&apos;lumotlarini butunlay o&apos;chirmoqchimisiz
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
              </Center>
            </Main>
            {
              student && student.paymentList && student.paymentList.length > 0 ? (
                <div>
                  <CenterBottom>
                    <h3>Oylik to&apos;lov haqida hisobot</h3>
                    <hr />
                    <table>
                      <tbody>
                        <tr>
                          <th>T/r</th>
                          <th>Guruh</th>
                          <th>To&apos;lov qilingan summa</th>
                          <th>Chegirma summasi</th>
                          <th>To&apos;lov usuli</th>
                          <th>To&apos;lov qilingan sana</th>
                        </tr>
                        {student.paymentList &&
                          student.paymentList.map(
                            (el, index) =>
                              el && (
                                <tr key={index}>
                                  <td className="numberList">{numberCicles++}</td>
                                  <td>{el.group_name}</td>
                                  <td>{el.amount}</td>
                                  <td>{el.sale}</td>
                                  <td>{el.type == 'cash' ? 'Naqd pul orqali' :
                                    el.type == 'Payme' ? 'Payme' :
                                      el.type == 'Click' ? 'Click' :
                                        el.type == 'Uzumpay' ? 'Uzumpay' :
                                          el.type == 'Zoomrad' ? 'Zoomrad' :
                                            el.type == 'Paynet' ? 'Paynet' :
                                              el.type == 'Oson' ? 'Oson' :
                                                el.type == 'AlifMobi' ? 'Alif Mobi' :
                                                  el.type == 'Anorbank' ? 'Anorbank' :
                                                    el.type == 'Beepul' ? 'Beepul' :
                                                      el.type == 'Davrmobile' ? 'Davr mobile' :
                                                        el.type == 'other' ? 'Boshqa yo\'l bilan' : 'Mavjud emas'}</td>
                                  <td>{filterTime(el.createdAt)}</td>
                                </tr>
                              )
                          )}
                      </tbody>
                    </table>
                  </CenterBottom>
                  <hr />
                </div>
              ) : ('')
            }
            {
              student && inChekend && blacklist && blacklist.length > 0 ? (
                <CenterRatingBottom>
                  <div className='ratingCheckBoxBtnPart'>
                    {
                      student && inChekend && blacklist && blacklist.map((e) => (
                        <div key={e.id}>
                          <FormControlLabel
                            disabled={isCheckDisable}
                            control={
                              <Checkbox
                                id={e.id}
                                checked={inChekend.includes(e.id)}
                                onChange={handleClick}
                              />

                            }
                            label={e.name.length > 50 ? `${e.name.slice(0, 50)}...` : e.name}
                          />
                        </div>

                      ))
                    }
                  </div>
                  <div className='ratingAddBtnPart'>
                    <Button
                      // sx={{ pt: 1, pb: 1 }}
                      className="buy_btn_modal"
                      variant="contained"
                      onClick={ratingCall}
                    >
                      {isDisable ? 'Tahrirlash' : 'Saqlash'}
                    </Button>
                  </div>
                </CenterRatingBottom>
              ) : ('')
            }
          </div>
        )
      )}
    </Container>
  );
};

export default Student;
