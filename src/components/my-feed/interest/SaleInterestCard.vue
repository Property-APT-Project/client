<script setup>
import FocusedMap from "@/components/common/FocusedMap.vue";
import { KakaoMap, KakaoMapMarker } from "vue3-kakao-maps";
import { useRoute, useRouter } from 'vue-router';

const coordinate = {
  lat: 37.537547,
  lng: 127.010049,
};

const props = defineProps({
  sale: Object
});

const router = useRouter();

const goToDetail = () => {
  router.push({ name: 'apt-detail-id', params: { id: props.sale.id } });

};

</script>

<template>
  <div class="card h-50" style="width: 100%;" @click="">
    <!-- <div class="card-body"> -->


    <div class="row card-body d-flex" style="width: 100%; padding: 0; margin-left: 0;">
  <div class="col-6 p-0 m-0 d-flex align-items-stretch" >
    <img v-if="sale.img1 != '@/assets/images/no-images.jpeg'" :src="sale.img1" class="img-fluid flex-fill" style="height: 200px;"/>
    <img v-else src="@/assets/images/no-image.jpeg" class="img-fluid flex-fill"  style="height: 200px;" />
  </div>
  <div class="col-6 p-0 m-0 d-flex align-items-stretch">
    <KakaoMap :lat="sale.lat" :lng="sale.lng" :draggable="true" level="5" class="w-100 flex-fill" style="height: 200px">
      <KakaoMapMarker :lat="sale.lat" :lng="sale.lng"></KakaoMapMarker>
    </KakaoMap>
  </div>
</div>


    <!-- </div> -->
    <div class="row card-body pt-3 pb-3" style="width: 100%; padding: 0; margin-left: 0;cursor: pointer;"
      @click="goToDetail">
      <h5 class="card-title text-center">{{ sale.aptName }}</h5>
      <p class="card-text text-info text-center" style="font-family: KCC-Hanbit; font-size: small;">{{ sale.description }}</p>
    </div>
    <!-- <div class="card-footer">
      <small class="text-muted">Last updated 3 mins ago</small>
    </div> -->
  </div>
</template>

<style scoped>
.map-container {
  position: relative;
  padding-bottom: 40%;
  /* 부모 요소의 높이를 카드의 40%로 설정 */
}
</style>
