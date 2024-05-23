<script setup>
const props = defineProps({
  newsInfo: Object,
});
</script>

<template>
  <div class="col-lg-4 d-flex align-items-stretch" style="height: 600px;">
    <div class="card overflow-hidden hover-img">
      <div class="position-relative" style="height: 45%;">
        <a :href="newsInfo.linkUrl" style="height: 100%;" target="_blank">
          <img :src="newsInfo.thumbnail" class="card-img-top" alt="matdash-img" style="height: 100%"/>
        </a>
      </div>
      <div class="card-body p-4" style="height: 55%;">
        <a class="d-block my-4 fs-5 text-dark fw-semibold link-primary mt-0" href="">{{
          newsInfo.title
        }}</a>
        <p class="d-block my-4 fs-5 text-dark mb-1">{{ newsInfo.summaryContent }}</p>
        <div class="d-flex align-items-center gap-4">
          <div class="d-flex align-items-center fs-2 ms-auto">
            <i class="ti ti-point text-dark"></i> {{ newsInfo.publishDateTime }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
