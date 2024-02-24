import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import TextField from '@mui/material/TextField';
import AllStudentsTable from '../tables/AllStudentsTable';
import http from '../../http/index';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import Modal from '@mui/material/Modal';
import FormControl from '@mui/material/FormControl';
import Checkbox from '@mui/material/Checkbox';
import Select from '@mui/material/Select';
import Fade from '@mui/material/Fade';
import Tooltip from '@mui/material/Tooltip';
import Skeleton from '@mui/material/Skeleton';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../index';
import Snackbar from '../Snackbar/Snackbar';
import { ExportAllStudent } from '../../ExcelAllStudent';
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
  .topText{
    padding: 10px 20px;
    gap: 10px;
    display: flex;
    flex-direction: column;
    h2{
      color: rgb(4,41,84)
    }
    p{
      font-weight: 600;
      color: #726f6f;
      span{
        color: rgb(4,41,84)
      }
    }
  }
`;
const Header = styled.div`
  display: flex;
  align-items: center;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-right: 20px;
  padding-left: 10px;
  margin-bottom: 20px;
  justify-content: space-between;
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
const HeaderRight = styled.div`
  width: 55%;
  display: flex;
  justify-content: space-between;
  .input1 {
    border-radius: 25px;
    font-size: 0.99rem;
    width: 100%;
  }

  a {
    color: #00c335;
    cursor: pointer;
    font-size: 1.2rem;
    transition: all 0.8s;
    margin: 0 1rem;
    transform: rotateZ(20deg);
    &:hover {
      color: #229e43;
      transform: rotateZ(200deg);
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

const AllStudents = () => {
  const [age, setAge] = useState(10);
  const [pageSize, setPageSize] = useState(10);
  const [skeletonTime, setSkeletonTime] = useState(true);
  const navigate = useNavigate();
  const { user } = useContext(Context);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [searchData, setSearchData] = useState([]);
  const [searchDataIsTrue, setSearchDataIsTrue] = useState(false);
  const [list, setList] = useState([]);
  const [isCheck, setIsCheck] = useState([]);
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [errorListMessage, seterrorListMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [errorIsLimit, seterrorIsLimit] = useState(false);
  const [textAreaCount, setTextAreaCount] = useState('');
  const [textYes, setTextYes] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const [studentsCount, setStudentsCount] = useState('');


  useEffect(() => {
    if (!search || search.length < 3) {
      setSearchData([]);
    }
  }, [search]);

  useEffect(() => {
    setSearchValue('');
    setSearchData([]);
    setSearch('');
    setSearchDataIsTrue(false);
  }, [age]);


  useEffect(() => {
    http
      .get(import.meta.env.VITE_API_URL + 'api/student/list/get')
      .then((res) => {
        setSkeletonTime(false);
        setList(res.data.data);
        setStudentsCount(res.data.student_count);
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
    if (!search || search.length < 3) {
      setSearchDataIsTrue(false);
    }
  }, [search]);

  const searchFun = (e) => {
    setSearch(e.target.value);
    const { value } = e.target;
    if (value.length >= 3 && value) {
      http
        .get(
          import.meta.env.VITE_API_URL +
          `api/student/list/get/search/?text=${value}`
        )
        .then((res) => {
          if (res.data == 0) {
            setSearchDataIsTrue(true);
            setSearchData([]);
          } else {
            setSearchData(res.data);
            setSearchDataIsTrue(true);
          }


        })
        .catch((error) => {
          setSearchDataIsTrue(false);
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

  const handleChange = (event) => {
    setAge(event.target.value);
    setPageSize(Number(event.target.value));
  };

  const debounce = (func) => {
    let timer;
    return function (...args) {
      const context = this;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        func.apply(context, args);
      }, 150);
    };
  };
  const debouncedSearchFun = debounce(searchFun);
  const debouncedChangeHandler = (e) => {
    setSearchValue(e.target.value);
    debouncedSearchFun(e);
  };
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  let exelExportStudentData = [];
  if (list && list.length > 0) {
    exelExportStudentData = list && list.map((e, index) => {
      return {
        'T/r': index + 1,
        'Ism Familiya': e.firstname + ' ' + e.lastname,
        'Telefon raqami': e.Fphone,
        'Guruhi': e.groups?.name,
        'O\'quvchi sinfi': e.class ? e.class : '-',
      };
    });
  }

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
    console.log(235, isCheck);
  };

  const handleCloseBar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    seterrorListMessage(false);
  };

  const closeMessageModal = () => {
    setMessageOpen(false);
    setTextAreaCount('');
    setTextYes(false);
    seterrorIsLimit(false);
  };

  const enterOpenMessageModal = () => {
    if (isCheck.length > 0) {
      setMessageOpen(true);
    } else {
      seterrorListMessage(true);
      setSuccessMessage(false);
    }
  };

  const messSubmit = () => {
    if (textAreaCount && !/^\s*$/.test(textAreaCount) && isCheck && isCheck.length > 0) {
      if (textAreaCount.length >= 4) {
        setSkeletonTime(true);
        let messageTime = new Date();
        http
          .post(import.meta.env.VITE_API_URL + 'api/message/all/list', {
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


  return (
    <div>
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
          <Container>
            <div className='topText'>
              <h2>Umumiy o&apos;quvchilar</h2>
              <p>Barcha o&apos;quvchilar soni: <span>{studentsCount}</span></p>
            </div>
            <Header>
              <HeaderRight>
                <Checkbox
                  type={'checkbox'}
                  name="id"
                  checked={isCheck.length == list.length}
                  indeterminate={isCheck.length !== list.length}
                  onChange={handleSelectAll}
                />
                <TextField
                  className='input1'
                  label='Search'
                  id='outlined-size-small'
                  size='small'
                  type={'text'}
                  value={searchValue}
                  onChange={debouncedChangeHandler}
                />
              </HeaderRight>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '280px' }}>
                <Tooltip
                  title="Xabar yuborish"
                  arrow
                  TransitionComponent={Fade}
                  placement="top"
                >
                  <button
                    className="send_message_btn"
                    onClick={enterOpenMessageModal}
                  >
                    <i className="fa-regular fa-envelope"></i>
                  </button>
                </Tooltip>
                <ExportAllStudent
                  fileName="Barcha o'quvchilar"
                  apiData={exelExportStudentData ? exelExportStudentData : null}
                  groupData={'Barcha o\'quvchilar'}
                />
                <Box sx={{ minWidth: 115 }}>
                  <FormControl fullWidth size='small'>
                    <InputLabel id='demo-simple-select-label'>
                      Malumotlar soni
                    </InputLabel>
                    <Select
                      labelId='demo-simple-select-label'
                      id='demo-simple-select'
                      value={age}
                      label='Jadvalni miqdorini tanlang'
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
              </div>
            </Header>
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
            <AllStudentsTable
              pageSize={pageSize}
              age={age}
              searchData={searchData}
              searchText={search}
              searchIsTrue={searchDataIsTrue}
              inCheckedTrue={isCheck}
              inChecked={handleClick}

            />
            <Snackbar
              open={open}
              onClose={handleClose}
              severity={'error'}
              massage={'Bunday o\'quvchi topilmadi'}
            />
            <Snackbar
              open={errorListMessage}
              onClose={handleCloseBar}
              severity={successMessage ? 'success' : 'error'}
              massage={successMessage ? 'Xabar muvaffaqiyatli yuborildi' : 'Iltimos o\'quvchini tanlang'}
            />
          </Container>
        )
      }
    </div>
  );
};

export default AllStudents;
