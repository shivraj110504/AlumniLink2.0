import { NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import User from '@/models/User';
import dbConnect from './mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '30d';

export const generateToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
  });
};

export const setTokenCookie = (res: NextApiResponse, token: string) => {
  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  };

  res.setHeader('Set-Cookie', serialize('token', token, cookieOptions));
};

export const clearTokenCookie = (res: NextApiResponse) => {
  const cookieOptions = {
    httpOnly: true,
    expires: new Date(1),
    path: '/',
  };

  res.setHeader('Set-Cookie', serialize('token', '', cookieOptions));
};

export const getAuthUser = async (req: any) => {
  await dbConnect();
  
  let token;
  
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  
  if (!token) {
    return null;
  }

  try {
    // Verify token
    const decoded: any = jwt.verify(token, JWT_SECRET);
    
    // Get user from the token
    const user = await User.findById(decoded.id).select('-password');
    
    return user;
  } catch (error) {
    return null;
  }
};
