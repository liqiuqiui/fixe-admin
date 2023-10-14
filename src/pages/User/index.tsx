import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Image, message, Popconfirm, Tag, Tooltip, Upload } from 'antd';
import { useRef } from 'react';
import { getAllUser, switchRole } from '@/services/api/user';
import { ImportOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { BASE_URL } from '@/utils/constants';
import { getStorage } from '@/utils/storage';
const RoleMap = ['', '普通用户', '维修工'];
const registerStateMap = [
  { text: '未注册', color: '#2db7f5' },
  { text: '已注册', color: '#87d068' },
];

const User: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [messageApi, contextHolder] = message.useMessage();

  const columns: ProColumns<API.User>[] = [
    {
      valueType: 'indexBorder',
      key: 'id',
      align: 'center',
      fixed: 'left',
      width: 48,
    },
    {
      title: '用户姓名',
      dataIndex: 'name',
      width: 100,
      align: 'center',
      copyable: true,
      ellipsis: true,
    },
    {
      title: '注册状态',
      align: 'center',
      width: 100,
      dataIndex: 'registerState',
      // search: false,
      valueEnum: {
        0: { text: '未注册' },
        1: { text: '已注册' },
      },
      render(dom, entity) {
        const map = registerStateMap[entity?.registerState];
        return <Tag color={map.color}>{map.text}</Tag>;
      },
    },
    {
      title: '学 / 工号',
      width: 120,
      align: 'center',
      dataIndex: 'userNo',
    },
    {
      title: '学院名称',
      align: 'center',
      width: 150,
      dataIndex: 'academyName',
    },
    {
      title: '专业编号',
      width: 120,
      align: 'center',
      dataIndex: 'majorNo',
    },
    {
      title: '专业名称',
      width: 150,
      ellipsis: true,
      align: 'center',
      dataIndex: 'majorName',
    },
    {
      title: '班级编号',
      align: 'center',
      width: 100,
      dataIndex: 'classNo',
    },
    {
      title: '班级名称',
      width: 120,
      align: 'center',
      dataIndex: 'className',
    },
    {
      title: '用户角色',
      width: 120,
      dataIndex: 'role',
      align: 'center',
      valueEnum: {
        1: { text: '普通用户' },
        2: { text: '维修工' },
      },
      // renderText: (text, record) => (record.registerState ? RoleMap[text] : '-'),
    },
    {
      title: '用户昵称',
      width: 140,
      align: 'center',
      ellipsis: true,
      dataIndex: 'nickname',
    },
    {
      title: '用户头像',
      dataIndex: 'avatarUrl',
      align: 'center',
      width: 100,
      search: false,
      render(dom, entity) {
        return entity.registerState ? (
          <div>
            <Image
              width={60}
              height={60}
              src={entity.avatarUrl}
              fallback={'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png'}
            />
          </div>
        ) : (
          '-'
        );
      },
    },
    {
      title: '联系电话',
      align: 'center',
      width: 120,
      dataIndex: 'phone',
      copyable: true,
    },

    {
      title: 'openid',
      align: 'center',
      search: false,
      width: 230,
      dataIndex: 'openid',
    },

    {
      dataIndex: 'createdTime',
      title: '创建时间',
      width: 150,
      valueType: 'dateTime',
      align: 'center',
      sorter: (a, b) => +new Date(a.createdTime) - +new Date(b.createdTime),
      search: false,
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
      valueType: 'dateRange',
      hideInTable: true,
      search: {
        transform: (value) => {
          return {
            startTime: value?.[0],
            endTime: value?.[1],
          };
        },
      },
    },
    {
      title: '操作',
      fixed: 'right',
      align: 'center',
      width: 120,
      dataIndex: 'id',
      search: false,
      render: (text, record) => (
        // record.openid ? (
        <Popconfirm
          overlayStyle={{ justifyContent: 'center' }}
          title="提示"
          key="switchRole"
          description={`确定将${record.name}从${RoleMap[record.role]}切换到${
            record.role === 1 ? '维修工' : '用户'
          }吗?`}
          okText="确定"
          cancelText="取消"
          onConfirm={() => {
            switchRole({
              fromRole: record.role,
              openid: record.openid,
              toRole: record.role === 1 ? 2 : 1,
            })
              .then((res) => {
                if (res.code === 200) {
                  message.success('角色切换成功');
                  actionRef.current?.reload();
                  return;
                }
                message.error('角色切换失败');
              })
              .catch((err) => {
                console.log(err);
                message.error('角色切换失败');
              });
          }}
        >
          <a>切换为{record.role === 1 ? '维修工' : '用户'}</a>
        </Popconfirm>
      ),
      // ) : (
      //   '-'
      // ),
    },
  ];

  return (
    <>
      {contextHolder}
      <PageContainer>
        <ProTable<API.User>
          columns={columns}
          actionRef={actionRef}
          cardBordered
          request={async (params = {}) => {
            const res = await getAllUser({ ...params, page: params.current });
            const { list: data, pagination } = res.data;
            return {
              data,
              page: pagination?.currentPage,
              success: res.code === 200,
              total: pagination?.totalCount,
            };
          }}
          scroll={{ x: 1000 }}
          editable={{
            type: 'multiple',
          }}
          columnsState={{
            persistenceKey: 'user-table',
            persistenceType: 'localStorage',
          }}
          rowKey="id"
          search={{
            labelWidth: 'auto',
          }}
          options={{
            setting: {
              listsHeight: 400,
            },
          }}
          form={{
            // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
            syncToUrl: (values, type) => {
              if (type === 'get') {
                return {
                  ...values,
                  created_at: [values.startTime, values.endTime],
                };
              }
              return values;
            },
          }}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            defaultPageSize: 5,
            pageSizeOptions: [2, 5, 10, 30, 50, 100],
            // onChange: (page) => console.log(page),
          }}
          dateFormatter="string"
          headerTitle={
            <div style={{ display: 'flex', columnGap: 5 }}>
              <Upload
                showUploadList={false}
                beforeUpload={async (file) => {
                  messageApi.loading({ key: 'upload', content: '文件上传中', duration: 999 });
                  const formData = new FormData();
                  formData.append('excel', file);
                  fetch(BASE_URL + '/user/import', {
                    method: 'post',
                    body: formData,
                    headers: {
                      authorization:
                        'Bearer ' + getStorage<CurrentUser>('currentUser')?.token ?? '',
                    },
                  })
                    .then((r) => r.json())
                    .then((res) => {
                      if (res.code === 201) {
                        messageApi.success({
                          key: 'upload',
                          content: '用户数据导入成功',
                          duration: 2,
                        });
                        actionRef.current?.reload();
                        return;
                      }
                      console.log(res);
                      if (res.code === 400)
                        return messageApi.error({
                          key: 'upload',
                          content: res.data,
                          duration: 4,
                        });

                      messageApi.error({ key: 'upload', content: '文件上传失败', duration: 2 });
                    })
                    .catch((err) => {
                      messageApi.error({ key: 'upload', content: '文件上传失败', duration: 2 });
                      console.error(err);
                    });
                  return false;
                }}
                accept=".xlsx"
              >
                <Button key="button" icon={<ImportOutlined />} type="primary">
                  导入用户数据
                </Button>
              </Upload>
              <Tooltip
                title={`请确保表格数据的顺序为: 姓名	学/工号	学院名称	专业名称	专业编号	班级名称	班级编号 联系电话, 否则会导致数据不正确`}
              >
                <QuestionCircleOutlined />
              </Tooltip>
            </div>
          }
          toolBarRender={() => [
            // <Button key="button" icon={<PlusOutlined />} type="primary">
            //   新建
            // </Button>,
          ]}
        />
        {/* <Modal ></Modal> */}
      </PageContainer>
    </>
  );
};

export default User;
