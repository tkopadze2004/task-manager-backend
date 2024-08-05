export interface JwtPayload {
  sub: number;
  iat: number;
  exp: number;
  email: string;
  username: string;
  tenant: string;
  organization: string;
  branch: string;
  roles: string[];
}
