import { createRouter, createWebHistory } from 'vue-router';
import Layout from '../views/Layout.vue';
import LoginView from '../components/login/LoginView.vue';
import DeptView from '../components/departments/DepartmentsView.vue';
import OrgView from '../components/organizations/OrganizationsView.vue';
import PosView from '../components/positions/PositionsView.vue';
import EmpView from '../components/employees/EmployeesView.vue';
import OpsView from '../components/hrOperations/HrOperationsView.vue';
import HistoryView from '../components/changeHistory/ChangeHistoryView.vue';
import UsersView from '../components/users/UsersView.vue';

const user = JSON.parse(localStorage.getItem('user'));

const routes = [
  { path: '/login', component: LoginView },
  {
    path: '/',
    component: Layout,
    children: [
      { path: '', redirect: '/departments' },
      { path: 'departments', component: DeptView },
      { path: 'organizations', component: OrgView },
      { path: 'positions', component: PosView },
      { path: 'employees', component: EmpView },
      { path: 'operations', component: OpsView },
      { path: 'history', component: HistoryView },
    ],
  },
];

if (user?.role === 'admin') {
  routes[1].children.push({ path: 'users', component: UsersView });
}

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('user');

  if (!isAuthenticated && to.path !== '/login') {
    next('/login');
  } else {
    next();
  }
});

export default router;
