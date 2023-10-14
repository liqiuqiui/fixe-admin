import {
  createAddress,
  deleteAddressById,
  getAllAddress,
  recoverAddressById,
  updateAddressById,
} from '@/services/api/address';
import { PlusOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Input, message, Modal, Popconfirm, Space, Tag } from 'antd';
import { useState, useRef } from 'react';

const Address: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const [modalType, setModalType] = useState<'edit' | 'create'>('edit');

  const [addressInfo, setAddressInfo] = useState<{ id?: number; name: string }>();

  const actionRef = useRef<ActionType>();

  const modalTypeMap = {
    create: '新增',
    edit: '编辑',
  };

  const refresh = () => {
    setModalOpen(false);
    setAddressInfo(undefined);
    actionRef.current?.reload();
  };

  const columns: ProColumns<API.Address>[] = [
    {
      title: '#',
      valueType: 'indexBorder',
      fixed: 'left',
      disable: true,
      width: 48,
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '层级',
      dataIndex: 'level',

      valueEnum: {
        1: { text: '一、校区' },
        2: { text: '二、楼栋' },
        3: { text: '三、房间' },
      },
    },
    {
      title: '父级',
      key: 'parent',
      search: false,
      render(dom, entity) {
        return <>{entity.parent?.name ?? '-'}</>;
      },
    },
    {
      title: '状态',
      key: 'state',
      search: false,
      width: 80,
      align: 'center',
      render(dom, entity) {
        const isDeleted = entity.deletedTime !== null;
        return <Tag color={isDeleted ? '#cd201f' : '#87d068'}>{isDeleted ? '已删除' : '正常'}</Tag>;
      },
    },
    {
      title: '操作',
      search: false,
      key: 'operation',
      fixed: 'right',
      render(dom, entity) {
        const isDeleted = entity.deletedTime !== null;

        return (
          <Space>
            {entity.level < 3 ? (
              <a
                onClick={() => {
                  setModalOpen(true);
                  setModalType('create');
                  if (entity.level < 3) setAddressInfo((pre) => ({ ...pre, id: entity.id }));
                }}
              >
                添加子级{entity.level === 1 && '楼栋'}
                {entity.level === 2 && '房间'}
              </a>
            ) : (
              ''
            )}
            <a
              onClick={() => {
                setModalOpen(true);
                setModalType('edit');
                setAddressInfo({ id: entity.id, name: entity.name });
              }}
            >
              编辑
            </a>

            <Popconfirm
              placement={entity.level < 3 && !isDeleted ? 'topRight' : 'top'}
              title="提示"
              description={`确定${isDeleted ? '恢复' : '删除'}该建筑吗${
                entity.level < 3 && !isDeleted ? ', 其所有的子级将一并删除' : ''
              }`}
              okText="确定"
              cancelText="取消"
              onConfirm={async () => {
                if (entity.parent !== null && entity.parent.deletedTime !== null) {
                  message.warning('请先恢复其父级建筑');
                  return;
                }
                if (isDeleted) {
                  const res = await recoverAddressById({ addressId: entity.id });
                  if (res.code === 200) {
                    message.success('恢复成功');
                    refresh();
                    return;
                  }
                  message.error('恢复失败');
                } else {
                  const res = await deleteAddressById({ addressId: entity.id });
                  if (res.code === 200) {
                    message.success(`共删除${(res.data as any).affected}条数据`);
                    refresh();
                    return;
                  }
                  message.error('删除失败');
                }
              }}
            >
              <a
                style={{
                  color: !isDeleted ? '#cd201f' : '#87d068',
                }}
              >
                {isDeleted ? '恢复' : '删除'}
              </a>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.Address>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params = {}) => {
          const res = await getAllAddress({ ...params, page: params.current, withDeleted: 1 });
          const { list: data, pagination } = res.data;
          return {
            data,
            success: res.code === 200,
            total: pagination?.totalCount,
          };
        }}
        columnsState={{
          persistenceKey: 'address-table',
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
        pagination={{
          defaultPageSize: 5,
          pageSizeOptions: [5, 10, 30, 50, 100],
          showSizeChanger: true,
          showQuickJumper: true,
        }}
        dateFormatter="string"
        headerTitle={
          <Button
            key="button"
            onClick={() => {
              setModalOpen(true);
              setModalType('create');
              setAddressInfo((pre) => ({ ...pre, id: undefined }));
            }}
            icon={<PlusOutlined />}
            type="primary"
          >
            添加一级建筑
          </Button>
        }
      />

      <Modal
        title={`${modalTypeMap[modalType]}建筑`}
        open={modalOpen}
        onOk={async () => {
          // 创建
          if (modalType === 'create') {
            const res = await createAddress({ name: addressInfo!.name, parentId: addressInfo?.id });
            if (res.code === 201) {
              message.success('创建成功');
              refresh();
              return;
            }
            message.error('创建失败');
          }

          // 更新
          if (modalType === 'edit') {
            const updateRes = await updateAddressById(
              {
                addressId: addressInfo!.id!,
              },
              { name: addressInfo?.name },
            );
            if (updateRes.code === 200) {
              message.success('更新成功');
              refresh();
              return;
            }
            message.error('更新失败');
          }
        }}
        onCancel={() => {
          setModalOpen(false);
          setAddressInfo((pre) => ({ ...pre, name: '' }));
        }}
      >
        <Input
          value={addressInfo?.name}
          onChange={(e) => {
            setAddressInfo((pre) => ({ ...pre, name: e.target.value }));
          }}
          placeholder="请填写建筑名称"
        />
      </Modal>
    </PageContainer>
  );
};

export default Address;
