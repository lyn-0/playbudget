// sw.js - Service Worker（オフライン対応）
// ネットワーク優先でファイルを取得し、オフライン時のみキャッシュを使います

const CACHE_NAME = 'yenly-v5'; // ★更新のたびに番号を上げる

// キャッシュするファイル一覧
const FILES_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
];

// インストール時：キャッシュを保存
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// アクティベート時：古いキャッシュを削除
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// リクエスト時：ネットワーク優先、失敗したらキャッシュ（オフライン対応）
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(res => {
        // 取得成功したらキャッシュも更新しておく
        const resClone = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, resClone)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});
