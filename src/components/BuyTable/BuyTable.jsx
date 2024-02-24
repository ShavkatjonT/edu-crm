import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import http from '../../http/index';
import { Link } from 'react-router-dom';
import Loder from '../loder/Loder';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import NumericInput from 'material-ui-numeric-input';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../index';
import Collapse from '@mui/material/Collapse';
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';
import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import TableHead from '@mui/material/TableHead';
import Table from '@mui/material/Table';
import Skeleton from '@mui/material/Skeleton';
import TableBody from '@mui/material/TableBody';
import Box from '@mui/material/Box';
import { ExportToExcel } from '../../Excelexport';
// import { DatePicker, Space } from '@arco-design/web-react';
// import { IconInfoCircle } from '@arco-design/web-react/icon';
import '@arco-design/web-react/dist/css/arco.css';
// import enUS from '@arco-design/web-react/es/locale/en-US';
// import { ConfigProvider } from '@arco-design/web-react';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
// import _ from 'lodash';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { FormHelperText, TextField } from '@mui/material';
import dayjs from 'dayjs';
import { DatePicker as DatePickerExcel } from 'antd';

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
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    padding: 10px 20px;
    margin-bottom: 15px;
    border-bottom: 2px dashed gray;
  }
`;
const Header = styled.div`
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
  justify-content: end;
  width: 50%;
  .excelExportBtn{
    border: none;
    background-color: #037903;
    color: #fff;
    width: 90px;
    padding: 6px 2px;
    font-size: 1rem;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.5s;
    i {
      margin-right:8px;
    };

    &:hover{
      background-color: #0bc90b;
    }
  }
  a {
    color: #00c335;
    cursor: pointer;
    font-size: 1.2rem;
    transition: all 0.8s;
    transform: rotateZ(20deg);
    &:hover {
      color: #229e43;
      transform: rotateZ(200deg);
    }
  }
`;

const TableContent = styled.table`
  border-collapse: collapse;
  width: 100%;
  border: 1px solid #efefef;
  color: #7d7d7d;
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
`;

const TableHeader = styled.tr`
  width: 100%;
  display: flex;
  border-bottom: 1px solid #cdcdcd;
  padding-bottom: 0.5rem;
  .number {
    width: 7%;
    text-align: left;
  }
  .name {
    width: 24.5%;
    text-align: left;
  }
  .phone {
    width: 23%;
    text-align: left;
  }
  .pay {
    width: 19%;
    text-align: left;
  }
  .type {
    width: 18%;
    text-align: center;
  }
  .paidAdd {
    width: 12%;
    text-align: right;
  }
  .action {
    width: 8%;
    text-align: center;
  }
`;

const Section = styled.div`
  width: 100%;
  color: #7d7d7d;
  table {
    border: none;
    border-collapse: collapse;
    width: 100%;
    tr {
      border: none;
      border-collapse: collapse;
      height: 50px;
      background-color: #fff;
      &:nth-child(even) {
        background-color: #f8f8f8;
      }
    }
    p {
      padding-top: 0.5%;
      padding-bottom: 0.5%;
    }

    .buyInformationLists {
      width: 100%;
      padding-top: 1%;
      height: 3rem;
      display: flex;
      align-items: center;
      font-size: 1rem;
      font-weight: bold;
      color: #484747;
      .groupNameDiv {
        width: 26.6%;
        display: flex;
      }
      .fullNameDiv {
        width: 24.5%;
      }
      .givensSummaDiv {
        width: 20.2%;
      }
      .pay_type{
        width: 20.2%;
        text-align: center;
      }
      .actionDiv {
        width: 8%;
        display: flex;
        justify-content: center;
        gap: 11px;
      }
    }

    .eye {
    background-color: initial;
    color: #313131;
    border: none;
    font-size: 0.91rem;
    cursor: pointer;
    transition: all 0.5;
  }
    .edit {
      background-color: initial;
      i {
        color: #585353;
      }
      border: none;
      font-size: 1rem;
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
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s;
      &:hover {
        color: #ff0808;
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

const ModalBuyUpdate = styled.div`
  width: 400px;
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
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  padding-bottom: 1.5rem;
  -webkit-box-shadow: -1px 12px 8px 0px rgba(34, 60, 80, 0.2);
  -moz-box-shadow: -1px 12px 8px 0px rgba(34, 60, 80, 0.2);
  box-shadow: -1px 12px 8px 0px rgba(34, 60, 80, 0.2);
  .updateModalHeader {
    position: absolute;
    top: 0;
    left: 0;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    width: 100%;
    padding-right: 0.5rem;
    padding-top: 0.7rem;
    padding-left: 1rem;
    background-color: #fdc600;
    height: 5rem;
    /* z-index: 1; */
    .updateModalHeaderName {
      margin-bottom: 0.4rem;
      font-family: sans-serif;
      color: #191919;
    }
  }
  .close_modal_btn {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    border: none;
    background-color: initial;
    font-size: 1.3rem;
    cursor: pointer;
    color: #272727;
    font-weight: 600;
    transition: all 0.5s;
    &:hover {
      color: #3a3939;
    }
  }
  .updateModalContent {
    margin-top: 2rem;
  }
`;
const PaginationSection = styled.div`
  margin-top: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
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

function BuyTable() {
  const navigate = useNavigate();
  const { user } = useContext(Context);
  const [loderTime, setLoderTime] = useState(false);
  const [getPayment, setGetPayment] = useState([]);
  const [deleteId, setDeleteId] = useState('');
  const [deleteName, setDeleteName] = useState([]);
  const [open, setOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [saleInfo, setSaleInfo] = useState(0);
  const [buySumma, setBuySumma] = useState(0);
  const [openAccordion, setOpenAccordion] = useState(-1);
  const [locateTime, setLocateTime] = useState();
  const [studentId, setStudentId] = useState('');
  const [groupId, setGroupId] = useState('');
  const [errorSum, setErrorSum] = useState(false);
  const [dataUpdate, setDataUpdate] = useState(false);
  const [skeletonTime, setSkeletonTime] = useState(true);
  const [size, setSize] = useState(10);
  const [allPage, setAllPage] = useState(1);
  const [page, setPage] = useState(1);
  const [nameSearchValue, setNameSearchValue] = useState('');
  const [nameLastSearchValue, setNameLastSearchValue] = useState('');
  const [groupSearchValue, setGroupSearchValue] = useState('');
  const [searchPayType, setSearchPayType] = useState('');
  const [dateSearchValue, setDateSearchValue] = useState(null);
  const [filterDateSearchValue, setFilterDateSearchValue] = useState('');
  const [dateEndSearchValue, setDateEndSearchValue] = useState(null);
  const [filterDateEndSearchValue, setFilterDateEndSearchValue] = useState('');
  const [startFilterDateValue, setStartFilterDateValue] = useState('');
  const [endFilterDateValue, setEndFilterDateValue] = useState('');
  const [payMethod, setPayMethod] = useState('');
  const [errorPayMethod, setErrorPayMethod] = useState(false);
  // const [errorDate, setErrorDate] = useState(false);
  const [selectedStartDateExcel, setSelectedStartDateExcel] = useState(null);
  const [selectedStartDateExcelFilter, setSelectedStartDateExcelFilter] = useState(null);
  const [selectedEndDateExcel, setSelectedEndDateExcel] = useState(null);
  const [selectedEndDateExcelFilter, setSelectedEndDateExcelFilter] = useState(null);
  const [openExcelExportModal, setOpenExcelExportModal] = useState(false);
  const [falseExcelDate, setFalseExcelDate] = useState(false);

  useEffect(() => {
    http
      .post(import.meta.env.VITE_API_URL + 'api/payment/data', {
        size: 10,
        page: 1,
        firstname: nameSearchValue,
        lastname: nameLastSearchValue,
        group_name: groupSearchValue,
        start_date: filterDateSearchValue,
        end_date: filterDateEndSearchValue,
        st_sum: startFilterDateValue,
        en_sum: endFilterDateValue,
        payment_type: searchPayType,
      })
      .then((res) => {
        setAllPage(res.data.allPage);
        setGetPayment(res.data.data);
        setSize(res.data.size);
        setLoderTime(false);
        setPage(res.data.page);
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
        .post(import.meta.env.VITE_API_URL + 'api/payment/data', {
          size: size,
          page: page,
          firstname: nameSearchValue,
          lastname: nameLastSearchValue,
          group_name: groupSearchValue,
          start_date: filterDateSearchValue,
          end_date: filterDateEndSearchValue,
          st_sum: startFilterDateValue,
          en_sum: endFilterDateValue,
          payment_type: searchPayType,
        })
        .then((res) => {
          setAllPage(res.data.allPage);
          setGetPayment(res.data.data);
          setLoderTime(false);
          setSize(res.data.size);
          setPage(res.data.page);
          setSkeletonTime(false);
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
  }, [dataUpdate, size, page]);

  useEffect(() => {
    http
      .post(import.meta.env.VITE_API_URL + 'api/payment/data', {
        size: size,
        page: 1,
        firstname: nameSearchValue,
        lastname: nameLastSearchValue,
        group_name: groupSearchValue,
        start_date: filterDateSearchValue,
        end_date: filterDateEndSearchValue,
        st_sum: startFilterDateValue,
        en_sum: endFilterDateValue,
        payment_type: searchPayType,
      })
      .then((res) => {
        setAllPage(res.data.allPage);
        setGetPayment(res.data.data);
        setSize(res.data.size);
        setPage(res.data.page);
        setLoderTime(false);
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
  }, [nameSearchValue, nameLastSearchValue, groupSearchValue, filterDateSearchValue, filterDateEndSearchValue, startFilterDateValue, endFilterDateValue, searchPayType]);


  let buyInformation;

  const deleteFunction = () => {
    setOpen(true);
    setDeleteName(getPayment);
  };

  const updateModal = () => {
    setUpdateModalOpen(true);
    setDeleteName(getPayment);
  };

  const filterSumma = (arg) => {
    return `${arg.toLocaleString()} so'm`;
  };

  if (getPayment && getPayment.length > 0) {
    buyInformation = getPayment.map((e, index) => {
      return (
        <React.Fragment key={index}>
          <TableRow>
            <TableCell sx={{ borderBottom: 'none', width: '7%' }}>
              <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => {
                  setOpenAccordion(openAccordion === index ? -1 : index);
                  filterTime(e);
                }}
              >
                {openAccordion === index ? (
                  <KeyboardArrowUpIcon />
                ) : (
                  <KeyboardArrowDownIcon />
                )}
              </IconButton>
            </TableCell>
            <div className="buyInformationLists">
              <div className="groupNameDiv">
                <p>{e.group.name}</p>
              </div>
              <div className="fullNameDiv">
                <p>{e.student.lastname + ' ' + e.student.firstname}</p>
              </div>
              <div className="givensSummaDiv">
                <p>{filterSumma(e.summa)}</p>
              </div>
              <div className="pay_type">
                <p>{e.payment_type == 'cash' ? 'Naqd pul orqali' :
                  e.payment_type == 'Payme' ? 'Payme' :
                    e.payment_type == 'Click' ? 'Click' :
                      e.payment_type == 'Uzumpay' ? 'Uzumpay' :
                        e.payment_type == 'Zoomrad' ? 'Zoomrad' :
                          e.payment_type == 'Paynet' ? 'Paynet' :
                            e.payment_type == 'Oson' ? 'Oson' :
                              e.payment_type == 'AlifMobi' ? 'AlifMobi' :
                                e.payment_type == 'Anorbank' ? 'Anorbank' :
                                  e.payment_type == 'Beepul' ? 'Beepul' :
                                    e.payment_type == 'Davrmobile' ? 'Davrmobile' :
                                      e.payment_type == 'other' ? 'Boshqa yo\'l bilan' : 'Mavjud emas'
                }</p>
              </div>
              <div className="actionDiv">
                <Link to={`/student/${e.student.id}`} className='eye'>
                  <Tooltip
                    title="Ma'lumotlar"
                    arrow
                    TransitionComponent={Fade}
                    placement="top"
                  >
                    <i className='fa-solid fa-eye'></i>
                  </Tooltip>
                </Link>{' '}
                {e.deleteActive && (
                  <Tooltip
                    title="Tahrirlash"
                    arrow
                    TransitionComponent={Fade}
                    placement="top"
                  >
                    <button
                      className="edit"
                      id={e.id}
                      onClick={(elements) => {
                        updateModal(elements);
                        setDeleteId(e.id);
                        setBuySumma(e.summa);
                        setPayMethod(e.payment_type);
                        setSaleInfo(e.sale);
                        setStudentId(e.student.id);
                        setGroupId(e.group.id);
                      }}
                    >
                      <i className="fa-solid fa-pen"></i>
                    </button>
                  </Tooltip>
                )}
                {e.deleteActive && (
                  <Tooltip
                    title="O'chirish"
                    arrow
                    TransitionComponent={Fade}
                    placement="top"
                  >
                    <button
                      className="delete"
                      id={e.id}
                      onClick={(elements) => {
                        deleteFunction(elements);
                        setDeleteId(e.id);
                      }}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </Tooltip>
                )}
              </div>
            </div>
          </TableRow>
          <TableCell
            style={{ paddingBottom: 0, paddingTop: 0, background: 'white' }}
            colSpan={6}
          >
            <Collapse in={openAccordion === index} timeout="auto" unmountOnExit>
              <Box sx={{ marginTop: 1, marginBottom: 1 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow component={'tr'}>
                      <TableCell
                        sx={{
                          pl: 18,
                          fontWeight: 'bold',
                          background: '#F8F8F8',
                        }}
                      >
                        To&apos;lov qilingan sana{' '}
                      </TableCell>
                      {/* <TableCell
                        sx={{
                          pr: 10,
                          fontWeight: 'bold',
                          background: '#F8F8F8',
                        }}
                      >
                        To&apos;lov qilingan oy
                      </TableCell> */}
                      <TableCell
                        sx={{
                          pr: 18,
                          fontWeight: 'bold',
                          background: '#F8F8F8',
                        }}
                      >
                        Chegirma
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell
                        sx={{
                          pl: 18,
                          borderBottom: 'none',
                          background: '#F8F8F8',
                        }}
                      >
                        {locateTime}
                      </TableCell>
                      {/* <TableCell
                        sx={{
                          pr: 10,
                          borderBottom: 'none',
                          background: '#F8F8F8',
                        }}
                      >
                        {e.month}
                      </TableCell> */}
                      <TableCell
                        sx={{
                          pr: 18,
                          borderBottom: 'none',
                          background: '#F8F8F8',
                        }}
                      >
                        {e.sale}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </React.Fragment>
      );
    });
  }

  const filterTime = (e) => {
    const timeDate = e.createdAt;
    const filterYear = timeDate.substring(0, 10);
    const filterLocalClock = timeDate.substring(19, 11);
    const time = String(Number(filterLocalClock.substring(0, 2)) + 5);
    const minuts = filterLocalClock.substring(2);
    setLocateTime(
      filterYear + ' ' + (Number(time) <= 9 ? '0' : '') + time + '' + minuts
    );
  };

  const handleClose = () => {
    setDeleteId('');
    setOpen(false);
  };

  const deleteFunAxisos = () => {
    if (deleteId) {
      setLoderTime(true);
      http
        .post(import.meta.env.VITE_API_URL + 'api/payment/delete', {
          id: deleteId,
        })
        .then(() => {
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
      handleClose();
    }
  };

  let name;
  if (deleteName) {
    name = deleteName.filter((e) => {
      const id = deleteId;
      return e.id == id;
    });
  }

  const updateModalClose = () => {
    setUpdateModalOpen(false);
    setBuySumma(0);
    setSaleInfo(0);
    setStudentId('');
    setGroupId('');
  };

  const buySumFun = (e) => {
    setBuySumma(e.target.value);
  };

  const saleChangeFun = (value) => {
    setSaleInfo(value.target.value);
  };

  const updateBuyFun = () => {
    if (buySumma && payMethod) {
      setLoderTime(true);
      setUpdateModalOpen(false);
      http
        .post(import.meta.env.VITE_API_URL + 'api/payment/put', {
          id: deleteId,
          student_id: studentId,
          group_id: groupId,
          given_summa: buySumma,
          sale: saleInfo,
          payment_type: payMethod
        })
        .then(() => {
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
      handleClose();
    } else {
      if (!buySumma) {
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

  const handleChange = (event) => {
    setSize(event.target.value);
    setDataUpdate(true);
  };

  const pagination = (e) => {
    setPage(e);
    setDataUpdate(true);
  };

  const changePayMethod = (e) => {
    setPayMethod(e.target.value);
  };

  const openExcelExportModalFun = () => {
    const currentDate = new Date();

    // Get the first day of the current month
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    // Get the last day of the current month
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    // Format the dates as 'YYYY-MM-DD' strings
    const formattedFirstDay = `${firstDay.getFullYear()}-${(firstDay.getMonth() + 1).toString().padStart(2, '0')}-01`;
    const formattedLastDay = `${lastDay.getFullYear()}-${(lastDay.getMonth() + 1).toString().padStart(2, '0')}-${lastDay.getDate()}`;
    setOpenExcelExportModal(true);
    setSelectedStartDateExcel(dayjs(formattedFirstDay));
    setSelectedEndDateExcel(dayjs(formattedLastDay));
    setSelectedStartDateExcelFilter(formattedFirstDay);
    setSelectedEndDateExcelFilter(formattedLastDay);
  };

  const closeAndSave = () => {
    setOpenExcelExportModal(false);
  };

  const handleChangeStartExcel = (date) => {
    setSelectedStartDateExcel(date);
    const selectedMonth = date ? dayjs(date).format('YYYY-MM-DD') : '';
    setSelectedStartDateExcelFilter(selectedMonth);
    setFalseExcelDate(false);
    if (selectedEndDateExcelFilter) {
      if (selectedMonth > selectedEndDateExcelFilter) {
        setSelectedStartDateExcel(null);
        setSelectedStartDateExcelFilter(null);
        setFalseExcelDate(true);
      }
    }
  };
  const handleChangeEndExcel = (date) => {
    setSelectedEndDateExcel(date);
    const selectedMonth = date ? dayjs(date).format('YYYY-MM-DD') : '';
    setSelectedEndDateExcelFilter(selectedMonth);
    setFalseExcelDate(false);
    if (selectedStartDateExcelFilter) {
      if (selectedMonth < selectedStartDateExcelFilter) {
        setSelectedEndDateExcel(null);
        setSelectedEndDateExcelFilter(null);
        setFalseExcelDate(true);
      }
    }
  };

  const changeSearchValue = (e) => {
    setNameSearchValue(e.target.value);
  };
  const changeSearchLastValue = (e) => {
    setNameLastSearchValue(e.target.value);
  };
  const changeGroupSearch = (e) => {
    setGroupSearchValue(e.target.value);
  };

  const changeDateSearch = (date) => {
    setDateSearchValue(date);
    const selectedMonth = date ? dayjs(date).format('YYYY-MM-DD') : '';
    setFilterDateSearchValue(selectedMonth);
  };
  const changeDateEndSearch = (date) => {
    setDateEndSearchValue(date);
    const selectedMonth = date ? dayjs(date).format('YYYY-MM-DD') : '';
    setFilterDateEndSearchValue(selectedMonth);
  };
  const changeStartDateValue = (e) => {
    setStartFilterDateValue(e.target.value);
  };

  const changeEndDateValue = (e) => {
    setEndFilterDateValue(e.target.value);
  };

  const changeSearchPayMethod = (e) => {
    setSearchPayType(e.target.value);
  };

  return (
    <div>
      <Loder stop={loderTime} />
      {skeletonTime ? (
        <ContentSkeleton>
          <Box sx={{ width: '100%' }}>
            <Skeleton width="30%" height="2rem" />
            <Skeleton width="50%" height="2rem" />
            <Skeleton width="60%" height="2rem" />
            <Skeleton width="85%" height="2rem" />
            <Skeleton width="100%" height="2rem" />
          </Box>
        </ContentSkeleton>
      ) : (
        <div>
          <Container>
            <Header>
              <div>
                <h2>To&apos;lovlar</h2>
              </div>
              <HeaderRight>
                <button className='excelExportBtn' onClick={openExcelExportModalFun}>
                  <i className="fa-regular fa-file-excel"></i> Excel
                </button>
                <Box sx={{ minWidth: 115, ml: 2 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="demo-simple-select-label">
                      Malumotlar soni
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={size}
                      label="Jadvalni miqdorini tanlang"
                      onChange={handleChange}
                    >
                      <MenuItem value={10}>10</MenuItem>
                      <MenuItem value={25}>25</MenuItem>
                      <MenuItem value={50}>50</MenuItem>
                      <MenuItem value={75}>75</MenuItem>
                      <MenuItem value={100}>100</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </HeaderRight>
            </Header>

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
                    name.map((e) => (
                      <p key={e.student.id}>
                        Rostdan ham ushbu{' '}
                        {e.student.lastname + ' ' + e.student.firstname}
                        ning to&apos;lov haqidagi ma&apos;lumotlarini
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
                    onClick={deleteFunAxisos}
                    variant="contained"
                    color="error"
                  >
                    O&apos;chirish
                  </Button>
                </div>
              </AllGroupsDeleteModal>
            </Modal>
            <Modal
              open={updateModalOpen}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <ModalBuyUpdate>
                <div className="updateModalHeader">
                  <button
                    className="close_modal_btn"
                    onClick={() => updateModalClose()}
                  >
                    <CloseIcon />
                  </button>
                  {name &&
                    name.map((e) => (
                      <h2 className="updateModalHeaderName" key={e.student.id}>
                        {e.student.lastname + ' ' + e.student.firstname}
                      </h2>
                    ))}
                  <p>To&apos;lov ma&apos;lumotlarini o&apos;zgartirish</p>
                </div>
                <div className="updateModalContent">
                  <NumericInput
                    sx={{ pb: 3, mt: 12 }}
                    fullWidth
                    precision={''}
                    decimalChar=","
                    thousandChar="."
                    label="To'langan summa"
                    value={buySumma}
                    onChange={buySumFun}
                    variant="outlined"
                    inputProps={{
                      maxLength: 8,
                      minLength: 0,
                    }}
                    // color={messageLimit ? 'error' : 'info'}
                    helperText={errorSum ? 'Summa kiritilmadi' : null}
                    FormHelperTextProps={{ style: { color: '#d32f2f' } }}
                  />
                  <NumericInput
                    sx={{ mb: 3 }}
                    fullWidth
                    precision={''}
                    decimalChar=","
                    thousandChar="."
                    inputProps={{
                      maxLength: 8,
                      minLength: 0,
                    }}
                    label="Chegirma"
                    value={saleInfo}
                    onChange={(e) => saleChangeFun(e)}
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
                    onClick={updateBuyFun}
                  >
                    Saqlash
                  </Button>
                </div>
              </ModalBuyUpdate>
            </Modal>
            <Modal open={openExcelExportModal} style={{ zIndex: 600 }}>
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
                    paddingTop: '20px',
                    paddingBottom: '20px',
                    paddingLeft: '30px',
                    top: 0,
                    background: '#FDC600',
                  }}
                >
                  <h2>Chop etish</h2>
                  <p style={{ marginTop: '0.5rem' }}>
                    To&apos;lov ma&apos;lumotlarini excelga chop etish
                  </p>
                </div>
                <div style={{ marginTop: '83px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <p style={{ fontWeight: '600', marginBottom: '10px', color: 'rgb(4,41,84)' }}>Boshlanish sanasi</p>
                    <DatePickerExcel
                      value={selectedStartDateExcel}
                      onChange={handleChangeStartExcel}
                      placeholder="Boshlanish sanasi"
                      placement='bottomRight'
                      format="YYYY MM DD"
                      allowClear={false}
                      style={{
                        width: '100%',
                        height: '55px',
                        border: '1.9px solid #C4C4C4',
                        borderRadius: '4px',
                        color: '#6E6E6E',
                        fontSize: '17px',
                      }}
                    />
                  </div>
                  <div>
                    <p style={{ fontWeight: '600', marginBottom: '10px', color: 'rgb(4,41,84)' }}>Tugash sanasi</p>
                    <DatePickerExcel
                      value={selectedEndDateExcel}
                      onChange={handleChangeEndExcel}
                      placeholder="Tugash sanasi"
                      placement='bottomLeft'
                      format="YYYY MM DD"
                      allowClear={false}
                      style={{
                        width: '100%',
                        height: '55px',
                        border: '1.9px solid #C4C4C4',
                        borderRadius: '4px',
                        color: '#6E6E6E',
                        fontSize: '17px',
                      }}
                    />
                    <p
                      style={{
                        display: falseExcelDate ? 'block' : 'none',
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
                      Iltimos sanalarni to&apos;g&apos;ri kiriting
                    </p>
                  </div>
                  <ExportToExcel
                    dateStart={selectedStartDateExcelFilter}
                    dateEnd={selectedEndDateExcelFilter}
                    apiData={getPayment && getPayment.excelData}
                    fileName={'To\'lov ma\'lumotlari'}
                    closeModal={closeAndSave}
                  />
                </div>
              </Box>
            </Modal>
            <p style={{ paddingLeft: '27px', color: 'gray', fontWeight: '600', fontSize: '15px' }}>Filter</p>
            <div className='filterPart'>
              <TextField size='small' sx={{ width: '180px' }} id="outlined-basic" value={nameSearchValue} onChange={changeSearchValue} label="Ismi bo'yicha qidirish" variant="outlined" />
              <TextField size='small' sx={{ width: '180px' }} id="outlined-basic" value={nameLastSearchValue} onChange={changeSearchLastValue} label="Familiya bo'yicha qidirish" variant="outlined" />
              <TextField size='small' sx={{ width: '220px' }} id="outlined-basic" value={groupSearchValue} onChange={changeGroupSearch} label="Guruhi bo'yicha qidirish" variant="outlined" />
              <DatePickerExcel
                value={dateSearchValue}
                onChange={changeDateSearch}
                placeholder="Sana (boshlanish)"
                format="YYYY MM DD"
                style={{
                  width: '180px',
                  height: '40px',
                  border: '1.9px solid #C4C4C4',
                  borderRadius: '4px',
                  color: '#6E6E6E',
                  fontSize: '17px',
                }}
              />
              <DatePickerExcel
                value={dateEndSearchValue}
                onChange={changeDateEndSearch}
                placeholder="Sana (tugash)"
                format="YYYY MM DD"
                style={{
                  width: '180px',
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
                label="Summa miqdori (oldin)"
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
                label="Summa miqdori (gacha)"
                value={endFilterDateValue}
                onChange={changeEndDateValue}
                variant="outlined"
                inputProps={{
                  maxLength: 8,
                  minLength: 0,
                }}
              />
              <FormControl size='small' style={{ width: '180px' }}>
                <InputLabel id='demo-simple-select-label'>
                  To&apos;lov usuli
                </InputLabel>
                <Select
                  labelId='demo-simple-select-label'
                  id='demo-simple-select'
                  value={searchPayType}
                  label="To'lov usuli"
                  onChange={changeSearchPayMethod}
                >
                  <MenuItem value={''}>Barchasi</MenuItem>
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
              </FormControl>
            </div>
            <TableContent>
              <thead>
                <TableHeader>
                  <th className="number">
                    <p></p>
                  </th>
                  <th className="name">
                    <p>Guruh nomi</p>
                  </th>
                  <th className="phone">
                    <p>O&apos;quvchi</p>
                  </th>
                  <th className="pay">
                    <p>To&apos;langan summa</p>
                  </th>
                  <th className="type">
                    <p>To&apos;lov usuli</p>
                  </th>
                  <th className="action">
                    <p>Amallar</p>
                  </th>
                </TableHeader>
              </thead>
            </TableContent>
            <Section>
              <table>
                <tbody>{buyInformation}</tbody>
              </table>
            </Section>

            <PaginationSection>
              <Stack spacing={3}>
                <Pagination
                  color="primary"
                  variant="outlined"
                  shape="rounded"
                  page={page}
                  onChange={(e, value) => pagination(value)}
                  count={allPage}
                />
              </Stack>
            </PaginationSection>
          </Container>
        </div>
      )}
    </div>
  );
}

export default BuyTable;
