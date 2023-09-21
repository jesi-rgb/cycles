<script>
  import "$lib/css/main.css";
</script>

<svelte:head>
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
  <link rel="manifest" href="/site.webmanifest" />
  <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#ffb86b" />
  <meta name="apple-mobile-web-app-title" content="Cycles" />
  <meta name="application-name" content="Cycles" />
  <meta name="msapplication-TileColor" content="#da532c" />
  <meta name="theme-color" content="#FFB86B" />

  <meta name="author" content="Jesús Rascón" />
  <meta name="description" content="A little helper for your cyclic needs" />

  <meta property="og:title" content="Cycles" />
  <meta property="og:type" content="app" />
  <meta property="og:url" content="https://cycles-sup.vercel.app/" />
  <meta
    property="og:description"
    content="A little helper for your cyclic needs"
  />
</svelte:head>

<slot />
