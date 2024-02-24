import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import { NumericFormat } from 'react-number-format';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../index';
import http from '../../http/index';
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
    padding-right: 2%;
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

function AllGroups() {
  const { user } = useContext(Context);
  const navigate = useNavigate();
  const urlID = window.location.href.split('/');
  const [open, setOpen] = useState(false);
  const [dataGet, setDataGet] = useState([]);
  const [groupName, setGroupName] = useState([]);
  const [messsageOpen, setMessageOpen] = useState(false);
  const [textAreaCount, setTextAreaCount] = useState('');
  const [teacherDataName, setTeacherDataName] = useState('');
  const [deleteId, setDeleteId] = useState('');
  const [skeletonTime, setSkeletonTime] = useState(true);
  const [textYes, setTextYes] = useState(false);
  const [dataUpdate, setDataUpdate] = useState(false);
  const [errorIsStudent, seterrorIsStudent] = useState(false);
  const [errorIsLimit, seterrorIsLimit] = useState(false);
  const [successDeleteGroup, setSuccessDeleteGroup] = useState(false);
  const bodyParameters = {
    key: 'value',
  };

  useEffect(() => {
    http
      .get(import.meta.env.VITE_API_URL + `api/group/get/${urlID[4]}`)
      .then((res) => {
        setDataGet(res.data.groupList);
        setTeacherDataName(res.data.teacherData);
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
  let i = 1;
  const deleteGroup = (e) => {
    const id = e.substring(6);
    setSkeletonTime(true);
    http
      .post(
        import.meta.env.VITE_API_URL + `api/group/delete/${id}`,
        bodyParameters
      )
      .then(() => {
        setGroupName('');
        setDataUpdate(true);
        setSuccessDeleteGroup(true);
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

  useEffect(() => {
    if (dataUpdate) {
      http
        .get(import.meta.env.VITE_API_URL + `api/group/get/${urlID[4]}`)
        .then((res) => {
          setDataGet(res.data.groupList);
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

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setGroupName('');
    setOpen(false);
  };

  const messOpen = (e) => {
    if (e.count_students == 0) {
      setMessageOpen(false);
      seterrorIsStudent(true);
    } else {
      setMessageOpen(true);
      seterrorIsStudent(false);
    }
  };

  const handleCloseBar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    seterrorIsStudent(false);
  };
  const handleCloseBarDelete = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSuccessDeleteGroup(false);
  };

  const messSubmit = () => {
    const id = deleteId.substring(6);
    if (textAreaCount && !/^\s*$/.test(textAreaCount)) {
      if (textAreaCount.length >= 4) {
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
  const closeMessageModal = () => {
    setMessageOpen(false);
    setTextAreaCount('');
    setTextYes(false);
  };

  if (dataGet) {
    data = dataGet.map((e) => {
      const groupData = {
        id: e.id,
        name: e.name,
        teacher_id: e.teacher_id,
        teachName: e.teacher,
        month_payment: e.month_payment,
      };
      return (
        <tr className="groups_all_informations" key={e.id}>
          <td className="number_table">{i++}.</td>
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
            /> so&apos;m
          </td>
          <td className="action" style={{paddingRight: user?.user?.role == 'admin' || user?.user?.role == 'super' ? '2%' : '3.5%'}}>
            <Tooltip
              title="Xabar yuborish"
              arrow
              TransitionComponent={Fade}
              placement="top"
            >
              <button
                id={`messeng${e.id}`}
                className="message_btn"
                onClick={(message) => {
                  messOpen(e);
                  setGroupName(dataGet);
                  setDeleteId(message.target.id);
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
              <button className="edit" style={{display: user?.user?.role == 'admin' || user?.user?.role == 'super' ? 'inline-block' : 'none'}}>
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
                onClick={(e) => {
                  setGroupName(dataGet);
                  setDeleteId(e.target.id);
                  handleOpen(e);
                }}
                style={{display: user?.user?.role == 'admin' || user?.user?.role == 'super' ? 'inline-block' : 'none'}}
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
  let name;
  if (groupName) {
    name = groupName.filter((e) => {
      const id = deleteId.substring(6);
      return e.id == id ? e.name : '';
    });
  }

  const changeTextArea = (e) => {
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
              <div style={{display: 'flex'}}>
              <h2 style={{whiteSpace: 'nowrap', marginRight: '.5rem'}}>{teacherDataName.name} </h2>
                <h2> guruhlari</h2>
              </div>
              <HeaderRight>
                <SectionOne>
                  <Tooltip
                    title="Guruh qo'shish"
                    arrow
                    TransitionComponent={Fade}
                    placement="top"
                  >
                    <Link to={'/groups/addgroup'} style={{display: user?.user?.role == 'admin' || user?.user?.role == 'super' ? 'inherit' : 'none'}}>
                      <button className="addGroup">
                        <i className="fa-solid fa-plus"></i>
                      </button>
                    </Link>
                  </Tooltip>
                </SectionOne>
              </HeaderRight>
            </Header>
            <Table>
              <thead>
                <TableHeader>
                  <th className="number_th">
                    <p>T/r</p>
                  </th>
                  <th className="name_th">
                    <p>Guruh Nomi</p>
                  </th>
                  <th className="count_th">
                    <p>O&apos;quvchilar soni</p>
                  </th>
                  <th className="pay_th">
                    <p>Oylik to&apos;lov</p>
                  </th>
                  <th className="action_th">
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
                      name.map((e) => (
                        <p key={e.id}>
                          Rostdan ham ushbu {e.name.length > 30 ? `${e.name.slice(0, 30)}...` : e.name} guruhini
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
                          <p key={e.id} className="header_group_name">
                            {e.name.length > 30 ? `${e.name.slice(0, 30)}...` : e.name}
                          </p>
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
                      onChange={(e) => { changeTextArea(e); }}
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

              <Section>{data}</Section>
              <Snackbar
                open={errorIsStudent}
                onClose={handleCloseBar}
                severity={'error'}
                massage={'Guruhda o\'quvchi mavjud emas'}
              />
              <Snackbar
                open={successDeleteGroup}
                onClose={handleCloseBarDelete}
                severity={'success'}
                massage={'Guruh muvaffaqiyatli o\'chirildi'}
              />
            </Table>
          </Container>
        </div>
      )}
    </div>
  );
}

export default AllGroups;
