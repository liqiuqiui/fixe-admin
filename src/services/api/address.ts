// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 根据父级id查询所有节点 GET /address */
export async function getAllAddress(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAllAddressParams,
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    message: string;
    data: { list?: API.Address[]; pagination?: API.PaginationResDto };
  }>('/address', {
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

/** 创建地址 POST /address */
export async function createAddress(body: API.CreateAddressDto, options?: { [key: string]: any }) {
  return request<any>('/address', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 根据id删除地址 DELETE /address/${param0} */
export async function deleteAddressById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteAddressByIdParams,
  options?: { [key: string]: any },
) {
  const { addressId: param0, ...queryParams } = params;
  return request<{ code: number; message: string; data: API.Address }>(`/address/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 根据id更新地址 PATCH /address/${param0} */
export async function updateAddressById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateAddressByIdParams,
  body: API.UpdateAddressDto,
  options?: { [key: string]: any },
) {
  const { addressId: param0, ...queryParams } = params;
  return request<{ code: number; message: string; data: API.Address }>(`/address/${param0}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 根据id恢复地址 PATCH /address/recover/${param0} */
export async function recoverAddressById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.recoverAddressByIdParams,
  options?: { [key: string]: any },
) {
  const { addressId: param0, ...queryParams } = params;
  return request<{ code: number; message: string; data: API.Address }>(
    `/address/recover/${param0}`,
    {
      method: 'PATCH',
      params: { ...queryParams },
      ...(options || {}),
    },
  );
}
