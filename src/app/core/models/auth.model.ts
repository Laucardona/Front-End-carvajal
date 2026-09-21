export interface RegisterRequest {
  document: string;
  name: string;
  email: string;
  /** Mínimo 8 caracteres (lo valida el backend). */
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

/** Confirmado contra UserResponse.java (record) de carvajal-users. */
export interface UserResponse {
  idUser: number;
  document: string;
  name: string;
  email: string;
  role: string; // TypeRole: 'ADMINISTRADOR' | 'CLIENTE'
}

export interface AuthResponse {
  token: string;
  tokenType: string; // "Bearer"
  user: UserResponse;
}
