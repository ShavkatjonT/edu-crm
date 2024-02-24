import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../index';
import http from '../../http/index';
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
  margin-bottom: 1.8rem;
  padding-top: 10px;
  padding-bottom: 10px;
  background-color: white;
  border-radius: 6px;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.25);
`;
const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 15px 20px;
  justify-content: space-between;
   h2{
    color: rgb(4, 41, 84);
  }
`;
const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;
  width: 50%;
`;
const SectionOne = styled.div`
  .addGroup {
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
const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
  border: 1px solid #efefef;
  color: #7d7d7d;
  background-color: #ffffff;
  border-bottom: none;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
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
  border-bottom: 1px solid #efefef;
  .number_th {
    width: 16%;
    text-align: left;
    padding-left: 1.5%;
  }
  .name_th {
    width: 25%;
    text-align: left;
  }
  .teacher_th {
    width: 25%;
    text-align: left;
  }
  .count_th {
    width: 44%;
    text-align: center;
  }
  .pay_th {
    width: 30%;
    text-align: center;
  }
  .action_th {
    width: 15%;
    text-align: right;
    padding-right: 14px;
  }
`;

const Section = styled.tbody`
  width: 100%;
  border-radius: 15px;
  tr {
    min-height: 50px;
    padding-top: 4px;
    &:nth-child(even) {
      background-color: #f8f8f8;
    }
    display: flex;
  }
  td {
    padding-top: 1%;
  }
  .number_table {
    width: 16%;
    text-align: left;
    padding-left: 2%;
  }
  .name_groups {
    width: 25%;
    text-align: left;
  }
  .pupils_number {
    width: 44%;
    text-align: center;
  }
  .name_teacher {
    width: 25%;
    text-align: left;
  }
  .pupils_buy {
    width: 30%;
    text-align: center;
  }
  .action {
    width: 15%;
    text-align: right;
    padding-right: 24px;
  }
  .edit {
    background-color: initial;
    i {
      color: #585353;
    }
    border: none;
    font-size: 1rem;
    margin-left: 1rem;
    margin-right: 1rem;
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
  .message_btn {
    background-color: initial;
    color: #fdc600;
    border: none;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s;
    &:hover {
      color: #ffd84a;
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
`;

function ArrivalsReport() {
  const { user } = useContext(Context);
  const navigate = useNavigate();
  const [dataGet, setDataGet] = useState([]);
  const [skeletonTime, setSkeletonTime] = useState(true);
  const [dataUpdate, setDataUpdate] = useState(false);
  const [errorIsStudent, seterrorIsStudent] = useState(false);
  useEffect(() => {
    http
      .get(import.meta.env.VITE_API_URL + 'api/group/teacher-groups/get')
      .then((res) => {
        setDataGet(res.data.teacherGroupList);
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
  let data;
  let i = 1;

  useEffect(() => {
    if (dataUpdate) {
      http
        .get(import.meta.env.VITE_API_URL + 'api/group/teacher-groups/get')
        .then((res) => {
         setDataGet(res.data.teacherGroupList);
          setDataUpdate(false);
          setSkeletonTime(false);
        })
        .catch((error) => {
          setDataUpdate(false);
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
  }, [dataUpdate]);

  const handleCloseBar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    seterrorIsStudent(false);
  };

  if (dataGet) {
    data = dataGet.map((e) => {
      return (
        <tr className="groups_all_informations" key={e.id}>
          <td className="number_table">{i++}.</td>
          <td className="name_groups">
              {e.name}
          </td>
          {/* <td className="name_teacher">{e.phone}</td> */}
          <td className="pupils_number">
            {e.groups_count ? e.groups_count : 0}
          </td>
          <td className="action">
            <Tooltip
              title="Hisobotlarni ko'rish"
              arrow
              TransitionComponent={Fade}
              placement="top"
            >
              <Link to={`/arrivals-info/${e.id}`} className="eye">
                <i className="fa-solid fa-chart-bar"></i>
              </Link>
            </Tooltip>
          </td>
        </tr>
      );
    });
  }




  return (
    <div>
      {skeletonTime ? (
        <ContentSkeleton>
          <Box sx={{ width: '100%' }}>
            <Skeleton width="30%" height="2rem" />
            <Skeleton width="40%" height="2rem" />
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
                <h2>O&apos;qituvchilar</h2>
              </div>
              <HeaderRight>
                <SectionOne></SectionOne>
              </HeaderRight>
            </Header>
          <Table>
            <thead>
              <TableHeader>
                <th className="number_th">
                  <p>T/r</p>
                </th>
                <th className="name_th">
                  <p>O&apos;qituvchi</p>
                </th>
                <th className="count_th">
                  <p>Guruhlar soni</p>
                </th>
                <th className="action_th">
                  <p>Amallar</p>
                </th>
              </TableHeader>
            </thead>

            <Section>{data}</Section>
            <Snackbar
              open={errorIsStudent}
              onClose={handleCloseBar}
              severity={'error'}
              massage={'Guruhda o\'quvchi mavjud emas'}
            />
          </Table>
          </Container>
        </div>
      )}
    </div>
  );
}

export default ArrivalsReport;
