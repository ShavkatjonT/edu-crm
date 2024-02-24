import React, { useState } from 'react';
import styled from 'styled-components';
import Header from '../Header/Header';
import Navbar from '../Navbar/Navbar';
import { Route, Routes } from 'react-router-dom';
import MenuGroups from '../Menus/MenuGroups';
import MenusTeachers from '../Menus/MenusTeachers';
import Menusubjects from '../Menus/Menusubjects';
import MenuInformation from '../Menus/MenuInformation';
import MenuAddBuy from '../Menus/MenuAddBuy';
import Student from '../Students/Student';
import Debtors from '../Debtors/Debtors';
import Group from '../groups/Group';
import AddGroups from '../AddGroups/AddGroups';
import AddStudent from '../AddStudent/AddStudent';
import UpdateGroups from '../UpdateGropus/UpdateGroups';
import Pending from './../Pending/Pending';
import UpdateStudent from '../UpdateStudent/UpdateStudent';
import PendingAddStudent from '../PendingAddStudent/PendingAddStudent';
import PendingStudent from '../PendingStudent/PendingStudent';
import UpdatePendingStudent from '../UpdatePendingStudent/UpdatePendingStudent';

const MainContent = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const LeftNavbar = styled.section`
  width: ${(props) => (props.openData ? '20%' : '5%')};
  transition: width 0.3s;
`;
const RightInformation = styled.section`
  position: relative;
  width: ${(props) => (props.openData ? '80%' : '95%')};
  transition: width 0.3s;
  .content_information {
    padding-top: 6%;
    padding-left: 2%;
    padding-right: 1.5%;
    padding-bottom: 3%;
  }
`;

function Main() {
  const [open, setOpen] = useState(true);

  return (
    <MainContent>
      <LeftNavbar openData={open}>
        <Navbar setOpen={setOpen} open={open} />
      </LeftNavbar>
      <RightInformation openData={open}>
        <Header state={open} />
        <div className='content_information'>
          <Routes>
            <Route exact index element={<MenuGroups />} />
            <Route exact path='/groups' element={<MenuGroups />} />
            <Route exact path='/employees' element={<MenusTeachers />} />
            <Route exact path='/subjects' element={<Menusubjects />} />
            <Route exact path='/information' element={<MenuInformation />} />
            <Route exact path='/buy' element={<MenuAddBuy />} />
            <Route exact path='/groups/:id' element={<Group />} />
            <Route exact path='/student/:id' element={<Student />} />
            <Route exact path='/buy/student' element={<Student />} />
            <Route exact path='/debtors' element={<Debtors />} />
            <Route exact path='/groups/addgroup' element={<AddGroups />} />
            <Route
              exact
              path='/groups/:id/addstudent'
              element={<AddStudent />}
            />
            <Route exact path='/update_groups' element={<UpdateGroups />} />
            <Route exact path='/pending' element={<Pending />} />
            <Route
              exact
              path='/pending-student/:id'
              element={<PendingStudent />}
            />
            <Route
              exact
              path='/pending/pandingaddstudent'
              element={<PendingAddStudent />}
            />
            <Route
              exact
              path='/groups/:id/addstudent'
              element={<AddStudent />}
            />
            <Route exact path='/update_groups' element={<UpdateGroups />} />
            <Route
              exact
              path='/update_pending_student/:id'
              element={<UpdatePendingStudent />}
            />
            <Route
              exact
              path='/update-student/:id'
              element={<UpdateStudent />}
            />
          </Routes>
        </div>
      </RightInformation>
    </MainContent>
  );
}

export default Main;
