import React, { useContext, useState, useEffect, Suspense } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import Header from './components/Header/Header';
import Navbar from './components/Navbar/Navbar';
import http from './http/index';
import { Context } from './index';
import { check } from './http/userApi';
import MenuGroups from './components/Menus/MenuGroups';
import MenusEmployees from './components/Menus/MenusEmployees.jsx';
import Menusubjects from './components/Menus/Menusubjects';
import MenuInformation from './components/Menus/MenuInformation';
import MenuAddBuy from './components/Menus/MenuAddBuy';
import Student from './components/Students/Student';
import Debtors from './components/Debtors/DebtorsTable/DebtorsTable';
import Group from './components/groups/Group';
import AddGroups from './components/AddGroups/AddGroups';
import AddStudent from './components/AddStudent/AddStudent';
import UpdateGroups from './components/UpdateGropus/UpdateGroups';
// import Pending from './components/tables/PendingTable';
import UpdateStudent from './components/UpdateStudent/UpdateStudent';
import PendingAddStudent from './components/PendingAddStudent/PendingAddStudent';
import Teachers from './components/Teachers/Teachers';
import PendingStudent from './components/PendingStudent/PendingStudent';
import AddTeacher from './components/AddTeacher/AddTeacher';
import UpdateTeacher from './components/UpdateTeacher/UpdateTeacher';
import LoginUser from './components/LoginUser/LoginUser.jsx';
import PendingUpdate from './components/UpdatePendingStudent/UpdatePendingStudent';
import ErrorPage from './components/ErrorPage/ErrorPage';
import BuyTable from './components/BuyTable/BuyTable';
import './App.css';
import PrivateCabinet from './components/privateCabinet/PrivateCabinet';
import TeachersCobinet from './components/cabinet/Cabinet';
import Informations from './components/Informations/Informations';
import DebtorsBasic from './components/DebtorsBasic/DebtorsBasic';
import AllGroups from './components/AllGroups/AllGroups';
import Messages from './components/Messages/Messages';
import PendingGroupOne from './components/PendingGroupOne/PendingGroupOne';
import NotGroupsStudentTables from './components/NotGroupsStudents/NoGroupsStudent';
import NoGroupStudent from './components/NoGroupStudent/NoGroupStudent';
import UpdateNoGroupStudent from './components/UpdateNoGroupStudent/UpdateNoGroupStudent';
import RoomsTable from './components/RoomsTable/RoomsTable';
import LessonTable from './components/LessonTable/LessonTable';
import CabinetGroup from './components/cabinetGroup/CabinetGroup';
import NewPendingRoom from './components/NewPendingRoom/NewPendingRoom';
import HeaderAdmin from './components/HeaderAdmin/HeaderAdmin';
import BuyStatistics from './components/BuyStatistics/BuyStatistics';
import AdminCobinet from './components/AdminCobinet/AdminCobinet.jsx';
import Logs from './components/Logs/Logs.jsx';
import InfoStudent from './components/cabinetGroup/InfoStudent.jsx';
import Loder from './components/loder/Loder.jsx';
import ArrivalsReport from './components/ArrivalsReport/ArrivalsReport.jsx';
import ArrivalsInfo from './components/ArrivalsInfo/ArrivalsInfo.jsx';

const MainContent = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const LeftNavbar = styled.section`
  width: ${(props) => (props.openData ? '14%' : '4%')};
  transition: width 0.3s;
`;

const RightInformation = styled.section`
  position: relative;
  width: ${(props) => (props.openData ? '83%' : '95%')};
  @media screen and (min-width: 1900px) {
    &{
      width: ${(props) => (props.openData ? '86%' : '95%')};
    }
  }
  transition: width 0.3s;
  .content_information {
    padding-top: 6%;
    padding-left: 2%;
    padding-right: 1.5%;
    padding-bottom: 3%;
  }
`;

const App = observer(() => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const { user } = useContext(Context);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    check()
      .then((data) => {
        user.setUser(data);
        user.setIsAuth(true);
        console.log(isLoading);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    http.get(
      import.meta.env.VITE_API_URL + 'api/group/teacher-groups/get'
    ).then(() => {

    }).catch((error) => {
      if (error.response.data.message == 'ro\'yxattan o\'tmagan foydalanuvchi!') {
        user.setIsAuth(false);
        localStorage.clear();
        navigate('/');
      } else {
        console.log(error);
      }
    });
  }, []);


  return (
    <Suspense fallback={<Loder stop={false}/>}>
      <div className='App'>
        {
          !user.isAuth && (
            <Routes>
              <Route path={'/'} element={<LoginUser></LoginUser>} />;
              <Route path={'/login'} element={<LoginUser></LoginUser>} />;
            </Routes>
          )
        }

        {
          user.isAuth && (
            <Routes>
              <Route path={'/login'} element={<LoginUser></LoginUser>} />;
            </Routes>
          )
        }




        {user.isAuth && (
          user.user.role == 'teacher' ?
            (
              <MainContent>

                <Header width={'100%'} state={false} />
                <Routes>
                  <Route path='/cabinet/:id' element={<TeachersCobinet />} />
                  <Route path='/cabinet-group/:id' element={<CabinetGroup />} />
                  <Route path='/cabinet-group-student/:id' element={<InfoStudent />} />
                  <Route
                    path={'*'}
                    element={<ErrorPage />}
                  />
                </Routes>

              </MainContent>
            ) : (<MainContent>
              <LeftNavbar openData={open}>
                <Navbar setOpen={setOpen} open={open} />
              </LeftNavbar>
              <RightInformation openData={open}>
                <HeaderAdmin width={''} state={open} />
                <div className='content_information'>
                  <Routes>
                    <Route index element={<MenuGroups />} />
                    <Route path='/' element={<MenuGroups />} />
                    <Route path='/groups' element={<MenuGroups />} />
                    <Route path='/group-one/:id' element={<Group />} />
                    <Route path='/pending-group-one/:id' element={<PendingGroupOne />} />
                    <Route path='/employees' element={<MenusEmployees />} />
                    <Route path='/update-employee/:id' element={<UpdateTeacher />} />
                    <Route path='/employees/add-employee' element={<AddTeacher />} />
                    <Route path='/subjects' element={<Menusubjects />} />
                    <Route path='/all-messages' element={<Messages />} />
                    <Route path='/rooms' element={<RoomsTable />} />
                    <Route path='/lesson-table' element={<LessonTable />} />
                    <Route path='/admin-cobinet' element={<AdminCobinet />} />
                    <Route path='/logs' element={<Logs />} />
                    <Route path='/arrivals-report' element={<ArrivalsReport />} />
                    <Route

                      path='/buy-statistics'
                      element={<BuyStatistics />}
                    />
                    <Route

                      path='/information'
                      element={<MenuInformation />}
                    />
                    <Route path='/buy' element={<BuyTable />} />
                    <Route path='/private-cabinet' element={<PrivateCabinet />} />
                    <Route path='/information-charts' element={<Informations />} />
                    <Route path='/basic-debtors' element={<DebtorsBasic />} />
                    <Route path='/general-students' element={<MenuAddBuy />} />
                    <Route path='/groups/:id' element={<AllGroups />} />
                    <Route path='/student/:id' element={<Student />} />
                    <Route path='/employee-data/:id' element={<Teachers />} />
                    <Route path='/arrivals-info/:id' element={<ArrivalsInfo />} />
                    <Route path='/buy/student' element={<Student />} />
                    <Route path='/debtors/:id' element={<Debtors />} />
                    <Route path='/groups/addgroup' element={<AddGroups />} />
                    <Route path='/pending-student/:id' element={<PendingStudent />} />
                    <Route path='/update-pending-student/:id' element={<PendingUpdate />} />
                    <Route path='/not-group-students' element={<NotGroupsStudentTables />} />
                    <Route path='/not-group-student-page/:id' element={<NoGroupStudent />} />
                    <Route path='/update-not-group-student/:id' element={<UpdateNoGroupStudent />} />
                    <Route

                      path='/groups/:id/addstudent'
                      element={<AddStudent />}
                    />
                    <Route path='/update-groups/:id' element={<UpdateGroups />} />
                    <Route path='/pending' element={<NewPendingRoom />} />
                    {/* <Route path='/pending' element={<Pending />} /> */}
                    <Route

                      path='/pending/:id/pending-add-student'
                      element={<PendingAddStudent />}
                    />
                    <Route
                      path='/groups/:id/addstudent'
                      element={<AddStudent />}
                    />
                    <Route path='/update_groups' element={<UpdateGroups />} />
                    <Route
                      path='/update-student/:id'
                      element={<UpdateStudent />}
                    />


                    <Route
                      path={'*'}
                      element={<ErrorPage />}
                    />

                  </Routes>
                </div>
              </RightInformation>
            </MainContent>
            )
        )}
      </div>
    </Suspense>
  );
});
export default App;
