/**
 * oEmbed API リクエストパラメータ
 * 消費者（Consumer）がプロバイダー（Provider）に送信するクエリパラメータの定義
 */
export interface OEmbedRequestParams {
  /** 埋め込み情報を取得したい対象のコンテンツURL（必須） */
  url: string;
  
  /** 埋め込みリソースの最大幅（ピクセル単位、任意） */
  maxwidth?: number;
  
  /** 埋め込みリソースの最大高さ（ピクセル単位、任意） */
  maxheight?: number;
  
  /** レスポンス形式。未指定時はプロバイダーのデフォルト（任意） */
  format?: 'json' | 'xml';
  
  /** プロバイダー固有の追加カスタムパラメータ */
  [key: string]: any;
}

/**
 * すべての oEmbed レスポンスタイプに共通するベース定義
 */
interface OEmbedBaseResponse {
  /** oEmbedのバージョン。現行仕様では "1.0" 固定 */
  version: '1.0' | string;
  
  /** リソースのタイトル（任意） */
  title?: string;
  
  /** リソースの制作者・所有者名（任意） */
  author_name?: string;
  
  /** リソースの制作者・所有者のWebサイトURL（任意） */
  author_url?: string;
  
  /** リソース提供元のサービス名（任意） */
  provider_name?: string;
  
  /** リソース提供元のWebサイトURL（任意） */
  provider_url?: string;
  
  /** キャッシュの有効期限（秒単位、任意） */
  cache_age?: number;
  
  /** サムネイル画像のURL（サムネイルを返す場合は必須） */
  thumbnail_url?: string;
  
  /** サムネイル画像の幅（thumbnail_url がある場合は必須） */
  thumbnail_width?: number;
  
  /** サムネイル画像の高さ（thumbnail_url がある場合は必須） */
  thumbnail_height?: number;
}

/**
 * 静的写真（画像）タイプ
 */
export interface OEmbedPhotoResponse extends OEmbedBaseResponse {
  type: 'photo';
  
  /** 画像のソースURL。 <img> タグのsrcにそのまま設定可能（必須） */
  url: string;
  
  /** 画像の幅（ピクセル単位、必須） */
  width: number;
  
  /** 画像の高さ（ピクセル単位、必須） */
  height: number;
}

/**
 * 再生可能な動画タイプ
 */
export interface OEmbedVideoResponse extends OEmbedBaseResponse {
  type: 'video';
  
  /** 動画プレーヤーを埋め込むためのHTMLコード。余白（padding/margin）なし（必須） */
  html: string;
  
  /** 埋め込みHTMLを表示するために必要な幅（ピクセル単位、必須） */
  width: number;
  
  /** 埋め込みHTMLを表示するために必要な高さ（ピクセル単位、必須） */
  height: number;
}

/**
 * 汎用リンクタイプ
 * `url` や `html` を提供せず、元リクエストのURLへのリンク生成用にメタデータのみを返す場合に利用されます。
 */
export interface OEmbedLinkResponse extends OEmbedBaseResponse {
  type: 'link';
}

/**
 * リッチHTMLコンテンツタイプ
 * ビデオに当てはまらない、動的または装飾的なHTMLパーツ（ウィジェットなど）を表示する場合に使用します。
 */
export interface OEmbedRichResponse extends OEmbedBaseResponse {
  type: 'rich';
  
  /** 表示に必要なリッチHTMLコード。余白なし（必須） */
  html: string;
  
  /** 表示に必要な幅（ピクセル単位、必須） */
  width: number;
  
  /** 表示に必要な高さ（ピクセル単位、必須） */
  height: number;
}

/**
 * oEmbed レスポンスのユニオン型
 * typeフィールドの値によって自動的に型推論（Narrowing）が効くようになります。
 */
export type OEmbedResponse =
  | OEmbedPhotoResponse
  | OEmbedVideoResponse
  | OEmbedLinkResponse
  | OEmbedRichResponse;
