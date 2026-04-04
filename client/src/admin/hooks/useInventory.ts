
import { useState, useEffect, useRef } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { useAdminStore } from '../../store/useAdminStore';

const emptyForm = {
  name: '', description: '', basePrice: '', discountedPrice: '',
  categoryId: '', stock: '', sku: '', hotDeals: false, sizes: '',
  weight: '', length: '', width: '', height: '', hsnCode: '', taxRate: '0',
  weightUnit: 'kg', dimensionUnit: 'cm', widthUnit: 'cm', heightUnit: 'cm'
};

export const useInventory = () => {
    const { categories } = useAdminStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [totalRows, setTotalRows] = useState(0);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [search, setSearch] = useState('');
    const [galleryView, setGalleryView] = useState<{ isOpen: boolean; images: any[]; activeIndex: number }>({ isOpen: false, images: [], activeIndex: 0 });
    const [existingImages, setExistingImages] = useState<{ id: string; imageUrl: string }[]>([]);
    const [images, setImages] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [formData, setFormData] = useState({ ...emptyForm });
    const [attributes, setAttributes] = useState<{ key: string; value: string }[]>([]);

    const fetchProducts = async (pageNum = 0, pageSize = 10) => {
        setLoading(true);
        try {
            const { data } = await api.get('/products', { 
                params: { 
                    page: pageNum + 1, 
                    limit: pageSize, 
                    search: search || undefined, 
                    hasVariants: 'false' 
                } 
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
        setProducts(p => [...p].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    };

    const sortByLowStock = () => {
        setProducts(p => [...p].sort((a, b) => (a.inventory?.stock || 0) - (b.inventory?.stock || 0)));
    };

    const handleUpdateStock = async (productId: string, currentStock: number, delta: number) => {
        const newStock = Math.max(0, currentStock + delta);
        try {
            await api.patch(`/inventory/${productId}/stock`, { stock: newStock });
            setProducts(prev => prev.map(p => p.id === productId ? { ...p, inventory: { ...p.inventory, stock: newStock } } : p));
        } catch {
            toast.error('Stock update failed');
        }
    };

    const generateSKU = (name: string = "") => {
        const prefix = "ZV";
        const namePart = (name || "PROD").substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'X');
        const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
        return `${prefix}-${namePart}-${randomPart}`;
    };

    const openEdit = (product: any) => {
        setEditingProduct(product);
        setFormData({
            name: product.name || '',
            description: product.description || '',
            basePrice: product.basePrice?.toString() || '',
            discountedPrice: product.discountedPrice?.toString() || '',
            categoryId: product.categoryId || '',
            stock: product.inventory?.stock?.toString() || '0',
            sku: product.inventory?.sku || '',
            hotDeals: product.hotDeals || false,
            sizes: product.sizes || '',
            weight: product.weight?.toString() || '',
            length: product.length?.toString() || '',
            width: product.width?.toString() || '',
            height: product.height?.toString() || '',
            hsnCode: product.hsnCode || '',
            taxRate: product.taxRate?.toString() || '0',
            weightUnit: product.weightUnit || 'kg',
            dimensionUnit: product.dimensionUnit || 'cm',
            widthUnit: product.widthUnit || 'cm',
            heightUnit: product.heightUnit || 'cm'
        });
        const attrs = product.attributes
            ? Object.keys(product.attributes).map(k => ({ key: k, value: String(product.attributes[k]) }))
            : [];
        setAttributes(attrs);
        setExistingImages(product.images?.map((i: any) => ({ id: i.id, imageUrl: i.imageUrl })) || []);
        setImages([]);
        setPreviewUrls([]);
        setIsModalOpen(true);
    };

    const openAdd = () => {
        setEditingProduct(null);
        setFormData({ ...emptyForm, sku: generateSKU("") });
        setAttributes([]);
        setExistingImages([]);
        setImages([]);
        setPreviewUrls([]);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Delete this product?')) return;
        try {
            await api.delete(`/products/${id}`);
            toast.success('Deleted');
            fetchProducts();
        } catch {
            toast.error('Delete failed');
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setImages(prev => [...prev, ...files]);
            setPreviewUrls(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
        }
    };

    const removeImage = (index: number, type: 'existing' | 'new') => {
        if (type === 'new') {
            setPreviewUrls(p => p.filter((_, idx) => idx !== index));
            setImages(p => p.filter((_, idx) => idx !== index));
        }
    };

    const removeExistingImage = async (imgId: string) => {
        if (!editingProduct || !window.confirm('Remove this image?')) return;
        try {
            await api.delete(`/products/${editingProduct.id}/images/${imgId}`);
            setExistingImages(prev => prev.filter(i => i.id !== imgId));
            toast.success('Image removed');
        } catch {
            toast.error('Failed to remove image');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        if (e) e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);

        const fd = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                fd.append(key, String(value));
            }
        });

        const attrObj: any = {};
        attributes.forEach(a => { if (a.key && a.value) attrObj[a.key] = a.value; });
        fd.append('attributes', JSON.stringify(attrObj));
        images.forEach(img => fd.append('images', img));

        try {
            if (editingProduct) {
                await api.patch(`/products/${editingProduct.id}`, fd);
                toast.success('Product updated!');
            } else {
                await api.post('/products', fd);
                toast.success('Product added!');
            }
            setIsModalOpen(false);
            await fetchProducts();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    const openGallery = (imgs: any[]) => {
        if (imgs?.length > 0) setGalleryView({ isOpen: true, images: imgs, activeIndex: 0 });
    };

    return {
        categories,
        isModalOpen, setIsModalOpen,
        editingProduct,
        products,
        totalRows,
        page, setPage,
        loading,
        isSubmitting,
        search, setSearch,
        galleryView, setGalleryView,
        existingImages,
        images,
        previewUrls,
        formData, setFormData,
        attributes, setAttributes,
        fetchProducts,
        sortByLatest,
        sortByLowStock,
        handleUpdateStock,
        generateSKU,
        openEdit,
        openAdd,
        handleDelete,
        handleImageChange,
        removeImage,
        removeExistingImage,
        handleSubmit,
        openGallery
    };
};
