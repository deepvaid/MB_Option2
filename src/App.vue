<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useDisplay } from 'vuetify'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppBar from '@/components/layout/AppBar.vue'
import MpDaVinciBot from '@/components/MpDaVinciBot.vue'

const route = useRoute()
const drawer = ref(true)
const rail = ref(false)
const copilotOpen = ref(false)
const copilotExpanded = ref(false)
const { smAndDown } = useDisplay()

const isFullPage = computed(() => !!route.meta?.fullPage)
const sidebarRail = computed(() => smAndDown.value || rail.value)
</script>

<template>
  <v-app>
    <a v-if="!isFullPage" href="#main-content" class="skip-link">Skip to main content</a>

    <AppSidebar
      v-if="!isFullPage"
      v-model="drawer"
      :rail="sidebarRail"
      @update:rail="rail = $event"
    />

    <AppBar v-if="!isFullPage" v-model:copilot-open="copilotOpen" />

    <v-main
      id="main-content"
      role="main"
      tabindex="-1"
      :style="{ background: 'rgb(var(--v-theme-background))' }"
    >
      <v-container v-if="!isFullPage" fluid class="mp-main-shell">
        <router-view />
      </v-container>
      <router-view v-else />
    </v-main>

    <!-- Da Vinci Copilot Drawer -->
    <v-navigation-drawer
      v-if="!isFullPage"
      v-model="copilotOpen"
      location="right"
      :width="copilotExpanded ? 800 : 430"
      class="copilot-drawer"
      style="transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1); border-left: 1px solid rgba(0,0,0,0.08);"
    >
      <MpDaVinciBot
        @close="copilotOpen = false"
        @expand="copilotExpanded = !copilotExpanded"
      />
    </v-navigation-drawer>
  </v-app>
</template>

<style>
.skip-link {
  position: absolute;
  left: 16px;
  top: -48px;
  z-index: 1000;
  padding: 10px 14px;
  border-radius: 999px;
  background: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
  font-weight: 600;
  transition: top 0.2s ease;
}

.skip-link:focus {
  top: 16px;
}

.mp-main-shell {
  padding: 28px 32px !important;
}

@media (max-width: 1024px) {
  .mp-main-shell {
    padding: 24px !important;
  }
}

@media (max-width: 640px) {
  .mp-main-shell {
    padding: 20px !important;
  }
}

.copilot-drawer .v-navigation-drawer__content {
  display: flex;
  flex-direction: column;
  overflow: hidden !important;
}
</style>
