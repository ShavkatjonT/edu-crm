import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import TableContent from '../tables/Table';
import { Link } from 'react-router-dom';
import http from '../../http/index';
import dayjs from 'dayjs';
import { DatePicker } from 'antd';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Checkbox from '@mui/material/Checkbox';
import Fade from '@mui/material/Fade';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import Snackbar from '../Snackbar/Snackbar';
import { HiClipboardList } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../index';
import { ExportToExcelStudent } from '../../ExcelexportStudents';
import NumericInput from 'material-ui-numeric-input';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

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
  padding: 0px 10px;
  justify-content: space-between;
`;
const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 290px;
  input {
    border-radius: 25px;
    font-size: 0.99rem;
    margin: 0 0.5rem;
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
  .receiveBtn{
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
  .debrorsLink {
    border: none;
    background-color: initial;
    width: 2.2rem;
    font-size: 24px;
    height: 2.2rem;
    cursor: pointer;
    color: #c20404;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    outline: 1.5px solid #c20404;
    border-radius: 50%;
    border: none;
    &:hover{
      background-color:#c20404;
      color: #fff;
    }
  }
`;
const Section = styled.div`
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
    &:hover{
      background-color:#033a6b;
      color: #fff;
    }
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
        white-space: nowrap;
        max-width: 300px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .header_group_text{
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

const ReceiveModal = styled.div`
@media screen and (max-width: 678px){
    width: 95%;
}
  width: 600px;
  height: auto;
  background-color: white;
  padding: 32px;
  border-radius: 6px;
  position: relative;
  display: flex;
  flex-direction: column;
  .students-list{
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-height: 46vh;
    overflow-y: auto;
    padding-right: 5px;
    ::-webkit-scrollbar {
      width: 7px;
    }

    ::-webkit-scrollbar-track {
      backdrop-filter: 10px;
      background-color: rgba(0, 0, 0, 0.2);
      border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb {
        background-color:#0e3d74;
        border-radius: 4px;
    }

  }
  .studentsTable {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 15px;
    padding-top: 5px;
    padding-bottom: 10px;
    border-bottom: 2px dashed #bdbdbd;
    .studentName {
      color: #605757;
      font-weight: 600;
    }
    .studentStatus {
      color: #002bff;
      text-decoration: underline;
      cursor: pointer;
      &:active {
        color: #000000;
      }
    }
  }
`;

const Textarea = styled.textarea`
    width: 100%;
    resize: none;
    padding: 0.5rem;
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

const Group = () => {
  const navigate = useNavigate();
  const { user } = useContext(Context);
  const [groupOne, setGroupOne] = useState();
  const [messageOpen, setMessageOpen] = useState(false);
  const [textAreaCount, setTextAreaCount] = useState('');
  const [textYes, setTextYes] = useState(false);
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);
  const [list, setList] = useState([]);
  const [errorIsLimit, seterrorIsLimit] = useState(false);
  const [dataUpdate, setDataUpdate] = useState(false);
  const [errorListMessage, seterrorListMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [skeletonTime, setSkeletonTime] = useState(true);
  const [receiveModal, setReceiveModal] = useState(false);
  const [disabledAttendance, setDisabledAttendance] = useState(false);
  const [receiveDate, setReceiveDate] = useState(null);
  const [getStudentData, setGetStudentData] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const urlID = window.location.href.split('/');
  const [addStudentGroupModal, setAddStudentGroupModal] = useState(false);
  const [teacherSelectValue, setteacherSelectValue] = useState('');
  const [disabledGroups, setDisabledGroups] = useState(true);
  const [teacherData, setTeacherData] = useState([]);
  const [teacherGroupData, setTeacherGroupData] = useState([]);
  const [errorSelectTeacher, setErrorSelectTeacher] = useState(false);
  const [errorSelectTeacherGroup, setErrorSelectTeacherGroup] = useState(false);
  const [errorSelectMonthly, setErrorSelectMonthly] = useState(false);
  const [teacherSelectGroup, setTeacherSelectGroup] = useState('');
  const [monthlySumma, setMonthlySumma] = useState(0);
  const [groupSelectId, setGroupSelectId] = useState('');
  const [addStudentId, setaddStudentId] = useState('');
  const [groupName, setGroupName] = useState(null);
  const [lessonChek, setlessonChek] = useState(false);
  const [lessonChekValue, setlessonChekValue] = useState(false);
  const [errorExportStudent, setErrorExportStudent] = useState(false);
  const [filterReceiveDate, setFilterReceiveDate] = useState('');
  const [commentReceiveModal, setCommentReceiveModal] = useState(false);
  const [commentValueReceive, setCommentValueReceive] = useState('');
  const [studentReceive, setStudentReceive] = useState('');
  const [errorReceiveData, setErrorReceiveData] = useState(false);

  useEffect(() => {
    http
      .get(import.meta.env.VITE_API_URL + `api/group/get/one/${urlID[4]}`)
      .then((r) => {
        setGroupOne(r.data);
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
      .get(import.meta.env.VITE_API_URL + 'api/teacher/all/list/get')
      .then((r) => {
        setTeacherData(r.data);
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
      .get(
        import.meta.env.VITE_API_URL + `api/student/group/list/get/${urlID[4]}`
      )
      .then((res) => {
        setList(res.data);
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
    const today = new Date();
    const filterDate = dayjs(today).format('YYYY-MM-DD');
    http
      .post(import.meta.env.VITE_API_URL + 'api/group/attendansi-get', {
        group_id: urlID[4],
        date: filterDate,
      })
      .then((res) => {
        setGetStudentData(res.data?.students);
        setDisabledAttendance(res.data?.teacher_update);
      })
      .catch((error) => {
        if (
          error?.response?.data?.message == 'ro\'yxattan o\'tmagan foydalanuvchi!'
        ) {
          user.setIsAuth(false);
          localStorage.clear();
          navigate('/');
        } else if (
          error?.response?.data?.message?.original?.routine == 'string_to_uuid'
        ) {
          navigate('*');
        } else {
          console.log(error);
        }
      });
  }, []);


  const enterOpenMessageModal = () => {
    if (isCheck.length > 0) {
      setMessageOpen(true);
    } else {
      seterrorListMessage(true);
      setSuccessMessage(false);
    }
  };


  let exelExportStudentData = [];
  if (list) {
    exelExportStudentData = list && list.map((e, index) => {
      return {
        'T/r': index + 1,
        'Ism Familiya': e.name,
        'Telefon raqami': e.phone,
        'Oylik to\'lov': e.month_payment == 0 ? e.groupAllSum : e.month_payment,
        'Oxirgi to\'lov': e.monthPay == true ? 'To\'langan' : 'To\'lanmagan',
        'O\'quvchi sinfi': e.class ? e.class : '-',
      };
    });
  }


  useEffect(() => {
    if (isCheck.length == list.length) {
      setIsCheckAll(true);
    } else {
      setIsCheckAll(false);
    }
  }, [isCheck]);

  useEffect(() => {
    if (dataUpdate) {
      http
        .get(import.meta.env.VITE_API_URL + `api/group/get/one/${urlID[4]}`)
        .then((r) => {
          setGroupOne(r.data);
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
        .get(import.meta.env.VITE_API_URL + 'api/teacher/all/list/get')
        .then((r) => {
          setTeacherData(r.data);
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
          } else {
            console.log(error);
          }
        });

      http
        .get(
          import.meta.env.VITE_API_URL + `api/student/group/list/get/${urlID[4]}`
        )
        .then((res) => {
          setList(res.data);
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
            console.log(247, error);
          }
        });
      const today = new Date();
      const filterDate = dayjs(today).format('YYYY-MM-DD');
      http
        .post(import.meta.env.VITE_API_URL + 'api/group/attendansi-get', {
          group_id: urlID[4],
          date: filterDate,
        })
        .then((res) => {
          setGetStudentData(res.data?.students);
          setDisabledAttendance(res.data?.teacher_update);
          setDataUpdate(false);
        })
        .catch((error) => {
          setDataUpdate(false);
          if (
            error?.response?.data?.message == 'ro\'yxattan o\'tmagan foydalanuvchi!'
          ) {
            user.setIsAuth(false);
            localStorage.clear();
            navigate('/');
          } else if (
            error?.response?.data?.message?.original?.routine == 'string_to_uuid'
          ) {
            navigate('*');
          } else {
            console.log(error);
          }
        });
    }
  }, [dataUpdate]);

  const changeData = () => {
    setSkeletonTime(true);
    setDataUpdate(true);
  };

  const handleSelectAll = () => {
    setIsCheckAll(!isCheckAll);
    setIsCheck(list && list.map((li) => li.id));
    if (isCheckAll) {
      setIsCheck([]);
    }

  };

  const handleClick = (e) => {
    const { id, checked } = e.target;
    setIsCheck([...isCheck, id]);
    if (!checked) {
      setIsCheck(isCheck.filter((item) => item !== id));
    }
  };

  const handleCloseBar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    seterrorListMessage(false);
  };
  const handleCloseBarExportStudent = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setErrorExportStudent(false);
  };
  const handleCloseBarReceive = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setErrorReceiveData(false);
  };

  const closeMessageModal = () => {
    setMessageOpen(false);
    setTextAreaCount('');
    setTextYes(false);
    seterrorIsLimit(false);
  };

  const messSubmit = () => {
    if (textAreaCount && !/^\s*$/.test(textAreaCount) && urlID[4] && isCheck && isCheck.length > 0) {
      if (textAreaCount.length >= 4) {
        setSkeletonTime(true);
        let messageTime = new Date();
        http
          .post(import.meta.env.VITE_API_URL + 'api/message/add/list', {
            group_id: urlID[4],
            text: textAreaCount,
            time: String(messageTime),
            studentIdList: isCheck,
          })
          .then(() => {
            setSkeletonTime(false);
            seterrorListMessage(true);
            setSuccessMessage(true);
            setMessageOpen(false);
            setTextYes(false);
            setTextAreaCount('');
            seterrorIsLimit(false);
            setIsCheck([]);
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

  const openReceiveModal = () => {
    setStudentList(getStudentData);
    const today = new Date();
    setReceiveDate(dayjs(today));
    setFilterReceiveDate(dayjs(today).format('YYYY-MM-DD'));
    setReceiveModal(true);
  };
  const closeReceiveModal = () => {
    setReceiveModal(false);
  };

  const handleReceiveDateChange = (date) => {
    setReceiveDate(date);
    setFilterReceiveDate(dayjs(date).format('YYYY-MM-DD'));
  };


  const toggleStatus = (id, newValue) => {
    setStudentList((prevStudents) =>
      prevStudents.map((student) => {
        if (student.id === id) {
          // Update the status
          return {
            ...student,
            status: newValue
          };
        }
        return student;
      })
    );
  };

  const attendanceFun = () => {
    if (filterReceiveDate.length == 10) {
      if (disabledAttendance) {
        setReceiveModal(false);
        setSkeletonTime(true);
        const studentsFilter =
          studentList &&
          studentList.map((e) => {
            return {
              id: e.id,
              status: e.status,
              comment: e.comment,
              group_student_status: e.groupStudentStatus
            };
          });
        http
          .post(import.meta.env.VITE_API_URL + 'api/group/attendansi', {
            group_id: urlID[4],
            students: studentsFilter,
            date: filterReceiveDate,
          })
          .then(() => {
            setDataUpdate(true);
          })
          .catch((error) => {
            if (
              error?.response?.data?.message ==
              'The date value is incorrect, please check and re-enter'
            ) {
              setSkeletonTime(false);
              setErrorReceiveData(true);
            }
            if (
              error?.response?.data?.message ==
              'ro\'yxattan o\'tmagan foydalanuvchi!'
            ) {
              user.setIsAuth(false);
              localStorage.clear();
              navigate('/');
            } else if (
              error?.response?.data?.message?.original?.routine ==
              'string_to_uuid'
            ) {
              navigate('*');
            } else {
              console.log(error);
            }
          });
      } else {
        setReceiveModal(false);
        setSkeletonTime(true);
        const studentsFilter =
          studentList &&
          studentList.map((e) => {
            return {
              id: e.id,
              status: e.status,
              comment: e.comment
            };
          });
        http
          .post(import.meta.env.VITE_API_URL + 'api/group/attendansi-update', {
            group_id: urlID[4],
            students: studentsFilter,
            date: filterReceiveDate,
          })
          .then(() => {
            setDataUpdate(true);
          })
          .catch((error) => {
            if (
              error?.response?.data?.message ==
              'No data found'
            ) {
              setSkeletonTime(false);
              setErrorReceiveData(true);
            }
            if (
              error?.response?.data?.message ==
              'ro\'yxattan o\'tmagan foydalanuvchi!'
            ) {
              user.setIsAuth(false);
              localStorage.clear();
              navigate('/');
            } else if (
              error?.response?.data?.message?.original?.routine ==
              'string_to_uuid'
            ) {
              navigate('*');
            } else {
              console.log(error);
            }
          });
      }
    }
  };

  const handleGroupAddStudentFun = (e) => {
    setaddStudentId(e.id);
    setAddStudentGroupModal(true);
  };

  const addStudentGroupFun = () => {
    if (teacherSelectValue && teacherSelectGroup && monthlySumma >= 0 && groupName) {
      setAddStudentGroupModal(false);
      setSkeletonTime(true);
      setTeacherSelectGroup('');
      setteacherSelectValue('');
      setMonthlySumma(0);
      http
        .post(
          import.meta.env.VITE_API_URL + 'api/group-students/student-export',
          {
            exitGroup_id: urlID[4],
            newGroup_id: groupSelectId,
            student_id: addStudentId,
            summa: Number(monthlySumma),
            group_student_id: groupName.group_student_id,
            lesson: lessonChekValue
          }
        )
        .then(() => {
          setDataUpdate(true);
          setSkeletonTime(false);
          setlessonChek(false);
        })
        .catch((error) => {
          console.log(error);
          if (error?.response?.data.message == 'Bu o\'quvchi ko\'chirilishi kerak bo\'lgan guruhda mavjud') {
            setErrorExportStudent(true);
            setSkeletonTime(false);
          }
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
      if (monthlySumma < 0) {
        setErrorSelectMonthly(true);
      } else {
        setErrorSelectMonthly(false);
      }
    }
  };

  const teacherSelectChange = (event) => {
    setteacherSelectValue(event.target.value);
    http
      .get(import.meta.env.VITE_API_URL + `api/group/get/${event.target.value}`)
      .then((r) => {
        setTeacherGroupData(r.data?.groupList);
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
    setMonthlySumma(0);
    setDisabledGroups(false);
    setErrorSelectTeacher(false);
    setlessonChek(false);
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

    if (filterMonth.lesson) {
      setlessonChek(true);
    } else {
      setlessonChek(false);
    }

    setMonthlySumma(filterMonth.month_payment);
    setErrorSelectTeacherGroup(false);
    setErrorSelectMonthly(false);
  };
  const changeMonthSumma = (event) => {
    setMonthlySumma(event.target.value);
  };

  const closeAndSaveAddModal = () => {
    setAddStudentGroupModal(false);
    setteacherSelectValue('');
    setTeacherGroupData([]);
    setMonthlySumma(0);
    setDisabledGroups(true);
    setTeacherSelectGroup('');
    setlessonChek(false);
  };


  const disabledDate = (current) => {
    const today = new Date();

    return current && current > today;
  };

  const openCommentModal = (e) => {
    setCommentValueReceive(e.comment ? e.comment : '');
    setStudentReceive(e.id);
    setCommentReceiveModal(true);
  };
  const closeCommentModal = () => {
    setCommentReceiveModal(false);
  };

  const saveCommentReceive = () => {  //davomatni bor yo'q qiladiganda izohni qo'shish funksiyasi
    if (commentValueReceive) {
      setStudentList((prevStudents) =>
        prevStudents.map((student) => {
          if (student.id === studentReceive) {
            // Update the status
            return {
              ...student,
              comment: commentValueReceive
            };
          }
          return student;
        })
      );
      setCommentValueReceive('');
      setCommentReceiveModal(false);
    } else {
      closeCommentModal();
    }
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
          <div>
            <Header>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Checkbox
                  type="checkbox"
                  name="selectAll"
                  id="selectAll"
                  checked={isCheck.length == list.length}
                  indeterminate={isCheck.length !== list.length}
                  onChange={handleSelectAll}
                />
                <h2>
                  <span>{groupOne && groupOne.name}</span>
                </h2>
              </div>
              <HeaderRight style={{justifyContent: user?.user?.role == 'casher' ? 'flex-end' : 'space-around', gap: user?.user?.role == 'casher' ? '20px' : '0px' }}>
                <ExportToExcelStudent
                  apiData={exelExportStudentData ? exelExportStudentData : null}
                  groupData={groupOne.name}
                />
                <Tooltip
                  title="Yo'qlama"
                  arrow
                  TransitionComponent={Fade}
                  placement="top"
                >
                  <button className="receiveBtn" onClick={openReceiveModal} style={{ display: user?.user?.role == 'super' || user?.user?.role == 'admin' ? 'block' : 'none' }}>
                    <i className="fa-solid fa-list-check"></i>
                  </button>
                </Tooltip>
                <Tooltip
                  title="Xabar yuborish"
                  arrow
                  TransitionComponent={Fade}
                  placement="top"
                >
                  <button
                    className="send_message_btn"
                    onClick={enterOpenMessageModal}
                    style={{ display: user?.user?.role == 'super' || user?.user?.role == 'admin' ? 'block' : 'none' }}
                  >
                    <i className="fa-regular fa-envelope"></i>
                  </button>
                </Tooltip>


                <Tooltip
                  title="Qarzdorlar"
                  arrow
                  TransitionComponent={Fade}
                  placement="top"
                >
                  <Link to={`/debtors/${urlID[4]}`} className="debrorsLink"
                    style={{ display: user?.user?.role == 'casher' || user?.user?.role == 'super' ? 'inherit' : 'none' }}>
                    <HiClipboardList></HiClipboardList>
                  </Link>
                </Tooltip>
                <Section>
                  <Tooltip
                    title="O&apos;quvchi qo&apos;shish"
                    arrow
                    TransitionComponent={Fade}
                    placement="top"
                  >
                    <Link to={`/groups/${groupOne && groupOne.id}/addstudent`} style={{ display: user?.user?.role == 'super' || user?.user?.role == 'admin' ? 'inherit' : 'none' }}>
                      <button>
                        <i className="fa-solid fa-user-plus"></i>
                      </button>
                    </Link>
                  </Tooltip>
                </Section>
              </HeaderRight>
            </Header>
            <Modal
              open={messageOpen}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <MessageModal>
                <div className="close_modal">
                  <div className="header_modal_message">
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <p className="header_group_name">
                        {groupOne && groupOne.name}
                      </p>
                      <p className="header_group_text">guruhi</p>
                    </div>
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
                    onClick={messSubmit}
                  >
                    Yuborish
                  </Button>
                </div>
              </MessageModal>
            </Modal>
            <Modal
              open={receiveModal}
              onClose={closeReceiveModal}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 600,
              }}
            >
              <ReceiveModal>
                <div
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '4rem',
                    left: 0,
                    borderTopLeftRadius: '6px',
                    borderTopRightRadius: '6px',
                    zIndex: '1',
                    paddingTop: '20px',
                    paddingBottom: '20px',
                    paddingLeft: '30px',
                    top: 0,
                    background: '#FDC600',
                  }}
                >
                  <h2> Yo&apos;qlama olish </h2>
                  <CloseIcon
                    style={{
                      position: 'absolute',
                      right: '2%',
                      top: '15%',
                      cursor: 'pointer',
                      zIndex: '2',
                    }}
                    onClick={closeReceiveModal}
                  />
                </div>
                <div
                  style={{
                    marginTop: '55px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px',
                  }}
                >
                  <DatePicker
                    value={receiveDate}
                    onChange={handleReceiveDateChange}
                    placeholder="Sana"
                    format="YYYY-MM-DD"
                    allowClear={false}
                    style={{
                      width: '100%',
                      height: '55px',
                      border: '1.9px solid #C4C4C4',
                      borderRadius: '4px',
                      color: '#6E6E6E',
                      fontSize: '17px',
                    }}
                    disabledDate={disabledDate}
                  />
                  <div className='students-list'>
                    {studentList &&
                      studentList.length > 0 &&
                      studentList.map((value) => (
                        <div key={value.id} className="studentsTable">
                          <p className="studentName" style={{ color: value.groupStudentStatus == 'test' && '#fdc600' }}>{value.name}</p>
                          <FormControl disabled={value.status == 'frozen' ? true : false} size='small' sx={{ minWidth: 130 }}>
                            <InputLabel id="demo-simple-select-label">Status</InputLabel>
                            <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              value={value.status}
                              label="Status"
                              onChange={(event) => toggleStatus(value.id, event.target.value)}
                            >
                              <MenuItem value='came' onClick={() => openCommentModal(value)}>Bor</MenuItem>
                              <MenuItem value='notCome' onClick={() => openCommentModal(value)}>Yo&apos;q</MenuItem>
                              <MenuItem value="it'sLate" onClick={() => openCommentModal(value)}>Kech qoldi</MenuItem>
                              <MenuItem value="frozen" disabled onClick={() => openCommentModal(value)}>Muzlatilgan</MenuItem>
                            </Select>
                          </FormControl>
                        </div>
                      ))}
                  </div>
                </div>
                <Button
                  sx={{ mt: 3, pt: 1, pb: 1 }}
                  fullWidth
                  className="buy_btn_modal"
                  variant="contained"
                  disabled={getStudentData.length == 0}
                  onClick={attendanceFun}
                >
                  Saqlash
                </Button>
              </ReceiveModal>
            </Modal>
            <Modal open={commentReceiveModal}>
              <Box sx={style}>
                <CloseIcon
                  style={{
                    position: 'absolute',
                    right: '2%',
                    top: '3%',
                    cursor: 'pointer',
                  }}
                  onClick={closeCommentModal}
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
                  <h2>Izoh kiriting</h2>
                </div>

                <Box sx={{ width: '100%', mt: 7 }}>
                  <Textarea value={commentValueReceive} onChange={(e) => setCommentValueReceive(e.target.value)} placeholder='Izoh kiriting' name="" id="" cols="40" rows="6">

                  </Textarea>

                </Box>
                <Button
                  sx={{ mt: 3, pt: 1, pb: 1 }}
                  fullWidth
                  className="buy_btn_modal"
                  variant="contained"
                  onClick={saveCommentReceive}
                >
                  Saqlash
                </Button>
              </Box>
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
                  <h2>{groupName && groupName.name}</h2>
                  <p>ushbu o&apos;quvchini boshqa guruhga ko&apos;chirish</p>
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
                          <MenuItem key={data.id} value={data.id}>
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
                          <MenuItem key={data.id} disabled={data.id == urlID[4] ? true : false} value={data.name}>
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
                  {
                    lessonChek && <Box sx={{ width: '100%', marginTop: '1rem' }}>
                      <Checkbox value={lessonChekValue} checked={lessonChekValue} onChange={() => setlessonChekValue(!lessonChekValue)} id={'inLessonChek'} /> <label htmlFor="inLessonChek">Bugungi darsdan hisoblansimi</label>
                    </Box>
                  }

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

            <TableContent
              getData={list && list}
              inCheckedTrue={isCheck}
              inChecked={handleClick}
              upData={setDataUpdate}
              handleGroupAddStudentFun={handleGroupAddStudentFun}
              setGroupNameApp={setGroupName}
              updateFun={changeData}
            />
            <Snackbar
              open={errorListMessage}
              onClose={handleCloseBar}
              severity={successMessage ? 'success' : 'error'}
              massage={successMessage ? 'Xabar muvaffaqiyatli yuborildi' : 'Iltimos o\'quvchini tanlang'}
            />
            <Snackbar
              open={errorExportStudent}
              onClose={handleCloseBarExportStudent}
              severity={'error'}
              massage={'Ushbu o\'quvchi ko\'chirilishi kerak bo\'lgan guruhda mavjud'}
            />
            <Snackbar
              open={errorReceiveData}
              onClose={handleCloseBarReceive}
              severity={'error'}
              massage={'Siz yuborgan sanada yo\'qlama qilinmagan'}
            />
          </div>
        )
      }
    </Container>
  );
};

export default Group;
