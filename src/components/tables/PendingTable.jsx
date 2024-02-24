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
import FormControl from '@mui/material/FormControl';
import ButtonGroup from '@mui/material/ButtonGroup';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../index';
import NumericInput from 'material-ui-numeric-input';
import Tooltip from '@mui/material/Tooltip';
import { Checkbox, FormControlLabel, TextField } from '@mui/material';
import Fade from '@mui/material/Fade';
import Snackbar from '../Snackbar/Snackbar';
import { IMaskInput } from 'react-imask';
import PropTypes from 'prop-types';

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
  background-color: white;
  display: flex;
  align-items: center;
  padding: 10px 20px;
  justify-content: space-between;
  h2 {
    color: rgb(4, 41, 84);
  }
`;
const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 250px;
`;
const SectionContent = styled.div`
  .addTeacher {
    border: none;
    background-color: initial;
    width: 2.2rem;
    font-size: 20px;
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
    width: 35%;
  }
  .count_students {
    width: 28%;
    text-align: center;
  }
  .action {
    width: 27%;
    text-align: right;
    padding-right: 10px;
  }
  .linkGroup {
    text-decoration: underline;
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
    padding-left: 25px;
    text-align: left;
  }
  .name {
    width: 35%;
    text-align: left;
  }
  .action {
    width: 27%;
    text-align: right;
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
  .launchBtn {
    background-color: initial;
    border: none;
    font-size: 1.13rem;
    cursor: pointer;
    transition: all 0.2s;
    margin-right: 1rem;
    &:hover {
      color: #15375d;
    }
  }
  .message_btn {
    background-color: initial;
    color: #fdc600;
    border: none;
    font-size: 1.13rem;
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
const styleUpdateGroup = {
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
const styleLaunchGroup = {
  position: 'relative',
  width: 950,
  bgcolor: 'background.paper',
  border: 'none',
  borderRadius: '6px',
  boxShadow: 24,
  p: 4,
};
const Forma = styled.div`
  padding-top: 1.5rem;
  width: 100%;
  display: flex;
  align-items: center;
  .weekText {
    font-weight: 400;
    font-size: 0.98rem;
    line-height: 1.4375em;
    letter-spacing: 0.00938em;
    color: #67677f;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    margin-left: 12px;
    margin-bottom: 10px;
  }
  //justify-content: space-between;
`;

const TextMaskCustom = React.forwardRef(function TextMaskCustom(props, ref) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="000"
      definitions={{
        '#': /[0-9]/,
      }}
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  );
});

TextMaskCustom.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const Tables = () => {
  const navigate = useNavigate();
  const { user } = useContext(Context);
  const [open, setOpen] = useState(false);
  const [getValue, setGetValue] = useState([]);
  const [deleteId, setDeleteId] = useState('');
  const [updateId, setUpdateId] = useState('');
  const [launchId, setLaunchId] = useState('');
  const [groupName, setGroupName] = useState([]);
  const [addModal, setAddModal] = useState(false);
  const [launchModal, setLaunchModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [errorGroupAdd, setErrorGroupAdd] = useState(false);
  const [errorGroupUpdate, setErrorGroupUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState(false);
  const [skeletonTime, setSkeletonTime] = useState(true);
  const [addGroupTextfiend, setAddGroupTextfiend] = useState('');
  const [selectTeacher, setSelectTeacher] = useState('');
  const [updateGroupTextfiend, setUpdateGroupTextfiend] = useState('');
  const [launchGroupTextfiend, setLaunchGroupTextfiend] = useState('');
  const [launchGroupTeacherName, setLaunchGroupTeacherName] = useState('');
  const [textAreaCount, setTextAreaCount] = useState('');
  const [monthlySumma, setMonthlySumma] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [selectedDays, setSelectedDays] = useState([]);
  const [sale, setSale] = useState({
    textmask: '',
  });
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedTimeEnd, setSelectedTimeEnd] = useState('');
  const [textYes, setTextYes] = useState(false);
  const [messsageOpen, setMessageOpen] = useState(false);
  const [errorIsLimit, seterrorIsLimit] = useState(false);
  const [errorIsStudent, seterrorIsStudent] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [roomsData, setRoomsData] = useState([]);
  const [roomValue, setRoomValue] = useState('');
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [openErrorTimeSnackbar, setOpenErrorTimeSnackbar] = useState(false);
  const [openErrorNoComplateSnackbar, setOpenErrorNoComplateSnackbar] = useState(false);
  const [openLinkState, setOpenLinkState] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [daysOfWeekSecond, setDaysOfWeekSecond] = useState([
    { name: 'Dushanba', selected: false },
    { name: 'Seshanba', selected: false },
    { name: 'Chorshanba', selected: false },
    { name: 'Payshanba', selected: false },
    { name: 'Juma', selected: false },
    { name: 'Shanba', selected: false },
    { name: 'Yakshanba', selected: false },
  ]);
  const [rooms, setRooms] = useState(Array(daysOfWeekSecond.length).fill(''));
  const [startTimes, setStartTimes] = useState(
    Array(daysOfWeekSecond.length).fill('')
  );
  const [endTimes, setEndTimes] = useState(
    Array(daysOfWeekSecond.length).fill('')
  );



  useEffect(() => {
    http
      .get(import.meta.env.VITE_API_URL + 'api/pending-group/get')
      .then((res) => {
        setGetValue(res.data);
        setDeleteId('');
        setGroupName([]);
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

  useEffect(() => {
    http
      .get(import.meta.env.VITE_API_URL + 'api/pending-group/get')
      .then((res) => {
        setGetValue(res.data);
        setDeleteId('');
        setGroupName([]);
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
    http
      .get(import.meta.env.VITE_API_URL + 'api/teacher/label/get')
      .then((r) => {
        setSelectTeacher(r.data);
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
  const changeLinkState = () => {
    setOpenLinkState(!openLinkState);
    setSelectedRows([]);
    setDaysOfWeekSecond([
      { name: 'Dushanba', selected: false },
      { name: 'Seshanba', selected: false },
      { name: 'Chorshanba', selected: false },
      { name: 'Payshanba', selected: false },
      { name: 'Juma', selected: false },
      { name: 'Shanba', selected: false },
      { name: 'Yakshanba', selected: false },
    ]);
    setRooms(Array(daysOfWeekSecond.length).fill(''));
    setStartTimes(Array(daysOfWeekSecond.length).fill(''));
    setEndTimes(Array(daysOfWeekSecond.length).fill(''));
    if (selectedRows.length > 0) {
      setSelectedTime('');
      setSelectedTimeEnd('');
      setRoomValue('');
      setSelectedDays([]);
    }
  };
  const handleDayOfWeekChange = (index) => {
    const updatedDaysOfWeek = [...daysOfWeekSecond];
    updatedDaysOfWeek[index].selected = !updatedDaysOfWeek[index].selected;
    setDaysOfWeekSecond(updatedDaysOfWeek);
  };

  let data = [];
  let number = 1;
  if (getValue) {
    data = getValue.map((e) => {
      return (
        <tr key={e.id}>
          <td className="number">{number++}.</td>
          <td className="name">
            <Link className="linkGroup" to={`/pending-group-one/${e.id}`}>
              {e.name}
            </Link>
          </td>
          <td className="count_students">{e.count_students}</td>
          <td className="action">
            <Tooltip
              title="Guruhni ishga tushurish"
              arrow
              TransitionComponent={Fade}
              placement="top"
            >
              <button
                id={`launchGroup${e.id}`}
                className="launchBtn"
                onClick={() => {
                  lunchFun(e);
                  setGroupName(getValue);
                  setLaunchId(e.id);
                }}
              >
                <i
                  id={`launchGroup${e.id}`}
                  className="fa-solid fa-check"
                  style={{ color: '#042954' }}
                ></i>
              </button>
            </Tooltip>
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
                  setGroupName(getValue);
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
              <button
                className="edit"
                onClick={() => {
                  handleUpdate(e);
                }}
              >
                <i className="fa-solid fa-pen"></i>
              </button>
            </Tooltip>
            <Tooltip
              title="O'chirish"
              arrow
              TransitionComponent={Fade}
              placement="top"
            >
              <button
                id={`delete${e.id}`}
                onClick={() => {
                  handleDelete(e);
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

  const handleDelete = (e) => {
    setDeleteId(e.id);
    setOpen(true);
  };

  const handleUpdate = (e) => {
    setUpdateGroupTextfiend(e.name);
    setUpdateId(e.id);
    setUpdateModal(true);
  };

  const handleClose = () => {
    setDeleteId('');
    setGroupName([]);
    setOpen(false);
  };

  const handleCloseError = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenErrorSnackbar(false);
  };

  const addGroupFun = () => {
    if (addGroupTextfiend && !/^\s*$/.test(addGroupTextfiend)) {
      setAddModal(false);
      setSkeletonTime(true);
      http
        .post(import.meta.env.VITE_API_URL + 'api/pending-group/add', {
          name: addGroupTextfiend,
        })
        .then(() => {
          setDataUpdate(true);
          setAddGroupTextfiend('');
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      if (!addGroupTextfiend || /^\s*$/.test(addGroupTextfiend)) {
        setErrorGroupAdd(true);
      } else {
        setErrorGroupAdd(false);
      }
    }
  };
  const updateGroupFun = () => {
    if (updateGroupTextfiend && !/^\s*$/.test(updateGroupTextfiend)) {
      setUpdateModal(false);
      setSkeletonTime(true);
      http
        .post(import.meta.env.VITE_API_URL + 'api/pending-group/put', {
          name: updateGroupTextfiend,
          id: updateId,
        })
        .then(() => {
          setDataUpdate(true);
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      if (!updateGroupTextfiend || /^\s*$/.test(updateGroupTextfiend)) {
        setErrorGroupUpdate(true);
      } else {
        setErrorGroupUpdate(false);
      }
    }
  };

  const groupDelete = () => {
    setOpen(false);
    setSkeletonTime(true);
    http
      .post(import.meta.env.VITE_API_URL + 'api/pending-group/delete', {
        id: deleteId,
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
  let nameLaunch = [];
  if (groupName && launchId) {
    nameLaunch = groupName.filter((e) => {
      const id = launchId;
      return e.id == id ? e.name : '';
    });
  }

  const messSubmit = () => {
    const id = deleteId;
    if (textAreaCount && !/^\s/.test(textAreaCount)) {
      if (textAreaCount.length > 4) {
        setSkeletonTime(true);
        let messageTime = new Date();
        http
          .post(
            import.meta.env.VITE_API_URL + 'api/message/add/pending-group',
            {
              group_id: id,
              text: textAreaCount,
              time: String(messageTime),
            }
          )
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
      } else {
        if (textAreaCount.length < 4) {
          seterrorIsLimit(true);
          setTextYes(false);
        } else {
          seterrorIsLimit(false);
        }
      }
    } else {
      if (!textAreaCount || /^\s/.test(textAreaCount)) {
        setTextYes(true);
        seterrorIsLimit(false);
      } else {
        setTextYes(false);
      }
    }
  };

  const handleDayClick = (value) => {
    const dayIndex = selectedDays.indexOf(value);
    const newSelectedDays = [...selectedDays];

    if (dayIndex === -1) {
      newSelectedDays.push(value);
    } else {
      newSelectedDays.splice(dayIndex, 1);
    }

    setSelectedDays(newSelectedDays);
  };

  const daysOfWeek = [
    { label: 'Dush', value: 1 },
    { label: 'Sesh', value: 2 },
    { label: 'Chor', value: 3 },
    { label: 'Pay', value: 4 },
    { label: 'Jum', value: 5 },
    { label: 'Shan', value: 6 },
    { label: 'Yak', value: 7 },
  ];

  const handleChangeRoom = (event) => {
    setRoomValue(event.target.value);
  };

  const closeMessageModal = () => {
    setMessageOpen(false);
    setTextAreaCount('');
    setTextYes(false);
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

  const lunchFun = (e) => {
    setLaunchGroupTextfiend(e.name);
    if (e.count_students == 0) {
      setLaunchModal(false);
      seterrorIsStudent(true);
    } else {
      setLaunchModal(true);
      seterrorIsStudent(false);
    }
  };

  const closeAndSave = () => {
    setAddModal(false);
    setAddGroupTextfiend('');
    setErrorGroupAdd(false);
  };
  const closeAndSaveUpdate = () => {
    setUpdateModal(false);
    setErrorGroupUpdate(false);
  };

  const handleChangeAddGroup = (event) => {
    setAddGroupTextfiend(event.target.value);
  };
  const handleChangeUpdateGroup = (event) => {
    setUpdateGroupTextfiend(event.target.value);
  };

  const handleCloseBar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    seterrorIsStudent(false);
  };
  const handleCloseBarSucces = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSuccessMessage(false);
  };

  const changeTextArea = (e) => {
    setTextAreaCount(e.target.value);
    setTextYes(false);
    seterrorIsLimit(false);
  };

  const handleChangeLaunchGroup = (event) => {
    setLaunchGroupTextfiend(event.target.value);
  };

  const handleChangeGroupTeacher = (event, obj) => {
    setLaunchGroupTeacherName(event.target.value);
    const { key } = obj;
    const filterId = key.substring(2);
    setTeacherId(filterId);
  };

  const changeMonthSumma = (event) => {
    setMonthlySumma(event.target.value);
  };

  const changeSale = (event) => {
    setSale({
      [event.target.name]: event.target.value,
    });
  };

  const handleTimeChange = (newTime) => {
    setSelectedTime(newTime.target.value);
  };
  const handleTimeChangeTimeEnd = (newTime) => {
    setSelectedTimeEnd(newTime.target.value);
  };


  const closeAndSaveLaunch = () => {
    setLaunchModal(false);
    setLaunchGroupTextfiend('');
    setLaunchGroupTeacherName('');
    setSelectedDays([]);
    setMonthlySumma('');
    setSelectedTime('');
    setSelectedTimeEnd('');
    setRoomValue('');
    setOpenLinkState(false);
    setSale(0);
  };

  useEffect(() => {
    const updatedSelectedRows = [];
    daysOfWeekSecond.forEach((day, index) => {
      if (day.selected) {
        updatedSelectedRows.push({
          room_id: rooms[index],
          week_day: index + 1,
          time: startTimes[index] + '-' + endTimes[index],
        });
      } else {
        isVali = false;
      }
    });
    setSelectedRows(updatedSelectedRows);
  }, [daysOfWeekSecond, rooms, startTimes, endTimes]);

  const handleCloseErrorTime = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenErrorTimeSnackbar(false);
  };
  const handleCloseErrorComplate = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenErrorNoComplateSnackbar(false);
  };

  let isVali = false;

  const validateCheck = () => {
    selectedRows.forEach((e) => {
      const filterTime = e.time;
      const splitFilter = filterTime.split('-');
      if (e.room_id && e.week_day && splitFilter[0] && splitFilter[1]) {
        isVali = true;
      } else {
        isVali = false;
      }
    });
    return isVali;
  };

  function validateTime(array) {
    for (let i = 0; i < array.length; i++) {
      const { time } = array[i];
      const [startTime, endTime] = time.split('-');

      if (startTime >= endTime) {
        return false; // start time is not less than end time
      }

      if (startTime === endTime) {
        return false; // start time is equal to end time
      }
    }

    return true; // all objects pass the validation
  }


  const launchGroupFun = () => {
    if (
      launchGroupTextfiend && !/^\s/.test(launchGroupTextfiend) &&
      launchGroupTeacherName &&
      monthlySumma &&
      sale.textmask &&
      selectedDays.length > 0 &&
      roomValue &&
      selectedTime &&
      selectedTimeEnd
    ) {
      if (selectedTime !== selectedTimeEnd && selectedTime < selectedTimeEnd) {
        setLaunchModal(false);
        setSkeletonTime(true);
        http
          .post(
            import.meta.env.VITE_API_URL + 'api/pending-group/groups-create',
            {
              pendingGroupId: launchId,
              name: launchGroupTextfiend,
              month_payment: monthlySumma,
              sale: sale.textmask,
              teacher_id: teacherId,
              time: selectedTime + '-' + selectedTimeEnd,
              day: selectedDays,
              room_id: roomValue,
            }
          )
          .then(() => {
            setLaunchGroupTeacherName('');
            setMonthlySumma('');
            setSale({
              textmask: '',
            });
            setSelectedDays([]);
            setRoomValue('');
            setSelectedTime('');
            setSelectedTimeEnd('');
            setOpenLinkState(false);
            setSelectedRows([]);
            setDaysOfWeekSecond([
              { name: 'Dushanba', selected: false },
              { name: 'Seshanba', selected: false },
              { name: 'Chorshanba', selected: false },
              { name: 'Payshanba', selected: false },
              { name: 'Juma', selected: false },
              { name: 'Shanba', selected: false },
              { name: 'Yakshanba', selected: false },
            ]);
            setRooms(Array(daysOfWeekSecond.length).fill(''));
            setStartTimes(Array(daysOfWeekSecond.length).fill(''));
            setEndTimes(Array(daysOfWeekSecond.length).fill(''));
            setDataUpdate(true);
          })
          .catch((error) => {
            if (
              error.response.data.message == 'At this time there is a lesson in the room'
            ) {
              setSkeletonTime(false);
              setLaunchModal(true);
              setOpenErrorSnackbar(true);
            }
          });
      } else {
        if (selectedTime !== selectedTimeEnd && selectedTime < selectedTimeEnd) {
          setOpenErrorTimeSnackbar(true);
        } else {
          setOpenErrorTimeSnackbar(false);
        }
      }
    } else {
      setOpenErrorNoComplateSnackbar(true);
    }
  };

  const launchCheckFunGroup = () => {
    const isValid = validateTime(selectedRows);
    const isCheckForm = validateCheck();
    if (
      launchGroupTextfiend && !/^\s/.test(launchGroupTextfiend) &&
      launchGroupTeacherName &&
      monthlySumma &&
      sale.textmask &&
      isCheckForm
    ) {
      if (isValid) {
        setLaunchModal(false);
        setSkeletonTime(true);
        http
          .post(
            import.meta.env.VITE_API_URL + 'api/pending-group/lesson-add',
            {
              pendingGroupId: launchId,
              name: launchGroupTextfiend,
              month_payment: monthlySumma,
              sale: sale.textmask,
              teacher_id: teacherId,
              week_data: selectedRows
            }
          )
          .then(() => {
            setLaunchGroupTeacherName('');
            setMonthlySumma('');
            setSale({
              textmask: '',
            });
            setSelectedDays([]);
            setRoomValue('');
            setSelectedTime('');
            setSelectedTimeEnd('');
            setOpenLinkState(false);
            setSelectedRows([]);
            setDaysOfWeekSecond([
              { name: 'Dushanba', selected: false },
              { name: 'Seshanba', selected: false },
              { name: 'Chorshanba', selected: false },
              { name: 'Payshanba', selected: false },
              { name: 'Juma', selected: false },
              { name: 'Shanba', selected: false },
              { name: 'Yakshanba', selected: false },
            ]);
            setRooms(Array(daysOfWeekSecond.length).fill(''));
            setStartTimes(Array(daysOfWeekSecond.length).fill(''));
            setEndTimes(Array(daysOfWeekSecond.length).fill(''));
            setDataUpdate(true);
          })
          .catch((error) => {
            if (
              error.response.data.message == 'At this time there is a lesson in the room'
            ) {
              setSkeletonTime(false);
              setLaunchModal(true);
              setOpenErrorSnackbar(true);
            }
          });
      } else {
          setOpenErrorTimeSnackbar(true);
      }
    } else {
      setOpenErrorNoComplateSnackbar(true);
    }
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
                <h2>Kutish zali</h2>
              </div>
              <HeaderRight>
                <SectionContent>
                  <Tooltip
                    title="Guruh qo'shish"
                    arrow
                    TransitionComponent={Fade}
                    placement="top"
                  >
                    <button
                      className="addTeacher"
                      onClick={() => setAddModal(true)}
                    >
                      <i className="fa-solid fa-plus"></i>
                    </button>
                  </Tooltip>
                </SectionContent>
              </HeaderRight>
            </Header>
            <Table>
              <thead>
                <TableHeader>
                  <th className="number">
                    <p>T/r</p>
                  </th>
                  <th className="name">
                    <p>Guruh nomi</p>
                  </th>
                  <th className="count_students">
                    <p>O&apos;quvchilar soni</p>
                  </th>
                  <th className="action">
                    <p>Amallar</p>
                  </th>
                </TableHeader>
              </thead>
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
                            {e.name}
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
                      onChange={(e) => {
                        changeTextArea(e);
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
              <Modal open={addModal}>
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
                    <h2>Kutish zaliga guruh qo&apos;shish </h2>
                  </div>

                  <Box sx={{ width: '100%', mt: 7 }}>
                    <TextField
                      fullWidth
                      label="Guruh nomini kiriting..."
                      id="outlined-size-large"
                      size="large"
                      value={addGroupTextfiend}
                      onChange={handleChangeAddGroup}
                      type={'search'}
                    />
                  </Box>
                  <p
                    style={{
                      display: errorGroupAdd ? 'block' : 'none',
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
                    Guruh nomini kiriting
                  </p>
                  <Button
                    sx={{ mt: 3, pt: 1, pb: 1 }}
                    fullWidth
                    className="buy_btn_modal"
                    variant="contained"
                    onClick={addGroupFun}
                  >
                    Qo&apos;shish
                  </Button>
                </Box>
              </Modal>
              <Modal open={launchModal} sx={{ overflowY: 'scroll' }}>
              <div style={{width: '100%', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Box sx={styleLaunchGroup}>
                  <CloseIcon
                    style={{
                      position: 'absolute',
                      right: '1.2%',
                      top: '1.2%',
                      cursor: 'pointer',
                      zIndex: 2
                    }}
                    onClick={closeAndSaveLaunch}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '5.5rem',
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
                    {nameLaunch &&
                      nameLaunch.map((groupName) => {
                        return <h2 id={groupName.id}>{groupName.name}</h2>;
                      })}
                    <p style={{ marginTop: '0.1rem' }}>
                      Guruhni ishga tushurish
                    </p>
                  </div>
                  <Box sx={{ mt: 10, display: 'flex' }}>
                    <Box sx={{ width: '50%', mr: 3 }}>
                      <TextField
                        fullWidth
                        label="Guruh nomi"
                        id="outlined-size-large"
                        size="large"
                        value={launchGroupTextfiend}
                        onChange={handleChangeLaunchGroup}
                        type={'search'}
                      />
                    </Box>
                    <Box sx={{ width: '50%' }}>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          Guruhga o`qituvchi biriktirish
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={launchGroupTeacherName}
                          label="Guruhga o`qituvchi biriktirish"
                          onChange={handleChangeGroupTeacher}
                        >
                          {selectTeacher &&
                            selectTeacher.map((name) => (
                              <MenuItem key={name.id} value={name.id}>
                                {name.name}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </Box>
                  </Box>
                  <Box sx={{ mt: 3, display: 'flex' }}>
                    <Box sx={{ width: '50%', mr: 3 }}>
                      <NumericInput
                        fullWidth
                        precision={''}
                        decimalChar=","
                        thousandChar="."
                        label="Oylik to'lovni kiriting"
                        value={monthlySumma}
                        onChange={changeMonthSumma}
                        variant="outlined"
                        inputProps={{
                          maxLength: 8,
                          minLength: 0,
                        }}
                      />
                    </Box>
                    <Box sx={{ width: '50%' }}>
                      <TextField
                        fullWidth
                        label="Kelishilgan % ni kiriting...(0%-100%)"
                        value={sale.textmask}
                        onChange={changeSale}
                        name="textmask"
                        id="formatted-text-mask-input"
                        InputProps={{
                          inputComponent: TextMaskCustom,
                        }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Box>
                  </Box>
                  <Forma style={{ display: openLinkState ? 'none' : 'flex' }}>
                    <Box sx={{ width: '100%', mr: 3, pt: 1 }}>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          Xonani tanlang
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={roomValue}
                          label="Xonani tanlang"
                          onChange={handleChangeRoom}
                        >
                          {roomsData &&
                            roomsData.map((name) => (
                              <MenuItem key={name.id} value={name.id}>
                                {name.name}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </Box>
                    <Box
                      sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        mt: 1,
                      }}
                    >
                      <Box sx={{ width: '48%' }}>
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">
                            Darsning boshlanish vaqti
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={selectedTime}
                            label="Darsning boshlanish vaqti"
                            onChange={handleTimeChange}
                          >
                            <MenuItem value={'05:00'}>05:00</MenuItem>
                            <MenuItem value={'05:30'}>05:30</MenuItem>
                            <MenuItem value={'06:00'}>06:00</MenuItem>
                            <MenuItem value={'06:30'}>06:30</MenuItem>
                            <MenuItem value={'07:00'}>07:00</MenuItem>
                            <MenuItem value={'07:30'}>07:30</MenuItem>
                            <MenuItem value={'08:00'}>08:00</MenuItem>
                            <MenuItem value={'08:30'}>08:30</MenuItem>
                            <MenuItem value={'09:00'}>09:00</MenuItem>
                            <MenuItem value={'09:30'}>09:30</MenuItem>
                            <MenuItem value={'10:00'}>10:00</MenuItem>
                            <MenuItem value={'10:30'}>10:30</MenuItem>
                            <MenuItem value={'11:00'}>11:00</MenuItem>
                            <MenuItem value={'11:30'}>11:30</MenuItem>
                            <MenuItem value={'12:00'}>12:00</MenuItem>
                            <MenuItem value={'12:30'}>12:30</MenuItem>
                            <MenuItem value={'13:00'}>13:00</MenuItem>
                            <MenuItem value={'13:30'}>13:30</MenuItem>
                            <MenuItem value={'14:00'}>14:00</MenuItem>
                            <MenuItem value={'14:30'}>14:30</MenuItem>
                            <MenuItem value={'15:00'}>15:00</MenuItem>
                            <MenuItem value={'15:30'}>15:30</MenuItem>
                            <MenuItem value={'16:00'}>16:00</MenuItem>
                            <MenuItem value={'16:30'}>16:30</MenuItem>
                            <MenuItem value={'17:00'}>17:00</MenuItem>
                            <MenuItem value={'17:30'}>17:30</MenuItem>
                            <MenuItem value={'18:00'}>18:00</MenuItem>
                            <MenuItem value={'18:30'}>18:30</MenuItem>
                            <MenuItem value={'19:00'}>19:00</MenuItem>
                            <MenuItem value={'19:30'}>19:30</MenuItem>
                            <MenuItem value={'20:00'}>20:00</MenuItem>
                            <MenuItem value={'20:30'}>20:30</MenuItem>
                            <MenuItem value={'21:00'}>21:00</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                      <Box sx={{ width: '48%' }}>
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">
                            Darsning tugash vaqti
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={selectedTimeEnd}
                            label="Darsning tugash vaqti"
                            onChange={handleTimeChangeTimeEnd}
                          >
                            <MenuItem value={'05:00'}>05:00</MenuItem>
                            <MenuItem value={'05:30'}>05:30</MenuItem>
                            <MenuItem value={'06:00'}>06:00</MenuItem>
                            <MenuItem value={'06:30'}>06:30</MenuItem>
                            <MenuItem value={'07:00'}>07:00</MenuItem>
                            <MenuItem value={'07:30'}>07:30</MenuItem>
                            <MenuItem value={'08:00'}>08:00</MenuItem>
                            <MenuItem value={'08:30'}>08:30</MenuItem>
                            <MenuItem value={'09:00'}>09:00</MenuItem>
                            <MenuItem value={'09:30'}>09:30</MenuItem>
                            <MenuItem value={'10:00'}>10:00</MenuItem>
                            <MenuItem value={'10:30'}>10:30</MenuItem>
                            <MenuItem value={'11:00'}>11:00</MenuItem>
                            <MenuItem value={'11:30'}>11:30</MenuItem>
                            <MenuItem value={'12:00'}>12:00</MenuItem>
                            <MenuItem value={'12:30'}>12:30</MenuItem>
                            <MenuItem value={'13:00'}>13:00</MenuItem>
                            <MenuItem value={'13:30'}>13:30</MenuItem>
                            <MenuItem value={'14:00'}>14:00</MenuItem>
                            <MenuItem value={'14:30'}>14:30</MenuItem>
                            <MenuItem value={'15:00'}>15:00</MenuItem>
                            <MenuItem value={'15:30'}>15:30</MenuItem>
                            <MenuItem value={'16:00'}>16:00</MenuItem>
                            <MenuItem value={'16:30'}>16:30</MenuItem>
                            <MenuItem value={'17:00'}>17:00</MenuItem>
                            <MenuItem value={'17:30'}>17:30</MenuItem>
                            <MenuItem value={'18:00'}>18:00</MenuItem>
                            <MenuItem value={'18:30'}>18:30</MenuItem>
                            <MenuItem value={'19:00'}>19:00</MenuItem>
                            <MenuItem value={'19:30'}>19:30</MenuItem>
                            <MenuItem value={'20:00'}>20:00</MenuItem>
                            <MenuItem value={'20:30'}>20:30</MenuItem>
                            <MenuItem value={'21:00'}>21:00</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    </Box>
                  </Forma>
                  <Forma style={{ display: openLinkState ? 'none' : 'flex' }}>
                    <Box sx={{ width: '50%', pr: '11px' }}>
                      <p className="weekText">Hafta kuni belgilang:</p>
                      <ButtonGroup
                        sx={{}}
                        fullWidth
                        color="primary"
                        aria-label="outlined primary button group"
                      >
                        {daysOfWeek.map((day) => (
                          <Button
                            key={day.value}
                            onClick={() => handleDayClick(day.value)}
                            variant={
                              selectedDays.includes(day.value)
                                ? 'contained'
                                : 'outlined'
                            }
                          >
                            {day.label}
                          </Button>
                        ))}
                      </ButtonGroup>
                    </Box>
                  </Forma>
                  <Forma style={{ display: openLinkState ? 'flex' : 'none' }}>
                    <Box sx={{ width: '100%' }}>
                      {daysOfWeekSecond.map((day, index) => (
                        <div
                          key={index}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            paddingBottom: '1.5rem',
                          }}
                        >
                          <Box
                            sx={{
                              width: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              mr: 3,
                            }}
                          >
                            <div style={{ width: '50%' }}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={day.selected}
                                    onChange={() => handleDayOfWeekChange(index)}
                                  />
                                }
                                label={day.name}
                              />
                            </div>
                            <FormControl fullWidth>
                              <InputLabel id="demo-simple-select-label">
                                Xonani tanlang
                              </InputLabel>
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                disabled={!day.selected}
                                value={rooms[index]}
                                label="Xonani tanlang"
                                onChange={(e) => {
                                  const updatedRooms = [...rooms];
                                  updatedRooms[index] = e.target.value;
                                  setRooms(updatedRooms);
                                }}
                              >
                                {roomsData &&
                                  roomsData.map((name) => (
                                    <MenuItem key={name.id} value={name.id}>
                                      {name.name}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </FormControl>
                          </Box>
                          <Box
                            sx={{
                              width: '50%',
                              display: 'flex',
                              justifyContent: 'space-between',
                            }}
                          >
                            <Box sx={{ width: '48%' }}>
                              <FormControl fullWidth disabled={!day.selected}>
                                <InputLabel id="demo-simple-select-label">
                                  Darsning boshlanish vaqti
                                </InputLabel>
                                <Select
                                  labelId="demo-simple-select-label"
                                  id="demo-simple-select"
                                  value={startTimes[index]}
                                  onChange={(e) => {
                                    const updatedStartTimes = [...startTimes];
                                    updatedStartTimes[index] = e.target.value;
                                    setStartTimes(updatedStartTimes);
                                  }}
                                  label="Darsning boshlanish vaqti"
                                >
                                  <MenuItem value={'05:00'}>05:00</MenuItem>
                                  <MenuItem value={'05:30'}>05:30</MenuItem>
                                  <MenuItem value={'06:00'}>06:00</MenuItem>
                                  <MenuItem value={'06:30'}>06:30</MenuItem>
                                  <MenuItem value={'07:00'}>07:00</MenuItem>
                                  <MenuItem value={'07:30'}>07:30</MenuItem>
                                  <MenuItem value={'08:00'}>08:00</MenuItem>
                                  <MenuItem value={'08:30'}>08:30</MenuItem>
                                  <MenuItem value={'09:00'}>09:00</MenuItem>
                                  <MenuItem value={'09:30'}>09:30</MenuItem>
                                  <MenuItem value={'10:00'}>10:00</MenuItem>
                                  <MenuItem value={'10:30'}>10:30</MenuItem>
                                  <MenuItem value={'11:00'}>11:00</MenuItem>
                                  <MenuItem value={'11:30'}>11:30</MenuItem>
                                  <MenuItem value={'12:00'}>12:00</MenuItem>
                                  <MenuItem value={'12:30'}>12:30</MenuItem>
                                  <MenuItem value={'13:00'}>13:00</MenuItem>
                                  <MenuItem value={'13:30'}>13:30</MenuItem>
                                  <MenuItem value={'14:00'}>14:00</MenuItem>
                                  <MenuItem value={'14:30'}>14:30</MenuItem>
                                  <MenuItem value={'15:00'}>15:00</MenuItem>
                                  <MenuItem value={'15:30'}>15:30</MenuItem>
                                  <MenuItem value={'16:00'}>16:00</MenuItem>
                                  <MenuItem value={'16:30'}>16:30</MenuItem>
                                  <MenuItem value={'17:00'}>17:00</MenuItem>
                                  <MenuItem value={'17:30'}>17:30</MenuItem>
                                  <MenuItem value={'18:00'}>18:00</MenuItem>
                                  <MenuItem value={'18:30'}>18:30</MenuItem>
                                  <MenuItem value={'19:00'}>19:00</MenuItem>
                                  <MenuItem value={'19:30'}>19:30</MenuItem>
                                  <MenuItem value={'20:00'}>20:00</MenuItem>
                                  <MenuItem value={'20:30'}>20:30</MenuItem>
                                  <MenuItem value={'21:00'}>21:00</MenuItem>
                                </Select>
                              </FormControl>
                            </Box>
                            <Box sx={{ width: '48%' }}>
                              <FormControl fullWidth disabled={!day.selected}>
                                <InputLabel id="demo-simple-select-label">
                                  Darsning tugash vaqti
                                </InputLabel>
                                <Select
                                  labelId="demo-simple-select-label"
                                  id="demo-simple-select"
                                  value={endTimes[index]}
                                  onChange={(e) => {
                                    const updatedEndTimes = [...endTimes];
                                    updatedEndTimes[index] = e.target.value;
                                    setEndTimes(updatedEndTimes);
                                  }}
                                  label="Darsning tugash vaqti"
                                >
                                  <MenuItem value={'05:00'}>05:00</MenuItem>
                                  <MenuItem value={'05:30'}>05:30</MenuItem>
                                  <MenuItem value={'06:00'}>06:00</MenuItem>
                                  <MenuItem value={'06:30'}>06:30</MenuItem>
                                  <MenuItem value={'07:00'}>07:00</MenuItem>
                                  <MenuItem value={'07:30'}>07:30</MenuItem>
                                  <MenuItem value={'08:00'}>08:00</MenuItem>
                                  <MenuItem value={'08:30'}>08:30</MenuItem>
                                  <MenuItem value={'09:00'}>09:00</MenuItem>
                                  <MenuItem value={'09:30'}>09:30</MenuItem>
                                  <MenuItem value={'10:00'}>10:00</MenuItem>
                                  <MenuItem value={'10:30'}>10:30</MenuItem>
                                  <MenuItem value={'11:00'}>11:00</MenuItem>
                                  <MenuItem value={'11:30'}>11:30</MenuItem>
                                  <MenuItem value={'12:00'}>12:00</MenuItem>
                                  <MenuItem value={'12:30'}>12:30</MenuItem>
                                  <MenuItem value={'13:00'}>13:00</MenuItem>
                                  <MenuItem value={'13:30'}>13:30</MenuItem>
                                  <MenuItem value={'14:00'}>14:00</MenuItem>
                                  <MenuItem value={'14:30'}>14:30</MenuItem>
                                  <MenuItem value={'15:00'}>15:00</MenuItem>
                                  <MenuItem value={'15:30'}>15:30</MenuItem>
                                  <MenuItem value={'16:00'}>16:00</MenuItem>
                                  <MenuItem value={'16:30'}>16:30</MenuItem>
                                  <MenuItem value={'17:00'}>17:00</MenuItem>
                                  <MenuItem value={'17:30'}>17:30</MenuItem>
                                  <MenuItem value={'18:00'}>18:00</MenuItem>
                                  <MenuItem value={'18:30'}>18:30</MenuItem>
                                  <MenuItem value={'19:00'}>19:00</MenuItem>
                                  <MenuItem value={'19:30'}>19:30</MenuItem>
                                  <MenuItem value={'20:00'}>20:00</MenuItem>
                                  <MenuItem value={'20:30'}>20:30</MenuItem>
                                  <MenuItem value={'21:00'}>21:00</MenuItem>
                                </Select>
                              </FormControl>
                            </Box>
                          </Box>
                        </div>
                      ))}
                    </Box>
                  </Forma>
                  <Forma>
                    <Link
                      style={{ textDecoration: 'underline' }}
                      onClick={changeLinkState}
                    >
                      {openLinkState ? 'Yopish' : 'Batafsil'}
                    </Link>
                  </Forma>
                  <Button
                    sx={{ mt: 3, pt: 1, pb: 1 }}
                    fullWidth
                    className="buy_btn_modal"
                    variant="contained"
                    onClick={openLinkState ? launchCheckFunGroup : launchGroupFun}
                  >
                    Ishga tushirish
                  </Button>
                </Box>
                </div>
              </Modal>
              <Modal open={updateModal}>
                <Box sx={styleUpdateGroup}>
                  <CloseIcon
                    style={{
                      position: 'absolute',
                      right: '2%',
                      top: '3%',
                      cursor: 'pointer',
                    }}
                    onClick={closeAndSaveUpdate}
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
                    <h2>Guruh nomini tahrirlash</h2>
                  </div>

                  <Box sx={{ width: '100%', mt: 7 }}>
                    <TextField
                      fullWidth
                      label="Guruh nomini kiriting..."
                      id="outlined-size-large"
                      size="large"
                      value={updateGroupTextfiend}
                      onChange={handleChangeUpdateGroup}
                      type={'search'}
                    />
                  </Box>
                  <p
                    style={{
                      display: errorGroupUpdate ? 'block' : 'none',
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
                    Guruh nomini kiriting
                  </p>
                  <Button
                    sx={{ mt: 3, pt: 1, pb: 1 }}
                    fullWidth
                    className="buy_btn_modal"
                    variant="contained"
                    onClick={updateGroupFun}
                  >
                    Saqlash
                  </Button>
                </Box>
              </Modal>
              <Modal
                open={open}
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
                      name.map((groupName) => {
                        return (
                          <p id={groupName.id}>
                            Rostdan ham ushbu {groupName.name} guruhini
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
                        groupDelete();
                      }}
                    >
                      O&apos;chirish
                    </Button>
                  </div>
                </AllGroupsDeleteModal>
              </Modal>

              <Section>{data}</Section>
            </Table>
            <Snackbar
              open={errorIsStudent}
              onClose={handleCloseBar}
              severity={'error'}
              massage={'Guruhda o\'quvchi mavjud emas'}
            />
            <Snackbar
              open={successMessage}
              onClose={handleCloseBarSucces}
              severity={'success'}
              massage={'Xabar muvaffaqiyatli yuborildi'}
            />
            <Snackbar
              open={openErrorSnackbar}
              onClose={handleCloseError}
              severity={'warning'}
              massage={'Bu vaqtda ushbu xonada dars mavjud'}
            />
            <Snackbar
              open={openErrorNoComplateSnackbar}
              onClose={handleCloseErrorComplate}
              severity={'error'}
              massage={'Ma\'lumotlar to\'liq kiritilmadi'}
            />
            <Snackbar
              open={openErrorTimeSnackbar}
              onClose={handleCloseErrorTime}
              severity={'warning'}
              massage={'Darsning boshlanish va tugash vaqtini to\'g\'ri kiriting'}
            />
          </Container>
        </div>
      )}
    </div>
  );
};

export default Tables;
