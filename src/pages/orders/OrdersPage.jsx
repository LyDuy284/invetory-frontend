import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { Card } from '../../components/common/Card';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [items, setItems] = useState([{ productId: '', productName: '', quantity: '' }]);
  const [products, setProducts] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [successTimeout, setSuccessTimeout] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/api/products');
      setProducts(res.data);
    } catch (err) {
      setError('Không thể tải danh sách sản phẩm');
    }
  };

  const fetchOrders = async () => {
    setLoadingList(true);
    setError('');
    try {
      const res = await api.get('/api/orders');
      setOrders(res.data);
    } catch (err) {
      setError('Không tải được danh sách đơn hàng');
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders(); 
  }, []);

  const handleItemChange = (index, field, value) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };

      if (field === 'productId') {
        const selectedProduct = products.find((p) => p.id === Number(value));
        copy[index].productName = selectedProduct ? selectedProduct.name : '';
      }

      return copy;
    });
  };

  const addItemRow = () => {
    setItems((prev) => [...prev, { productId: '', productName: '', quantity: '' }]);
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setCreating(true);

    const invalidItem = items.find(
      (item) => !item.productId || !item.productName || !item.quantity || item.quantity <= 0
    );

    if (invalidItem) {
      setError('Vui lòng kiểm tra lại sản phẩm và số lượng.');
      setCreating(false);
      return;
    }

    try {
      const payloadItems = items.map((i) => ({
        productId: Number(i.productId),
        quantity: Number(i.quantity),
      }));
      await api.post('/api/orders', { items: payloadItems });
      setSuccess('Tạo đơn hàng thành công');
      setItems([{ productId: '', productName: '', quantity: '' }]);
      fetchOrders(); 
      if (successTimeout) clearTimeout(successTimeout);
      setSuccessTimeout(setTimeout(() => setSuccess(''), 2000));
    } catch (err) {
      setError(err.response?.data?.message || 'Tạo đơn hàng thất bại');
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateStatus = async (orderId, status) => {
    try {
      const order = orders.find((order) => order.id === orderId);
      
      if (order.status === 'completed') {
      setError('Không thể thay đổi trạng thái khi đơn hàng đã hoàn thành');
      return;
      }

      await api.patch(`/api/orders/${orderId}/status`, { status });
      setSuccess('Trạng thái đơn hàng đã được cập nhật');
      if (successTimeout) clearTimeout(successTimeout);
      setSuccessTimeout(setTimeout(() => setSuccess(''), 2000));
      fetchOrders(); 
    } catch (err) {
      setError('Cập nhật trạng thái đơn hàng thất bại');
    }
  };

  const getStatusClass = (status) => {
    if (status === 'completed') return 'badge completed';
    if (status === 'cancelled') return 'badge cancelled';
    return 'badge pending';
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true); 
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null); 
  };

  return (
    <>
      <Card title="Tạo đơn hàng mới">
        <form onSubmit={handleCreateOrder}>
          {items.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                gap: 12,
                marginBottom: 8,
                flexWrap: 'wrap',
              }}
            >
              <div className="input-group" style={{ flex: 1, minWidth: 120 }}>
                <label>Product</label>
                <select
                  value={item.productId}
                  onChange={(e) => handleItemChange(idx, 'productId', e.target.value)}
                >
                  <option value="">Chọn sản phẩm</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="input-group" style={{ flex: 1, minWidth: 120 }}>
                <label>Tên sản phẩm</label>
                <input
                  type="text"
                  value={item.productName}
                  disabled
                  placeholder="Tên sản phẩm sẽ tự động cập nhật"
                />
              </div>
              <div className="input-group" style={{ width: 140 }}>
                <label>Quantity</label>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                  placeholder="1"
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            className="button secondary"
            style={{ marginBottom: 8 }}
            onClick={addItemRow}
          >
            + Thêm sản phẩm
          </button>
          {error && <div className="error-text">{error}</div>}
          {success && <div className="success-text">{success}</div>}
          <button className="button mt-2" type="submit" disabled={creating}>
            {creating ? 'Đang tạo...' : 'Tạo đơn hàng'}
          </button>
        </form>
      </Card>

      <Card
        title="Danh sách đơn hàng"
        extra={
          <button
            className="button secondary"
            onClick={fetchOrders}
            disabled={loadingList}
          >
            {loadingList ? 'Đang tải...' : 'Refresh'}
          </button>
        }
      >
        {orders.length === 0 ? (
          <div style={{ fontSize: 14, color: '#9ca3af' }}>Chưa có đơn hàng nào.</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Ngày</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>{Number(o.totalPrice).toLocaleString('vi-VN')} đ</td>
                  <td>
                    <span className={getStatusClass(o.status)}>{o.status}</span>
                  </td>
                  <td>{new Date(o.createdAt).toLocaleString('vi-VN')}</td>
                  <td>
                   
                    {o.status === 'completed' ? (
                      <span className="badge completed">Completed</span>
                    ) : (
                     <select
                        value={o.status}
                        onChange={(e) => handleUpdateStatus(o.id, e.target.value)}
                        style={{ marginRight: '10px' }}
                      >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                       </select>
                  )}
                  <button className="button primary" onClick={() => handleViewDetails(o)} style={{ marginLeft: '10px' }}>
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {showModal && selectedOrder && (
        <div className="modal">
          <div className="modal-content">
            <h2>Chi tiết đơn hàng {selectedOrder.id}</h2>
            <p>Tổng tiền: {Number(selectedOrder.totalPrice).toLocaleString('vi-VN')} đ</p>
            <p>Ngày: {new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}</p>
            <p>Trạng thái: {selectedOrder.status}</p>
            <h3>Danh sách sản phẩm</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Tên sản phẩm</th>
                  <th>Số lượng</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.OrderItem.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="button secondary" onClick={handleCloseModal}>
              Đóng
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default OrdersPage;
