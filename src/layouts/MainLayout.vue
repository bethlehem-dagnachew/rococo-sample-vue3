<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
          v-if="authStore.isAuthenticated"
        />

        <q-toolbar-title> Rococo Sample </q-toolbar-title>

        <div v-if="authStore.isAuthenticated" class="cursor-pointer">
          Logged in as
          <b>{{ authStore.user.first_name }} {{ authStore.user.last_name }}</b>
          <q-icon size="xs" name="arrow_drop_down" />
          <q-menu fir anchor="bottom right" self="top right">
            <q-list style="min-width: 100px">
              <q-item clickable v-close-popup>
                <q-item-section @click="router.push('/profile')">Profile</q-item-section>
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section @click="authStore.logout()">Logout</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-if="authStore.isAuthenticated"
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-grey-1"
    >
      <q-scroll-area class="fit">
        <q-list padding class="menu-list">
          <q-item-label header class="text-primary">Navigation</q-item-label>

          <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view class="q-pa-md" />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
import { useAuthStore } from 'stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const linksList = [
  {
    title: 'Dashboard',
    icon: 'dashboard',
    link: '/dashboard',
  },
  {
    title: 'Profile',
    icon: 'person',
    link: '/profile',
  },
  {
    title: 'Todos',
    icon: 'task_alt',
    link: '/todo-list',
  },
]

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

<style lang="scss" scoped>
// Styles moved to app.scss
</style>
