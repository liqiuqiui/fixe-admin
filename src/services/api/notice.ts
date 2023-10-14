// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 查询所有公告 GET /notice */
export async function getAllNotice(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAllNoticeParams,
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    message: string;
    data: { list?: API.Notice[]; pagination?: API.PaginationResDto };
  }>('/notice', {
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

/** 发布公告 POST /notice */
export async function createNotice(body: API.CreateNoticeDto, options?: { [key: string]: any }) {
  return request<any>('/notice', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 根据id查询公告 GET /notice/${param0} */
export async function getNoticeById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getNoticeByIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{ code: number; message: string; data: API.Notice }>(`/notice/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 根据id删除公告 DELETE /notice/${param0} */
export async function deleteNoticeById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteNoticeByIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{ code: number; message: string; data: API.Notice }>(`/notice/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 根据id更新公告 PATCH /notice/${param0} */
export async function updateNoticeById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateNoticeByIdParams,
  body: API.UpdateNoticeDto,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{ code: number; message: string; data: API.Notice }>(`/notice/${param0}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 根据id恢复被删除的删除公告 PATCH /notice/recover/${param0} */
export async function recoverNoticeById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.recoverNoticeByIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{ code: number; message: string; data: API.Notice }>(`/notice/recover/${param0}`, {
    method: 'PATCH',
    params: { ...queryParams },
    ...(options || {}),
  });
}
