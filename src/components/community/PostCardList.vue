<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import axios from "axios";
import PostCard from "./PostCard.vue";
import { usePostStore } from "@/stores/post";
import Cookies from "js-cookie";

const posts = ref([]);
const { VITE_APP_API_POST } = import.meta.env;

const postStore = usePostStore();
// const isLoading = ref(false);

// const loadMorePosts = () => {
//   if (
//     window.innerHeight + window.scrollY >=
//     document.documentElement.offsetHeight - 500
//   ) {
//     console.log("Loading...");
//     postStore.fetchPosts().then(() => {
//       isLoading.value = false;
//     });
//   }
// };

// const handleScroll = () => {
//   if (!isLoading.value) {
//     isLoading.value = true;
//     loadMorePosts();
//   }
// };

// onMounted(() => {
//   postStore.fetchPosts();
//   window.addEventListener("scroll", handleScroll);
// });

// onUnmounted(() => {
//   window.removeEventListener("scroll", handleScroll);
// });

const fetchPosts = () => {
  const sortField =
    sortOption.value === "popular"
      ? "hit"
      : sortOption.value === "liked"
      ? "like"
      : "create_time";
  const sortOrder = "desc";
  postStore.fetchPosts(sortField, sortOrder);
};
</script>

<template>
  <div class="container">
    <div class="row justify-content-center">
      <div
        class="d-flex justify-content-center col-xxl-7 col-xl-7 col-lg-8 col-md-9 col-sm-10"
        v-for="post in postStore.posts"
        :key="post.id"
      >
        <PostCard :post="post" />
      </div>
      <div v-if="postStore.loading" class="text-center my-4">
        <div class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>
        <!-- <p>Loading...</p> -->
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  margin-top: 20px;
}

@media (min-width: 1200px) {
  .card {
    max-width: 900px; /* 카드의 최대 너비 설정 */
    margin-left: auto;
    margin-right: auto;
  }
}

@media (min-width: 1400px) {
  .card {
    max-width: 800px; /* 카드의 최대 너비를 더 작게 설정 */
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
