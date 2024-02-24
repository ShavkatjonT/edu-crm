import React, { useState, useContext } from 'react'
import styled from 'styled-components';
import http from '../../http/index';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import { Context } from '../../index';
const MessageModal = styled.div`
  width: 450px;
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
  -webkit-box-shadow: -1px 12px 8px 0px rgba(34, 60, 80, 0.2);
  -moz-box-shadow: -1px 12px 8px 0px rgba(34, 60, 80, 0.2);
  box-shadow: -1px 12px 8px 0px rgba(34, 60, 80, 0.2);
  .close_modal {
    display: flex;
    justify-content: space-between;
    padding-top: 0.8rem;
    background-color: #fdc600;
    position: sticky;
    width: 100%;
    top: 0;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    color: #312c1c;
    font-weight: 400;
    .header_modal_message {
      padding-left: 1rem;
      padding-bottom: 1rem;
      .header_group_name {
        font-size: 1.5rem;
        font-weight: bold;
        color: #312c1c;
        font-family: sans-serif;
      }
    }
  }
  .close_modal_btn {
    border: none;
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background-color: initial;
    font-size: 1.3rem;
    cursor: pointer;
    color: #222222;
    font-weight: 600;
    transition: all 0.5s;
    &:hover {
      color: #0e0e0e;
    }
  }

  .allGroups_delete_modal_part {
    display: flex;
    justify-content: flex-end;
    button {
      text-transform: capitalize;
      margin-right: 1rem;
    }
    .delete_modal_btn_error {
      background-color: #042954;
    }
  }
  .allGroups_delete_notification_part {
    margin-top: 1.1rem;
    padding: 1rem;
    .message_modal_textarea {
      border: 1.5px solid #636363;
      border-radius: 3px;
      width: 100%;
      height: 8rem;
      resize: none;
      padding: 0.5rem;
      font-size: 1rem;
      font-family: sans-serif;
      &::placeholder {
        font-size: 1rem;
        font-family: sans-serif;
      }
      &:focus {
        outline: none;
        border: 1.5px solid #1f1f1f;
      }
    }
  }
`;
const GroupMessage = ({ column, closeFun, updateData }) => {
    const { user } = useContext(Context);
    const [textAreaCount, setTextAreaCount] = useState('');
    const [textYes, setTextYes] = useState(false);
    const [errorIsLimit, seterrorIsLimit] = useState(false);

    const messSubmit = () => {
        if (textAreaCount && !/^\s*$/.test(textAreaCount)) {
            if (textAreaCount.length >= 4) {
                let messageTime = new Date();
                http
                    .post(import.meta.env.VITE_API_URL + 'api/columns/send-message', {
                        id: column.id,
                        text: textAreaCount,
                        time: String(messageTime),
                    })
                    .then(() => {
                        updateData();
                        closeFun();
                        setTextYes(false);
                        setTextAreaCount('');
                    })
                    .catch((e) => {
                        console.log(e);
                        setTextYes(false);
                    });
            } else {
                if (textAreaCount.length < 4) {
                    seterrorIsLimit(true);
                    setTextYes(false);
                } else {
                    seterrorIsLimit(false);
                }
            }
        } else {
            if (!textAreaCount || /^\s*$/.test(textAreaCount)) {
                setTextYes(true);
                seterrorIsLimit(false);
            } else {
                setTextYes(false);
            }
        }
    };


    return (
        <MessageModal>
            <div className="close_modal">
                <div className="header_modal_message">
                    <p className="header_group_name">
                        {column.name}
                    </p>

                    <p>Ushbu guruh a&apos;zolariga xabar yuborish</p>
                </div>
                <button
                    className="close_modal_btn"
                    onClick={() => closeFun()}
                >
                    <CloseIcon />
                </button>
            </div>
            <div className="allGroups_delete_notification_part">
                <p
                    style={{
                        color: 'red',
                        display: textYes ? 'block' : 'none',
                        marginBottom: '1rem',
                    }}
                >
                    Xabar yozilmadi
                </p>
                <p
                    style={{
                        color: 'red',
                        display: errorIsLimit ? 'block' : 'none',
                        marginBottom: '1rem',
                    }}
                >
                    Eng kamida 4 ta belgi bo&apos;lishi zarur
                </p>
                <textarea
                    placeholder="Xabar yoborish..."
                    type="text"
                    maxLength={160}
                    value={textAreaCount}
                    className="message_modal_textarea"
                    onChange={(e) => {
                        setTextAreaCount(e.target.value);
                        setTextYes(false);
                    }}
                />
                <p>{textAreaCount.length} / 160</p>
            </div>
            <div className="allGroups_delete_modal_part">
                <Button
                    className="delete_modal_btn_error"
                    variant="contained"
                    onClick={() => messSubmit()}
                >
                    Yuborish
                </Button>
            </div>
        </MessageModal>
    )
}

export default GroupMessage;