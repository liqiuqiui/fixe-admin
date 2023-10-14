import { updateUserInfo } from '@/services/api/user';
import { BASE_URL } from '@/utils/constants';
import { UploadOutlined } from '@ant-design/icons';
import { ProForm, ProFormText } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Button, message, Upload } from 'antd';
import { useCallback, useState } from 'react';
import styles from './BaseView.less';

const Profile: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');

  const userInfo = { ...initialState?.currentUser?.userInfo };
  delete userInfo.password;
  const [avatarUrl, setAvatarUrl] = useState(userInfo.avatarUrl);

  const handleFinish = async (formData: any) => {
    // eslint-disable-next-line no-param-reassign
    formData = { ...formData, avatarUrl };
    console.log('formData', formData);
    const res = await updateUserInfo(formData);
    if (res.code === 200) {
      message.success('更新基本信息成功');
      setInitialState((pre) => ({
        ...pre,
        currentUser: { ...pre?.currentUser, userInfo: res.data },
      }));
      localStorage.setItem(
        'currentUser',
        JSON.stringify({ ...initialState?.currentUser, userInfo: res.data }),
      );
    } else {
      console.log(res.data);

      message.error((res.data as unknown as string[])[0]);
    }
  };

  const AvatarView = useCallback(
    ({ avatar }: { avatar: string }) => (
      <>
        <div className={styles.avatar_title}>头像</div>
        <div className={styles.avatar}>
          <img src={avatar} alt="avatar" />
        </div>
        <Upload
          action={BASE_URL + '/upload'}
          showUploadList={false}
          name="images"
          onChange={(e) => {
            if (e.file.status === 'done') {
              setAvatarUrl('http://127.0.0.1:3000' + e.file.response.data[0].url);
            }
          }}
        >
          <div className={styles.button_view}>
            <Button>
              <UploadOutlined />
              更换头像
            </Button>
          </div>
        </Upload>
      </>
    ),
    [],
  );

  return (
    <div className={styles.baseView}>
      {
        <>
          <div className={styles.left}>
            <ProForm
              layout="vertical"
              onFinish={handleFinish}
              submitter={{
                searchConfig: {
                  submitText: '更新基本信息',
                },
                render: (_, dom) => dom[1],
              }}
              initialValues={userInfo}
              hideRequiredMark
            >
              <ProFormText width="md" name="nickname" label="昵称" />
              <ProFormText width="md" name="name" label="姓名" />
              <ProFormText.Password width="md" name="password" label="旧密码" />
              <ProFormText.Password width="md" name="newPassword" label="新密码" />
              <ProFormText.Password width="md" name="reNewPassword" label="确认新密码" />
              <ProFormText
                width="md"
                name="email"
                label="邮箱"
                // rules={[{ message: '请输入合法邮箱', pattern: /^1[\d]{10}$/ }]}
              />
              <ProFormText
                width="md"
                name="phone"
                label="联系电话"
                rules={[{ message: '请输入合法手机号', pattern: /^1[\d]{10}$/ }]}
              />
            </ProForm>
          </div>
          <div className={styles.right}>
            <AvatarView avatar={avatarUrl!} />
          </div>
        </>
      }
    </div>
  );
};

export default Profile;
