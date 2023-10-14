import Footer from '@/components/Footer';
import { adminLogin } from '@/services/api/user';
import { getStorage, setStorage } from '@/utils/storage';
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import {
  LoginForm,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { history, useModel, Helmet, useSearchParams } from '@umijs/max';
import { Alert, message, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';

// 显示登录错误的信息
const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => {
  return (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );
};

const Login: React.FC = () => {
  const [searchParams] = useSearchParams();

  const [userLoginState, setUserLoginState] = useState<{
    loginType?: 'account' | 'mail';
    status?: 'error';
  }>({});

  const [type, setType] = useState<string>('account');

  const { refresh, initialState, setInitialState } = useModel('@@initialState');
  useEffect(() => {
    refresh();
  }, [refresh]);

  const containerClassName = useEmotionCss(() => {
    return {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    };
  });

  const handleSubmit = async (values: API.AdminLoginDto) => {
    try {
      // 发起登录请求
      const loginRes = await adminLogin(values);

      if (loginRes.code === 200) {
        message.success('登录成功！');
        flushSync(() => {
          // 设置登录信息
          setInitialState((pre) => ({
            ...pre,
            currentUser: loginRes.data,
          }));
        });
        // 缓存登录信息
        localStorage.setItem('currentUser', JSON.stringify(loginRes.data));

        // 是否需要重定向回去
        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get('redirect') || '/');
        return;
      }

      // 如果失败则设置用户错误信息
      setUserLoginState((pre) => ({ ...pre, status: 'error' }));
    } catch (error) {
      // 登录请求出现异常
      console.log(error);
      message.error('登录失败，请重试');
    }
  };

  // 进入登录页面时判断是否需要自动登录
  useEffect(() => {
    const autoLogin = getStorage<boolean>('autoLogin');
    const logout = !!searchParams.get('redirect');

    if (!logout && !initialState?.currentUser?.token && autoLogin) {
      const loginInfo = getStorage<API.AdminLoginDto>('loginInfo');
      handleSubmit(loginInfo!);
    }

    // const currentUser = getStorage('currentUser');

    // if (!logout) history.replace('/');
  }, [initialState]);
  const { loginType, status } = userLoginState;

  return (
    <div className={containerClassName}>
      <Helmet>
        <title>登录 - 报修系统后台管理</title>
      </Helmet>
      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >
        <LoginForm
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
          }}
          logo={
            <img
              alt="logo"
              src="https://img2.baidu.com/it/u=2548023624,3776834739&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500"
            />
          }
          title="报修系统后台管理"
          subTitle="助力更方便的报修管理"
          initialValues={{
            autoLogin: true,
          }}
          onFinish={async (values) => {
            const autoLogin = values.autoLogin;
            delete values.autoLogin;

            setStorage('autoLogin', autoLogin);

            if (autoLogin) {
              setStorage('loginInfo', values);
            }

            await handleSubmit(values as API.AdminLoginDto);
          }}
        >
          <Tabs
            activeKey={type}
            onChange={setType}
            centered
            items={[
              {
                key: 'account',
                label: '账户密码登录',
              },
              // {
              //   key: 'mail',
              //   label: '邮箱登录',
              // },
            ]}
          />

          {status === 'error' && loginType === 'account' && (
            <LoginMessage content="账户或密码错误" />
          )}
          {type === 'account' && (
            <>
              <ProFormText
                name="username"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined />,
                }}
                placeholder="请输入用户名"
                rules={[
                  {
                    required: true,
                    message: '请输入用户名',
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                placeholder="请输入密码"
                rules={[
                  {
                    required: true,
                    message: '请输入密码',
                  },
                ]}
              />
            </>
          )}

          {status === 'error' && loginType === 'mail' && <LoginMessage content="验证码错误" />}
          {/* {type === 'mail' && (
            <>
              <ProFormText
                fieldProps={{
                  size: 'large',
                  prefix: <MailOutlined />,
                }}
                name="mail"
                placeholder="邮箱账号"
                rules={[
                  {
                    required: true,
                    message: '请输入邮箱账号',
                  },
                  {
                    pattern: /^[\w]+?@[a-z\d]{1,10}(\.[a-z\d]{1,5}){1,2}$/,
                    message: '邮箱格式错误',
                  },
                ]}
              />
              <ProFormCaptcha
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                captchaProps={{
                  size: 'large',
                }}
                placeholder="请输入验证码"
                captchaTextRender={(timing, count) => {
                  if (timing) return count + '秒后重试';
                  return '获取验证码';
                }}
                name="captcha"
                rules={[
                  {
                    required: true,
                    message: '请输入验证码！',
                  },
                ]}
                onGetCaptcha={async (phone) => {
                  message.success(phone + '获取验证码');
                }}
              />
            </>
          )} */}
          <div
            style={{
              marginBottom: 24,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              自动登录
            </ProFormCheckbox>
            {/* <a
              style={{
                float: 'right',
              }}
            >
              忘记密码 ?
            </a> */}
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};
export default Login;
