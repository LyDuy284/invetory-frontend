import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import api from '../../api/client';


const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Mật khẩu và xác nhận mật khẩu không khớp');
      setLoading(false);
      return;
    }

    try {
      const res = await api.post('/api/auth/register', { username, email, password });
      setSuccess('Đăng ký thành công!');
      setTimeout(() => {
        navigate('/login');
      }, 2000); 
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

   const handleNavigateToLogin = () => {
    navigate('/login');  
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <div className="card" style={{ maxWidth: 400, width: '100%' }}>
        <div className="card-header">Đăng ký tài khoản</div>
        <form onSubmit={handleSubmit}>
          {/* Input cho tên người dùng */}
          <div className="input-group">
            <label>Tên người dùng</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Tên người dùng"
              required
            />
          </div>
          
          {/* Input cho email */}
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          {/* Input cho mật khẩu */}
          <div className="input-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {/* Input cho xác nhận mật khẩu */}
          <div className="input-group">
            <label>Xác nhận mật khẩu</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {/* Hiển thị lỗi nếu có */}
          {error && <div className="error-text">{error}</div>}

          {/* Nút đăng ký */}
          <button className="button mt-2" type="submit" disabled={loading}>
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>
        </form>

        {/* Nút chuyển đến trang đăng nhập nếu người dùng đã có tài khoản */}
        <button
          className="button secondary"
          onClick={handleNavigateToLogin}
          style={{ marginTop: 16, textAlign: 'center' }}
        >
          Đã có tài khoản? Đăng nhập
        </button>
      </div>
    </div>
  );
};

export default RegisterPage;
