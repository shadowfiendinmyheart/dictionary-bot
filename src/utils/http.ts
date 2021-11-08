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
    const answer = {
      status: res.status,
      ...data,
    };

    return answer;
  } catch (e) {
    console.log(e);
  }
};

export default http;
