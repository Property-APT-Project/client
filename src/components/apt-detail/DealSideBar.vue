<script setup>
import { useRoute, useRouter } from "vue-router";
import Cookies from "js-cookie";
import axios from "axios";
import { ref, watch } from "vue";
import Swal from "sweetalert2";

const props = defineProps({
  sale: Object,
  complex: Object,
});

const Toast = Swal.mixin({
  toast: true,
  position: "center",
  showConfirmButton: false,
  timer: 1500,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

async function registInterest() {
  const tokenCookie = Cookies.get("authToken");
  const token = JSON.parse(tokenCookie);

  console.log(
    "post!!!!!!",
    "http://localhost:8080/where-is-my-home/interest/post"
  );
  console.log("props.info:", props.sale); // props.info의 내용을 확인
  console.log("props.info.id:", props.sale.id); // props.info.id 값을 확인

  const requestBody = {
    id: 0,
    userId: 0,
    category: 1, // 예제에서 category가 1이라고 설정
    interestId: props.sale.id,
    lng: props.sale.lng,
    lat: props.sale.lat,
  };

  console.log("Request Body:", requestBody);

  await axios
    .post("http://localhost:8080/where-is-my-home/interest/post", requestBody, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token.accessToken,
      },
    })
    .then((response) => {
      console.log("post 성공", response);
      Toast.fire({
        icon: "success",
        title: "등록되었습니다.",
      });
    })
    .catch((error) => {
      console.error("post 실패", error);
      isSelectInterest.value = !isSelectInterest.value;
    });
}
</script>

<template>
  <div class="card w-100 p-3" style="width: 100%; margin: 0; padding-right: 0">
    <div class="card-body p-4" style="margin: 0">
      <div class="mb-4" style="margin-right: 0">
        <h3 class="fw-semibold">{{ complex.aptName }}</h3>
      </div>
      <div class="mb-4" style="margin-right: 0">
        <h4 class="fw-semibold">매매 {{ sale.price }}</h4>
      </div>
      <div class="row w-90 m-2 mt-3">
        <div class="col-3 p-0 m-0 align-items-center w-100">
          <button
            @click="registInterest"
            class="p-2 w-100 rounded-pill bg-light text-gray align-self-center"
            type="button"
            style="font-size: 12px; border: none"
          >
            관심매물 추가
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
