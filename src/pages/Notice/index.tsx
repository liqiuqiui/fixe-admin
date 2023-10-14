import { PlusOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import {
  Button,
  Form,
  FormInstance,
  Image,
  Input,
  message,
  Modal,
  Popconfirm,
  Radio,
  Space,
  Tag,
} from 'antd';
import { useRef, useState } from 'react';
import {
  createNotice,
  deleteNoticeById,
  getAllNotice,
  recoverNoticeById,
  updateNoticeById,
} from '@/services/api/notice';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import Upload from '@/components/Upload';

const modalTypeMap = {
  create: '发布新公告',
  update: '更新公告',
  view: '查看公告详情',
};
const Notice: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [notice, setNotice] = useState<API.Notice>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'update' | 'view'>('create');

  const columns: ProColumns<API.Notice>[] = [
    {
      title: '#',
      valueType: 'indexBorder',
      fixed: 'left',
      width: 48,
    },

    {
      title: '公告标题',
      search: false,
      dataIndex: 'title',
      align: 'center',
      width: 150,
      ellipsis: true,
    },
    {
      title: '公告内容',
      align: 'center',
      search: false,
      width: 200,
      dataIndex: 'content',
      ellipsis: true,
      renderText: (text) => text.replaceAll(/<\/?\w+>/gi, ''),
    },
    {
      title: '主图',
      search: false,
      align: 'center',
      width: 250,
      dataIndex: 'image',
      render(dom, entity) {
        return <Image width={200} height={100} src={entity.image} />;
      },
    },
    {
      title: '状态',
      width: 80,
      align: 'center',
      key: 'state',
      render(dom, entity) {
        const isDeleted = entity.deletedTime !== null;
        return <Tag color={isDeleted ? '#cd201f' : '#87d068'}>{isDeleted ? '已删除' : '正常'}</Tag>;
      },
    },
    {
      title: '是否焦点图',
      align: 'center',
      search: false,
      width: 100,
      dataIndex: 'focus',
      valueEnum: {
        true: {
          text: '是',
        },
        false: { text: '否' },
      },
    },
    {
      title: '发布时间',
      width: 150,
      align: 'center',
      dataIndex: 'createdTime',
      valueType: 'dateTime',
      sorter: (a, b) => +new Date(a.createdTime) - +new Date(b.createdTime),
      hideInSearch: true,
    },
    {
      title: '修改时间',
      width: 150,
      align: 'center',
      dataIndex: 'updatedTime',
      valueType: 'dateTime',
      sorter: (a, b) => +new Date(a.createdTime) - +new Date(b.createdTime),
      hideInSearch: true,
    },

    {
      title: '操作',
      // key: 'option',
      dataIndex: 'id',
      search: false,
      width: 120,
      align: 'center',
      fixed: 'right',
      render: (text, record) => {
        const isDeleted = record.deletedTime !== null;

        return (
          <Space>
            <a
              key="editNotice"
              onClick={() => {
                setNotice(record);

                setIsModalOpen(true);
                setModalType('update');
              }}
            >
              编辑
            </a>
            <a
              key="view"
              onClick={() => {
                setNotice(record);
                setIsModalOpen(true);
                setModalType('view');
              }}
            >
              查看
            </a>
            <Popconfirm
              title="提示"
              description={`确定${isDeleted ? '恢复' : '删除'}该公告吗`}
              okText="确定"
              cancelText="取消"
              onConfirm={async () => {
                try {
                  if (record.deletedTime === null) {
                    const deleteRes = await deleteNoticeById({ id: record.id });
                    if (deleteRes.code === 200) {
                      message.success('删除成功');
                    } else message.error('删除失败');
                  } else {
                    const recoverRes = await recoverNoticeById({ id: record.id });
                    if (recoverRes.code === 200) {
                      message.success('恢复成功');
                    } else message.error('恢复失败');
                  }
                  actionRef.current?.reload();
                } catch (err) {
                  console.log(err);
                  message.error('操作失败');
                }
              }}
            >
              <a
                key="delete"
                style={{
                  color: !isDeleted ? '#cd201f' : '#87d068',
                }}
              >
                {!isDeleted ? '删除' : '恢复'}
              </a>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const quillClass = useEmotionCss(() => ({
    minHeight: 200,
    '.ql-container': {
      minHeight: 200,
    },
  }));

  const formRef = useRef<FormInstance>(null);

  return (
    <PageContainer>
      <ProTable<API.Notice>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params = {}) => {
          const res = await getAllNotice({ ...params, page: params.current, withDeleted: 1 });
          const { list: data, pagination } = res.data;
          return {
            data,
            page: pagination?.currentPage,
            success: res.code === 200,
            total: pagination?.totalCount,
          };
        }}
        columnsState={{
          persistenceKey: 'notice-table',
          persistenceType: 'localStorage',
        }}
        scroll={{ x: 800 }}
        rowKey="id"
        search={false}
        options={{
          setting: {
            listsHeight: 400,
          },
        }}
        form={{
          // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
          syncToUrl: (values) => values,
        }}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: [2, 5, 10, 30, 50, 100],
          defaultPageSize: 5,
        }}
        dateFormatter="string"
        headerTitle={
          <Button
            key="button"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              setModalType('create');
              // setModalTitle('发布公告');
              setIsModalOpen(true);
              setNotice(undefined);
            }}
          >
            发布新公告
          </Button>
        }
      />

      <Modal
        title={modalTypeMap[modalType]}
        open={isModalOpen}
        width={700}
        onOk={() => {}}
        onCancel={() => {
          formRef.current?.resetFields?.(['title', 'content', 'focus', 'image']);
          setIsModalOpen(false);
        }}
        destroyOnClose
        footer={[]}
      >
        <Form
          disabled={modalType === 'view'}
          preserve={false}
          ref={formRef}
          name="form"
          initialValues={notice}
          onFinish={(value: API.CreateNoticeDto) => {
            if (modalType === 'create') {
              createNotice(value)
                .then((res) => {
                  if (res.code === 201) {
                    message.success('公告发布成功');
                    setIsModalOpen(false);
                    actionRef.current?.reload();
                    return;
                  }
                  message.error('公告发布失败');
                })
                .catch((err) => {
                  message.error('公告发布失败');
                  console.log(err);
                });
            }
            if (modalType === 'update') {
              updateNoticeById({ id: notice!.id }, value)
                .then((res) => {
                  if (res.code === 200) {
                    message.success('公告更新成功');
                    setIsModalOpen(false);
                    actionRef.current?.reload();
                    return;
                  }
                  message.error('公告更新失败');
                })
                .catch((err) => {
                  message.error('公告更新失败');
                  console.log(err);
                });
            }
          }}
          onFinishFailed={() => {}}
          autoComplete="off"
        >
          <Form.Item
            label="公告标题"
            name="title"
            rules={[{ required: true, message: '请输入公告标题' }]}
          >
            <Input placeholder="请输入公告标题" />
          </Form.Item>
          <Form.Item
            label="公告主图"
            rules={[{ required: true, message: '请选择公告主图' }]}
            name="image"
          >
            <Upload readonly={modalType === 'view'} />
          </Form.Item>
          <Form.Item
            label="是否焦点图"
            name="focus"
            rules={[{ required: true, message: '请选择是否焦点图' }]}
          >
            <Radio.Group>
              <Radio value={true}>是</Radio>
              <Radio value={false}>否</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="公告内容"
            name="content"
            rules={[{ required: true, message: '请填写公告内容' }]}
          >
            {modalType === 'view' ? (
              <div dangerouslySetInnerHTML={{ __html: notice!.content }}></div>
            ) : (
              <ReactQuill
                modules={{
                  toolbar: [
                    [{ header: [1, 2, 3, 4] }, { font: [] }],
                    [{ size: [] }],
                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                    [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
                    ['link'],
                    ['clean'],
                  ],
                  clipboard: {
                    matchVisual: false,
                  },
                }}
                formats={[
                  'header',
                  'font',
                  'size',
                  'bold',
                  'italic',
                  'underline',
                  'strike',
                  'blockquote',
                  'list',
                  'bullet',
                  'indent',
                  'link',
                ]}
                className={quillClass}
                theme="snow"
                placeholder="请填写公告内容"
              />
            )}
          </Form.Item>
          {modalType !== 'view' && (
            <Form.Item style={{ textAlign: 'center' }}>
              <Button type="primary" htmlType="submit" size="large" style={{ width: 120 }}>
                {modalTypeMap[modalType].slice(0, 2)}
              </Button>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default Notice;
