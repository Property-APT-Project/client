<script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';

  const keyword = ref('');
  const router = useRouter();

  const navigateToAptMap = () => {
    router.push({ name: 'aptKeyword', params: { keyword: keyword.value } });
  };

</script>

<template>
  <div class="col-lg-12 mt-5 mb-5 justify-content-center row">
    <div class="card align-items-center justify-content-center rounded-pill col-9">
      <div class="p-3 card-body align-items-center justify-content-center w-100">
        <div class="d-flex align-items-center gap-6 w-100 p-0">
          <form class="w-100">
            <div class="row w-100 m-1">
              <div class="col-9 ps-3">
                <input
                  class="w-100 input-lg p-2"
                  style="font-size: 20px; border: none"
                  placeholder="검색어를 입력하세요."
                  type="text"
                  v-model="keyword"
                />
              </div>
              <div class="col-3">
                <button
                  class="w-100 rounded-pill bg-light p-2 text-gray"
                  type="submit"
                  style="font-size: 20px; border: none"
                  @click="navigateToAptMap"
                >
                  <span style="font-family: KCC-Hanbit;">검색</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
