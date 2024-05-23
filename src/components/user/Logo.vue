<script setup>

</script>

<template>
  <div>
    <router-link :to="{ name: 'root' }" class="text-nowrap logo-img text-center d-block py-3 w-100">
      <div>
          <a href="/" class="text-nowrap logo-img">
            <div class="d-flex justify-content-center">
              <img src="@/assets/icons/main-icon.png" height="40px" width="40px" />
              <h3 class="p-2 d-flex justify-content-center align-items-center"style="font-family: 'yg-jalnan'; color: cornflowerblue; margin-bottom: 0;">이집어때. </h3>

            </div>
            
          </a>
        </div>
    </router-link>
  </div>
</template>

<style scoped></style>