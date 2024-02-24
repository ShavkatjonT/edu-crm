import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import http from '../../http/index';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../index';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';
import Skeleton from '@mui/material/Skeleton';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '../Snackbar/Snackbar';

const Container = styled.div`
  margin-top: 1.8rem;
  padding-top: 10px;
  padding-bottom: 10px;
  background-color: white;
  border-radius: 6px;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.25);
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
`;

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

const Header = styled.div`
  background-color: white;
  display: flex;
  align-items: center;
  padding: 10px 20px 30px;
  justify-content: space-between;
  h2 {
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

const Section = styled.tbody`
  width: 100%;
  .min-height-tr {
    height: 60px;
    &:nth-child(even) {
      background-color: #f8f8f8;
    }
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
const Table = styled.table`
  padding-top: 1rem;
  background-color: white;
  border-collapse: collapse;
  width: 100%;
  /* border: 1px solid #efefef; */
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
    width: 3%;
    text-align: left;
    padding-left: 15px;
  }
  .name {
    width: 26%;
    text-align: left;
  }
  .importantNumber{
    width: 10%;
    text-align: center;
  }
  .actionsThead {
    width: 10%;
    text-align: right;
    padding-right: 20px;
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
      margin-left: 1rem;
      font-size: 1.1rem;
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
const UpdateModalSection = styled.div`
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
      margin-left: 1rem;
      font-size: 1.1rem;
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


const RatingTable = () => {
  const [payModal, setPayModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [ratingData, setratingData] = useState([]);
  const [skeletonTime, setSkeletonTime] = useState(true);
  const [textAreaCount, setTextAreaCount] = useState('');
  const [textAreaCountUpdate, setTextAreaCountUpdate] = useState('');
  const [selectMarks, setSelectMarks] = useState('');
  const [selectMarksUpdate, setSelectMarksUpdate] = useState('');
  const [textYes, setTextYes] = useState(false);
  const [textYesUpdate, setTextYesUpdate] = useState(false);
  const [errorSelectAdd, setErrorSelectAdd] = useState(false);
  const [errorSelectUpdate, setErrorSelectUpdate] = useState(false);
  const [statueId, setStatueId] = useState('');
  const [statueDeleteId, setStatueDeleteId] = useState('');
  const [dataUpdate, setDataUpdate] = useState(false);
  const [successAdd, setSuccessAdd] = useState(false);
  const [successDelete, setSuccessDelete] = useState(false);
  const [successUpdate, setSuccessUpdate] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(Context);
  useEffect(() => {
    http
      .get(import.meta.env.VITE_API_URL + 'api/blacklist/get')
      .then((res) => {
        setSkeletonTime(false);
        setratingData(res.data);
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
        .get(import.meta.env.VITE_API_URL + 'api/blacklist/get')
        .then((res) => {
          setSkeletonTime(false);
          setDataUpdate(false);
          setratingData(res.data);
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

  const closeAndSave = () => {
    setPayModal(false);
    setTextYes(false);
    setErrorSelectAdd(false);
    setTextAreaCount('');
    setSelectMarks('');
  };
  const closeAndSaveUpdate = () => {
    setUpdateModal(false);
    setTextAreaCountUpdate('');
    setSelectMarksUpdate('');
    setErrorSelectUpdate(false);
    setTextYesUpdate(false);
    setStatueId('');
  };

  const selectAddChange = (e) => {
    setSelectMarks(e.target.value);
    setErrorSelectAdd(false);
  };
  const selectUpdateChange = (e) => {
    setSelectMarksUpdate(e.target.value);
    setErrorSelectUpdate(false);
  };

  const changeTextarea = (e) => {
    setTextAreaCount(e.target.value);
    setTextYes(false);
  };
  const changeTextareaUpdate = (e) => {
    setTextAreaCountUpdate(e.target.value);
    setTextYesUpdate(false);
  };

  const editFun = (e) => {
    setStatueId(e.id);
    setTextAreaCountUpdate(e.name);
    setSelectMarksUpdate(e.marks);
    setUpdateModal(true);
  };
  const deleteFun = (e) => {
    setDeleteModal(true);
    setStatueDeleteId(e.id);
  };

  const handleClose = () => {
    setDeleteModal(false);
  };

  const addStatute = () => {
    if (textAreaCount && !/^\s*$/.test(textAreaCount) && selectMarks) {
      setSkeletonTime(true);
      setPayModal(false);
      http
        .post(import.meta.env.VITE_API_URL + 'api/blacklist/add', {
          name: textAreaCount,
          marks: selectMarks
        })
        .then(() => {
          setDataUpdate(true);
          setSuccessAdd(true);
          setTextAreaCount('');
          setSelectMarks('');
          setErrorSelectAdd(false);
          setTextYes(false);
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
      if (!textAreaCount || /^\s*$/.test(textAreaCount)) {
        setTextYes(true);
      } else {
        setTextYes(false);
      }
      if (!selectMarks) {
        setErrorSelectAdd(true);
      } else {
        setErrorSelectAdd(false);
      }
    }
  };
  const updateStatue = () => {
    if (textAreaCountUpdate && !/^\s*$/.test(textAreaCount) && selectMarksUpdate) {
      setSkeletonTime(true);
      setUpdateModal(false);
      http
        .post(import.meta.env.VITE_API_URL + 'api/blacklist/put', {
          id: statueId,
          name: textAreaCountUpdate,
          marks: selectMarksUpdate
        })
        .then(() => {
          setDataUpdate(true);
          setSuccessUpdate(true);
          setTextAreaCountUpdate('');
          setTextYesUpdate(false);
          setErrorSelectUpdate(false);
          setSelectMarksUpdate('');
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
      if (!textAreaCountUpdate || /^\s*$/.test(textAreaCount)) {
        setTextYesUpdate(true);
      } else {
        setTextYesUpdate(false);
      }
      if (!selectMarksUpdate) {
        setErrorSelectUpdate(true);
      } else {
        setErrorSelectUpdate(false);
      }
    }
  };

  const deleteStatue = () => {
    setSkeletonTime(true);
    setDeleteModal(false);
    http
      .post(import.meta.env.VITE_API_URL + 'api/blacklist/delete', {
        id: statueDeleteId,
      })
      .then(() => {
        setDataUpdate(true);
        setSuccessDelete(true);
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
  };

  const handleCloseBar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSuccessAdd(false);
  };
  const handleCloseBarDelete = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSuccessDelete(false);
  };
  const handleCloseBarUpdate = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSuccessUpdate(false);
  };

  return (
    <div>
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
        <Container>
          <Header>
            <h2>Baholash nizomlari</h2>
            <HeaderRight>
              <SectionOne>
                <Tooltip
                  title="Nizom qo'shish"
                  arrow
                  TransitionComponent={Fade}
                  placement="top"
                >
                  <button
                    className="addGroup"
                    onClick={() => setPayModal(true)}
                  >
                    <i className="fa-solid fa-plus"></i>
                  </button>
                </Tooltip>
              </SectionOne>
            </HeaderRight>
          </Header>
          <Table>
            <thead>
              <tr>
                <th className="number">T/r</th>
                <th className="name">Nizom nomi</th>
                <th className="importantNumber">Muhimlik darajasi</th>
                <th className="actionsThead">Amallar</th>
              </tr>
            </thead>
            <Section>
              {ratingData &&
                ratingData.length > 0 &&
                ratingData.map((e, index) => (
                  <tr key={index} className="min-height-tr">
                    <td className="number">{index + 1}.</td>
                    <td className="name">{e.name} </td>
                    <td className="importantNumber">{e.marks}</td>
                    <td className="actionsThead">
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
                            editFun(e);
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
                            deleteFun(e);
                          }}
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </Tooltip>
                    </td>
                  </tr>
                ))}
            </Section>
          </Table>
          <Modal
            open={updateModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <UpdateModalSection>
              <div className="close_modal">
                <div className="header_modal_message">
                  <p className="header_group_name">
                    Nizomni tahrirlash
                  </p>
                </div>
                <button
                  className="close_modal_btn"
                  onClick={closeAndSaveUpdate}
                >
                  <CloseIcon />
                </button>
              </div>
              <div className="allGroups_delete_notification_part">
                <textarea
                  placeholder="Nizom matni..."
                  type="text"
                  maxLength={255}
                  value={textAreaCountUpdate}
                  className="message_modal_textarea"
                  onChange={(e) => changeTextareaUpdate(e)}
                />
                <p
                  style={{
                    display: textYesUpdate ? 'block' : 'none',
                    marginTop: '3px',
                    marginLeft: '14px',
                    fontSize: ' 0.75rem',
                    color: ' #d32f2f',
                    fontFamily: 'sans-serif',
                    fontWeight: '400',
                    lineHeight: '1.66',
                    letterSpacing: '0.03333em',
                  }}>Matn yozilmadi</p>
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel id="demo-simple-select-label">
                    Muhimlik darajasini tanlang
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectMarksUpdate}
                    label="Muhimlik darajasini tanlang"
                    onChange={selectUpdateChange}
                  >
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={2}>2</MenuItem>
                    <MenuItem value={3}>3</MenuItem>
                    <MenuItem value={4}>4</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                  </Select>
                </FormControl>
                <p
                  style={{
                    display: errorSelectUpdate ? 'block' : 'none',
                    marginTop: '3px',
                    marginLeft: '14px',
                    fontSize: ' 0.75rem',
                    color: ' #d32f2f',
                    fontFamily: 'sans-serif',
                    fontWeight: '400',
                    lineHeight: '1.66',
                    letterSpacing: '0.03333em',
                  }}>Muhimlik darajasini tanlang</p>
                <p style={{ paddingLeft: '5px', marginTop: '1rem' }}>{textAreaCountUpdate.length} / 255</p>
              </div>
              <div className="allGroups_delete_modal_part">
                <Button
                  sx={{ mt: 3, pt: 1, pb: 1 }}
                  fullWidth
                  className="buy_btn_modal"
                  variant="contained"
                  onClick={updateStatue}
                >
                  Saqlash
                </Button>
              </div>
            </UpdateModalSection>
          </Modal>
          <Modal
            open={payModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <MessageModal>
              <div className="close_modal">
                <div className="header_modal_message">
                  <p className="header_group_name">
                    Nizom qo&apos;shish
                  </p>
                </div>
                <button
                  className="close_modal_btn"
                  onClick={closeAndSave}
                >
                  <CloseIcon />
                </button>
              </div>
              <div className="allGroups_delete_notification_part">
                <textarea
                  placeholder="Nizom matni..."
                  type="text"
                  maxLength={255}
                  value={textAreaCount}
                  className="message_modal_textarea"
                  onChange={(e) => changeTextarea(e)}
                />
                <p
                  style={{
                    display: textYes ? 'block' : 'none',
                    marginTop: '3px',
                    marginLeft: '14px',
                    fontSize: ' 0.75rem',
                    color: ' #d32f2f',
                    fontFamily: 'sans-serif',
                    fontWeight: '400',
                    lineHeight: '1.66',
                    letterSpacing: '0.03333em',
                  }}>Matn yozilmadi</p>
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel id="demo-simple-select-label">
                    Muhimlik darajasini tanlang
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectMarks}
                    label="Muhimlik darajasini tanlang"
                    onChange={selectAddChange}
                  >
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={2}>2</MenuItem>
                    <MenuItem value={3}>3</MenuItem>
                    <MenuItem value={4}>4</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                  </Select>
                </FormControl>
                <p
                  style={{
                    display: errorSelectAdd ? 'block' : 'none',
                    marginTop: '3px',
                    marginLeft: '14px',
                    fontSize: ' 0.75rem',
                    color: ' #d32f2f',
                    fontFamily: 'sans-serif',
                    fontWeight: '400',
                    lineHeight: '1.66',
                    letterSpacing: '0.03333em',
                  }}>Muhimlik darajasini tanlang</p>
                <p style={{ paddingLeft: '5px', marginTop: '1rem' }}>{textAreaCount.length} / 255</p>
              </div>
              <div className="allGroups_delete_modal_part">
                <Button
                  sx={{ mt: 3, pt: 1, pb: 1 }}
                  fullWidth
                  className="buy_btn_modal"
                  variant="contained"
                  onClick={addStatute}
                >
                  Qo&apos;shish
                </Button>
              </div>
            </MessageModal>
          </Modal>
          <Modal
            open={deleteModal}
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
                  Rostdan ham ushbu nizomni
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
                  onClick={deleteStatue}
                >
                  O&apos;chirish
                </Button>
              </div>
            </AllGroupsDeleteModal>
          </Modal>
          <Snackbar
            open={successAdd}
            onClose={handleCloseBar}
            severity={'success'}
            massage={'Nizom muvaffaqiyatli qo\'shildi'}
          />
          <Snackbar
            open={successUpdate}
            onClose={handleCloseBarUpdate}
            severity={'success'}
            massage={'Nizom muvaffaqiyatli o\'zgartirildi'}
          />
          <Snackbar
            open={successDelete}
            onClose={handleCloseBarDelete}
            severity={'success'}
            massage={'Nizom muvaffaqiyatli o\'chirildi'}
          />
        </Container>
      )}

    </div>
  );
};

export default RatingTable;