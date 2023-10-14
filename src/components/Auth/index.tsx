import { getStorage } from '@/utils/storage';
import { Navigate, Outlet } from '@umijs/max';
import { ConfigProvider } from 'antd';

import locale from 'antd/locale/zh_CN';

const Auth: React.FC = () => {
  const currentUser = getStorage('currentUser');
  return currentUser ? (
    <ConfigProvider locale={locale}>
      <Outlet />
    </ConfigProvider>
  ) : (
    <Navigate to="/login" />
  );
};

export default Auth;
