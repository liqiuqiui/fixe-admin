import { getAllFeedback, processFeedback } from '@/services/api/feedback';
import { ActionType, ProColumns, PageContainer, ProTable } from '@ant-design/pro-components';
import { useEffect, useRef, useState } from 'react';
import { Image, Input, InputRef, message, Modal, Popconfirm, Tag, theme, Tooltip } from 'antd';
import { FeedbackState } from '@/utils/constants';
import {
  createPhrase,
  deletePhraseById,
  getAllPhrase,
  updatePhraseById,
} from '@/services/api/phrase';
import { CloseOutlined, PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useEmotionCss } from '@ant-design/use-emotion-css';

const stateMap = [
  {
    text: '待处理',
    color: '#2db7f5',
  },
  {
    text: '已处理',
    color: '#87d068',
  },
];

const Feedback: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [visible, setVisible] = useState(false);

  const [imageGroup, setImageGroup] = useState<API.Image[]>([]);

  const [reply, setReply] = useState<string>('');
  const [modalOpen, setModalOpen] = useState(false);
  const [activeFeedbackId, setActiveFeedbackId] = useState<number>();

  const columns: ProColumns<API.Feedback>[] = [
    {
      title: '#',
      dataIndex: 'index',
      valueType: 'indexBorder',
      align: 'center',
      width: 48,
    },
    {
      title: '反馈人',
      dataIndex: 'name',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '手机号',
      align: 'center',
      search: false,
      dataIndex: 'phone',
      copyable: true,
    },
    {
      title: '反馈内容',
      ellipsis: true,
      dataIndex: 'desc',
    },
    {
      title: '反馈图片',
      dataIndex: 'images',
      align: 'center',
      search: false,
      render(dom, entity) {
        return entity.images.length ? (
          <Image
            preview={{ visible: false }}
            onClick={() => {
              setVisible(true);
              setImageGroup(entity.images);
            }}
            width={60}
            height={60}
            src={entity.images[0]?.url}
            fallback={'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png'}
          />
        ) : (
          '-'
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'state',
      onFilter: true,
      align: 'center',
      filters: true,
      render(dom, entity) {
        return <Tag color={stateMap[entity.state].color}>{stateMap[entity.state].text}</Tag>;
      },
      valueEnum: {
        0: {
          text: '待处理',
        },
        1: {
          text: '已处理',
        },
      },
    },
    {
      title: '回复',
      search: false,
      dataIndex: 'reply',
      ellipsis: true,
    },
    {
      dataIndex: 'createdTime',
      title: '反馈时间',
      width: 150,
      valueType: 'dateTime',
      align: 'center',
      sorter: (a, b) => +new Date(a.createdTime) - +new Date(b.createdTime),
      search: false,
    },
    {
      title: '反馈时间',
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
      align: 'center',
      search: false,
      key: 'option',
      render: (text, record) => [
        record.state === FeedbackState.pending && (
          <a
            key="view"
            onClick={() => {
              setActiveFeedbackId(record.id);
              setModalOpen(true);
            }}
          >
            处理
          </a>
        ),
      ],
    },
  ];

  const [phraseList, setPhraseList] = useState<API.Phrase[]>([]);
  const [checkedPhraseId, setCheckedPhraseId] = useState<number>();

  const getPhraseList = () => {
    getAllPhrase().then((res) => {
      if (res.code !== 200) return message.error('快捷短语获取失败');
      setPhraseList(res.data);
    });
  };

  useEffect(() => {
    getPhraseList();
  }, []);

  const { token } = theme.useToken();
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [editInputIndex, setEditInputIndex] = useState(-1);
  const [editInputValue, setEditInputValue] = useState('');
  const inputRef = useRef<InputRef>(null);
  const editInputRef = useRef<InputRef>(null);

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  useEffect(() => {
    editInputRef.current?.focus();
  }, [inputValue]);

  const handleInputConfirm = () => {
    if (inputValue.trim().length > 0)
      createPhrase({ text: inputValue })
        .then((res) => {
          if (res.code === 201) {
            message.success('快捷短语添加成功');
            getPhraseList();
            return;
          }
          message.error('快捷短语添加失败');
        })
        .catch((err) => {
          message.error('短语添加失败');

          console.log(err);
        });
    setInputVisible(false);
    setInputValue('');
  };

  const handleEditInputConfirm = (id: number) => {
    if (phraseList[editInputIndex].text !== editInputValue.trim())
      updatePhraseById({ id }, { text: editInputValue })
        .then((res) => {
          if (res.code === 200) {
            setEditInputIndex(-1);
            message.success('快捷短语修改成功');
            getPhraseList();
            return;
          }
          message.error('快捷短语修改失败');
        })
        .catch((err) => {
          message.error('快捷短语修改失败');
          console.log(err);
        });
  };

  const phraseWrapClass = useEmotionCss(() => ({
    display: 'flex',
    flexWrap: 'wrap',
    rowGap: 5,
    marginTop: 10,
  }));

  let timer: NodeJS.Timeout;

  const resetModal = () => {
    setCheckedPhraseId(undefined);
    setReply('');
    setModalOpen(false);
  };
  return (
    <PageContainer>
      <ProTable<API.Feedback>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params = {}) => {
          const res = await getAllFeedback({
            ...params,
            page: params.current,
            feedbackState: params.state,
          });
          const { list: data, pagination } = res.data;
          return {
            data,
            page: pagination?.currentPage,
            success: res.code === 200,
            total: pagination?.totalCount,
          };
        }}
        // editable={{
        //   type: 'multiple',
        // }}
        columnsState={{
          persistenceKey: 'feedback-table',
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
          syncToUrl: (values: any) => {
            console.log('values', values);
            const feedbackState = values.state;
            const page = values.current;
            delete values.state;
            delete values.current;
            return { ...values, feedbackState, page };
          },
        }}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          defaultPageSize: 5,
          pageSizeOptions: [5, 10, 30, 50, 100],
        }}
        dateFormatter="string"
      />
      <div style={{ display: 'none' }}>
        <Image.PreviewGroup
          preview={{
            visible,
            onVisibleChange: (vis) => {
              setVisible(vis);
              if (!vis) setImageGroup([]);
            },
          }}
        >
          {imageGroup.map((img) => {
            return (
              <Image
                key={img.id}
                src={img.url}
                fallback={'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png'}
              />
            );
          })}
        </Image.PreviewGroup>
      </div>
      <Modal
        title="处理反馈"
        open={modalOpen}
        destroyOnClose
        onOk={() => {
          processFeedback(
            { feedbackId: activeFeedbackId! },
            checkedPhraseId
              ? {
                  phraseId: checkedPhraseId,
                }
              : { reply },
          )
            .then((res) => {
              if (res.code === 200) {
                message.success('处理成功');
                resetModal();
                actionRef.current?.reload();
                return;
              }
              message.error('处理失败');
            })
            .catch((err) => {
              message.error('处理失败');
              console.log(err);
            });
        }}
        onCancel={resetModal}
      >
        <Input
          allowClear
          value={reply}
          onFocus={() => setCheckedPhraseId(undefined)}
          onChange={(e) => setReply(e.target.value)}
          placeholder="请填写回复"
        />

        <h4 style={{ margin: '10px 0' }}>
          <span style={{ marginRight: 4 }}>快捷短语</span>
          <Tooltip title="点击下面的快捷短语可快速填写回复">
            <QuestionCircleOutlined />
          </Tooltip>
        </h4>

        <div className={phraseWrapClass}>
          {phraseList.map((phrase, index) => {
            if (editInputIndex === index) {
              return (
                <Input
                  ref={editInputRef}
                  key={phrase.id}
                  size="small"
                  style={{
                    width: 80,
                    fontSize: 13,
                    verticalAlign: 'top',
                    marginRight: 8,
                  }}
                  value={editInputValue}
                  onChange={(e) => setEditInputValue(e.target.value)}
                  onBlur={() => handleEditInputConfirm(phrase.id)}
                  onPressEnter={() => handleEditInputConfirm(phrase.id)}
                />
              );
            }
            const isTooLong = phrase.text.length > 20;
            return (
              <Tag
                key={phrase.id}
                closable
                closeIcon={
                  <Popconfirm
                    title="提示"
                    description="确定删除这条快捷短语吗?"
                    onConfirm={() => {
                      deletePhraseById({ id: phrase.id })
                        .then((res) => {
                          if (res.code === 200) {
                            message.success('快捷短语删除成功');
                            getPhraseList();
                          } else message.error('快捷短语删除失败');
                        })
                        .catch((err) => {
                          message.error('快捷短语删除失败');
                          console.log(err);
                        });
                    }}
                    okText="确定"
                    cancelText="取消"
                  >
                    <CloseOutlined />
                  </Popconfirm>
                }
                style={{ userSelect: 'none' }}
                onClick={() => {
                  if (timer) clearTimeout(timer);
                  timer = setTimeout(() => {
                    setReply(phrase.text);
                    setCheckedPhraseId(phrase.id);
                  }, 300);
                }}
                onClose={(e) => e.preventDefault()}
              >
                {isTooLong ? (
                  <Tooltip title={phrase.text}>
                    <span
                      onDoubleClick={(e) => {
                        clearTimeout(timer);
                        setEditInputIndex(index);
                        setEditInputValue(phrase.text);
                        e.preventDefault();
                      }}
                    >
                      {isTooLong ? `${phrase.text.slice(0, 20)}...` : phrase.text}
                    </span>
                  </Tooltip>
                ) : (
                  <span
                    onDoubleClick={(e) => {
                      clearTimeout(timer);
                      setEditInputIndex(index);
                      setEditInputValue(phrase.text);
                      e.preventDefault();
                    }}
                  >
                    {isTooLong ? `${phrase.text.slice(0, 20)}...` : phrase.text}
                  </span>
                )}
              </Tag>
            );
            // return isTooLong ? (
            //   <Tooltip title={phrase.text} key={phrase.id}>
            //     {tagElem}
            //   </Tooltip>
            // ) : (
            //   tagElem
            // );
          })}
          {inputVisible ? (
            <Input
              ref={inputRef}
              type="text"
              size="small"
              style={{
                width: 80,
                verticalAlign: 'top',
                fontSize: 13,
              }}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onBlur={() => {
                handleInputConfirm();
              }}
              onPressEnter={handleInputConfirm}
            />
          ) : (
            <Tag
              style={{
                background: token.colorBgContainer,
                borderStyle: 'dashed',
              }}
              onClick={() => setInputVisible(true)}
            >
              <PlusOutlined /> 新建快捷短语
            </Tag>
          )}
        </div>
      </Modal>
    </PageContainer>
  );
};

export default Feedback;
