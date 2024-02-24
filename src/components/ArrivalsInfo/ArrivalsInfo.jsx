import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import http from '../../http/index';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import { Context } from '../../index';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as TooltipChart, ResponsiveContainer } from 'recharts';
import Skeleton from '@mui/material/Skeleton';

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
  .groupsTeacher{
    display: flex;
    flex-direction: column;
    gap: 25px;
    padding: 15px 20px;
    border-top: 2px dashed gray;
    border-bottom: 2px dashed gray;
    margin-top: 20px;
    margin-bottom: 20px;
    h2{
      color: #042954;
    }
    .basicBlock{
      display: flex;
      flex-direction: column;
      gap: 30px;
      h3{
        font-size: 18px;
      }
      & > div{
        color: #0a213c;
        border-left: 2px dashed #c3c1c1;
        border-top: 2px dashed #c3c1c1;
        border-right: 2px dashed #c3c1c1;
        border-top-left-radius: 15px;
        border-top-right-radius: 15px;
        .groupsHead{
          display: flex;
          width: 100%;
          justify-content: space-between;
          padding: 20px 20px;
          p{
            font-weight: 600;
          }
        }
      }
    }
  }
`;
const Header = styled.div`
  display: flex;
  padding: 15px 20px;
  align-items: center;
  justify-content: space-between;
  .delete_student_icon {
    color: #c20404;
    cursor: pointer;
    font-size: 1.2rem;
    transition: all 0.8s;
    margin: 0 0.5rem;
    &:hover {
      color: #ff0808;
    }
  }
  .edit {
    i {
      font-size: 1.2rem;
    }
    background-color: initial;
    color: #585353;
    border: none;
    margin-right: 1rem;
    cursor: pointer;
    transition: all 0.5s;
    &:hover {
      color: #7d7d7d;
    }
  }
  .teacher_info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .teacher_give_money_btn {
      background-color: #ffaa2a !important;
      cursor: pointer;
      &:hover {
        background-color: #fdc600 !important;
      }
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
      }
    }
  }
`;
const Teachers = () => {
    const { user } = useContext(Context);
    const data = window.location.href.split('/');
    const [teacher, setTeacher] = useState([]);
    const [statisticsData, setStatisticsData] = useState([]);
    const [skeletonTime, setSkeletonTime] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        http
            .get(import.meta.env.VITE_API_URL + `api/teacher/get/one/${data[4]}`)
            .then((res) => {
                setTeacher(res.data);
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
        http
            .post(import.meta.env.VITE_API_URL + 'api/teacher/teacher-statistics', {
                id: data[4]
            })
            .then((res) => {
                setStatisticsData(res.data);
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
                console.log(error);
            });
    }, []);

    let filterStatistics = [];

    if (statisticsData && statisticsData.length > 0) {
        filterStatistics = statisticsData.map((e) => ({
            id: e.id,
            sale: e.interest,
            name: e.name,
            statistics: e.statistics.length > 0 ? e.statistics.map((alt) => ({
                'o\'quvchilar': alt.student_count,
                oy: alt.month,
            })) : []
        }));
    }

    return (
        <Container>
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
                teacher && (
                    <div>
                        <Header>
                            <div>
                                <h3>
                                    {teacher.firstname + ' ' + teacher.lastname} guruhlari
                                </h3>
                            </div>
                        </Header>
                        <hr />
                        {filterStatistics.length > 0 ?
                            <div className='groupsTeacher'>
                                <div className='basicBlock'>
                                    {filterStatistics.map(
                                        (e) =>
                                            e && (
                                                <div key={e.id}>
                                                    <div className='groupsHead'>
                                                        <h3>{e.name}</h3>
                                                        <p>Kelishilgan foiz: {e.sale}%</p>
                                                    </div>
                                                    {e?.statistics?.length > 0 ?
                                                        <div style={{ width: '100%', height: '300px', padding: '20px' }}>
                                                            <p style={{ fontSize: '15px', fontWeight: '600', color: '#5d5e60', marginBottom: '22px' }}>Guruhdagi o&apos;quvchilar statistikasi</p>
                                                            <ResponsiveContainer width="100%" height="100%">
                                                                <LineChart
                                                                    // width={500}
                                                                    // height={300}
                                                                    data={e.statistics}
                                                                    margin={{
                                                                        top: 5,
                                                                        // right: 20,
                                                                        bottom: 5,
                                                                    }}
                                                                >
                                                                    <CartesianGrid strokeDasharray="3 3" />
                                                                    <XAxis dataKey="oy" fontSize={'14px'} />
                                                                    <YAxis />
                                                                    <TooltipChart />
                                                                    <Line dataKey="o'quvchilar" fontSize={15} stroke="#85d884" />
                                                                </LineChart>
                                                            </ResponsiveContainer>
                                                        </div>
                                                        : <em style={{ display: 'block', fontWeight: '500', color: '#999999', paddingLeft: '20px' }}>Hisobotlar mavjud emas</em>}
                                                </div>
                                            )
                                    )}
                                </div>
                            </div>
                            : <em style={{ display: 'block', fontWeight: '500', color: '#999999', padding: '10px 20px' }}>Hisobotlar mavjud emas</em>}
                    </div>
                )
            )}
        </Container>
    );
};

export default Teachers;
