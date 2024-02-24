import React, {useState, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../index';
import http from '../../http/index';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';

const styleAdd = {
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

const UpdateGroupModal = ({columnData, closeFun, updateFun, loaderStart, loaderStop}) => {
    const { user } = useContext(Context);
    const navigate = useNavigate();
    const [updateGroupTextfiend, setUpdateGroupTextfiend] = useState(columnData?.name);
    const [errorGroupUpdate, setErrorGroupUpdate] = useState(false);
    const updateColumn = () => {
        if (updateGroupTextfiend && !/^\s*$/.test(updateGroupTextfiend)) {
            loaderStart();
            http
                .post(import.meta.env.VITE_API_URL + 'api/columns/put-name', {
                    id: columnData?.id,
                    name: updateGroupTextfiend,
                })
                .then(() => {
                    loaderStop();
                    updateFun();
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
        }else{
            setErrorGroupUpdate(true);
        }
    };
    const handleChangeUpdateGroup = (e) => {
        setUpdateGroupTextfiend(e.target.value);
        setErrorGroupUpdate(false);
    };
    return (
        <Box sx={styleAdd}>
            <CloseIcon
                style={{
                    position: 'absolute',
                    right: '2%',
                    top: '3%',
                    cursor: 'pointer',
                }}
                onClick={() => closeFun()}
            />
            <div
                style={{
                    position: 'fixed',
                    width: '100%',
                    height: '4rem',
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
                <h2>Guruh nomini tahrirlash </h2>
            </div>

            <Box sx={{ width: '100%', mt: 7 }}>
                <TextField
                    fullWidth
                    label="Guruh nomini kiriting..."
                    id="outlined-size-large"
                    size="large"
                    value={updateGroupTextfiend}
                    onChange={handleChangeUpdateGroup}
                    type={'search'}
                />
            </Box>
            <p
                style={{
                    display: errorGroupUpdate ? 'block' : 'none',
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
                Guruh nomini kiriting
            </p>
            <Button
                sx={{ mt: 3, pt: 1, pb: 1 }}
                fullWidth
                className="buy_btn_modal"
                variant="contained"
                onClick={updateColumn}
            >
                Saqlash
            </Button>
        </Box>
    );
};

UpdateGroupModal.propTypes = {
    itemData: PropTypes.object.isRequired,
    columnData: PropTypes.object.isRequired,
    closeFun: PropTypes.func.isRequired,
    updateFun: PropTypes.func.isRequired,
    loaderStart: PropTypes.func.isRequired,
    loaderStop: PropTypes.func.isRequired,
};

export default UpdateGroupModal;