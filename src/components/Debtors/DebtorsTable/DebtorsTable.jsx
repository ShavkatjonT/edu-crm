import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import http from '../../../http/index';
import Loder from '../../loder/Loder';
import { Context } from '../../../index';
import { useNavigate } from 'react-router-dom';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import NumericInput from 'material-ui-numeric-input';
import { NumericFormat } from 'react-number-format';
import { FormHelperText, Select, MenuItem, FormControl, InputLabel } from '@mui/material';


const ContentSkeleton = styled.div`
  padding-top: 2rem;
  padding-left: 2rem;
  padding-right: 2rem;
  padding-bottom: 2rem;
  background-color: white;
  border-radius: 6px;
  cursor: wait;
`;

const Container = styled.div`
  margin-top: 1.8rem;
  padding-top: 10px;
  padding-bottom: 10px;
  background-color: white;
  border-radius: 6px;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.25);
`;
const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 20px;
  justify-content: space-between;
`;
const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 40px;
`;
const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
  border: 1px solid #efefef;
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
    height: auto;
    border-right: none;
  }
  .number {
    width: 6%;
    text-align: center;
  }
  .name {
    width: 21%;
  }
  .wallet {
    width: 14%;
    text-align: left;
  }
  .amount {
    width: 16%;
    text-align: left;
  }
  .month {
    width: 24%;
    text-align: center;
  }
  .paidAdd {
    width: 18%;
    text-align: center;
  }
  .action {
    width: 9%;
    text-align: center;
    padding-right: 10px;
  }
  .allsumma {
    width: 18%;
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
    height: 50px;
    padding-top: 10px;
    padding-bottom: 10px;
    text-align: left;
    &:nth-child(even) {
      background-color: #f8f8f8;
    }
    height: auto;
    display: flex;
    align-items: center;
  }

  .number {
    width: 6%;
    text-align: center;
  }
  .name {
    width: 21%;
    text-align: left;
  }

  .wallet {
    width: 14%;
    padding-left: 0.1rem;
    text-align: left;
  }
  .amount {
    padding-left: 0.2rem;
    width: 16%;
  }
  .month {
    width: 24%;
    text-align: center;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: center;
  }
  .paidAdd {
    width: 18%;
    text-align: center;
  }
  .action {
    width: 9%;
    text-align: center;
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
  .edit {
    background-color: initial;
    color: #6cb324;
    border: none;
    font-size: 0.9rem;
    margin-left: 1rem;
    margin-right: 1rem;
    cursor: pointer;
    transition: all 0.5;
    &:hover {
      color: #74e007;
      transform: scale(1.19);
    }
  }
  .delete {
    background-color: initial;
    color: #c20404;
    border: none;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.5;
    &:hover {
      color: #ff0808;
      transform: scale(1.19);
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
  .date {
    font-size: 0.9rem;
    margin: 0.3rem 0rem;
    background-color: #6c757d;
    color: white;
    width: 105px;
    height: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
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

const DebtorsTable = () => {
  const navigate = useNavigate();
  const { user } = useContext(Context);
  const urlID = window.location.href.split('/');
  const [debtorData, setDebtorData] = useState([]);
  const [loderTime, setLoderTime] = useState(false);
  const [allMonthGiven, setAllMonthGiven] = useState(0);
  const [payModal, setPayModal] = useState(false);
  const [selectMonth, setSelectMonth] = useState('');
  const [namesUser, setNamesUser] = useState('');
  const [deleteId, setDeleteId] = useState('');
  const [limitOpen, setLimitOpen] = useState(false);
  const [givenSum, setGivenSum] = useState('');
  const [allSumma, setAllSumma] = useState('');
  const [errorSum, setErrorSum] = useState(false);
  const [skeletonTime, setSkeletonTime] = useState(true);
  const [errorPayMethod, setErrorPayMethod] = useState(false);
  const [payMethod, setPayMethod] = useState('');
  const [dataUpdate, setDataUpdate] = useState(false);

  let number = 1;

  useEffect(() => {
    http
      .post(import.meta.env.VITE_API_URL + `api/debtor/get/${urlID[4]}`, {})
      .then((res) => {
        setDebtorData(res.data);
        setSkeletonTime(false);
      })
      .catch((error) => {
        if (
          error.response.data.message == 'ro\'yxattan o\'tmagan foydalanuvchi!'
        ) {
          user.setIsAuth(false);
          localStorage.clear();
          navigate('/');
        } else if (
          error.response.data.message.original.routine == 'string_to_uuid'
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
        .post(import.meta.env.VITE_API_URL + `api/debtor/get/${urlID[4]}`, {})
        .then((res) => {
          setDebtorData(res.data);
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
          } else if (
            error.response.data.message.original.routine == 'string_to_uuid'
          ) {
            navigate('*');
          } else {
            console.log(error);
          }
        });
    }
  }, [dataUpdate]);

  const hedelSum = (e) => {
    setGivenSum(e.target.value);
    setErrorSum(false);
  };

  const data =
    debtorData &&
    debtorData.map((e) => {
      return (
        <tr key={e.id}>
          <td className="number">{number++}.</td>
          <td className="name">{e.name}</td>
          <td className="wallet">{e.wallet ? e.wallet : 0}</td>
          <td className="amount">  <NumericFormat
            value={e.amount}
            displayType={'text'}
            thousandSeparator={true}
            prefix={''}
          /> so&apos;m</td>
          <td className="month">
            {e.months &&
              e.months.map((el) => (
                <p key={el.id} className="date">
                  {el.month}
                </p>
              ))}
          </td>
          <td className="paidAdd">
            <button
              className="paidBtn"
              id={`delete${e.id}`}
              onClick={() => {
                functionOpenModal(e);
              }}
            >
              To&apos;lov qilish
            </button>
          </td>
          <td className="action">
            <Link to={`/student/${e.id}`} className="eye">
              <i className="fa-solid fa-eye"></i>
            </Link>{' '}
          </td>
        </tr>
      );
    });

  const functionOpenModal = (e) => {
    setPayModal(true);
    setNamesUser(debtorData);
    setDeleteId(e.id);
    setAllSumma(e.amount);
  };

  let name = [];
  let filterGroups = [];
  if (namesUser && deleteId) {
    name = namesUser.filter((e) => {
      if (e) {
        return e.id == deleteId ? e : '';
      }
    });
  }
  if (namesUser && deleteId) {
    namesUser.map((e) => {
      if (e.id == deleteId) {
        return (filterGroups = e.months);
      }
    });
  }

  useEffect(() => {
    let moneyMonth =
      filterGroups &&
      filterGroups.find((e) => {
        return e.id == selectMonth;
      });
    moneyMonth && setAllMonthGiven(moneyMonth.amount);
  }, [selectMonth]);

  const closeAndSave = () => {
    setPayModal(false);
    setAllMonthGiven(0);
    setSelectMonth('');
    setErrorSum(false);
    // setErrorSelect(false);
  };

  const saveBuyModal = () => {
    if (payMethod && givenSum || givenSum !== 0 && allMonthGiven !== 0) {
      if (givenSum > allSumma) {
        setLimitOpen(true);
      } else {
        setLimitOpen(false);
        setLoderTime(true);
        http
          .post(import.meta.env.VITE_API_URL + 'api/debtor/delete', {
            student_id: name && name[0].id,
            group_id: urlID[4],
            given_summa: Number(givenSum),
            sale: Number(allMonthGiven),
            payment_type: payMethod
          })
          .then(() => {
            setPayModal(false);
            setAllMonthGiven(0);
            setSelectMonth('');
            setDataUpdate(true);
            setLoderTime(false);
          })
          .catch((e) => {
            console.log(e);
          });
      }
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


  const limitYes = () => {
    setLimitOpen(false);
    setLoderTime(true);
    http
      .post(import.meta.env.VITE_API_URL + 'api/debtor/delete', {
        student_id: name && name[0].id,
        group_id: urlID[4],
        given_summa: Number(givenSum),
        sale: Number(allMonthGiven),
        payment_type: payMethod
      })
      .then(() => {
        setPayModal(false);
        setAllMonthGiven(0);
        setSelectMonth('');
        setDataUpdate(true);
        setLoderTime(false);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const limitNow = () => {
    setLimitOpen(false);
  };

  const hedelSumTwo = (e) => {
    setAllMonthGiven(e.target.value);
  };


  const changePayMethod = (e) => {
    setPayMethod(e.target.value);
  };

  return (
    <div>
      <Container>
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
          <div>
            <Header>
              <div>
                <h2>Qarzdorlar</h2>
              </div>
              <HeaderRight></HeaderRight>
            </Header>
            <Table>
              <thead>
                <TableHeader>
                  <th className="number">
                    <p>T/r</p>
                  </th>
                  <th className="name">
                    <p>Ismi familyasi</p>
                  </th>
                  <th className="wallet">
                    <p>Hamyon</p>
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
                </TableHeader>
              </thead>
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
                      paddingTop: '20px',
                      paddingBottom: '20px',
                      paddingLeft: '30px',
                      top: 0,
                      background: '#FDC600',
                    }}
                  >
                    {name &&
                      name.map((e) => {
                        return <h2 key={e.id}>{e.name} </h2>;
                      })}
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
                    Saqlash
                  </Button>
                </Box>
              </Modal>
              <Modal open={limitOpen}>
                <Box sx={styleLimit}>
                  <p style={{ fontWeight: 'bold', color: '#FDC600' }}>
                    Siz to&apos;layotgan summa to&apos;lanishi kerak
                    bo&apos;lgan summadan yuqori
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
                    <Button
                      variant="contained"
                      color="error"
                      onClick={limitNow}
                    >
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
              <Section>{data && data}</Section>
            </Table>
          </div>
        )}
      </Container>
    </div>
  );
};

export default DebtorsTable;
