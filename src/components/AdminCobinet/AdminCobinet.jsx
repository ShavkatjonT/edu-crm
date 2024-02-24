import React, { useEffect, useState, useContext } from 'react';
import http from '../../http/index';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../index';
import styled from 'styled-components';
import { Box, Skeleton, Modal } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';
import UpdateAdminModal from './UpdateAdmin';
import Loder from '../loder/Loder';
import Snackbars from '../Snackbar/Snackbar';

const Container = styled.div`
  margin-top: 1.8rem;
  padding-top: 10px;
  padding-bottom: 10px;
  background-color: white;
  border-radius: 6px;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.25);
  h3{
    color: #042954;
  }
`;

const ContentSkeleton = styled.div`
  padding-top: 2rem;
  padding-left: 2rem;
  padding-right: 2rem;
  padding-bottom: 2rem;
  background-color: white;
  border-radius: 6px;
  cursor: wait;
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
  .excelExportBtn{
    border: none;
    background-color: #037903;
    color: #fff;
    width: 90px;
    padding: 6px 2px;
    font-size: 1rem;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.5s;
    i {
      margin-right:8px;
    };

    &:hover{
      background-color: #0bc90b;
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
    gap: 20px;
    .teacher_give_money_btn {
      background-color: #ffaa2a !important;
      cursor: pointer;
      &:hover {
        background-color: #fdc600 !important;
      }
    }
    .teacher_info_div {
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

const Main = styled.div`
  margin-top: 1.2rem;
  padding: 0 20px;
  display: flex;
`;
const LeftImg = styled.div`
  img {
    width: 280px;
    height: 300px;
  }
`;
const Center = styled.div`
  margin-left: 1.5rem;
  table {
    width: 100%;
    tr {
      height: 50px;

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
`;


const AdminCobinet = () => {
  const navigate = useNavigate();
  const { user } = useContext(Context);
  const [adminData, setadminData] = useState([]);
  const [skeletonTime, setSkeletonTime] = useState(true);
  const [updateModal, setUpdateModal] = useState(false);
  const [loderTime, setLoderTime] = useState(false);
  const [dataUpdate, setDataUpdate] = useState(false);
  const [successUpdateAdmin, setSuccessUpdateAdmin] = useState(false);
  useEffect(() => {
    http
      .get(import.meta.env.VITE_API_URL + 'api/user/get')
      .then((r) => {
        if (r.data == null) {
          user.setIsAuth(false);
          localStorage.clear();
          navigate('/');
          setadminData({});
        } else {
          setadminData(r.data);
          setSkeletonTime(false);
        }
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
    if (dataUpdate) {
      http
        .get(import.meta.env.VITE_API_URL + 'api/user/get')
        .then((r) => {
          if (r.data == null) {
            user.setIsAuth(false);
            localStorage.clear();
            navigate('/');
            setadminData({});
          } else {
            setadminData(r.data);
            setSkeletonTime(false);
            setDataUpdate(false);
          }
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
  }, [dataUpdate]);

  const closeUpdateAdmin = () => {
    setUpdateModal(false);
  };

  const startLoader = () => setLoderTime(true);
  const stopLoader = () => setLoderTime(false);

  const updateUpdateAdmin = () => {
    setUpdateModal(false);
    setDataUpdate(true);
    setSuccessUpdateAdmin(true);
  };

  const handleCloseBarSuccessAdminUpdate = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSuccessUpdateAdmin(false);
  };

  return (
    <Container>
      <Loder stop={loderTime} />
      {skeletonTime ? (
        <ContentSkeleton>
          <Box sx={{ width: '100%' }}>
            <Skeleton width="20%" height="2rem" />
            <Skeleton width="50%" height="2rem" />
            <Skeleton width="85%" height="2rem" />
            <Skeleton width="100%" height="2rem" />
          </Box>
        </ContentSkeleton>
      ) : (
        <div>
          <Header>
            <div>
              <h3>
                {adminData?.data?.firstname + ' ' + adminData?.data?.lastname} ma&apos;lumotlari
              </h3>
            </div>
            <div className="teacher_info">
              <Tooltip
                title="Tahrirlash"
                arrow
                TransitionComponent={Fade}
                placement="top"
              >
                <button className="edit" onClick={() => setUpdateModal(true)}>
                  <i className="fa-solid fa-pen"></i>
                </button>
              </Tooltip>
            </div>
          </Header>
          <hr />
          <Main>
            <LeftImg>
              <img
                src={
                  adminData?.data.gender == 'ayol'
                    ? '/images/adminTwo.png'
                    : '/images/adminOne.png'
                }
                alt=""
              />
            </LeftImg>
            <Center>
              <table>
                <tbody>
                  <tr>
                    <td>Ismi familyasi: </td>
                    <td>
                      {adminData?.data?.firstname + ' ' + adminData?.data?.lastname}
                    </td>
                  </tr>
                  <tr>
                    <td>Otasining ismi: </td>
                    <td>
                      {adminData?.data?.fathername}
                    </td>
                  </tr>
                  <tr>
                    <td>Jinsi: </td>
                    <td>{adminData?.data?.gender}</td>
                  </tr>
                  <tr>
                    <td>Tug&apos;ilgan sanasi: </td>
                    <td>{adminData?.data?.birthday}</td>
                  </tr>
                  <tr>
                    <td>Manzil: </td>
                    <td>{adminData?.data?.address}</td>
                  </tr>
                  <tr>
                    <td>Telefon Raqami: </td>
                    <td>{adminData?.data?.phone}</td>
                  </tr>
                  <tr>
                    <td>Qo&apos;shimcha telefon raqami: </td>
                    <td>{adminData?.data?.phone_2}</td>
                  </tr>
                  <tr>
                    <td>Telegram Id: </td>
                    <td>{adminData?.telegram_id}</td>
                  </tr>
                  <tr>
                    <td>Login: </td>
                    <td>{adminData?.email}</td>
                  </tr>
                </tbody>
              </table>
            </Center>
            <Modal open={updateModal}>
              <UpdateAdminModal closeFun={closeUpdateAdmin} updateFun={updateUpdateAdmin} stopLoader={stopLoader} openLoader={startLoader} adminData={adminData} />
            </Modal>
          </Main>
          <Snackbars
            open={successUpdateAdmin}
            onClose={handleCloseBarSuccessAdminUpdate}
            severity={'success'}
            massage={user?.user?.role == 'super' ? 'CEO ma\'lumotlari muvaffaqiyatli o\'zgartirildi' : user?.user?.role == 'admin' ? 'Administrator ma\'lumotlari muvaffaqiyatli o\'zgartirildi' : user?.user?.role == 'casher' ? 'Hisobchi ma\'lumotlari muvaffaqiyatli o\'zgartirildi' : 'Ma\'lumotlari muvaffaqiyatli o\'zgartirildi'}
          />
        </div>
      )}
    </Container>
  );
};

export default AdminCobinet;