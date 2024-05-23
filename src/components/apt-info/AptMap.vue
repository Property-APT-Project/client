<script setup>
import FocusedMap from "@/components/common/FocusedMap.vue";
import { ref, watch, computed } from 'vue';
import axios from 'axios';
import { KakaoMap, KakaoMapMarker, KakaoMapCustomOverlay } from "vue3-kakao-maps";
const { VITE_APP_DATA_SERVICE_KEY } = import.meta.env;

const props = defineProps({
  keyword: String,
  selectLat: String,
  selectLng: String
});

const visibleRef = ref(false);
const currItem = ref()
const currLat = ref()
const currLng = ref()
const contents = ref()
const imgPath = ref()

const onClickKakaoMapMarker = (marker) => {
  console.log("Marker clicked:", marker);
  visibleRef.value = !visibleRef.value;
  currItem.value = marker;
  console.log(currItem.value);
  lat.value = currItem.value.lat;
  lng.value = currItem.value.lng;
  currLat.value = currItem.value.lat;
  currLng.value = currItem.value.lng;
  imgPath.value = "https://d1774jszgerdmk.cloudfront.net/512/default_img_horizon.png";
  if(currItem.value.thumbImg != '@/assets/images/no-image.jpeg')
    imgPath.value = currItem.value.thumbImg;

  contents.value = getContentsWindow(currItem.value)
  console.log(visibleRef.value)
  console.log(lat.value, lng.value);
};



const getContentsWindow = (item) => {
  return `

<div class="row bg-gray p-3" style="background-color: white; width: 300px;">

  <div class="col-5 d-flex">
    <div class="col-5 d-flex w-100" style="object-fit: cover;">
      <a class="" href="#" @click="clickComplexButton(info)">
        <img class="rounded w-100 align-middle"
          src="${imgPath.value}" alt="prd1" />
      </a>
    </div>
  </div>
  <div class="col-7 m-0">
    <div class="row">
      <div class="col-9">
        <h5 class="omyu_pretty">${ item.aptName }</h5>
        
      </div>

      

    </div>

    <div class="col-3 p-0 m-0 align-items-center w-100">
      <h6 class="mt-2">${ item.address }</h6>
    </div>

  </div>
</div>`
};

const isSelectedI2 = ref(false);
const isSelectedP1 = ref(false);
const isSelectedQ1 = ref(false);

watch(isSelectedI2, (newValue, oldValue) => {
  let level = map.value.getLevel();
  let bounds = map.value.getBounds();
  // 영역 남서쪽 좌표 swLatLng.getLat() swLatLng.getLng()
  let swLatLng = bounds.getSouthWest();
  // 영역의 북동쪽 좌표를 얻어옵니다
  let neLatLng = bounds.getNorthEast();
  getCommericalDataI2(level, swLatLng.getLat(), neLatLng.getLat(), swLatLng.getLng(), neLatLng.getLng());
})

watch(isSelectedP1, (newValue, oldValue) => {
  let level = map.value.getLevel();
  let bounds = map.value.getBounds();
  // 영역 남서쪽 좌표 swLatLng.getLat() swLatLng.getLng()
  let swLatLng = bounds.getSouthWest();
  // 영역의 북동쪽 좌표를 얻어옵니다
  let neLatLng = bounds.getNorthEast();
  getCommericalDataP1(level, swLatLng.getLat(), neLatLng.getLat(), swLatLng.getLng(), neLatLng.getLng());
})

watch(isSelectedQ1, (newValue, oldValue) => {
  let level = map.value.getLevel();
  let bounds = map.value.getBounds();
  // 영역 남서쪽 좌표 swLatLng.getLat() swLatLng.getLng()
  let swLatLng = bounds.getSouthWest();
  // 영역의 북동쪽 좌표를 얻어옵니다
  let neLatLng = bounds.getNorthEast();
  getCommericalDataQ1(level, swLatLng.getLat(), neLatLng.getLat(), swLatLng.getLng(), neLatLng.getLng());
})

const sido = ref('')
const gugun = ref('')
const dong = ref('')

const sidoList = ref([])
const gugunList = ref([])

const dongList = ref([])

const map = ref();

const lat = ref("37.566826")
const lng = ref("126.9786567")

const saleList = ref([])
const complexList = ref([])
const complexDongGroupList = ref([])

const emit = defineEmits(['saleList', 'complexList'])

const path = "http://localhost:8080/where-is-my-home/api/v1";



function getSidoList() {
  console.log("http://localhost:8080/where-is-my-home/api/v1/dong-code/dong-code/sido");
  axios.get("http://localhost:8080/where-is-my-home/api/v1/dong-code/dong-code/sido")
    .then((response) => {
      sidoList.value = response['data'];
      console.log("sidoList");
      console.log(sidoList.value);
    })
    .catch(() => {
      console.log("시도 조회 실패");
    })
}

function getGugunList(sido) {
  const path = `http://localhost:8080/where-is-my-home/api/v1/dong-code/dong-code/gugun/${sido}`
  console.log(path);
  axios.get(path)
    .then((response) => {
      gugunList.value = response['data'];
      console.log("gugunList");
      console.log(gugunList.value);
    })
    .catch(() => {
      console.log("구군 조회 실패");
    })
}

function getDongList(gugun) {
  const path = `http://localhost:8080/where-is-my-home/api/v1/dong-code/dong-code/dong/${gugun}`
  console.log(path);
  axios.get(path)
    .then((response) => {
      dongList.value = response['data'];
      console.log("dongList");
      console.log(dongList.value);
    })
    .catch(() => {
      console.log("동 조회 실패");
    })
}

function getAptSaleList(level, sLat, eLat, sLng, eLng) {
  if (level <= 5) {
    axios.get(path + `/house-info/sale-articles/location?sLat=${sLat}&eLat=${eLat}&sLng=${sLng}&eLng=${eLng}`, {

    }).then((response) => {
      saleList.value = response['data'];
      emit('saleList', saleList.value);

    }).catch((response) => {
      console.log('매물 조회 실패');
    });
  }
}

const commericalP1 = ref([])
function getCommericalDataP1(level, sLat, eLat, sLng, eLng) {
  if (level >= 5) {
    commericalP1.value = [];
    return;
  }

  let numOfRows = 10;
  if (level <= 2)
    numOfRows = 15;

  const pathCommericalP1 = `https://apis.data.go.kr/B553077/api/open/sdsc2/storeListInRectangle?ServiceKey=${VITE_APP_DATA_SERVICE_KEY}&pageNo=1&numOfRows=${numOfRows}&minx=${sLng}&miny=${sLat}&maxx=${eLng}&maxy=${eLat}&indsLclsCd=P1&type=json`

  axios.get(pathCommericalP1, {})
    .then((response) => {
      console.log(pathCommericalP1);
      console.log(response);

      if (response.data && response.data.body && response.data.body.items) {
        commericalP1.value = response['data']['body']['items'];
        console.log(commericalP1.value[0].bizesNm);
      }
    }).catch((response) => {
      console.log('매물 조회 실패');
    });
}

// 병원 정보 불러오기
const commericalQ1 = ref([])
function getCommericalDataQ1(level, sLat, eLat, sLng, eLng) {
  if (level >= 5) {
    commericalQ1.value = [];
    return;
  }

  let numOfRows = 10;
  if (level <= 2)
    numOfRows = 15;

  const pathCommericalQ1 = `https://apis.data.go.kr/B553077/api/open/sdsc2/storeListInRectangle?ServiceKey=${VITE_APP_DATA_SERVICE_KEY}&pageNo=1&numOfRows=${numOfRows}&minx=${sLng}&miny=${sLat}&maxx=${eLng}&maxy=${eLat}&indsLclsCd=Q1&type=json`

  axios.get(pathCommericalQ1, {})
    .then((response) => {
      console.log(pathCommericalQ1);
      console.log(response);

      if (response.data && response.data.body && response.data.body.items) {
        commericalQ1.value = response['data']['body']['items'];
        console.log(commericalQ1.value[0].bizesNm);
      }
    }).catch((response) => {
      console.log('매물 조회 실패');
    });
}


const commericalI2 = ref([])
function getCommericalDataI2(level, sLat, eLat, sLng, eLng) {
  if (level >= 5) {
    commericalI2.value = [];
    return;
  }

  let numOfRows = 10;
  if (level <= 2)
    numOfRows = 15;

  const pathCommericalI2 = `https://apis.data.go.kr/B553077/api/open/sdsc2/storeListInRectangle?ServiceKey=${VITE_APP_DATA_SERVICE_KEY}&pageNo=1&numOfRows=${numOfRows}&minx=${sLng}&miny=${sLat}&maxx=${eLng}&maxy=${eLat}&indsLclsCd=I2&type=json`

  axios.get(pathCommericalI2, {})
    .then((response) => {
      console.log(pathCommericalI2);
      console.log(response);

      if (response.data && response.data.body && response.data.body.items) {
        commericalI2.value = response['data']['body']['items'];
        console.log(commericalI2.value[0].bizesNm);
      }
    }).catch((response) => {
      console.log('매물 조회 실패');
    });
}



function getComplexList(level, sLat, eLat, sLng, eLng) {
  complexList.value = [];
  complexDongGroupList.value = [];

  console.log(sLat, eLat, sLng, eLng)

  if (level <= 4) {
    console.log(level)
    axios.get(path + `/house-info/complexes/location?sLat=${sLat}&eLat=${eLat}&sLng=${sLng}&eLng=${eLng}`, {

    }).then((response) => {
      complexList.value = response['data'];
      console.log(complexList.value[0]);
      emit('complexList', complexList.value);
    }).catch((response) => {
      console.log('단지 조회 실패');
    });
  }
  else if (level >= 6 && level <= 7) {
    axios.get(path + `/house-info/complexes/dong-group?sLat=${sLat}&eLat=${eLat}&sLng=${sLng}&eLng=${eLng}`, {

    }).then((response) => {
      complexDongGroupList.value = response['data'];
      console.log(complexList.value[0]);
    }).catch((response) => {
      console.log('단지 그룹 조회 실패');
    });
  }
}



const onLoadKakaoMap = (mapRef) => {
  map.value = mapRef;
  // 일반 지도와 스카이뷰로 지도 타입을 전환할 수 있는 지도타입 컨트롤을 생성합니다
  const mapTypeControl = new kakao.maps.MapTypeControl();
  // 지도 타입 컨트롤을 지도에 표시합니다
  map.value.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

  // 지도 중심좌표를 얻어옵니다  latlng.getLat() latlng.getLng()
  lat.value = map.value.getCenter().getLat();
  lng.value = map.value.getCenter().getLng();
  let level = map.value.getLevel();
  let bounds = map.value.getBounds();
  // 영역 남서쪽 좌표 swLatLng.getLat() swLatLng.getLng()
  let swLatLng = bounds.getSouthWest();
  // 영역의 북동쪽 좌표를 얻어옵니다
  let neLatLng = bounds.getNorthEast();

  console.log(map.value.getCenter().getLat());

  if (props.keyword) {
    console.log("keyword!!");
    getComplexListByKeyword(level, props.keyword);
    getSaleListByKeyword(props.keyword);


  }
  else {
    console.log("non keyword");
    getAptSaleList(level, swLatLng.getLat(), neLatLng.getLat(), swLatLng.getLng(), neLatLng.getLng());
    getComplexList(level, swLatLng.getLat(), neLatLng.getLat(), swLatLng.getLng(), neLatLng.getLng());


  }

  getCommericalDataP1(level, swLatLng.getLat(), neLatLng.getLat(), swLatLng.getLng(), neLatLng.getLng());
  getCommericalDataQ1(level, swLatLng.getLat(), neLatLng.getLat(), swLatLng.getLng(), neLatLng.getLng());
  getCommericalDataI2(level, swLatLng.getLat(), neLatLng.getLat(), swLatLng.getLng(), neLatLng.getLng());





  kakao.maps.event.addListener(map.value, 'dragend', function (mouseEvent) {
    level = map.value.getLevel();
    bounds = map.value.getBounds();
    // 영역 남서쪽 좌표 swLatLng.getLat() swLatLng.getLng()
    swLatLng = bounds.getSouthWest();
    // 영역의 북동쪽 좌표를 얻어옵니다
    neLatLng = bounds.getNorthEast();

    console.log(level);
    getAptSaleList(level, swLatLng.getLat(), neLatLng.getLat(), swLatLng.getLng(), neLatLng.getLng());
    getComplexList(level, swLatLng.getLat(), neLatLng.getLat(), swLatLng.getLng(), neLatLng.getLng());
    getCommericalDataP1(level, swLatLng.getLat(), neLatLng.getLat(), swLatLng.getLng(), neLatLng.getLng());
    getCommericalDataQ1(level, swLatLng.getLat(), neLatLng.getLat(), swLatLng.getLng(), neLatLng.getLng());
    getCommericalDataI2(level, swLatLng.getLat(), neLatLng.getLat(), swLatLng.getLng(), neLatLng.getLng());

  });

  kakao.maps.event.addListener(map.value, 'zoom_changed', function (mouseEvent) {
    level = map.value.getLevel();
    bounds = map.value.getBounds();
    // 영역 남서쪽 좌표 swLatLng.getLat() swLatLng.getLng()
    swLatLng = bounds.getSouthWest();
    // 영역의 북동쪽 좌표를 얻어옵니다
    neLatLng = bounds.getNorthEast();
    getAptSaleList(level, swLatLng.getLat(), neLatLng.getLat(), swLatLng.getLng(), neLatLng.getLng());
    getComplexList(level, swLatLng.getLat(), neLatLng.getLat(), swLatLng.getLng(), neLatLng.getLng());
    getCommericalDataP1(level, swLatLng.getLat(), neLatLng.getLat(), swLatLng.getLng(), neLatLng.getLng());
    getCommericalDataQ1(level, swLatLng.getLat(), neLatLng.getLat(), swLatLng.getLng(), neLatLng.getLng());
    getCommericalDataI2(level, swLatLng.getLat(), neLatLng.getLat(), swLatLng.getLng(), neLatLng.getLng());
  });
};

watch(sido, (newValue, oldValue) => {
  getGugunList(newValue);
  console.log(newValue);
})

watch(gugun, (newValue, oldValue) => {
  getDongList(newValue);
  console.log(newValue);
})


function getComplexListByDongCode(dongCode) {
  const path = `http://localhost:8080/where-is-my-home/api/v1/house-info/complexes/dong-code/${dongCode}`
  axios.get(path)
    .then((response) => {
      complexList.value = response['data'];
      console.log(complexList.value[0]);

      lat.value = complexList.value[0].lat;
      lng.value = complexList.value[0].lng;

      emit('complexList', complexList.value);
    }).catch((response) => {
      console.log('단지 조회 실패');
    });
}

function getSaleListByDongCode(dongCode) {
  const path = `http://localhost:8080/where-is-my-home/api/v1/house-info/sale-articles/dong-code/${dongCode}`
  axios.get(path)
    .then((response) => {
      saleList.value = response['data'];
      console.log(saleList.value[0]);



      emit('saleList', saleList.value);
    }).catch((response) => {
      console.log('단지 조회 실패');
    });
}


watch(dong, (newValue, oldValue) => {
  const code = newValue.substr(0, 8);
  console.log(code);
  getComplexListByDongCode(newValue);
  getSaleListByDongCode(code);

});

getSidoList();

function postComplexKeyword(keyword) {
  const path = `http://localhost:8080/where-is-my-home/api/v1/search/${keyword}`
  axios.post(path)
    .then((response) => {
      console.log("keyword 등록 성공!!")
    }).catch((response) => {
      console.log('keyword 등록 실패ㅠ');
    });
}


function getComplexListByKeyword(level, keyword) {
  const path = `http://localhost:8080/where-is-my-home/api/v1/house-info/complexes/keyword/${keyword}`
  axios.get(path)
    .then((response) => {
      complexList.value = response['data'];
      console.log(complexList.value[0]);

      lat.value = complexList.value[0].lat;
      lng.value = complexList.value[0].lng;

      postComplexKeyword(complexList.value[0].aptName);


      let bounds = map.value.getBounds();
      // 영역 남서쪽 좌표 swLatLng.getLat() swLatLng.getLng()
      let swLatLng = bounds.getSouthWest();
      // 영역의 북동쪽 좌표를 얻어옵니다
      let neLatLng = bounds.getNorthEast();

      emit('complexList', complexList.value);
    }).catch((response) => {
      console.log('단지 조회 실패');
    });

  watch(lat, () => {
    let level = map.value.getLevel();
    let bounds = map.value.getBounds();
    // 영역 남서쪽 좌표 swLatLng.getLat() swLatLng.getLng()
    let swLatLng = bounds.getSouthWest();
    // 영역의 북동쪽 좌표를 얻어옵니다
    let neLatLng = bounds.getNorthEast();

    getCommericalDataP1(level, swLatLng.getLat(), neLatLng.getLat(), swLatLng.getLng(), neLatLng.getLng());
    getCommericalDataQ1(level, swLatLng.getLat(), neLatLng.getLat(), swLatLng.getLng(), neLatLng.getLng());
    getCommericalDataI2(level, swLatLng.getLat(), neLatLng.getLat(), swLatLng.getLng(), neLatLng.getLng());
  })


}

function getSaleListByKeyword(keyword) {
  const path = `http://localhost:8080/where-is-my-home/api/v1/house-info/sale-articles?keyword=${keyword}`
  axios.get(path)
    .then((response) => {
      saleList.value = response['data'];
      console.log(saleList.value[0]);

      emit('saleList', saleList.value);
    }).catch((response) => {
      console.log('키워드 매물 조회 실패');
    });
}

watch(() => props.selectLat, (newLat) => {
  console.log("selectLat changed to: " + newLat);
  lat.value = newLat;
  // 추가적인 로직을 여기서 처리할 수 있습니다.
});

watch(() => props.selectLng, (newLng) => {
  console.log("selectLng changed to: " + newLng);
  lng.value = newLng;
  // 추가적인 로직을 여기서 처리할 수 있습니다.
});




</script>

<template>
  <div class="body-wrapper col-lg-9 col-md-8 col-sm-12 m-0 ps-2 pe-0 bg-light" style="height: 100%; padding-top: 5%;">
    <div class="row ms-0 me-0 mb-3" style="width: 100%; height: 5%">
      <div class="col-4 m-0 p-0" style="height: 100%;">
        <div class="row ps-3">
          <div class="col-4 p-0">
            <select v-model="sido" class="form-select" style="height: 100%;">
              <option value="" selected disabled hidden>시도</option>
              <option v-for="(item, index) in sidoList" :key="index" :value="item.dongCode">{{ item.sidoName }}</option>
            </select>
          </div>
          <div class="col-4 p-0">
            <select v-model="gugun" class="form-select" style="height: 100%;">
              <option value="" selected disabled hidden>구군</option>
              <option v-for="(item, index) in gugunList" :key="index" :value="item.dongCode">{{ item.gugunName }}
              </option>
            </select>
          </div>
          <div class="col-4 p-0">
            <select v-model="dong" class="form-select" style="height: 100%;">
              <option value="" selected disabled hidden>동</option>
              <option v-for="(item, index) in dongList" :key="index" :value="item.dongCode">{{ item.dongName }}</option>
            </select>
          </div>


        </div>
      </div>
      <div class="col-6 m-0 p-0" style="height: 100%;"></div>
      <div class="col-1 m-0 p-0" style="height: 100%;">
        <div class="row" style="height: 100%;">
          <div class="col-3 bg-light p-0 ms-1">
            <a @click="isSelectedI2 = !isSelectedI2" class="p-0" style="height: 100%; width: 100%; cursor: pointer;">
              <img class="m-0" src="@/assets/icons/marker-food.png" style="width: 100%; height: 90%;" />
            </a>
          </div>
          <div class="col-3 bg-light p-0 ms-1">
            <a @click="isSelectedQ1 = !isSelectedQ1" class="p-0" style="height: 100%; width: 100%; cursor: pointer;">
              <img class="m-0" src="@/assets/icons/marker-hospital.png" style="width: 100%; height: 90%;" />
            </a>
          </div>
          <div class="col-3 bg-light p-0 ms-1">
            <a @click="isSelectedP1 = !isSelectedP1" class="p-0" style="height: 100%; width: 100%; cursor: pointer;">
              <img class="m-0" src="@/assets/icons/marker-school.png" style="width: 100%; height: 90%;" />
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="row ms-0 me-0" style="width: 100%; height: 90%">
      <div class="row align-items-stretch justify-content-center h-100" style="width: 100%; height: 100%">
        <KakaoMap :lat="lat" :lng="lng" @onLoadKakaoMap="onLoadKakaoMap" :draggable="true"
          style="width: 100%; height: 100%">
          <!-- v-for을 사용하여 saleList의 각 요소에 대해 마커를 생성합니다. -->
          <KakaoMapMarker v-for="(item, index) in complexList" :key="index" :lat="item.lat" :lng="item.lng" :image="{
            imageSrc: '../../src/assets/icons/house-marker.png',
            imageWidth: 40,
            imageHeight: 40,
            imageOption: {},}"
            :clickable="true"
            @onClickKakaoMapMarker="onClickKakaoMapMarker(item)"/>
            <KakaoMapCustomOverlay :lat="currLat" :lng="currLng" :yAnchor="1.4" :visible="visibleRef" :content="contents" />

          <!-- <KakaoMapMarker :lat="coordinate.lat" :lng="coordinate.lng"></KakaoMapMarker> -->
          <span v-if="isSelectedP1">
            <KakaoMapMarker v-for="(item, index) in commericalP1" :key="index" :lat="item.lat" :lng="item.lon" :image="{
              imageSrc: '../../src/assets/icons/marker-school.png',
              imageWidth: 30,
              imageHeight: 30,
              imageOption: {}
            }"></KakaoMapMarker>
          </span>
          <span v-if="isSelectedQ1">
            <KakaoMapMarker v-for="(item, index) in commericalQ1" :key="index" :lat="item.lat" :lng="item.lon" :image="{
              imageSrc: '../../src/assets/icons/marker-hospital.png',
              imageWidth: 30,
              imageHeight: 30,
              imageOption: {}
            }"></KakaoMapMarker>
          </span>
          <span v-if="isSelectedI2">
            <KakaoMapMarker v-for="(item, index) in commericalI2" :key="index" :lat="item.lat" :lng="item.lon" :image="{
              imageSrc: '../../src/assets/icons/marker-food.png',
              imageWidth: 30,
              imageHeight: 30,
              imageOption: {}
            }"></KakaoMapMarker>
          </span>
        </KakaoMap>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
