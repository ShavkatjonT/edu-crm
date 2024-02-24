import React, { useEffect, useState, useContext } from 'react';
import Box from '@mui/material/Box';
import http from '../../http/index';
import NumericInput from 'material-ui-numeric-input';
import { Context } from '../../index';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import { Checkbox, FormControlLabel } from '@mui/material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: 'none',
    borderRadius: '6px',
    boxShadow: 24,
    p: 4,
};

const AddGroupStudentModal = ({ data, updateFun, closeFun, column }) => {
    const { user } = useContext(Context);
    const [teacherSelectValue, setteacherSelectValue] = useState('');
    const [teacherSelectGroup, setTeacherSelectGroup] = useState('');
    const [monthlySumma, setMonthlySumma] = useState(0);
    const [teacherData, setTeacherData] = useState([]);
    const [teacherGroupData, setTeacherGroupData] = useState([]);
    const [disabledGroups, setDisabledGroups] = useState(true);
    const [errorSelectTeacher, setErrorSelectTeacher] = useState(false);
    const [errorSelectTeacherGroup, setErrorSelectTeacherGroup] = useState(false);
    const [errorSelectMonthly, setErrorSelectMonthly] = useState(false);
    const [testLesson, setTestLesson] = useState(false);
    const [groupSelectId, setGroupSelectId] = useState('');
    useEffect(() => {
        http
            .get(import.meta.env.VITE_API_URL + 'api/teacher/all/list/get')
            .then((r) => {
                setTeacherData(r.data);
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
    }, [])


    const closeAndSaveAddModal = () => {
        closeFun()
        setteacherSelectValue('');
        setDisabledGroups(true);
    };

    const changeMonthSumma = (event) => {
        setMonthlySumma(event.target.value);
    };

    const teacherSelectChange = (event) => {
        setteacherSelectValue(event.target.value);
        http
            .get(import.meta.env.VITE_API_URL + `api/group/get/${event.target.value}`)
            .then((r) => {
                setTeacherGroupData(r.data?.groupList)
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
    };
    const teacherSelectGroupChange = (event, obj) => {
        const { key } = obj;
        const filterId = key.substring(2);
        setGroupSelectId(filterId);
        const selectedValue = event.target.value;
        setTeacherSelectGroup(selectedValue);
        const filterMonth = teacherGroupData && teacherGroupData.find((e) => (
            e.name === selectedValue
        ));
        setMonthlySumma(filterMonth.month_payment);
        setErrorSelectTeacherGroup(false);
        setErrorSelectMonthly(false);
    };

    const addStudentGroupFun = () => {
        if (teacherSelectValue && teacherSelectGroup && monthlySumma > 0) {
            http
                .post(
                    import.meta.env.VITE_API_URL + 'api/new-pending-student/student-create',
                    {
                        column_id: column.id,
                        group_id: groupSelectId,
                        student_id: data.id,
                        summa: Number(monthlySumma),
                        status: testLesson,
                    }
                )
                .then(() => {
                    updateFun();
                    closeFun()

                })
                .catch((e) => {
                    console.log(e);
                    // Xatolik xabari yozish kk
                });
        } else {
            if (!teacherSelectValue) {
                setErrorSelectTeacher(true);
            } else {
                setErrorSelectTeacher(false);
            }
            if (!teacherSelectGroup) {
                setErrorSelectTeacherGroup(true);
            } else {
                setErrorSelectTeacherGroup(false);
            }
            if (monthlySumma <= 0) {
                setErrorSelectMonthly(true);
            } else {
                setErrorSelectMonthly(false);
            }
        }
    };


    return (
        <Box sx={style}>
            <CloseIcon
                style={{
                    position: 'absolute',
                    right: '2%',
                    top: '3%',
                    cursor: 'pointer',
                }}
                onClick={closeAndSaveAddModal}
            />
            <div
                style={{
                    position: 'fixed',
                    width: '100%',
                    height: '5.5rem',
                    left: 0,
                    borderTopLeftRadius: '6px',
                    borderTopRightRadius: '6px',
                    zIndex: '-1',
                    paddingTop: '20px',
                    paddingBottom: '20px',
                    paddingLeft: '30px',
                    top: 0,
                    background: '#FDC600',
                }}
            >
                <h2 >
                    {data.firstname + ' ' + data.lastname}
                </h2>
                <p>ushbu o&apos;quvchini guruhga qo&apos;shish</p>
            </div>

            <Box sx={{ width: '100%', mt: 9 }}>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                        O&apos;qituvchini tanlang
                    </InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={teacherSelectValue}
                        label="O'qituvchini tanlang"
                        onChange={teacherSelectChange}
                    >
                        {teacherData &&
                            teacherData.map((data) => (
                                <MenuItem key={data.id} value={data.id}>
                                    {data.name}
                                </MenuItem>
                            ))}
                    </Select>
                    <p
                        style={{
                            display: errorSelectTeacher ? 'block' : 'none',
                            marginTop: '3px',
                            marginLeft: '14px',
                            fontSize: ' 0.75rem',
                            color: ' #d32f2f',
                            fontFamily: 'sans-serif',
                            fontWeight: '400',
                            lineHeight: '1.66',
                            letterSpacing: '0.03333em',
                        }}
                    >
                        O&apos;qituvchini tanlang
                    </p>
                </FormControl>
                <FormControl
                    fullWidth
                    sx={{ marginTop: '1rem' }}
                    className="groupSelect"
                    disabled={teacherGroupData.length == 0}
                >
                    <InputLabel id="demo-simple-select-label">
                        Guruhni tanlang
                    </InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={teacherSelectGroup}
                        label="Guruhni tanlang"
                        onChange={teacherSelectGroupChange}
                    >
                        {teacherGroupData.length !== 0 ? (
                            teacherGroupData &&
                            teacherGroupData.map((data) => (
                                <MenuItem key={data.id} value={data.name}>
                                    {data.name}
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem disabled>Guruh mavjud emas</MenuItem>
                        )}
                    </Select>
                    <p
                        style={{
                            display: errorSelectTeacherGroup ? 'block' : 'none',
                            marginTop: '3px',
                            marginLeft: '14px',
                            fontSize: ' 0.75rem',
                            color: ' #d32f2f',
                            fontFamily: 'sans-serif',
                            fontWeight: '400',
                            lineHeight: '1.66',
                            letterSpacing: '0.03333em',
                        }}
                    >
                        Guruhni tanlang
                    </p>
                </FormControl>
                <Box sx={{ width: '100%', marginTop: '1rem' }}>
                    <NumericInput
                        fullWidth
                        precision={''}
                        decimalChar=","
                        thousandChar="."
                        label="O'quvchi oylik to'lov summasi"
                        value={monthlySumma}
                        onChange={changeMonthSumma}
                        variant="outlined"
                        inputProps={{
                            maxLength: 8,
                            minLength: 0,
                        }}
                    />
                    <p
                        style={{
                            display: errorSelectMonthly ? 'block' : 'none',
                            marginTop: '3px',
                            marginLeft: '14px',
                            fontSize: ' 0.75rem',
                            color: ' #d32f2f',
                            fontFamily: 'sans-serif',
                            fontWeight: '400',
                            lineHeight: '1.66',
                            letterSpacing: '0.03333em',
                        }}
                    >
                        To&apos;lov summasini kiriting
                    </p>
                    <FormControlLabel sx={{mt: 1}} value={testLesson} onChange={() => setTestLesson(!testLesson)} control={<Checkbox />} label="Ushbu o'quvchini sinov darsiga qo'shish" />
                </Box>
            </Box>
            <Button
                sx={{ mt: 3, pt: 1, pb: 1 }}
                fullWidth
                className="buy_btn_modal"
                variant="contained"
                onClick={addStudentGroupFun}
            >
                Qo&apos;shish
            </Button>
        </Box>
    )
}

export default AddGroupStudentModal