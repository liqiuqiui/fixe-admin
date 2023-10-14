// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 查询所有快捷短语 GET /phrase */
export async function getAllPhrase(options?: { [key: string]: any }) {
  return request<{ code: number; message: string; data: API.Phrase[] }>('/phrase', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 创建一条快捷短语 POST /phrase */
export async function createPhrase(body: API.CreatePhraseDto, options?: { [key: string]: any }) {
  return request<any>('/phrase', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除快捷短语 DELETE /phrase/${param0} */
export async function deletePhraseById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deletePhraseByIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{ code: number; message: string; data: API.Phrase }>(`/phrase/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 根据id更新快捷短语 PATCH /phrase/${param0} */
export async function updatePhraseById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updatePhraseByIdParams,
  body: API.UpdatePhraseDto,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{ code: number; message: string; data: API.Phrase }>(`/phrase/${param0}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}
