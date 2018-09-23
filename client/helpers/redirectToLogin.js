import Router from 'next/router';

export default function redirectToLogin(isServer: boolean, res: Response) {
  if (!isServer) {
    Router.replace('/login');
    return;
  }
  if (res) {
    res.writeHead(302, {
      Location: '/login',
    });
    res.end();
  }
}
