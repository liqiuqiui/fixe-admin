// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 分页查询报修订单 GET /order */
export async function getAllOrder(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAllOrderParams,
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    message: string;
    data: { list?: API.Order[]; pagination?: API.PaginationResDto };
  }>('/order', {
    method: 'GET',
    params: {
      // pageSize has a default value: 5
      pageSize: '5',
      // page has a default value: 1
      page: '1',
      ...params,
    },
    ...(options || {}),
  });
}

/** 创建一个报修订单(仅用户) POST /order */
export async function createOrder(body: API.CreateOrderDto, options?: { [key: string]: any }) {
  return request<any>('/order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 根据id查询订单 GET /order/${param0} */
export async function getOrderById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getOrderByIdParams,
  options?: { [key: string]: any },
) {
  const { orderId: param0, ...queryParams } = params;
  return request<{ code: number; message: string; data: API.Order }>(`/order/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 删除订单(用户) DELETE /order/${param0} */
export async function deleteOrder(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteOrderParams,
  options?: { [key: string]: any },
) {
  const { orderId: param0, ...queryParams } = params;
  return request<{ code: number; message: string; data: API.Order }>(`/order/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 分配订单(管理员) PATCH /order/assign/${param0} */
export async function assignOrder(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.assignOrderParams,
  body: API.AssignOrderDto,
  options?: { [key: string]: any },
) {
  const { orderId: param0, ...queryParams } = params;
  return request<{ code: number; message: string; data: API.Order }>(`/order/assign/${param0}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 评论订单(用户) POST /order/comment/${param0} */
export async function commentOrder(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.commentOrderParams,
  body: API.CommentOrderDto,
  options?: { [key: string]: any },
) {
  const { orderId: param0, ...queryParams } = params;
  return request<{ code: number; message: string; data: API.Order }>(`/order/comment/${param0}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 完成订单(维修工) PUT /order/finish/${param0} */
export async function finishOrder(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.finishOrderParams,
  body: API.FinishOrderDto,
  options?: { [key: string]: any },
) {
  const { orderId: param0, ...queryParams } = params;
  return request<{ code: number; message: string; data: API.Order }>(`/order/finish/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 审核订单(管理员) PATCH /order/process/${param0} */
export async function processOrder(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.processOrderParams,
  body: API.ProcessOrderDto,
  options?: { [key: string]: any },
) {
  const { orderId: param0, ...queryParams } = params;
  return request<{ code: number; message: string; data: API.Order }>(`/order/process/${param0}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}
