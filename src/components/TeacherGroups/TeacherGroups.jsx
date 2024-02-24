import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../index';
import http from '../../http/index';
import { NumericFormat } from 'react-number-format';
import Snackbar from '../Snackbar/Snackbar';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';

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
  margin-bottom: 1.8rem;
  padding-top: 10px;
  padding-bottom: 10px;
  background-color: white;
  border-radius: 6px;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.25);
`;
const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 15px 20px;
  justify-content: space-between;
   h2{
    color: rgb(4, 41, 84);
  }
`;
const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;
  width: 50%;
`;
const SectionOne = styled.div`
  .addGroup {
    border: none;
    background-color: initial;
    width: 2.2rem;
    font-size: 19px;
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
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
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
    width: 16%;
    text-align: left;
    padding-left: 1.5%;
  }
  .name_th {
    width: 25%;
    text-align: left;
  }
  .teacher_th {
    width: 25%;
    text-align: left;
  }
  .count_th {
    width: 20%;
    text-align: center;
  }
  .pay_th {
    width: 30%;
    text-align: center;
  }
  .action_th {
    width: 15%;
    text-align: right;
    padding-right: 14px;
  }
`;
const TableHeaderSecond = styled.tr`
  width: 100%;
  display: flex;
  border-bottom: 1px solid #efefef;
  .number_th {
    width: 16%;
    text-align: left;
    padding-left: 1.5%;
  }
  .name_th {
    width: 25%;
    text-align: left;
  }
  .teacher_th {
    width: 25%;
    text-align: center;
  }
  .count_th {
    width: 20%;
    text-align: center;
  }
  .pay_th {
    width: 30%;
    text-align: center;
  }
  .action_th {
    width: 15%;
    text-align: right;
    padding-right: 14px;
  }
`;
const Section = styled.tbody`
  width: 100%;
  border-radius: 15px;
  tr {
    min-height: 50px;
    padding-top: 4px;
    &:nth-child(even) {
      background-color: #f8f8f8;
    }
    display: flex;
  }
  td {
    padding-top: 1%;
  }
  .number_table {
    width: 15.8%;
    text-align: left;
    padding-left: 2%;
  }
  .name_groups {
    width: 25%;
    text-align: left;
    text-decoration: underline;
  }
  .pupils_number {
    width: 20%;
    text-align: center;
  }
  .name_teacher {
    width: 25%;
    text-align: left;
  }
  .pupils_buy {
    width: 30%;
    text-align: center;
  }
  .action {
    width: 15%;
    text-align: right;
    padding-right: 24px;
  }
  .edit {
    background-color: initial;
    i {
      color: #585353;
    }
    border: none;
    font-size: 1rem;
    margin-left: 1rem;
    margin-right: 1rem;
    cursor: pointer;
    display: inline-block;
    transition: all 0.2s;
    text-decoration: none !important;
    .linkEdit {
      text-decoration: none !important;
    }
    &:hover {
      i {
        color: #7d7d7d;
      }
    }
  }
  .message_btn {
    background-color: initial;
    color: #fdc600;
    border: none;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s;
    &:hover {
      color: #ffd84a;
    }
  }
  .delete {
    background-color: initial;
    color: #c20404;
    border: none;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s;
    &:hover {
      color: #ff0808;
    }
  }
  .eye {
    background-color: initial;
    color: #313131;
    border: none;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.5;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
    &:hover {
      color: #5a5a5a;
      transform: scale(1.19);
    }
  }
`;
const SectionSecond = styled.tbody`
  width: 100%;
  border-radius: 15px;
  tr {
    min-height: 50px;
    padding-top: 4px;
    &:nth-child(even) {
      background-color: #f8f8f8;
    }
    display: flex;
  }
  td {
    padding-top: 1%;
  }
  .number_table {
    width: 16%;
    text-align: left;
    padding-left: 2%;
  }
  .name_groups {
    width: 25%;
    text-align: left;
    text-decoration: underline;
  }
  .pupils_number {
    width: 25%;
    text-align: center;
  }
  .name_teacher {
    width: 25%;
    text-align: left;
  }
  .pupils_buy {
    width: 20%;
    text-align: center;
  }
  .action {
    width: 15%;
    text-align: right;
    padding-right: 12px;
  }
  .edit {
    background-color: initial;
    i {
      color: #585353;
    }
    border: none;
    font-size: 1rem;
    margin-left: 1rem;
    margin-right: 1rem;
    cursor: pointer;
    display: inline-block;
    transition: all 0.2s;
    text-decoration: none !important;
    .linkEdit {
      text-decoration: none !important;
    }
    &:hover {
      i {
        color: #7d7d7d;
      }
    }
  }
  .message_btn {
    background-color: initial;
    color: #fdc600;
    border: none;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s;
    &:hover {
      color: #ffd84a;
    }
  }
  .delete {
    background-color: initial;
    color: #c20404;
    border: none;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s;
    &:hover {
      color: #ff0808;
    }
  }
  .eye {
    background-color: initial;
    color: #313131;
    border: none;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.5;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
    &:hover {
      color: #5a5a5a;
      transform: scale(1.19);
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
`;

function TeacherGroups() {
  const { user } = useContext(Context);
  const navigate = useNavigate();
  const [dataGet, setDataGet] = useState([]);
  const [dataGetNoTeacherGroups, setDataGetNoTeacherGroups] = useState([]);
  const [skeletonTime, setSkeletonTime] = useState(true);
  const [dataUpdate, setDataUpdate] = useState(false);
  const [errorIsStudent, seterrorIsStudent] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [errorIsLimit, seterrorIsLimit] = useState(false);
  const [open, setOpen] = useState(false);
  const [textYes, setTextYes] = useState(false);
  const [textAreaCount, setTextAreaCount] = useState('');
  const [messsageOpen, setMessageOpen] = useState(false);
  const bodyParameters = {
    key: 'value',
  };
  useEffect(() => {
    http
      .get(import.meta.env.VITE_API_URL + 'api/group/teacher-groups/get')
      .then((res) => {
        setDataGet(res.data.teacherGroupList);
        setDataGetNoTeacherGroups(res.data.groupList);
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
  let data;
  let dataNotTeacher;
  let i = 1;

  useEffect(() => {
    if (dataUpdate) {
      http
        .get(import.meta.env.VITE_API_URL + 'api/group/teacher-groups/get')
        .then((res) => {
         setDataGet(res.data.teacherGroupList);
         setDataGetNoTeacherGroups(res.data.groupList);
          setDataUpdate(false);
          setSkeletonTime(false);
        })
        .catch((error) => {
          setDataUpdate(false);
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

  const handleCloseBar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    seterrorIsStudent(false);
  };

  if (dataGet) {
    data = dataGet.map((e) => {
      return (
        <tr className="groups_all_informations" key={e.id}>
          <td className="number_table">{i++}.</td>
          <td className="name_groups">
            <Link to={`/groups/${e.id}`} state={{ id: e.id, name: e.name }}>
              {e.name}
            </Link>
          </td>
          <td className="name_teacher">{e.phone}</td>
          <td className="pupils_number">
            {e.groups_count ? e.groups_count : 0}
          </td>
          <td className="action">
            <Tooltip
              title="Ma'lumotlar"
              arrow
              TransitionComponent={Fade}
              placement="top"
            >
              <Link to={`/employee-data/${e.id}`} className="eye">
                <i className="fa-solid fa-eye"></i>
              </Link>
            </Tooltip>
          </td>
        </tr>
      );
    });
  }

  if(dataGetNoTeacherGroups){
    dataNotTeacher = dataGetNoTeacherGroups.map((e, index) =>{
        const groupData = {
            id: e.id,
            name: e.name,
            teacher_id: e.teacher_id,
            teachName: e.teacher,
            month_payment: e.month_payment,
          };
          return (
            <tr className="groups_all_informations" key={e.id}>
              <td className="number_table">{index+1}.</td>
              <td className="name_groups">
                <Link to={`/group-one/${e.id}`} state={{ id: e.id, name: e.name }}>
                  {e.name}
                </Link>
              </td>
              <td className="pupils_number">
                {e.count_students ? e.count_students : 0}
              </td>
              <td className="pupils_buy">
                <NumericFormat
                  value={e.month_payment}
                  displayType={'text'}
                  thousandSeparator={true}
                  prefix={''}
                />
              </td>
              <td className="action">
              <Tooltip
                  title="Xabar yuborish"
                  arrow
                  TransitionComponent={Fade}
                  placement="top"
                >
                <button
                  id={`messeng${e.id}`}
                  className="message_btn"
                  onClick={() => {
                    messOpen(e);
                    setDeleteId(e.id);
                    deleteId;
                  }}
                >
                  <i id={`delete${e.id}`} className="fa-solid fa-envelope"></i>
                </button>
                </Tooltip>
                <Tooltip
                  title="Tahrirlash"
                  arrow
                  TransitionComponent={Fade}
                  placement="top"
                >
                  <button className="edit">
                    <Link
                      to={`/update-groups/${e.id}`}
                      state={groupData}
                      className="linkEdit"
                    >
                      <i className="fa-solid fa-pen"></i>
                    </Link>
                  </button>
                </Tooltip>
                <Tooltip
                  title="O'chirish"
                  arrow
                  TransitionComponent={Fade}
                  placement="top"
                >
                  <button
                    onClick={(el) => {
                      setDeleteId(e.id);
                      handleOpen(el);
                    }}
                    className="delete"
                  >
                    <i id={`delete${e.id}`} className="fa-solid fa-trash"></i>
                  </button>
                </Tooltip>
              </td>
            </tr>
          );
        
    });
  }

  const messSubmit = () => {
    const id = deleteId;
    if (textAreaCount && !/^\s*$/.test(textAreaCount)) {
      if(textAreaCount.length >= 4){
        setSkeletonTime(true);
        let messageTime = new Date();
        http
          .post(import.meta.env.VITE_API_URL + 'api/message/add/group', {
            group_id: id,
            text: textAreaCount,
            time: String(messageTime),
          })
          .then(() => {
            setSkeletonTime(false);
            setMessageOpen(false);
            setTextYes(false);
            setTextAreaCount('');
          })
          .catch((e) => {
            console.log(e);
            setTextYes(false);
          });
      }else{
        if (textAreaCount.length < 4) {
          seterrorIsLimit(true);
          setTextYes(false);
        }else{
          seterrorIsLimit(false);
        }
      }
    } else {
      if(!textAreaCount || /^\s*$/.test(textAreaCount)){
        setTextYes(true);
        seterrorIsLimit(false);
      }else{
        setTextYes(false);
      }
    }
  };
  const closeMessageModal = () => {
    setMessageOpen(false);
    setTextAreaCount('');
    setTextYes(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };


  const messOpen = (e) => {
    if (e.count_students == 0) {
      setMessageOpen(false);
      seterrorIsStudent(true);
    }else{
      setMessageOpen(true);
      seterrorIsStudent(false);
    }
  };

  let name;
  if (dataGetNoTeacherGroups && deleteId) {
    name = dataGetNoTeacherGroups.filter((e) => {
      const id = deleteId;
      return e.id == id ? e.name : '';
    });
  }

  
  const handleClose = () => {
    setOpen(false);
  };

  const deleteGroup = (e) => {
    const id = e;
    setSkeletonTime(true);
    http
      .post(
        import.meta.env.VITE_API_URL + `api/group/delete/${id}`,
        bodyParameters
      )
      .then(() => {
        setDataUpdate(true);
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
    handleClose();
    setDeleteId();
  };

  
  const changeTextArea =(e) =>{
    setTextAreaCount(e.target.value);
    setTextYes(false);
    seterrorIsLimit(false);
  };


  return (
    <div>
      {skeletonTime ? (
        <ContentSkeleton>
          <Box sx={{ width: '100%' }}>
            <Skeleton width="30%" height="2rem" />
            <Skeleton width="40%" height="2rem" />
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
                <h2>Guruhlar</h2>
              </div>
              <HeaderRight>
                <SectionOne></SectionOne>
              </HeaderRight>
            </Header>
          <Table>
            <thead>
              <TableHeader>
                <th className="number_th">
                  <p>T/r</p>
                </th>
                <th className="name_th">
                  <p>O&apos;qituvchi</p>
                </th>
                <th className="teacher_th">
                  <p>Telefon raqami</p>
                </th>
                <th className="count_th">
                  <p>Guruhlar soni</p>
                </th>
                <th className="action_th">
                  <p>Amallar</p>
                </th>
              </TableHeader>
            </thead>

            <Section>{data}</Section>
            <Snackbar
              open={errorIsStudent}
              onClose={handleCloseBar}
              severity={'error'}
              massage={'Guruhda o\'quvchi mavjud emas'}
            />
          </Table>
          </Container>
          {
            dataNotTeacher.length != 0 ? (
              <Container>
              <Header>
                  <div>
                    <h2>O&apos;qituvchisi tayinlanmagan  guruhlar</h2>
                  </div>
                </Header>
               <Table>
               <thead>
                  <TableHeaderSecond>
                    <th className="number_th">
                      <p>T/r</p>
                    </th>
                    <th className="name_th">
                      <p>Guruh nomi</p>
                    </th>
                    <th className="teacher_th">
                      <p>O&apos;quvchilar soni</p>
                    </th>
                    <th className="count_th">
                      <p>Oylik to&apos;lov</p>
                    </th>
                    <th className="action_th">
                      <p>Amallar</p>
                    </th>
                  </TableHeaderSecond>
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
                        name.map((e) => (
                          <p key={e.id}>
                            Rostdan ham ushbu {e.name.length > 40 ? `${e.name.slice(0, 40)}...` : e.name} guruhini
                            o&apos;chirmoqchimisiz
                          </p>
                        ))}
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
                        onClick={() =>
                          deleteId ? deleteGroup(deleteId) : console.log('error')
                        }
                      >
                        O&apos;chirish
                      </Button>
                    </div>
                  </AllGroupsDeleteModal>
                </Modal>
    
                <Modal
                  open={messsageOpen}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <MessageModal>
                    <div className="close_modal">
                      <div className="header_modal_message">
                    
                        {name &&
                          name.map((e) => (
                            <>
                              <p key={e.id} className="header_group_name">
                                {e.name.length > 30 ? `${e.name.slice(0, 30)}...` : e.name} guruhi
                              </p>
                            </>
                          ))}
                        <p>Guruh a&apos;zolariga xabar yuborish</p>
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
                          display: textYes ? 'block' : 'none',
                          marginBottom: '1rem',
                        }}
                      >
                        Xabar yozilmadi
                      </p>
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
                        onChange={(e) => {changeTextArea(e);}}
                      />
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
    
                <SectionSecond>{dataNotTeacher}</SectionSecond>
               </Table>
              </Container>
            ) : (
              ''
            )
          }
        </div>
      )}
    </div>
  );
}

export default TeacherGroups;
