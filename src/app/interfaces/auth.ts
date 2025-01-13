import { User } from './user';

export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface RegisterData extends LoginCredentials {
    username: string;
    name: string;
    lastName: string;
  }
  
  export interface AuthResponse {
    token: string;
    user:User;
  }