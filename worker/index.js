/**
 * Cloudflare Worker: static Astro site + Decap GitHub OAuth at /api/auth
 * Secrets: GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET
 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/auth') {
      return handleGitHubAuth(request, env);
    }

    // Static assets are usually served without invoking this Worker.
    // Fallback if a request still reaches us.
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('Not found', { status: 404 });
  },
};

async function handleGitHubAuth(request, env) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
    return htmlPage(
      `document.body.textContent = 'Missing GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET on Cloudflare.';`,
    );
  }

  if (code) {
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'User-Agent': 'EggBrainRadio-CMS-Auth',
      },
      body: JSON.stringify({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });
    const data = await tokenResponse.json();

    if (data.error || !data.access_token) {
      const errorMessage =
        data.error_description || data.error || 'Unable to exchange OAuth code';
      const msg = JSON.stringify(`authorization:github:error:${errorMessage}`);
      return htmlPage(`sendMsg(${msg});`);
    }

    const payload = JSON.stringify({ token: data.access_token, provider: 'github' });
    const msg = JSON.stringify(`authorization:github:success:${payload}`);
    return htmlPage(`sendMsg(${msg});`);
  }

  const redirectUri = `${url.origin}/api/auth`;
  const scope = url.searchParams.get('scope') || 'repo,user';
  const authUrl =
    `https://github.com/login/oauth/authorize` +
    `?client_id=${encodeURIComponent(env.GITHUB_CLIENT_ID)}` +
    `&scope=${encodeURIComponent(scope)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}`;

  return htmlPage(`window.location.href = ${JSON.stringify(authUrl)};`);
}

function htmlPage(script) {
  const body = `<!DOCTYPE html>
<html lang="en">
  <head><meta charset="utf-8" /><title>Signing in…</title></head>
  <body>
    <p>Completing GitHub sign-in…</p>
    <script>
      function sendMsg(msg) {
        var done = false;
        function post(targetOrigin) {
          if (!window.opener) return;
          window.opener.postMessage(msg, targetOrigin);
        }
        window.addEventListener('message', function (event) {
          if (
            done ||
            typeof event.data !== 'string' ||
            event.data.indexOf('authorizing:github') !== 0
          ) {
            return;
          }
          done = true;
          post(event.origin || '*');
          setTimeout(function () { window.close(); }, 300);
        });
        if (window.opener) {
          window.opener.postMessage('authorizing:github', '*');
        }
        setTimeout(function () {
          if (done || !window.opener) return;
          done = true;
          post('*');
          setTimeout(function () { window.close(); }, 300);
        }, 1000);
      }
      ${script}
    </script>
  </body>
</html>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
