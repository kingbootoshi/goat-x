import { TwitterAuth } from './auth';
import { updateCookieJar } from './requests';

interface CreateSpacePayload {
  app_component: string;
  content_type: string;
  conversation_controls: number;
  description: string;
  height: number;
  is_360: boolean;
  is_space_available_for_clipping: boolean;
  is_space_available_for_replay: boolean;
  is_webrtc: boolean;
  languages: string[];
  narrow_cast_space_type: number;
  region: string;
  replaykit_app_bundle: string;
  replaykit_app_name: string;
  requires_psp_version: any[];
  scheduled_start_time: number;
  source: string;
  ticket_group_id: string;
  tickets_total: number;
  topics: any[];
  width: number;
  cookie?: string;
}

// Helper function to get Periscope JWT token
async function getPeriscopeJWT(auth: TwitterAuth): Promise<string> {
  // GraphQL endpoint for Periscope authentication
  const url = 'https://x.com/i/api/graphql/r7VUmxbfqNkx7uwjgONSNw/AuthenticatePeriscope';
  const onboardingTaskUrl = 'https://api.twitter.com/1.1/onboarding/task.json';

  const cookies = await auth.cookieJar().getCookies(onboardingTaskUrl);
  const xCsrfToken = cookies.find((cookie) => cookie.key === 'ct0');

  const headers = new Headers({
    authorization: `Bearer ${(auth as any).bearerToken}`,
    cookie: await auth.cookieJar().getCookieString(onboardingTaskUrl),
    'content-type': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Linux; Android 11; Nokia G20) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.88 Mobile Safari/537.36',
    'x-guest-token': (auth as any).guestToken,
    'x-twitter-auth-type': 'OAuth2Client',
    'x-twitter-active-user': 'yes',
    'x-twitter-client-language': 'en',
    'x-csrf-token': xCsrfToken?.value as string,
  });

  const response = await fetch(`${url}?variables=%7B%7D`, {
    headers,
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`Failed to get Periscope JWT: ${await response.text()}`);
  }

  const data = await response.json();
  return data.data.authenticate_periscope;
}

// Helper function to get Periscope cookie using JWT
async function getPeriscopeCookie(jwt: string): Promise<string> {
  const url = 'https://proxsee.pscp.tv/api/v2/loginTwitterToken';
  
  const headers = new Headers({
    'content-type': 'application/json',
    'sec-ch-ua': '"Chromium";v="130", "Google Chrome";v="130", "Not?ABrand";v="99"',
    'sec-ch-ua-mobile': '?1',
    'sec-ch-ua-platform': '"Android"',
    'x-attempt': '1',
    'x-idempotence': Date.now().toString(),
    'x-periscope-user-agent': 'Twitter/m5'
  });

  const body = {
    jwt,
    vendor_id: 'm5-proxsee-login-a2011357b73e',
    create_user: true
  };

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Failed to get Periscope cookie: ${await response.text()}`);
  }

  const data = await response.json();
  return data.cookie;
}

export async function createSpace(auth: TwitterAuth, payload: Partial<CreateSpacePayload>): Promise<any> {
  // Get Periscope JWT and cookie
  const jwt = await getPeriscopeJWT(auth);
  const periscopeCookie = await getPeriscopeCookie(jwt);

  const url = 'https://proxsee.pscp.tv/api/v2/createBroadcast';
  
  const headers = new Headers({
    'content-type': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Linux; Android 11; Nokia G20) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.88 Mobile Safari/537.36',
  });

  const defaultPayload: CreateSpacePayload = {
    app_component: 'audio-room',
    content_type: 'visual_audio',
    conversation_controls: 0,
    description: '',
    height: 1080,
    is_360: false,
    is_space_available_for_clipping: false,
    is_space_available_for_replay: false,
    is_webrtc: true,
    languages: [],
    narrow_cast_space_type: 0,
    region: 'us-east-1',
    replaykit_app_bundle: '',
    replaykit_app_name: '',
    requires_psp_version: [],
    scheduled_start_time: 0,
    source: 'web',
    ticket_group_id: '',
    tickets_total: 0,
    topics: [],
    width: 1920
  };

  const body = {
    ...defaultPayload,
    ...payload,
    cookie: periscopeCookie
  };

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  });

  const responseText = await response.text();
  
  if (!response.ok) {
    throw new Error(`Error creating space: ${responseText}`);
  }

  const parsedResponse = JSON.parse(responseText);
  
  // Return only the essential information
  return {
    id: parsedResponse.broadcast.id,
    shareUrl: parsedResponse.share_url,
    description: parsedResponse.broadcast.status,
  };
}