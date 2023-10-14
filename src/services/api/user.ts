// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 分页查询用户 GET /user */
export async function getAllUser(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAllUserParams,
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    message: string;
    data: { list?: API.User[]; pagination?: API.PaginationResDto };
  }>('/user', {
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

/** 更新账户信息 PUT /user */
export async function updateUserInfo(body: API.UpdateUserDto, options?: { [key: string]: any }) {
  return request<{ code: number; message: string; data: API.User }>('/user', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 导入用户 姓名	学/工号	学院名称	专业名称	专业编号	班级名称	班级编号 POST /user/import */
export async function importUser(body: API.ImportUserDto, options?: { [key: string]: any }) {
  const formData = new FormData();

  Object.keys(body).forEach((ele) => {
    const item = (body as any)[ele];

    if (item !== undefined && item !== null) {
      formData.append(
        ele,
        typeof item === 'object' && !(item instanceof File) ? JSON.stringify(item) : item,
      );
    }
  });

  return request<{ code: number; message: string; data: API.User[] }>('/user/import', {
    method: 'POST',
    data: formData,
    requestType: 'form',
    ...(options || {}),
  });
}

/** 用户登陆 POST /user/login */
export async function userLogin(body: API.UserLoginDto, options?: { [key: string]: any }) {
  return request<{ code: number; message: string; data: { token?: string; userInfo?: API.User } }>(
    '/user/login',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    },
  );
}

/** 管理员登陆 POST /user/login/admin */
export async function adminLogin(body: API.AdminLoginDto, options?: { [key: string]: any }) {
  return request<{ code: number; message: string; data: { token?: string; userInfo?: API.User } }>(
    '/user/login/admin',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    },
  );
}

/** 匹配用户 用学/工号匹配用户 GET /user/match/${param0} */
export async function matchUser(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.matchUserParams,
  options?: { [key: string]: any },
) {
  const { userNo: param0, ...queryParams } = params;
  return request<{ code: number; message: string; data: API.User }>(`/user/match/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 用户注册 POST /user/register */
export async function userRegister(body: API.UserRegisterDto, options?: { [key: string]: any }) {
  return request<{ code: number; message: string; data: { token?: string; userInfo?: API.User } }>(
    '/user/register',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    },
  );
}

/** 角色转换 PATCH /user/switchRole */
export async function switchRole(body: API.SwitchRoleDto, options?: { [key: string]: any }) {
  return request<{ code: number; message: string; data: API.User }>('/user/switchRole', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
