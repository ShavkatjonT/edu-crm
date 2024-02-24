import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import http from '../../http/index';
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';
import { Link } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import Modal from '@mui/material/Modal';
import { Context } from '../../index';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import Snackbar from '../Snackbar/Snackbar';

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

  .message_btn {
    background-color: initial;
    color: #fdc600;
    border: none;
    font-size: 1.2rem;
    margin-right: 13px;
    cursor: pointer;
    transition: all 0.2s;
    &:hover {
      color: #fdc600;
    }
  }
`;
const Header = styled.div`
  .action_right {
    display: flex;
    justify-content: center;
    align-items: baseline;
  }
  display: flex;
  padding: 15px 20px;
  align-items: center;
  justify-content: space-between;
  .delete_student_icon {
    color: #c20404;
    cursor: pointer;
    font-size: 1.1rem;
    transition: all 0.2s;
    margin: 0 0.5rem;
    &:hover {
      color: #ff0808;
    }
  }
  .edit {
    background-color: initial;
    i {
      color: #585353;
    }
    border: none;
    font-size: 1.1rem;
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
    width: 540px;
    tr {
      height: 50px;
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

function PendingStudent() {
  const { user } = useContext(Context);
  const data = window.location.href.split('/');
  const [student, setStudent] = useState('');
  const [open, setOpen] = useState(false);
  const [skeletonTime, setSkeletonTime] = useState(true);
  const [messsageOpen, setMessageOpen] = useState(false);
  const [textAreaCount, setTextAreaCount] = useState('');
  const [textYes, setTextYes] = useState(false);
  const [errorIsLimit, seterrorIsLimit] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    http
      .get(
        import.meta.env.VITE_API_URL + `api/new-pending-student/get/one/${data[4]}`
      )
      .then((res) => {
        setStudent(res.data);
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
  }, []);

  const deleteStudent = () => {
    setOpen(false);
    setSkeletonTime(true);
    http
    .post(import.meta.env.VITE_API_URL + 'api/new-pending-student/delete', {
      id: data[4]
    })
    .then(() => {
      navigate('/pending');
    })
    .catch((e) => {
      console.log(e);
      // Xatolik xabari yozish kk
    });
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const sendModal = () => {
    setMessageOpen(true);
  };

  const closeMessageModal = () => {
    setMessageOpen(false);
    setTextAreaCount('');
    setTextYes(false);
    seterrorIsLimit(false);
  };

  const messSubmit = () => {
    if (textAreaCount && !/^\s*$/.test(textAreaCount)) {
      if(textAreaCount.length >= 4){
        setSkeletonTime(true);
        let messageTime = new Date();
        http
          .post(import.meta.env.VITE_API_URL + 'api/message/add/pending-student', {
            student_id: data[4],
            text: textAreaCount,
            time: String(messageTime),
          })
          .then(() => {
            setSkeletonTime(false);
            setMessageOpen(false);
            setTextYes(false);
            setTextAreaCount('');
            setSuccessMessage(true);
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

   const handleCloseBarSucces = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSuccessMessage(false);
  };

  return (
    <Container>
      {
        skeletonTime ? (
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
                <div>
                  <h3>{student.firstname + ' ' + student.lastname} ma&apos;lumotlari</h3>
                </div>
                <div className="action_right">
                  <Tooltip
                    title="Xabar yuborish"
                    arrow
                    TransitionComponent={Fade}
                    placement="top"
                  >
                    <button className="message_btn" onClick={sendModal}>
                      <i className="fa-solid fa-envelope"></i>
                    </button>
                  </Tooltip>
                  <Tooltip
                    title="Tahrirlash"
                    arrow
                    TransitionComponent={Fade}
                    placement="top"
                  >
                    <Link to={`/update-pending-student/${data[4]}`}>
                      <button className="edit">
                        <i className="fa-solid fa-pen"></i>
                      </button>
                    </Link>
                  </Tooltip>
                  <Tooltip
                    title="O'chirish"
                    arrow
                    TransitionComponent={Fade}
                    placement="top"
                  >
                    <i
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
                        <td>Ismi familyasi: </td>
                        <td>
                          {student.firstname +
                            ' ' +
                            student.lastname}
                        </td>
                      </tr>
                      <tr>
                        <td>Otasining ismi: </td>
                        <td>{student.fathername.length > 1 ? student.fathername : 'Kiritilmagan'}</td>
                      </tr>
                      <tr>
                        <td>Jinsi: </td>
                        <td>{student.gender}</td>
                      </tr>
    
                      <tr>
                        <td>Tug&apos;ilgan sana: </td>
                        <td>{student.birthday}</td>
                      </tr>
                      <tr>
                        <td>Manzili: </td>
                        <td>{student.address}</td>
                      </tr>
                      <tr>
                        <td>Sinfi: </td>
                        <td>{student.class}</td>
                      </tr>
                      <tr>
                        <td>Otasini telefon raqam: </td>
                        <td>{student.fatherPhone}</td>
                      </tr>
                      <tr>
                        <td>Onasini telefon raqami: </td>
                        <td>{student.motherPhone.length > 1 ? student.motherPhone : 'Kiritilmagan'}</td>
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
                          {student.firstname + ' ' + student.lastname}{' '}
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
                </Center>
              </Main>
              <Modal
                open={messsageOpen}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <MessageModal>
                  <div className="close_modal">
                    <div className="header_modal_message">
                      <p className="header_group_name">
                        {student.firstname + ' ' + student.lastname}
                      </p>
    
                      <p> xabar yuborish</p>
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
                      onChange={(e) => {
                        setTextAreaCount(e.target.value);
                        setTextYes(false);
                      }}
                    />
                    <p>{textAreaCount.length} / 160</p>
                  </div>
                  <div className="allGroups_delete_modal_part">
                    <Button
                      className="delete_modal_btn_error"
                      variant="contained"
                      onClick={() => messSubmit(student.id)}
                    >
                      Yuborish
                    </Button>
                  </div>
                </MessageModal>
              </Modal>
              <Snackbar
              open={successMessage}
              onClose={handleCloseBarSucces}
              severity={'success'}
              massage={'Xabar muvaffaqiyatli yuborildi'}
              />
            </div>
          )
        )
      }
    </Container>
  );
}

export default PendingStudent;
