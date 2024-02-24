import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import http from '../../http/index';
import Loder from '../loder/Loder';
import { Link, useNavigate } from 'react-router-dom';
import { NumericFormat } from 'react-number-format';
import { Context } from '../../index';
import {
  Box,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';
import {
  AccountCircle,
  CalendarMonth,
  LocalPhone
} from '@mui/icons-material';

const Container = styled.div`
  margin-left: 1rem;
  margin-right: 1rem;
  padding-bottom: 20px;
  width: 100%;
  padding-top: 10px;
  margin-top: 90px;
  background-color: white;
  hr {
    border: 1px solid #aaaaaa;
  }
  .teacher_groups_name {
    background-color: #9db5b9;
    display: inline-block;
    padding-left: 0.5rem;
    margin-right: 0.3rem;
    border-radius: 3px;
    margin: 0.3rem;
  }

  .sale {
    background-color: #66878c;
    display: inline-block;
    color: white;
    text-align: center;
    margin: 0;
    width: 2rem;
    padding-top: 0.45rem;
    height: 2rem;
    font-size: 0.78rem;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }
  @media screen and (max-width: 700px) {
    margin: 60px 0 0 0;
    overflow: hidden;
  }
  .tableContent{
    width: 70%;
    border: 1px solid #c5bdbd;
    border-bottom: 1px solid white;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    padding: 10px;
    .eye-link{
      text-decoration: none;
      color: #545454;
      transition: 0.1s ease;
      &:hover{
        color: #2e2a2a;
      }
    }
    @media (max-width: 640px) {
      width: 100%;
    }
  }
`;
const Header = styled.div`
  display: flex;
  padding: 15px 20px;
  align-items: center;
  justify-content: space-between;
  @media screen and (max-width: 550px) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .teacher_info_div {
    margin-right: 1rem;
    .teacher_card {
      margin-right: 0.5rem;
    }
  }
  p {
    display: inline-block;
    margin-right: 1rem;
    &:first-child {
      background: green;
      color: white;
      padding-top: 0.3rem;
      padding-bottom: 0.4rem;
      padding-left: 1rem;
      padding-right: 1rem;
      border-radius: 4px;
    }
    &:last-child {
      background: #002fff;
      color: white;
      padding-top: 0.3rem;
      padding-bottom: 0.4rem;
      padding-left: 1rem;
      padding-right: 1rem;
      border-radius: 4px;
      @media screen and (max-width: 550px) {
        margin-top: 20px;
      }
    }
  }
`;
const BoxWrapper = styled(Box)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  .receivePart{
    cursor: pointer;
  }
  @media (max-width: 650px) {
    grid-template-columns: 1fr;
  }
`;
const BoxItem = styled(Box)`
  background: #fff;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 5px 0px,
    rgba(0, 0, 0, 0.1) 0px 0px 1px 0px;
  padding: 30px;
  border-radius: 15px;
  transition: 0.3s ease;
  &:hover{
    transform: scale(1.05);
  }
  .gropusList {
    width: 100%;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .receiveBtn {
      color: blue;
      cursor: pointer;
      text-decoration: underline;
    }
  }
  h6 {
    font-weight: 600;
    font-size: 22px;
  }
  svg {
    font-size: 32px;
    color: #224064;
  }
`;
const BoxParent = styled(Box)`
  display: grid;
  grid-template-columns: auto 1fr;
  padding: 25px;
  gap: 30px;
  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
  img {
    justify-self: center;
  }
`;
const Table = styled.table`
  width: 100%;
  margin-top: 1rem;
  tr:nth-child(even) {
    background-color: #f8f8f8;
  }
  tr {
    text-align: center;
    height: 33px;
  }

  .delete_student_icon {
    color: #c20404;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.8s;
    margin: 0 0.5rem;
    &:hover {
      color: #ff0808;
    }
  }
  .edit {
    i {
      font-size: 1rem;
    }
    background-color: initial;
    color: #6cb324;
    border: none;
    margin-right: 1rem;
    cursor: pointer;
    transition: all 0.5s;
    &:hover {
      color: #74e007;
    }
  }
`;
const TableCellBold = styled(TableCell)`
  font-weight: 600 !important;
`;

const GroupsPart = styled.div`
  width: 100%;
`

const TeachersCobinet = () => {
  const { user } = useContext(Context);
  const data = window.location.href.split('/');
  const [teacher, setTeacher] = useState('');
  const [loderTime, setLoderTime] = useState(true);
  const [deleteName, setDeleteName] = useState([]);
  const [deleteId, setDeleteId] = useState('');
  const [monthly, setMonthly] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    http
      .get(import.meta.env.VITE_API_URL + `api/teacher/get/one/${data[4]}`)
      .then((res) => {
        setTeacher(res.data);
        setLoderTime(false);
      })
      .catch((error) => {
        if (
          error?.response?.data?.message == "ro'yxattan o'tmagan foydalanuvchi!"
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
      .post(import.meta.env.VITE_API_URL + `api/monthly/get/${data[4]}`, {})
      .then((res) => {
        setMonthly(res.data);
      })
      .catch((error) => {
        if (
          error?.response?.data?.message == "ro'yxattan o'tmagan foydalanuvchi!"
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
        console.log(error);
      });
  }, []);

  let number = 1;

  const filterTime = (e) => {
    const timeDate = e;
    const filterYear = timeDate.substring(0, 10);
    const filterLocalClock = timeDate.substring(19, 11);
    return filterYear + ' ' + filterLocalClock;
  };

  let name;
  if (deleteName) {
    name = deleteName.filter((e) => {
      const id = deleteId;
      return e.id == id;
    });
  }



  return (
    <Container>
      <Loder stop={loderTime} />
      {teacher && (
        <div>
          <Header>
            <div>
              <h3>
                {teacher.firstname + ' ' + teacher.lastname} ma&apos;lumotlari
              </h3>
            </div>
            <div className='teacher_info'>
              <div className='teacher_info_div'>
                <p>
                  <i className='teacher_card fa-solid fa-credit-card'></i>
                  <NumericFormat
                    value={teacher.wallet ? teacher.wallet : 0}
                    displayType={'text'}
                    thousandSeparator={true}
                    prefix={''}
                  />
                </p>
              </div>
            </div>
          </Header>
          <hr />
          <BoxParent>
            <img
              alt={`${teacher.firstname + teacher.lastname}`}
              src={
                teacher.gender == 'ayol'
                  ? '/images/admin4.png'
                  : '/images/admin3.png'
              }
              style={{ width: '300px' }}
            />
            <BoxWrapper>
              <BoxItem>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant='subtitle1'>Ism Familya</Typography>
                  <AccountCircle />
                </Box>
                <Typography>{`${teacher.firstname} ${teacher.lastname} ${teacher.fathername}`}</Typography>
              </BoxItem>
              <BoxItem>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant='subtitle1'>Jinsi</Typography>
                  <AccountCircle />
                </Box>
                <Typography>{teacher.gender}</Typography>
              </BoxItem>
              <BoxItem>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant='subtitle1'>
                    Tug&apos;ilgan sanasi
                  </Typography>
                  <CalendarMonth />
                </Box>
                <Typography>{teacher.birthday}</Typography>
              </BoxItem>
              <BoxItem>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant='subtitle1'>Telefon raqami</Typography>
                  <LocalPhone />
                </Box>
                <Typography>{teacher.phone}</Typography>
              </BoxItem>
            </BoxWrapper>
          </BoxParent>
          {teacher?.group && teacher?.group.length > 0 && (
            <GroupsPart>
              <Box
                sx={{
                  overflow: 'hidden',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginBottom: '20px'
                }}
              >
                <div className='tableContent'>
                  <h2>Guruhlari</h2>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCellBold>T/r</TableCellBold>
                        <TableCellBold>Nomi</TableCellBold>
                        <TableCellBold>Kelishilgan foiz</TableCellBold>
                        <TableCellBold sx={{ textAlign: 'center' }}>Amallar</TableCellBold>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {teacher?.group.map((el, index) => (
                        <TableRow key={el.id}>
                          <TableCell>{index + 1}.</TableCell>
                          <TableCell>{el.name}</TableCell>
                          <TableCell>{el.sale}</TableCell>
                          <TableCell sx={{ textAlign: 'center' }}>
                            <Tooltip
                              title="Ma&apos;lumotlar"
                              arrow
                              TransitionComponent={Fade}
                              placement="top"
                            >
                              <Link to={`/cabinet-group/${el.id}`} className='eye-link'><i className='fa-solid fa-eye'></i></Link>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Box>
            </GroupsPart>
          )}
          {monthly && monthly.length > 0 && (
            <Box
              sx={{
                overflow: 'hidden',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div className='tableContent'>
                <h2>Oylik maosh bo&apos;yicha hisobot</h2>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCellBold>T/r</TableCellBold>
                      <TableCellBold>Summa</TableCellBold>
                      <TableCellBold>Sana</TableCellBold>
                      {window.innerWidth <= 480 ? (
                        ''
                      ) : (
                        <TableCellBold>Yangilagan vaqt</TableCellBold>
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {monthly.map((el, index) => (
                      <TableRow key={el.id}>
                        <TableCell>{index + 1}.</TableCell>
                        <TableCell>{el.payment}</TableCell>
                        {window.innerWidth <= 480 ? (
                          ''
                        ) : (
                          <TableCell>{filterTime(el.createdAt)}</TableCell>
                        )}
                        <TableCell>{filterTime(el.updatedAt)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Box>
          )}
        </div>
      )}
    </Container>
  );
};

export default TeachersCobinet;