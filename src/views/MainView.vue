<script setup>
import SearchBar from "@/components/common/SearchBar.vue";
import NewsList from "@/components/main/NewsList.vue";
import RankList from "@/components/main/RankList.vue";
import GptSearchBar from "@/components/gpt/GptSearchBar.vue";
</script>

<template>
  <div class="body-wrapper ms-0 me-0">
    <div class="body-wrapper-inner mb-6 container-fluid w-100">
      <search-bar />
      
      <rank-list />
      <gpt-search-bar />
      <news-list />
    </div>
  </div>
</template>

<style >
@font-face {
    font-family: 'KCC-Hanbit';
    src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/2403-2@1.0/KCC-Hanbit.woff2') format('woff2');
    font-weight: normal;
    font-style: normal;
}
</style>
