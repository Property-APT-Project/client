<script setup>
import { defineProps, ref, onMounted } from "vue";
import Cookies from "js-cookie";

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
});

const { VITE_APP_API_MEMBER_UPLOAD } = import.meta.env;
const { VITE_APP_API_POST_UPLOAD } = import.meta.env;

const isAuthenticated = ref(false);

onMounted(() => {
  const token = Cookies.get("authToken");
  if (token) {
    isAuthenticated.value = true;
  }
});

// 시간 데이터를 포맷하는 함수
function formatDate(dateString) {
  const date = new Date(dateString);
  const formattedDate = date
    .toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\./g, ". ");

  const formattedTime = date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return `${formattedDate} ${formattedTime}`;
}
</script>

<template>
  <div class="">
    <div class="position-relative">
      <router-link :to="{ name: 'postDetail', params: { id: post.id } }">
        <a href="javascript:void(0)">
          <img
            :src="`${VITE_APP_API_POST_UPLOAD}/${post.imgURL}`"
            class="post-image"
            alt="matdash-img"
            style="width: 100%;"
          />
        </a>
      </router-link>
      <!-- <span
        class="badge text-bg-light text-dark fs-2 lh-sm mb-9 me-9 py-1 px-2 fw-semibold position-absolute bottom-0 end-0"
        >2 min Read</span
      > -->
      <!-- <img
        :src="`${VITE_APP_API_MEMBER_UPLOAD}/${post.profileImgURL}`"
        alt="matdash-img"
        class="rounded-circle position-absolute bottom-0 start-0 mb-n9 ms-9"
        width="40"
        height="40"
        data-bs-toggle="tooltip"
        data-bs-placement="top"
        data-bs-title="Georgeanna Ramero"
      /> -->
    </div>
    <div class="card-body p-4 pb-0">
      <router-link
        :to="{ name: 'postDetail', params: { id: post.id } }"
        class="d-block omyu_pretty my-4 mt-n1 fs-5 text-dark text-center fw-semibold link-primary"
        href="" style="font-family: KCC-Hanbit;"
        ><h5>{{ post.title }}</h5></router-link
      >

      <!-- <div class="d-flex align-items-center gap-3">
        <div class="d-flex align-items-center gap-2">
          <i class="ti ti-eye text-dark fs-5"></i> {{ post.hit }}
        </div>
        <div class="d-flex align-items-center gap-2">
          <i class="ti ti-message-2 text-dark fs-5"></i>
          {{ post.comments.length }}
        </div>
        <div>
          <div class="d-flex align-items-center gap-1 like clickable">
            <i class="fas fa-thumbs-up"></i>
            {{ post.like }}
          </div>
        </div>
        <div class="d-flex align-items-center fs-2 ms-auto">
          <i class="ti ti-point text-dark"></i>
          {{ formatDate(post.createTime) }}
        </div>
      </div> -->
    </div>
  </div>
</template>

<style scoped>
.card-container {
  position: relative;
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
  background-color: rgba(255, 255, 255, 0);
  z-index: 10;
}

.overlay-card {
  background-color: rgb(247, 246, 246);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.blur-container {
  position: relative;
  overflow: hidden;
}

.blur {
  filter: blur(10px);
  -webkit-filter: blur(10px); /* Safari 지원 */
  pointer-events: none; /* 클릭 방지 */
}

.post-image {
  max-height: 20vh;

  object-fit: cover; /* 이미지가 잘리지 않도록 설정 */
}

.rounded-circle {
  object-fit: cover;
}
</style>
