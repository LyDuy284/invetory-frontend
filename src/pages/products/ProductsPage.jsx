import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { Card } from '../../components/common/Card';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: '',
    description: '',
    price: '',
    stock: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [loadingList, setLoadingList] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [successTimeout, setSuccessTimeout] = useState(null);

  const fetchProducts = async () => {
    setLoadingList(true);
    setError('');
    try {
      const res = await api.get('/api/products');
      setProducts(res.data);
    } catch (err) {
      setError('Không tải được danh sách sản phẩm');
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resetForm = () => {
    setForm({ id: null, name: '', description: '', price: '', stock: '' });
    setImageFile(null);
  };

  const handleEdit = (product) => {
    setForm({
      id: product.id,
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock: product.stock,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('description', form.description);
      fd.append('price', form.price);
      fd.append('stock', form.stock || 0);
      if (imageFile) fd.append('image', imageFile);

      let res;
      if (form.id) {
        res = await api.put(`/api/products/${form.id}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setSuccess('Cập nhật sản phẩm thành công');
        setProducts((prev) =>
          prev.map((p) => (p.id === form.id ? res.data : p))
        );
      } else {
        res = await api.post('/api/products', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setSuccess('Tạo sản phẩm thành công');
        setProducts((prev) => [res.data, ...prev]);
      }
      if (successTimeout) clearTimeout(successTimeout);
      setSuccessTimeout(setTimeout(() => setSuccess(''), 2000));
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Lưu sản phẩm thất bại');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xoá sản phẩm này?')) return;
    try {
      await api.delete(`/api/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert('Xoá thất bại');
    }
  };

  return (
    <>
      <Card
        title={form.id ? 'Cập nhật sản phẩm' : 'Tạo sản phẩm mới'}
        extra={
          form.id && (
            <button className="button secondary" onClick={resetForm}>
              + Tạo mới
            </button>
          )
        }
      >
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Tên sản phẩm</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Ví dụ: Áo thun"
              required
            />
          </div>
          <div className="input-group">
            <label>Mô tả</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Ghi chú thêm..."
              rows={2}
            />
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <div className="input-group" style={{ flex: 1, minWidth: 120 }}>
              <label>Giá</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="150000"
                min="0"
                required
              />
            </div>
            <div className="input-group" style={{ width: 140 }}>
              <label>Tồn kho</label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                placeholder="0"
                min="0"
                required
              />
            </div>
          </div>
          <div className="input-group">
            <label>Ảnh (tuỳ chọn)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            />
          </div>
          {error && <div className="error-text">{error}</div>}
          {success && <div className="success-text">{success}</div>}
          <button className="button mt-2" type="submit" disabled={saving}>
            {saving ? 'Đang lưu...' : form.id ? 'Cập nhật' : 'Tạo sản phẩm'}
          </button>
        </form>
      </Card>

      <Card
        title="Danh sách sản phẩm"
        extra={
          <button
            className="button secondary"
            onClick={fetchProducts}
            disabled={loadingList}
          >
            {loadingList ? 'Đang tải...' : 'Refresh'}
          </button>
        }
      >
         {products.length === 0 ? (
          <div style={{ fontSize: 14, color: '#9ca3af' }}>Chưa có sản phẩm nào.</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên</th>
                <th>Giá</th>
                <th>Tồn kho</th>
                <th>Ảnh</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>{Number(p.price).toLocaleString('vi-VN')} đ</td>
                  <td>
                    <span
                      style={{
                        color: p.stock < 5 ? 'red' : 'white',
                        fontWeight: p.stock < 5 ? 'bold' : 'normal',
                      }}
                    >
                      {p.stock}
                    </span>
                    {p.stock < 5 && (
                      <span
                        style={{
                          color: 'red',
                          fontSize: '12px',
                          marginLeft: '5px',
                        }}
                      >
                        (Cảnh báo: Sản phẩm còn p.stock)
                      </span>
                    )}
                  </td>
                  <td>
                    {p.imageUrl ? (
                      <a
                        href={p.imageUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{ fontSize: 12 }}
                      >
                        View
                      </a>
                    ) : (
                      <span style={{ fontSize: 12, color: '#6b7280' }}>No image</span>
                    )}
                  </td>
                  <td>
                    <button
                      className="button secondary"
                      style={{ marginRight: 8 }}
                      onClick={() => handleEdit(p)}
                    >
                      Edit
                    </button>
                    <button
                      className="button danger"
                      onClick={() => handleDelete(p.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </>
  );
};

export default ProductsPage;
