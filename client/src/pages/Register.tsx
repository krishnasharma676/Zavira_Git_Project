import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUIStore } from '../store/useUIStore';

// /register route no longer exists — open the auth modal in register mode instead
const Register = () => {
  const navigate = useNavigate();
  const openAuthModal = useUIStore((s) => s.openAuthModal);

  useEffect(() => {
    navigate('/', { replace: true });
    openAuthModal('register');
  }, [navigate, openAuthModal]);

  return null;
};

export default Register;
