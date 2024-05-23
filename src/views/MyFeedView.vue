<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import SaleInterestCard from "@/components/my-feed/interest/SaleInterestCard.vue";
import ComplexInterestCard from "@/components/my-feed/interest/ComplexInterestCard.vue";
import AptSale from "@/components/apt-info/sales/AptSale.vue";
import PostCard from "@/components/community/PostCard.vue";
import { KakaoMap, KakaoMapMarker } from "vue3-kakao-maps";
import PostCardFeed from "@/components/community/PostCardFeed.vue";
import MyFeedPostList from "@/components/my-feed/MyFeedPostList.vue";
import Cookies from "js-cookie";
import { useTokenStore } from "@/stores/token";

const interestSaleList = ref([]);
const interestSaleIdList = ref([]);
const interestComplexList = ref([]);
const interestComplexNameList = ref([]);

async function getInterestSaleInfo(id) {
  const path = `http://localhost:8080/where-is-my-home/api/v1/house-info/sale-articles/id/${id}`;

  await axios
    .get(path)
    .then((response) => {
      console.log("SUCCESS Interest Sale Info");

      interestSaleList.value.push(response.data[0]);
      console.log(interestSaleList.value);
    })
    .catch((error) => {
      console.error("Error:");
      // router.replace({ name: "community" });
    });
}

async function getInterestSale() {
  const tokenCookie = Cookies.get("authToken");
  const token = JSON.parse(tokenCookie);

  const complexPath =
    "http://localhost:8080/where-is-my-home/interest/list/sale";

  await axios
    .get(complexPath, {
      headers: {
        Authorization: "Bearer " + token.accessToken,
      },
    })
    .then((response) => {
      console.log("SUCCESS Interest Sale");

      interestSaleIdList.value = response.data.map((sale) => sale.interestId);

      interestSaleIdList.value.forEach(getInterestSaleInfo);
      const tmp = ref(interestSaleList.value);
      interestSaleList.value = tmp.value;

      console.log("info!!");
      // console.log(interestSaleList.value);
      // console.log(interestSaleIdList.value);
    })
    .catch((error) => {
      console.error("Error:");
      // router.replace({ name: "community" });
    });
}

async function getInterestComplex() {
  const tokenCookie = Cookies.get("authToken");
  const token = JSON.parse(tokenCookie);

  const complexPath =
    "http://localhost:8080/where-is-my-home/interest/list/complex";

  await axios
    .get(complexPath, {
      headers: {
        Authorization: "Bearer " + token.accessToken,
      },
    })
    .then((response) => {
      console.log("SUCCESS Complex");

      interestComplexList.value = response.data;
      console.log(interestComplexList.value);

      // interestComplexNameList.value = response.data.map(complex => complex.interestId);
      // console.log(interestComplexNameList.value);
    })
    .catch((error) => {
      console.error("Error:");
    });
}

async function getInterestComplexDetailInfo(complex) {
  const complexPath = `http://localhost:8080/where-is-my-home/api/v1/house-info/complexes/keyword/${complex}`;

  await axios
    .get(complexPath)
    .then((response) => {
      console.log("SUCCESS Complex Detail");
      console.log(response.data);

      interestComplexNameList.value = response.data.map(
        (complex) => complex.interestId
      );
      console.log(interestComplexNameList.value);
    })
    .catch((error) => {
      console.error("Error:");
    });
}

const posts = ref([]);
const scrollContainerRef = ref(null);

const loadPosts = async () => {
  try {
    const response = await axios.get(`/api/posts`);
    posts.value = response.data;
  } catch (error) {
    console.error(error);
  }
};

const scrollLeft = () => {
  if (scrollContainerRef.value) {
    scrollContainerRef.value.scrollBy({
      left: -300, // Adjust this value according to the width of your cards
      behavior: "smooth",
    });
  }
};

const scrollRight = () => {
  if (scrollContainerRef.value) {
    scrollContainerRef.value.scrollBy({
      left: 300, // Adjust this value according to the width of your cards
      behavior: "smooth",
    });
  }
};
const activeSale = ref(true);
const activeComplex = ref(false);

const activateSale = () => {
  activeSale.value = true;
  // isSelectComplex.value = false;
  activeComplex.value = false;
};

const activateComplex = () => {
  activeSale.value = false;
  // isSelectComplex.value = false;
  activeComplex.value = true;
};

onMounted(() => {
  loadPosts();
  getInterestSale();
  getInterestComplex();
});

const coordinate = {
  lat: 37.537547,
  lng: 127.010049,
};
</script>

<template>
  <div class="body-wrapper ms-0 me-0">
    <div class="body-wrapper-inner mb-6 container-fluid w-100" style="font-family: KCC-Hanbit;">
      <h2 class="p-0 mt-3 mb-0">관심 매물 / 단지</h2>

      <nav class="tap d-flex justify-content-end">
        <ul class="nav nav-tabs">
          <li class="nav-item">
            <button
              :class="{ 'nav-link': true, active: activeSale }"
              @click="activateSale"
            >
              매물
            </button>
          </li>
          <li class="nav-item">
            <button
              :class="{ 'nav-link': true, active: activeComplex }"
              @click="activateComplex"
            >
              아파트 단지
            </button>
          </li>
        </ul>
      </nav>
      <div
        v-if="activeSale"
        class="card-group card-group-scroll"
        style="margin-bottom: 10%"
      >
        <SaleInterestCard
          class="me-3"
          v-for="sale in interestSaleList"
          :key="sale.interestId"
          :sale="sale"
        />
      </div>
      <div v-else class="card-group card-group-scroll" style="margin-bottom: 10%">
        <ComplexInterestCard
          class="me-3"
          v-for="complex in interestComplexList"
          :key="complex.interestId"
          :complex="complex"
        />
      </div>
      
      <h2 class="p-0 mt-3 mb-3">나의 글</h2>
      
      <MyFeedPostList style="font-family: KCC-Hanbit;" />
    </div>
  </div>
</template>

<style scoped>
body {
  padding-top: 2rem;
}

@media (min-width: 576px) {
  .card-group.card-group-scroll {
    overflow-x: auto;
    flex-wrap: nowrap;
  }
}

.card-group.card-group-scroll > .card {
  flex-basis: 35%;
}
</style>
