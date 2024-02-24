import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import { Context } from '../../index';
import http from '../../http/index';
import { useNavigate } from 'react-router-dom';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import Devextreme from './Devextreme';
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
  .contentSchedule{
    padding: 20px;
  }
`;

const Header = styled.div`
  background-color: white;
  display: flex;
  align-items: center;
  padding: 10px 20px;
  justify-content: space-between;
  h2 {
    color: rgb(4, 41, 84);
  }
`;

function LessonTable() {
  const { user } = useContext(Context);
  const [roomsData, setRoomsData] = useState([]);
  const navigate = useNavigate();
  const [selectedDays, setSelectedDays] = useState([]);
  const [data, setData] = useState([]);
  const [skeletonTime, setSkeletonTime] = useState(true);

  const handleDayClick = (value) => {
    const newSelectedDays = [...selectedDays];
    setSkeletonTime(true)
    if (newSelectedDays.includes(value)) {
      // If the same day is clicked twice, deselect it
      const index = newSelectedDays.indexOf(value);
      newSelectedDays.splice(index, 1);
    } else {
      // Deselect all previously selected days
      newSelectedDays.splice(0, newSelectedDays.length, value);
    }

    setSelectedDays(newSelectedDays);
  };

  const dayNumber = Number(selectedDays);

  useEffect(() => {
    http
      .get(import.meta.env.VITE_API_URL + `api/lesson-group/lessonAllGet/${dayNumber}`)
      .then((res) => {
        setData(res.data);
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

  }, [dayNumber])
  const currentDayIndex = new Date().getDay();

  const filterCurrentDay = currentDayIndex == 0 ? 7 : currentDayIndex;

  useEffect(() => {
    http
      .get(import.meta.env.VITE_API_URL + 'api/rooms/lesson/get')
      .then((res) => {
        setRoomsData(res.data);
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
    http
      .get(import.meta.env.VITE_API_URL + `api/lesson-group/lessonAllGet/${filterCurrentDay}`)
      .then((res) => {
        setData(res.data);
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



  // Initialize selectedDays with the current day of the week index
  if (selectedDays.length == 0) {
    setSelectedDays([filterCurrentDay]);
  }



  const daysOfWeek = [
    { label: 'Dush', value:1 },
    { label: 'Sesh', value: 2 },
    { label: 'Chor', value: 3 },
    { label: 'Pay', value: 4 },
    { label: 'Jum', value: 5 },
    { label: 'Shan', value: 6 },
    { label: 'Yak', value: 7 },
  ];



  const newData =
    data &&
    data.length > 0 && data.map((el) => {
      const dataParse = JSON.parse(el.text);
      return {
        room_id: el.room_id,
        startDate: new Date(el.startDate),
        endDate: new Date(el.endDate),
        text: `${dataParse.group}, ${dataParse.teacher}, ${dataParse.day}`,
      };
    });


  return (
    <div>
      {
        skeletonTime ? (
          <ContentSkeleton>
            <Box sx={{ width: '100%' }}>
              <Skeleton width="65%" height="2rem" />
              <Skeleton width="70%" height="2rem" />
              <Skeleton width="80%" height="2rem" />
              <Skeleton width="85%" height="2rem" />
            </Box>
          </ContentSkeleton>
        ) : (
          <Container>
            <Header>
              <div>
                <h2>Dars jadvali</h2>
              </div>
            </Header>
            <div className='contentSchedule'>
              <ButtonGroup
                sx={{ mb: 3 }}
                color="primary"
                aria-label="outlined primary button group"
              >
                {daysOfWeek.map((day) => (
                  <Button
                    key={day.value}
                    onClick={() => handleDayClick(day.value)}
                    variant={
                      selectedDays.includes(day.value) ? 'contained' : 'outlined'
                    }
                  >
                    {day.label}
                  </Button>
                ))}
              </ButtonGroup>

              { (
                <Devextreme resources={roomsData} appointments={newData} />
              )}
            </div>
          </Container>
        )
      }

    </div>
  );
}

export default LessonTable;
