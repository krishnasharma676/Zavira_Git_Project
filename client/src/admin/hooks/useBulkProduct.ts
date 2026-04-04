
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { useAdminStore } from '../../store/useAdminStore';

export interface VariantForm {
  id?: string;
  color: string;
  colorCode: string;
  colorId?: string;
  sizes: { id?: string; size: string; stock: string; sku: string }[];
  images: File[];
  previewUrls: string[];
  existingImages?: { id: string; imageUrl: string }[];
}

export const useBulkProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { categories, colors: savedColors, fetchColors } = useAdminStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(!!id);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    basePrice: '',
    discountedPrice: '',
    categoryId: '',
    hotDeals: false,
    featured: false,
    trending: false,
    weight: '0',
    length: '0',
    width: '0',
    height: '0',
    hsnCode: '',
    taxRate: '0',
    weightUnit: 'kg',
    dimensionUnit: 'cm',
    widthUnit: 'cm',
    heightUnit: 'cm',
  });

  const [variants, setVariants] = useState<VariantForm[]>([
    {
      color: '',
      colorCode: '#000000',
      sizes: [{ size: '', stock: '', sku: '' }],
      images: [],
      previewUrls: [],
    }
  ]);

  const generateSKU = (name: string = "") => {
    const prefix = "ZV";
    const namePart = (name || "VAR").substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'X');
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}-${namePart}-${randomPart}`;
  };

  useEffect(() => {
    if (!id && variants[0].sizes[0].sku === '') {
      const initialSku = generateSKU("");
      const newVariants = [...variants];
      newVariants[0].sizes[0].sku = initialSku;
      setVariants(newVariants);
    }
  }, [id]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        fetchColors();
        if (id) {
          const { data: pRes } = await api.get(`/products/${id}`);
          const p = pRes.data;

          if (p) {
            setFormData({
              name: p.name || '',
              description: p.description || '',
              basePrice: (p.basePrice || 0).toString(),
              discountedPrice: (p.discountedPrice || '').toString(),
              categoryId: p.categoryId || '',
              hotDeals: p.hotDeals || false,
              featured: p.featured || false,
              trending: p.trending || false,
              weight: (p.weight || 0).toString(),
              length: (p.length || 0).toString(),
              width: (p.width || 0).toString(),
              height: (p.height || 0).toString(),
              hsnCode: p.hsnCode || '',
              taxRate: (p.taxRate || 0).toString(),
              weightUnit: (p.weightUnit as string) || 'kg',
              dimensionUnit: (p.dimensionUnit as string) || 'cm',
              widthUnit: (p.widthUnit as string) || 'cm',
              heightUnit: (p.heightUnit as string) || 'cm',
            });

            const { data: vRes } = await api.get(`/variants/product/${id}`);
            const vData = vRes.data;

            if (vData && Array.isArray(vData)) {
              const fetchedVariants = vData.map((v: any) => ({
                id: v.id,
                color: v.color || '',
                colorCode: v.colorCode || '#000000',
                colorId: v.colorId || '',
                sizes: (v.sizes || []).map((s: any) => ({
                  id: s.id,
                  size: s.size,
                  stock: s.stock.toString(),
                  sku: s.sku || ''
                })),
                images: [],
                previewUrls: [],
                existingImages: v.images || []
              }));

              if (fetchedVariants.length > 0) {
                setVariants(fetchedVariants);
              }
            }
          }
        }
      } catch (error) {
        toast.error('Initialization failed');
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [id, fetchColors]);

  const handleAddVariant = () => {
    setVariants([...variants, { color: '', colorCode: '#000000', sizes: [{ size: '', stock: '', sku: generateSKU(formData.name) }], images: [], previewUrls: [] }]);
  };

  const handleRemoveVariant = (index: number) => {
    if (variants.length === 1) return;
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleAddSize = (variantIndex: number) => {
    const newVariants = [...variants];
    newVariants[variantIndex].sizes.push({ size: '', stock: '', sku: generateSKU(formData.name || variants[variantIndex].color) });
    setVariants(newVariants);
  };

  const handleRemoveSize = (variantIndex: number, sizeIndex: number) => {
    const newVariants = [...variants];
    newVariants[variantIndex].sizes = newVariants[variantIndex].sizes.filter((_, i) => i !== sizeIndex);
    setVariants(newVariants);
  };

  const handleImageChange = (variantIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const newUrls = selectedFiles.map(file => URL.createObjectURL(file));

      const newVariants = [...variants];
      newVariants[variantIndex].images = [...newVariants[variantIndex].images, ...selectedFiles];
      newVariants[variantIndex].previewUrls = [...newVariants[variantIndex].previewUrls, ...newUrls];
      setVariants(newVariants);
    }
  };

  const handleRemoveImage = (variantIndex: number, imageIndex: number) => {
    const newVariants = [...variants];
    newVariants[variantIndex].images = newVariants[variantIndex].images.filter((_, i) => i !== imageIndex);
    newVariants[variantIndex].previewUrls = newVariants[variantIndex].previewUrls.filter((_, i) => i !== imageIndex);
    setVariants(newVariants);
  };

  const handleDeleteImage = async (vIdx: number, imgId: string) => {
    if (!window.confirm('Delete live image?')) return;
    try {
      await api.delete(`/products/${id}/images/${imgId}`);
      const newV = [...variants];
      newV[vIdx].existingImages = newV[vIdx].existingImages?.filter(x => x.id !== imgId);
      setVariants(newV);
      toast.success('Live image purged');
    } catch { toast.error('Purge failed'); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (variants.some(v => !v.color)) {
      toast.error('Color is required for all variants');
      return;
    }

    setIsSubmitting(true);
    try {
      const productData = new FormData();
      Object.keys(formData).forEach(key => {
        let val = (formData as any)[key];
        if (val !== undefined && val !== null) {
          productData.append(key, val.toString());
        }
      });

      let totalStock = 0;
      variants.forEach(v => v.sizes.forEach(s => { totalStock += Number(s.stock) || 0; }));
      productData.append('stock', totalStock.toString());
      productData.append('attributes', JSON.stringify({ isVariantProduct: true }));

      let productId = id;
      if (id) {
        await api.patch(`/products/${id}`, productData);
      } else {
        const { data } = await api.post('/products', productData);
        productId = data.data.id;
      }

      const newOrModifiedVariants = variants.filter(v => !v.id || v.images.length > 0);

      if (newOrModifiedVariants.length > 0) {
        const variantFormData = new FormData();
        const payload = newOrModifiedVariants.map((v, i) => {
          v.images.forEach(img => {
            variantFormData.append(`variant_${i}_images`, img);
          });
          return {
            id: v.id,
            color: v.color,
            colorCode: v.colorCode,
            colorId: v.colorId,
            sizes: v.sizes
          };
        });
        variantFormData.append('variants', JSON.stringify(payload));
        await api.post(`/variants/product/${productId}`, variantFormData);
      }

      toast.success(id ? 'Product Updated Successfully!' : 'Bulk Product Created Successfully!');
      if (!id) {
        navigate('/admin/bulk-products');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Operation Failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    id,
    formData,
    setFormData,
    variants,
    setVariants,
    loading,
    isSubmitting,
    categories,
    savedColors,
    generateSKU,
    handleAddVariant,
    handleRemoveVariant,
    handleAddSize,
    handleRemoveSize,
    handleImageChange,
    handleRemoveImage,
    handleDeleteImage,
    handleSubmit,
  };
};
