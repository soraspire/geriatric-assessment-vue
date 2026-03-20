<template>
  <div id="app">
    <!-- Main Layout Container -->
    <div :class="{ 'dashboard-layout': isManagementPage }">
      
      <!-- Sidebar only for Management Page -->
      <aside v-if="isManagementPage" class="sidebar">
        <div class="sidebar-header">
          DASHBOARD
        </div>
        <nav class="nav-menu">
          <router-link to="/assessments/management" class="nav-item" active-class="active">
            Quản lý phiếu
          </router-link>
          <router-link to="/" class="nav-item">TẠO PHIẾU MỚI</router-link>
        </nav>
        <div class="sidebar-footer">
          <a href="#" @click.prevent="handleLogout" class="logout-btn">Đăng xuất</a>
        </div>
      </aside>

      <!-- Main Content Area -->
      <main :class="{ 'main-content': isManagementPage, 'standalone-content': !isManagementPage }">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from './auth';

const route = useRoute();
const router = useRouter();
const { logout } = useAuth();

// Requirements: sidebar only for management, no public-nav, / redirects to create
const isManagementPage = computed(() => {
  return route.path === '/assessments/management';
});

const handleLogout = () => {
    logout();
    router.push('/login');
};
</script>

<style>
:root {
  --primary: #2563eb;
  --primary-hover: #1d4ed8;
  --bg: #f8fafc;
  --sidebar-bg: #1e293b;
  --sidebar-text: #f8fafc;
  --card-bg: #ffffff;
  --text: #1e293b;
  --text-light: #64748b;
  --border: #e2e8f0;
  --radius: 12px;
  --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
}

* {
  box-sizing: border-box;
}

body {
  font-family: 'Inter', sans-serif;
  background-color: var(--bg);
  color: var(--text);
  margin: 0;
  line-height: 1.6;
  padding: 0;
}

/* Sidebar Styles */
.sidebar {
  width: 260px;
  background: var(--sidebar-bg);
  color: var(--sidebar-text);
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  z-index: 1000;
}

.sidebar-header {
  padding: 24px;
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.nav-menu {
  flex: 1;
  padding: 20px 0;
}

.nav-item {
  padding: 12px 24px;
  display: flex;
  align-items: center;
  color: #94a3b8;
  text-decoration: none;
  transition: all 0.2s;
}

.nav-item:hover, .nav-item.active {
  background: rgba(255,255,255,0.05);
  color: white;
}

.nav-item.active {
  border-left: 4px solid var(--primary);
  padding-left: 20px;
}

.sidebar-footer {
  padding: 20px 24px;
  border-top: 1px solid rgba(255,255,255,0.1);
}

.logout-btn {
  color: #fca5a5;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.875rem;
  display: block;
}

/* Content Layouts */
.main-content {
  margin-left: 260px;
  padding: 40px;
  min-height: 100vh;
}

.standalone-content {
  padding: 40px 20px;
  max-width: 1000px;
  margin: 0 auto;
  min-height: 100vh;
}

/* Generic Components */
.card {
  background: white;
  border-radius: var(--radius);
  padding: 32px;
  box-shadow: var(--shadow);
  border: 1px solid var(--border);
  margin-bottom: 24px;
}

.btn {
  background: var(--primary);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  display: inline-block;
  border: none;
  cursor: pointer;
  text-align: center;
}

.badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
}

.badge-risk { background: #fee2e2; color: #dc2626; }
.badge-normal { background: #dcfce7; color: #16a34a; }
</style>
