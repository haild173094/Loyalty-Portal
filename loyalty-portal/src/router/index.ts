import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import AuthView from "../views/AuthView.vue";
import ProfileView from "../views/ProfileView.vue";
import ProductLoyaltyPointList from "../views/product/ProductLoyaltyPointList.vue";
import AddProductLoyaltyPoint from "../views/product/AddProductLoyaltyPoint.vue";
import Collection from "../views/collection/Collection.vue";
import AddCollection from "../views/collection/AddCollection.vue";
import Discounts from "@/views/discount/DiscountType.vue";
import CustomerList from "@/views/customer/CustomerList.vue";
import CustomerDetail from "@/views/customer/CustomerDetail.vue";
import { useAuthStore } from "../stores/auth";

/**
 * Define the routes for the application.
 */
const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
    meta: { auth: false },
  },
  {
    path: "/auth",
    name: "auth",
    component: AuthView,
    meta: { auth: false },
  },
  {
    path: "/discounts-type",
    name: "discounts-type",
    component: Discounts,
  },
  {
    path: "/customer-list",
    name: "customer-list",
    component: CustomerList,
  },
  {
    path: "/customer-detail/:id",
    name: "customer-detail",
    component: CustomerDetail,
  },
  {
    path: "/product-loyalty-point-list",
    name: "product-loyalty-point-list",
    component: ProductLoyaltyPointList,
  },
  {
    path: "/add-product-loyalty-point",
    name: "add-product-loyalty-point",
    component: AddProductLoyaltyPoint,
  },
  {
    path: "/collections",
    name: "collections",
    component: Collection,
  },
  {
    path: "/add-collections",
    name: "add-collections",
    component: AddCollection,
  },
  {
    path: "/profile",
    name: "profile",
    component: ProfileView,
  },
];

/**
 * Create the router instance.
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const isUserRoute = to.matched.some((record) => record.meta.auth !== false);
  if (isUserRoute) {
    const { isLoggedIn } = useAuthStore();
    if (isLoggedIn) {
      next();
    } else {
      next({
        name: "login",
        query: { redirect: to.fullPath },
      });
    }
  } else {
    next();
  }
});

export default router;
