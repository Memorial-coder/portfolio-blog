import React, { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faLock } from '@fortawesome/free-solid-svg-icons';
import SEO from './SEO';
import { DEFAULT_ADMIN, isAuthenticated, login } from '../services/auth';
import styles from '../styles/Admin.module.css';

const AdminLogin = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState({
        username: DEFAULT_ADMIN.username,
        password: ''
    });
    const [error, setError] = useState('');

    if (isAuthenticated()) {
        return <Navigate to="/admin" replace />;
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((current) => ({ ...current, [name]: value }));
        setError('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const success = await login(formData);

        if (!success) {
            setError('用户名或密码不正确。');
            return;
        }

        navigate(location.state?.from || '/admin', { replace: true });
    };

    return (
        <div className={styles.adminPage}>
            <SEO title="后台登录" description="Portfolio Owner 的私有内容管理入口。" />
            <div className={styles.shellNarrow}>
                <Link to="/" className={styles.backLink}>
                    <FontAwesomeIcon icon={faArrowLeft} /> 返回首页
                </Link>

                <section className={styles.loginPanel}>
                    <div className={styles.panelHeader}>
                        <div className={styles.kicker}>私有入口</div>
                        <h1>后台登录</h1>
                        <p>这里用于管理首页、项目、首屏滑动展示和博客内容，不开放注册。</p>
                    </div>

                    <form className={styles.loginForm} onSubmit={handleSubmit}>
                        <label>
                            用户名
                            <input name="username" value={formData.username} onChange={handleChange} autoComplete="username" />
                        </label>

                        <label>
                            密码
                            <input name="password" value={formData.password} onChange={handleChange} type="password" autoComplete="current-password" />
                        </label>

                        {error && <div className={styles.error}>{error}</div>}

                        <button type="submit" className={styles.primaryButton}>
                            <FontAwesomeIcon icon={faLock} /> 进入后台
                        </button>
                    </form>

                    <div className={styles.defaultHint}>
                        管理账号：<code>{DEFAULT_ADMIN.username}</code>。注册入口已关闭。
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AdminLogin;
