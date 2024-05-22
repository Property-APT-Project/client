import PostForm from "@/components/community/PostForm.vue";
import MainView from "@/views/MainView.vue";
import CommunityView from "@/views/community/CommunityView.vue";
import PostDetailView from "@/views/PostDetailView.vue";
import FindPasswordView from "@/views/user/FindPasswordView.vue";
import LoginView from "@/views/user/LoginView.vue";
import ProfileView from "@/views/user/ProfileView.vue";
import SignupView from "@/views/user/SignupView.vue";
import { createRouter, createWebHistory } from "vue-router";
import NewPasswordView from "@/views/user/NewPasswordView.vue";
import AptView from "@/views/AptView.vue";
import AptDetailView from "@/views/AptDetailView.vue";
import MyFeedView from "@/views/MyFeedView.vue";
import Cookies from "js-cookie";
import ConfirmReset from "@/components/user/ConfirmReset.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "root",
      component: MainView,
    },
    {
      path: "/login",
      name: "loginForm",
      component: LoginView,
    },
    {
      path: "/join",
      name: "signupForm",
      component: SignupView,
    },
    {
      path: "/profile",
      name: "profile",
      component: ProfileView,
      meta: { requiresAuth: true },
    },
    {
      path: "/pw-service",
      name: "pwService",
      component: FindPasswordView,
    },
    {
      path: "/community",
      name: "community",
      component: CommunityView,
      // meta: { requiresAuth: true },
    },
    {
      path: "/posts/:id",
      name: "postDetail",
      component: PostDetailView,
    },
    {
      path: "/pw-new",
      name: "newPW",
      component: NewPasswordView,
    },
    {
      path: "/apt",
      name: "apt",
      component: AptView,
      props: true,
    },
    {
      path: "/apt/:keyword",
      name: "aptKeyword",
      component: AptView,
      props: true,
    },

    {
      path: "/apt-detail/:id",
      name: "apt-detail-id",
      component: AptDetailView,
      props: true,
    },
    {
      path: "/apt-detail",
      name: "apt-detail",
      component: AptDetailView,
      props: (route) => ({ info: route.query.info }),
    },
    {
      path: "/my-feed",
      name: "myFeed",
      component: MyFeedView,
      meta: { requiresAuth: true },
    },
    {
      path: "/confirm-reset",
      name: "confirmReset",
      component: ConfirmReset,
      meta: { hideHeader: true },
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const token = Cookies.get("authToken");
    if (!token) {
      next({ name: "loginForm" });
    } else {
      next();
    }
  } else {
    next();
  }
});
export default router;
