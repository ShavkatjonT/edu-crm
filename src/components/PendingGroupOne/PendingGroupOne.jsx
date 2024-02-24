import React, { useEffect, useState, useContext } from 'react';
import Box from '@mui/material/Box';
import styled from 'styled-components';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { useNavigate } from 'react-router-dom';
import http from '../../http/index';
import NumericInput from 'material-ui-numeric-input';
import { Context } from '../../index';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Fade from '@mui/material/Fade';
import Skeleton from '@mui/material/Skeleton';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Tooltip from '@mui/material/Tooltip';
import { Link } from 'react-router-dom';
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
`;
const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 15px;
  justify-content: space-between;
  h2 {
    color: rgb(4, 41, 84);
  }
`;
const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;
  width: 290px;
  button {
    border: none;
    background-color: initial;
    width: 2.2rem;
    font-size: 17px;
    height: 2.2rem;
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
    width: 10%;
    text-align: left;
    padding-left: 20px;
  }
  .name {
    width: 35%;
  }
  .phone {
    width: 30%;
    text-align: center;
  }
  .action {
    width: 29%;
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
`;

const Section = styled.tbody`
  width: 100%;
  background-color: white;
  tr {
    min-height: 50px;
    text-align: left;
    &:nth-child(even) {
      background-color: #f8f8f8;
    }
    display: flex;
    align-items: center;
  }

  .number {
    width: 10%;
    text-align: left;
    padding-left: 25px;
  }
  .name {
    width: 35%;
  }
  .phone {
    width: 30%;
    text-align: center;
  }
  .action {
    width: 29%;
    text-align: right;
    padding-right: 10px;
    display: flex;
    justify-content: end;
    align-items: center;
  }
  .delete {
    background-color: initial;
    color: #c20404;
    border: none;
    font-size: 1rem;
    cursor: pointer;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
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

function PendingGroupOne() {
  const navigate = useNavigate();
  const { user } = useContext(Context);
  const [groupOne, setGroupOne] = useState();
  const [deleteId, setDeleteId] = useState('');
  const [addStudentId, setaddStudentId] = useState('');
  const [teacherSelectValue, setteacherSelectValue] = useState('');
  const [teacherSelectGroup, setTeacherSelectGroup] = useState('');
  const [monthlySumma, setMonthlySumma] = useState(0);
  const [groupSelectId, setGroupSelectId] = useState('');
  const [groupName, setGroupName] = useState([]);
  const [teacherData, setTeacherData] = useState([]);
  const [teacherGroupData, setTeacherGroupData] = useState([]);
  const [list, setList] = useState([]);
  const [skeletonTime, setSkeletonTime] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [addStudentGroupModal, setAddStudentGroupModal] = useState(false);
  const [disabledGroups, setDisabledGroups] = useState(true);
  const [dataUpdate, setDataUpdate] = useState(false);
  const [errorSelectTeacher, setErrorSelectTeacher] = useState(false);
  const [errorSelectTeacherGroup, setErrorSelectTeacherGroup] = useState(false);
  const [errorSelectMonthly, setErrorSelectMonthly] = useState(false);
  const urlID = window.location.href.split('/');

  useEffect(() => {
    http
      .get(
        import.meta.env.VITE_API_URL +
        `api/new-pending-student/list/get/${urlID[4]}`
      )
      .then((res) => {
        setGroupOne(res.data.pendingGroup);
        setList(res.data.studentList);
        setTeacherData(res.data.groupData);
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
          console.log(247, error);
        }
      });
  }, []);

  useEffect(() => {
    http
      .get(
        import.meta.env.VITE_API_URL +
        `api/new-pending-student/list/get/${urlID[4]}`
      )
      .then((res) => {
        setGroupOne(res.data.pendingGroup);
        setList(res.data.studentList);
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
  }, [dataUpdate]);

  let pendingGroupStundents = [];
  let number = 1;

  if (list) {
    pendingGroupStundents =
      list &&
      list.map((e) => {
        return (
          <tr key={e.id}>
            <td className="number">{number++}</td>
            <td className="name">{e.firstname + ' ' + e.lastname}</td>
            <td className="phone">{e.Fphone ? e.Fphone : e.Mphone}</td>
            <td className="action">
              <Tooltip
                title="Guruhga qo'shish"
                arrow
                TransitionComponent={Fade}
                placement="top"
              >
                <GroupAddIcon id={e.id}
                  onClick={() => {
                    setGroupName(list);
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
                <Link className="eye" to={`/pending-student/${e.id}`}>
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
                  className="delete"
                  onClick={() => {
                    setGroupName(list);
                    handleDeleteOpen(e);
                  }}
                >
                  <i id={`delete${e.id}`} className="fa-solid fa-trash"></i>
                </button>
              </Tooltip>
            </td>
          </tr>
        );
      });
  }

  const handleDeleteOpen = (e) => {
    setDeleteId(e.id);
    setDeleteModal(true);
  };
  const handleGroupAddStudentFun = (e) => {
    setaddStudentId(e.id);
    setAddStudentGroupModal(true);
  };

  let name = [];
  if (groupName && deleteId) {
    name = groupName.filter((e) => {
      const id = deleteId;
      return e.id == id ? e.firstname && e.lastname : '';
    });
  }
  let nameAddStudent = [];
  if (groupName && addStudentId) {
    nameAddStudent = groupName.filter((e) => {
      const id = addStudentId;
      return e.id == id ? e.firstname && e.lastname : '';
    });
  }

  const handleCloseDelete = () => {
    setDeleteModal(false);
  };

  const studentDelete = () => {
    setDeleteModal(false);
    setSkeletonTime(true);
    http
      .post(import.meta.env.VITE_API_URL + 'api/new-pending-student/delete', {
        id: deleteId,
      })
      .then(() => {
        setDataUpdate(true);
      })
      .catch((e) => {
        console.log(e);
        // Xatolik xabari yozish kk
      });
  };

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
          import.meta.env.VITE_API_URL + 'api/new-pending-student/student-create',
          {
            pendingGroupId: urlID[4],
            group_id: groupSelectId,
            student_id: addStudentId,
            summa: Number(monthlySumma)
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



  return (
    <div>
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
          <div>
            <Header>
              <div>
                <h2>{groupOne && groupOne.name}</h2>
              </div>
              <HeaderRight>
                <Tooltip
                  title="O'quvchi qo'shish"
                  arrow
                  TransitionComponent={Fade}
                  placement="top"
                >
                  <Link
                    to={`/pending/${groupOne && groupOne.id
                      }/pending-add-student`}
                  >
                    <button>
                      <i className="fa-solid fa-user-plus"></i>
                    </button>
                  </Link>
                </Tooltip>
              </HeaderRight>
            </Header>
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
                  <th className="action">
                    <p>Amallar</p>
                  </th>
                </TableHeader>
              </thead>
              <Section>{pendingGroupStundents}</Section>
              <Modal
                open={deleteModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <AllGroupsDeleteModal>
                  <div className="close_modal">
                    <button
                      className="close_modal_btn"
                      onClick={() => handleCloseDelete()}
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
                      name.map((groupName) => {
                        return (
                          <p key={groupName.id} id={groupName.id}>
                            Rostdan ham ushbu{' '}
                            {(groupName.firstname.length > 30 ? `${groupName.firstname.slice(0, 30)}...` : groupName.firstname) + ' ' + (groupName.lastname.length > 30 ? `${groupName.lastname.slice(0, 30)}...` : groupName.lastname)}{' '}
                            ma&apos;lumotlarini o&apos;chirmoqchimisiz
                          </p>
                        );
                      })}
                  </div>
                  <div className="allGroups_delete_modal_part">
                    <Button
                      className="delete_modal_btn_error"
                      variant="contained"
                      onClick={handleCloseDelete}
                    >
                      Bekor qilish
                    </Button>
                    <Button
                      className="delete_modal_btn_success"
                      variant="contained"
                      color="error"
                      onClick={() => {
                        studentDelete();
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
                            {groupName.firstname + ' ' + groupName.lastname}
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
            </Table>
          </div>
        )}
      </Container>
    </div>
  );
}

export default PendingGroupOne;
