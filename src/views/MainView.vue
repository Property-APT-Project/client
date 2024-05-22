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
      <gpt-search-bar />
      <rank-list />
      <news-list />
    </div>
  </div>
</template>

<style scoped></style>
