import React, {useContext, useState } from 'react';
import http from '../../http/index';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../index';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';

const AllGroupsDeleteModal = styled.div`
  width: 500px;
  height: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border: none;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  padding-bottom: 1rem;
  padding-left: 1rem;
  padding-right: 1rem;
  -webkit-box-shadow: -1px 12px 8px 0px rgba(34, 60, 80, 0.2);
  -moz-box-shadow: -1px 12px 8px 0px rgba(34, 60, 80, 0.2);
  box-shadow: -1px 12px 8px 0px rgba(34, 60, 80, 0.2);
  .close_modal {
    display: flex;
    justify-content: end;
    padding-top: 0.8rem;
  }
  .close_modal_btn {
    border: none;
    background-color: initial;
    font-size: 1.3rem;
    cursor: pointer;
    color: #929292;
    font-weight: 600;
    transition: all 0.5s;
    &:hover {
      color: #272727;
    }
  }
  .delete_icon_div {
    display: flex;
    justify-content: center;
    align-items: center;
    .delete_icon {
      width: 16%;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      padding-top: 0.8rem;
      padding-bottom: 0.8rem;
      background: #ebe9e9;
      img {
        width: 3rem;
      }
    }
  }
  .header_Modal {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1rem 0.8rem;
    p {
      font-size: 1.1rem;
      font-weight: 600;
    }
  }
  .allGroups_delete_modal_part {
    display: flex;
    justify-content: flex-end;
    button {
      text-transform: capitalize;
      margin: 1rem 10px 0;
    }
    .delete_modal_btn_error {
      background-color: #b9b9b9;
    }
  }
  .allGroups_delete_notification_part {
    display: flex;
    justify-content: center;
    text-align: center;
    font-size: 1.3rem;
    margin-top: 1.1rem;
    margin-bottom: 1.1rem;
  }
`;
const DeleteStudent = ({itemData, columnData, closeFun, updateFun, loaderStart, loaderStop}) => {
    const { user } = useContext(Context);
    const navigate = useNavigate();
    const [studentFullName, setStudentFullName] = useState(itemData?.firstname + ' ' + itemData?.lastname);
    
    const studentDelete = () => {
        loaderStart();
        http
            .post(import.meta.env.VITE_API_URL + 'api/new-pending-student/delete', {
                id: itemData?.id,
                column_id: columnData?.id
            })
            .then(() => {
                loaderStop();
                updateFun();
                setStudentFullName('');
            })
            .catch((error) => {
                if (error.response.data.message == 'ro\'yxattan o\'tmagan foydalanuvchi!') {
                    user.setIsAuth(false);
                    localStorage.clear();
                    navigate('/');
                } else {
                    console.log(error);
                }
                console.log(104, error);
            });
    };
    return (
        <AllGroupsDeleteModal>
            <div className="close_modal">
                <button
                    className="close_modal_btn"
                    onClick={() => closeFun()}
                >
                    <CloseIcon />
                </button>
            </div>
            <div className="delete_icon_div">
                <div className="delete_icon">
                    <img src="/images/trash.svg" alt="" />
                </div>
            </div>
            <div className="allGroups_delete_notification_part">

                <p id={itemData.id}>
                    Rostdan ham ushbu {studentFullName.length > 30 ? `${studentFullName.slice(0, 30)}...` : studentFullName}ni{' '}
                    o&apos;chirmoqchimisiz
                </p>
            </div>
            <div className="allGroups_delete_modal_part">
                <Button
                    className="delete_modal_btn_error"
                    variant="contained"
                    onClick={() => closeFun()}
                >
                    Bekor qilish
                </Button>
                <Button
                    className="delete_modal_btn_success"
                    variant="contained"
                    color="error"
                    onClick={() => {
                        studentDelete();
                    }}
                >
                    O&apos;chirish
                </Button>
            </div>
        </AllGroupsDeleteModal>
    );
};

DeleteStudent.propTypes = {
    itemData: PropTypes.object.isRequired,
    columnData: PropTypes.object.isRequired,
    closeFun: PropTypes.func.isRequired,
    updateFun: PropTypes.func.isRequired,
    loaderStart: PropTypes.func.isRequired,
    loaderStop: PropTypes.func.isRequired,
};


export default DeleteStudent;