import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../index';
import http from '../../http/index';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, ResponsiveContainer, Cell } from 'recharts';
import { DatePicker as DatePickerExcel } from 'antd';
import { NumericFormat } from 'react-number-format';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import dayjs from 'dayjs';
import Snackbar from '../Snackbar/Snackbar';
// import PropTypes from 'prop-types';

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
    font-size: 25px;
    margin-bottom: 15px;
    margin-top: 10px;
  }
  .composedNameText{
    text-align: center;
    color:  #042954;
    font-size: 23px;
    margin-bottom: 15px;
    margin-top: 5px;
  }
  .pieNameText{
    text-align: center;
    color:  #042954;
    font-size: 23px;
    margin-bottom: 15px;
    margin-top: 20px;
  }
  .information_header_part_first{
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    margin-bottom: 2rem;
    height: 120px;
    gap: 10px;
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
        font-size: 1rem;
        text-align: center;
        padding-left: 10px;
        padding-right: 10px;
      }
    }
    .header_pending{
      background-image: linear-gradient(160deg, #02517f 0%, #70b1e2 100%);
    }
    .header_group{
      background: linear-gradient(135deg, rgb(151, 171, 255) 10%, rgb(18, 53, 151) 100%);
    }
    .header_lastMonth{
        background-image: linear-gradient(to left bottom, #054489, #00759f, #46a0a2, #9fc6af, #e8ebd7);
    }
    .header_allStudent{
      background-image: linear-gradient(to right top, #117665, #1c9668, #4db65d, #88d345, #cfeb12);
    }
  }
  .information_header_part{
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    margin-bottom: 2rem;
    height: 120px;
    gap: 10px;
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
        font-size: 1rem;
        text-align: center;
        padding-left: 10px;
        padding-right: 10px;
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
    .ChartsBottom{
      width: 100%;
      display: flex;
      justify-content: space-between;
      .composedChart{
        width: 47%;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
      padding-bottom: 10px;
      padding-left: 10px;
      padding-right: 10px;
      -webkit-box-shadow: 0px 2px 8px 3px rgba(34, 60, 80, 0.2);
      -moz-box-shadow: 0px 2px 8px 3px rgba(34, 60, 80, 0.2);
      box-shadow: 0px 2px 8px 3px rgba(34, 60, 80, 0.2);
      border-radius: 4px;
      }
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
      margin-bottom: 20px;
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
const BuyStatistics = () => {
  const navigate = useNavigate();
  const { user } = useContext(Context);
  const [skeletonTime, setSkeletonTime] = useState(true);
  const [chartFirstPayData, setChartFirstPayData] = useState();
  const [chartSecondGenderList, setChartSecondGenderList] = useState([]);
  const [headerLastPayCount, setHeaderLastPayCount] = useState();
  const [headerLastPaySumma, setHeaderLastPaySumma] = useState();
  const [headerLastDebtorCount, setHeaderLastDebtorCount] = useState();
  const [headerLastDebtorSumma, setHeaderLastDebtorSumma] = useState();
  const [headerAllDebtorCount, setHeaderAllDebtorCount] = useState();
  const [headerAllDebtorSumma, setHeaderAllDebtorSumma] = useState();
  const [selectedStartDateExcel, setSelectedStartDateExcel] = useState(null);
  const [selectedStartDateExcelFilter, setSelectedStartDateExcelFilter] = useState(null);
  const [selectedEndDateExcel, setSelectedEndDateExcel] = useState(null);
  const [selectedEndDateExcelFilter, setSelectedEndDateExcelFilter] = useState(null);
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
        setChartFirstPayData(r.data.payData);
        setHeaderLastDebtorCount(r.data?.debtorsData?.last_month_debtors);
        setHeaderLastDebtorSumma(r.data?.debtorsData?.last_month_summa);
        setHeaderAllDebtorCount(r.data?.debtorsData?.all_debtors);
        setHeaderAllDebtorSumma(r.data?.debtorsData?.all_summa);
        setHeaderLastPayCount(r.data?.lastMonthData?.count);
        setHeaderLastPaySumma(r.data?.lastMonthData?.Summa);
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
    setSelectedStartDateExcel(dayjs(formattedFirstDay));
    setSelectedEndDateExcel(dayjs(formattedLastDay));
    setSelectedStartDateExcelFilter(formattedFirstDay);
    setSelectedEndDateExcelFilter(formattedLastDay);
    http
      .post(import.meta.env.VITE_API_URL + 'api/payment/chart/py-type/list', {
        startDate: formattedFirstDay,
        endDate: formattedLastDay
      })
      .then((r) => {
        setChartSecondGenderList(r.data);
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
    if (selectedStartDateExcelFilter && selectedEndDateExcelFilter) {
      http
        .post(import.meta.env.VITE_API_URL + 'api/payment/chart/py-type/list', {
          startDate: selectedStartDateExcelFilter,
          endDate: selectedEndDateExcelFilter
        })
        .then((r) => {
          setChartSecondGenderList(r.data);
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
  }, [selectedStartDateExcel, selectedEndDateExcel]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setFalseExcelDate(false);
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
      ) : (<Container>
        <div className='information_header_part_first'>
          <div className='header_lastMonth header_parts'>
            <div>
              <i className="fa-solid fa-wallet" id='last_icon_header'></i>
              <p><NumericFormat
                value={headerLastPaySumma}
                displayType={'text'}
                thousandSeparator={true}
                prefix={''} />
              </p>
            </div>
            <h3>Oxirigi oydagi to&apos;lovlar</h3>
          </div>
          <div className='header_allStudent header_parts'>
            <div>
              <i className="fa-solid fa-file-invoice-dollar" id='last_icon_header'></i>
              <p><NumericFormat
                value={headerLastPayCount}
                displayType={'text'}
                thousandSeparator={true}
                prefix={''} />
              </p>
            </div>
            <h3>Oxirigi oydagi to&apos;lovlar soni</h3>
          </div>
        </div>
        <div className='information_header_part'>
          <div className='header_lastMonth header_parts'>
            <div>
              <i className="fa-solid fa-user-group" id='last_icon_header'></i>
              <p><NumericFormat
                value={headerLastDebtorCount}
                displayType={'text'}
                thousandSeparator={true}
                prefix={''} />
              </p>
            </div>
            <h3>Oxirigi oydagi qarzdorliklar soni</h3>
          </div>
          <div className='header_allStudent header_parts'>
            <div>
              <i className='fa-solid fa-money-bills' id='pending_icon_header'></i>
              <p><NumericFormat
                value={headerLastDebtorSumma}
                displayType={'text'}
                thousandSeparator={true}
                prefix={''} />
              </p>
            </div>
            <h3>Oxirigi oydagi qarzdorliklar summasi</h3>
          </div>
          <div className='header_group header_parts'>
            <div>
              <i className="fa-solid fa-users" id='last_icon_header'></i>
              <p>
                <NumericFormat
                  value={headerAllDebtorCount}
                  displayType={'text'}
                  thousandSeparator={true}
                  prefix={''}
                /></p>
            </div>
            <h3>Barcha qarzdorliklar soni</h3>
          </div>
          <div className='header_pending header_parts'>
            <div>
              <i className="fa-regular fa-credit-card" id='student_icon_header'></i>
              <p>
                <NumericFormat
                  value={headerAllDebtorSumma}
                  displayType={'text'}
                  thousandSeparator={true}
                  prefix={''}
                /></p>
            </div>
            <h3>Barcha qarzdorliklar summasi</h3>
          </div>
        </div>
        <div className='ChartsOnePart'>
          {
            chartSecondGenderList ? (
              <div className='pieChartPart'>
                <h2 className='pieNameText'>To&apos;lov turlari bo&apos;yicha hisobot</h2>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', padding: '15px 20px', width: '100%' }}>
                  <div style={{ width: '100%' }}>
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
                  <div style={{ width: '100%' }}>
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
                  </div>
                </div>
                {chartSecondGenderList.length > 0 ?
                  <PieChart className='chartPieCircle' width={550} height={350}>
                    <Pie
                      data={chartSecondGenderList}
                      innerRadius={60}
                      dataKey="amount"
                      label
                    >
                      {chartSecondGenderList.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ width: '100%' }} />
                  </PieChart>
                : <em style={{fontSize: 'medium', display: 'block', fontWeight: '500', color: '#999999'}}>Ma&apos;lumotlar mavjud emas</em>}
              </div>
            ) : (
              <div>

              </div>
            )
          }

          {
            chartFirstPayData.length > 0 ? (
              <div className='barChartPart'>
                <h2 className='barNameText'>Yillik to&apos;lovlar bo&apos;yicha hisobot</h2>
                <ResponsiveContainer width='98%' height={400}>
                  <BarChart
                    barSize={40}
                    data={chartFirstPayData}
                  >
                    <CartesianGrid strokeDasharray="" />
                    <Tooltip contentStyle={{ width: '100%', display: 'inline-block' }} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Bar dataKey="summa" fill="#042954" fontSize={'10px'} />
                  </BarChart>
                </ResponsiveContainer>
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
      </Container>)}
    </div>
  );
};

export default BuyStatistics;