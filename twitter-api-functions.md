# Twitter API Functions Documentation

This document provides a comprehensive list of all Twitter functions, their endpoints, and associated types in the goat-x codebase.

## Table of Contents
- [Authentication Functions](#authentication-functions)
- [Profile Functions](#profile-functions)
- [Tweet Functions](#tweet-functions)
- [Search Functions](#search-functions)
- [Relationship Functions](#relationship-functions)
- [Timeline Functions](#timeline-functions)
- [Direct Message Functions](#direct-message-functions)
- [Spaces Functions](#spaces-functions)
- [Trends Functions](#trends-functions)
- [Core API Functions](#core-api-functions)
- [Type Definitions](#type-definitions)

## Authentication Functions

### TwitterGuestAuth Class
**File:** `src/auth.ts`

#### Methods:
- `cookieJar(): CookieJar` - Returns the current cookie jar
- `getV2Client(): TwitterApi | null` - Get v2 API client if it exists
- `isLoggedIn(): Promise<boolean>` - Returns if a user is logged-in
- `me(): Promise<Profile | undefined>` - Fetches the current user's profile
- `login(username: string, password: string, email?: string): Promise<void>` - Logs into a Twitter account
- `logout(): Promise<void>` - Logs out of the current session
- `deleteToken(): void` - Deletes the current guest token
- `hasToken(): boolean` - Returns if the authentication state has a token
- `authenticatedAt(): Date | null` - Returns the time that authentication was performed
- `installTo(headers: Headers, url: string): Promise<void>` - Installs authentication information into headers

#### Endpoints:
- `https://api.x.com/1.1/guest/activate.json` - Guest token activation

### TwitterUserAuth Class
**File:** `src/auth-user.ts`

#### Methods:
- `isLoggedIn(): Promise<boolean>` - Checks if user is logged in
- `me(): Promise<Profile | undefined>` - Gets current user profile
- `login(username: string, password: string, email?: string, twoFactorSecret?: string, appKey?: string, appSecret?: string, accessToken?: string, accessSecret?: string): Promise<void>` - User login
- `logout(): Promise<void>` - User logout
- `installCsrfToken(headers: Headers): Promise<void>` - Installs CSRF token
- `installTo(headers: Headers): Promise<void>` - Installs authentication to headers

#### Endpoints:
- `https://api.x.com/1.1/account/verify_credentials.json` - Verify credentials
- `https://api.x.com/1.1/account/logout.json` - Logout
- `https://api.x.com/1.1/onboarding/task.json` - Onboarding tasks

## Profile Functions

### Profile Functions
**File:** `src/profile.ts`

#### Functions:
- `parseProfile(user: LegacyUserRaw, isBlueVerified?: boolean): Profile` - Parses user profile data
- `getProfile(username: string, auth: TwitterAuth): Promise<RequestApiResult<Profile>>` - Gets profile by username
- `getScreenNameByUserId(userId: string, auth: TwitterAuth): Promise<RequestApiResult<string>>` - Gets screen name by user ID
- `getUserIdByScreenName(screenName: string, auth: TwitterAuth): Promise<RequestApiResult<string>>` - Gets user ID by screen name

#### Endpoints:
- `https://x.com/i/api/graphql/G3KGOASz96M-Qu0nwmGXNg/UserByScreenName` - Get user by screen name
- `https://x.com/i/api/graphql/xf3jd90KKBCUxdlI_tNHZw/UserByRestId` - Get user by rest ID

#### Types:
```typescript
interface Profile {
  avatar?: string;
  banner?: string;
  biography?: string;
  birthday?: string;
  followersCount?: number;
  followingCount?: number;
  friendsCount?: number;
  mediaCount?: number;
  statusesCount?: number;
  isPrivate?: boolean;
  isVerified?: boolean;
  isBlueVerified?: boolean;
  joined?: Date;
  likesCount?: number;
  listedCount?: number;
  location: string;
  name?: string;
  pinnedTweetIds?: string[];
  tweetsCount?: number;
  url?: string;
  userId?: string;
  username?: string;
  website?: string;
  canDm?: boolean;
}

interface LegacyUserRaw {
  created_at?: string;
  description?: string;
  entities?: {
    url?: {
      urls?: {
        expanded_url?: string;
      }[];
    };
  };
  favourites_count?: number;
  followers_count?: number;
  friends_count?: number;
  media_count?: number;
  statuses_count?: number;
  id_str?: string;
  listed_count?: number;
  name?: string;
  location: string;
  geo_enabled?: boolean;
  pinned_tweet_ids_str?: string[];
  profile_background_color?: string;
  profile_banner_url?: string;
  profile_image_url_https?: string;
  protected?: boolean;
  screen_name?: string;
  verified?: boolean;
  has_custom_timelines?: boolean;
  has_extended_profile?: boolean;
  url?: string;
  can_dm?: boolean;
}
```

## Tweet Functions

### Tweet Functions
**File:** `src/tweets.ts`

#### Functions:
- `fetchTweets(userId: string, maxTweets: number, cursor: string | undefined, auth: TwitterAuth): Promise<QueryTweetsResponse>` - Fetches user tweets
- `fetchTweetsAndReplies(userId: string, maxTweets: number, cursor: string | undefined, auth: TwitterAuth): Promise<QueryTweetsResponse>` - Fetches tweets and replies
- `createCreateTweetRequest(text: string, auth: TwitterAuth, tweetId?: string, mediaData?: { data: Buffer; mediaType: string }[], hideLinkPreview?: boolean)` - Creates tweet request
- `createCreateTweetRequestV2(text: string, auth: TwitterAuth, tweetId?: string, options?: { poll?: PollData })` - Creates tweet request v2
- `createCreateNoteTweetRequest(text: string, auth: TwitterAuth, tweetId?: string, mediaData?: { data: Buffer; mediaType: string }[])` - Creates note tweet request
- `createCreateLongTweetRequest(text: string, auth: TwitterAuth, tweetId?: string, mediaData?: { data: Buffer; mediaType: string }[])` - Creates long tweet request
- `createQuoteTweetRequest(text: string, quotedTweetId: string, auth: TwitterAuth, mediaData?: { data: Buffer; mediaType: string }[])` - Creates quote tweet request
- `likeTweet(tweetId: string, auth: TwitterAuth): Promise<void>` - Likes a tweet
- `retweet(tweetId: string, auth: TwitterAuth): Promise<void>` - Retweets a tweet
- `getTweet(id: string, auth: TwitterAuth): Promise<Tweet | null>` - Gets tweet by ID
- `getTweetV2(id: string, auth: TwitterAuth, options: {...}): Promise<Tweet | null>` - Gets tweet by ID v2
- `getTweetsV2(ids: string[], auth: TwitterAuth, options: {...}): Promise<Tweet[]>` - Gets multiple tweets v2
- `getTweetAnonymous(id: string, auth: TwitterAuth): Promise<Tweet | null>` - Gets tweet anonymously
- `getLatestTweet(user: string, includeRetweets: boolean, max: number, auth: TwitterAuth): Promise<Tweet | null | void>` - Gets latest tweet
- `getTweetWhere(tweets: AsyncIterable<Tweet>, query: TweetQuery): Promise<Tweet | null>` - Gets tweet matching query
- `getTweetsWhere(tweets: AsyncIterable<Tweet>, query: TweetQuery): Promise<Tweet[]>` - Gets tweets matching query
- `getTweets(user: string, maxTweets: number, auth: TwitterAuth): AsyncGenerator<Tweet, void>` - Gets tweets generator
- `getTweetsByUserId(userId: string, maxTweets: number, auth: TwitterAuth): AsyncGenerator<Tweet, void>` - Gets tweets by user ID generator
- `getTweetsAndReplies(user: string, maxTweets: number, auth: TwitterAuth): AsyncGenerator<Tweet>` - Gets tweets and replies generator
- `getTweetsAndRepliesByUserId(userId: string, maxTweets: number, auth: TwitterAuth): AsyncGenerator<Tweet, void>` - Gets tweets and replies by user ID generator
- `fetchLikedTweets(userId: string, maxTweets: number, cursor: string | undefined, auth: TwitterAuth): Promise<QueryTweetsResponse>` - Fetches liked tweets
- `fetchListTweets(listId: string, maxTweets: number, cursor: string | undefined, auth: TwitterAuth): Promise<QueryTweetsResponse>` - Fetches list tweets
- `getArticle(id: string, auth: TwitterAuth): Promise<TimelineArticle | null>` - Gets article by ID

#### Endpoints:
- `https://x.com/i/api/graphql/V7H0Ap3_Hh2FyS75OCDO3Q/UserTweets` - User tweets
- `https://x.com/i/api/graphql/E4wA5vo2sjVyvpliUffSCw/UserTweetsAndReplies` - User tweets and replies
- `https://x.com/i/api/graphql/eSSNbhECHHWWALkkQq-YTA/Likes` - User liked tweets
- `https://x.com/i/api/graphql/xOhkmRac04YFZmOzU9PJHg/TweetDetail` - Tweet detail
- `https://x.com/i/api/graphql/GtcBtFhtQymrpxAs5MALVA/TweetDetail` - Tweet detail (article)
- `https://x.com/i/api/graphql/DJS3BdhUhcaEpZ7B7irJDg/TweetResultByRestId` - Tweet by rest ID
- `https://x.com/i/api/graphql/whF0_KH1fCkdLLoyNPMoEw/ListLatestTweetsTimeline` - List tweets timeline
- `https://x.com/i/api/graphql/a1p9RWpkYKBjWv_I3WzS-A/CreateTweet` - Create tweet
- `https://x.com/i/api/graphql/0aWhJJmFlxkxv9TAUJPanA/CreateNoteTweet` - Create note tweet
- `https://x.com/i/api/graphql/lI07N6Otwv1PhnEgXILM7A/FavoriteTweet` - Like tweet
- `https://x.com/i/api/graphql/ojPdsZsimiJrUGLR1sjUtA/CreateRetweet` - Retweet
- `https://x.com/i/api/graphql/YNXM2DGuE2Sff6a2JD3Ztw/CreateNoteTweet` - Create long tweet
- `https://api.x.com/1.1/onboarding/task.json` - Onboarding task (for tweet creation)

#### Types:
```typescript
interface Tweet {
  bookmarkCount?: number;
  conversationId?: string;
  hashtags: string[];
  html?: string;
  id?: string;
  inReplyToStatus?: Tweet;
  inReplyToStatusId?: string;
  isQuoted?: boolean;
  isPin?: boolean;
  isReply?: boolean;
  isRetweet?: boolean;
  isSelfThread?: boolean;
  likes?: number;
  name?: string;
  mentions: Mention[];
  permanentUrl?: string;
  photos: Photo[];
  place?: PlaceRaw;
  quotedStatus?: Tweet;
  quotedStatusId?: string;
  replies?: number;
  retweets?: number;
  retweetedStatus?: Tweet;
  retweetedStatusId?: string;
  text?: string;
  thread: Tweet[];
  timeParsed?: Date;
  timestamp?: number;
  urls: string[];
  userId?: string;
  username?: string;
  videos: Video[];
  views?: number;
  sensitiveContent?: boolean;
  poll?: PollV2 | null;
}

interface Mention {
  id: string;
  username?: string;
  name?: string;
}

interface Photo {
  id: string;
  url: string;
  alt_text: string | undefined;
}

interface Video {
  id: string;
  preview: string;
  url?: string;
}

interface PollData {
  id?: string;
  end_datetime?: string;
  voting_status?: string;
  duration_minutes: number;
  options: PollOption[];
}

interface PollOption {
  position?: number;
  label: string;
  votes?: number;
}

type TweetQuery = Partial<Tweet> | ((tweet: Tweet) => boolean | Promise<boolean>);
```

## Search Functions

### Search Functions
**File:** `src/search.ts`

#### Functions:
- `searchTweets(query: string, maxTweets: number, searchMode: SearchMode, auth: TwitterAuth): AsyncGenerator<Tweet, void>` - Searches tweets
- `searchProfiles(query: string, maxProfiles: number, auth: TwitterAuth): AsyncGenerator<Profile, void>` - Searches profiles
- `fetchSearchTweets(query: string, maxTweets: number, searchMode: SearchMode, auth: TwitterAuth, cursor?: string): Promise<QueryTweetsResponse>` - Fetches search tweets
- `fetchSearchProfiles(query: string, maxProfiles: number, auth: TwitterAuth, cursor?: string): Promise<QueryProfilesResponse>` - Fetches search profiles

#### Endpoints:
- `https://api.x.com/graphql/gkjsKepM6gl_HmFWoWKfgg/SearchTimeline` - Search timeline

#### Types:
```typescript
enum SearchMode {
  Top,
  Latest,
  Photos,
  Videos,
  Users,
}
```

## Relationship Functions

### Relationship Functions
**File:** `src/relationships.ts`

#### Functions:
- `getFollowing(userId: string, maxProfiles: number, auth: TwitterAuth): AsyncGenerator<Profile, void>` - Gets following users
- `getFollowers(userId: string, maxProfiles: number, auth: TwitterAuth): AsyncGenerator<Profile, void>` - Gets followers
- `fetchProfileFollowing(userId: string, maxProfiles: number, auth: TwitterAuth, cursor?: string): Promise<QueryProfilesResponse>` - Fetches profile following
- `fetchProfileFollowers(userId: string, maxProfiles: number, auth: TwitterAuth, cursor?: string): Promise<QueryProfilesResponse>` - Fetches profile followers
- `followUser(username: string, auth: TwitterAuth): Promise<Response>` - Follows a user

#### Endpoints:
- `https://x.com/i/api/graphql/iSicc7LrzWGBgDPL0tM_TQ/Following` - Following users
- `https://x.com/i/api/graphql/rRXFSG5vR6drKr5M37YOTw/Followers` - Followers
- `https://api.x.com/1.1/friendships/create.json` - Follow user

## Timeline Functions

### Timeline Functions
**Files:** `src/timeline-home.ts`, `src/timeline-following.ts`, `src/timeline-v1.ts`, `src/timeline-v2.ts`

#### Functions:
- `fetchHomeTimeline(count: number, seenTweetIds: string[], auth: TwitterAuth): Promise<any[]>` - Fetches home timeline
- `fetchFollowingTimeline(count: number, seenTweetIds: string[], auth: TwitterAuth): Promise<any[]>` - Fetches following timeline
- `parseTimelineTweetsV1(timeline: TimelineV1): QueryTweetsResponse` - Parses timeline tweets v1
- `parseTimelineTweetsV2(timeline: TimelineV2): QueryTweetsResponse` - Parses timeline tweets v2
- `parseUsers(timeline: TimelineV1): QueryProfilesResponse` - Parses users from timeline
- `parseLegacyTweet(user?: LegacyUserRaw, tweet?: LegacyTweetRaw): ParseTweetResult` - Parses legacy tweet
- `parseTimelineEntryItemContentRaw(content: TimelineEntryItemContentRaw, entryId: string, isConversation?: boolean)` - Parses timeline entry
- `parseThreadedConversation(conversation: ThreadedConversation): Tweet[]` - Parses threaded conversation
- `parseArticle(conversation: ThreadedConversation): TimelineArticle[]` - Parses article

#### Endpoints:
- `https://x.com/i/api/graphql/HJFjzBgCs16TqxewQOeLNg/HomeTimeline` - Home timeline
- `https://x.com/i/api/graphql/K0X1xbCZUjttdK8RazKAlw/HomeLatestTimeline` - Home latest timeline

#### Types:
```typescript
interface QueryTweetsResponse {
  tweets: Tweet[];
  next?: string;
  previous?: string;
}

interface QueryProfilesResponse {
  profiles: Profile[];
  next?: string;
  previous?: string;
}

interface TimelineV1 {
  globalObjects?: TimelineGlobalObjectsRaw;
  timeline?: TimelineDataRaw;
}

interface TimelineV2 {
  data?: {
    user?: {
      result?: {
        timeline_v2?: {
          timeline?: {
            instructions?: TimelineInstruction[];
          };
        };
      };
    };
  };
}

interface ThreadedConversation {
  data?: {
    threaded_conversation_with_injections_v2?: {
      instructions?: TimelineInstruction[];
    };
  };
}

interface TimelineArticle {
  id: string;
  articleId: string;
  title: string;
  previewText: string;
  coverMediaUrl?: string;
  text: string;
}

type ParseTweetResult = 
  | { success: true; tweet: Tweet }
  | { success: false; err: Error };
```

## Direct Message Functions

### Direct Message Functions
**File:** `src/messages.ts`

#### Functions:
- `getDirectMessageConversations(userId: string, auth: TwitterAuth, cursor?: string): Promise<DirectMessagesResponse>` - Gets DM conversations
- `sendDirectMessage(auth: TwitterAuth, conversation_id: string, text: string): Promise<SendDirectMessageResponse>` - Sends direct message

#### Endpoints:
- `https://x.com/i/api/graphql/7s3kOODhC5vgXlO0OlqYdA/DMInboxTimeline` - DM inbox timeline
- `https://x.com/i/api/1.1/dm/inbox_initial_state.json` - DM inbox initial state
- `https://x.com/i/api/1.1/dm/new2.json` - Send DM

#### Types:
```typescript
interface DirectMessage {
  id: string;
  text: string;
  senderId: string;
  recipientId: string;
  createdAt: string;
  mediaUrls?: string[];
  senderScreenName?: string;
  recipientScreenName?: string;
}

interface DirectMessageConversation {
  conversationId: string;
  messages: DirectMessage[];
  participants: {
    id: string;
    screenName: string;
  }[];
}

interface DirectMessagesResponse {
  conversations: DirectMessageConversation[];
  users: TwitterUser[];
  cursor?: string;
  lastSeenEventId?: string;
  trustedLastSeenEventId?: string;
  untrustedLastSeenEventId?: string;
  inboxTimelines?: {
    trusted?: {
      status: string;
      minEntryId?: string;
    };
    untrusted?: {
      status: string;
      minEntryId?: string;
    };
  };
  userId: string;
}

interface SendDirectMessageResponse {
  entries: {
    message: {
      id: string;
      time: string;
      affects_sort: boolean;
      conversation_id: string;
      message_data: {
        id: string;
        time: string;
        recipient_id: string;
        sender_id: string;
        text: string;
      };
    };
  }[];
  users: Record<string, TwitterUser>;
}
```

## Spaces Functions

### Spaces Functions
**File:** `src/spaces.ts`

#### Functions:
- `fetchAudioSpaceById(variables: AudioSpaceByIdVariables, auth: TwitterAuth): Promise<AudioSpace>` - Fetches audio space by ID
- `fetchBrowseSpaceTopics(auth: TwitterAuth): Promise<Subtopic[]>` - Fetches space topics
- `fetchCommunitySelectQuery(auth: TwitterAuth): Promise<Community[]>` - Fetches communities
- `fetchLiveVideoStreamStatus(mediaKey: string, auth: TwitterAuth): Promise<LiveVideoStreamStatus>` - Fetches live video stream status
- `fetchAuthenticatePeriscope(auth: TwitterAuth): Promise<string>` - Authenticates Periscope
- `fetchLoginTwitterToken(jwt: unknown, auth: TwitterAuth): Promise<LoginTwitterTokenResponse>` - Logs in with Twitter token

#### Endpoints:
- `https://api.x.com/1.1/onboarding/task.json` - Onboarding task (for spaces)

#### Types:
```typescript
interface AudioSpace {
  metadata: Metadata;
  is_subscribed: boolean;
  participants: Participants;
  sharings: Sharings;
}

interface Community {
  id: string;
  name: string;
  rest_id: string;
}

interface Subtopic {
  icon_url: string;
  name: string;
  topic_id: string;
}

interface LiveVideoStreamStatus {
  source: LiveVideoSource;
  sessionId: string;
  chatToken: string;
  lifecycleToken: string;
  shareUrl: string;
  chatPermissionType: string;
}

interface LoginTwitterTokenResponse {
  cookie: string;
  user: {
    class_name: string;
    id: string;
    created_at: string;
    is_beta_user: boolean;
    is_employee: boolean;
    is_twitter_verified: boolean;
    verified_type: number;
    is_bluebird_user: boolean;
    twitter_screen_name: string;
    username: string;
    display_name: string;
    description: string;
    profile_image_urls: {
      url: string;
      ssl_url: string;
      width: number;
      height: number;
    }[];
    twitter_id: string;
    initials: string;
    n_followers: number;
    n_following: number;
  };
  type: string;
}
```

## Trends Functions

### Trends Functions
**File:** `src/trends.ts`

#### Functions:
- `getTrends(auth: TwitterAuth): Promise<string[]>` - Gets trending topics

#### Endpoints:
- `https://api.x.com/2/guide.json` - Trends guide

## Core API Functions

### Core API Functions
**File:** `src/api.ts`

#### Functions:
- `requestApi<T>(url: string, auth: TwitterAuth, method?: 'GET' | 'POST', platform?: PlatformExtensions): Promise<RequestApiResult<T>>` - Core API request function
- `addApiFeatures(o: object)` - Adds API features to request
- `addApiParams(params: URLSearchParams, includeTweetReplies: boolean): URLSearchParams` - Adds API parameters

#### Types:
```typescript
type RequestApiResult<T> = 
  | { success: true; value: T }
  | { success: false; err: Error };

interface FetchTransformOptions {
  request: (...args: FetchParameters) => FetchParameters | Promise<FetchParameters>;
  response: (response: Response) => Response | Promise<Response>;
}
```

## Scraper Class Methods

### Scraper Class
**File:** `src/scraper.ts`

#### Main Methods:
- `getProfile(username: string): Promise<Profile>` - Gets user profile
- `getUserIdByScreenName(screenName: string): Promise<string>` - Gets user ID by screen name
- `getScreenNameByUserId(userId: string): Promise<string>` - Gets screen name by user ID
- `searchTweets(query: string, maxTweets: number, searchMode?: SearchMode): AsyncGenerator<Tweet, void>` - Searches tweets
- `searchProfiles(query: string, maxProfiles: number): AsyncGenerator<Profile, void>` - Searches profiles
- `getTweets(user: string, maxTweets?: number): AsyncGenerator<Tweet>` - Gets user tweets
- `getTweetsByUserId(userId: string, maxTweets?: number): AsyncGenerator<Tweet, void>` - Gets tweets by user ID
- `getTweetsAndReplies(user: string, maxTweets?: number): AsyncGenerator<Tweet>` - Gets tweets and replies
- `getTweetsAndRepliesByUserId(userId: string, maxTweets?: number): AsyncGenerator<Tweet, void>` - Gets tweets and replies by user ID
- `getFollowing(userId: string, maxProfiles: number): AsyncGenerator<Profile, void>` - Gets following users
- `getFollowers(userId: string, maxProfiles: number): AsyncGenerator<Profile, void>` - Gets followers
- `getTrends(): Promise<string[]>` - Gets trends
- `getTweet(id: string): Promise<Tweet | null>` - Gets tweet by ID
- `getTweetV2(id: string, options?: {...}): Promise<Tweet | null>` - Gets tweet by ID v2
- `getTweetsV2(ids: string[], options?: {...}): Promise<Tweet[]>` - Gets multiple tweets v2
- `getLatestTweet(user: string, includeRetweets?: boolean, max?: number): Promise<Tweet | null | void>` - Gets latest tweet
- `getTweetWhere(tweets: AsyncIterable<Tweet>, query: TweetQuery): Promise<Tweet | null>` - Gets tweet matching query
- `getTweetsWhere(tweets: AsyncIterable<Tweet>, query: TweetQuery): Promise<Tweet[]>` - Gets tweets matching query
- `sendTweet(text: string, replyToTweetId?: string, mediaData?: { data: Buffer; mediaType: string }[], hideLinkPreview?: boolean)` - Sends tweet
- `sendNoteTweet(text: string, replyToTweetId?: string, mediaData?: { data: Buffer; mediaType: string }[])` - Sends note tweet
- `sendLongTweet(text: string, replyToTweetId?: string, mediaData?: { data: Buffer; mediaType: string }[])` - Sends long tweet
- `sendTweetV2(text: string, replyToTweetId?: string, options?: { poll?: PollData })` - Sends tweet v2
- `sendQuoteTweet(text: string, quotedTweetId: string, options?: { mediaData: { data: Buffer; mediaType: string }[] })` - Sends quote tweet
- `likeTweet(tweetId: string): Promise<void>` - Likes tweet
- `retweet(tweetId: string): Promise<void>` - Retweets tweet
- `followUser(userName: string): Promise<void>` - Follows user
- `getDirectMessageConversations(userId: string, cursor?: string): Promise<DirectMessagesResponse>` - Gets DM conversations
- `sendDirectMessage(conversationId: string, text: string): Promise<SendDirectMessageResponse>` - Sends DM
- `login(username: string, password: string, email?: string, twoFactorSecret?: string, appKey?: string, appSecret?: string, accessToken?: string, accessSecret?: string): Promise<void>` - Logs in
- `logout(): Promise<void>` - Logs out
- `isLoggedIn(): Promise<boolean>` - Checks if logged in
- `me(): Promise<Profile | undefined>` - Gets current user profile
- `getCookies(): Promise<Cookie[]>` - Gets cookies
- `setCookies(cookies: (string | Cookie)[]): Promise<void>` - Sets cookies
- `clearCookies(): Promise<void>` - Clears cookies
- `withCookie(cookie: string): Scraper` - Returns scraper with cookie
- `withXCsrfToken(token: string): Scraper` - Returns scraper with CSRF token
- `getAudioSpaceById(id: string): Promise<AudioSpace>` - Gets audio space by ID
- `browseSpaceTopics(): Promise<Subtopic[]>` - Browses space topics
- `communitySelectQuery(): Promise<Community[]>` - Gets communities
- `getAudioSpaceStreamStatus(mediaKey: string): Promise<LiveVideoStreamStatus>` - Gets audio space stream status
- `getAudioSpaceStatus(audioSpaceId: string): Promise<LiveVideoStreamStatus>` - Gets audio space status
- `authenticatePeriscope(): Promise<string>` - Authenticates Periscope
- `loginTwitterToken(jwt: string): Promise<LoginTwitterTokenResponse>` - Logs in with Twitter token
- `getPeriscopeCookie(): Promise<string>` - Gets Periscope cookie
- `getArticle(id: string): Promise<TimelineArticle | null>` - Gets article

## Type Definitions

### Common Types
```typescript
interface ScraperOptions {
  fetch: typeof fetch;
  transform: Partial<FetchTransformOptions>;
}

interface TwitterAuthOptions {
  fetch: typeof fetch;
  transform: Partial<FetchTransformOptions>;
}

interface TwitterAuth {
  fetch: typeof fetch;
  cookieJar(): CookieJar;
  loginWithV2(appKey: string, appSecret: string, accessToken: string, accessSecret: string): void;
  getV2Client(): TwitterApi | null;
  isLoggedIn(): Promise<boolean>;
  me(): Promise<Profile | undefined>;
  login(username: string, password: string, email?: string, twoFactorSecret?: string): Promise<void>;
  logout(): Promise<void>;
  deleteToken(): void;
  hasToken(): boolean;
  authenticatedAt(): Date | null;
  installTo(headers: Headers, url: string): Promise<void>;
}

interface ApiRequestInfo<EndpointUrl> {
  url: string;
  variables?: Record<string, unknown>;
  features?: Record<string, unknown>;
  fieldToggles?: Record<string, unknown>;
  toRequestUrl(): string;
}

interface EndpointFieldInfo {
  variables: Record<string, unknown>;
  features: Record<string, unknown>;
  fieldToggles: Record<string, unknown>;
}
```

## API Endpoints Summary

### GraphQL Endpoints
- `https://x.com/i/api/graphql/V7H0Ap3_Hh2FyS75OCDO3Q/UserTweets` - User tweets
- `https://x.com/i/api/graphql/E4wA5vo2sjVyvpliUffSCw/UserTweetsAndReplies` - User tweets and replies
- `https://x.com/i/api/graphql/eSSNbhECHHWWALkkQq-YTA/Likes` - User liked tweets
- `https://x.com/i/api/graphql/xOhkmRac04YFZmOzU9PJHg/TweetDetail` - Tweet detail
- `https://x.com/i/api/graphql/GtcBtFhtQymrpxAs5MALVA/TweetDetail` - Tweet detail (article)
- `https://x.com/i/api/graphql/DJS3BdhUhcaEpZ7B7irJDg/TweetResultByRestId` - Tweet by rest ID
- `https://x.com/i/api/graphql/whF0_KH1fCkdLLoyNPMoEw/ListLatestTweetsTimeline` - List tweets timeline
- `https://x.com/i/api/graphql/a1p9RWpkYKBjWv_I3WzS-A/CreateTweet` - Create tweet
- `https://x.com/i/api/graphql/0aWhJJmFlxkxv9TAUJPanA/CreateNoteTweet` - Create note tweet
- `https://x.com/i/api/graphql/lI07N6Otwv1PhnEgXILM7A/FavoriteTweet` - Like tweet
- `https://x.com/i/api/graphql/ojPdsZsimiJrUGLR1sjUtA/CreateRetweet` - Retweet
- `https://x.com/i/api/graphql/YNXM2DGuE2Sff6a2JD3Ztw/CreateNoteTweet` - Create long tweet
- `https://x.com/i/api/graphql/G3KGOASz96M-Qu0nwmGXNg/UserByScreenName` - Get user by screen name
- `https://x.com/i/api/graphql/xf3jd90KKBCUxdlI_tNHZw/UserByRestId` - Get user by rest ID
- `https://x.com/i/api/graphql/iSicc7LrzWGBgDPL0tM_TQ/Following` - Following users
- `https://x.com/i/api/graphql/rRXFSG5vR6drKr5M37YOTw/Followers` - Followers
- `https://x.com/i/api/graphql/HJFjzBgCs16TqxewQOeLNg/HomeTimeline` - Home timeline
- `https://x.com/i/api/graphql/K0X1xbCZUjttdK8RazKAlw/HomeLatestTimeline` - Home latest timeline
- `https://x.com/i/api/graphql/7s3kOODhC5vgXlO0OlqYdA/DMInboxTimeline` - DM inbox timeline

### REST API Endpoints
- `https://api.x.com/1.1/guest/activate.json` - Guest token activation
- `https://api.x.com/1.1/account/verify_credentials.json` - Verify credentials
- `https://api.x.com/1.1/account/logout.json` - Logout
- `https://api.x.com/1.1/onboarding/task.json` - Onboarding tasks
- `https://api.x.com/1.1/friendships/create.json` - Follow user
- `https://api.x.com/2/guide.json` - Trends guide
- `https://api.x.com/graphql/gkjsKepM6gl_HmFWoWKfgg/SearchTimeline` - Search timeline

### Other Endpoints
- `https://x.com/i/api/1.1/dm/inbox_initial_state.json` - DM inbox initial state
- `https://x.com/i/api/1.1/dm/new2.json` - Send DM
- `https://x.com/i/api/1.1/live_video_stream/status/{mediaKey}` - Live video stream status

This documentation covers all the Twitter API functions, their endpoints, and associated types in the goat-x codebase. The functions are organized by category and include both the function signatures and the endpoints they use.
