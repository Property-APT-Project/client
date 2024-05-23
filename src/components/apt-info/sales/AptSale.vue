<script setup>
import { useRoute, useRouter } from "vue-router";
import Cookies from "js-cookie";
import axios from "axios";
import { ref, watch } from "vue";

const props = defineProps({
  info: Object,
});

const emit = defineEmits(["isChanged"]);

const isSelectInterest = ref(props.info.interest);

console.log("sale page");
const router = useRouter();

console.log(props);
const goToDetail = () => {
  router.push({ name: "apt-detail-id", params: { id: props.info.id } });
};
async function registInterest() {
  const tokenCookie = Cookies.get("authToken");
  const token = JSON.parse(tokenCookie);

  console.log(
    "post!!!!!!",
    "http://localhost:8080/where-is-my-home/interest/post"
  );
  console.log("props.info:", props.info); // props.info의 내용을 확인
  console.log("props.info.id:", props.info.id); // props.info.id 값을 확인

  const requestBody = {
    id: 0,
    userId: 0,
    category: 1, // 예제에서 category가 1이라고 설정
    interestId: props.info.id,
    lng: props.info.lng,
    lat: props.info.lat,
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
    })
    .catch((error) => {
      console.error("post 실패", error);
      isSelectInterest.value = !isSelectInterest.value;
    });
}

async function deleteInterest() {
  const tokenCookie = Cookies.get("authToken");
  const token = JSON.parse(tokenCookie);

  console.log(
    "delete!!!!!!",
    `http://localhost:8080/where-is-my-home/interest/delete/${props.info.id}`
  );
  console.log("props.info.id:", props.info.id); // props.info.id 값을 확인

  await axios
    .delete(
      `http://localhost:8080/where-is-my-home/interest/delete/${props.info.id}`,
      {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      }
    )
    .then((response) => {
      console.log("delete 성공", response);
    })
    .catch((error) => {
      console.error("delete 실패", error);
      isSelectInterest.value = !isSelectInterest.value;
    });
}

function changeState() {
  isSelectInterest.value = !isSelectInterest.value;

  if (isSelectInterest.value) registInterest();
  else deleteInterest();

  emit("isChanged", true);
}
</script>

<template>
  <li class="sidebar-item mb-3 me-3 pe-3">
    <div class="row bg-gray p-3" style="background-color: white">
      <div class="col-5 d-flex">
        <a class="container clickable justify-content-center p-0" @click="goToDetail">
          <img
            v-if="info.img1 != '@/assets/images/no-image.jpeg'"
            class="rounded w-100 align-middle"
            :src="info.img1"
            alt="prd1"
            height="100px;"
          />
          <img
            v-else
            class="rounded w-100 align-middle"
            src="@/assets/images/no-image.jpeg"
            alt="prd1"
            height="100px;"
          />
        </a>
      </div>
      <div class="col-7">
        <div class="row">
          <div class="col-9">
            <h5 class="omyu_pretty">{{ info.aptName }}</h5>
          </div>
          <div class="col-3 p-0">
            <a
              @click="changeState"
              class="p-0"
              style="height: 50%; width: 50%; cursor: pointer"
            >
              <img
                class="m-0"
                src="@/assets/icons/icon-heart.png"
                style="width: 50%"
              />
            </a>
          </div>
        </div>

        <h6 class="">{{ info.price }} 만원</h6>
        <p class="mb-0">{{ info.floor }} / {{ info.size }}</p>
      </div>
    </div>
  </li>
</template>

<style scoped>
.clickable {
  cursor: pointer;
}
</style>
