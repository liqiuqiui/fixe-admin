declare namespace API {
  type Address = {
    children?: Address[];
    name: string;
    level: number;
    parent: Address;
    order: Order[];
    id: number;
    createdTime: string;
    updatedTime: string;
    deletedTime: string;
  };

  type AdminLoginDto = {
    username: string;
    password: string;
  };

  type AssignOrderDto = {
    /** 维修工id */
    repairmanId: number;
  };

  type assignOrderParams = {
    orderId: number;
  };

  type CommentOrderDto = {
    star: number;
    comment: string;
  };

  type commentOrderParams = {
    orderId: number;
  };

  type CreateAddressDto = {
    /** 父级id */
    parentId?: number;
    name: string;
  };

  type CreateFeedbackDto = {
    /** 反馈图片 */
    images?: string[];
    name: string;
    phone: string;
    desc: string;
  };

  type CreateNoticeDto = {
    /** 公告内容 */
    content: string;
    /** 公告标题 */
    title: string;
    /** 公告图片 */
    image: string;
    /** 是否焦点公告图 */
    focus?: boolean;
  };

  type CreateOrderDto = {
    /** 故障描述 */
    desc: string;
    /** 第三级报修地址Id */
    addressId: number;
    /** 维修的紧急等级 */
    urgentLevel?: number;
    /** 期待维修时间 */
    expectTime: string;
    /** 故障图片 */
    faultImages?: string[];
    name: string;
    phone: string;
  };

  type CreatePhraseDto = {
    text: string;
  };

  type deleteAddressByIdParams = {
    addressId: number;
  };

  type deleteNoticeByIdParams = {
    id: number;
  };

  type deleteOrderParams = {
    orderId: number;
  };

  type deletePhraseByIdParams = {
    id: number;
  };

  type Feedback = {
    name: string;
    phone: string;
    desc: string;
    state: number;
    reply: string;
    images: Image[];
    user: User;
    id: number;
    createdTime: string;
    updatedTime: string;
    deletedTime: string;
  };

  type FinishOrderDto = {
    finishImages: string[][];
    fixDesc: string;
  };

  type finishOrderParams = {
    orderId: number;
  };

  type getAllAddressParams = {
    /** 用户姓名模糊查询 */
    name?: string;
    /** 是否查询已删除的数据 */
    withDeleted?: 0 | 1;
    /** 父级id */
    parentId?: number;
    /** 层级 */
    level?: 1 | 2 | 3;
    pageSize?: number;
    page?: number;
  };

  type getAllFeedbackParams = {
    /** 用户姓名模糊查询 */
    name?: string;
    /** 起始时间 */
    startTime?: string;
    /** 结束时间 */
    endTime?: string;
    /** 按反馈状态查询, 0: 待处理, 1: 已处理 */
    feedbackState?: 'pending' | 'resolve';
    /** 按描述筛选 */
    desc?: string;
    pageSize?: number;
    page?: number;
  };

  type getAllNoticeParams = {
    /** 是否查询已删除的数据 */
    withDeleted?: 0 | 1;
    pageSize?: number;
    page?: number;
  };

  type getAllOrderParams = {
    /** 用户姓名模糊查询 */
    name?: string;
    /** 按紧急状态查询, 0: 一般, 1: 严重, 2: 紧急 */
    urgentLevel?: number;
    /** 按订单状态查询, -1: 全部, 0: 未审核, 1: 审核通过, 2: 审核失败, 3: 已派单, 4: 已完成 */
    state?: -1 | 0 | 1 | 2 | 3 | 4;
    /** 订单号模糊查询 */
    orderNo?: string;
    /** 起始时间 */
    startTime?: string;
    /** 结束时间 */
    endTime?: string;
    pageSize?: number;
    page?: number;
  };

  type getAllUserParams = {
    /** 用户姓名模糊查询 */
    name?: string;
    /** 用户昵称模糊查询 */
    nickname?: string;
    /** 用户手机号模糊查询 */
    phone?: number;
    /** 按用户角色筛选 */
    role?: 2 | 1;
    /** 是否查询用户相关的订单 */
    relateOrder?: boolean;
    /** 按订单状态查询, -1: 全部, 0: 未审核, 1: 审核通过, 2: 审核失败, 3: 已派单, 4: 已完成 */
    state?: -1 | 0 | 1 | 2 | 3 | 4;
    /** 起始时间 */
    startTime?: string;
    /** 结束时间 */
    endTime?: string;
    /** 用户注册状态 */
    registerState?: number;
    /** 学/工号 */
    userNo?: string;
    /** 学院名称 */
    academyName?: string;
    /** 专业编号 */
    majorNo?: string;
    /** 专业名称 */
    majorName?: string;
    /** 班级编号 */
    classNo?: string;
    /** 班级名称 */
    className?: string;
    pageSize?: number;
    page?: number;
    ''?: any;
  };

  type getFeedbackByIdParams = {
    feedbackId: number;
  };

  type getNoticeByIdParams = {
    id: number;
  };

  type getOrderByIdParams = {
    orderId: number;
  };

  type Image = {
    url: string;
    type: number;
    id: number;
    createdTime: string;
    updatedTime: string;
    deletedTime: string;
  };

  type ImportUserDto = {
    /** 用户信息 excel表格 */
    excel: any;
  };

  type matchUserParams = {
    userNo: string;
  };

  type Notice = {
    title: string;
    content: string;
    image: string;
    focus: boolean;
    id: number;
    createdTime: string;
    updatedTime: string;
    deletedTime: string;
  };

  type Order = {
    reason: string;
    comment: string;
    star: number;
    fixDesc: string;
    faultImages?: Image[];
    finishImages?: Image[];
    repairman?: User;
    user?: User;
    orderNo: string;
    name: string;
    phone: string;
    desc: string;
    urgentLevel: number;
    state: number;
    expectTime: string;
    fixTime: string;
    address: Address[];
    id: number;
    createdTime: string;
    updatedTime: string;
    deletedTime: string;
  };

  type PaginationResDto = {
    totalCount: number;
    totalPage: number;
    currentPage: number;
    pageSize: number;
  };

  type Phrase = {
    text: string;
    refCount: number;
    id: number;
    createdTime: string;
    updatedTime: string;
    deletedTime: string;
  };

  type ProcessFeedbackDto = {
    reply?: string;
    phraseId?: number;
  };

  type processFeedbackParams = {
    feedbackId: number;
  };

  type ProcessOrderDto = {
    /** 新的订单状态, 1:通过, 2:拒绝 */
    state: 1 | 2;
    /** 审核失败原因, state为1时, reason不传 */
    reason?: string;
  };

  type processOrderParams = {
    orderId: number;
  };

  type recoverAddressByIdParams = {
    addressId: number;
  };

  type recoverNoticeByIdParams = {
    id: number;
  };

  type SwitchRoleDto = {
    /** 账户id */
    openid: string;
    /** 1: 普通用户, 2: 维修工 */
    fromRole: number;
    /** 1: 普通用户, 2: 维修工 */
    toRole: number;
  };

  type updateAddressByIdParams = {
    addressId: number;
  };

  type UpdateAddressDto = {
    /** 父级id */
    parentId?: number;
    name?: string;
  };

  type updateNoticeByIdParams = {
    id: number;
  };

  type UpdateNoticeDto = {
    /** 公告内容 */
    content?: string;
    /** 公告标题 */
    title?: string;
    /** 公告图片 */
    image?: string;
    /** 是否焦点公告图 */
    focus?: boolean;
  };

  type updatePhraseByIdParams = {
    id: number;
  };

  type UpdatePhraseDto = {
    text?: string;
  };

  type UpdateUserDto = {
    name?: string;
    phone?: string;
    password?: string;
    email?: string;
    avatarUrl?: string;
    nickname?: string;
  };

  type User = {
    phone: string;
    /** 仅管理员有效 */
    username: string;
    /** 仅管理员有效 */
    password: string;
    name: string;
    /** 0: 系统管理员, 1: 普通用户, 2: 维修工 */
    role: number;
    /** 学院名称（仅学生用户） */
    academyName: string;
    /** 专业名称（仅学生用户） */
    majorName: string;
    /** 专业编号（仅学生用户） */
    majorNo: string;
    /** 班级编号（仅学生用户） */
    classNo: string;
    /** 班级名称（仅学生用户） */
    className: string;
    /** 学/工号（非管理员） */
    userNo: string;
    /** 注册状态 */
    registerState: number;
    openid: string;
    nickname: string;
    avatarUrl: string;
    orders: Order[];
    id: number;
    createdTime: string;
    updatedTime: string;
    deletedTime: string;
  };

  type UserLoginDto = {
    code: string;
  };

  type UserRegisterDto = {
    userNo?: string;
    avatarUrl?: string;
    nickname?: string;
    code: string;
  };
}
