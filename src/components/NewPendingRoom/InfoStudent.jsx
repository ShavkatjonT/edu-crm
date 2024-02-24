import React from 'react';
import PropTypes from 'prop-types';
import CloseIcon from '@mui/icons-material/Close';

const InfoStudent = ({studentInfo, closeFun}) => {
    return (
        <div className='infoModal'>
            <CloseIcon
                style={{
                    position: 'absolute',
                    right: '2%',
                    top: '2.5%',
                    cursor: 'pointer',
                }}
                onClick={() => closeFun()}
            />
            <div className='infoTopPart'>
                <div className='imgpart'>
                    <img src={
                        studentInfo.gender == 'ayol'
                            ? '/images/infoStudent2.png'
                            : '/images/infoStudent1.png'
                    } alt="" />
                </div>
                <h2>{studentInfo.firstname + ' ' + studentInfo.lastname}</h2>
            </div>
            <div className='informationPart'>
                <div><h4>Ismi:</h4> <i className="fa-solid fa-circle"></i> <p>{studentInfo.firstname}</p></div>
                <div><h4>Familiya:</h4> <i className="fa-solid fa-circle"></i> <p>{studentInfo.lastname}</p></div>
                {studentInfo && typeof studentInfo.fathername === 'string' && studentInfo.fathername.trim() !== '' &&
                    <div><h4>Otasining ismi:</h4> <i className="fa-solid fa-circle"></i> <p>{studentInfo.fathername}</p></div>
                }
                <div><h4>Jinsi:</h4> <i className="fa-solid fa-circle"></i> <p>{studentInfo.gender}</p></div>
                {studentInfo && typeof studentInfo.birthday === 'string' && studentInfo.birthday.trim() !== '' &&
                    <div><h4>Tug&apos;ilgan sanasi:</h4> <i className="fa-solid fa-circle"></i> <p>{studentInfo.birthday}</p></div>
                }
                {studentInfo && typeof studentInfo.address === 'string' && studentInfo.address.trim() !== '' &&
                    <div><h4>Manzil:</h4> <i className="fa-solid fa-circle"></i> <p>{studentInfo.address}</p></div>
                }
                {studentInfo && typeof studentInfo.class === 'string' && studentInfo.class.trim() !== '' &&
                    <div><h4>Sinfi:</h4> <i className="fa-solid fa-circle"></i> <p>{studentInfo.class}</p></div>
                }
                <div><h4>Otasining telefon raqami:</h4> <i className="fa-solid fa-circle"></i> <p>{studentInfo.fatherPhone}</p></div>
                {studentInfo && typeof studentInfo.motherPhone === 'string' && studentInfo.motherPhone.trim() !== '' &&
                    <div><h4>Onasining telefon raqami::</h4> <i className="fa-solid fa-circle"></i> <p>{studentInfo.motherPhone}</p></div>
                }
                <div><h4>Qaysi yo&apos;l bilan tashrif buyurgan:</h4> <i className="fa-solid fa-circle"></i> <p>{studentInfo.where_user == 'default' ? 'O\'zi tashrif buyurgan' : studentInfo.where_user}</p></div>
            </div>
        </div>
    );
};

InfoStudent.propTypes = {
    studentInfo: PropTypes.object.isRequired,
    closeFun: PropTypes.func.isRequired,
};


export default InfoStudent;