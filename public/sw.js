if(!self.define){let e,s={};const n=(n,a)=>(n=new URL(n+".js",a).href,s[n]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=s,document.head.appendChild(e)}else e=n,importScripts(n),s()})).then((()=>{let e=s[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(a,i)=>{const c=e||("document"in self?document.currentScript.src:"")||location.href;if(s[c])return;let t={};const r=e=>n(e,c),o={module:{uri:c},exports:t,require:r};s[c]=Promise.all(a.map((e=>o[e]||r(e)))).then((e=>(i(...e),t)))}}define(["./workbox-e9849328"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/app-build-manifest.json",revision:"24d30a418458aa4fb483b5ee078c90e6"},{url:"/_next/static/chunks/486-6a6a1ebab405054e.js",revision:"nDC77rM0lFoQHvRYuGwhI"},{url:"/_next/static/chunks/644-fb63e2dc6716dbf9.js",revision:"nDC77rM0lFoQHvRYuGwhI"},{url:"/_next/static/chunks/651-337b0cf207a79cb8.js",revision:"nDC77rM0lFoQHvRYuGwhI"},{url:"/_next/static/chunks/77-04c9c19e29569a2f.js",revision:"nDC77rM0lFoQHvRYuGwhI"},{url:"/_next/static/chunks/8eb6f11a-1a3ef6cfaa352fd7.js",revision:"nDC77rM0lFoQHvRYuGwhI"},{url:"/_next/static/chunks/910-dc1436eeb8aade9f.js",revision:"nDC77rM0lFoQHvRYuGwhI"},{url:"/_next/static/chunks/959-890be98012b08f69.js",revision:"nDC77rM0lFoQHvRYuGwhI"},{url:"/_next/static/chunks/app/(default)/layout-013866d131dd6c5f.js",revision:"nDC77rM0lFoQHvRYuGwhI"},{url:"/_next/static/chunks/app/(default)/page-f8b1f1d4c19d1fd9.js",revision:"nDC77rM0lFoQHvRYuGwhI"},{url:"/_next/static/chunks/app/(van-gogh)/layout-beec3d51cb40d0fb.js",revision:"nDC77rM0lFoQHvRYuGwhI"},{url:"/_next/static/chunks/app/(van-gogh)/van-gogh/%5B%5B...slug%5D%5D/page-707c2115451b0ff4.js",revision:"nDC77rM0lFoQHvRYuGwhI"},{url:"/_next/static/chunks/app/_not-found/page-34ccba73beca9a4f.js",revision:"nDC77rM0lFoQHvRYuGwhI"},{url:"/_next/static/chunks/framework-49eb87332e63c800.js",revision:"nDC77rM0lFoQHvRYuGwhI"},{url:"/_next/static/chunks/main-159f526dc01d3fbc.js",revision:"nDC77rM0lFoQHvRYuGwhI"},{url:"/_next/static/chunks/main-app-a5e539f8eef165b6.js",revision:"nDC77rM0lFoQHvRYuGwhI"},{url:"/_next/static/chunks/pages/_app-c92f4a4f65378a1b.js",revision:"nDC77rM0lFoQHvRYuGwhI"},{url:"/_next/static/chunks/pages/_error-9703bacb1b6c266d.js",revision:"nDC77rM0lFoQHvRYuGwhI"},{url:"/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/_next/static/chunks/webpack-064d9d4eba221c70.js",revision:"nDC77rM0lFoQHvRYuGwhI"},{url:"/_next/static/css/146155eb45431465.css",revision:"146155eb45431465"},{url:"/_next/static/css/1f0be70ed1be5214.css",revision:"1f0be70ed1be5214"},{url:"/_next/static/media/26a46d62cd723877-s.woff2",revision:"befd9c0fdfa3d8a645d5f95717ed6420"},{url:"/_next/static/media/55c55f0601d81cf3-s.woff2",revision:"43828e14271c77b87e3ed582dbff9f74"},{url:"/_next/static/media/581909926a08bbc8-s.woff2",revision:"f0b86e7c24f455280b8df606b89af891"},{url:"/_next/static/media/6d93bde91c0c2823-s.woff2",revision:"621a07228c8ccbfd647918f1021b4868"},{url:"/_next/static/media/97e0cb1ae144a2a9-s.woff2",revision:"e360c61c5bd8d90639fd4503c829c2dc"},{url:"/_next/static/media/a34f9d1faa5f3315-s.p.woff2",revision:"d4fe31e6a2aebc06b8d6e558c9141119"},{url:"/_next/static/media/df0a9ae256c0569c-s.woff2",revision:"d54db44de5ccb18886ece2fda72bdfe0"},{url:"/_next/static/nDC77rM0lFoQHvRYuGwhI/_buildManifest.js",revision:"72b05645203d4292455e859689d9167b"},{url:"/_next/static/nDC77rM0lFoQHvRYuGwhI/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/file.svg",revision:"d09f95206c3fa0bb9bd9fefabfd0ea71"},{url:"/globe.svg",revision:"2aaafa6a49b6563925fe440891e32717"},{url:"/icon-192x192.png",revision:"66183d10a63561f755a7bef5e248b186"},{url:"/icon-512x512.png",revision:"5bda8dd5d6649d7e99ebd39a12f1d860"},{url:"/manifest.json",revision:"7938cabfec6059669478b4f06695a8ec"},{url:"/next.svg",revision:"8e061864f388b47f33a1c3780831193e"},{url:"/van-gogh/en-GB_rooms.json",revision:"3da49d903d7de0f7742dfcebfb3e58d8"},{url:"/van-gogh/p21.png",revision:"84d578c77a5d201fe26dfacd65c693e4"},{url:"/van-gogh/p27.png",revision:"4491c5071268e7e721bbcb74edd51bad"},{url:"/van-gogh/p33.png",revision:"77e3c5ff937ef111fd3e3cdbfd5cd957"},{url:"/van-gogh/p44.png",revision:"26e0b2aba3d4c72e4cd0fcf72352a152"},{url:"/van-gogh/p8.png",revision:"c3fdacdcc80d10705a970714aa1b7104"},{url:"/van-gogh/r3.png",revision:"8f0ba11fbc77156fa55433977cff6692"},{url:"/van-gogh/r6.png",revision:"3650e0fcf1e8bcb6c0eed5807d1a2389"},{url:"/van-gogh/zh-TW_rooms.json",revision:"5eb806ab566df23290b9a74858a26dca"},{url:"/vercel.svg",revision:"c0af2f507b369b085b35ef4bbe3bcf1e"},{url:"/window.svg",revision:"a2760511c65806022ad20adf74370ff3"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:n,state:a})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));