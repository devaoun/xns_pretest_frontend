import axios from '../config/axios'

interface User {
  id: number;
  username: string;
  email: string;
  voteStatus: boolean;
  token: string;
}

interface RegisterInput {
  username: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

const usersApi = {
  userRegister: (input: RegisterInput) => axios.post<User>('/auth/signup', input),
  userLogin: (input: LoginInput) => axios.post<User>('/auth/login', input),
  getMe: (token: string) => axios.get('/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export default usersApi;
