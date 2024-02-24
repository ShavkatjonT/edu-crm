import React, { useState, useEffect, useContext } from 'react';
import http from '../../http/index';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../index';
import styled from 'styled-components';
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import Skeleton from '@mui/material/Skeleton';
import Snackbar from '../Snackbar/Snackbar';
import NumericInput from 'material-ui-numeric-input';

const Container = styled.div`
  margin-top: 1.8rem;
  padding-top: 10px;
  padding-bottom: 10px;
  background-color: white;
  border-radius: 6px;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.25);
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
  padding: 10px 20px 0px;
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

const Table = styled.table`
  margin-top: 1rem;
  border-collapse: collapse;
  width: 100%;
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
  .numberThead{
    text-align: start;
    padding-left: 25px;
  }
  .nameThead{
    text-align: start;  
  }
  .countTh{

  }
  .actionThead{
    text-align: end;
    padding-right: 20px;
  }
`;

const Section = styled.tbody`
width: 100%;
tr{
  height: 50px;
  &:nth-child(even) {
    background-color: #f8f8f8;
  }
}
.numberTbody{
    width: 20%;
    text-align: start;
    padding-left: 25px;
  }
  .nameTbody{
    width: 34%;
  }
  .countTbody{
    text-align: center;
  }
  .actionTbody{
    width: 15%;
    text-align: end;
    padding-right: 20px;
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

function RoomsTable() {
  const navigate = useNavigate();
  const { user } = useContext(Context);
  const [skeletonTime, setSkeletonTime] = useState(true);
  const [addModal, setAddModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [addRoomTextfield, setAddRoomTextfield] = useState('');
  const [addRoomCapacity, setAddRoomCapacity] = useState('');
  const [updateRoomTextfield, setUpdateRoomTextfield] = useState('');
  const [updateRoomCapacity, setUpdateRoomCapacity] = useState('');
  const [updateRoomId, setUpdateRoomId] = useState('');
  const [deleteRoomId, setDeleteRoomId] = useState('');
  const [roomsData, setRoomsData] = useState([]);
  const [dataUpdate, setDataUpdate] = useState(false);
  const [errorAddRoom, setErrorAddRoom] = useState(false);
  const [errorAddRoomCapacity, setErrorAddRoomCapacity] = useState(false);
  const [errorUpdateRoomCapacity, setErrorUpdateRoomCapacity] = useState(false);
  const [errorUpdateRoom, setErrorUpdateRoom] = useState(false);
  const [successAdd, setSuccessAdd] = useState(false);
  const [successUpdate, setSuccessUpdate] = useState(false);
  const [successDelete, setSuccessDelete] = useState(false);

  useEffect(() => {
    http
      .get(import.meta.env.VITE_API_URL + 'api/rooms/get')
      .then((res) => {
        console.log(124, res.data);
        setRoomsData(res.data);
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
        .get(import.meta.env.VITE_API_URL + 'api/rooms/get')
        .then((res) => {
          setRoomsData(res.data);
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

  let roomFilterMap;

  if (roomsData) {
    roomFilterMap = roomsData && roomsData.map((arg, index) => (
      <tr key={arg.id}>
        <td className='numberTbody'>{index + 1}</td>
        <td className='nameTbody'>{arg.name}</td>
        <td className='countTbody'>{arg.count_students}</td>
        <td className='actionTbody'>
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
                editFun(arg);
              }}
            >
              <i className="fa-solid fa-pen"></i>
            </button>
          </Tooltip>
          {
            arg.deleteActive ? (
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
                    deleteFun(arg);
                  }}
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </Tooltip>
            ) : ('')
          }
        </td>
      </tr>
    ));
  }

  const closeAddModal = () => {
    setAddModal(false);
    setAddRoomTextfield('');
    setErrorAddRoom(false);
  };
  const closeUpdateModal = () => {
    setUpdateModal(false);
    setUpdateRoomTextfield('');
    setErrorUpdateRoom(false);
  };

  const editFun = (e) => {
    setUpdateRoomId(e.id);
    setUpdateRoomTextfield(e.name);
    setUpdateRoomCapacity(e.count_students);
    setUpdateModal(true);
  };
  const deleteFun = (e) => {
    setDeleteRoomId(e.id);
    setDeleteModal(true);
  };

  const deleteClose = () => {
    setDeleteModal(false);
  };

  const changedUpdateTextfield = (event) => {
    setUpdateRoomTextfield(event.target.value);
    setErrorUpdateRoom(false);
  };
  const changedAddTextfield = (event) => {
    setAddRoomTextfield(event.target.value);
    setErrorAddRoom(false);
  };

  const changeUpdateCapacity = (alt) => {
    setUpdateRoomCapacity(alt.target.value);
    setErrorUpdateRoomCapacity(false);
  };
  const changeAddCapacity = (alt) => {
    setAddRoomCapacity(alt.target.value);
    setErrorAddRoomCapacity(false);
  };

  const callAddRoom = () => {
    if (addRoomTextfield && !/^\s*$/.test(addRoomTextfield) && addRoomCapacity && addRoomCapacity > 0) {
      setAddModal(false);
      setSkeletonTime(true);
      http
        .post(import.meta.env.VITE_API_URL + 'api/rooms/add', {
          name: addRoomTextfield,
          count_students: Number(addRoomCapacity)
        })
        .then(() => {
          setDataUpdate(true);
          setSuccessAdd(true);
          setAddRoomTextfield('');
          setAddRoomCapacity('');
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
      if (!addRoomTextfield || /^\s*$/.test(addRoomTextfield)) {
        setErrorAddRoom(true);
      } else {
        setErrorAddRoom(false);
      }
      if(!addRoomCapacity){
        setErrorAddRoomCapacity(true);
      }else{
        setErrorAddRoomCapacity(false);
      }
    }
  };
  const callUpdateRoom = () => {
    if (updateRoomTextfield && !/^\s*$/.test(updateRoomTextfield) && updateRoomCapacity && updateRoomCapacity > 0) {
      setUpdateModal(false);
      setSkeletonTime(true);
      http
        .post(import.meta.env.VITE_API_URL + 'api/rooms/put', {
          name: updateRoomTextfield,
          id: updateRoomId, 
          count_students: Number(updateRoomCapacity)
        })
        .then(() => {
          setDataUpdate(true);
          setSuccessUpdate(true);
          setUpdateRoomTextfield('');
          setUpdateRoomCapacity('');
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
      if (!updateRoomTextfield) {
        setErrorUpdateRoom(true);
      } else {
        setErrorUpdateRoom(false);
      }
      if(!updateRoomCapacity){
        setErrorUpdateRoomCapacity(true);
      }else{
        setErrorUpdateRoomCapacity(false);
      }
    }
  };
  const deleteRoom = () => {
    if (deleteRoomId) {
      setDeleteModal(false);
      http
        .post(import.meta.env.VITE_API_URL + 'api/rooms/delete', {
          id: deleteRoomId
        })
        .then(() => {
          setDataUpdate(true);
          setSkeletonTime(true);
          setSuccessDelete(true);
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
      {
        skeletonTime ? (
          <ContentSkeleton>
            <Box sx={{ width: '100%' }}>
              <Skeleton width="40%" height="2rem" />
              <Skeleton width="50%" height="2rem" />
              <Skeleton width="75%" height="2rem" />
              <Skeleton width="100%" height="2rem" />
            </Box>
          </ContentSkeleton>
        ) : (
          <Container>
            <Header>
              <h2>Xonalar</h2>
              <HeaderRight>
                <SectionOne>
                  <Tooltip
                    title="Xona qo'shish"
                    arrow
                    TransitionComponent={Fade}
                    placement="top"
                  >
                    <button className="addGroup" onClick={() => setAddModal(true)}>
                      <i className="fa-solid fa-plus"></i>
                    </button>
                  </Tooltip>
                </SectionOne>
              </HeaderRight>
            </Header>
            <Table>
              <thead>
                <tr>
                  <th className="numberThead">T/r</th>
                  <th className="nameThead">Xona nomi</th>
                  <th className="countTh">O&apos;quvchilar sig&apos;imi</th>
                  <th className="actionThead">Amallar</th>
                </tr>
              </thead>
              <Section>
                {roomFilterMap}
              </Section>
              <Modal open={addModal}>
                <Box sx={style}>
                  <CloseIcon
                    style={{
                      position: 'absolute',
                      right: '2%',
                      top: '3%',
                      cursor: 'pointer',
                    }}
                    onClick={closeAddModal}
                  />
                  <div
                    style={{
                      position: 'fixed',
                      width: '100%',
                      height: '4rem',
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
                    <h2> Xona qo&apos;shish </h2>
                  </div>

                  <Box sx={{ width: '100%', mt: 7 }}>
                    <TextField
                      fullWidth
                      label="Xona nomini kiriting"
                      id="outlined-size-large"
                      size="large"
                      value={addRoomTextfield}
                      onChange={changedAddTextfield}
                    />
                     <p
                    style={{
                      display: errorAddRoom ? 'block' : 'none',
                      marginTop: '3px',
                      marginLeft: '14px',
                      fontSize: ' 0.75rem',
                      color: ' #d32f2f',
                      fontFamily: 'sans-serif',
                      fontWeight: '400',
                      lineHeight: '1.66',
                      letterSpacing: '0.03333em',
                    }}>Xona nomini kiriting</p>
                     <NumericInput
                    autoComplete="off"
                    fullWidth
                    sx={{mt: 3}}
                    precision={''}
                    decimalChar=","
                    thousandChar="."
                    label="O'quvchilar sig'imini kiriting"
                    value={addRoomCapacity}
                    onChange={changeAddCapacity}
                    variant="outlined"
                    inputProps={{
                      maxLength: 3,
                      minLength: 1,
                    }}
                  />
                  <p
                    style={{
                      display: errorAddRoomCapacity ? 'block' : 'none',
                      marginTop: '3px',
                      marginLeft: '14px',
                      fontSize: ' 0.75rem',
                      color: ' #d32f2f',
                      fontFamily: 'sans-serif',
                      fontWeight: '400',
                      lineHeight: '1.66',
                      letterSpacing: '0.03333em',
                    }}>O&apos;quvchilar sig&apos;imini kiriting</p>
                  </Box>
                  <Button
                    sx={{ mt: 3, pt: 1, pb: 1 }}
                    fullWidth
                    className="buy_btn_modal"
                    variant="contained"
                    onClick={callAddRoom}
                  >
                    Qo&apos;shish
                  </Button>
                </Box>
              </Modal>
              <Modal open={updateModal}>
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
                      height: '4rem',
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
                    <h2> Xona nomini tahrirlash </h2>
                  </div>

                  <Box sx={{ width: '100%', mt: 7 }}>
                    <TextField
                      fullWidth
                      label="Xona nomi"
                      id="outlined-size-large"
                      size="large"
                      value={updateRoomTextfield}
                      onChange={changedUpdateTextfield}
                    />
                     <p
                    style={{
                      display: errorUpdateRoom ? 'block' : 'none',
                      marginTop: '3px',
                      marginLeft: '14px',
                      fontSize: ' 0.75rem',
                      color: ' #d32f2f',
                      fontFamily: 'sans-serif',
                      fontWeight: '400',
                      lineHeight: '1.66',
                      letterSpacing: '0.03333em',
                    }}>Xona nomini kiriting</p>
                     <NumericInput
                    autoComplete="off"
                    fullWidth
                    sx={{mt: 3}}
                    precision={''}
                    decimalChar=","
                    thousandChar="."
                    label="O'quvchilar sig'imi"
                    value={updateRoomCapacity}
                    onChange={changeUpdateCapacity}
                    variant="outlined"
                    inputProps={{
                      maxLength: 3,
                      minLength: 1,
                    }}
                  />
                  <p
                    style={{
                      display: errorUpdateRoomCapacity ? 'block' : 'none',
                      marginTop: '3px',
                      marginLeft: '14px',
                      fontSize: ' 0.75rem',
                      color: ' #d32f2f',
                      fontFamily: 'sans-serif',
                      fontWeight: '400',
                      lineHeight: '1.66',
                      letterSpacing: '0.03333em',
                    }}>O&apos;quvchilar sig&apos;imini kiriting</p>
                  </Box>
                  <Button
                    sx={{ mt: 3, pt: 1, pb: 1 }}
                    fullWidth
                    className="buy_btn_modal"
                    variant="contained"
                    onClick={callUpdateRoom}
                  >
                    Saqlash
                  </Button>
                </Box>
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
                      onClick={() => deleteClose()}
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
                      Rostdan ham ushbu xonani
                      o&apos;chirmoqchimisiz
                    </p>
                  </div>
                  <div className="allGroups_delete_modal_part">
                    <Button
                      className="delete_modal_btn_error"
                      variant="contained"
                      onClick={deleteClose}
                    >
                      Bekor qilish
                    </Button>
                    <Button
                      className="delete_modal_btn_success"
                      variant="contained"
                      color="error"
                      onClick={deleteRoom}
                    >
                      O&apos;chirish
                    </Button>
                  </div>
                </AllGroupsDeleteModal>
              </Modal>
            </Table>
            <Snackbar
              open={successAdd}
              onClose={handleCloseBar}
              severity={'success'}
              massage={'Xona muvaffaqiyatli qo\'shildi'}
            />
            <Snackbar
              open={successUpdate}
              onClose={handleCloseBarUpdate}
              severity={'success'}
              massage={'Xona nomi muvaffaqiyatli o\'zgartirildi'}
            />
            <Snackbar
              open={successDelete}
              onClose={handleCloseBarDelete}
              severity={'success'}
              massage={'Xona muvaffaqiyatli o\'chirildi'}
            />
          </Container>
        )
      }
    </div>
  );
}

export default RoomsTable;
