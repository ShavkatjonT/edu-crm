import {
    LOGIN_ROUTE,
    GROUPS_ROUTE,
    ADD_GROUPS_ROUTE,
    ADD_STUDENT_ROUTE,
    ALL_GROUPS_ROUTE,
    DEBTORS_ROUTE,
    PENDING_ROUTE,
    PENDING_ADD_STUDENT_ROUTE,
    STUDENT_ROUTE,
    UPDATE_GROUPS_ROUTE,
    UPDATE_STUDENTS_ROUTE,
} from './utils/consts';

import Login from './components/Login/Login';
import AddGroups from './components/AddGroups/AddGroups';
import AddStudent from './components/AddStudent/AddStudent';
import AllGroups from './components/AllGroups/AllGroups';
import Debtors from './components/Debtors/Debtors';
import Groups from './components/groups/Group';
import Pending from './components/Pending/Pending';
import PendingAddStudent from './components/PendingAddStudent/PendingAddStudent';
import Student from './components/Students/Student';
import UpdateGroups from './components/UpdateGropus/UpdateGroups';
import UpdateStudent from './components/UpdateStudent/UpdateStudent';
// import ContentError from './Components/ContentError';

export const authRoutes = [
  {
    path: GROUPS_ROUTE,
    Element: Groups,
  },
  {
    path: ADD_GROUPS_ROUTE,
    Element: AddGroups,
  },
  {
    path: ADD_STUDENT_ROUTE,
    Element: AddStudent,
  },
  {
    path: ALL_GROUPS_ROUTE,
    Element: AllGroups,
  },
  {
    path: DEBTORS_ROUTE,
    Element: Debtors,
  },
  {
    path: '/',
    Element: Groups,
  },
  {
    path: PENDING_ROUTE,
    Element: Pending,
  },
  {
    path: PENDING_ADD_STUDENT_ROUTE,
    Element: PendingAddStudent,
  },
  {
    path: STUDENT_ROUTE,
    Element: Student,
  },
  {
    path: UPDATE_GROUPS_ROUTE,
    Element: UpdateGroups,
  },
  {
    path: UPDATE_STUDENTS_ROUTE,
    Element: UpdateStudent,
  },
];

export const publicRoutes = [
  {
    path: LOGIN_ROUTE,
    Element: Login,
  },
//   {
//     path: '*',
//     Component: ContentError,
//   },
];
