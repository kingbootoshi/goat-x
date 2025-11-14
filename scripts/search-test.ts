declare global {
  // These globals mirror the values we set in src/command.ts so platform selection works when
  // loading modules directly from the source tree.
  // eslint-disable-next-line no-var
  var PLATFORM_NODE: boolean;
  // eslint-disable-next-line no-var
  var PLATFORM_NODE_JEST: boolean;
}
globalThis.PLATFORM_NODE = false;
globalThis.PLATFORM_NODE_JEST = false;

import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { Scraper } from '../src/scraper';
import { SearchMode } from '../src/search';
import type { Tweet } from '../src/tweets';

type LogLevel = 'debug' | 'info' | 'error';

const LOG_LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  error: 2,
};

const ACTIVE_LOG_LEVEL: LogLevel = (() => {
  const raw = (process.env.INFO_LEVEL ?? 'info').toLowerCase();
  if (raw === 'debug' || raw === 'error') {
    return raw;
  }
  return 'info';
})();

function log(level: LogLevel, message: string, meta?: Record<string, unknown>) {
  if (LOG_LEVEL_ORDER[level] < LOG_LEVEL_ORDER[ACTIVE_LOG_LEVEL]) {
    return;
  }

  const prefix =
    level === 'error'
      ? '\x1b[31m[ERROR]\x1b[0m'
      : level === 'debug'
      ? '\x1b[35m[DEBUG]\x1b[0m'
      : '\x1b[36m[INFO]\x1b[0m';

  const suffix = meta ? ` ${JSON.stringify(meta)}` : '';
  console.log(`${prefix} ${message}${suffix}`);
}

interface ExportedCookie {
  name?: string;
  key?: string;
  value?: string;
  domain?: string;
  path?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: string;
  expirationDate?: number;
}

function normalizeSameSite(input?: string): string | undefined {
  if (!input) return undefined;
  const normalized = input.toLowerCase();
  if (normalized === 'lax' || normalized === 'strict') {
    return normalized[0].toUpperCase() + normalized.slice(1);
  }
  if (
    normalized === 'none' ||
    normalized === 'no_restriction' ||
    normalized === 'unspecified'
  ) {
    return 'None';
  }
  return undefined;
}

function normalizeExpiration(expirationDate?: number): string | undefined {
  if (typeof expirationDate !== 'number' || Number.isNaN(expirationDate)) {
    return undefined;
  }

  const millis =
    expirationDate > 1_000_000_000_000 ? expirationDate : expirationDate * 1000;
  return new Date(millis).toUTCString();
}

function serializeCookie(raw: ExportedCookie, index: number): string {
  const name = raw.name ?? raw.key;
  if (!name) {
    throw new Error(`Cookie at index ${index} is missing a name/key field.`);
  }
  if (typeof raw.value !== 'string') {
    throw new Error(`Cookie ${name} is missing a value.`);
  }

  const attrs = [`${name}=${raw.value}`];
  attrs.push(`Domain=${raw.domain ?? '.x.com'}`);
  attrs.push(`Path=${raw.path ?? '/'}`);
  if (raw.secure ?? true) {
    attrs.push('Secure');
  }
  if (raw.httpOnly ?? false) {
    attrs.push('HttpOnly');
  }
  const sameSite = normalizeSameSite(raw.sameSite);
  if (sameSite) {
    attrs.push(`SameSite=${sameSite}`);
  }
  const expires = normalizeExpiration(raw.expirationDate);
  if (expires) {
    attrs.push(`Expires=${expires}`);
  }

  return attrs.join('; ');
}

async function loadCookies(filePath: string): Promise<string[]> {
  const raw = await fs.readFile(filePath, 'utf8');
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) {
    throw new Error('cookies.json must be an array of cookie entries.');
  }

  return parsed.map((entry, index) => {
    if (typeof entry !== 'object' || entry == null) {
      throw new Error(`Cookie at index ${index} is not an object.`);
    }
    return serializeCookie(entry as ExportedCookie, index);
  });
}

function resolveSearchMode(input?: string): SearchMode {
  switch ((input ?? 'top').toLowerCase()) {
    case 'latest':
      return SearchMode.Latest;
    case 'photos':
      return SearchMode.Photos;
    case 'videos':
      return SearchMode.Videos;
    case 'users':
    case 'people':
      return SearchMode.Users;
    default:
      return SearchMode.Top;
  }
}

function summarizeTweet(
  tweet: Tweet,
): Record<string, string | number | undefined> {
  return {
    id: tweet.id,
    username: tweet.username,
    name: tweet.name,
    likes: tweet.likes,
    retweets: tweet.retweets,
    timestamp: tweet.timestamp,
    timeParsed: tweet.timeParsed?.toISOString(),
    text: (tweet.text ?? '').replace(/\s+/g, ' ').slice(0, 140),
  };
}

async function main() {
  const cookiesPath = path.resolve(
    process.cwd(),
    process.env.COOKIES_PATH ?? 'cookies.json',
  );
  log('info', 'Loading cookies', { cookiesPath });

  const cookieStrings = await loadCookies(cookiesPath);
  log('info', 'Cookies loaded', { count: cookieStrings.length });

  const scraper = new Scraper();
  await scraper.setCookies(cookieStrings);

  log('debug', 'Verifying authenticated session via cookies');
  if (!(await scraper.isLoggedIn())) {
    throw new Error('Cookie login failed. Refresh cookies.json and try again.');
  }
  log('info', 'Authenticated using cookies');

  const [, , queryArg = 'ai', limitArg = '5', modeArg = 'top'] = process.argv;
  const maxTweets = Number.parseInt(limitArg, 10);
  if (!Number.isFinite(maxTweets) || maxTweets <= 0) {
    throw new Error('Max results must be a positive integer.');
  }

  const searchMode = resolveSearchMode(modeArg);
  log('info', 'Executing search', {
    query: queryArg,
    maxTweets,
    searchMode: SearchMode[searchMode],
  });

  const tweets: Tweet[] = [];
  for await (const tweet of scraper.searchTweets(
    queryArg,
    maxTweets,
    searchMode,
  )) {
    tweets.push(tweet);
    log('debug', 'RAW TWEET DATA', { tweet });
    log('debug', 'Tweet received', summarizeTweet(tweet));
  }

  log('info', 'Search complete', { results: tweets.length });
  tweets.forEach((tweet, index) => {
    log('info', `#${index + 1}`, summarizeTweet(tweet));
  });
}

main().catch((err) => {
  const meta =
    err instanceof Error
      ? { message: err.message, stack: err.stack }
      : { error: err };
  log('error', 'Search test failed', meta);
  process.exit(1);
});

export {};
