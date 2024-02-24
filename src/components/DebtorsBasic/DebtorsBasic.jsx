import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import http from '../../http/index';
import { Context } from '../../index';
import { Box, Modal, TextField, Pagination, Tooltip, Fade, Button, InputLabel, MenuItem, FormControl, Select, Skeleton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import NumericInput from 'material-ui-numeric-input';
import Loder from '../loder/Loder';
import Stack from '@mui/material/Stack';
import { FormHelperText } from '@mui/material';
import dayjs from 'dayjs';
import { NumericFormat } from 'react-number-format';
import Snackbar from '../Snackbar/Snackbar';
import { DatePicker } from 'antd';
const { MonthPicker } = DatePicker;

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
    flex-wrap: wrap;
    gap: 15px;
    margin-bottom: 15px;
    border-bottom: 2px dashed gray;
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

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 13px 25px;
  justify-content: space-between;
  h2{
    color: rgb(4,41,84);
  }
`;

const HeaderRight = styled.div`
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
  color: #747272;
  background-color: #ffffff;
  border-bottom: none;
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
    .groupNameBasic_header {
      height: 40px;
      .number {
        width: 6%;
        text-align: center;
      }
      .name {
        width: 21%;
        text-align: left;
      }
      .nameGroup {
        width: 15%;
        text-align: left;
      }
      .amount {
        width: 16%;
      }
      .month {
        width: 25%;
        text-align: center;
      }
      .paidAdd {
        width: 13%;
        text-align: left;
      }
      .action {
        width: 9%;
        text-align: center;
        padding-right: 10px;
      }
    }
    .content_part {
      padding-top: 10px;
      padding-bottom: 10px;
      &:nth-child(even) {
        background-color: #e7e7e7;
      }
      height: 50px;
      .date {
        font-size: 13px;
        margin: 0.3rem 0.3rem;
        background-color: #6c757d;
        color: white;
        padding: 3px 13px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 5px;
      }
      .number_td {
        width: 6%;
        text-align: center;
      }
      .name_td {
        width: 21%;
        text-align: left;
      }
      .nameGroup_td {
        width: 15%;
        text-align: left;
      }
      .amount_td {
        width: 16%;
      }
      .month_td {
        padding-top: 5px;
        text-align: center;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        justify-content: center;
      }
      .paid_td {
        width: 13%;
        text-align: left;
      }
      .action_td {
        width: 9%;
        text-align: center;
      }
      .paidBtn {
    border: none;
    background-color: #033a6b;
    color: white;
    cursor: pointer;
    border-radius: 23px;
    padding: 7px 9px;
    transition: all 0.5s;
    &:hover {
      background-color: #0c4c85;
    }
  }
  .edit {
      background-color: initial;
      i {
        color: #585353;
      }
      border: none;
      font-size: 1rem;
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
      .delete {
        background-color: initial;
        color: #c20404;
        border: none;
        font-size: 0.9rem;
        cursor: pointer;
        &:hover {
          color: #ff0808;
        }
      }
    }
    .groupNameBasic {
      color: #fff;
      font-weight: bold;
      font-size: 20px;
      padding-top: 10px;
      padding-bottom: 10px;
      background-color: #0c4c85;
    }
`;

const Content = styled.tbody`
  width: 100%;
  font-size: 13.5px;
  .accordionSummary{
    background: #fff;
    color: #042954;
    span{
      font-size: 18px;
      font-weight: 600;
      letter-spacing: .1rem;
    }
    .debtorNum{
      font-weight: 400;
      padding-left: 8px;
      margin-left: 8px;
      border-left: 2px solid #042954;
    }
  }
  .accordionDetails{
    padding: 0;
  }
`;

const AllGroupsDeleteModal = styled.div`
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
  .allGroups_delete_notification_part {
    font-size: 1.3rem;
    margin-top: 6rem;
    margin-bottom: 1.1rem;
  }
  .delete_modal_btn_success {
    width: 100%;
    height: 2.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 1rem;
  }
`;

const PaginationSection = styled.div`
  margin-top: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Textarea = styled.textarea`
    width: 100%;
    resize: none;
    padding: 0.5rem;
    margin-top: 25px;
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

function DebtorsBasic() {
  const navigate = useNavigate();
  const { user } = useContext(Context);
  const [debtorData, setDebtorData] = useState([]);
  const [namesUser, setNamesUser] = useState({});
  const [selectDelete, setSelectDelete] = useState([]);
  const [groupId, setGroupId] = useState('');
  const [givenSum, setGivenSum] = useState('');
  const [errorSum, setErrorSum] = useState(false);
  const [errorSelectDelete, setErrorSelectDelete] = useState(false);
  const [payModal, setPayModal] = useState(false);
  const [loderTime, setLoderTime] = useState(false);
  const [allMonthGiven, setAllMonthGiven] = useState(0);
  const [open, setOpen] = useState(false);
  const [selectMenu, setSelectMenu] = useState('');
  const [skeletonTime, setSkeletonTime] = useState(true);
  const [dataUpdate, setDataUpdate] = useState(false);
  const [nameSearchValue, setNameSearchValue] = useState('');
  const [groupSearchValue, setGroupSearchValue] = useState('');
  const [dateSearchValue, setDateSearchValue] = useState(null);
  const [filterDateSearchValue, setFilterDateSearchValue] = useState('');
  const [paginatedDebtorData, setPaginatedDebtorData] = useState([]);
  const [startFilterDateValue, setStartFilterDateValue] = useState('');
  const [endFilterDateValue, setEndFilterDateValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [payMethod, setPayMethod] = useState('');
  const [errorPayMethod, setErrorPayMethod] = useState(false);
  const [noteModal, setNoteModal] = useState(false);
  const [noteTextfield, setNoteTextfield] = useState('');
  const [searchTeacher, setSearchTeacher] = useState('');
  const [monthNote, setMonthNote] = useState([]);
  const [teachersData, setTeachersData] = useState([]);
  const [errorMonthNote, setErrorMonthNote] = useState(false);
  const [errorNote, setErrorNote] = useState(false);
  const [textAreaCount, setTextAreaCount] = useState('');
  const [textYes, setTextYes] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const [errorIsLimit, seterrorIsLimit] = useState(false);
  const [errorOpenMessage, setErrorOpenMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const itemsPerPage = 15;

  // Function to handle page change
  useEffect(() => {
    http
      .get(import.meta.env.VITE_API_URL + 'api/teacher/label/get')
      .then((r) => {
        setTeachersData(r.data);
      }).catch((error) => {
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
      .get(import.meta.env.VITE_API_URL + 'api/debtor/all/get')
      .then((r) => {
        setDebtorData(r.data);
        setSkeletonTime(false);
        setLoderTime(false);
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
        .get(import.meta.env.VITE_API_URL + 'api/debtor/all/get')
        .then((r) => {
          setDebtorData(r.data);
          setSkeletonTime(false);
          setLoderTime(false);
          setDataUpdate(false);
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

  useEffect(() => {
    const rotatedArray = debtorData && debtorData !== null && debtorData.map(item => {
      return item.debtors.map(debtor => ({
        amount: debtor.amount,
        debtors: debtor.debtors,
        id: debtor.id,
        name: debtor.name,
        group: item.group,
        teacherData: item.teacherData
      }));
    }).flat();


    const filteredData = rotatedArray && rotatedArray !== null && rotatedArray.filter((el) => {
      const nameMatch = nameSearchValue === '' || (el.name.toLowerCase().includes(nameSearchValue.toLowerCase()));
      const groupMatch = groupSearchValue === '' || el.group?.name.toLowerCase().includes(groupSearchValue.toLowerCase());
      const teacherMatch = searchTeacher === '' || el.teacherData?.id.toLowerCase().includes(searchTeacher.toLowerCase());
      const dateMatch = filterDateSearchValue === '' || el.debtors.some((fun) => fun.month === filterDateSearchValue);

      // Check if the start and end filter values are not empty
      if (startFilterDateValue !== '' && endFilterDateValue !== '' && startFilterDateValue !== null && endFilterDateValue !== null) {
        const amountsum = parseFloat(el.all_summa);
        const startAmount = parseFloat(startFilterDateValue);
        const endAmount = parseFloat(endFilterDateValue);
        return nameMatch && groupMatch && teacherMatch && dateMatch && amountsum >= startAmount && amountsum <= endAmount;
      } else {
        return nameMatch && groupMatch && dateMatch && teacherMatch;
      }
    });
    setPaginatedDebtorData(filteredData);
    setCurrentPage(1);
  }, [nameSearchValue, groupSearchValue, searchTeacher, filterDateSearchValue, startFilterDateValue, endFilterDateValue, debtorData]);

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = paginatedDebtorData && paginatedDebtorData !== null && paginatedDebtorData.slice(startIndex, endIndex);

  const data =
    paginatedData &&
    paginatedData.map((el, index) => (
      <tr className="content_part" key={`${index}${el.id}`}>
        <td className="number_td">{index + 1}</td>
        <td className="name_td">{el.name}</td>
        <td className="nameGroup_td">{el?.group?.name}</td>
        <td className="amount_td">
          <NumericFormat
            value={el.amount}
            displayType={'text'}
            thousandSeparator={true}
            prefix={''}
          /> so&apos;m</td>
        <td className="month_td">
          {el.debtors &&
            el.debtors.map((fun, index) => (
              <Tooltip
                title={`Eslatma: ${fun.note ? fun.note : 'Mavjud emas'}`}
                arrow
                TransitionComponent={Fade}
                placement="top"
                key={index}
              >
                <p className="date">
                  {fun.month}
                </p>
              </Tooltip>
            ))}
        </td>
        <td className="paid_td">
          <button
            className="paidBtn"
            id={`delete${el?.group?.id}`}
            onClick={() => {
              setNamesUser(el);
              functionOpenModal(el);
              setGroupId(el?.group?.id);
            }}
          >
            To&apos;lov qilish
          </button>
        </td>
        <td className="action_td">
          <Tooltip
            title="Eslatma kiritish"
            arrow
            TransitionComponent={Fade}
            placement="top"
          >
            <button
              className="edit"
              onClick={() => {
                setNamesUser(el);
                openNoteFun(el);
              }}
            >
              <i className="fa-solid fa-notes-medical"></i>
            </button>
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
                setNamesUser(el);
                deleteDebtor(el);
                setGroupId(el?.group?.id);
              }}
            >
              <i className="fa-solid fa-trash"></i>
            </button>
          </Tooltip>
        </td>
      </tr>
    ));

  const openNoteFun = (e) => {
    setNamesUser(user => ({
      ...user,
      name: `${user.name}`
    }));
    setMonthNote(e.debtors);
    setNoteModal(true);
  };

  const deleteDebtor = (e) => {
    setNamesUser(user => ({
      ...user,
      name: `${user.name}`
    }));
    setOpen(true);
    setSelectDelete(e.debtors);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectMenu();
    setErrorSelectDelete(false);
  };

  const hedelSum = (e) => {
    setGivenSum(e.target.value);
    setErrorSum(false);
  };

  const changePayMethod = (e) => {
    setPayMethod(e.target.value);
  };

  const functionOpenModal = () => {
    setNamesUser(user => ({
      ...user,
      name: `${user.name}`
    }));
    setPayModal(true);
  };

  const closeAndSave = () => {
    setPayModal(false);
    setAllMonthGiven(0);
    setErrorSum(false);
    setGivenSum('');
  };

  const saveBuyModal = () => {
    if (payMethod && givenSum || givenSum !== 0 && allMonthGiven !== 0) {
      setLoderTime(true);
      setPayModal(false);
      http
        .post(import.meta.env.VITE_API_URL + 'api/debtor/delete', {
          student_id: namesUser?.id,
          group_id: groupId,
          given_summa: Number(givenSum),
          sale: Number(allMonthGiven),
          payment_type: payMethod
        })
        .then(() => {
          setErrorSum(false);
          setAllMonthGiven(0);
          setGivenSum('');
          setDataUpdate(true);
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
      if (!givenSum || givenSum == 0 && allMonthGiven == 0) {
        setErrorSum(true);
      } else {
        setErrorSum(false);
      }
      if (!payMethod) {
        setErrorPayMethod(true);
      } else {
        setErrorPayMethod(false);
      }
    }
  };

  const saveDeleteModal = () => {
    if (selectMenu) {
      setLoderTime(true);
      setOpen(false);
      http
        .post(import.meta.env.VITE_API_URL + 'api/debtor/delete/one', {
          id: selectMenu,
        })
        .then(() => {
          setErrorSelectDelete(false);
          setSelectMenu('');
          setDataUpdate(true);
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
      if (!selectMenu) {
        setErrorSelectDelete(true);
      } else {
        setErrorSelectDelete(false);
      }
    }
  };

  const addNoteFun = () => {
    if (noteTextfield && !/^\s*$/.test(noteTextfield) && selectMenu) {
      setLoderTime(true);
      setNoteModal(false);
      http
        .post(import.meta.env.VITE_API_URL + 'api/debtor/add-note', {
          id: selectMenu,
          text: noteTextfield
        })
        .then(() => {
          setSelectMenu('');
          setNoteTextfield('');
          setDataUpdate(true);
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
      if (!selectMenu) {
        setErrorMonthNote(true);
      } else {
        setErrorMonthNote(false);
      }
      if (!noteTextfield || /^\s*$/.test(noteTextfield)) {
        setErrorNote(true);
      } else {
        setErrorNote(false);
      }
    }
  };

  const hedelSumTwo = (e) => {
    setAllMonthGiven(e.target.value);
  };

  const selectChange = (event) => {
    setSelectMenu(event.target.value);
    setErrorMonthNote(false);
  };

  const changeSearchValue = (e) => {
    setNameSearchValue(e.target.value);
  };
  const changeGroupSearch = (e) => {
    setGroupSearchValue(e.target.value);
  };

  const changeDateSearch = (date) => {
    setDateSearchValue(date);
    const selectedMonth = date ? dayjs(date).format('YYYY-MM') : '';
    setFilterDateSearchValue(selectedMonth);
  };

  const changeStartDateValue = (e) => {
    setStartFilterDateValue(e.target.value);
  };

  const changeEndDateValue = (e) => {
    setEndFilterDateValue(e.target.value);
  };

  const closeNoteFun = () => {
    setNoteModal(false);
    setNoteTextfield('');
    setSelectMenu('');
  };

  const handleChangeSearchTeacher = (e) => {
    setSearchTeacher(e.target.value);
  };

  const messageOpenFun = () => {
    if(paginatedDebtorData.length > 0){
      setMessageOpen(true);
    }else{
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
        const uniqueIdsSet = new Set(paginatedDebtorData.map((e) => e.id));
        const studentList = [...uniqueIdsSet];
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
      <Loder stop={loderTime} />
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
        <Container>
          <Header>
            <div>
              <h2>Qarzdorlar</h2>
            </div>
            <HeaderRight>
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
            </HeaderRight>
          </Header>
          <p style={{ paddingLeft: '27px', color: 'gray', fontWeight: '600', fontSize: '15px' }}>Filter</p>
          <div className='filterPart'>
            <TextField size='small' sx={{ width: '180px' }} id="outlined-basic" value={nameSearchValue} onChange={changeSearchValue} label="Ismi bo'yicha qidirish" variant="outlined" />
            <TextField size='small' sx={{ width: '220px' }} id="outlined-basic" value={groupSearchValue} onChange={changeGroupSearch} label="Guruhi bo'yicha qidirish" variant="outlined" />
            <FormControl size='small' style={{ width: 180 }}>
              <InputLabel id="demo-simple-select-label">
                O&apos;qituvchi bo&apos;yicha qidirish
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={searchTeacher}
                label="O'qituvchi bo'yicha qidirish"
                onChange={handleChangeSearchTeacher}
              >
                <MenuItem value={''}>
                  Barchasi
                </MenuItem>
                {teachersData &&
                  teachersData.map((name) => (
                    <MenuItem key={name.id} value={name.id}>
                      {name.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <MonthPicker
              value={dateSearchValue}
              onChange={changeDateSearch}
              placeholder="Sana bo'yicha qidirish"
              format="YYYY MMMM"
              style={{
                width: '210px',
                height: '40px',
                border: '1.9px solid #C4C4C4',
                borderRadius: '4px',
                color: '#6E6E6E',
                fontSize: '17px',
              }}
            />
            <NumericInput
              size='small'
              sx={{ width: '220px' }}
              precision={''}
              decimalChar=","
              thousandChar="."
              label="Qarz miqdori (oldin)"
              value={startFilterDateValue}
              onChange={changeStartDateValue}
              variant="outlined"
              inputProps={{
                maxLength: 8,
                minLength: 0,
              }}
            />
            <NumericInput
              size='small'
              sx={{ width: '220px' }}
              precision={''}
              decimalChar=","
              thousandChar="."
              label="Qarz miqdori (gacha)"
              value={endFilterDateValue}
              onChange={changeEndDateValue}
              variant="outlined"
              inputProps={{
                maxLength: 8,
                minLength: 0,
              }}
            />
          </div>
          <Table>
            <tr className="groupNameBasic_header">
              <th className="number">
                <p>T/r</p>
              </th>
              <th className="name">
                <p>Ismi familyasi</p>
              </th>
              <th className="nameGroup">
                <p>Guruhi</p>
              </th>
              <th className="amount">
                <p>Qarz miqdori</p>
              </th>
              <th className="month">
                <p>Oylar</p>
              </th>
              <th className="paidAdd">
                <p>To&apos;lov qilish</p>
              </th>
              <th className="action">
                <p>Amalar</p>
              </th>
            </tr>
            <Content>{data}</Content>
          </Table>
          <PaginationSection>
            <Stack spacing={3}>
              <Pagination
                count={Math.ceil(paginatedDebtorData && paginatedDebtorData.length / itemsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                color='primary'
                variant='outlined'
                shape='rounded'
              />
            </Stack>
          </PaginationSection>
          <Modal open={payModal}>
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
                  height: '6rem',
                  left: 0,
                  borderTopLeftRadius: '6px',
                  borderTopRightRadius: '6px',
                  zIndex: '-1',
                  padding: '20px 30px',
                  top: 0,
                  background: '#FDC600',
                }}
              >
                <h2>{namesUser?.name?.length > 20 ? `${namesUser?.name.slice(0, 20)}...` : namesUser?.name} </h2>
                <p style={{ marginTop: '0.5rem' }}>
                  Ushbu o&apos;quvchiga to&apos;lov qilish
                </p>
              </div>
              <NumericInput
                sx={{ pb: 3, mt: 11 }}
                fullWidth
                precision={''}
                decimalChar=","
                thousandChar="."
                label="Qarzdorlik summasi"
                value={givenSum}
                onChange={hedelSum}
                variant="outlined"
                inputProps={{
                  maxLength: 8,
                  minLength: 0,
                }}
                helperText={errorSum ? 'Summa kiritilmadi' : null}
                FormHelperTextProps={{ style: { color: '#d32f2f' } }}
              />
              <NumericInput
                sx={{ pb: 3 }}
                fullWidth
                precision={''}
                decimalChar=","
                thousandChar="."
                label="Chegirma"
                value={allMonthGiven}
                onChange={(e) => hedelSumTwo(e)}
                variant="outlined"
                inputProps={{
                  maxLength: 8,
                  minLength: 0,
                }}
                helperText={errorSum ? '' : null}
                FormHelperTextProps={{ style: { color: '#d32f2f' } }}
              />
              <FormControl fullWidth>
                <InputLabel id='demo-simple-select-label'>
                  To&apos;lov usuli
                </InputLabel>
                <Select
                  labelId='demo-simple-select-label'
                  id='demo-simple-select'
                  value={payMethod}
                  label="To'lov usuli"
                  onChange={changePayMethod}
                >
                  <MenuItem value={'cash'}>Naqd pul orqali</MenuItem>
                  <MenuItem value={'Payme'}>Payme</MenuItem>
                  <MenuItem value={'Click'}>Click</MenuItem>
                  <MenuItem value={'Uzumpay'}>Uzumpay</MenuItem>
                  <MenuItem value={'Zoomrad'}>Zoomrad</MenuItem>
                  <MenuItem value={'Paynet'}>Paynet</MenuItem>
                  <MenuItem value={'Oson'}>Oson</MenuItem>
                  <MenuItem value={'AlifMobi'}>Alif mobi</MenuItem>
                  <MenuItem value={'Anorbank'}>Anorbank</MenuItem>
                  <MenuItem value={'Beepul'}>Beepul</MenuItem>
                  <MenuItem value={'Davrmobile'}>Davr Mobile</MenuItem>
                  <MenuItem value={'other'}>Boshqa...</MenuItem>
                </Select>
                <FormHelperText
                  style={{
                    display: errorPayMethod ? 'block' : 'none',
                    color: '#d32f2f',
                  }}
                >
                  To&apos;lov usulini tanlang
                </FormHelperText>
              </FormControl>
              <Button
                sx={{ mt: 3, pt: 1, pb: 1 }}
                fullWidth
                className="buy_btn_modal"
                variant="contained"
                onClick={saveBuyModal}
              >
                To&apos;lash
              </Button>
            </Box>
          </Modal>
          <Modal open={noteModal}>
            <Box sx={style}>
              <CloseIcon
                style={{
                  position: 'absolute',
                  right: '2%',
                  top: '3%',
                  cursor: 'pointer',
                }}
                onClick={closeNoteFun}
              />
              <div
                style={{
                  position: 'fixed',
                  width: '100%',
                  height: '6rem',
                  left: 0,
                  borderTopLeftRadius: '6px',
                  borderTopRightRadius: '6px',
                  zIndex: '-1',
                  padding: '20px 30px',
                  top: 0,
                  background: '#FDC600',
                }}
              >
                <h2>{namesUser?.name?.length > 20 ? `${namesUser?.name.slice(0, 20)}...` : namesUser?.name} </h2>
                <p style={{ marginTop: '0.5rem' }}>
                  Eslatma qoldirish
                </p>
              </div>
              <FormControl fullWidth style={{ marginTop: '5rem' }}>
                <InputLabel id="demo-simple-select-label">
                  Qarzdorlik oyini tanlang
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectMenu}
                  label="Qarzdorlik oyini tanlang"
                  onChange={selectChange}
                >
                  {monthNote &&
                    monthNote.map((delFun) => {
                      return (
                        <MenuItem key={delFun.id} value={delFun.id}>
                          {delFun.month}
                        </MenuItem>
                      );
                    })}
                </Select>
                <FormHelperText
                  style={{
                    display: errorMonthNote ? 'block' : 'none',
                    color: '#d32f2f',
                  }}
                >
                  Qarzdorlik oyini tanlang
                </FormHelperText>
              </FormControl>
              <Textarea value={noteTextfield} onChange={(e) => { setNoteTextfield(e.target.value); setErrorNote(false); }} placeholder='Eslatmani kiriting' name="" id="" cols="40" rows="6">

              </Textarea>
              <p className='errorText'
                style={{
                  display: errorNote ? 'block' : 'none',
                  marginTop: '3px',
                  marginBottom: '30px',
                  marginLeft: '12px',
                  fontSize: '0.75rem',
                  color: '#d32f2f',
                  fontFamily: 'Roboto, Helvetica, Arial, san-serif',
                  fontWeight: '400',
                  lineHeight: '1.66',
                  letterSpacing: '0.03333em'
                }}>
                Eslatmani kiriting
              </p>
              <Button
                sx={{ mt: 3, pt: 1, pb: 1 }}
                fullWidth
                className="buy_btn_modal"
                variant="contained"
                onClick={addNoteFun}
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
              <CloseIcon
                style={{
                  position: 'absolute',
                  right: '2%',
                  top: '3%',
                  cursor: 'pointer',
                }}
                onClick={handleClose}
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
                <h2>{namesUser?.name?.length > 20 ? `${namesUser?.name?.slice(0, 20)}...` : namesUser?.name} </h2>
              </div>
              <div className="allGroups_delete_notification_part">
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Oyni tanlang
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectMenu}
                    label="Oyni tanlang"
                    onChange={selectChange}
                  >
                    {selectDelete &&
                      selectDelete.map((delFun) => {
                        return (
                          <MenuItem key={delFun.id} value={delFun.id}>
                            {delFun.month}
                          </MenuItem>
                        );
                      })}
                  </Select>
                  <FormHelperText
                    style={{
                      display: errorSelectDelete ? 'block' : 'none',
                      color: '#d32f2f',
                    }}
                  >
                    Oyni tanlang
                  </FormHelperText>
                </FormControl>
              </div>
              <Button
                className="delete_modal_btn_success"
                variant="contained"
                color="error"
                onClick={saveDeleteModal}
              >
                O&apos;chirish
              </Button>
            </AllGroupsDeleteModal>
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
      )}
    </div>
  );
}

export default DebtorsBasic;