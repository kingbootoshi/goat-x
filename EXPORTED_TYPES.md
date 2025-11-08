# Exported Types from Twitter/X API Library

This document lists all the exact type definitions that can be exported from this Twitter/X API library.

## Core Types

### Profile & User Types

```typescript
export interface Profile {
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

export interface LegacyUserRaw {
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

export interface UserRaw {
  data: {
    user: {
      result: {
        rest_id?: string;
        is_blue_verified?: boolean;
        legacy: LegacyUserRaw;
      };
    };
  };
  errors?: TwitterApiErrorRaw[];
}

export interface TwitterUser {
  id: string;
  screenName: string;
  name: string;
  profileImageUrl: string;
  description?: string;
  verified?: boolean;
  protected?: boolean;
  followersCount?: number;
  friendsCount?: number;
}
```

### Tweet Types

```typescript
export interface Tweet {
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

export type TweetQuery =
  | Partial<Tweet>
  | ((tweet: Tweet) => boolean | Promise<boolean>);

export interface Mention {
  id: string;
  username?: string;
  name?: string;
}

export interface Photo {
  id: string;
  url: string;
  alt_text: string | undefined;
}

export interface Video {
  id: string;
  preview: string;
  url?: string;
}

export interface PlaceRaw {
  id?: string;
  place_type?: string;
  name?: string;
  full_name?: string;
  country_code?: string;
  country?: string;
  bounding_box?: {
    type?: string;
    coordinates?: number[][][];
  };
}

export interface PollData {
  id?: string;
  end_datetime?: string;
  voting_status?: string;
  duration_minutes: number;
  options: PollOption[];
}

export interface PollOption {
  position?: number;
  label: string;
  votes?: number;
}

export interface TweetResultByRestId {
  data?: TimelineEntryItemContentRaw;
}

### Timeline Types

```typescript
export interface QueryTweetsResponse {
  tweets: Tweet[];
  next?: string;
  previous?: string;
}

export interface QueryProfilesResponse {
  profiles: Profile[];
  next?: string;
  previous?: string;
}

export type ParseTweetResult =
  | { success: true; tweet: Tweet }
  | { success: false; err: Error };
```

### Direct Message Types

```typescript
export interface DirectMessage {
  id: string;
  text: string;
  senderId: string;
  recipientId: string;
  createdAt: string;
  mediaUrls?: string[];
  senderScreenName?: string;
  recipientScreenName?: string;
}

export interface DirectMessageConversation {
  conversationId: string;
  messages: DirectMessage[];
  participants: {
    id: string;
    screenName: string;
  }[];
}

export interface DirectMessageEvent {
  id: string;
  type: string;
  message_create: {
    sender_id: string;
    target: {
      recipient_id: string;
    };
    message_data: {
      text: string;
      created_at: string;
      entities?: {
        urls?: Array<{
          url: string;
          expanded_url: string;
          display_url: string;
        }>;
        media?: Array<{
          url: string;
          type: string;
        }>;
      };
    };
  };
}

export interface DirectMessagesResponse {
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

export interface SendDirectMessageResponse {
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

### Authentication Types

```typescript
export interface TwitterAuthOptions {
  fetch: typeof fetch;
  transform: Partial<FetchTransformOptions>;
}

export interface TwitterAuth {
  fetch: typeof fetch;
  cookieJar(): CookieJar;
  loginWithV2(
    appKey: string,
    appSecret: string,
    accessToken: string,
    accessSecret: string,
  ): void;
  getV2Client(): TwitterApi | null;
  isLoggedIn(): Promise<boolean>;
  me(): Promise<Profile | undefined>;
  login(
    username: string,
    password: string,
    email?: string,
    twoFactorSecret?: string,
  ): Promise<void>;
  logout(): Promise<void>;
  deleteToken(): void;
  hasToken(): boolean;
  authenticatedAt(): Date | null;
  installTo(headers: Headers, url: string): Promise<void>;
}

export type RequestApiResult<T> =
  | { success: true; value: T }
  | { success: false; err: Error };
```

### Search Types

```typescript
export enum SearchMode {
  Top,
  Latest,
  Photos,
  Videos,
  Users,
}
```

### API Types

```typescript
export interface FetchTransformOptions {
  request: (
    ...args: FetchParameters
  ) => FetchParameters | Promise<FetchParameters>;
  response: (response: Response) => Response | Promise<Response>;
}

export interface ScraperOptions {
  fetch: typeof fetch;
  transform: Partial<FetchTransformOptions>;
}

export interface EndpointFieldInfo {
  variables: Record<string, unknown>;
  features: Record<string, unknown>;
  fieldToggles: Record<string, unknown>;
}

export type ApiRequestInfo<EndpointUrl> = EndpointFields<EndpointUrl> & {
  url: string;
  toRequestUrl(): string;
};
```

## Spaces Types

### Core Spaces Types

```typescript
export interface SpaceConfig {
  mode: 'BROADCAST' | 'LISTEN' | 'INTERACTIVE';
  title?: string;
  description?: string;
  languages?: string[];
  debug?: boolean;
}

export interface AudioData {
  bitsPerSample: number; // e.g., 16
  sampleRate: number; // e.g., 48000
  channelCount: number; // e.g., 1 for mono, 2 for stereo
  numberOfFrames: number; // how many samples per channel
  samples: Int16Array; // the raw PCM data
}

export interface AudioDataWithUser extends AudioData {
  userId: string; // The ID of the speaker or user
}

export interface SpeakerRequest {
  userId: string;
  username: string;
  displayName: string;
  sessionUUID: string;
}

export interface OccupancyUpdate {
  occupancy: number;
  totalParticipants: number;
}

export interface GuestReaction {
  displayName: string;
  emoji: string;
}

export interface BroadcastCreated {
  room_id: string;
  credential: string;
  stream_name: string;
  webrtc_gw_url: string;
  broadcast: {
    user_id: string;
    twitter_id: string;
    media_key: string;
  };
  access_token: string;
  endpoint: string;
  share_url: string;
  stream_url: string;
}

export interface TurnServersInfo {
  ttl: string;
  username: string;
  password: string;
  uris: string[];
}

export interface Plugin {
  onAttach?(space: Space): void;
  init?(params: { space: Space; pluginConfig?: Record<string, any> }): void;
  onAudioData?(data: AudioDataWithUser): void;
  cleanup?(): void;
}

export interface PluginRegistration {
  plugin: Plugin;
  config?: Record<string, any>;
}

export interface SpeakerInfo {
  userId: string;
  sessionUUID: string;
  janusParticipantId?: number;
}
```

### Spaces API Types

```typescript
export interface Community {
  id: string;
  name: string;
  rest_id: string;
}

export interface CommunitySelectQueryResponse {
  data: {
    space_hostable_communities: Community[];
  };
  errors?: any[];
}

export interface Subtopic {
  icon_url: string;
  name: string;
  topic_id: string;
}

export interface Category {
  icon: string;
  name: string;
  semantic_core_entity_id: string;
  subtopics: Subtopic[];
}

export interface BrowseSpaceTopics {
  categories: Category[];
}

export interface BrowseSpaceTopicsResponse {
  data: {
    browse_space_topics: BrowseSpaceTopics;
  };
  errors?: any[];
}

export interface CreatorResult {
  __typename: string;
  id: string;
  rest_id: string;
  affiliates_highlighted_label: Record<string, any>;
  has_graduated_access: boolean;
  is_blue_verified: boolean;
  profile_image_shape: string;
  legacy: {
    following: boolean;
    can_dm: boolean;
    can_media_tag: boolean;
    created_at: string;
    default_profile: boolean;
    default_profile_image: boolean;
    description: string;
    entities: {
      description: {
        urls: any[];
      };
    };
    fast_followers_count: number;
    favourites_count: number;
    followers_count: number;
    friends_count: number;
    has_custom_timelines: boolean;
    is_translator: boolean;
    listed_count: number;
    location: string;
    media_count: number;
    name: string;
    needs_phone_verification: boolean;
    normal_followers_count: number;
    pinned_tweet_ids_str: string[];
    possibly_sensitive: boolean;
    profile_image_url_https: string;
    profile_interstitial_type: string;
    screen_name: string;
    statuses_count: number;
    translator_type: string;
    verified: boolean;
    want_retweets: boolean;
    withheld_in_countries: string[];
  };
  tipjar_settings: Record<string, any>;
}

export interface UserResults {
  rest_id: string;
  result: {
    __typename: string;
    identity_profile_labels_highlighted_label: Record<string, any>;
    is_blue_verified: boolean;
    legacy: Record<string, any>;
  };
}

export interface Admin {
  periscope_user_id: string;
  start: number;
  twitter_screen_name: string;
  display_name: string;
  avatar_url: string;
  is_verified: boolean;
  is_muted_by_admin: boolean;
  is_muted_by_guest: boolean;
  user_results: UserResults;
}

export interface Participants {
  total: number;
  admins: Admin[];
  speakers: any[];
  listeners: any[];
}

export interface Metadata {
  rest_id: string;
  state: string;
  media_key: string;
  created_at: number;
  started_at: number;
  ended_at: string;
  updated_at: number;
  content_type: string;
  creator_results: {
    result: CreatorResult;
  };
  conversation_controls: number;
  disallow_join: boolean;
  is_employee_only: boolean;
  is_locked: boolean;
  is_muted: boolean;
  is_space_available_for_clipping: boolean;
  is_space_available_for_replay: boolean;
  narrow_cast_space_type: number;
  no_incognito: boolean;
  total_replay_watched: number;
  total_live_listeners: number;
  tweet_results: Record<string, any>;
  max_guest_sessions: number;
  max_admin_capacity: number;
}

export interface Sharings {
  items: any[];
  slice_info: Record<string, any>;
}

export interface AudioSpace {
  metadata: Metadata;
  is_subscribed: boolean;
  participants: Participants;
  sharings: Sharings;
}

export interface AudioSpaceByIdResponse {
  data: {
    audioSpace: AudioSpace;
  };
  errors?: any[];
}

export interface AudioSpaceByIdVariables {
  id: string;
  isMetatagsQuery: boolean;
  withReplays: boolean;
  withListeners: boolean;
}

export interface LiveVideoSource {
  location: string;
  noRedirectPlaybackUrl: string;
  status: string;
  streamType: string;
}

export interface LiveVideoStreamStatus {
  source: LiveVideoSource;
  sessionId: string;
  chatToken: string;
  lifecycleToken: string;
  shareUrl: string;
  chatPermissionType: string;
}

export interface AuthenticatePeriscopeResponse {
  data: {
    authenticate_periscope: string;
  };
  errors?: any[];
}

export interface LoginTwitterTokenResponse {
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

## Platform Types

```typescript
export interface PlatformExtensions {
  randomizeCiphers(): Promise<void>;
}

export const genericPlatform = new (class implements PlatformExtensions {
  randomizeCiphers(): Promise<void> {
    return Promise.resolve();
  }
})();
```

## Error Types

```typescript
export class ApiError extends Error {
  private constructor(
    readonly response: Response,
    readonly data: any,
    message: string,
  ) {
    super(message);
  }

  static async fromResponse(response: Response) {
    let data: string | object | undefined = undefined;
    try {
      data = await response.json();
    } catch {
      try {
        data = await response.text();
      } catch {}
    }

    return new ApiError(response, data, `Response status: ${response.status}`);
  }
}

export interface TwitterApiErrorRaw {
  message?: string;
  locations?: Position[];
  path?: string[];
  extensions?: TwitterApiErrorExtensions;
  code?: number;
  kind?: string;
  name?: string;
  source?: string;
  tracing?: TraceInfo;
}
```

## Utility Types

```typescript
export type NonNullableField<T, K extends keyof T> = {
  [P in K]-?: T[P];
} & T;

export function isFieldDefined<T, K extends keyof T>(key: K) {
  return function (value: T): value is NonNullableField<T, K> {
    return isDefined(value[key]);
  };
}

export function isDefined<T>(value: T | null | undefined): value is T {
  return value != null;
}
```

## Classes

```typescript
export class Scraper {
  constructor(options?: Partial<ScraperOptions>);
  // ... all scraper methods
}

export class TwitterGuestAuth implements TwitterAuth {
  constructor(bearerToken: string, options?: Partial<TwitterAuthOptions>);
  // ... all auth methods
}

export class TwitterUserAuth extends TwitterGuestAuth {
  constructor(bearerToken: string, options?: Partial<TwitterAuthOptions>);
  // ... all user auth methods
}

export class Space extends EventEmitter {
  constructor(scraper: Scraper, options?: { debug?: boolean });
  // ... all space methods
}

export class ChatClient extends EventEmitter {
  constructor(config: ChatClientConfig);
  // ... all chat client methods
}

export class JanusClient extends EventEmitter {
  constructor(config: JanusConfig);
  // ... all janus client methods
}

export class JanusAudioSource extends EventEmitter {
  constructor(options?: AudioSourceOptions);
  // ... all audio source methods
}

export class JanusAudioSink extends EventEmitter {
  constructor(track: MediaStreamTrack, options?: AudioSinkOptions);
  // ... all audio sink methods
}

export class Logger {
  constructor(debugEnabled: boolean);
  // ... all logger methods
}

export class Platform implements PlatformExtensions {
  async randomizeCiphers(): Promise<void>;
}

// Plugin Classes
export class SttTtsPlugin implements Plugin {
  constructor(config?: PluginConfig);
  // ... all plugin methods
}

export class RecordToDiskPlugin implements Plugin {
  // ... all plugin methods
}

export class MonitorAudioPlugin implements Plugin {
  constructor(sampleRate?: number);
  // ... all plugin methods
}

export class IdleMonitorPlugin implements Plugin {
  constructor(idleTimeoutMs?: number, checkEveryMs?: number);
  // ... all plugin methods
}

export class HlsRecordPlugin implements Plugin {
  constructor(outputPath?: string);
  // ... all plugin methods
}
```

## Raw Timeline Types (V1)

```typescript
export interface Hashtag {
  text?: string;
}

export interface TimelineUserMentionBasicRaw {
  id_str?: string;
  name?: string;
  screen_name?: string;
}

export interface TimelineMediaBasicRaw {
  media_url_https?: string;
  type?: string;
  url?: string;
}

export interface TimelineUrlBasicRaw {
  expanded_url?: string;
  url?: string;
}

export interface ExtSensitiveMediaWarningRaw {
  adult_content?: boolean;
  graphic_violence?: boolean;
  other?: boolean;
}

export interface VideoVariant {
  bitrate?: number;
  url?: string;
}

export interface VideoInfo {
  variants?: VideoVariant[];
}

export interface TimelineMediaExtendedRaw {
  id_str?: string;
  media_url_https?: string;
  ext_sensitive_media_warning?: ExtSensitiveMediaWarningRaw;
  type?: string;
  url?: string;
  video_info?: VideoInfo;
  ext_alt_text: string | undefined;
}

export interface SearchResultRaw {
  rest_id?: string;
  __typename?: string;
  core?: {
    user_results?: {
      result?: {
        is_blue_verified?: boolean;
        legacy?: LegacyUserRaw;
      };
    };
  };
  views?: {
    count?: string;
  };
  note_tweet?: {
    note_tweet_results?: {
      result?: {
        text?: string;
      };
    };
  };
  quoted_status_result?: {
    result?: SearchResultRaw;
  };
  legacy?: LegacyTweetRaw;
}

export interface TimelineArticleResultRaw {
  id?: string;
  rest_id?: string;
  title?: string;
  preview_text?: string;
  cover_media?: {
    media_id?: string;
    media_info?: {
      original_img_url?: string;
      original_img_height?: number;
      original_img_width?: number;
    };
  };
  content_state?: {
    blocks?: {
      key?: string;
      data?: string;
      text?: string;
      entityRanges?: {
        key?: number;
        length?: number;
        offset?: number;
      }[];
    }[];
  };
  entityMap?: {
    key?: string;
    value?: {
      type?: string; // LINK, MEDIA, TWEET
      mutability?: string;
      data?: {
        entityKey?: string;
        url?: string;
        tweetId?: string;
        mediaItems?: {
          localMediaId?: string;
          mediaCategory?: string;
          mediaId?: string;
        }[];
      };
    };
  }[];
}

export interface TimelineResultRaw {
  rest_id?: string;
  __typename?: string;
  core?: {
    user_results?: {
      result?: {
        is_blue_verified?: boolean;
        legacy?: LegacyUserRaw;
      };
    };
  };
  views?: {
    count?: string;
  };
  note_tweet?: {
    note_tweet_results?: {
      result?: {
        text?: string;
      };
    };
  };
  article?: {
    article_results?: {
      result?: TimelineArticleResultRaw;
    };
  };
  quoted_status_result?: {
    result?: TimelineResultRaw;
  };
  legacy?: LegacyTweetRaw;
  tweet?: TimelineResultRaw;
}

export interface LegacyTweetRaw {
  bookmark_count?: number;
  conversation_id_str?: string;
  created_at?: string;
  favorite_count?: number;
  full_text?: string;
  entities?: {
    hashtags?: Hashtag[];
    media?: TimelineMediaBasicRaw[];
    urls?: TimelineUrlBasicRaw[];
    user_mentions?: TimelineUserMentionBasicRaw[];
  };
  extended_entities?: {
    media?: TimelineMediaExtendedRaw[];
  };
  id_str?: string;
  in_reply_to_status_id_str?: string;
  place?: PlaceRaw;
  reply_count?: number;
  retweet_count?: number;
  retweeted_status_id_str?: string;
  retweeted_status_result?: {
    result?: TimelineResultRaw;
  };
  quoted_status_id_str?: string;
  time?: string;
  user_id_str?: string;
  ext_views?: {
    state?: string;
    count?: string;
  };
}

export interface TimelineGlobalObjectsRaw {
  tweets?: { [key: string]: LegacyTweetRaw | undefined };
  users?: { [key: string]: LegacyUserRaw | undefined };
}

export interface TimelineDataRawCursor {
  value?: string;
  cursorType?: string;
}

export interface TimelineDataRawEntity {
  id?: string;
}

export interface TimelineDataRawModuleItem {
  clientEventInfo?: {
    details?: {
      guideDetails?: {
        transparentGuideDetails?: {
          trendMetadata?: {
            trendName?: string;
          };
        };
      };
    };
  };
}

export interface TimelineDataRawAddEntry {
  content?: {
    item?: {
      content?: {
        tweet?: TimelineDataRawEntity;
        user?: TimelineDataRawEntity;
      };
    };
    operation?: {
      cursor?: TimelineDataRawCursor;
    };
    timelineModule?: {
      items?: {
        item?: TimelineDataRawModuleItem;
      }[];
    };
  };
}

export interface TimelineDataRawPinEntry {
  content?: {
    item?: {
      content?: {
        tweet?: TimelineDataRawEntity;
      };
    };
  };
}

export interface TimelineDataRawReplaceEntry {
  content?: {
    operation?: {
      cursor?: TimelineDataRawCursor;
    };
  };
}

export interface TimelineDataRawInstruction {
  addEntries?: {
    entries?: TimelineDataRawAddEntry[];
  };
  pinEntry?: {
    entry?: TimelineDataRawPinEntry;
  };
  replaceEntry?: {
    entry?: TimelineDataRawReplaceEntry;
  };
}

export interface TimelineDataRaw {
  instructions?: TimelineDataRawInstruction[];
}

export interface TimelineV1 {
  globalObjects?: TimelineGlobalObjectsRaw;
  timeline?: TimelineDataRaw;
}
```

## Raw Timeline Types (V2)

```typescript
export interface TimelineUserResultRaw {
  rest_id?: string;
  legacy?: LegacyUserRaw;
  is_blue_verified?: boolean;
}

export interface TimelineEntryItemContentRaw {
  itemType?: string;
  tweetDisplayType?: string;
  tweetResult?: {
    result?: TimelineResultRaw;
  };
  tweet_results?: {
    result?: TimelineResultRaw;
  };
  userDisplayType?: string;
  user_results?: {
    result?: TimelineUserResultRaw;
  };
}

export interface TimelineEntryRaw {
  entryId: string;
  content?: {
    cursorType?: string;
    value?: string;
    items?: {
      entryId?: string;
      item?: {
        content?: TimelineEntryItemContentRaw;
        itemContent?: SearchEntryItemContentRaw;
      };
    }[];
    itemContent?: TimelineEntryItemContentRaw;
  };
}

export interface SearchEntryItemContentRaw {
  tweetDisplayType?: string;
  tweet_results?: {
    result?: SearchResultRaw;
  };
  userDisplayType?: string;
  user_results?: {
    result?: TimelineUserResultRaw;
  };
}

export interface SearchEntryRaw {
  entryId: string;
  sortIndex: string;
  content?: {
    cursorType?: string;
    entryType?: string;
    __typename?: string;
    value?: string;
    items?: {
      item?: {
        content?: SearchEntryItemContentRaw;
      };
    }[];
    itemContent?: SearchEntryItemContentRaw;
  };
}

export interface TimelineInstruction {
  entries?: TimelineEntryRaw[];
  entry?: TimelineEntryRaw;
  type?: string;
}

export interface TimelineV2 {
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

export interface ThreadedConversation {
  data?: {
    threaded_conversation_with_injections_v2?: {
      instructions?: TimelineInstruction[];
    };
  };
}

export interface TimelineArticle {
  id: string;
  articleId: string;
  title: string;
  previewText: string;
  coverMediaUrl?: string;
  text: string;
}
```

## Relationship Types

```typescript
export interface RelationshipEntryItemContentRaw {
  itemType?: string;
  userDisplayType?: string;
  user_results?: {
    result?: TimelineUserResultRaw;
  };
}

export interface RelationshipEntryRaw {
  entryId: string;
  sortIndex: string;
  content?: {
    cursorType?: string;
    entryType?: string;
    __typename?: string;
    value?: string;
    itemContent?: RelationshipEntryItemContentRaw;
  };
}

export interface RelationshipTimeline {
  data?: {
    user?: {
      result?: {
        timeline?: {
          timeline?: {
            instructions?: {
              entries?: RelationshipEntryRaw[];
              entry?: RelationshipEntryRaw;
              type?: string;
            }[];
          };
        };
      };
    };
  };
}
```

## Constants

```typescript
export const bearerToken = 'AAAAAAAAAAAAAAAAAAAAAFQODgEAAAAAVHTp76lzh3rFzcHbmHVvQxYYpTw%3DckAlMINMjmCwxUcaXbAN4XqJVdgMJaHqNOFgPMK0zN1qLqLQCF';

export const genericPlatform = new (class implements PlatformExtensions {
  randomizeCiphers(): Promise<void> {
    return Promise.resolve();
  }
})();
```

## Usage Examples

### Basic Tweet Operations
```typescript
import { Scraper, Tweet, Profile } from 'twitter-api-library';

const scraper = new Scraper();
const tweets: Tweet[] = [];
for await (const tweet of scraper.getTweets('username', 100)) {
  tweets.push(tweet);
}
```

### Profile Operations
```typescript
import { Profile } from 'twitter-api-library';

const profile: Profile = await scraper.getProfile('username');
console.log(profile.name, profile.followersCount);
```

### Spaces Operations
```typescript
import { Space, SpaceConfig, SttTtsPlugin } from 'twitter-api-library';

const space = new Space(scraper);
space.use(new SttTtsPlugin({
  openAiApiKey: 'your-key',
  elevenLabsApiKey: 'your-key'
}));

await space.initialize({
  mode: 'BROADCAST',
  title: 'My Space'
});
```

### Direct Messages
```typescript
import { DirectMessage, DirectMessageConversation } from 'twitter-api-library';

const conversations = await scraper.getDirectMessageConversations(userId);
conversations.conversations.forEach((conv: DirectMessageConversation) => {
  conv.messages.forEach((msg: DirectMessage) => {
    console.log(msg.text);
  });
});
```

### Search Operations
```typescript
import { SearchMode } from 'twitter-api-library';

const tweets = scraper.searchTweets('query', 50, SearchMode.Latest);
for await (const tweet of tweets) {
  console.log(tweet.text);
}
```

## Summary

This library provides comprehensive TypeScript type definitions for:

- **124+ exported types** including interfaces, classes, enums, and type aliases
- **Core Twitter functionality** - tweets, profiles, timelines, search
- **Authentication systems** - guest, user, and API key authentication
- **Direct messaging** - conversations and message handling
- **Spaces (audio conversations)** - complete audio streaming system with plugins
- **Platform abstraction** - cross-platform compatibility
- **Error handling** - comprehensive error types
- **Plugin architecture** - extensible plugin system for Spaces

All types are fully typed with TypeScript and provide excellent IntelliSense support for development.
