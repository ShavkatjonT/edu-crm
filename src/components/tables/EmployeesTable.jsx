import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../index';
import { HiUserAdd } from 'react-icons/hi';
import http from '../../http/index';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';
import Skeleton from '@mui/material/Skeleton';

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
const SectionOne = styled.div`
 
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
    width: 15%;
    text-align: left;
    padding-left: 1%;
  }
  .name_th {
    width: 30%;
    text-align: left;
  }
  .phone_th {
    width: 20%;
    text-align: left;
  }
  .birthday_th {
    width: 20%;
    text-align: center;
  }
  .action_th {
    width: 15%;
    text-align: right;
    padding-right: 10px;
  }
`;
const Section = styled.tbody`
  width: 100%;
  tr {
    height: 50px;
    &:nth-child(even) {
      background-color: #f8f8f8;
    }
    display: flex;
  }
  td {
    padding-top: 1%;
  }
  .number_table {
    width: 15%;
    text-align: left;
    padding-left: 1.5%;
  }
  .name {
    width: 30%;
    text-align: left;
  }
  .phone {
    width: 20%;
    text-align: left;
  }
  .birthday {
    width: 20%;
    text-align: center;
  }
  .action {
    width: 15%;
    text-align: right;
    padding-right: 20px;
  }

  .eye {
    background-color: initial;
    color: #313131;
    border: none;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.5;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
    &:hover {
      color: #5a5a5a;
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
`;
function TeacherTable() {
  const navigate = useNavigate();
  const { user } = useContext(Context);
  const [dataGetTeachers, setDataGetTeachers] = useState([]);
  const [dataGetAdmins, setDataGetAdmins] = useState([]);
  const [dataGetCashers, setDataGetCashers] = useState([]);
  const [dataGetCeo, setDataGetCeo] = useState([]);
  const [skeletonTime, setSkeletonTime] = useState(true);


  useEffect(() => {
    if (user?.user?.role == 'admin' || user?.user?.role == 'casher') {
      http
        .get(import.meta.env.VITE_API_URL + 'api/teacher/all/list/get')
        .then((r) => {
          setDataGetTeachers(r.data);
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
    }
    if (user?.user?.role == 'super') {
      http
        .get(import.meta.env.VITE_API_URL + 'api/teacher/employee-all/list')
        .then((r) => {
          setDataGetTeachers(r.data?.teacherData);
          setDataGetAdmins(r.data?.adminData);
          setDataGetCashers(r.data?.casherData);
          setDataGetCeo(r.data?.ceoData);
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
    }
  }, []);
  let dataTeachers;
  let dataAdmins;
  let dataCashers;
  let dataCeo;

  if (dataGetTeachers) {
    dataTeachers = dataGetTeachers.map((e, index) => {
      return (
        <tr className="groups_all_informations" key={e.id}>
          <td className="number_table">{index + 1}</td>
          <td className="name">{e.name}</td>
          <td className="phone">{e.phone}</td>
          <td className="birthday">{e.birthday}</td>
          <td className="action">
            <Tooltip
              title="Ma&apos;lumotlar"
              arrow
              TransitionComponent={Fade}
              placement="top"
            >
              <Link to={`/employee-data/${e.id}`} className="eye">
                <i className="fa-solid fa-eye"></i>
              </Link>
            </Tooltip>
          </td>
        </tr>
      );
    });
  }
  if (dataGetAdmins) {
    dataAdmins = dataGetAdmins.map((e, index) => {
      return (
        <tr className="groups_all_informations" key={e.id}>
          <td className="number_table">{index + 1}</td>
          <td className="name">{e.name}</td>
          <td className="phone">{e.phone}</td>
          <td className="birthday">{e.birthday}</td>
          <td className="action">
            <Tooltip
              title="Ma&apos;lumotlar"
              arrow
              TransitionComponent={Fade}
              placement="top"
            >
              <Link to={`/employee-data/${e.id}`} className="eye">
                <i className="fa-solid fa-eye"></i>
              </Link>
            </Tooltip>
          </td>
        </tr>
      );
    });
  }
  if (dataGetCashers) {
    dataCashers = dataGetCashers.map((e, index) => {
      return (
        <tr className="groups_all_informations" key={e.id}>
          <td className="number_table">{index + 1}</td>
          <td className="name">{e.name}</td>
          <td className="phone">{e.phone}</td>
          <td className="birthday">{e.birthday}</td>
          <td className="action">
            <Tooltip
              title="Ma&apos;lumotlar"
              arrow
              TransitionComponent={Fade}
              placement="top"
            >
              <Link to={`/employee-data/${e.id}`} className="eye">
                <i className="fa-solid fa-eye"></i>
              </Link>
            </Tooltip>
          </td>
        </tr>
      );
    });
  }
  if (dataGetCeo) {
    dataCeo = dataGetCeo.map((e, index) => {
      return (
        <tr className="groups_all_informations" key={e.id}>
          <td className="number_table">{index + 1}</td>
          <td className="name">{e.name}</td>
          <td className="phone">{e.phone}</td>
          <td className="birthday">{e.birthday}</td>
          <td className="action">
            <Tooltip
              title="Ma&apos;lumotlar"
              arrow
              TransitionComponent={Fade}
              placement="top"
            >
              <Link to={`/employee-data/${e.id}`} className="eye">
                <i className="fa-solid fa-eye"></i>
              </Link>
            </Tooltip>
          </td>
        </tr>
      );
    });
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
          <div>
            <Container>
              <Header>
                <div>
                  <h2>Xodimlar</h2>
                </div>
                <HeaderRight>
                  <SectionOne>
                      <Tooltip
                        title="Xodim qo&apos;shish"
                        arrow
                        TransitionComponent={Fade}
                        placement="top"
                      >
                        <Link to={'/employees/add-employee'} style={{display: user?.user?.role == 'admin' || user?.user?.role == 'super' ? 'inherit' : 'none'}}>
                          <button className='addTeacher'>
                            <HiUserAdd></HiUserAdd>
                          </button>
                        </Link>
                      </Tooltip>
                  </SectionOne>
                </HeaderRight>
              </Header>
              <div style={{ display: user?.user?.role == 'super' ? 'block' : 'none', width: '100%', borderBottom: '2px dashed gray', paddingBottom: '20px' }}>
                <h3 style={{ padding: '20px 20px', fontSize: '18px', color: '#151552' }}>Ceo</h3>
                <Table>
                  <thead>
                    <TableHeader>
                      <th className="number_th">
                        <p>T/r</p>
                      </th>
                      <th className="name_th">
                        <p>Ismi</p>
                      </th>
                      <th className="phone_th">
                        <p>Telefon</p>
                      </th>
                      <th className="birthday_th">
                        <p>Tug&apos;ilgan sana</p>
                      </th>
                      <th className="action_th">
                        <p>Amallar</p>
                      </th>
                    </TableHeader>
                  </thead>
                  <Section>
                    {dataCeo.length > 0 ? dataCeo : <em style={{ display: 'block', color: '#ababab', fontSize: '14px', paddingLeft: '20px', paddingTop: '15px' }}>Mavjud emas</em>}
                  </Section>
                </Table>
              </div>
              <div style={{ display: user?.user?.role == 'super' ? 'block' : 'none', width: '100%', borderBottom: '2px dashed gray', paddingBottom: '20px' }}>
                <h3 style={{ padding: '20px 20px', fontSize: '18px', color: '#151552' }}>Administratorlar</h3>
                <Table>
                  <thead>
                    <TableHeader>
                      <th className="number_th">
                        <p>T/r</p>
                      </th>
                      <th className="name_th">
                        <p>Ismi</p>
                      </th>
                      <th className="phone_th">
                        <p>Telefon</p>
                      </th>
                      <th className="birthday_th">
                        <p>Tug&apos;ilgan sana</p>
                      </th>
                      <th className="action_th">
                        <p>Amallar</p>
                      </th>
                    </TableHeader>
                  </thead>
                  <Section>
                    {dataAdmins.length > 0 ? dataAdmins : <em style={{ display: 'block', color: '#ababab', fontSize: '14px', paddingLeft: '20px', paddingTop: '15px' }}>Mavjud emas</em>}
                  </Section>
                </Table>
              </div>
              <div style={{ display: user?.user?.role == 'super' ? 'block' : 'none', width: '100%', borderBottom: '2px dashed gray', paddingBottom: '20px' }}>
                <h3 style={{ padding: '20px 20px', fontSize: '18px', color: '#151552' }}>Hisobchilar</h3>
                <Table>
                  <thead>
                    <TableHeader>
                      <th className="number_th">
                        <p>T/r</p>
                      </th>
                      <th className="name_th">
                        <p>Ismi</p>
                      </th>
                      <th className="phone_th">
                        <p>Telefon</p>
                      </th>
                      <th className="birthday_th">
                        <p>Tug&apos;ilgan sana</p>
                      </th>
                      <th className="action_th">
                        <p>Amallar</p>
                      </th>
                    </TableHeader>
                  </thead>
                  <Section>
                    {dataCashers.length > 0 ? dataCashers : <em style={{ display: 'block', color: '#ababab', fontSize: '14px', paddingLeft: '20px', paddingTop: '15px' }}>Mavjud emas</em>}
                  </Section>
                </Table>
              </div>
              <div style={{ display: user?.user?.role == 'super' || user?.user?.role == 'casher' || user?.user?.role == 'admin' ? 'block' : 'none', width: '100%', borderBottom: '2px dashed gray', paddingBottom: '20px' }}>
                <h3 style={{ padding: '20px 20px', fontSize: '18px', color: '#151552' }}>O&apos;qituvchilar</h3>
                <Table>
                  <thead>
                    <TableHeader>
                      <th className="number_th">
                        <p>T/r</p>
                      </th>
                      <th className="name_th">
                        <p>Ismi</p>
                      </th>
                      <th className="phone_th">
                        <p>Telefon</p>
                      </th>
                      <th className="birthday_th">
                        <p>Tug&apos;ilgan sana</p>
                      </th>
                      <th className="action_th">
                        <p>Amallar</p>
                      </th>
                    </TableHeader>
                  </thead>
                  <Section>
                    {dataTeachers.length > 0 ? dataTeachers : <em style={{ display: 'block', color: '#ababab', fontSize: '14px', paddingLeft: '20px', paddingTop: '15px' }}>Mavjud emas</em>}
                  </Section>
                </Table>
              </div>
            </Container>
          </div>
        )
      }
    </div>
  );
}

export default TeacherTable;
