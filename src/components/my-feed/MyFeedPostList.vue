<script setup>
import { ref, onMounted } from "vue";
import PostCard from "@/components/community/PostCard.vue";
import Cookies from "js-cookie";
import axios from "axios";
import PostCardFeed from "../community/PostCardFeed.vue";

const { VITE_APP_API_MY_FEED_POST } = import.meta.env;
const posts = ref([]);
const fetchPosts = () => {
  const tokenCookie = Cookies.get("authToken");
  const token = JSON.parse(tokenCookie);
  axios
    .get(VITE_APP_API_MY_FEED_POST, {
      headers: {
        Authorization: "Bearer " + token.accessToken,
      },
    })
    .then((response) => {
      posts.value = response.data;
      console.log(posts.value);
    })
    .catch((error) => {
      console.error("Error fetching posts:", error);
    });
};

onMounted(() => {
  // const token = Cookies.get("authToken");
  // if (token) {
  //   isAuthenticated.value = true;
  // }
  fetchPosts();
});
</script>

<template>
  <div class="card-group card-group-scroll">
    <!-- <div class="card"> -->
    <PostCardFeed v-for="post in posts" :key="post.id" :post="post" />
    <!-- </div> -->
  </div>
</template>

<style scoped></style>
