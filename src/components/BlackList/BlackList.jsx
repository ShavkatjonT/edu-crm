import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import http from '../../http/index';
import { Context } from '../../index';
import { Link } from 'react-router-dom';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
const Container = styled.div`
  margin-top: 1.8rem;
  padding-top: 10px;
  padding-bottom: 10px;
  background-color: white;
  border-radius: 6px;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.25);
`;

const ContentSkeleton = styled.div`
  margin-top: 1.8rem;
  padding-top: 2rem;
  padding-left: 2rem;
  padding-right: 2rem;
  padding-bottom: 2rem;
  background-color: white;
  border-radius: 6px;
  cursor: wait;
`;

const Header = styled.div`
  background-color: white;
  display: flex;
  align-items: center;
  padding: 10px 20px 30px;
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
`;

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
  .actionTable{
    text-align: right;
    padding-right: 20px;
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
    text-align: right;
    padding-right: 33px;
  }
`;

const BlackList = () => {
  //   const data = window.location.href.split('/');
  const [skeletonTime, setSkeletonTime] = useState(true);
  const [blackListData, setBlackListData] = useState([]);
  const { user } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    http
      .get(import.meta.env.VITE_API_URL + 'api/blacklist/student/get')
      .then((res) => {
        console.log(43, res.data);
        setSkeletonTime(false);
        setBlackListData(res.data);
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

  let studentData = [];

  if (blackListData) {
    studentData = blackListData.map((info, index) => {
      const fullname = `${info.firstname} ${info.lastname}`;
      return (
        <tr key={info.id}>
          <td className="text-left tnumber" style={{paddingLeft: '23px', paddingRight: '20px'}}>{index + 1}.</td>
          <td className="text-left">{fullname}</td>
          <td className="text-left">{info.fatherPhone}</td>
          <td className="action">
            <Link to={`/student/${info.id}`} className="eye">
              <i className="fa-solid fa-eye"></i>
            </Link>{' '}
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
            <Skeleton width="50%" height="2rem" />
            <Skeleton width="70%" height="2rem" />
            <Skeleton width="85%" height="2rem" />
            <Skeleton width="100%" height="2rem" />
          </Box>
        </ContentSkeleton>
      ) : (
        <Container>
          <Header>
            <h2>Qora ro&apos;yhat</h2>
            <HeaderRight></HeaderRight>
          </Header>
          <Table>
            <TableHead>
              <tr>
                <th className="text-left tnumber" style={{ width: '9%' }}>
                  <p>T/r</p>
                </th>
                <th className="text-left">
                  <p>Ismi familyasi</p>
                </th>
                <th className="text-left">
                  <p>Telefon</p>
                </th>
                <th className="actionTable">
                  <p>Amallar</p>
                </th>
              </tr>
            </TableHead>
            <TableBody>{studentData}</TableBody>
          </Table>
        </Container>
      )}
    </div>
  );
};

export default BlackList;
