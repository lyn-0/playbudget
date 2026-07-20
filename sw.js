// sw.js - Service Worker（オフライン対応）
// アプリのファイルをキャッシュして、インターネットなしでも動作するようにします

const CACHE_NAME = 'playbudget-v1';

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

// リクエスト時：キャッシュ優先、なければネットワーク
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
