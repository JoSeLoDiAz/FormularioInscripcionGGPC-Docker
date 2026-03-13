<template>
  <div class="app-container">
    <!-- SIEMPRE montado: overlay global -->
    <GlobalLoader />

    <AppHeader />
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade-page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import AppFooter from './components/AppFooter.vue';
import AppHeader from './components/AppHeader.vue';
import GlobalLoader from './components/GlobalLoader.vue';
</script>
