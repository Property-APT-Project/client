import { defineStore } from "pinia";
import axios from "axios";
import Cookies from "js-cookie";

const { VITE_APP_API_POST, VITE_APP_API_NEW_POST } = import.meta.env;

export const usePostStore = defineStore("post", {
  state: () => ({
    posts: [],
    page: 1,
    limit: 5,
    loading: false,
    hasMore: true,
  }),
  actions: {
    async fetchPosts(sortField = this.sortField, sortOrder = this.sortOrder) {
      if (this.loading || !this.hasMore) return;
      this.loading = true;
      this.sortField = sortField; // 선택된 정렬 기준 업데이트
      this.sortOrder = sortOrder; // 선택된 정렬 순서 업데이트
      return axios
        .get(VITE_APP_API_POST, {
          params: {
            _page: this.page,
            _limit: this.limit,
            _sort: this.sortField,
            _order: this.sortOrder,
          },
        })
        .then((response) => {
          if (response.data.length < this.limit) {
            this.hasMore = false;
          }
          // this.posts = response.data;
          this.posts = [...this.posts, ...response.data];
          this.page += 1;
        })
        .catch((error) => {
          console.error("Error fetching posts:", error);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    addPost(newPost) {
      const tokenCookie = Cookies.get("authToken");
      const token = JSON.parse(tokenCookie);
      return axios
        .post(VITE_APP_API_NEW_POST, newPost, {
          headers: {
            Authorization: "Bearer " + token.accessToken,
          },
        })
        .then((response) => {
          console.log(response.data);
          this.posts.unshift(response.data);
          this.posts.sort(
            (a, b) => new Date(b.createTime) - new Date(a.createTime)
          ); // 최신순으로 정렬
          console.log(this.posts);
        })
        .catch((error) => {
          console.error("Error adding post:", error);
        });
    },
    reset() {
      this.posts = [];
      this.limit = 5;
      this.page = 1;
      this.loading = false;
      this.hasMore = true;
    },
    updatePost(newPost) {
      const tokenCookie = Cookies.get("authToken");
      const token = JSON.parse(tokenCookie);
      console.log(newPost);
      return axios
        .put(`${VITE_APP_API_POST}/${newPost.id}`, newPost, {
          headers: {
            Authorization: "Bearer " + token.accessToken,
          },
        })
        .then((response) => {
          console.log(response.data);
          // this.posts.unshift(response.data);
          this.posts.sort(
            (a, b) => new Date(b.createTime) - new Date(a.createTime)
          ); // 최신순으로 정렬
          console.log(this.posts);
        })
        .catch((error) => {
          console.error("Error adding post:", error);
        });
    },
  },
});
