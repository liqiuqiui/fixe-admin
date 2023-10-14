import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import {
  Badge,
  BadgeProps,
  Modal,
  Tag,
  Image,
  Input,
  message,
  Popconfirm,
  InputRef,
  Radio,
} from 'antd';
import { useRef, useState } from 'react';
import { useModel } from '@umijs/max';
import { assignOrder, getAllOrder, getOrderById, processOrder } from '@/services/api/order';
import { OrderState } from '@/utils/constants';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { formatTime } from '@/utils/time';
import { isVideoURL } from '@/utils/type';

const orderStateMap = [
  { color: 'default', text: '待审核' },
  { color: 'warning', text: '待派单' },
  { color: 'error', text: '已驳回' },
  { color: 'processing', text: '待维修' },
  { color: 'success', text: '已完成' },
];

const urgentLevelMap: BadgeProps[] = [
  { status: 'default', text: '一般' },
  { status: 'warning', text: '严重' },
  { status: 'error', text: '紧急' },
];

const Order: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const { repairmanList } = useModel('Order.repairman');
  const [selectedRepairmanId, setSelectedRepairmanId] = useState<number>();
  console.log('repairmanList', repairmanList);

  const [processingOrder, setProcessingOrder] = useState<API.Order>();
  const [open, setOpen] = useState(false);

  const [isRejectModal, setIsRejectModal] = useState(false);

  const [rejectOrderId, setRejectOrderId] = useState<number>();

  const reasonRef = useRef<InputRef>(null);

  const [assignModalOpen, setAssignModalOpen] = useState(false);

  const columns: ProColumns<API.Order>[] = [
    {
      title: '#',
      valueType: 'indexBorder',
      fixed: 'left',
      disable: true,
      width: 48,
    },
    {
      editable: false,
      dataIndex: 'orderNo',
      fixed: 'left',
      title: '维修单号',
      width: 100,
      copyable: true,
      ellipsis: true,
      align: 'center',
    },
    {
      dataIndex: 'state',
      disable: true,
      title: '维修单状态',
      width: 110,
      align: 'center',
      filters: [
        { text: '待审核', value: 0 },
        { text: '待派单', value: 1 },
        { text: '已驳回', value: 2 },
        { text: '待维修', value: 3 },
        { text: '已完成', value: 4 },
      ],
      onFilter: true,
      valueType: 'select',
      render(_dom, entity) {
        return (
          <Tag color={orderStateMap[entity.state].color}>{orderStateMap[entity.state].text}</Tag>
        );
      },
      valueEnum: {
        0: { text: '待审核' },
        1: { text: '待派单' },
        2: { text: '已驳回' },
        3: { text: '待维修' },
        4: { text: '已完成' },
      },
    },
    {
      dataIndex: 'name',

      width: 80,
      title: '报修人',
      ellipsis: true,
      align: 'center',
    },
    {
      dataIndex: 'phone',
      width: 120,

      align: 'center',
      title: '报修人电话',
      copyable: true,
      search: false,
    },
    {
      dataIndex: 'urgentLevel',
      title: '紧急等级',
      width: 100,
      align: 'center',
      onFilter: true,
      filters: true,
      valueEnum: {
        0: {
          text: '一般',
          status: 'success',
        },
        1: {
          text: '严重',
          status: 'warning',
        },
        2: {
          text: '紧急',
          status: 'error',
        },
      },
    },

    {
      dataIndex: 'address',
      width: 250,
      ellipsis: true,
      title: '报修地址',
      search: false,
      renderText(text, record) {
        return <>{record.address.map((v) => v.name).join(' ')}</>;
      },
    },
    {
      dataIndex: 'desc',
      width: 250,
      ellipsis: true,
      title: '故障描述',
      search: false,
    },
    {
      dataIndex: 'createdTime',
      title: '报修时间',
      align: 'center',
      width: 150,
      valueType: 'dateTime',
      sorter: (a, b) => +new Date(a.createdTime) - +new Date(b.createdTime),
      hideInSearch: true,
    },
    {
      title: '报修时间',
      dataIndex: 'createdTime',
      valueType: 'dateRange',
      hideInTable: true,
      search: {
        transform: (value) => ({
          startTime: value?.[0],
          endTime: value?.[1],
        }),
      },
    },
    {
      title: '预约维修时间',
      width: 150,
      align: 'center',
      dataIndex: 'expectTime',
      valueType: 'dateTime',
      search: false,
    },
    {
      width: 120,
      title: '操作',
      valueType: 'option',
      fixed: 'right',
      dataIndex: 'id',
      render: (text, record, _, action) => {
        return [
          <a
            key="process"
            onClick={() => {
              getOrderById({ orderId: record.id }).then((res) => {
                if (res.code === 200) setProcessingOrder(res.data);
              });
              setOpen(true);
            }}
          >
            查看
          </a>,
          record.state === OrderState.init && (
            <Popconfirm
              key="pass"
              title="这将会改变维修单状态"
              description="确定审核通过该维修单吗?"
              onConfirm={() => {
                processOrder({ orderId: record.id }, { state: OrderState.pass })
                  .then((res) => {
                    if (res.code === 200) {
                      message.success('处理成功');
                      action?.reload();
                    } else message.error('处理失败');
                  })
                  .catch(() => {
                    message.error('处理失败');
                  });
              }}
              okText="确定"
              cancelText="取消"
            >
              <a key="pass">通过</a>
            </Popconfirm>
          ),
          record.state === OrderState.pass && (
            <a
              key="assign"
              onClick={() => {
                setAssignModalOpen(true);
                setProcessingOrder(record);
              }}
            >
              派单
            </a>
          ),
          record.state === OrderState.init && (
            <a
              key="reject"
              style={{ color: '#cd201f' }}
              onClick={() => {
                setIsRejectModal(true);
                setRejectOrderId(record.id);
              }}
            >
              驳回
            </a>
          ),
        ];
      },
    },
  ];
  const orderDetailWrapClass = useEmotionCss(() => ({
    maxWidth: '900px',
  }));

  const orderDetailRowClass = useEmotionCss(({ token }) => ({
    display: 'flex',
    padding: '10px',
    alignItems: 'center',
    borderRadius: `${token.borderRadius}`,
    ':hover': {
      backgroundColor: '#fafafa',
    },
    '&>div:first-child': {
      width: '100px',
    },
    '&>div:last-child': {
      flex: 1,
    },
  }));

  return (
    <PageContainer>
      {/* <ConfigProvider locale={locale}> */}
      <ProTable<API.Order>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params = {}) => {
          const res = await getAllOrder({
            ...params,
            page: params.current,
          });

          const { list: data, pagination } = res.data;
          return {
            data,
            page: pagination?.currentPage,
            success: res.code === 200,
            total: pagination?.totalCount,
          };
        }}
        editable={{
          type: 'multiple',
        }}
        columnsState={{
          persistenceKey: 'order-table',
          persistenceType: 'localStorage',
        }}
        scroll={{ x: 1000 }}
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
          syncToUrl: (values) => {
            console.log('values', values);
            return values;
          },
        }}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          defaultPageSize: 10,
          pageSizeOptions: [5, 10, 30, 50, 100],
          // onChange: (page) => console.log(page),
        }}
        dateFormatter="string"
        headerTitle=""
        // toolBarRender={() => [
        //   <Button key="button" icon={<PlusOutlined />} type="primary">
        //     新建
        //   </Button>,
        // ]}
      />
      {/* </ConfigProvider> */}
      <Modal
        width={620}
        open={open}
        title="维修单"
        footer={<></>}
        // onOk={handleOk}
        onCancel={() => setOpen(false)}
      >
        <div className={orderDetailWrapClass}>
          <div className={orderDetailRowClass}>
            <div>维修单号</div>
            <div>{processingOrder?.orderNo}</div>
          </div>
          <div className={orderDetailRowClass}>
            <div>维修单状态</div>
            <div>
              <Tag color={orderStateMap[processingOrder?.state ?? 0].color}>
                {orderStateMap[processingOrder?.state ?? 0].text}
              </Tag>
            </div>
          </div>
          {processingOrder?.state === OrderState.fail && (
            <div className={orderDetailRowClass}>
              <div style={{ alignSelf: 'flex-start' }}>驳回原因</div>
              <div>{processingOrder?.reason}</div>
            </div>
          )}
          <div className={orderDetailRowClass}>
            <div>紧急等级</div>
            <div>
              <Badge
                status={urgentLevelMap[processingOrder?.urgentLevel ?? 0].status}
                text={urgentLevelMap[processingOrder?.urgentLevel ?? 0].text}
              ></Badge>
            </div>
          </div>
          <div className={orderDetailRowClass}>
            <div>报修人</div>
            <div>{processingOrder?.name}</div>
          </div>
          <div className={orderDetailRowClass}>
            <div>报修人电话</div>
            <div>{processingOrder?.phone}</div>
          </div>
          <div className={orderDetailRowClass}>
            <div>报修时间</div>
            <div>{formatTime(processingOrder?.createdTime)}</div>
          </div>
          <div className={orderDetailRowClass}>
            <div>预约维修时间</div>
            <div>{formatTime(processingOrder?.expectTime)}</div>
          </div>
          <div className={orderDetailRowClass}>
            <div>报修地址</div>
            <div>{processingOrder?.address.map((v) => v.name).join(' ')}</div>
          </div>
          <div className={orderDetailRowClass}>
            <div style={{ alignSelf: 'flex-start' }}>故障描述</div>
            <div>{processingOrder?.desc}</div>
          </div>
          <div className={orderDetailRowClass}>
            <div style={{ alignSelf: 'flex-start' }}>故障图片</div>
            <div>
              <Image.PreviewGroup>
                {processingOrder?.faultImages?.map((img) => {
                  return isVideoURL(img.url) ? (
                    <div className="ant-image css-dev-only-do-not-override-18mf60x">
                      <video
                        style={{ width: 150, height: 150, verticalAlign: 'middle' }}
                        className="ant-image"
                        src={img.url}
                        controls
                        muted
                      />
                    </div>
                  ) : (
                    <Image key={img.id} width={150} height={150} src={img.url} />
                  );
                })}
              </Image.PreviewGroup>
            </div>
          </div>
          {(processingOrder?.state === OrderState.finish ||
            processingOrder?.state === OrderState.assigned) && (
            <>
              <div className={orderDetailRowClass}>
                <div style={{ alignSelf: 'flex-start' }}>维修工</div>
                <div>{processingOrder?.repairman?.name}</div>
              </div>
              <div className={orderDetailRowClass}>
                <div style={{ alignSelf: 'flex-start' }}>维修工电话</div>
                <div>{processingOrder?.repairman?.phone}</div>
              </div>{' '}
            </>
          )}
          {processingOrder?.state === OrderState.finish && (
            <>
              <div className={orderDetailRowClass}>
                <div style={{ alignSelf: 'flex-start' }}>维修时间</div>
                <div>{formatTime(processingOrder?.fixTime)}</div>
              </div>
              <div className={orderDetailRowClass}>
                <div style={{ alignSelf: 'flex-start' }}>维修描述</div>
                <div>{processingOrder?.fixDesc}</div>
              </div>

              <div className={orderDetailRowClass}>
                <div style={{ alignSelf: 'flex-start' }}>完工图片</div>
                <div>
                  <Image.PreviewGroup>
                    {processingOrder?.finishImages?.map((img) => {
                      return <Image key={img.id} width={150} height={150} src={img.url} />;
                    })}
                  </Image.PreviewGroup>
                </div>
              </div>
              {processingOrder.comment !== null && (
                <div className={orderDetailRowClass}>
                  <div style={{ alignSelf: 'flex-start' }}>维修评价</div>
                  <div>{processingOrder?.comment}</div>
                </div>
              )}
            </>
          )}
        </div>
      </Modal>

      <Modal
        title="驳回原因"
        open={isRejectModal}
        destroyOnClose
        onOk={() => {
          const reason = reasonRef.current?.input?.value;
          if (!reason?.trim()) {
            message.warning('请填写驳回原因');
            return;
          }

          processOrder(
            { orderId: rejectOrderId! },
            {
              state: OrderState.fail,
              reason: reasonRef.current?.input?.value,
            },
          ).then((res) => {
            if (res.code === 200) {
              actionRef.current?.reload();
              message.success('处理成功');
              setIsRejectModal(false);
              return;
            }
            message.error('处理失败');
          });
        }}
        onCancel={() => {
          setIsRejectModal(false);
        }}
      >
        <Input ref={reasonRef} placeholder="请填写驳回原因" />
      </Modal>
      <Modal
        title="请选择维修工"
        open={assignModalOpen}
        onCancel={() => {
          setAssignModalOpen(false);
          setSelectedRepairmanId(undefined);
        }}
        onOk={async () => {
          const res = await assignOrder(
            { orderId: processingOrder!.id },
            { repairmanId: selectedRepairmanId! },
          );
          if (res.code === 200) {
            message.success('派单成功');
            actionRef.current?.reload();
            setProcessingOrder(undefined);
            setAssignModalOpen(false);
            return;
          }
          message.error('派单失败');
        }}
      >
        <Radio.Group
          onChange={(e) => {
            setSelectedRepairmanId(e.target.value);
          }}
        >
          {repairmanList.map((man) => {
            return (
              <Radio value={man.id} key={man.id}>
                {man.name}
              </Radio>
            );
          })}
        </Radio.Group>
      </Modal>
    </PageContainer>
  );
};

export default Order;
