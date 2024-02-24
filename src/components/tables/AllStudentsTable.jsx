/* eslint-disable react/jsx-key */
import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import http from '../../http/index';
import Loder from '../loder/Loder';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { Context } from '../../index';
import { useNavigate } from 'react-router-dom';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import NumericInput from 'material-ui-numeric-input';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';
// Table styles

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
  color: #7d7d7d;
  .tnumber {
    padding-left: 10px;
  }
  .text-left {
    text-align: left;
  }
`;
const TableHead = styled.thead`
  tr {
    padding-bottom: 26px;
  }
  th {
    box-sizing: inherit;
  }
`;
const TableBody = styled.tbody`
  tr {
    width: 100%;
    height: 50px;
    text-align: left;
    &:nth-child(even) {
      background-color: #f8f8f8;
    }
    /* align-items: center; */
  }
  td {
    box-sizing: inherit !important;
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
  .eye {
    background-color: initial;
    color: #313131;
    border: none;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.5;
    &:hover {
      color: #5a5a5a;
      transform: scale(1.19);
    }
  }
  .action {
    text-align: center;
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

const PaginationSection = styled.div`
  margin-top: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AllStudentsTable = ({ searchText, searchData, pageSize, age, searchIsTrue, inChecked, inCheckedTrue }) => {
  const navigate = useNavigate();
  const { user } = useContext(Context);
  const [getData, setGetData] = useState([]);
  const [loderTime, setLoderTime] = useState(false);
  const [paginatedPosts, setPaginatedPosts] = useState([]);
  const [saleInfo, setSaleInfo] = useState(0);
  const [deleteId, setDeleteId] = useState('');
  const [groupName, setGroupName] = useState([]);
  const [payModal, setPayModal] = useState(false);
  const [messageLimit, setMessageLimit] = useState(false);
  const [limitOpen, setLimitOpen] = useState(false);
  const [errorSum, setErrorSum] = useState(false);
  const [errorSelect, setErrorSelect] = useState(false);
  const [selectGroup, setSelectGroup] = useState('');
  const [studentId, setStudentId] = useState('');
  const [monthSumma, setMonthSumma] = useState('');
  const [allMonthGiven, setAllMonthGiven] = useState(0);
  const [filterGroupsSumma, setFilterGroupsSumma] = useState(0);
  const [payMethod, setPayMethod] = useState('');
  const [errorPayMethod, setErrorPayMethod] = useState(false);


  useEffect(() => {
    http
      .get(import.meta.env.VITE_API_URL + 'api/student/list/get')
      .then((res) => {
        setGetData(res.data.data);
        setPaginatedPosts(_(res.data).slice(0).take(pageSize).value());
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
  }, [age]);


  useEffect(() => {
    http
      .get(import.meta.env.VITE_API_URL + 'api/student/list/get')
      .then((res) => {
        setGetData(res.data.data);
        setPaginatedPosts(_(res.data.data).slice(0).take(pageSize).value());
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
    if (searchText && searchIsTrue && searchData.length > 0) {
      setPaginatedPosts(_(searchData).slice(0).take(searchData.length).value());
    } if (searchText && searchIsTrue && searchData.length == 0) {
      setPaginatedPosts(_(searchData).slice(0).take(0).value());
    } if (!searchIsTrue) {
      http
        .get(import.meta.env.VITE_API_URL + 'api/student/list/get')
        .then((res) => {
          setPaginatedPosts(_(res.data.data).slice(0).take(pageSize).value());
          setGetData(res.data.data);
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
  }, [searchData]);

  let data = [];
  const pageCount =
    searchData.length >= 1
      ? Math.ceil(1)
      : searchText && searchIsTrue && searchData.length == 0 ?
        Math.ceil(0)
        : getData
          ? Math.ceil(getData.length / pageSize)
          : 0;
  const pages = _.range(1, pageCount + 1);

  const pagination = (pageNo) => {
    let pageNumber = Number(pageNo);
    const startIndex = (pageNumber - 1) * pageSize;
    const paginatedPost = _(getData).slice(startIndex).take(pageSize).value();
    setPaginatedPosts(paginatedPost);
  };




  if (paginatedPosts) {
    data = paginatedPosts.map((e, index) => {
      const fullname = `${e.firstname} ${e.lastname}`;
      return (
        <tr key={index}>
          <td style={{ paddingLeft: '10px' }}>
            <Checkbox
              type={'checkbox'}
              name="id"
              value={e.id}
              id={e.id}
              onChange={inChecked}
              checked={inCheckedTrue.includes(e.id)}
            />
          </td>
          <td className='text-left tnumber'>{index + 1}.</td>
          <td className='text-left'>
            <Tooltip
              title={fullname}
              arrow
              TransitionComponent={Fade}
              placement="top"
            >
              <p style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '14vw' }}>{fullname}</p>
            </Tooltip>
          </td>
          <td className='text-left' style={{ textAlign: 'center' }}><p>{e.Fphone}</p></td>
          <td className='text-left' style={{ textAlign: 'center' }}>
            <Tooltip
              title={e.groups?.name}
              arrow
              TransitionComponent={Fade}
              placement="top"
            >
              <p style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: user?.user?.role == 'casher' || user?.user?.role == 'super' ? '14vw' : ''  }}>{e.groups?.name}</p>
            </Tooltip>
          </td>
          <td className='text-left' style={{ textAlign: 'center' }}>
            <Tooltip
              title={e.teacher?.firstname + ' ' + e.teacher?.lastname}
              arrow
              TransitionComponent={Fade}
              placement="top"
            >
              <p style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: user?.user?.role == 'casher' || user?.user?.role == 'super' ? '14vw' : '' }}>{e.teacher?.firstname + ' ' + e.teacher?.lastname}</p>
            </Tooltip>

          </td>
          <td className='paidAdd' style={{ textAlign: 'center', display: user?.user?.role == 'casher' || user?.user?.role == 'super' ? '' : 'none'}}>
            <button
              className='paidBtn'
              id={`delete${e.id}`}
              onClick={() => {
                functionOpenModal(e);
              }}
            >
              To&apos;lov qilish
            </button>
          </td>
          <td className='action'>

            <Link to={`/student/${e.id}`} className='eye'>
              <Tooltip
                title="Ma'lumotlar"
                arrow
                TransitionComponent={Fade}
                placement="top"
              >
                <i className='fa-solid fa-eye'></i>
              </Tooltip>
            </Link>{' '}
          </td>
        </tr >
      );
    });
  }

  const functionOpenModal = (e) => {
    setPayModal(true);
    setGroupName(paginatedPosts);
    setDeleteId(e.id);
    setStudentId(e.id);
    setMonthSumma(e.groups);
  };

  let name = [];
  if (groupName && deleteId) {
    name = groupName.filter((e) => {
      if (e) {
        return e.id == deleteId ? e : '';
      }
    });
  }


  useEffect(() => {
    if (selectGroup) {
      setFilterGroupsSumma(monthSumma.month_payment);
      setAllMonthGiven(monthSumma.month_payment);
    }
  }, [selectGroup]);

  const handleChangeSelect = (event) => {
    setSelectGroup(event.target.value);
  };

  const changeSelect = (e) => {
    handleChangeSelect(e);
  };

  const closeAndSave = () => {
    setPayModal(false);
    setSaleInfo(0);
    setErrorSum(false);
    setMessageLimit(false);
    setSelectGroup('');
    setErrorSelect(false);
    setAllMonthGiven(0);
    setFilterGroupsSumma(0);
  };

  const saveBuyModal = () => {
    if (
      payMethod && allMonthGiven && selectGroup || allMonthGiven !== 0 && saleInfo !== 0
    ) {
      if (allMonthGiven > filterGroupsSumma) {
        setLimitOpen(true);
      } else {
        setLimitOpen(false);
        setLoderTime(true);
        http
          .post(import.meta.env.VITE_API_URL + 'api/payment/add', {
            student_id: studentId,
            group_id: selectGroup,
            all_summa: Number(filterGroupsSumma),
            given_summa: Number(allMonthGiven),
            sale: Number(saleInfo),
            payment_type: payMethod
          })
          .then(() => {
            setPayModal(false);
            setSaleInfo(0);
            setErrorSum(false);
            setErrorSelect(false);
            setAllMonthGiven(0);
            setFilterGroupsSumma(0);
            setSelectGroup('');
            setPayMethod('');
            setLoderTime(false);
          })
          .catch((e) => {
            console.log(e);
          });
      }
    } else {
      if (!selectGroup) {
        setErrorSelect(true);
      } else {
        setErrorSelect(false);
      }
      if (!payMethod) {
        setErrorPayMethod(true);
      } else {
        setErrorPayMethod(false);
      }
      if (!allMonthGiven || allMonthGiven == 0 && saleInfo == 0) {
        setErrorSum(true);
        setMessageLimit(true);
      } else {
        setErrorSum(false);
        setMessageLimit(false);
      }
    }
  };

  const limitYes = () => {
    setLimitOpen(false);
    setLoderTime(true);
    http
      .post(import.meta.env.VITE_API_URL + 'api/payment/add', {
        student_id: studentId,
        group_id: selectGroup,
        all_summa: filterGroupsSumma,
        given_summa: allMonthGiven,
        sale: Number(saleInfo),
      })
      .then(() => {
        setPayModal(false);
        setSaleInfo(0);
        setErrorSum(false);
        setErrorSelect(false);
        setFilterGroupsSumma(0);
        setAllMonthGiven(0);
        setSelectGroup('');
        setLoderTime(false);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const limitNow = () => {
    setLimitOpen(false);
    setMessageLimit(true);
  };

  const hedelSum = (e) => {
    setAllMonthGiven(e.target.value);
    setErrorSum(false);
    setMessageLimit(false);
  };

  const saleChangeFun = (value) => {
    setSaleInfo(value.target.value);
  };

  const changePayMethod = (e) => {
    setPayMethod(e.target.value);
  };

  return (
    <div>
      <Loder stop={loderTime} />
      <Table>
        <TableHead>
          <tr>
            <th className='text-left' style={{ width: '4%' }}>
            </th>
            <th className='text-left tnumber' style={{ width: '5%' }}>
              <p>T/r</p>
            </th>
            <th className='text-left' style={{ width: '18%' }}>
              <p>Ismi familyasi</p>
            </th>
            <th className='text-left' style={{ width: '15%', textAlign: 'center' }}>
              <p>Telefon</p>
            </th>
            <th className='text-left' style={{ width: user?.user?.role == 'casher' || user?.user?.role == 'super' ? '18%' : '26%', textAlign: 'center' }}>
              <p>Guruhi</p>
            </th>
            <th className='text-left' style={{ width: user?.user?.role == 'casher' || user?.user?.role == 'super' ? '18%' : '23%', textAlign: 'center' }}>
              <p>Ustozi</p>
            </th>
            <th className='paidAdd text-left' style={{ width: '11%', textAlign: 'center', display: user?.user?.role == 'casher' || user?.user?.role == 'super' ? '' : 'none' }}>
              <p>To&apos;lov qilish</p>
            </th>
            <th className='actionTable'>
              <p>Amallar</p>
            </th>
          </tr>
        </TableHead>
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
              {name &&
                name.map((e) => {
                  const fullname = `${e.firstname} ${e.lastname} `;
                  return <h2 key={e.id} style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>{fullname}</h2>;
                })}
              <p style={{ marginTop: '0.5rem' }}>
                Ushbu o&apos;quvchiga to&apos;lov qilish
              </p>
            </div>
            <Box sx={{ minWidth: 120, mt: 12, pb: 3 }}>
              <FormControl fullWidth>
                <InputLabel id='demo-simple-select-label'>
                  To&apos;lov qilinadigan guruh
                </InputLabel>
                <Select
                  labelId='demo-simple-select-label'
                  id='demo-simple-select'
                  value={selectGroup}
                  label="To'lov qilinadigan guruh"
                  onChange={changeSelect}
                >
                  <MenuItem value={monthSumma.id}>
                    {monthSumma.name}
                  </MenuItem>
                </Select>
                <FormHelperText
                  style={{
                    display: errorSelect ? 'block' : 'none',
                    color: '#d32f2f',
                  }}
                >
                  Guruhni tanlang
                </FormHelperText>
              </FormControl>
            </Box>
            <NumericInput
              sx={{ pb: 3 }}
              fullWidth
              precision={''}
              decimalChar=','
              thousandChar='.'
              label="Oylik to'lov summasi"
              value={allMonthGiven}
              onChange={(e) => hedelSum(e)}
              variant='outlined'
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
              sx={{ pb: 3 }}
              precision={''}
              decimalChar=','
              thousandChar='.'
              inputProps={{
                maxLength: 8,
                minLength: 0,
              }}
              label='Chegirma summasi'
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
              className='buy_btn_modal'
              variant='contained'
              onClick={saveBuyModal}
            >
              Saqlash
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
              <Button variant='contained' color='error' onClick={limitNow}>
                Yo&apos;q
              </Button>
              <Button
                style={{ background: '#042954', marginLeft: '1rem' }}
                variant='contained'
                onClick={limitYes}
              >
                Ha
              </Button>
            </div>
          </Box>
        </Modal>
        <TableBody>{data}</TableBody>
      </Table>

      <PaginationSection>
        <Stack spacing={3}>
          <Pagination
            color='primary'
            variant='outlined'
            shape='rounded'
            onChange={(e, value) => pagination(value)}
            count={pages.length}
          />
        </Stack>
      </PaginationSection>
    </div>
  );
};
AllStudentsTable.propTypes = {
  searchText: PropTypes.string.isRequired,
  searchData: PropTypes.array.isRequired,
  pageSize: PropTypes.number.isRequired,
  age: PropTypes.number.isRequired,
  searchIsTrue: PropTypes.bool.isRequired,
  inChecked: PropTypes.func.isRequired,
  inCheckedTrue: PropTypes.array.isRequired,
};

export default AllStudentsTable;
