import React, { useState, useEffect, useContext } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import IconButton from '@mui/material/IconButton';
import http from '../../http/index';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../index';
import Tooltip from '@mui/material/Tooltip';
import { IMaskInput } from 'react-imask';
import PropTypes from 'prop-types';
import './Ded.css';
import Skeleton from '@mui/material/Skeleton';
import styled from 'styled-components';
import AddGroupStudentModal from './addGroupStudentModal';
import LaunchGroupModal from './LaunchGroupModal';
import MessageStudent from './MessageStudent';
import Snackbar from '../Snackbar/Snackbar';
import GroupMessage from './GroupMessage';
import AddStudentModal from './AddStudentModal';
import Loder from '../loder/Loder';
import UpdateStudentModalComponent from './UpdateStudentModal';
import DeleteStudent from './DeleteStudent';
import UpdateGroupModal from './UpdateGroupModal';
import DeleteGroupModal from './DeleteGroupModal';
import InfoStudent from './InfoStudent';
import AddGroupModal from './AddGroupModal';

const ContentSkeleton = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  padding-left: 2rem;
  padding-right: 2rem;
  padding-bottom: 2rem;
  background-color: white;
  border-radius: 6px;
  cursor: wait;
`;

const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.droppableId !== destination.droppableId) {
        http
            .post(import.meta.env.VITE_API_URL + 'api/columns/put', {
                result,
                columns,
            })
            .then(() => {
                // console.log(res);
            })
            .catch((error) => {
                const { userDrag } = useContext(Context);
                const navigateDrag = useNavigate();
                if (error.response.data.message == 'ro\'yxattan o\'tmagan foydalanuvchi!') {
                    userDrag.setIsAuth(false);
                    localStorage.clear();
                    navigateDrag('/');
                } else {
                    console.log(error);
                }
                console.log(17, error);
            });
        const sourceColumn = columns[source.droppableId];
        const destColumn = columns[destination.droppableId];
        const sourceItems = [...sourceColumn.items];
        const destItmes = [...destColumn.items];
        const [removed] = sourceItems.splice(source.index, 1);
        destItmes.splice(destination.index, 0, removed);
        setColumns({
            ...columns,
            [source.droppableId]: {
                ...sourceColumn,
                items: sourceItems,
            },
            [destination.droppableId]: {
                ...destColumn,
                items: destItmes,
            },
        });
    } else {
        const column = columns[source.droppableId];
        const copiedItems = [...column.items];
        const [removed] = copiedItems.splice(source.index, 1);
        copiedItems.splice(destination.index, 0, removed);
        setColumns({
            ...columns,
            [source.droppableId]: {
                ...column,
                items: copiedItems,
            },
        });
    }
};

const TextMaskCustom = React.forwardRef(function TextMaskCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
        <IMaskInput
            {...other}
            mask="+998 (00) 000-00-00"
            definitions={{
                '#': /[1-9]/,
            }}
            inputRef={ref}
            onAccept={(value) => onChange({ target: { name: props.name, value } })}
            overwrite
        />
    );
});

TextMaskCustom.propTypes = {
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};


const NewPendingRoom = () => {
    const { user } = useContext(Context);
    const navigate = useNavigate();
    const [columns, setColumns] = useState({});
    const [loderTime, setLoderTime] = useState(false);
    const [addModal, setAddModal] = useState(false);
    const [updateModalGroup, setUpdateModalGroup] = useState(false);
    const [addStudentModal, setAddStudentModal] = useState(false);
    const [updateStudentModal, setUpdateStudentModal] = useState(false);

    const [dataUpdate, setDataUpdate] = useState(false);
    const [skeletonTime, setSkeletonTime] = useState(true);
    const [openDeleteStudentModal, setOpenDeleteStudentModal] = useState(false);
    const [openDeleteGroupModal, setOpenDeleteGroupModal] = useState(false);
    const [openStudentInfoModal, setOpenStudentInfoModal] = useState(false);
    const [studentInfo, setStudentInfo] = useState({});
    const [addGroupStudentModal, setAddGroupStudentModal] = useState(false);
    const [columnInfo, setColumnInfo] = useState({});
    const [openLaunchModal, setOpenLaunchModal] = useState(false);
    const [openGroupMessageModal, setOpenGroupMessageModal] = useState(false);
    const [launchSuccess, setLaunchSuccess] = useState(false);
    const [errorIsStudent, seterrorIsStudent] = useState(false);
    const [messageStudentModal, setMessageStudentModal] = useState(false);
    const [messageStudentSuccess, setMessageStudentSuccess] = useState(false);
    const [addStudentGroupSuccess, setAddStudentGroupSuccess] = useState(false);
    const [columnMenuState, setColumnMenuState] = useState({});
    // State for menu of each item
    const [itemMenuState, setItemMenuState] = useState({});
    useEffect(() => {
        http
            .get(import.meta.env.VITE_API_URL + 'api/columns/get')
            .then((res) => {
                setColumns(res.data.columnsData);
                setSkeletonTime(false);
            })
            .catch((error) => {
                if (error.response.data.message == 'ro\'yxattan o\'tmagan foydalanuvchi!') {
                    user.setIsAuth(false);
                    localStorage.clear();
                    navigate('/');
                } else {
                    console.log(error);
                }
                console.log(51, error);
            });
    }, []);
    useEffect(() => {
        if (dataUpdate) {
            http
                .get(import.meta.env.VITE_API_URL + 'api/columns/get')
                .then((res) => {
                    setColumns(res.data.columnsData);
                    setDataUpdate(false);
                    setSkeletonTime(false);
                })
                .catch((error) => {
                    if (error.response.data.message == 'ro\'yxattan o\'tmagan foydalanuvchi!') {
                        user.setIsAuth(false);
                        localStorage.clear();
                        navigate('/');
                    } else {
                        console.log(error);
                    }
                    console.log(51, error);
                });
        }
    }, [dataUpdate]);

    // const updateData = () => {
    //     setDataUpdate(true);
    // };
    const updateaddGroupStudentData = () => {
        setDataUpdate(true);
        setAddStudentGroupSuccess(true);
    };
    const updateLaunchData = () => {
        setDataUpdate(true);
        setLaunchSuccess(true);
    };
    const updateMessageStudentData = () => {
        setDataUpdate(true);
        setMessageStudentSuccess(true);
    };

    const handleClick = (event, columnId) => {
        setColumnMenuState((prevState) => ({
            ...prevState,
            [columnId]: event.currentTarget,
        }));
    };

    // Function to close column menu
    const handleClose = (columnId) => {
        setColumnMenuState((prevState) => ({
            ...prevState,
            [columnId]: null,
        }));
    };

    // Function to open item menu
    const handleClickItem = (event, itemId) => {
        setItemMenuState((prevState) => ({
            ...prevState,
            [itemId]: event.currentTarget,
        }));
    };

    // Function to close item menu
    const handleCloseItem = (itemId) => {
        setItemMenuState((prevState) => ({
            ...prevState,
            [itemId]: null,
        }));
    };


    const updateAllValue = (item, column) => {
        setStudentInfo(item);
        setColumnInfo(column);
    };

    const openUpdateGroupFun = () => {
        setUpdateModalGroup(true);
    };

    const updateGroupValuesTake = (id, column) => {
        setColumnInfo(column);
    };


    const openAddModalGroup = () => {
        setAddModal(true);
    };

    const closeAndSaveAddGroupModal = () => {
        setAddModal(false);
    };
    const updateAddGroupModalProps = () => {
        setAddModal(false);
        setDataUpdate(true);
    };

    const requestHeadTextStyle = {
        color: '#5E6C84',
        textAlign: 'left',
        paddingLeft: '5px',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        textWrap: 'nowrap'
    };

    const styleDefaultColumn = {
        display: 'flex',
        flexDirection: 'column',
        background: '#F4F5F7',
        paddingTop: '10px',
        borderRadius: '5px',
        marginBottom: '15px'
    };

    const styleOtherColumn = {
        display: 'flex',
        flexDirection: 'column',
        background: '#F4F5F7',
        paddingTop: '10px',
        borderRadius: '5px',
        marginBottom: '15px',
        width: '287px'
    };

    const openAddModal = () => {
        setAddStudentModal(true);
    };

    const openUpdateStudentModal = () => {
        setUpdateStudentModal(true);
    };

    const openColumnDeleteFun = () => {
        setOpenDeleteGroupModal(true);
    };

    const handleCloseDeleteGroupModal = () => {
        setOpenDeleteGroupModal(false);
    };

    const openStudentDeleteFun = () => {
        setOpenDeleteStudentModal(true);
    };

    const handleCloseDeleteStudentModal = () => {
        setOpenDeleteStudentModal(false);
    };

    const openStudentInfoFun = () => {
        setOpenStudentInfoModal(true);
    };

    const openAddStudentGroupFun = () => {
        setAddGroupStudentModal(true);
    };
    const closeAddStudentGroupFun = () => {
        setAddGroupStudentModal(false);
    };

    const openLaunchFun = () => {
        if (columnInfo.items.length > 0) {
            setOpenLaunchModal(true);
        } else {
            seterrorIsStudent(true);
        }
    };

    const closeLaunchFun = () => {
        setOpenLaunchModal(false);
    };

    const handleCloseBar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        seterrorIsStudent(false);
    };

    const handleCloseLaunchBar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setLaunchSuccess(false);
    };

    const handleCloseMessageStudentBar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setMessageStudentSuccess(false);
    };
    const handleCloseAddStudentBar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAddStudentGroupSuccess(false);
    };

    const openMessageStudentFun = () => {
        setMessageStudentModal(true);
    };
    const closeMessageStudentFun = () => {
        setMessageStudentModal(false);
    };
    const openMessageGroupFun = () => {
        if (columnInfo.items.length > 0) {
            setOpenGroupMessageModal(true);
        } else {
            seterrorIsStudent(true);
        }
    };

    const closeMessageGroupFun = () => {
        setOpenGroupMessageModal(false);
    };

    const closeAddStudentProps = () => {
        setAddStudentModal(false);
    };
    const updateAddStudentProps = () => {
        setAddStudentModal(false);
        setDataUpdate(true);
    };

    const startLoader = () => {
        setLoderTime(true);
    };
    const endLoader = () => {
        setLoderTime(false);
    };

    const closeUpdateStudentModal = () => {
        setUpdateStudentModal(false);
    };

    const updateStudentUpdateProps = () => {
        setUpdateStudentModal(false);
        setDataUpdate(true);
    };
    const closeDeleteStudentModal = () => {
        setOpenDeleteStudentModal(false);
    };

    const updateStudentDeleteProps = () => {
        setOpenDeleteStudentModal(false);
        setDataUpdate(true);
    };

    const closeAndSaveUpdateGroupModal = () => {
        setUpdateModalGroup(false);
    };

    const updateGroupUpdateProps = () => {
        setUpdateModalGroup(false);
        setDataUpdate(true);
    };

    const updateDeleteGroupProps = () => {
        setOpenDeleteGroupModal(false);
        setDataUpdate(true);
    };

    const closeInfoModal = () => {
        setOpenStudentInfoModal(false);
        setStudentInfo({});
    };

    return (
        <div>
            <Loder stop={loderTime} />
            {skeletonTime ? (
                <ContentSkeleton>
                    <Box sx={{ width: '100%' }}>
                        <Skeleton width="30%" height="2rem" />
                        <Skeleton width="60%" height="2rem" />
                        <Skeleton width="85%" height="2rem" />
                        <Skeleton width="100%" height="2rem" />
                    </Box>
                </ContentSkeleton>
            )
                : (
                    <div style={{ marginTop: '2rem' }} className='parentBlock'>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'start',
                                alignItems: 'center',
                                paddingBottom: '15px'
                            }}
                        >
                            <h2 style={{ color: 'rgb(4, 41, 84)' }}>Kutish zali</h2>
                        </div>
                        <div style={{ display: 'flex', height: '100%' }} className='pendingBasicDndBlock'>
                            {columns && (
                                <DragDropContext
                                    onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
                                >
                                    {Object.entries(columns).map(([id, column]) => {
                                        return (
                                            <div
                                                key={id}
                                                className='columns'
                                                style={
                                                    column.order == 1 ? styleDefaultColumn : styleOtherColumn
                                                }
                                            >
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        padding: '0px 8px',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <Tooltip placement="top" title={column.name} arrow>
                                                        <h2 style={requestHeadTextStyle}>{column.name}</h2>
                                                    </Tooltip>
                                                    {column.order == 1 && (
                                                        <Tooltip placement="top" title="So'rov qo'shish" arrow>
                                                            <div onClick={openAddModal}>
                                                                <IconButton
                                                                    id="fade-button"
                                                                    size="small"
                                                                    sx={{ color: '#5E6C84' }}
                                                                >
                                                                    <AddIcon />
                                                                </IconButton>
                                                            </div>
                                                        </Tooltip>
                                                    )}
                                                    {column.order != 1 && (
                                                        <div>
                                                            <IconButton
                                                                id={`column-menu-button-${id}`}
                                                                size="small"
                                                                sx={{ color: '#5E6C84' }}
                                                                aria-controls={columnMenuState[id] ? `column-menu-${id}` : undefined}
                                                                aria-haspopup="true"
                                                                aria-expanded={columnMenuState[id] ? 'true' : undefined}
                                                                onClick={(e) => { handleClick(e, id), updateGroupValuesTake(id, column); }}
                                                            >
                                                                <MoreVertIcon
                                                                    sx={{ transform: 'rotate(90deg)' }}
                                                                ></MoreVertIcon>
                                                            </IconButton>
                                                            <Menu
                                                                id={`column-menu-${id}`}
                                                                anchorEl={columnMenuState[id]}
                                                                open={Boolean(columnMenuState[id])}
                                                                onClose={() => handleClose(id)}
                                                                TransitionComponent={Fade}
                                                            >
                                                                <MenuItem onClick={() => { openLaunchFun(); handleClose(id); }} sx={{
                                                                    fontSize: '14px',
                                                                    color: '#0d2f62',
                                                                }}>
                                                                    <i className="fa-solid fa-circle-plus" style={{ marginRight: '5px' }}></i>
                                                                    Ishga tushurish
                                                                </MenuItem>
                                                                <MenuItem onClick={() => { openMessageGroupFun(); handleClose(id); }} sx={{
                                                                    fontSize: '14px',
                                                                    color: '#FDC600',
                                                                }}>
                                                                    <i className="fa-regular fa-envelope" style={{ marginRight: '5px' }}></i>
                                                                    Xabar yuborish
                                                                </MenuItem>
                                                                <MenuItem onClick={() => { openUpdateGroupFun(column); handleClose(id); }} sx={{
                                                                    fontSize: '14px',
                                                                    color: '#0d2f62',
                                                                }}><i
                                                                    className="fa-solid fa-pen"
                                                                    style={{ marginRight: '5px' }}
                                                                ></i> Tahrirlash</MenuItem>
                                                                <MenuItem sx={{
                                                                    fontSize: '14px',
                                                                    color: '#ba0e30',
                                                                }} onClick={() => { openColumnDeleteFun(); handleClose(id); }}>
                                                                    <i
                                                                        className="fa-solid fa-trash"
                                                                        style={{
                                                                            marginRight: '7px',
                                                                            marginLeft: '2px',
                                                                        }}
                                                                    ></i>
                                                                    O&apos;chirish
                                                                </MenuItem>
                                                            </Menu>
                                                        </div>
                                                    )}
                                                </div>
                                                <div style={{ margin: 8 }}>
                                                    <Droppable droppableId={id}>
                                                        {(provided, snapshot) => {
                                                            return (
                                                                <div
                                                                    {...provided.droppableProps}
                                                                    ref={provided.innerRef}
                                                                    style={{
                                                                        background: snapshot.isDraggingOver
                                                                            ? '#F4F5F7'
                                                                            : '#F4F5F7',
                                                                        paddingTop: '10px',
                                                                        paddingBottom: '10px',
                                                                        width: '270px',
                                                                        minHeight: 300,
                                                                    }}
                                                                >
                                                                    <div>
                                                                        {column?.items.map((item, index) => {
                                                                            return (
                                                                                <Draggable
                                                                                    key={item?.id}
                                                                                    draggableId={item?.id}
                                                                                    index={index}
                                                                                >
                                                                                    {(provided, snapshot) => {
                                                                                        return (
                                                                                            <div
                                                                                                ref={provided.innerRef}
                                                                                                {...provided.draggableProps}
                                                                                                {...provided.dragHandleProps}
                                                                                                // onClick={()=> openUpdateFun(item)}
                                                                                                style={{
                                                                                                    userSelect: 'none',
                                                                                                    margin: '0 0 8px 0',
                                                                                                    padding: '10px 5px 10px 10px',
                                                                                                    minHeight: '60px',
                                                                                                    maxWidth: '270px',
                                                                                                    backgroundColor: snapshot.isDragging
                                                                                                        ? '#FFFFFF'
                                                                                                        : '#FFFFFF',
                                                                                                    boxShadow:
                                                                                                        ' 0px 1px 2px rgba(0, 0, 0, 0.25)',
                                                                                                    borderRadius: '2px',
                                                                                                    color: '#172B4D',
                                                                                                    ...provided.draggableProps.style,
                                                                                                    cursor: 'pointer',
                                                                                                    display: 'flex',
                                                                                                    justifyContent: 'space-between',
                                                                                                    alignItems: 'center',
                                                                                                }}
                                                                                            >
                                                                                                <div>
                                                                                                    <p>
                                                                                                        {item?.firstname +
                                                                                                            ' ' +
                                                                                                            item?.lastname}
                                                                                                    </p>
                                                                                                    <p
                                                                                                        style={{
                                                                                                            fontSize: '13px',
                                                                                                            marginTop: '10px',
                                                                                                            display: 'inline-block',
                                                                                                            padding: '2px 7px 2px 5px',
                                                                                                            backgroundColor: '#EAE6FF',
                                                                                                            borderRadius: '3px',
                                                                                                            fontWeight: '700',
                                                                                                        }}
                                                                                                    >
                                                                                                        {item?.fatherPhone ? item?.fatherPhone : item?.motherPhone}
                                                                                                    </p>
                                                                                                </div>
                                                                                                <div
                                                                                                    style={{
                                                                                                        alignSelf: 'start',
                                                                                                        marginTop: '-5px',
                                                                                                    }}
                                                                                                >
                                                                                                    <IconButton
                                                                                                        id={`item-menu-button-${item?.id}`}
                                                                                                        size="small"
                                                                                                        sx={{ color: '#5E6C84' }}
                                                                                                        aria-controls={itemMenuState[item?.id] ? `item-menu-${item?.id}` : undefined}
                                                                                                        aria-haspopup="true"
                                                                                                        aria-expanded={itemMenuState[item?.id] ? 'true' : undefined}
                                                                                                        onClick={(e) => {
                                                                                                            handleClickItem(e, item?.id);
                                                                                                            updateAllValue(item, column);
                                                                                                        }}
                                                                                                    >
                                                                                                        <MoreVertIcon
                                                                                                            sx={{
                                                                                                                transform: 'rotate(90deg)',
                                                                                                            }}
                                                                                                        ></MoreVertIcon>
                                                                                                    </IconButton>
                                                                                                    <Menu
                                                                                                        id={`item-menu-${item?.id}`}
                                                                                                        anchorEl={itemMenuState[item?.id]}
                                                                                                        open={Boolean(itemMenuState[item?.id])}
                                                                                                        onClose={() => handleCloseItem(item?.id)}
                                                                                                        TransitionComponent={Fade}
                                                                                                        sx={{
                                                                                                            '.css-1ka5eyc-MuiPaper-root-MuiMenu-paper-MuiPopover-paper':
                                                                                                            {
                                                                                                                boxShadow:
                                                                                                                    '1px 5px 5px rgba(0,0,0,0.08)',
                                                                                                            },
                                                                                                        }}
                                                                                                    >
                                                                                                        <MenuItem
                                                                                                            sx={{
                                                                                                                fontSize: '14px',
                                                                                                                color: '#2259ab',
                                                                                                            }}
                                                                                                            onClick={() => { openStudentInfoFun(item); handleCloseItem(item?.id); }}
                                                                                                        >
                                                                                                            <i
                                                                                                                className="fa-solid  fa-eye"
                                                                                                                style={{ marginRight: '5px' }}
                                                                                                            ></i>
                                                                                                            Ma&apos;lumotlar
                                                                                                        </MenuItem>
                                                                                                        <MenuItem
                                                                                                            sx={{
                                                                                                                fontSize: '14px',
                                                                                                                color: '#FDC600',
                                                                                                            }}
                                                                                                            onClick={() => { openMessageStudentFun(); handleCloseItem(item?.id); }}
                                                                                                        >
                                                                                                            <i
                                                                                                                className="fa-regular  fa-envelope"
                                                                                                                style={{ marginRight: '5px' }}
                                                                                                            ></i>
                                                                                                            Xabar yuborish
                                                                                                        </MenuItem>
                                                                                                        <MenuItem
                                                                                                            sx={{
                                                                                                                fontSize: '14px',
                                                                                                                color: '#0d2f62',
                                                                                                            }}
                                                                                                            onClick={() => { openAddStudentGroupFun(); handleCloseItem(item?.id); }}
                                                                                                        >
                                                                                                            <i
                                                                                                                className="fa-solid  fa-user-plus"
                                                                                                                style={{ marginRight: '5px' }}
                                                                                                            ></i>
                                                                                                            Guruhga qo&apos;shish
                                                                                                        </MenuItem>
                                                                                                        <MenuItem
                                                                                                            sx={{
                                                                                                                fontSize: '14px',
                                                                                                                color: '#0d2f62',
                                                                                                            }}
                                                                                                            onClick={() => {
                                                                                                                openUpdateStudentModal(item);
                                                                                                                handleCloseItem(item?.id);
                                                                                                            }}
                                                                                                        >
                                                                                                            <i
                                                                                                                className="fa-solid fa-pen"
                                                                                                                style={{ marginRight: '5px' }}
                                                                                                            ></i>
                                                                                                            Tahrirlash
                                                                                                        </MenuItem>
                                                                                                        <MenuItem
                                                                                                            sx={{
                                                                                                                fontSize: '14px',
                                                                                                                color: '#ba0e30',
                                                                                                            }}
                                                                                                            onClick={() => { openStudentDeleteFun(item, column); handleCloseItem(item?.id); }}
                                                                                                        >
                                                                                                            <i
                                                                                                                className="fa-solid fa-trash"
                                                                                                                style={{
                                                                                                                    marginRight: '7px',
                                                                                                                    marginLeft: '2px',
                                                                                                                }}
                                                                                                            ></i>
                                                                                                            O&apos;chirish
                                                                                                        </MenuItem>
                                                                                                    </Menu>
                                                                                                </div>
                                                                                            </div>
                                                                                        );
                                                                                    }}
                                                                                </Draggable>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                    {provided.placeholder}
                                                                </div>
                                                            );
                                                        }}
                                                    </Droppable>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </DragDropContext>
                            )}
                            <Tooltip placement="top" title="Guruh qo'shish" arrow>
                                <div style={{ display: 'inline-block', height: '40px' }}>
                                    <IconButton
                                        id="fade-button"
                                        size="small"
                                        sx={{ color: '#5E6C84' }}
                                        onClick={openAddModalGroup}
                                    >
                                        <AddIcon />
                                    </IconButton>
                                </div>
                            </Tooltip>
                        </div>
                        {/* Add student modal */}
                        <Modal
                            open={addStudentModal}
                            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: '600' }}>
                            <AddStudentModal
                                closeFun={closeAddStudentProps}
                                updateFun={updateAddStudentProps}
                                loaderStart={startLoader}
                                loaderStop={endLoader} />
                        </Modal>
                        {/* =====================*/}

                        {/* Update student modal */}
                        <Modal
                            open={updateStudentModal}
                            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: '600' }}>
                            <UpdateStudentModalComponent
                                itemData={studentInfo}
                                closeFun={closeUpdateStudentModal}
                                updateFun={updateStudentUpdateProps}
                                loaderStart={startLoader}
                                loaderStop={endLoader} />
                        </Modal>
                        {/* ======================= */}

                        {/* Delete student modal */}
                        <Modal
                            open={openDeleteStudentModal}
                            onClose={handleCloseDeleteStudentModal}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <DeleteStudent
                                closeFun={closeDeleteStudentModal}
                                itemData={studentInfo}
                                columnData={columnInfo}
                                updateFun={updateStudentDeleteProps}
                                loaderStart={startLoader}
                                loaderStop={endLoader} />
                        </Modal>
                        {/* ======================= */}

                        {/* Add Group modal */}
                        <Modal open={addModal}>
                            <AddGroupModal
                                closeFun={closeAndSaveAddGroupModal}
                                updateFun={updateAddGroupModalProps} 
                                loaderStart={startLoader}
                                loaderStop={endLoader}/>
                        </Modal>
                        {/* ======================= */}

                        {/* Update group modal */}
                        <Modal open={updateModalGroup}>
                            <UpdateGroupModal
                                columnData={columnInfo}
                                closeFun={closeAndSaveUpdateGroupModal}
                                loaderStart={startLoader}
                                loaderStop={endLoader}
                                updateFun={updateGroupUpdateProps} />
                        </Modal>
                        {/* ======================= */}

                        {/* Delete group modal */}
                        <Modal
                            open={openDeleteGroupModal}
                            onClose={handleCloseDeleteGroupModal}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <DeleteGroupModal
                                columnData={columnInfo}
                                closeFun={handleCloseDeleteGroupModal}
                                updateFun={updateDeleteGroupProps}
                                loaderStart={startLoader}
                                loaderStop={endLoader} />
                        </Modal>
                        {/* ========================== */}

                        {/* Info student modal */}
                        <Modal open={openStudentInfoModal}
                            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <InfoStudent studentInfo={studentInfo} closeFun={closeInfoModal} />
                        </Modal>
                        {/* ===================== */}

                        <Modal open={addGroupStudentModal}>
                            <AddGroupStudentModal data={studentInfo} updateFun={updateaddGroupStudentData} closeFun={closeAddStudentGroupFun} column={columnInfo} />
                        </Modal>
                        <Modal open={openLaunchModal} sx={{ overflowY: 'scroll' }}>
                            <LaunchGroupModal column={columnInfo} updateFun={updateLaunchData} closeFun={closeLaunchFun} />
                        </Modal>
                        <Modal open={messageStudentModal}>
                            <MessageStudent student={studentInfo} updateData={updateMessageStudentData} closeFun={closeMessageStudentFun} />
                        </Modal>
                        <Modal open={openGroupMessageModal}>
                            <GroupMessage column={columnInfo} updateData={updateMessageStudentData} closeFun={closeMessageGroupFun} />
                        </Modal>
                        <Snackbar
                            open={errorIsStudent}
                            onClose={handleCloseBar}
                            severity={'error'}
                            massage={'Guruhda o\'quvchi mavjud emas'}
                        />
                        <Snackbar
                            open={launchSuccess}
                            onClose={handleCloseLaunchBar}
                            severity={'success'}
                            massage={'Guruh muvaffaqiyatli ishga tushirildi'}
                        />
                        <Snackbar
                            open={addStudentGroupSuccess}
                            onClose={handleCloseAddStudentBar}
                            severity={'success'}
                            massage={'O\'quvchi guruhga muvaffaqiyatli qo\'shildi'}
                        />
                        <Snackbar
                            open={messageStudentSuccess}
                            onClose={handleCloseMessageStudentBar}
                            severity={'success'}
                            massage={'Xabar muvaffaqiyatli yuborildi'}
                        />
                    </div>
                )}
        </div>
    );
};

export default NewPendingRoom;