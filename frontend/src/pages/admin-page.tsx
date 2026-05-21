import { zodResolver } from '@hookform/resolvers/zod';
import { Edit, Plus, Search, ShieldCheck, Trash2, Upload } from 'lucide-react';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { ErrorState } from '@/components/common/error-state';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/useToast';
import { adminService } from '@/services/admin.service';
import type { PageResponse } from '@/types/api';
import type { AdminStats, CategoryOption, ProductPayload } from '@/types/admin';
import type { Order } from '@/types/order';
import type { Product } from '@/types/product';

const productSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  slug: z
    .string()
    .min(2, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Use lowercase letters, numbers, and hyphens'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.coerce.number().min(0),
  compareAtPrice: z.coerce.number().min(0),
  imageUrl: z.string().min(1, 'Image is required'),
  categorySlug: z.string().min(1, 'Category is required'),
  sizesText: z.string().min(1, 'Add at least one size'),
  colorsText: z.string().min(1, 'Add at least one color'),
  stockQuantity: z.coerce.number().int().min(0),
  featured: z.boolean(),
  active: z.boolean(),
});

type ProductFormInput = z.input<typeof productSchema>;
type ProductFormValues = z.output<typeof productSchema>;
type AdminTab = 'overview' | 'products' | 'orders';

const orderStatuses: Order['status'][] = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export function AdminPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [products, setProducts] = useState<PageResponse<Product> | null>(null);
  const [orders, setOrders] = useState<PageResponse<Order> | null>(null);
  const [productSearch, setProductSearch] = useState('');
  const [productPage, setProductPage] = useState(0);
  const [orderPage, setOrderPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isProductsLoading, setIsProductsLoading] = useState(false);
  const [isOrdersLoading, setIsOrdersLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const productForm = useForm<ProductFormInput, unknown, ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: emptyProductDefaults(),
  });

  const featuredCount = useMemo(
    () => products?.content.filter((product) => product.featured).length ?? 0,
    [products],
  );

  useEffect(() => {
    let mounted = true;

    Promise.all([adminService.stats(), adminService.categories()])
      .then(([statsData, categoryData]) => {
        if (mounted) {
          setStats(statsData);
          setCategories(categoryData);
          setError(null);
        }
      })
      .catch(() => {
        if (mounted) setError('Admin dashboard data is unavailable.');
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    setIsProductsLoading(true);

    adminService
      .products(productSearch, productPage)
      .then((data) => {
        if (mounted) setProducts(data);
      })
      .catch(() => {
        if (mounted) setError('Unable to load products.');
      })
      .finally(() => {
        if (mounted) setIsProductsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [productPage, productSearch]);

  useEffect(() => {
    let mounted = true;
    setIsOrdersLoading(true);

    adminService
      .orders(orderPage)
      .then((data) => {
        if (mounted) setOrders(data);
      })
      .catch(() => {
        if (mounted) setError('Unable to load orders.');
      })
      .finally(() => {
        if (mounted) setIsOrdersLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [orderPage]);

  const openCreateModal = () => {
    setEditingProduct(null);
    productForm.reset(emptyProductDefaults(categories[0]?.slug));
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    productForm.reset({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      imageUrl: product.imageUrl,
      categorySlug: product.categorySlug ?? product.category.toLowerCase(),
      sizesText: product.sizes.join(', '),
      colorsText: product.colors.join(', '),
      stockQuantity: product.stockQuantity,
      featured: product.featured,
      active: product.active ?? true,
    });
    setIsModalOpen(true);
  };

  const saveProduct = async (values: ProductFormValues) => {
    const payload: ProductPayload = {
      name: values.name,
      slug: values.slug,
      description: values.description,
      price: values.price,
      compareAtPrice: values.compareAtPrice,
      imageUrl: values.imageUrl,
      categorySlug: values.categorySlug,
      sizes: splitList(values.sizesText),
      colors: splitList(values.colorsText),
      stockQuantity: values.stockQuantity,
      featured: values.featured,
      active: values.active,
    };

    try {
      if (editingProduct) {
        await adminService.updateProduct(editingProduct.id, payload);
        toast({ title: 'Product updated', variant: 'success' });
      } else {
        await adminService.createProduct(payload);
        toast({ title: 'Product created', variant: 'success' });
      }
      setIsModalOpen(false);
      setProducts(await adminService.products(productSearch, productPage));
      setStats(await adminService.stats());
    } catch {
      toast({
        title: 'Product was not saved',
        description: 'Check required fields, slug uniqueness, and image URL.',
        variant: 'error',
      });
    }
  };

  const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const response = await adminService.uploadProductImage(file);
      productForm.setValue('imageUrl', response.url, { shouldValidate: true });
      toast({ title: 'Image uploaded', variant: 'success' });
    } catch {
      toast({ title: 'Image upload failed', variant: 'error' });
    }
  };

  const deleteProduct = async (product: Product) => {
    try {
      await adminService.deleteProduct(product.id);
      toast({ title: 'Product archived', variant: 'success' });
      setProducts(await adminService.products(productSearch, productPage));
      setStats(await adminService.stats());
    } catch {
      toast({ title: 'Could not archive product', variant: 'error' });
    }
  };

  const updateOrderStatus = async (orderId: number, status: Order['status']) => {
    try {
      await adminService.updateOrderStatus(orderId, status);
      toast({ title: 'Order updated', variant: 'success' });
      setOrders(await adminService.orders(orderPage));
    } catch {
      toast({ title: 'Could not update order', variant: 'error' });
    }
  };

  return (
    <section className="container py-8">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary text-primary-foreground">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-normal text-primary">Admin</p>
            <h1 className="text-4xl font-bold tracking-normal">Dashboard</h1>
          </div>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="h-4 w-4" />
          New product
        </Button>
      </div>

      <div className="mb-6 flex gap-2 overflow-x-auto">
        {(['overview', 'products', 'orders'] as AdminTab[]).map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? 'default' : 'outline'}
            onClick={() => setActiveTab(tab)}
          >
            {tab[0].toUpperCase() + tab.slice(1)}
          </Button>
        ))}
      </div>

      {error && <ErrorState message={error} />}

      {activeTab === 'overview' && (
        <OverviewPanel stats={stats} featuredCount={featuredCount} isLoading={isLoading} />
      )}

      {activeTab === 'products' && (
        <ProductsPanel
          products={products}
          search={productSearch}
          setSearch={(value) => {
            setProductSearch(value);
            setProductPage(0);
          }}
          page={productPage}
          setPage={setProductPage}
          isLoading={isProductsLoading}
          onEdit={openEditModal}
          onDelete={(product) => void deleteProduct(product)}
        />
      )}

      {activeTab === 'orders' && (
        <OrdersPanel
          orders={orders}
          page={orderPage}
          setPage={setOrderPage}
          isLoading={isOrdersLoading}
          onStatusChange={(orderId, status) => void updateOrderStatus(orderId, status)}
        />
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-background/80 p-4 backdrop-blur">
          <Card className="max-h-[92vh] w-full max-w-3xl overflow-y-auto">
            <CardHeader>
              <CardTitle>{editingProduct ? 'Edit product' : 'Create product'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                className="grid gap-4 sm:grid-cols-2"
                onSubmit={productForm.handleSubmit(saveProduct)}
              >
                <Field label="Name" error={productForm.formState.errors.name?.message}>
                  <Input {...productForm.register('name')} />
                </Field>
                <Field label="Slug" error={productForm.formState.errors.slug?.message}>
                  <Input {...productForm.register('slug')} />
                </Field>
                <Field
                  className="sm:col-span-2"
                  label="Description"
                  error={productForm.formState.errors.description?.message}
                >
                  <textarea
                    className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    {...productForm.register('description')}
                  />
                </Field>
                <Field label="Price" error={productForm.formState.errors.price?.message}>
                  <Input type="number" step="0.01" {...productForm.register('price')} />
                </Field>
                <Field
                  label="Compare at price"
                  error={productForm.formState.errors.compareAtPrice?.message}
                >
                  <Input type="number" step="0.01" {...productForm.register('compareAtPrice')} />
                </Field>
                <Field label="Category" error={productForm.formState.errors.categorySlug?.message}>
                  <select
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    {...productForm.register('categorySlug')}
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.slug}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Stock" error={productForm.formState.errors.stockQuantity?.message}>
                  <Input type="number" {...productForm.register('stockQuantity')} />
                </Field>
                <Field
                  className="sm:col-span-2"
                  label="Image URL"
                  error={productForm.formState.errors.imageUrl?.message}
                >
                  <div className="flex gap-2">
                    <Input {...productForm.register('imageUrl')} />
                    <Button type="button" variant="outline" asChild>
                      <label className="cursor-pointer">
                        <Upload className="h-4 w-4" />
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          className="sr-only"
                          onChange={uploadImage}
                        />
                      </label>
                    </Button>
                  </div>
                </Field>
                <Field label="Sizes" error={productForm.formState.errors.sizesText?.message}>
                  <Input placeholder="XS, S, M, L" {...productForm.register('sizesText')} />
                </Field>
                <Field label="Colors" error={productForm.formState.errors.colorsText?.message}>
                  <Input placeholder="Black, Ivory" {...productForm.register('colorsText')} />
                </Field>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" {...productForm.register('featured')} />
                  Featured
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" {...productForm.register('active')} />
                  Active
                </label>
                <div className="flex justify-end gap-2 sm:col-span-2">
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={productForm.formState.isSubmitting}>
                    {productForm.formState.isSubmitting ? 'Saving...' : 'Save product'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </section>
  );
}

function OverviewPanel({
  stats,
  featuredCount,
  isLoading,
}: {
  stats: AdminStats | null;
  featuredCount: number;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-4">
      <MetricCard label="Users" value={stats?.users ?? 0} />
      <MetricCard label="Products" value={stats?.products ?? 0} />
      <MetricCard label="Orders" value={stats?.orders ?? 0} />
      <MetricCard label="Featured" value={featuredCount} />
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-bold tracking-normal">{value}</p>
      </CardContent>
    </Card>
  );
}

function ProductsPanel({
  products,
  search,
  setSearch,
  page,
  setPage,
  isLoading,
  onEdit,
  onDelete,
}: {
  products: PageResponse<Product> | null;
  search: string;
  setSearch: (value: string) => void;
  page: number;
  setPage: (value: number) => void;
  isLoading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <CardTitle>Products</CardTitle>
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-96 w-full" />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="border-b text-muted-foreground">
                  <tr>
                    <th className="py-3">Product</th>
                    <th>Category</th>
                    <th>Stock</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products?.content.map((product) => (
                    <tr key={product.id} className="border-b">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            loading="lazy"
                            decoding="async"
                            className="h-12 w-10 rounded object-cover"
                          />
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-xs text-muted-foreground">{product.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td>{product.categoryName ?? product.category}</td>
                      <td>{product.stockQuantity}</td>
                      <td>${product.price.toFixed(2)}</td>
                      <td>
                        <Badge variant={product.active === false ? 'outline' : 'default'}>
                          {product.active === false ? 'Archived' : 'Active'}
                        </Badge>
                      </td>
                      <td className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => onEdit(product)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onDelete(product)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={page} totalPages={products?.totalPages ?? 1} setPage={setPage} />
          </>
        )}
      </CardContent>
    </Card>
  );
}

function OrdersPanel({
  orders,
  page,
  setPage,
  isLoading,
  onStatusChange,
}: {
  orders: PageResponse<Order> | null;
  page: number;
  setPage: (value: number) => void;
  isLoading: boolean;
  onStatusChange: (orderId: number, status: Order['status']) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-96 w-full" />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="border-b text-muted-foreground">
                  <tr>
                    <th className="py-3">Order</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders?.content.map((order) => (
                    <tr key={order.id} className="border-b">
                      <td className="py-3 font-medium">#{order.id}</td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>{order.items.length}</td>
                      <td>${order.total.toFixed(2)}</td>
                      <td>
                        <select
                          className="h-9 rounded-md border border-input bg-background px-2"
                          value={order.status}
                          onChange={(event) =>
                            onStatusChange(order.id, event.target.value as Order['status'])
                          }
                        >
                          {orderStatuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={page} totalPages={orders?.totalPages ?? 1} setPage={setPage} />
          </>
        )}
      </CardContent>
    </Card>
  );
}

function Pagination({
  page,
  totalPages,
  setPage,
}: {
  page: number;
  totalPages: number;
  setPage: (value: number) => void;
}) {
  return (
    <div className="mt-4 flex items-center justify-between gap-3">
      <p className="text-sm text-muted-foreground">
        Page {page + 1} of {Math.max(totalPages, 1)}
      </p>
      <div className="flex gap-2">
        <Button variant="outline" disabled={page === 0} onClick={() => setPage(page - 1)}>
          Previous
        </Button>
        <Button
          variant="outline"
          disabled={page + 1 >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  className,
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={className}>
      <span className="mb-2 block text-sm font-medium">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}

function splitList(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function emptyProductDefaults(categorySlug = 'dresses'): ProductFormValues {
  return {
    name: '',
    slug: '',
    description: '',
    price: 0,
    compareAtPrice: 0,
    imageUrl: '',
    categorySlug,
    sizesText: 'XS, S, M, L',
    colorsText: 'Black',
    stockQuantity: 0,
    featured: false,
    active: true,
  };
}
