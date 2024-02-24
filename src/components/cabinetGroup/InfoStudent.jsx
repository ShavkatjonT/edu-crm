/* eslint-disable react/jsx-key */
import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import http from '../../http/index';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../index';

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
  width: 97%;
  margin: 0 auto;
  margin-top: 5.8rem;
  padding-top: 10px;
  padding-bottom: 10px;
  background-color: white;
  border-radius: 6px;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.25);
  overflow-x: hidden;
  hr {
    border: 1px solid #aaaaaa;
  }
  .teacher_groups_name {
    background-color: #9db5b9;
    display: inline-block;
    padding-left: 0.5rem;
    margin-right: 0.5rem;
    border-radius: 3px;
    position: relative;

    span {
      background-color: #66878c;
      display: inline-block;
      padding-left: 0.5rem;
      padding-top: 0.2rem;
      padding-bottom: 0.3rem;
      padding-right: 0.5rem;
      border-radius: 3px;
      margin-left: 5px;
    }
  }
`;
const Header = styled.div`
  display: flex;
  padding: 15px 20px;
  align-items: center;
  justify-content: space-between;

`;
const Main = styled.div`
  margin-top: 1.2rem;
  padding: 0 20px;
  display: flex;
  @media screen and (max-width: 710px){
    &{
        flex-direction: column;
        padding: 0 10px;
    }
  }
`;
const LeftImg = styled.div`
    display: flex;
    img {
        margin: 0 auto;
        width: 280px;
        height: 300px;
    }
`;
const Center = styled.div`
  width: 100%;
  display: flex;
  table {
    width: 100%;
    @media screen and (max-width: 710px){
    &{
        font-size: 12px;
    }
  }
    em{
        color: gray;
    }
    tr {
      height: 60px;
      td {
        text-align: left;
        padding-left: 10px;
        &:nth-child(even) {
          font-weight: 600;
        }
      }
      &:nth-child(even) {
        background-color: #f8f8f8;
      }
    }
  }
  #boardContent {
    width: 50%;
    #board_num_part {
      display: flex;
      flex-direction: column;
    }
    .board_number {
      width: 50px;
      height: 60px;
      position: relative;
      font-size: 20px;
      font-family: sans-serif;
      font-weight: 600;
      color: #8f8f8f;
      margin-bottom: 10px;
      p {
        position: absolute;
        left: 25%;
        top: 30%;
      }
    }
  }
`;

const InfoStudent = () => {
    const data = window.location.href.split('/');
    const [student, setStudent] = useState({});
    const [skeletonTime, setSkeletonTime] = useState(true);
    const { user } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        http
            .get(import.meta.env.VITE_API_URL + `api/student/get/one/${data[4]}`)
            .then((res) => {
                setStudent(res.data);
                setSkeletonTime(false);
            })
            .catch((error) => {
                if (
                    error &&
                    error.response &&
                    error.response.data && error.response.data.message == 'ro\'yxattan o\'tmagan foydalanuvchi!'
                ) {
                    user.setIsAuth(false);
                    localStorage.clear();
                    navigate('/');
                } else {
                    console.log(error);
                }
            });

    }, []);

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
                student && (
                    <div>
                        <Header>
                            <div className='header_left'>
                                <h3>
                                    {(student?.firstname?.length > 30 ? `${student?.firstname?.slice(0, 30)}...` : student?.firstname) + ' ' + (student?.lastname?.length > 30 ? `${student?.lastname?.slice(0, 30)}...` : student?.lastname)} ma&apos;lumotlari
                                </h3>
                            </div>
                        </Header>
                        <hr />
                        <Main>
                            <LeftImg>
                                <img
                                    src={
                                        student.gender == 'ayol'
                                            ? '/images/admin2.png'
                                            : '/images/admin1.png'
                                    }
                                    alt=""
                                />
                            </LeftImg>
                            <Center>
                                <table>
                                    <tbody>
                                        <tr>
                                            <td className="tableThead">Ismi familyasi: </td>
                                            <td>
                                                {student?.firstname?.length > 40 ? `${student?.firstname?.slice(0, 40)}...` : student?.firstname} {student?.lastname?.length > 40 ? `${student?.lastname?.slice(0, 40)}...` : student?.lastname}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="tableThead">Otasining ismi: </td>
                                            <td>{student.fathername?.trim() ? student.fathername : <em>Mavjud emas</em>}</td>
                                        </tr>
                                        <tr>
                                            <td className="tableThead">Jinsi: </td>
                                            <td>{student.gender}</td>
                                        </tr>

                                        <tr>
                                            <td className="tableThead">Tug&apos;ilgan sana: </td>
                                            <td>{student.birthday}</td>
                                        </tr>
                                        <tr>
                                            <td className="tableThead">Manzili: </td>
                                            <td>{student.address}</td>
                                        </tr>
                                        <tr>
                                            <td className="tableThead">Otasining telefon raqami: </td>
                                            <td>{student.fatherPhone?.trim() ? student.fatherPhone : <em>Mavjud emas</em>}</td>
                                        </tr>
                                        <tr>
                                            <td className="tableThead">Onasining telefon raqami: </td>
                                            <td>{student.motherPhone?.trim() ? student.motherPhone : <em>Mavjud emas</em>}</td>
                                        </tr>
                                        <tr>
                                            <td className="tableThead">Sinfi: </td>
                                            <td>{student.class?.trim() ? student.class : <em>Mavjud emas</em>}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </Center>
                        </Main>
                    </div>
                )
            )}
        </Container>
    );
};

export default InfoStudent;
