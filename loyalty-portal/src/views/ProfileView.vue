<template lang="pug">
.detail-view
  div(class="title") OE-Loyalty / Account
  h3 Account detail
  .user-info
    div(class="col-6 realative-position")
      div(class="card-profile")
        div(
          class="card-profile-title"
        )    
          h3 Profile
        div(
          v-if="isLoading",
          class="is-loading-user",
        ) 
          Spinner(size="large")
        div(v-else)
          .user-info-content-item
            h4 Shop Owner
            p {{ user.shop_owner }}
          .user-info-content-item
            h4 Shop Name
            p {{ user.shop_name }}  
          .user-info-content-item
            h4 Email 
            p {{ user.customer_email }}
          .user-info-content-item
            h4 Address
            p {{ user.address1 || user.address2 || "Don't have" }} 
          .user-info-content-item
            h4 City
            p {{ user.city }}
          .user-info-content-item
            h4 Country
            p {{ user.country_name }}
          .user-info-content-item
            h4 Zipe code 
            p {{ user.zip }}
          .user-info-content-item
            h4 Timezone
            p {{ user.timezone }}
          .user-info-content-item
            h4 Customer domain
            p {{ user.myshopify_domain }}
          .user-info-content-item
            h4 Shop domain
            p {{ user.domain }}
    div(class="col-6 realative-position")
      div(class="card-action")
        div(
          class="card-sub-info row-3"
        ) 
          div(
            class="card-profile-title"
          )    
            h3 OE-Loyalty Free
          .description
            p Upgrade to paid plan to unlock all powerful features for optimal performance.
            Button(
              :icon="FavoriteMajor",
            ) Upgrade
        div(class="row-4")
          div(class="card-sub-info")
            div(
              class="card-profile-title"
            ) 
              h3 Do something with OE-Loyalty ?
            .description
              p This feature is coming soon!
</template>
<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { ref, reactive } from "vue";
import FavoriteMajor from "@shopify/polaris-icons/dist/svg/FavoriteMajor.svg";

const auth = useAuthStore();
const user = reactive({});
const isLoading = ref(true);

auth.getUser().then(() => {
  isLoading.value = false;
  Object.assign(user, auth.user);
});
</script>
<style lang="scss">
@import "@/scss/pages/_my-profile.scss";
</style>
