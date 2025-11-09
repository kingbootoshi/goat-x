import { DEFAULT_USER_AGENT, requestApi } from './api';
import { TwitterAuth } from './auth';
import { Profile } from './profile';
import { QueryProfilesResponse, QueryTweetsResponse } from './timeline-v1';
import { getTweetTimeline, getUserTimeline } from './timeline-async';
import { Tweet } from './tweets';
import {
  SearchTimeline,
  parseSearchTimelineTweets,
  parseSearchTimelineUsers,
} from './timeline-search';
import stringify from 'json-stable-stringify';

/**
 * The categories that can be used in Twitter searches.
 */
export enum SearchMode {
  Top,
  Latest,
  Photos,
  Videos,
  Users,
}

export function searchTweets(
  query: string,
  maxTweets: number,
  searchMode: SearchMode,
  auth: TwitterAuth,
): AsyncGenerator<Tweet, void> {
  return getTweetTimeline(query, maxTweets, (q, mt, c) => {
    return fetchSearchTweets(q, mt, searchMode, auth, c);
  });
}

export function searchProfiles(
  query: string,
  maxProfiles: number,
  auth: TwitterAuth,
): AsyncGenerator<Profile, void> {
  return getUserTimeline(query, maxProfiles, (q, mt, c) => {
    return fetchSearchProfiles(q, mt, auth, c);
  });
}

export async function fetchSearchTweets(
  query: string,
  maxTweets: number,
  searchMode: SearchMode,
  auth: TwitterAuth,
  cursor?: string,
): Promise<QueryTweetsResponse> {
  const timeline = await getSearchTimeline(
    query,
    maxTweets,
    searchMode,
    auth,
    cursor,
  );

  return parseSearchTimelineTweets(timeline);
}

export async function fetchSearchProfiles(
  query: string,
  maxProfiles: number,
  auth: TwitterAuth,
  cursor?: string,
): Promise<QueryProfilesResponse> {
  const timeline = await getSearchTimeline(
    query,
    maxProfiles,
    SearchMode.Users,
    auth,
    cursor,
  );

  return parseSearchTimelineUsers(timeline);
}

async function getSearchTimeline(
  query: string,
  maxItems: number,
  searchMode: SearchMode,
  auth: TwitterAuth,
  cursor?: string,
): Promise<SearchTimeline> {
  if (!auth.isLoggedIn()) {
    throw new Error('Scraper is not logged-in for search.');
  }

  if (maxItems > 50) {
    maxItems = 50;
  }

  const variables: Record<string, any> = {
    rawQuery: query,
    count: maxItems,
    querySource: 'typed_query',
    product: 'Top',
    withGrokTranslatedBio: false,
  };

  const features = {
    rweb_video_screen_enabled: false,
    payments_enabled: false,
    profile_label_improvements_pcf_label_in_post_enabled: true,
    responsive_web_profile_redirect_enabled: false,
    rweb_tipjar_consumption_enabled: true,
    verified_phone_label_enabled: false,
    creator_subscriptions_tweet_preview_api_enabled: true,
    responsive_web_graphql_timeline_navigation_enabled: true,
    responsive_web_graphql_skip_user_profile_image_extensions_enabled: false,
    premium_content_api_read_enabled: false,
    communities_web_enable_tweet_community_results_fetch: true,
    c9s_tweet_anatomy_moderator_badge_enabled: true,
    responsive_web_grok_analyze_button_fetch_trends_enabled: false,
    responsive_web_grok_analyze_post_followups_enabled: true,
    responsive_web_jetfuel_frame: true,
    responsive_web_grok_share_attachment_enabled: true,
    articles_preview_enabled: true,
    responsive_web_edit_tweet_api_enabled: true,
    graphql_is_translatable_rweb_tweet_is_translatable_enabled: true,
    view_counts_everywhere_api_enabled: true,
    longform_notetweets_consumption_enabled: true,
    responsive_web_twitter_article_tweet_consumption_enabled: true,
    tweet_awards_web_tipping_enabled: false,
    responsive_web_grok_show_grok_translated_post: true,
    responsive_web_grok_analysis_button_from_backend: true,
    creator_subscriptions_quote_tweet_preview_enabled: false,
    freedom_of_speech_not_reach_fetch_enabled: true,
    standardized_nudges_misinfo: true,
    tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled: true,
    longform_notetweets_rich_text_read_enabled: true,
    longform_notetweets_inline_media_enabled: true,
    responsive_web_grok_image_annotation_enabled: true,
    responsive_web_grok_imagine_annotation_enabled: true,
    responsive_web_grok_community_note_auto_translation_is_enabled: false,
    responsive_web_enhance_cards_enabled: false,
  };

  if (cursor != null && cursor != '') {
    variables['cursor'] = cursor;
  }

  switch (searchMode) {
    case SearchMode.Latest:
      variables.product = 'Latest';
      break;
    case SearchMode.Photos:
      variables.product = 'Photos';
      break;
    case SearchMode.Videos:
      variables.product = 'Videos';
      break;
    case SearchMode.Users:
      variables.product = 'People';
      break;
    default:
      break;
  }

  const params = new URLSearchParams();
  params.set('features', stringify(features) ?? '');
  params.set('variables', stringify(variables) ?? '');

  const referer = `https://x.com/search?q=${encodeURIComponent(query)}&src=typed_query`;

  const res = await requestApi<SearchTimeline>(
    `https://x.com/i/api/graphql/7r8ibjHuK3MWUyzkzHNMYQ/SearchTimeline?${params.toString()}`,
    auth,
    'GET',
    {
      headers: {
        Referer: referer,
        'User-Agent': DEFAULT_USER_AGENT,
      },
    },
  );

  if (!res.success) {
    throw res.err;
  }

  return res.value;
}
