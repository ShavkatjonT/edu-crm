import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../index';
import http from '../../http/index';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';
import Skeleton from '@mui/material/Skeleton';
import { Modal, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';
import { DatePicker } from 'antd';
import Snackbar from '../Snackbar/Snackbar';

const Content = styled.div`
  margin-top: 6rem;
  width: 100%;
  padding: 0px 20px;
  @media screen and (max-width: 370px){
        padding: 0px;
    }
`;

const ContentSkeleton = styled.div`
  padding-top: 2rem;
  padding-left: 2rem;
  padding-right: 2rem;
  padding-bottom: 2rem;
  background-color: white;
  border-radius: 6px;
  cursor: wait;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.25);
`;

const Container = styled.div`
  padding-top: 10px;
  padding-bottom: 10px;
  padding-bottom: 10px;
  background-color: white;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.25);
  border-radius: 6px;
  .statusesPart{
    display: flex;
    gap: 15px;
    font-size: 13.5px;
    color: rgb(4, 41, 84);
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
  .addTeacher {
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

const SectionOne = styled.div``;

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
    align-items: center;
    justify-content: space-between;
    font-size: 15px;
    padding-top: 5px;
    padding-bottom: 15px;
    border-bottom: 2px dashed #bdbdbd;
    .studentName {
      color: #605757;
      font-weight: 600;
    }
    .studentStatus {
      color: black;
      font-size: 14px;
      text-decoration: underline;
      border: none;
      background: initial;
      cursor: pointer;
      &:disabled{
        color: #939393;
        cursor: not-allowed;
      }
    }
  }
`;

const StudentsPart = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  .studentBlock {
    padding: 15px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    .studentNamePart {
      border: 1px solid #ddd;
      padding: 10px 20px;
      width: 100%;
      border-radius: 2px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      i{
        cursor: pointer;
      }
      p {
        color: rgb(4, 41, 84);
        font-size: 15px;
        font-weight: 600;
      }
    }
    .dateBlock {
      display: flex;
      gap: 4px;
      width: 99%;
      border: 1px solid #ddd;
      padding: 6px;
      border-radius: 2px;
      align-items: center;
      .datesPart {
        display: grid;
        width: 92%;
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
  }
`;

const CabinetGroup = () => {
    const navigate = useNavigate();
    const urlID = window.location.href.split('/');
    const { user } = useContext(Context);
    const [dataGet, setDataGet] = useState([]);
    const [itemsPerBlock, setItemsPerBlock] = useState(0);
    const [skeletonTime, setSkeletonTime] = useState(true);
    const [receiveModal, setReceiveModal] = useState(false);
    const [disabledAttendance, setDisabledAttendance] = useState(false);
    const [dataUpdate, setDataUpdate] = useState(false);
    const [receiveDate, setReceiveDate] = useState(null);
    const [getStudentData, setGetStudentData] = useState([]);
    const [studentList, setStudentList] = useState([]);
    const [studentTable, setStudentTable] = useState([]);
    const [todayLesson, setTodayLesson] = useState(false);
    const [errorTodayLesson, setErrorTodayLesson] = useState(false);

    useEffect(() => {
        http
            .get(import.meta.env.VITE_API_URL + `api/group/get/one/${urlID[4]}`)
            .then((r) => {
                setDataGet(r.data);
                setSkeletonTime(false);
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
        http
            .post(import.meta.env.VITE_API_URL + 'api/group/in-lesson', {
                id: urlID[4]
            })
            .then((r) => {
                setTodayLesson(r.data?.lesson);
                setSkeletonTime(false);
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
        http
            .post(import.meta.env.VITE_API_URL + 'api/group/attendansi-all-data', {
                group_id: urlID[4],
            })
            .then((r) => {
                console.log(158, r.data);
                setStudentTable(r.data.studentResult);
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
    useEffect(() => {
        if (dataUpdate) {
            http
                .get(import.meta.env.VITE_API_URL + `api/group/get/one/${urlID[4]}`)
                .then((r) => {
                    setDataGet(r.data);
                    setSkeletonTime(false);
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
            http
                .post(import.meta.env.VITE_API_URL + 'api/group/in-lesson', {
                    id: urlID[4]
                })
                .then((r) => {
                    setTodayLesson(r.data?.lesson);
                    setSkeletonTime(false);
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
            http
                .post(import.meta.env.VITE_API_URL + 'api/group/attendansi-all-data', {
                    group_id: urlID[4],
                })
                .then((r) => {
                    console.log(158, r.data);
                    setStudentTable(r.data.studentResult);
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
        }
    }, [dataUpdate]);

    const openReceiveModal = () => {
        if (todayLesson) {
            const today = new Date();
            setReceiveDate(dayjs(today));
            setStudentList(getStudentData);
            setReceiveModal(true);
        } else {
            setErrorTodayLesson(true);
        }
    };
    const closeReceiveModal = () => {
        setReceiveModal(false);
    };

    const handleReceiveDateChange = (date) => {
        setReceiveDate(date);
    };

    const toggleStatus = (id) => {
        setStudentList((prevStudents) =>
            prevStudents.map((student) => {
                if (student.id === id) {
                    // Toggle the status
                    return {
                        ...student,
                        status: student.status === 'came' ? 'notCome' : 'came',
                    };
                }
                return student;
            })
        );
    };

    const attendanceFun = () => {
        if (disabledAttendance) {
            setReceiveModal(false);
            setSkeletonTime(true);
            const today = new Date();
            const filterDate = dayjs(today).format('YYYY-MM-DD');
            const studentsFilter =
                studentList &&
                studentList.map((e) => {
                    return {
                        id: e.id,
                        status: e.status,
                        group_student_status: e.groupStudentStatus
                    };
                });
            http
                .post(import.meta.env.VITE_API_URL + 'api/group/attendansi', {
                    group_id: urlID[4],
                    students: studentsFilter,
                    date: filterDate,
                })
                .then(() => {
                    setDataUpdate(true);
                })
                .catch((error) => {
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
    };


    const handleCloseBar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setErrorTodayLesson(false);
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
        }, [window.innerWidth]);

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
                        <div key={index} className="childDates"
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

    return (
        <Content>
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
                                <h2>{dataGet?.name}</h2>
                            </div>
                            <HeaderRight>
                                <SectionOne>
                                    <Tooltip
                                        title="Yo'qlama"
                                        arrow
                                        TransitionComponent={Fade}
                                        placement="top"
                                    >
                                        <button className="addTeacher" onClick={openReceiveModal}>
                                            <i className="fa-solid fa-list-check"></i>
                                        </button>
                                    </Tooltip>
                                </SectionOne>
                            </HeaderRight>
                        </Header>
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
                                        inputReadOnly={true}
                                        open={false}
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
                                    />
                                    <div className="students-list">
                                        {studentList &&
                                            studentList.length > 0 &&
                                            studentList.map((value) => (
                                                <div key={value.id} className="studentsTable">
                                                    <p className="studentName" style={{ color: value.groupStudentStatus == 'test' && '#fdc600' }}>{value.name}</p>
                                                    <button
                                                        disabled={value.status == 'it\'sLate' || value.status == 'frozen' ? true : false}
                                                        className="studentStatus"
                                                        onClick={() => toggleStatus(value.id)} // Toggle status on click
                                                    >
                                                        {value.status == 'came'
                                                            ? 'Bor'
                                                            : value.status == 'notCome'
                                                                ? 'Yo\'q'
                                                                : value.status == 'it\'sLate'
                                                                    ? 'Kech qoldi'
                                                                    : value.status == 'frozen'
                                                                        ? 'Muzlatilgan'
                                                                        : ''}
                                                    </button>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                                <Button
                                    sx={{ mt: 3, pt: 1, pb: 1 }}
                                    fullWidth
                                    disabled={!disabledAttendance}
                                    className="buy_btn_modal"
                                    variant="contained"
                                    onClick={attendanceFun}
                                >
                                    Saqlash
                                </Button>
                            </ReceiveModal>
                        </Modal>
                        <StudentsPart>
                            {studentTable &&
                                studentTable.length > 0 &&
                                studentTable.map((value) => (
                                    <div key={value.id} className="studentBlock">
                                        <div className="studentNamePart">
                                            <p>{value.firstname + ' ' + value.lastname}</p>
                                            <Tooltip arrow title='Ma&apos;lumotlar' placement='top'>
                                                <i
                                                    className="fa-solid fa-eye"
                                                    style={{ color: '#0d2f62', fontSize: '0.9rem', marginRight: '5px' }}
                                                    onClick={() => navigate(`/cabinet-group-student/${value.id}`)}></i>
                                            </Tooltip>
                                        </div>
                                        {value?.data.length > 0 && <DateList dates={value.data} />}
                                    </div>
                                ))}
                        </StudentsPart>
                    </Container>
                    <Snackbar
                        open={errorTodayLesson}
                        onClose={handleCloseBar}
                        severity={'error'}
                        massage={'Ushbu guruhga bugun dars mavjud emas'}
                    />
                </div>
            )}
        </Content>
    );
};
export default CabinetGroup;
