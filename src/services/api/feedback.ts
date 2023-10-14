// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 分页查询建议反馈 GET /feedback */
export async function getAllFeedback(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAllFeedbackParams,
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    message: string;
    data: { list?: API.Feedback[]; pagination?: API.PaginationResDto };
  }>('/feedback', {
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

/** 提交一个建议反馈 POST /feedback */
export async function createFeeback(body: API.CreateFeedbackDto, options?: { [key: string]: any }) {
  return request<any>('/feedback', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 根据id查询建议反馈 GET /feedback/${param0} */
export async function getFeedbackById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getFeedbackByIdParams,
  options?: { [key: string]: any },
) {
  const { feedbackId: param0, ...queryParams } = params;
  return request<API.Feedback>(`/feedback/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 处理建议反馈（管理员） PUT /feedback/${param0} */
export async function processFeedback(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.processFeedbackParams,
  body: API.ProcessFeedbackDto,
  options?: { [key: string]: any },
) {
  const { feedbackId: param0, ...queryParams } = params;
  return request<{ code: number; message: string; data: API.Feedback }>(`/feedback/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}
