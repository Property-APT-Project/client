<script setup>
components: {
  GraphVue;
}
import PhotoGroupVue from "@/components/apt-detail/apt-photo/PhotoGroup.vue";
import DetailVue from "@/components/apt-detail/Detail.vue";
import GraphVue from "@/components/apt-detail/GraphVue.vue";
import RankList from "@/components/main/RankList.vue";
import PriceVue from "@/components/apt-detail/Price.vue";
import SaleDetailVue from "@/components/apt-detail/SaleDetail.vue";
import FocusedMap from "@/components/common/FocusedMap.vue";
import DealSideBar from "@/components/apt-detail/DealSideBar.vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { ref, onMounted } from "vue";

const props = defineProps({
  id: String,
});
console.log(props.id);

const saleInfo = ref([]);
const fetchSaleInfo = async () => {
  const path = `http://localhost:8080/where-is-my-home/api/v1/house-info/sale-articles/id/${props.id}`;

  console.log("Fetching URL:", path);

  try {
    const response = await axios.get(path);
    console.log("API Response:", response);
    if (response.data && response.data.length > 0) {
      saleInfo.value = response.data[0];
      console.log("response");
      console.log(saleInfo.value);
      fetchComplexInfo();
    } else {
      console.log("No data received");
    }
  } catch (error) {
    console.error(
      "매물 조회 실패:",
      error.response ? error.response.data : error.message
    );
  }
};

fetchSaleInfo();

const complexInfo = ref([]);
const fetchComplexInfo = async () => {
  const path = `http://localhost:8080/where-is-my-home/api/v1/house-info/complexes/detail-info/${saleInfo.value.aptName}?dongCode=${saleInfo.value.dongCode}00`;

  console.log("Fetching URL:", path);

  try {
    const response = await axios.get(path);
    console.log("API Response:", response);
    if (response.data && response.data.length > 0) {
      complexInfo.value = response.data[0];
      console.log("response");
      console.log(complexInfo.value);
    } else {
      console.log("No data received");
    }
  } catch (error) {
    console.error(
      "매물 조회 실패:",
      error.response ? error.response.data : error.message
    );
  }
};
// fetchComplexInfo();
</script>

<template>
  <div class="body-wrapper ms-0 me-0">
    <div class="body-wrapper-inner mb-6 container-fluid w-100">
      <div class="row">
        <div class="col-12">
          <PhotoGroupVue :saleInfo="saleInfo" :complex="complexInfo" />
        </div>
      </div>

      <div
        class="row"
        style="margin-right: 0; padding-right: 0; padding-left: 0"
      >
        <div
          class="row col-lg-8 d-flex align-items-stretch"
          style="
            margin-right: 0;
            margin-left: 0;
            padding-left: 0;
            padding-right: 0;
          "
        >
          <div class="col-12">
            <FocusedMap :lat="complexInfo.lat" :lng="complexInfo.lng" />
          </div>
          <div class="col-12" style="padding-right: 0">
            <DetailVue :complex="complexInfo" />
          </div>
          <div class="col-12" style="padding-right: 0">
            <SaleDetailVue :sale="saleInfo" :complex="complexInfo" />
          </div>
          <!-- <div class="col-12"  style="padding-right: 0;"><graph-vue /></div> -->

          <div class="col-12" style="padding-right: 0">
            <PriceVue :complex="complexInfo" />
          </div>
        </div>
        <div
          class="row col-lg-4 d-flex align-items-stretch"
          style="height: 100%; margin: 0; padding-right: 0"
        >
          <DealSideBar :sale="saleInfo" :complex="complexInfo" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
