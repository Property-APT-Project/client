<script setup>
import { ref } from "vue";
import FocusedMap from "../common/FocusedMap.vue";
import RankApt from "./rank/RankApt.vue";
import axios from "axios";

const cityName = ref("서울시 강서구");
const id = ref(0);
const nameList = ref([]);


const lat = ref("37.566826")
const lng = ref("126.9786567")

const path = "https://land.naver.com/news/airsList.naver?baseDate=2024-05-19&page=1&size=3";

const getTopSearchList = async () => {
  const searchPath = "http://localhost:8080/where-is-my-home/api/v1/search/rank/3"
  console.log('Fetching URL:', searchPath);
 
  try {
    const response = await axios.get(searchPath);
    nameList.value = response.data;
    if (response.data) {
      console.log("keyword response")
      console.log(nameList.value)
    } else {
      console.log('No data received');
    }
  } catch (error) {
    console.error('keyword 조회 실패:', error.response ? error.response.data : error.message);
  }
};

const fetchNewsInfo = async () => {
  console.log('Fetching URL:', path);
 
  try {
    const response = await axios.get(path);
    console.log('API Response:', response);
    if (response.data) {
      console.log("response")
      console.log(response.data.list)
    } else {
      console.log('No data received');
    }
  } catch (error) {
    console.error('뉴스 조회 실패:', error.response ? error.response.data : error.message);
  }
};



fetchNewsInfo();
getTopSearchList();

</script>

<template>
  <div class="container mb-6 mt-3">
    <div class="row align-items-center">
      <div class="col-auto"><img src="@/assets/icons/icon-ranking-title.png" width="50px" /></div>
      <div class="col-auto p-0" style="font-family: KCC-Hanbit;">
        <h2>
          단지 검색어 <span><b>Top3</b></span>
        </h2>
      </div>
    </div>
  </div>
  <div class="row mt-3 mb-3">
    <div class="col-lg-12">
      <div class="row">
        <RankApt v-for="aptInfo in nameList" :key="aptInfo.keyword" :aptInfo="aptInfo" />
      </div>
    </div>
  </div>
  <FocusedMap :lat="lat" :lng="lng" />
</template>

<style scoped></style>
