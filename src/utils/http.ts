import fetch from 'cross-fetch';

const http = async (
  url: string,
  method = 'GET',
  body?: object | string,
  headers?: object
) => {
  try {
    const res: Response = await fetch(url, {
      method: method,
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      credentials: 'same-origin',
    });

    const data = await res.json();

    const rawCookies = res.headers.get('set-cookie')?.split(';');
    const cookies: { [key: string]: any } = {};
    rawCookies?.forEach((rawCookie) => {
      const [name, value] = rawCookie.split('=');
      cookies[name.trim()] = value ? value.trim() : null;
    });

    const answer = {
      status: res.status,
      cookies,
      ...data,
    };
    return answer;
  } catch (e) {
    console.log(e);
  }
};

export default http;
