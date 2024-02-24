/* eslint-disable react/jsx-key */
import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import http from '../../http/index';
import { Box, Modal, Button, Menu, MenuItem, IconButton, Checkbox, Tooltip, Fade, FormControl, InputLabel, Select, FormHelperText, FormControlLabel } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import NumericInput from 'material-ui-numeric-input';
import PropTypes from 'prop-types';
import Loder from '../loder/Loder';
import { useNavigate } from 'react-router-dom';
import { NumericFormat } from 'react-number-format';
import { Context } from '../../index';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
const wordLimit = {
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
};

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
    width: 6%;
    text-align: center;
  }
  .name {
    width: 23%;
  }
  .phone {
    width: 18%;
    text-align: left;
  }
  .status{
    width: 14%;
    text-align: center;
  }
  .pay {
    width: 14%;
    text-align: center;
  }
  .month_summa{
    width: 20%;
    text-align: center;
  }
  .paidAdd {
    width: 12%;
    text-align: center;
  }
  .action {
    width: 13%;
    text-align: right;
    padding-right: 10px;
  }
  .statusesPart{
    display: flex;
    gap: 15px;
    font-size: 13.5px;
    color: #7d7d7d;
    padding-left: 20px;
    padding-top: 20px;
    padding-bottom: 20px;
    .child{
        display: flex;
        align-items: center;
        gap: 5px;
        .colorsCame{
            border: 1px solid gray;
        }
        .colorsNotCame{
            border: 1px solid #626262;
            background-color: #626262;
        }
        .colorsLate{
            border: 1px solid #f12424;
            background-color: #f12424;
        }
        .colorsFrozen{
            border: 1px solid rgb(7, 49, 143);
            background-color: rgb(7, 49, 143);
        }
        div{
            width: 15px;
            height: 15px;
            border-radius: 50%;
        }
    }
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
  tr {
    text-align: left;
    &:nth-child(even) {
      background-color: #f8f8f8;
    }
    display: flex;
    align-items: center;
  }
  .students-table{
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 15px 0px;
    border-bottom: 2px dashed gray;
  }
  .dateBlock {
      display: flex;
      gap: 4px;
      width: 100%;
      padding: 6px;
      border-radius: 2px;
      align-items: center;
      .datesPart {
        display: grid;
        width: 100%;
        @media screen and (max-width: 620px){
            width: 85%;
        }
        gap: 4px;
        .childDates {
          border: 1px solid #ccc;
          padding: 5px 7px;
          border-radius: 2px;
          height: 30px;
          text-align: center;
          font-size: 12px;
          white-space: nowrap;
          box-sizing: border-box;
        }
      }
      .previBtn,
      .nextBtn {
        width: 3.6%;
        padding: 6px 0px;
        border: 1px solid white;
        background: initial;
        height: 30px;
        font-size: 15px;
        border-radius: 4px;
        color: #2f2a4e;
        cursor: pointer;
        transition: 0.3s ease;
        @media screen and (max-width: 620px){
            width: 7%;
        }
        &:disabled {
          cursor: not-allowed;
          color: #a9a1a1;
          &:hover {
            border: 1px solid white;
          }
        }
        &:hover {
          border-color: #2f2a4e;
        }
      }
    }
  .number {
    width: 6%;
    text-align: center;
  }
  .name {
    width: 23%;
    text-align: left;
  }
  .phone {
    width: 18%;
    text-align: left;
  }
  .status{
    width: 14%;
    text-align: center;
  }

  .status_active{
    
  }

  .month_summa{
    width: 20%;
    text-align: center;
  }
  .pay {
    width: 14%;
    text-align: center;
    display: flex;
    justify-content: center;
  }

  .paidAdd {
    width: 12%;
    text-align: center;
  }
  .action {
    width: 13%;
    text-align: right;
  }

  .paid {
    background-color: #6cb324;
    border-radius: 25px;
    padding: 2px 10px;
    color: white;
    width: 110px;
    transform: scale(0.95);
  }
  .due {
    background-color: #e90b0b;
    padding: 2px 10px;
    width: 110px;
    color: white;
    border-radius: 25px;
    transform: scale(0.95);
  }

  .edit {
    background-color: initial;
    i {
      color: #585353;
    }
    border: none;
    font-size: 0.9rem;
    margin-right: 0.7rem;
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

  .freze{
    border: none;
    margin-right: 0.8rem;
    background-color: initial;
    cursor: pointer
  }
  .open-lock{
    border: none;
    margin-right: 0.65rem;
    background-color: initial;
    cursor: pointer
  }

  .eye {
    background-color: initial;
    color: #033a6b;
    border: none;
    font-size: 0.9rem;
    display: inline-block;
    text-align: center;
    width: 18px;
    cursor: pointer;
    transition: all 0.5s;
    margin-right: 0.7rem;
    &:hover {
      color: #0c477b;
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
  .paidBtn {
    border: none;
    background-color: #033a6b;
    color: white;
    cursor: pointer;
    border-radius: 23px;
    padding: 7px 9px;
    transition: all 0.5s;
    transform: scale(0.95);
    &:hover {
      background-color: #0c4c85;
    }
  }
  .userImg {
    border-radius: 50%;
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
const styleLimit = {
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
  zIndex: 10,
};
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
  .activate_icon_div {
    display: flex;
    justify-content: center;
    align-items: center;
    .delete_icon {
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      padding-top: 0.8rem;
      padding-bottom: 0.8rem;
      img {
        width: 5rem;
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

const Textarea = styled.textarea`
    width: 100%;
    resize: none;
    padding: 0.5rem;
`;

const styleEdit = {
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


const Tables = ({ inChecked, inCheckedTrue, getData, handleGroupAddStudentFun, setGroupNameApp, updateFun }) => {
  const navigate = useNavigate();
  const { user } = useContext(Context);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [errorSum, setErrorSum] = useState(false);
  const [payModal, setPayModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [limitOpen, setLimitOpen] = useState(false);
  const [messageLimit, setMessageLimit] = useState(false);
  const [inLimitEditError, setInLimitEditError] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [groupstudentid, setGroupstudentid] = useState('');
  const [editSumma, setEditSumma] = useState('');
  const [payMethod, setPayMethod] = useState('');
  const [allSumma, setAllSumma] = useState('');
  const [limitSumma, setLimitSumma] = useState('');
  const [saleInfo, setSaleInfo] = useState(0);
  const [loderTime, setLoderTime] = useState(false);
  const [frezeModal, setFrezeModal] = useState(false);
  const [activationModal, setActivationModal] = useState(false);
  const [frezeData, setFrezeData] = useState(null);
  const [description, setDescription] = useState('');
  const [startDateError, setStartDateError] = useState(false);
  const [errorPayMethod, setErrorPayMethod] = useState(false);
  const [studentName, setStudentName] = useState([]);
  const [studentData, setStudentData] = useState({});
  const [itemsPerBlock, setItemsPerBlock] = useState(0);
  const [isCompletyDelete, setIsCompletyDelete] = useState(false);
  const urlID = window.location.href.split('/');

  const openAnchor = Boolean(anchorEl);
  const handleClickAnchor = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseAnchor = () => {
    setAnchorEl(null);
  };

  const handleOpen = (e) => {
    setDeleteId(e.id);
    setOpen(true);
  };

  const handleClose = () => {
    setDeleteId('');
    setOpen(false);
  };

  const frezeModalFunOpen = () => {
    setAnchorEl(null);
    setFrezeData(studentData);
    setFrezeModal(true);
  };


  const frezeModalFunColse = () => {
    setFrezeModal(false);
    setFrezeData(null);
    setStartDateError(false);
    setDescription('');
  };


  const closeAndSave = () => {
    setPayModal(false);
    setSaleInfo(0);
    setErrorSum(false);
    setMessageLimit(false);
  };

  const saveBuyModal = () => {
    if (payMethod && allSumma || allSumma !== 0 && saleInfo !== 0) {
      if (allSumma > limitSumma) {
        setLimitOpen(true);
      } else {
        setLimitOpen(false);
        setLoderTime(true);
        http
          .post(import.meta.env.VITE_API_URL + 'api/payment/add', {
            student_id: deleteId,
            group_id: urlID[4],
            all_summa: limitSumma,
            given_summa: Number(allSumma),
            sale: Number(saleInfo),
            payment_type: payMethod
          })
          .then(() => {
            setPayModal(false);
            setSaleInfo(0);
            setErrorSum(false);
            setLoderTime(false);
            updateFun();
          })
          .catch((error) => {
            if (
              error.response.data.message ==
              'ro\'yxattan o\'tmagan foydalanuvchi!'
            ) {
              user.setIsAuth(false);
              localStorage.clear();
              navigate('/');
            } else {
              console.log(346, error);
            }
          });
      }
    } else {
      if (!allSumma || allSumma == 0 && saleInfo == 0) {
        setErrorSum(true);
        setMessageLimit(true);
      } else {
        setErrorSum(false);
        setMessageLimit(false);
      }
      if (!payMethod) {
        setErrorPayMethod(true);
      } else {
        setErrorPayMethod(false);
      }
    }
  };

  const limitNow = () => {
    setLimitOpen(false);
    setMessageLimit(true);
  };

  const limitYes = () => {
    setLimitOpen(false);
    setLoderTime(true);
    http
      .post(import.meta.env.VITE_API_URL + 'api/payment/add', {
        student_id: deleteId,
        group_id: urlID[4],
        all_summa: limitSumma,
        given_summa: allSumma,
        sale: saleInfo,
      })
      .then(() => {
        setPayModal(false);
        setSaleInfo(0);
        setErrorSum(false);
        setMessageLimit(false);
        setLoderTime(false);
        updateFun();
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
  };
  const editSummaFun = () => {
    if (editSumma && groupstudentid) {
      setLoderTime(true);
      http
        .post(import.meta.env.VITE_API_URL + 'api/group-students/summa/put', {
          id: groupstudentid,
          summa: Number(editSumma),
        })
        .then(() => {
          setEditModal(false);
          setLoderTime(false);
          updateFun();
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
      if (!editSumma) {
        setInLimitEditError(true);
      } else {
        setInLimitEditError(false);
      }
    }
  };

  const payModalFun = (e) => {
    setDeleteId(e.currentTarget.id.substring(6));
    setPayModal(true);
  };

  const DateList = ({ dates }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerRow = 2; // Number of rows in each block

    useEffect(() => {
      const calculateItemsPerBlock = () => {
        const screenWidth = window.innerWidth;
        // Calculate the number of items per block based on screen width and desired rows
        let calculatedItemsPerBlock = Math.floor(screenWidth / 71); // Adjust the item width as needed

        // Ensure that calculatedItemsPerBlock is even (divisible by 2)
        if (calculatedItemsPerBlock % 2 !== 0) {
          calculatedItemsPerBlock -= 1;
        }

        setItemsPerBlock(calculatedItemsPerBlock);
      };

      // Calculate initial items per block and listen for window resize
      calculateItemsPerBlock();
      window.addEventListener('resize', calculateItemsPerBlock);

      return () => {
        window.removeEventListener('resize', calculateItemsPerBlock);
      };
    }, []);
    const totalPages = Math.ceil(dates.length / (itemsPerBlock * itemsPerRow));

    const handleNextPage = () => {
      setCurrentPage((prevPage) => (prevPage + 1) % totalPages);
    };

    const handlePrevPage = () => {
      setCurrentPage((prevPage) => (prevPage - 1 + totalPages) % totalPages);
    };

    const start = currentPage * itemsPerBlock * itemsPerRow;
    const end = start + itemsPerBlock * itemsPerRow;

    const gridContainerStyle = {
      display: 'grid',
      gridTemplateColumns: `repeat(${itemsPerBlock}, 1fr)`,
      gap: '4px', // Adjust the gap between elements
    };


    return (
      <div className="dateBlock">
        <button onClick={handlePrevPage} className="previBtn" disabled={totalPages === 1 || currentPage === 0}>
          <i className="fa-solid fa-angles-left"></i>
        </button>
        <div className="datesPart" style={gridContainerStyle}>
          {dates.slice(start, end).map((item, index) => (
            <Tooltip
              key={index}
              enterDelay={1000}
              placement="top"
              arrow
              title={`Izoh: ${item.comment ? item.comment : 'Mavjud emas'}`}>
              <div className="childDates"
                style={{
                  borderColor:
                    item?.status === 'notCome'
                      ? '#626262'
                      : item?.status === 'it\'sLate'
                        ? '#f12424'
                        : item?.status === 'frozen'
                          ? 'rgb(7 49 143'
                          : '#626262',
                  color:
                    item?.status === 'notCome'
                      ? 'white'
                      : item?.status === 'it\'sLate'
                        ? 'white'
                        : item?.status === 'frozen'
                          ? 'white'
                          : '#626262',
                  backgroundColor:
                    item?.status === 'notCome'
                      ? '#626262'
                      : item?.status === 'it\'sLate'
                        ? '#f12424'
                        : item?.status === 'frozen'
                          ? 'rgb(7 49 143'
                          : 'white',
                }}
              >
                {item.date.slice(5, 10)}
              </div>
            </Tooltip>
          ))}
        </div>
        <button onClick={handleNextPage} className="nextBtn" disabled={totalPages === 1 || currentPage === totalPages - 1}>
          <i className="fa-solid fa-angles-right"></i>
        </button>
      </div>
    );
  };

  DateList.propTypes = {
    dates: PropTypes.array.isRequired,
  };

  const editFun = () => {
    setEditModal(true);
  };


  const openActivation = () => {
    setAnchorEl(null);
    setActivationModal(true);
    setStudentName(studentData);
  };

  const useCallFun = (info) => {
    setStudentData(info);
  };

  const addOtherGroupStudent = () => {
    setAnchorEl(null);
    setGroupNameApp(studentData);
    handleGroupAddStudentFun(studentData);
  };

  const callStudentPage = () => {
    setAnchorEl(null);
    navigate(`/student/${studentData.id}`);
  };

  const changeStudentPayMonth = () => {
    setAnchorEl(null);
    setGroupstudentid(studentData.group_student_id);
    setEditSumma(studentData.month_payment == 0 ? studentData.groupAllSum : studentData.month_payment);
    editFun();
  };

  const openDeleteFun = () => {
    setAnchorEl(null);
    handleOpen(studentData);
  };


  let data = [];
  if (getData) {
    data = getData.map((e) => {
      if (e) {
        return (
          <div key={e.id} className='students-table'>
            {e.status == 'frozen' ? (
              <Tooltip title={`Izoh: ${e.comment ? e.comment : 'Mavjud emas'}`}>
                <tr style={{ background: 'rgb(51 122 183 / 22%)' }}>
                  <td className="number">
                    <Checkbox
                      type={'checkbox'}
                      name="id"
                      value={e.id}
                      id={e.id}
                      onChange={inChecked}
                      checked={inCheckedTrue.includes(e.id)}
                    />
                  </td>
                  <td className="name" style={{
                    width: user?.user?.role == 'admin' ? '29%' :
                      user?.user?.role == 'super' || user?.user?.role == 'casher' ? '23%' : '29%'
                  }}>{e.name}</td>
                  <td className="phone">{e.phone}</td>
                  <td className="status">
                    {e.status == 'active' ? <p>Faol</p> : e.status == 'test' ? <p>Sinov darsida</p> : <p>Muzlatilgan</p>}
                  </td>
                  <td className="month_summa">
                    <NumericFormat
                      value={e.month_payment == 0 ? e.groupAllSum : e.month_payment}
                      displayType={'text'}
                      thousandSeparator={true}
                      prefix={''}
                    /> so&apos;m
                  </td>
                  <td className="pay" style={{ display: user?.user?.role == 'casher' || user?.user?.role == 'super' ? 'block' : 'none' }}>
                    {e.monthPay ? (
                      <p className="paid">To&apos;langan</p>
                    ) : (
                      <p className="due">To&apos;lanmagan</p>
                    )}
                  </td>
                  <td className="paidAdd" style={{ display: user?.user?.role == 'casher' || user?.user?.role == 'super' ? 'block' : 'none' }}>
                    <button
                      id={`delete${e.id}`}
                      onClick={(el) => {
                        setStudentData(e);
                        setAllSumma(e.month_payment == 0 ? e.groupAllSum : e.month_payment);
                        setLimitSumma(e.month_payment == 0 ? e.groupAllSum : e.month_payment);
                        payModalFun(el);
                      }}
                      className="paidBtn"
                    >
                      To&apos;lov qilish
                    </button>
                  </td>
                  <td className="action">
                    <IconButton
                      size="small"
                      sx={{ color: '#5E6C84', marginRight: '9px' }}
                      aria-controls={openAnchor ? 'account-menu' : undefined}
                      aria-haspopup="true"
                      aria-expanded={openAnchor ? 'true' : undefined}
                      onClick={(alt) => { handleClickAnchor(alt), useCallFun(e); }}
                    >
                      <MoreVertIcon></MoreVertIcon>
                    </IconButton>
                    <Menu
                      id="account-menu"
                      // MenuListProps={{
                      //   "aria-labelledby": "fade-button",
                      // }}
                      anchorEl={anchorEl}
                      open={openAnchor}
                      onClose={handleCloseAnchor}
                      TransitionComponent={Fade}
                      PaperProps={{
                        elevation: 0,
                        sx: {
                          overflow: 'visible',
                          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.07))',
                          '& .MuiAvatar-root': {},
                          '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                          },
                        },
                      }}
                      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                      <MenuItem sx={{
                        fontSize: '14px',
                        color: '#0d2f62',
                        display: user?.user?.role == 'admin' || user?.user?.role == 'super' ? 'block' : 'none'
                      }} onClick={() => { addOtherGroupStudent(); }}>
                        <GroupAddIcon style={{ color: '#0d2f62', fontSize: '1.2rem', marginRight: '5px' }} />
                        Boshqa guruhga olib o&apos;tish
                      </MenuItem>
                      <MenuItem sx={{
                        fontSize: '14px',
                        color: '#0d2f62',
                      }} onClick={() => { callStudentPage(); }}>
                        <i className="fa-solid fa-eye" style={{ color: '#0d2f62', fontSize: '0.9rem', marginRight: '5px' }}></i>
                        Ma&apos;lumotlar
                      </MenuItem>
                      <MenuItem sx={{
                        fontSize: '14px',
                        color: '#0d2f62',
                        display: user?.user?.role == 'casher' || user?.user?.role == 'super' ? 'block' : 'none'
                      }} onClick={() => { changeStudentPayMonth(); }}>
                        <i className="fa-solid fa-pen" style={{ color: '#0d2f62', fontSize: '0.9rem', marginRight: '5px' }}></i>
                        To&apos;lov summasini tahrirlash
                      </MenuItem>
                      {studentData.status == 'frozen' ? <MenuItem sx={{
                        fontSize: '14px',
                        color: '#0d2f62',
                        display: user?.user?.role == 'admin' || user?.user?.role == 'super' ? 'block' : 'none'
                      }} onClick={() => { openActivation(); }}>
                        <i className="fa-solid fa-lock-open" style={{ color: '#0d2f62', fontSize: '0.9rem', marginRight: '5px' }}></i>
                        Faollashtirish
                      </MenuItem> : <MenuItem sx={{
                        fontSize: '14px',
                        color: '#c20404',
                        display: user?.user?.role == 'admin' || user?.user?.role == 'super' ? 'block' : 'none'
                      }} onClick={() => { frezeModalFunOpen(); }}>
                        <i className="fa-solid fa-ban fa-rotate-90" style={{ color: '#c20404', fontSize: '0.9rem', marginRight: '5px' }}></i>
                        Muzlatish
                      </MenuItem>}
                      <MenuItem sx={{
                        fontSize: '14px',
                        color: '#c20404',
                        display: user?.user?.role == 'admin' || user?.user?.role == 'super' ? 'block' : 'none'
                      }} onClick={() => { openDeleteFun(); }}>
                        <i className="fa-solid fa-trash" style={{ color: '#c20404', fontSize: '0.9rem', marginRight: '5px' }}></i>
                        O&apos;chirish
                      </MenuItem>
                    </Menu>
                  </td>
                </tr>
              </Tooltip>
            ) : (<tr>
              <td className="number">
                <Checkbox
                  type={'checkbox'}
                  name="id"
                  value={e.id}
                  id={e.id}
                  onChange={inChecked}
                  checked={inCheckedTrue.includes(e.id)}
                />
              </td>
              <td className="name" style={{
                width: user?.user?.role == 'admin' ? '29%' :
                  user?.user?.role == 'super' || user?.user?.role == 'casher' ? '23%' : '29%'
              }}>{e.name}</td>
              <td className="phone">{e.phone}</td>
              <td className="status">
                {e.status == 'active' ? <p>Faol</p> : e.status == 'test' ? <p>Sinov darsida</p> : <p>Muzlatilgan</p>}
              </td>
              <td className="month_summa">
                <NumericFormat
                  value={e.month_payment == 0 ? e.groupAllSum : e.month_payment}
                  displayType={'text'}
                  thousandSeparator={true}
                  prefix={''}
                /> so&apos;m
              </td>
              <td className="pay" style={{ display: user?.user?.role == 'casher' || user?.user?.role == 'super' ? 'block' : 'none' }}>
                {e.monthPay ? (
                  <p className="paid">To&apos;langan</p>
                ) : (
                  <p className="due">To&apos;lanmagan</p>
                )}
              </td>
              <td className="paidAdd" style={{ display: user?.user?.role == 'casher' || user?.user?.role == 'super' ? 'block' : 'none' }}>
                <button
                  id={`delete${e.id}`}
                  onClick={(el) => {
                    setStudentData(e);
                    setAllSumma(e.month_payment == 0 ? e.groupAllSum : e.month_payment);
                    setLimitSumma(e.month_payment == 0 ? e.groupAllSum : e.month_payment);
                    payModalFun(el);
                  }}
                  className="paidBtn"
                >
                  To&apos;lov qilish
                </button>
              </td>
              <td className="action">
                <IconButton
                  size="small"
                  sx={{ color: '#5E6C84', marginRight: '9px' }}
                  aria-controls={openAnchor ? 'account-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={openAnchor ? 'true' : undefined}
                  onClick={(alt) => { handleClickAnchor(alt), useCallFun(e); }}
                >
                  <MoreVertIcon></MoreVertIcon>
                </IconButton>
                <Menu
                  id="account-menu"
                  // MenuListProps={{
                  //   "aria-labelledby": "fade-button",
                  // }}
                  anchorEl={anchorEl}
                  open={openAnchor}
                  onClose={handleCloseAnchor}
                  TransitionComponent={Fade}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      overflow: 'visible',
                      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.07))',
                      '& .MuiAvatar-root': {},
                      '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem sx={{
                    fontSize: '14px',
                    color: '#0d2f62',
                    display: user?.user?.role == 'admin' || user?.user?.role == 'super' ? 'block' : 'none'
                  }} onClick={() => { addOtherGroupStudent(); }}>
                    <GroupAddIcon style={{ color: '#0d2f62', fontSize: '1.2rem', marginRight: '5px' }} />
                    Boshqa guruhga olib o&apos;tish
                  </MenuItem>
                  <MenuItem sx={{
                    fontSize: '14px',
                    color: '#0d2f62',
                  }} onClick={() => { callStudentPage(); }}>
                    <i className="fa-solid fa-eye" style={{ color: '#0d2f62', fontSize: '0.9rem', marginRight: '5px' }}></i>
                    Ma&apos;lumotlar
                  </MenuItem>
                  <MenuItem sx={{
                    fontSize: '14px',
                    color: '#0d2f62',
                    display: user?.user?.role == 'casher' || user?.user?.role == 'super' ? 'block' : 'none'
                  }} onClick={() => { changeStudentPayMonth(); }}>
                    <i className="fa-solid fa-pen" style={{ color: '#0d2f62', fontSize: '0.9rem', marginRight: '5px' }}></i>
                    To&apos;lov summasini tahrirlash
                  </MenuItem>
                  {studentData.status == 'frozen' ? <MenuItem sx={{
                    fontSize: '14px',
                    color: '#0d2f62',
                    display: user?.user?.role == 'admin' || user?.user?.role == 'super' ? 'block' : 'none'
                  }} onClick={() => { openActivation(); }}>
                    <i className="fa-solid fa-lock-open" style={{ color: '#0d2f62', fontSize: '0.9rem', marginRight: '5px' }}></i>
                    Faollashtirish
                  </MenuItem> : <MenuItem sx={{
                    fontSize: '14px',
                    color: '#c20404',
                    display: user?.user?.role == 'admin' || user?.user?.role == 'super' ? 'block' : 'none'
                  }} onClick={() => { frezeModalFunOpen(); }}>
                    <i className="fa-solid fa-ban fa-rotate-90" style={{ color: '#c20404', fontSize: '0.9rem', marginRight: '5px' }}></i>
                    Muzlatish
                  </MenuItem>}
                  <MenuItem sx={{
                    fontSize: '14px',
                    color: '#c20404',
                    display: user?.user?.role == 'admin' || user?.user?.role == 'super' ? 'block' : 'none'
                  }} onClick={() => { openDeleteFun(); }}>
                    <i className="fa-solid fa-trash" style={{ color: '#c20404', fontSize: '0.9rem', marginRight: '5px' }}></i>
                    O&apos;chirish
                  </MenuItem>
                </Menu>
              </td>
            </tr>)}
            {e.attendansis?.data.length > 0 && <tr><DateList dates={e.attendansis?.data} /></tr>}
          </div>
        );
      }
    });
  }
  const studentDelete = (e) => {
    setLoderTime(true);
    const id = e;
    http
      .post(import.meta.env.VITE_API_URL + `api/student/delete/${id}`, {
        group_id: urlID[4],
        del_status: isCompletyDelete
      })
      .then(() => {
        setLoderTime(false);
        handleClose();
        updateFun();
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
  };

  const hedelSum = (e) => {
    setAllSumma(e.target.value);
    setErrorSum(false);
    setMessageLimit(false);
  };

  const changePayMethod = (e) => {
    setPayMethod(e.target.value);
  };

  const changeEdit = (event) => {
    setEditSumma(event.target.value);
  };

  const saleChangeFun = (value) => {
    setSaleInfo(value.target.value);
  };

  const closeAndSaveEdit = () => {
    setEditModal(false);
    setEditSumma('');
    setInLimitEditError(false);
  };

  const descriptionFun = (e) => {
    setDescription(e.target.value);
    if (e.target.value) {
      setStartDateError(false);
    } else {
      setStartDateError(true);
    }

  };

  const frezeStudentAdd = () => {
    if (frezeData && description) {
      setLoderTime(true);
      http
        .post(import.meta.env.VITE_API_URL + 'api/student/add-freeze', {
          student_id: frezeData.id,
          group_id: urlID[4],
          description: description,
          group_student_id: frezeData.group_student_id
        }).then(() => {
          setFrezeModal(false);
          setFrezeData(null);
          setStartDateError(false);
          setDescription('');
          setLoderTime(false);
          updateFun();
        }).catch((error) => {
          console.log(703, error);
        });
    } else {
      if (!description) {
        setStartDateError(true);
      } else {
        setStartDateError(false);
      }
    }
  };

  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed, so we add 1 and pad with leading zero if needed.
  const day = String(today.getDate()).padStart(2, '0');

  const formattedDate = `${year}-${month}-${day}`;


  const handleActivationClose = () => {
    setActivationModal(false);
  };

  const activateStudentFun = (e) => {
    handleActivationClose();
    setLoderTime(true);
    http
      .post(import.meta.env.VITE_API_URL + 'api/student/delete-freeze', {
        student_id: e.id,
        group_id: urlID[4],
        group_student_id: e.group_student_id
      }).then(() => {
        setLoderTime(false);
        updateFun();
      }).catch((error) => {
        console.log(703, error);
      });
  };


  return (
    <div>
      <Loder stop={loderTime} />
      <Table>
        <thead>
          <div className="statusesPart">
            <div className="child">
              <div className="colorsCame"></div>
              <p>Bor</p>
            </div>
            <div className="child">
              <div className="colorsNotCame"></div>
              <p>Yo&apos;q</p>
            </div>
            <div className="child">
              <div className="colorsLate"></div>
              <p>Kech keldi</p>
            </div>
            <div className="child">
              <div className="colorsFrozen"></div>
              <p>Muzlatilgan</p>
            </div>
          </div>
          <TableHeader>
            <th className="number">
              <p>T/r</p>
            </th>
            <th className="name" style={{
              width: user?.user?.role == 'admin' ? '29%' :
                user?.user?.role == 'super' || user?.user?.role == 'casher' ? '23%' : '29%'
            }}>
              <p>Ismi familyasi</p>
            </th>
            <th className="phone">
              <p>Telefon</p>
            </th>
            <th className="status">
              <p>Holati</p>
            </th>
            <th className="month_summa">
              <p>Oylik to&apos;lov summasi</p>
            </th>
            <th className="pay" style={{ display: user?.user?.role == 'casher' || user?.user?.role == 'super' ? 'block' : 'none' }}>
              <p>Oxirgi to&apos;lov</p>
            </th>
            <th className="paidAdd" style={{ display: user?.user?.role == 'casher' || user?.user?.role == 'super' ? 'block' : 'none' }}>
              <p>To&apos;lov qilish</p>
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
              <button className="close_modal_btn" onClick={() => handleClose()}>
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
                Ushbu {studentData.name}ni o&apos;chirish yoki guruhdan chiqarish
              </p>
            </div>
            <FormControlLabel sx={{ marginLeft: '1px' }} control={<Checkbox value={isCompletyDelete} onChange={(e) => setIsCompletyDelete(e.target.checked)} />} label="Ushbu o'quvchini butunlay o'chirish" />
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
                  deleteId ? studentDelete(deleteId) : console.log('error')
                }
              >
                {isCompletyDelete ? 'O\'chirish' : 'Guruhdan chiqarish'}
              </Button>
            </div>
          </AllGroupsDeleteModal>
        </Modal>
        <Modal
          open={activationModal}
          onClose={handleActivationClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <AllGroupsDeleteModal>
            <div className="close_modal">
              <button className="close_modal_btn" onClick={() => handleActivationClose()}>
                <CloseIcon />
              </button>
            </div>
            <div className="activate_icon_div">
              <div className="delete_icon">
                <img src="/images/question.png" alt="" />
              </div>
            </div>
            <div className="allGroups_delete_notification_part">
              <p>
                {/* Rostdan ham ushbu {studentName?.name.length > 40 ? `${studentName?.name.slice(0, 40)}...` : studentName?.name} ni o&apos;chirmoqchimisiz? */}
                Rostdan ham ushbu {studentName?.name}ni faollashtirmoqchimisiz ?
              </p>
            </div>
            <div className="allGroups_delete_modal_part">
              <Button
                className="delete_modal_btn_error"
                variant="contained"
                onClick={handleActivationClose}
              >
                Bekor qilish
              </Button>
              <Button
                className="buy_btn_modal"
                variant="contained"
                onClick={() =>
                  activateStudentFun(studentName)
                }
              >
                Faollashtirish
              </Button>
            </div>
          </AllGroupsDeleteModal>
        </Modal>

        <Modal open={frezeModal}
          onClose={frezeModalFunColse}
        >
          <Box sx={styleEdit}>
            <CloseIcon
              style={{
                position: 'absolute',
                right: '2%',
                top: '3%',
                cursor: 'pointer',
              }}
              onClick={frezeModalFunColse}
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
                padding: '20px 20px 20px 30px',
                top: 0,
                background: '#FDC600',
              }}
            >

              <h2 style={wordLimit}>{frezeData && frezeData.name}</h2>

              <p style={{ marginTop: '5px' }}>Ushbu o&apos;quvchini muzlatib qo&apos;yish </p>
            </div>
            <Box
              sx={{ width: '100%', marginTop: '75px', display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              <h3>{formattedDate}</h3>
              <Textarea value={description} onChange={descriptionFun} placeholder='Izoh kiriting' name="" id="" cols="40" rows="6">

              </Textarea>

            </Box>

            <p
              style={{
                display: startDateError ? 'block' : 'none',
                marginTop: '3px',
                marginLeft: '14px',
                fontSize: ' 0.75rem',
                color: ' #d32f2f',
                fontFamily: 'sans-serif',
                fontWeight: '400',
                lineHeight: '1.66',
                letterSpacing: '0.03333em',
              }}>Iltimos izoh kirting</p>

            <Button
              sx={{ mt: 3, pt: 1, pb: 1 }}
              fullWidth
              className="buy_btn_modal"
              variant="contained"
              onClick={() => frezeStudentAdd()}
            >
              Saqlash
            </Button>
          </Box>
        </Modal>
        <Modal open={editModal}>
          <Box sx={styleEdit}>
            <CloseIcon
              style={{
                position: 'absolute',
                right: '2%',
                top: '3%',
                cursor: 'pointer',
              }}
              onClick={closeAndSaveEdit}
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
                padding: '20px 20px 20px 30px',
                top: 0,
                background: '#FDC600',
              }}
            >
              <h2 style={wordLimit}>{studentData.name}</h2>
              <p style={{ marginTop: '5px' }}>To&apos;lov summasini o&apos;zgartirish</p>
            </div>

            <Box sx={{ width: '100%', mt: 11 }}>
              <NumericInput
                fullWidth
                precision={''}
                decimalChar=','
                thousandChar='.'
                label="To&apos;lov summasi"
                value={editSumma}
                onChange={changeEdit}
                variant='outlined'
                inputProps={{
                  maxLength: 8,
                  minLength: 0
                }}
              />
            </Box>
            <p
              style={{
                display: inLimitEditError ? 'block' : 'none',
                marginTop: '3px',
                marginLeft: '14px',
                fontSize: ' 0.75rem',
                color: ' #d32f2f',
                fontFamily: 'sans-serif',
                fontWeight: '400',
                lineHeight: '1.66',
                letterSpacing: '0.03333em',
              }}>Summani kirting</p>
            <Button
              sx={{ mt: 3, pt: 1, pb: 1 }}
              fullWidth
              className="buy_btn_modal"
              variant="contained"
              onClick={editSummaFun}
            >
              Saqlash
            </Button>
          </Box>
        </Modal>
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
              <h2 style={wordLimit}>{studentData.name} </h2>
              <p style={{ marginTop: '0.5rem' }}>
                Ushbu o&apos;quvchiga to&apos;lov qilish
              </p>
            </div>
            <NumericInput
              sx={{ pb: 3, mt: 12 }}
              fullWidth
              precision={''}
              decimalChar=","
              thousandChar="."
              label="Summani kiriting"
              value={allSumma}
              onChange={hedelSum}
              variant="outlined"
              inputProps={{
                maxLength: 8,
                minLength: 0,
              }}
              color={messageLimit ? 'error' : 'info'}
              helperText={errorSum ? 'Summa kiritilmadi' : null}
              FormHelperTextProps={{ style: { color: '#d32f2f' } }}
            />
            <br />
            <NumericInput
              fullWidth
              sx={{ mb: 3 }}
              precision={''}
              decimalChar=","
              thousandChar="."
              inputProps={{
                maxLength: 8,
                minLength: 0,
              }}
              label="Chegirma summasi"
              value={saleInfo}
              onChange={(e) => saleChangeFun(e)}
            />
            <br />
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
        <Modal open={limitOpen}>
          <Box sx={styleLimit}>
            <p style={{ fontWeight: 'bold', color: '#FDC600' }}>
              Siz to&apos;layotgan summa to&apos;lanishi kerak bo&apos;lgan
              summadan yuqori
            </p>
            <p style={{ fontWeight: 'bold', marginTop: '1rem' }}>
              Shunda ham davom etishni istaysizmi ?
            </p>
            <div
              style={{
                paddingTop: '2rem',
                display: 'flex',
                justifyContent: 'end',
              }}
            >
              <Button variant="contained" color="error" onClick={limitNow}>
                Yo&apos;q
              </Button>
              <Button
                style={{ background: '#042954', marginLeft: '1rem' }}
                variant="contained"
                onClick={limitYes}
              >
                Ha
              </Button>
            </div>
          </Box>
        </Modal>
        <Section>{data}</Section>
      </Table>
    </div>
  );
};

Tables.propTypes = {
  inChecked: PropTypes.func.isRequired,
  inCheckedTrue: PropTypes.array.isRequired,
  getData: PropTypes.array.isRequired,
  updateFun: PropTypes.func.isRequired,
  handleGroupAddStudentFun: PropTypes.func.isRequired,
  setGroupNameApp: PropTypes.func.isRequired,
};


export default Tables;
