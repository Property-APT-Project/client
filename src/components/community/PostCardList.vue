<script setup>
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import PostCard from "./PostCard.vue";
import { usePostStore } from "@/stores/post";
import Cookies from "js-cookie";

const posts = ref([]);
const { VITE_APP_API_POST } = import.meta.env;

const postStore = usePostStore();
const sortOption = ref("latest");

const fetchPosts = () => {
  console.log("post");
  const sortField =
    sortOption.value === "popular"
      ? "hit"
      : sortOption.value === "liked"
      ? "like"
      : "create_time";
  const sortOrder = "desc";
  postStore.fetchPosts(sortField, sortOrder);
};

onMounted(() => {
  console.log('mounted')
  postStore.reset();
  fetchPosts();
});

watch(sortOption, () => {
  console.log(sortOption);
  postStore.reset();
  fetchPosts();
});

// 정렬 옵션 변경 핸들러
const handleSortChange = (option) => {
  sortOption.value = option;
};
</script>

<template>
  <div>
    <div class="d-flex justify-content-end mb-3">
      <div class="dropdown">
        <button
          class="btn btn-primary dropdown-toggle"
          type="button"
          id="dropdownMenuButton"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          정렬:
          {{
            sortOption === "popular"
              ? "인기순"
              : sortOption === "liked"
              ? "좋아요순"
              : "최신순"
          }}
        </button>
        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
          <li>
            <a
              class="dropdown-item"
              href="#"
              @click.prevent="handleSortChange('popular')"
              >인기순</a
            >
          </li>
          <li>
            <a
              class="dropdown-item"
              href="#"
              @click.prevent="handleSortChange('liked')"
              >좋아요순</a
            >
          </li>
          <li>
            <a
              class="dropdown-item"
              href="#"
              @click.prevent="handleSortChange('latest')"
              >최신순</a
            >
          </li>
        </ul>
      </div>
    </div>
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
