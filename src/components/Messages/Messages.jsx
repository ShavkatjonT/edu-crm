/* eslint-disable react/jsx-key */
import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import http from '../../http/index';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../index';
import MessageTable from './MessagesTable';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';

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

const Container = styled.div`
  margin-top: 1.8rem;
  padding-top: 10px;
  padding-bottom: 10px;
  background-color: white;
  border-radius: 6px;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.25);
  h2 {
    margin-left: 20px;
    margin-top: 15px;
    color: rgb(4,41,84);
}
`;

const Table = styled.table`
  margin-top: 1rem;
  border-collapse: collapse;
  width: 100%;
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
    border-right: none;
  }
`;

const TableHeader = styled.tr`
  width: 100%;
  display: flex;
  text-align: left;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #efefef;
  background-color: #ffffff;
  .number {
    width: 7%;
    text-align: center;
  }
  .name {
    width: 26%;
  }
  .phone {
    width: 19%;
    text-align: left;
  }
  .pay {
    width: 25%;
    text-align: left;
  }

  .paidAdd {
    width: 23%;
    text-align: center;
  }
  .action {
    width: 23%;
    text-align: left;
    padding-right: 10px;
  }
  .messages {
    overflow-y: auto;
    min-height: 120px;
  }
`;

const Messages = () => {
  const navigate = useNavigate();
  const { user } = useContext(Context);
  const [getData, setGetData] = useState([]);
  const [skeletonTime, setSkeletonTime] = useState(true);

  useEffect(() => {
    http
      .get(import.meta.env.VITE_API_URL + 'api/message/get')
      .then((res) => {
        setGetData(res.data);
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

  // let data = [];
  // if (getData) {
  //   data = getData.map((e, i) => {
  //     if (e) {
  //       return (
  //         <div key={i}>
  //         </div>
  //       );
  //     }
  //   });
  // }
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
          <h2>Yuborilgan xabarlar</h2>
          <Table>
            <thead>
              <TableHeader>
                <th className="number">
                  <p>T/r</p>
                </th>
                <th className="name">
                  <p>Ismi familyasi</p>
                </th>
                <th className="phone">
                  <p>Telefon</p>
                </th>
                <th className="pay">
                  <p>Guruhi</p>
                </th>
                <th className="action">
                  <p>Yuborilgan sana</p>
                </th>
              </TableHeader>
            </thead>
          </Table>
          {getData && <MessageTable mesData={getData} index={getData} />}
        </Container>
      )}
    </div>
  );
};

export default Messages;
