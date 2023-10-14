// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 上传图片，可多文件上传 POST /upload */
export async function uploadMedia(options?: { [key: string]: any }) {
  return request<any>('/upload', {
    method: 'POST',
    ...(options || {}),
  });
}
