import http from '.';
import jwtDecode from 'jwt-decode';

export const registration = async (email, password) => {
  const { data } = await http.post('api/user/registration', {
    email,
    password,
    role: 'ADMIN',
  });

  localStorage.setItem('token', data.token);
  return jwtDecode(data.token);
};

export const login = async (email, password) => {
  const { data } = await http.post('api/user/login', { email, password });
  localStorage.setItem('token', data.token);
  const user = {
    jwtData:jwtDecode(data.token),
    role:data.role,
    teacher_id: data.teacher && data.teacher.id
  };
  return user;
};

export const check = async () => {
  const { data } = await http.get('api/user/auth');
  localStorage.setItem('token', data.token);
  return jwtDecode(data.token);
};