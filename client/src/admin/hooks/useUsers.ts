
import { useState, useEffect, useRef } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export const useUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authForm, setAuthForm] = useState({
    email: '',
    phone: '',
    role: 'ADMIN'
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/auth/admin/users');
      setUsers(data.data);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      fetchUsers();
    }
  }, []);

  const handleAuthorize = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', { 
        ...authForm, 
        name: 'Staff Member', 
        password: 'TemporaryPassword123' 
      });
      toast.success('User created successfully');
      setIsModalOpen(false);
      fetchUsers();
      setAuthForm({ email: '', phone: '', role: 'ADMIN' });
    } catch (error) {
      toast.error('Failed to create user');
    }
  };

  const handleBlockUser = async (id: string) => {
    try {
      await api.patch(`/auth/admin/users/${id}/block`);
      toast.success('User blocked successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to block user');
    }
  };

  const handleUnblockUser = async (id: string) => {
    try {
      await api.patch(`/auth/admin/users/${id}/unblock`);
      toast.success('User unblocked successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to unblock user');
    }
  };

  const handleSoftDeleteUser = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this user record from active view?')) return;
    try {
      await api.patch(`/auth/admin/users/${id}/delete`);
      toast.success('User purged successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to purge user');
    }
  };

  return {
    users,
    loading,
    isModalOpen,
    setIsModalOpen,
    authForm,
    setAuthForm,
    fetchUsers,
    handleAuthorize,
    handleBlockUser,
    handleUnblockUser,
    handleSoftDeleteUser,
  };
};
