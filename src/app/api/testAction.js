'use server';

import { cookies } from 'next/headers';
import { setCookie, deleteCookie, hasCookie, getCookie, getCookies } from 'cookies-next';

export async function testAction() {
  setCookie('class_user_id', 10, { cookies });

}