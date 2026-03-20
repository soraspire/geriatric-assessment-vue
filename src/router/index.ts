import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import AssessmentList from '../views/AssessmentList.vue';
import AssessmentCreate from '../views/AssessmentCreate.vue';
import AssessmentDetail from '../views/AssessmentDetail.vue';
import { isLoggedIn } from '../auth';

const routes = [
  { path: '/', name: 'AssessmentCreate', component: AssessmentCreate },
  { path: '/login', name: 'Login', component: Login },
  { path: '/assessments/management', name: 'AssessmentList', component: AssessmentList, meta: { requiresAuth: true } },
  { path: '/assessments/:uuid', name: 'AssessmentDetail', component: AssessmentDetail, props: true },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Auth Guard
router.beforeEach((to, _from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth) && !isLoggedIn.value) {
    next('/login');
  } else if (to.path === '/login' && isLoggedIn.value) {
    next('/assessments/management');
  } else {
    next();
  }
});

export default router;
