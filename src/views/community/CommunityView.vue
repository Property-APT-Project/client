<script setup>
import PostForm from "/src/components/community/PostForm.vue";
import PostCard from "/src/components/community/PostCard.vue";
import PostCardList from "/src/components/community/PostCardList.vue";
import Cookies from "js-cookie";
import { ref, onMounted, onUnmounted } from "vue";
import { usePostStore } from "@/stores/post";
import { useRouter } from "vue-router";

// const handleScroll = () => {
//   const bottomOfWindow =
//     window.innerHeight + window.scrollY >=
//     document.documentElement.offsetHeight;
//   if (bottomOfWindow) {
//     // loadPosts();
//     console.log("LOADING>>>>");
//   }
// };

const postStore = usePostStore();
const isLoading = ref(false);

const loadMorePosts = () => {
  if (
    window.innerHeight + window.scrollY >=
    document.documentElement.scrollHeight - 1
  ) {
    if (
      !postStore.loading &&
      postStore.hasMore &&
      (isAuthenticated.value || postStore.page <= 2)
    ) {
      isLoading.value = true;
      postStore.fetchPosts().then(() => {
        isLoading.value = false;
      });
    }
  }
};

const handleScroll = () => {
  if (!isLoading.value) {
    loadMorePosts();
  }
};

// onMounted(() => {
//   postStore.fetchPosts();
//   window.addEventListener("scroll", handleScroll);
// });

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

const showButton = ref(false);
const isAuthenticated = ref(false);
const router = useRouter();
onMounted(() => {
  const token = Cookies.get("authToken");
  if (token) {
    showButton.value = true;
    isAuthenticated.value = true;
  }
  // postStore.reset();
  // postStore.fetchPosts();
  window.addEventListener("scroll", handleScroll);
  // loadPosts();
  // console.log("yo");
});
</script>

<template>
  <!-- <div
    class="page-wrapper"
    id="main-wrapper"
    data-layout="vertical"
    data-navbarbg="skin6"
    data-sidebartype="full"
    data-sidebar-position="fixed"
    data-header-position="fixed"
  >
    <div
      class="position-relative min-vh-100 align-items-center justify-content-center"
    > -->
  <div class="body-wrapper ms-0 me-0">
    <div class="body-wrapper-inner mb-6 container-fluid w-100">
      <div class="mb-3 d-flex justify-content-center fixed-bottom">
        <button
          v-if="showButton"
          class="mt-3 responsive-button btn btn-success text-nowrap shadow-lg fs-3 text-center rounded-4"
          data-bs-toggle="modal"
          data-bs-target="#staticBackdrop"
        >
          <i class="fa-solid fa-pen"></i>
          <span class="ms-2 button-text">새로운 글</span>
        </button>
      </div>
      <!-- <div v-if="true" class="text-black overlay">
        <div class="">로그인하고 커뮤니티 참여하기</div>
        <router-link :to="{ name: 'loginForm' }">
          <i class="fa-solid fa-lock"></i>
        </router-link>
      </div> -->

      <PostForm />
      <div class="ms-2 me-2">
        <div class="row">
          <PostCardList />
          <!-- <PostCard class="col-lg-4 col-md-6 col-sm-12" />
          <PostCard class="col-lg-4 col-md-6 col-sm-12" />
          <PostCard class="col-lg-4 col-md-6 col-sm-12" />
          <PostCard class="col-lg-4 col-md-6 col-sm-12" />
          <PostCard class="col-lg-4 col-md-6 col-sm-12" />
          <PostCard class="col-lg-4 col-md-6 col-sm-12" /> -->
        </div>
        <div class="row"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media (max-width: 576px) {
  .button-text {
    display: none; /* 화면 너비가 600px 이하일 때 텍스트 숨김 */
  }
}

.responsive-button {
  display: flex;
  align-items: center;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  z-index: 10;
}
</style>
