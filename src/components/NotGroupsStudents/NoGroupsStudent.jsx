/* eslint-disable react/jsx-key */
import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import http from '../../http/index';
import CloseIcon from '@mui/icons-material/Close';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../index';
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import NumericInput from 'material-ui-numeric-input';
import Select from '@mui/material/Select';
import Snackbar from '../Snackbar/Snackbar';
import { FormControlLabel, Checkbox, TextField, Pagination, Stack } from '@mui/material';

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
  .filterPart{
    padding: 10px 20px;
    display: flex;
    align-items: center;
    gap: 15px;
  }
`;
const Header = styled.div`
  background-color: white;
  display: flex;
  align-items: center;
  padding: 10px 20px;
  justify-content: space-between;
  h2{
    color: rgb(4,41,84);
  }
  .send_message_btn {
    border: none;
    background-color: initial;
    width: 2.2rem;
    height: 2.2rem;
    font-size: 17px;
    cursor: pointer;
    color: #fdc600;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    outline: 1.5px solid #fdc600;
    border-radius: 50%;
    border: none;
    &:hover{
      background-color:#fdc600;
      color: #fff;
    }
  }
`;

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
  border: 1px solid #efefef;
  color: #7d7d7d;
  border-bottom: none;
  th,
  td {
    border-left: none;
    border-top: none;
    border-collapse: collapse;
    border-bottom: none;
    border-right: none;
  }
  tr {
    border-left: none;
    border-bottom: none;
    border-collapse: collapse;
    border-right: none;
  }
  .number {
    width: 10%;
    padding-left: 25px;
    text-align: left;
  }
  .name {
    width: 33%;
  }
  .phone {
    width: 28%;
    text-align: left;
  }
  .pay {
    width: 14%;
    text-align: center;
  }
  .img {
    width: 8%;
    text-align: center;
    padding-right: 15px;
  }
  .paidAdd {
    width: 12%;
    text-align: right;
  }
  .action {
    width: 15%;
    text-align: right;
    padding-right: 10px;
  }
`;

const TableHeader = styled.tr`
  width: 100%;
  display: flex;
  text-align: left;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #efefef;
  background-color: white;
`;

const Section = styled.tbody`
  width: 100%;
  background-color: white;
  tr {
    height: 50px;
    text-align: left;
    &:nth-child(even) {
      background-color: #f8f8f8;
    }
    display: flex;
    align-items: center;
  }
  .number {
    width: 10%;
    padding-left: 25px;
    text-align: left;
  }
  .name {
    width: 33%;
    text-align: left;
  }
  .phone {
    width: 28%;
    text-align: left;
  }
  .pay {
    width: 14%;
    text-align: center;
  }
  .img {
    width: 8%;
    text-align: center;
  }
  .paidAdd {
    width: 12%;
    text-align: right;
  }
  .action {
    width: 15%;
    text-align: right;
  }
  .eye {
    background-color: initial;
    color: #313131;
    border: none;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.5;
    margin-right: 1.5rem;
    &:hover {
      color: #5a5a5a;
      transform: scale(1.19);
    }
  }
  .delete {
    background-color: initial;
    color: #c20404;
    border: none;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s;
    &:hover {
      color: #ff0808;
    }
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

const PaginationSection = styled.div`
  margin-top: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
`;


const MessageModal = styled.div`
  width: 450px;
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
  -webkit-box-shadow: -1px 12px 8px 0px rgba(34, 60, 80, 0.2);
  -moz-box-shadow: -1px 12px 8px 0px rgba(34, 60, 80, 0.2);
  box-shadow: -1px 12px 8px 0px rgba(34, 60, 80, 0.2);
  .close_modal {
    display: flex;
    justify-content: space-between;
    padding-top: 0.8rem;
    background-color: #fdc600;
    position: sticky;
    width: 100%;
    top: 0;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    color: #312c1c;
    font-weight: 400;
    .header_modal_message {
      padding-left: 1rem;
      padding-bottom: 1rem;
      .header_group_name {
        font-size: 1.5rem;
        font-weight: bold;
        color: #312c1c;
        font-family: sans-serif;
      }
    }
  }
  .close_modal_btn {
    border: none;
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background-color: initial;
    font-size: 1.3rem;
    cursor: pointer;
    color: #222222;
    font-weight: 600;
    transition: all 0.5s;
    &:hover {
      color: #0e0e0e;
    }
  }

  .allGroups_delete_modal_part {
    display: flex;
    justify-content: flex-end;
    button {
      text-transform: capitalize;
      margin-right: 1rem;
    }
    .delete_modal_btn_error {
      background-color: #042954;
    }
  }
  .allGroups_delete_notification_part {
    margin-top: 1.1rem;
    padding: 1rem;
    .message_modal_textarea {
      border: 1.5px solid #636363;
      border-radius: 3px;
      width: 100%;
      height: 8rem;
      resize: none;
      padding: 0.5rem;
      font-size: 1rem;
      font-family: sans-serif;
      &::placeholder {
        font-size: 1rem;
        font-family: sans-serif;
      }
      &:focus {
        outline: none;
        border: 1.5px solid #1f1f1f;
      }
    }
  }
  .errorText{
    margin-top: 3px;
    margin-bottom: 10px;
    margin-left: 4px;
    font-size: 0.85rem;
    color: #d32f2f;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    font-weight: 400;
    font-size: 0.75rem;
    line-height: 1.66;
    letter-spacing: 0.03333em;
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

const NotGroupsStudentTables = () => {
  const navigate = useNavigate();
  const { user } = useContext(Context);
  const [open, setOpen] = useState(false);
  const [getValue, setGetValue] = useState([]);
  const [deleteId, setDeleteId] = useState('');
  const [groupName, setGroupName] = useState([]);
  const [skeletonTime, setSkeletonTime] = useState(true);
  const [addStudentId, setaddStudentId] = useState('');
  const [addStudentGroupModal, setAddStudentGroupModal] = useState(false);
  const [disabledGroups, setDisabledGroups] = useState(true);
  const [dataUpdate, setDataUpdate] = useState(false);
  const [errorSelectTeacher, setErrorSelectTeacher] = useState(false);
  const [errorSelectTeacherGroup, setErrorSelectTeacherGroup] = useState(false);
  const [errorSelectMonthly, setErrorSelectMonthly] = useState(false);
  const [teacherSelectValue, setteacherSelectValue] = useState('');
  const [teacherSelectGroup, setTeacherSelectGroup] = useState('');
  const [monthlySumma, setMonthlySumma] = useState(0);
  const [groupSelectId, setGroupSelectId] = useState('');
  const [teacherData, setTeacherData] = useState([]);
  const [teacherGroupData, setTeacherGroupData] = useState([]);
  const [testLesson, setTestLesson] = useState(false);
  const [nameSearchValue, setNameSearchValue] = useState('');
  const [phoneSearchValue, setPhoneSearchValue] = useState('');
  const [filterData, setFilterData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [textAreaCount, setTextAreaCount] = useState('');
  const [textYes, setTextYes] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const [errorIsLimit, seterrorIsLimit] = useState(false);
  const [errorOpenMessage, setErrorOpenMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const itemsPerPage = 20;

  const handleOpen = (e) => {
    setDeleteId(e.currentTarget.id.substring(6));
    setOpen(true);
  };
  const handleClose = () => {
    setDeleteId('');
    setGroupName([]);
    setOpen(false);
  };

  useEffect(() => {
    http
      .get(import.meta.env.VITE_API_URL + 'api/student_pending/all/list/get')
      .then((res) => {
        setGetValue(res.data.studentList);
        setTeacherData(res.data.groupData);
        setDeleteId('');
        setGroupName([]);
        setSkeletonTime(false);
      })
      .catch((error) => {
        if (
          error.response && error.response.data && error.response.data.message == 'ro\'yxattan o\'tmagan foydalanuvchi!'
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
    http
      .get(import.meta.env.VITE_API_URL + 'api/student_pending/all/list/get')
      .then((res) => {
        setGetValue(res.data.studentList);
        setTeacherData(res.data.groupData);
        setDeleteId('');
        setGroupName([]);
        setDataUpdate(false);
        setSkeletonTime(false);
      })
      .catch((error) => {
        if (
          error.response && error.response.data && error.response.data.message == 'ro\'yxattan o\'tmagan foydalanuvchi!'
        ) {
          user.setIsAuth(false);
          localStorage.clear();
          navigate('/');
        } else {
          console.log(error);
        }
      });
  }, [dataUpdate]);


  useEffect(() => {
    const filteredData = getValue.filter((el) => {
      const nameMatch = nameSearchValue === '' || el.name.toLowerCase().includes(nameSearchValue.toLowerCase());
      const phoneMatch = phoneSearchValue === '' || el.phone.toLowerCase().includes(phoneSearchValue.toLowerCase());
      return nameMatch && phoneMatch;
    });
    setFilterData(filteredData);
    setCurrentPage(1);
  }, [nameSearchValue, phoneSearchValue, getValue]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filterData.slice(startIndex, endIndex);

  let data = [];
  let number = 1;
  if (filterData) {
    data = paginatedData && paginatedData.map((e) => {
      return (
        <tr key={e.id}>
          <td className="number">{number++}.</td>
          <td className="name">{e.name} </td>
          <td className="phone">{e.phone}</td>
          <td className="pay">{e.age}</td>
          <td className="action">
            <Tooltip
              title="Guruhga qo'shish"
              arrow
              TransitionComponent={Fade}
              placement="top"
            >
              <GroupAddIcon id={e.id}
                onClick={() => {
                  setGroupName(getValue);
                  handleGroupAddStudentFun(e);
                }}
                className="fa-solid fa-plus eye"
                style={{ color: '#033a6b', fontSize: '1.2rem' }} />
            </Tooltip>
            <Tooltip
              title="Ma'lumotlar"
              arrow
              TransitionComponent={Fade}
              placement="top"
            >
              <Link
                to={
                  e.status == 'pending'
                    ? `/not-group-student-page/${e.id}`
                    : `/student/${e.id}`
                }
                className="eye"
              >
                <i className="fa-solid fa-eye"></i>
              </Link>
            </Tooltip>
            <Tooltip
              title="O'chirish"
              arrow
              TransitionComponent={Fade}
              placement="top"
            >
              <button
                id={`delete${e.id}`}
                onClick={(e) => {
                  handleOpen(e);
                  setGroupName(getValue);
                }}
                className="delete"
              >
                <i className="fa-solid fa-trash"></i>
              </button>
            </Tooltip>
          </td>
        </tr>
      );
    });
  }

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };


  const handleGroupAddStudentFun = (e) => {
    setaddStudentId(e.id);
    setAddStudentGroupModal(true);
  };

  const studentDelete = (e) => {
    const id = e;
    setSkeletonTime(true);
    http
      .post(import.meta.env.VITE_API_URL + `api/student_pending/delete/${id}`, {
        name: 'delete',
      })
      .then(() => {
        setDataUpdate(true);
      })
      .catch((e) => {
        console.log(e);
        // Xatolik xabari yozish kk
      });
    handleClose();
  };
  let name = [];
  if (groupName && deleteId) {
    name = groupName.filter((e) => {
      const id = deleteId;
      return e.id == id ? e.name : '';
    });
  }
  let nameAddStudent = [];
  if (groupName && addStudentId) {
    nameAddStudent = groupName.filter((e) => {
      const id = addStudentId;
      return e.id == id ? e.name : '';
    });
  }

  const closeAndSaveAddModal = () => {
    setAddStudentGroupModal(false);
    setteacherSelectValue('');
    setDisabledGroups(true);
  };

  const changeMonthSumma = (event) => {
    setMonthlySumma(event.target.value);
  };

  const teacherSelectChange = (event) => {
    const selectedValue = event.target.value;
    setteacherSelectValue(selectedValue);
    const selectedObject = teacherData.find(
      (item) => item.name === selectedValue
    );
    setTeacherGroupData(selectedObject ? selectedObject.group : []);
    setDisabledGroups(false);
    setErrorSelectTeacher(false);
  };
  const teacherSelectGroupChange = (event, obj) => {
    const { key } = obj;
    const filterId = key.substring(2);
    setGroupSelectId(filterId);
    const selectedValue = event.target.value;
    setTeacherSelectGroup(selectedValue);
    const filterMonth = teacherGroupData && teacherGroupData.find((e) => (
      e.name === selectedValue
    ));
    setMonthlySumma(filterMonth.month_payment);
    setErrorSelectTeacherGroup(false);
    setErrorSelectMonthly(false);
  };

  const addStudentGroupFun = () => {
    if (teacherSelectValue && teacherSelectGroup && monthlySumma > 0) {
      setAddStudentGroupModal(false);
      setSkeletonTime(true);
      setTeacherSelectGroup('');
      setteacherSelectValue('');
      http
        .post(
          import.meta.env.VITE_API_URL + 'api/student_pending/group-add-student',
          {
            group_id: groupSelectId,
            student_id: addStudentId,
            summa: Number(monthlySumma),
            status: testLesson
          }
        )
        .then(() => {
          setDataUpdate(true);
        })
        .catch((e) => {
          console.log(e);
          // Xatolik xabari yozish kk
        });
    } else {
      if (!teacherSelectValue) {
        setErrorSelectTeacher(true);
      } else {
        setErrorSelectTeacher(false);
      }
      if (!teacherSelectGroup) {
        setErrorSelectTeacherGroup(true);
      } else {
        setErrorSelectTeacherGroup(false);
      }
      if (monthlySumma <= 0) {
        setErrorSelectMonthly(true);
      } else {
        setErrorSelectMonthly(false);
      }
    }
  };

  const changeSearchValue = (e) => {
    setNameSearchValue(e.target.value);
  };
  const changePhoneSearch = (e) => {
    setPhoneSearchValue(e.target.value);
  };

  const messageOpenFun = () => {
    if (filterData.length > 0) {
      setMessageOpen(true);
    } else {
      setErrorOpenMessage(true);
    }
  };
  const closeMessageModal = () => {
    setMessageOpen(false);
    setTextAreaCount('');
  };

  const messSubmit = () => {
    if (textAreaCount && !/^\s*$/.test(textAreaCount)) {
      if (textAreaCount.length >= 4) {
        setMessageOpen(false);
        setSkeletonTime(true);
        const studentList = filterData.map((e) => {
          return e.id;
        });
        let messageTime = new Date();
        http
          .post(import.meta.env.VITE_API_URL + 'api/message/all/list', {
            text: textAreaCount,
            time: String(messageTime),
            studentIdList: studentList,
          })
          .then(() => {
            setSkeletonTime(false);
            setSuccessMessage(true);
            setTextYes(false);
            setTextAreaCount('');
            seterrorIsLimit(false);
            setDataUpdate(true);
          })
          .catch((e) => {
            console.log(e);
            setTextYes(false);
            if (
              e.response.data.message == 'ro\'yxattan o\'tmagan foydalanuvchi!'
            ) {
              user.setIsAuth(false);
              localStorage.clear();
              navigate('/');
            } else {
              console.log(e);
            }
          });
      } else {
        if (textAreaCount.length < 4) {
          seterrorIsLimit(true);
          setTextYes(false);
        } else {
          seterrorIsLimit(false);
        }
      }
    } else {
      if (!textAreaCount || /^\s*$/.test(textAreaCount)) {
        setTextYes(true);
        seterrorIsLimit(false);
      } else {
        setTextYes(false);
      }
    }
  };


  const handleCloseBar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSuccessMessage(false);
  };
  const handleCloseBarMessageError = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setErrorOpenMessage(false);
  };

  return (
    <div>
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
        <div>
          <Container>
            <Header>
              <div>
                <h2>Guruhi mavjud bo&apos;lmagan o&apos;quvchilar</h2>
              </div>
              <Tooltip
                title="Xabar yuborish"
                arrow
                TransitionComponent={Fade}
                placement="top"
              >
                <button
                  className="send_message_btn"
                  onClick={messageOpenFun}
                >
                  <i className="fa-regular fa-envelope"></i>
                </button>
              </Tooltip>
            </Header>
            <div className='filterPart'>
              <TextField size='small' sx={{ width: '180px' }} id="outlined-basic" value={nameSearchValue} onChange={changeSearchValue} label="Ismi bo'yicha qidirish" variant="outlined" />
              <TextField size='small' sx={{ width: '220px' }} type='number' id="outlined-basic" value={phoneSearchValue} onChange={changePhoneSearch} label="Telefon raqami bo'yicha qidirish" variant="outlined" />
            </div>
            <Table>
              <thead>
                <TableHeader>
                  <th className="number">
                    <p>T/r</p>
                  </th>
                  <th className="name">
                    <p>Ismi familyasi</p>
                  </th>
                  <th className="phone">
                    <p>Telefon</p>
                  </th>
                  <th className="pay">
                    <p>Yoshi</p>
                  </th>
                  <th className="action">
                    <p>Amallar</p>
                  </th>
                </TableHeader>
              </thead>
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
                    {name &&
                      name.map((studentName) => {
                        return (
                          <p id={studentName.id}>
                            Rostdan ham ushbu {studentName.name.length > 30 ? `${studentName.name.slice(0, 30)}...` : studentName.name}ni{' '}
                            o&apos;chirmoqchimisiz
                          </p>
                        );
                      })}
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
                      onClick={() => {
                        deleteId ? studentDelete(deleteId) : '';
                      }}
                    >
                      O&apos;chirish
                    </Button>
                  </div>
                </AllGroupsDeleteModal>
              </Modal>
              <Modal open={addStudentGroupModal}>
                <Box sx={style}>
                  <CloseIcon
                    style={{
                      position: 'absolute',
                      right: '2%',
                      top: '3%',
                      cursor: 'pointer',
                    }}
                    onClick={closeAndSaveAddModal}
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
                      top: 0,
                      background: '#FDC600',
                    }}
                  >
                    {nameAddStudent &&
                      nameAddStudent.map((groupName) => {
                        return (
                          <h2 key={groupName.id} id={groupName.id}>
                            {groupName.name}
                          </h2>
                        );
                      })}
                    <p>ushbu o&apos;quvchini guruhga qo&apos;shish</p>
                  </div>

                  <Box sx={{ width: '100%', mt: 9 }}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        O&apos;qituvchini tanlang
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={teacherSelectValue}
                        label="O'qituvchini tanlang"
                        onChange={teacherSelectChange}
                      >
                        {teacherData &&
                          teacherData.map((data) => (
                            <MenuItem key={data.id} value={data.name}>
                              {data.name}
                            </MenuItem>
                          ))}
                      </Select>
                      <p
                        style={{
                          display: errorSelectTeacher ? 'block' : 'none',
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
                        O&apos;qituvchini tanlang
                      </p>
                    </FormControl>
                    <FormControl
                      fullWidth
                      sx={{ marginTop: '1rem' }}
                      className="groupSelect"
                      disabled={disabledGroups}
                    >
                      <InputLabel id="demo-simple-select-label">
                        Guruhni tanlang
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={teacherSelectGroup}
                        label="Guruhni tanlang"
                        onChange={teacherSelectGroupChange}
                      >
                        {teacherGroupData.length !== 0 ? (
                          teacherGroupData &&
                          teacherGroupData.map((data) => (
                            <MenuItem key={data.id} value={data.name}>
                              {data.name}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem disabled>Guruh mavjud emas</MenuItem>
                        )}
                      </Select>
                      <p
                        style={{
                          display: errorSelectTeacherGroup ? 'block' : 'none',
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
                        Guruhni tanlang
                      </p>
                    </FormControl>
                    <Box sx={{ width: '100%', marginTop: '1rem' }}>
                      <NumericInput
                        fullWidth
                        precision={''}
                        decimalChar=","
                        thousandChar="."
                        label="O'quvchi oylik to'lov summasi"
                        value={monthlySumma}
                        onChange={changeMonthSumma}
                        variant="outlined"
                        inputProps={{
                          maxLength: 8,
                          minLength: 0,
                        }}
                      />
                      <p
                        style={{
                          display: errorSelectMonthly ? 'block' : 'none',
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
                        To&apos;lov summasini kiriting
                      </p>
                      <FormControlLabel value={testLesson} onChange={() => setTestLesson(!testLesson)} control={<Checkbox />} label="Ushbu o'quvchini sinov darsiga qo'shish" />
                    </Box>
                  </Box>
                  <Button
                    sx={{ mt: 3, pt: 1, pb: 1 }}
                    fullWidth
                    className="buy_btn_modal"
                    variant="contained"
                    onClick={addStudentGroupFun}
                  >
                    Qo&apos;shish
                  </Button>
                </Box>
              </Modal>
              <Modal
                open={messageOpen}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <MessageModal>
                  <div className="close_modal">
                    <div className="header_modal_message">
                      <h2>Xabar yuborish</h2>
                    </div>
                    <button
                      className="close_modal_btn"
                      onClick={() => closeMessageModal()}
                    >
                      <CloseIcon />
                    </button>
                  </div>
                  <div className="allGroups_delete_notification_part">
                    <p
                      style={{
                        color: 'red',
                        display: errorIsLimit ? 'block' : 'none',
                        marginBottom: '1rem',
                      }}
                    >
                      Eng kamida 4 ta belgi bo&apos;lishi zarur
                    </p>
                    <textarea
                      placeholder="Xabar yoborish..."
                      type="text"
                      maxLength={160}
                      value={textAreaCount}
                      className="message_modal_textarea"
                      onChange={(e) => {
                        setTextAreaCount(e.target.value);
                        setTextYes(false);
                      }}
                    />
                    <p
                      className='errorText'
                      style={{
                        // color: 'red',
                        display: textYes ? 'block' : 'none',
                        // marginBottom: '1rem',
                      }}
                    >
                      Xabar yozilmadi
                    </p>
                    <p>{textAreaCount.length} / 160</p>
                  </div>
                  <div className="allGroups_delete_modal_part">
                    <Button
                      className="delete_modal_btn_error"
                      variant="contained"
                      onClick={messSubmit}
                    >
                      Yuborish
                    </Button>
                  </div>
                </MessageModal>
              </Modal>
              <Section>{data}</Section>
            </Table>
            <PaginationSection>
              <Stack spacing={3}>
                <Pagination
                  count={Math.ceil(filterData.length / itemsPerPage)}
                  page={currentPage}
                  onChange={handlePageChange}
                  color='primary'
                  variant='outlined'
                  shape='rounded'
                />
              </Stack>
            </PaginationSection>
            <Snackbar
              open={successMessage}
              onClose={handleCloseBar}
              severity={'success'}
              massage={'Xabar muvaffaqiyatli yuborildi'}
            />
            <Snackbar
              open={errorOpenMessage}
              onClose={handleCloseBarMessageError}
              severity={'error'}
              massage={'O\'quvchilar mavjud emas'}
            />
          </Container>
        </div>
      )}
    </div>
  );
};

export default NotGroupsStudentTables;