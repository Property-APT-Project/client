<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "../stores/user";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

const userStore = useUserStore();

const collapseRef = ref(null);
const activeNavItem = ref("main");

const closeSidebar = () => {
  if (collapseRef.value) {
    const bsCollapse = new bootstrap.Collapse(collapseRef.value, {
      toggle: false,
    });
    bsCollapse.hide();
  }
};

const router = useRouter();
const route = useRoute();

const handleNavItemClicked = (path, item) => {
  activeNavItem.value = item;
  closeSidebar();
  console.log(path);
  if (path) {
    router.push(path);
  }
};

const { VITE_APP_API_MEMBER_UPLOAD, VITE_APP_LOGOUT } = import.meta.env;
function handleLogout() {

  userStore.logout().then(() => {
    Swal.fire({
      // title: "",
      text: "로그아웃 되었습니다.",
      icon: "success",
    })
      .then(() => {
        router.replace({ name: "root" });
      })
      .catch((error) => {
        console.log("로그아웃 실패");
        console.error("Error:", error);
        throw error;
      });
  });
}

const updateActiveNavItem = () => {
  const currentPath = route.path;
  if (currentPath === "/" || currentPath.startsWith("/root")) {
    activeNavItem.value = "main";
  } else if (currentPath.startsWith("/apt")) {
    activeNavItem.value = "apt";
  } else if (
    currentPath.startsWith("/community") ||
    currentPath.startsWith("/posts")
  ) {
    activeNavItem.value = "community";
  } else if (currentPath.startsWith("/my-feed")) {
    activeNavItem.value = "myFeed";
  } else {
    activeNavItem.value = "";
  }
};

onMounted(() => {
  updateActiveNavItem();
});

watch(route, () => {
  updateActiveNavItem();
});
</script>

<template>
  <div class="justify-content-center">
    <nav
      class="navbar navbar-expand-md navbar-dark fixed-top navbar-light bg-light p-3"
    >
      <div
        class="container-fluid d-flex justify-content-between align-items-center"
      >
        <div>
          <button
            class="navbar-toggler me-3"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapsibleNavbar"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <a href="/" class="text-nowrap logo-img">
            <div class="row">
              <div class="col-4 p-1"><img src="@/assets/icons/main-icon.png" height="40px" width="40px" /></div>
              <div class="col-8 d-flex justify-content-center p-0 align-items-center">
                <h3 class="d-flex justify-content-center align-items-center"style="font-family: 'yg-jalnan'; color: cornflowerblue; margin-bottom: 0;">이집어때. </h3>
              </div>
              
            </div>
            
          </a>
        </div>

        <div
          class="collapse navbar-collapse justify-content-end no-transition"
          id="collapsibleNavbar"
          ref="collapseRef"
        >
          <ul class="navbar-nav">
            <li class="nav-item">
              <router-link
                :to="{ name: 'root' }"
                class="nav-link text-dark fs-6 me-2"
                :class="{ 'fw-bolder active': activeNavItem === 'main' }"
                @click.native="handleNavItemClicked(null, 'main')"
              >
                Main</router-link
              >
            </li>
            <li class="nav-item">
              <router-link
                :to="{ name: 'apt' }"
                class="nav-link text-dark fs-6 me-2"
                :class="{ 'fw-bolder active': activeNavItem === 'apt' }"
                @click.native="handleNavItemClicked(null, 'apt')"
              >
                APT</router-link
              >
            </li>
            <li class="nav-item">
              <router-link
                :to="{ name: 'community' }"
                class="nav-link text-dark fs-6 me-2"
                :class="{ 'fw-bolder active': activeNavItem === 'community' }"
                @click.native="handleNavItemClicked(null, 'community')"
              >
                Community</router-link
              >
            </li>
            <li class="nav-item">
              <router-link
                :to="{ name: 'myFeed' }"
                class="nav-link text-dark fs-6 me-2"
                :class="{ 'fw-bolder active': activeNavItem === 'myFeed' }"
                @click.native="handleNavItemClicked(null, 'myFeed')"
              >
                My Feed</router-link
              >
            </li>
          </ul>
        </div>

        <div
          class="profile-card p-2 shadow-sm rounded d-flex align-items-center"
        >
          <a
            v-if="userStore.user"
            class="nav-link"
            href="javascript:void(0)"
            id="drop2"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <div class="d-flex align-items-center">
              <img
                v-if="userStore.user"
                :src="`${VITE_APP_API_MEMBER_UPLOAD}/${userStore.user.imgURL}`"
                alt=""
                width="35"
                height="35"
                class="rounded-circle"
              />
              <!-- <img
                v-else
                :src="VITE_APP_API_DEFUALT_PROFILE_IMAGE"
                alt=""
                width="35"
                height="35"
                class="rounded-circle"
              /> -->
              <div class="ms-1 text-black">
                {{ userStore.user.name }} 님
                <i class="fa-solid fa-caret-down"></i>
              </div>
            </div>
          </a>

          <router-link
            v-else
            :to="{ name: 'loginForm' }"
            class="ms-1 text-black"
          >
            <i class="fa-solid fa-right-to-bracket"></i>
            <span class="ms-1 me-1"> 로그인 </span>
          </router-link>

          <div
            class="me-2 mt-n1 dropdown-menu dropdown-menu-end animate slideIn dropdown-menu-animate-up"
            aria-labelledby="drop2"
          >
            <div class="message-body">
              <div class="w-100 limited-width">
                <router-link
                  :to="{ name: 'profile' }"
                  class="rounded-2 d-flex align-items-center dropdown-item"
                >
                  <i class="ti ti-user fs-6"></i>
                  <p class="mb-0 ms-1 fs-3">My Profile</p>
                </router-link>
              </div>
              <div class="w-100 limited-width">
                <button
                  @click="handleLogout"
                  class="rounded-2 d-flex align-items-center dropdown-item"
                >
                  <i class="fa fa-sign-out ms-1 fs-4"></i>
                  <p class="mb-0 ms-2 fs-3">Logout</p>
                </button>
              </div>
              <!-- <a
                href="./authentication-login.html"
                class="btn btn-light mx-3 mt-2 p-0 d-block"
                >Logout</a
              > -->
            </div>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>
<style scoped>
.limited-width {
  max-width: 130px;
  /* 원하는 최대 폭 설정 */
  margin: 0 auto;
  /* 중앙 정렬 */
}

.dropdown-menu {
  animation: 0.5s slideup;
}

@keyframes slideup {
  from {
    transform: translateY(10%);
  }

  to {
    transform: translateY(0);
  }
}

.fixed-profile {
  position: fixed;
  top: 10px; /* 원하는 위치로 조정 */
  right: 10px; /* 원하는 위치로 조정 */
  z-index: 1000; /* 다른 요소 위에 표시하기 위해 z-index 설정 */
}

.no-transition {
  transition: none !important;
}

.profile-card {
  max-width: 200px;
}

.rounded-circle {
  object-fit: cover;
}

.shadow-sm {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
}

@font-face {
    font-family: 'yg-jalnan';
    src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_four@1.2/JalnanOTF00.woff') format('woff');
    font-weight: normal;
    font-style: normal;
}

@font-face {
    font-family: 'HSSanTokki20-Regular';
    src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/2405@1.0/HSSanTokki20-Regular.woff2') format('woff2');
    font-weight:lighter;
    font-style: normal;
    
}
</style>
