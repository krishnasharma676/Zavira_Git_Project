
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export const useBulkProductManagement = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [galleryView, setGalleryView] = useState<{
    isOpen: boolean;
    images: any[];
    activeIndex: number;
  }>({ isOpen: false, images: [], activeIndex: 0 });
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchProducts = async (pageNum = 0, pageSize = 10) => {
    setLoading(true);
    try {
      const { data } = await api.get('/products', {
        params: {
          page: pageNum + 1,
          limit: pageSize,
          search: search || undefined,
          hasVariants: 'true',
        },
      });
      setProducts(data.data.products);
      setTotalRows(data.data.pagination.total);
      setPage(pageNum);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      fetchProducts(0, 10);
    }
  }, []);

  const sortByLatest = () => {
    setProducts((p) =>
      [...p].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    );
  };

  const sortByName = () => {
    setProducts((p) => [...p].sort((a, b) => a.name.localeCompare(b.name)));
  };

  const handleEdit = (product: any) => {
    navigate(`/admin/bulk-products/edit/${product.id}`);
  };

  const openAdd = () => {
    navigate('/admin/bulk-create');
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this product and all its variants?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Deleted');
      fetchProducts();
    } catch {
      toast.error('Delete failed');
    }
  };

  const openGallery = (imgs: any[]) => {
    if (imgs?.length > 0) setGalleryView({ isOpen: true, images: imgs, activeIndex: 0 });
  };

  return {
    products,
    galleryView,
    setGalleryView,
    totalRows,
    page,
    loading,
    search,
    setSearch,
    fetchProducts,
    sortByLatest,
    sortByName,
    handleEdit,
    openAdd,
    handleDelete,
    openGallery,
  };
};
