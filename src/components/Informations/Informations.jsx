import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../index';
import http from '../../http/index';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, ComposedChart, Line } from 'recharts';
import { NumericFormat } from 'react-number-format';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { DatePicker as DatePickerExcel } from 'antd';
import Snackbar from '../Snackbar/Snackbar';

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
  padding: 25px;
  background-color: white;
  border-radius: 6px;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.25);
  .barNameText{
    text-align: center;
    color:  #042954;
    font-size: 30px;
    margin-bottom: 15px;
    margin-top: 10px;
  }
  .composedNameText{
    text-align: center;
    color:  #042954;
    font-size: 23px;
    margin-bottom: 15px;
    margin-top: 20px;
  }
  .pieNameText{
    text-align: center;
    color:  #042954;
    font-size: 23px;
    margin-bottom: 15px;
    margin-top: 20px;
  }
  .information_header_part{
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    margin-bottom: 2rem;
    height: 120px;
    gap: 10px;
    /* width: 100%;
    height: 150px;
    padding-left: 35px;
    padding-right: 35px;
    -webkit-box-shadow: 0px 2px 8px 3px rgba(34, 60, 80, 0.2);
    -moz-box-shadow: 0px 2px 8px 3px rgba(34, 60, 80, 0.2);
    box-shadow: 0px 2px 8px 3px rgba(34, 60, 80, 0.2);
    border-radius: 4px;
    margin-bottom: 50px;
   display: flex;
   justify-content: center;
   align-items: center;
   @media screen and (max-width: 1500px) {
         &{
          padding-left: 0px;
          padding-right: 0px;
         } 
      } */
    .header_parts{
      display: grid;
      justify-content: center;
      color: #fff;
      border-radius: 5px;
      div{
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      i{
        font-size: 2rem;
        border-right: 2px solid #fff;
        padding-right: 1rem;
      }
      p{
        padding-left: 1rem;
        font-size: 2rem;
      }
      h3{
        font-size: 1.2rem;
        text-align: center;
      }
    }
    .header_pending{
      background-image: linear-gradient(160deg, #02517f 0%, #70b1e2 100%);
    }
    .header_group{
      background: linear-gradient(135deg, rgb(151, 171, 255) 10%, rgb(18, 53, 151) 100%);
    }
    .header_lastMonth{
      background: linear-gradient(62deg, #cb6e3b 0%, #fbd369 100%);
    }
    .header_allStudent{
      background-image: linear-gradient(45deg, #099041 0%, #deda87 100%);
    }
  }
  .ChartsOnePart{
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
      .composedChart{
        width: 100%;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
      padding-bottom: 10px;
      padding-left: 10px;
      padding-right: 10px;
      margin-top: 20px;
      -webkit-box-shadow: 0px 2px 8px 3px rgba(34, 60, 80, 0.2);
      -moz-box-shadow: 0px 2px 8px 3px rgba(34, 60, 80, 0.2);
      box-shadow: 0px 2px 8px 3px rgba(34, 60, 80, 0.2);
      border-radius: 4px;
      }
    .ChartsBottom{
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
    .barChartPart{
      width: 100%;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      margin-bottom: 50px;
      padding-top: 10px;
      padding-bottom: 10px;
      -webkit-box-shadow: 0px 2px 8px 3px rgba(34, 60, 80, 0.2);
      -moz-box-shadow: 0px 2px 8px 3px rgba(34, 60, 80, 0.2);
      box-shadow: 0px 2px 8px 3px rgba(34, 60, 80, 0.2);
      border-radius: 4px;
    }
    .pieChartPart{
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
       padding-top: 10px;
      padding-bottom: 10px;
      -webkit-box-shadow: 0px 2px 8px 3px rgba(34, 60, 80, 0.2);
      -moz-box-shadow: 0px 2px 8px 3px rgba(34, 60, 80, 0.2);
      box-shadow: 0px 2px 8px 3px rgba(34, 60, 80, 0.2);
      border-radius: 4px;
      .labelGroup{
        width: 250px;
        display: flex;
        flex-direction: row;
      }
      .labelPie{
        width: 100%;
        .maleBlock{
          background-color: #042954;
        }
        .feMaleBlock{
          background-color: #d32f2f;
        }
        div{
          width: 15px;
          height: 15px;
          margin-right: 8px;
        }
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-bottom: 5px;
      }
    }
  }
`;

function Informations() {
  const navigate = useNavigate();
  const { user } = useContext(Context);
  const [lidsChart, setLidsChart] = useState([]);
  const [chartThirdNewStudents, setchartThirdNewStudents] = useState();
  const [headerPendingStudents, setHeaderPendingStudents] = useState();
  const [headerGroups, setHeaderGroups] = useState(0);
  const [headerAllStudent, setHeaderAllStudent] = useState();
  const [skeletonTime, setSkeletonTime] = useState(true);
  const [selectedStartDatePending, setSelectedStartDatePending] = useState(null);
  const [selectedStartDatePendingFilter, setSelectedStartDatePendingFilter] = useState(null);
  const [selectedEndDatePending, setSelectedEndDatePending] = useState(null);
  const [selectedEndDatePendingFilter, setSelectedEndDatePendingFilter] = useState(null);
  const [falseExcelDate, setFalseExcelDate] = useState(false);

  const COLORS = ['#042954',
    '#d32f2f', '#FDC600',
    '#037903', '#1976D2',
    '#2C3842', '#928d29',
    '#b22fd3', '#2fa7d3',
    '#2fd345', '#372fd3', '#65d7ab'];

  useEffect(() => {
    http
      .get(import.meta.env.VITE_API_URL + 'api/payment/chart/list')
      .then((r) => {
        setchartThirdNewStudents(r.data.studentList);
        setHeaderPendingStudents(r.data.pendingStudentList['Kutish zalidagi o\'quvchilar']);
        r.data.groupList && setHeaderGroups(r.data.groupList.groups_size);
        setHeaderAllStudent(r.data.allStudent['Barcha o\'quvchilar']);
        setSkeletonTime(false);
      })
      .catch((error) => {
        if (
          error && error.response && error.response.data && error.response.data.message &&
          error.response.data.message == 'ro\'yxattan o\'tmagan foydalanuvchi!'
        ) {
          user.setIsAuth(false);
          localStorage.clear();
          navigate('/');
        } else {
          console.log(error);
        }
      });
    const currentDate = new Date();

    // Get the first day of the current month
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    // Get the last day of the current month
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    // Format the dates as 'YYYY-MM-DD' strings
    const formattedFirstDay = `${firstDay.getFullYear()}-${(firstDay.getMonth() + 1).toString().padStart(2, '0')}-01`;
    const formattedLastDay = `${lastDay.getFullYear()}-${(lastDay.getMonth() + 1).toString().padStart(2, '0')}-${lastDay.getDate()}`;
    setSelectedStartDatePending(dayjs(formattedFirstDay));
    setSelectedEndDatePending(dayjs(formattedLastDay));
    setSelectedStartDatePendingFilter(formattedFirstDay);
    setSelectedEndDatePendingFilter(formattedLastDay);
    http
      .post(import.meta.env.VITE_API_URL + 'api/new-pending-student/chart-data', {
        startDate: formattedFirstDay,
        endDate: formattedLastDay
      })
      .then((r) => {
        setLidsChart(r.data);
      })
      .catch((error) => {
        if (
          error && error.response && error.response.data && error.response.data.message &&
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
    if (selectedStartDatePendingFilter && selectedEndDatePendingFilter) {
      http
        .post(import.meta.env.VITE_API_URL + 'api/new-pending-student/chart-data', {
          startDate: selectedStartDatePendingFilter,
          endDate: selectedEndDatePendingFilter
        })
        .then((r) => {
          setLidsChart(r.data);
        })
        .catch((error) => {
          if (
            error && error.response && error.response.data && error.response.data.message &&
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
  }, [selectedStartDatePending, selectedEndDatePending]);

  const getPath = (x, y, width, height) => {
    return `M${x},${y + height}C${x + width / 3},${y + height} ${x + width / 2},${y + height / 3}
    ${x + width / 2}, ${y}
    C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${x + width}, ${y + height}
    Z`;
  };

  const TriangleBar = (props) => {
    const { fill, x, y, width, height } = props;
    return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;

  };

  TriangleBar.propTypes = {
    fill: PropTypes.string.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
  };
  const handleChangeStartPending = (date) => {
    setSelectedStartDatePending(date);
    const selectedMonth = date ? dayjs(date).format('YYYY-MM-DD') : '';
    setSelectedStartDatePendingFilter(selectedMonth);
    setFalseExcelDate(false);
    if (selectedEndDatePendingFilter) {
      if (selectedMonth > selectedEndDatePendingFilter) {
        setSelectedStartDatePending(null);
        setSelectedStartDatePendingFilter(null);
        setFalseExcelDate(true);
      }
    }

  };
  const handleChangeEndPending = (date) => {
    setSelectedEndDatePending(date);
    const selectedMonth = date ? dayjs(date).format('YYYY-MM-DD') : '';
    setSelectedEndDatePendingFilter(selectedMonth);
    setFalseExcelDate(false);
    if (selectedStartDatePendingFilter) {
      if (selectedMonth < selectedStartDatePendingFilter) {
        setSelectedEndDatePending(null);
        setSelectedEndDatePendingFilter(null);
        setFalseExcelDate(true);
      }
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setFalseExcelDate(false);
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
          <div>
            <Container>
              <div className='information_header_part'>
                <div className='header_group header_parts'>
                  <div>
                    <i className="fas fa-layer-group" id='last_icon_header'></i>
                    <p><NumericFormat
                      value={headerGroups}
                      displayType={'text'}
                      thousandSeparator={true}
                      prefix={''} />
                    </p>
                  </div>
                  <h3>Guruhlar</h3>
                </div>
                <div className='header_pending header_parts'>
                  <div>
                    <i className='fa-solid fa-person-shelter' id='pending_icon_header'></i>
                    <p>{headerPendingStudents}</p>
                  </div>
                  <h3>Guruhlanmagan o&apos;quvchilar</h3>
                </div>
                {/* <div className='header_lastMonth header_parts'>
                  <div>
                    <i className="fa-regular fa-credit-card" id='last_icon_header'></i>
                    <p>
                      <NumericFormat
                        value={headerLastSumma}
                        displayType={'text'}
                        thousandSeparator={true}
                        prefix={''}
                      /></p>
                  </div>
                  <h3>Oxirgi oydagi to&apos;lovlar</h3>
                </div> */}
                <div className='header_allStudent header_parts'>
                  <div>
                    <i className="fa-solid fa-users" id='student_icon_header'></i>
                    <p>{headerAllStudent}</p>
                  </div>
                  <h3>O&apos;quvchilar</h3>
                </div>
              </div>
              <div className='ChartsOnePart'>
               
                {
                  lidsChart ? (
                    <div className='pieChartPart' style={{ marginTop: '20px' }}>
                      <h2 className='pieNameText'>Lidlar soni bo&apos;yicha hisobot</h2>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', padding: '15px 20px', width: '100%' }}>
                        <div style={{ width: '100%' }}>
                          <p style={{ fontWeight: '600', marginBottom: '10px', color: 'rgb(4,41,84)' }}>Boshlanish sanasi</p>
                          <DatePickerExcel
                            value={selectedStartDatePending}
                            onChange={handleChangeStartPending}
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
                        <div style={{ width: '100%' }}>
                          <p style={{ fontWeight: '600', marginBottom: '10px', color: 'rgb(4,41,84)' }}>Tugash sanasi</p>
                          <DatePickerExcel
                            value={selectedEndDatePending}
                            onChange={handleChangeEndPending}
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
                        </div>
                      </div>
                      <ComposedChart
                        width={500}
                        height={400}
                        data={lidsChart}
                        margin={{
                          top: 20,
                          right: 20,
                          bottom: 20,
                          left: 20,
                        }}
                      >
                        <CartesianGrid stroke="#f5f5f5" strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        {/* <Legend /> */}
                        <Bar dataKey="count_le" barSize={20} fill="#413ea0" />
                        <Line type="monotone" dataKey="count_le" stroke="#ff7300" />
                      </ComposedChart>
                    </div>
                  ) : (
                    <div>

                    </div>
                  )
                }
                {
                  chartThirdNewStudents ? (
                    <div className='composedChart'>
                      <h2 className='composedNameText'>Qo&apos;shilgan o&apos;quvchilar bo&apos;yicha hisobot</h2>

                      <BarChart
                        width={500}
                        height={300}
                        data={chartThirdNewStudents}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Bar dataKey="number" fill="#8884d8" shape={<TriangleBar />} label={{ position: 'top' }}>
                          {chartThirdNewStudents.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % 20]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </div>
                  ) : (
                    <div>

                    </div>
                  )
                }
              </div>
              <Snackbar
                open={falseExcelDate}
                onClose={handleClose}
                severity={'error'}
                massage={'Iltimos sanalarni to\'g\'ri kiriting'}
              />
            </Container>
          </div>
        )
      }
    </div>
  );
}


export default Informations;