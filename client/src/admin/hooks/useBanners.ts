
import { useState, useEffect, useRef } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export const useBanners = () => {
  const [banners, setBanners] = useState<any[]>([]);
  const [filteredBanners, setFilteredBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any>(null);

  const [formData, setFormData] = useState({
    type: 'HERO',
    link: '',
    imageUrl: '',
    isActive: true,
  });
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/banners/all');
      const heroBanners = data.data.filter((b: any) => b.type === 'HERO');
      setBanners(heroBanners);
      setFilteredBanners(heroBanners);
    } catch (error) {
      toast.error('Failed to load banners');
    } finally {
      setLoading(false);
    }
  };

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      fetchData();
    }
  }, []);

  useEffect(() => {
    const term = search.toLowerCase();
    const filtered = banners.filter(
      (b) => b.id?.toLowerCase().includes(term) || b.link?.toLowerCase().includes(term)
    );
    setFilteredBanners(filtered);
  }, [search, banners]);

  const handleEdit = (banner: any) => {
    setEditingBanner(banner);
    setFormData({
      type: banner.type || 'HERO',
      link: banner.link || '',
      isActive: banner.isActive,
      imageUrl: banner.imageUrl || '',
    });
    setPreviewUrl(banner.imageUrl);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this banner?')) return;
    try {
      await api.delete(`/banners/${id}`);
      toast.success('Banner deleted');
      fetchData();
    } catch (error) {
      toast.error('Deletion failed');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setEditingBanner(null);
    setFormData({
      type: 'HERO',
      link: '',
      imageUrl: '',
      isActive: true,
    });
    setImage(null);
    setPreviewUrl('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === 'imageUrl') return;
      if (key === 'link' && !(formData as any)[key]) return;
      data.append(key, (formData as any)[key]);
    });
    if (image) data.append('image', image);

    try {
      if (editingBanner) {
        await api.patch(`/banners/${editingBanner.id}`, data);
        toast.success('Banner updated');
      } else {
        await api.post('/banners', data);
        toast.success('Banner created');
      }
      setIsModalOpen(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    banners,
    filteredBanners,
    loading,
    isSubmitting,
    search,
    setSearch,
    isModalOpen,
    setIsModalOpen,
    editingBanner,
    formData,
    setFormData,
    image,
    setImage,
    previewUrl,
    setPreviewUrl,
    fetchData,
    handleEdit,
    handleDelete,
    handleImageChange,
    handleSubmit,
    resetForm,
  };
};
