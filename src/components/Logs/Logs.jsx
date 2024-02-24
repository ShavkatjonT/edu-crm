import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import Box from '@mui/material/Box';
// import Tooltip from '@mui/material/Tooltip';
// import Fade from '@mui/material/Fade';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Skeleton from '@mui/material/Skeleton';
import dayjs from 'dayjs';
import { DatePicker } from 'antd';
import http from '../../http/index';
import { Context } from '../../index';
import { useNavigate } from 'react-router-dom';
import { Stack, Pagination, Button } from '@mui/material';

const ContentSkeleton = styled.div`
  margin-top: 1.8rem;
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
  margin-top: 1.8rem;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-bottom: 10px;
  background-color: white;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.25);
  border-radius: 6px;
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
  h2{
    color: rgb(4,41,84);
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
    font-size: 24px;
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
    &:hover{
      background-color:#033a6b;
      color: #fff;
    }
  }
`;

const Table = styled.table`
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
  .number {
    text-align: center;
  }
`;

const TableHeader = styled.tr`
  width: 100%;
  display: flex;
  padding: 10px 0;
  border-bottom: 1px solid #efefef;
  .number_th {
    width: 10%;
    text-align: left;
    padding-left: 1%;
  }
  .name_th {
    width: 30%;
    text-align: left;
  }
  .action_th {
    width: 45%;
    text-align: center;
  }
  .date_th {
    width: 15%;
    text-align: right;
    padding-right: 10px;
  }
`;
const Section = styled.tbody`
  width: 100%;
  tr {
    &:nth-child(even) {
      background-color: #f8f8f8;
    }
    display: flex;
    align-items: center;
  }
  .number_td {
    width: 10%;
    text-align: left;
    padding-left: 1.5%;
  }
  .name_td {
    width: 30%;
    text-align: left;
  }
  .action_td {
    width: 45%;
    text-align: center;
    & > div{
        min-height: 50px;
        padding: 10px 0px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
  }
  .date_td {
    width: 15%;
    text-align: right;
    padding-right: 10px;
  }

  
`;

const PaginationSection = styled.div`
  margin-top: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Logs = () => {
  const navigate = useNavigate();
  const { user } = useContext(Context);
  const [skeletonTime, setSkeletonTime] = useState(true);
  const [dateSearchValue, setDateSearchValue] = useState(null);
  const [filterDateSearchValue, setFilterDateSearchValue] = useState('');
  const [getData, setGetData] = useState([]);
  const [listEmployee, setListEmployee] = useState([]);
  const [dateEndSearchValue, setDateEndSearchValue] = useState(null);
  const [filterDateEndSearchValue, setFilterDateEndSearchValue] = useState('');
  const [searchEmployee, setSearchEmployee] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    http
      .get(import.meta.env.VITE_API_URL + 'api/teacher/employees-list')
      .then((api) => {
        setListEmployee(api.data);
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
      .get(import.meta.env.VITE_API_URL + 'api/log//all')
      .then((api) => {
        setGetData(api.data);
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
    if (searchEmployee == '' && dateSearchValue == null && dateEndSearchValue == null) {
      http
        .get(import.meta.env.VITE_API_URL + 'api/log//all')
        .then((api) => {
          setGetData(api.data);
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
      http
        .post(import.meta.env.VITE_API_URL + 'api/log/log-filter', {
          id: searchEmployee,
          start_date: filterDateSearchValue,
          end_date: filterDateEndSearchValue
        })
        .then((api) => {
          setGetData(api.data);
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
  }, [searchEmployee, dateSearchValue, dateEndSearchValue]);

  const changeSearchEmplpyee = (event) => {
    setSearchEmployee(event.target.value);
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

  let viewData = [];

  function extractDate(dateString) {
    const dateObject = new Date(dateString);
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(dateObject.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
  }

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = getData && getData !== null && getData.slice(startIndex, endIndex);


  if (paginatedData) {
    viewData = paginatedData.map((e, index) => (
      <tr key={index}>
        <td className='number_td'>{index + 1}</td>
        <td className='name_td'>{e.firstname + ' ' + e.lastname}</td>
        <td className='action_td'><div>
          <p>{e.text}</p></div></td>
        <td className='date_td'>{extractDate(e.date)}</td>
      </tr>
    ));
  }

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
            <Header>
              <div>
                <h2>Loglar</h2>
              </div>
              <HeaderRight>
              </HeaderRight>
            </Header>
            <p style={{ paddingLeft: '27px', color: 'gray', fontWeight: '600', fontSize: '15px' }}>Filter</p>
            <div className='filterPart'>
              <FormControl size='small' style={{ width: '220px' }}>
                <InputLabel id='demo-simple-select-label'>
                  Xodim bo&apos;yicha qidirish
                </InputLabel>
                <Select
                  labelId='demo-simple-select-label'
                  id='demo-simple-select'
                  value={searchEmployee}
                  label="Xodim bo'yicha qidirish"
                  onChange={changeSearchEmplpyee}
                >
                  <MenuItem value={''}>Barchasi</MenuItem>
                  {listEmployee && listEmployee.map((e) => (
                    <MenuItem key={e.id} value={e.user_id}>{e.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <DatePicker
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
              <DatePicker
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
              <Button
                size='small'
                className="logs_clear_btn"
                variant="contained"
                onClick={() => {setSearchEmployee(''); setDateSearchValue(null); setDateEndSearchValue(null);}}
              >
                Tozalash
              </Button>
            </div>
            <Table>
              <thead>
                <TableHeader>
                  <th className="number_th">
                    <p>T/r</p>
                  </th>
                  <th className="name_th">
                    <p>Xodim</p>
                  </th>
                  <th className="action_th">
                    <p>Amallar</p>
                  </th>
                  <th className="date_th">
                    <p>Sana</p>
                  </th>
                </TableHeader>
              </thead>
              <Section>
                {viewData}
              </Section>
            </Table>
            <PaginationSection>
              <Stack spacing={3}>
                <Pagination
                  count={Math.ceil(getData && getData.length / itemsPerPage)}
                  page={currentPage}
                  onChange={handlePageChange}
                  color='primary'
                  variant='outlined'
                  shape='rounded'
                />
              </Stack>
            </PaginationSection>
          </Container>
        )
      }
    </div>
  );
};

export default Logs;