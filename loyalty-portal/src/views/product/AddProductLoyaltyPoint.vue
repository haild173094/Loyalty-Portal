<template lang="pug">
.header
  h2 Add Products Loyalty Point
div(class="table-products")
  div(class="search-form")
    input(
      type="text",
      v-model="searchTitle",
      placeholder="Search By Title",
      class="search-input",
    )
  Layout(v-if="isLoading")
    LayoutSection
      Card(:sectioned="true")
        SkeletonBodyText
      Card(:sectioned="true")
        SkeletonBodyText
      Card(:sectioned="true")
        SkeletonBodyText
      Card(:sectioned="true")
        SkeletonBodyText
      Card(:sectioned="true")
        SkeletonBodyText
      Card(:sectioned="true")
        SkeletonBodyText
  table(v-else-if="haveProducts")
    tr
      th Image
      th(
        class="text-left",
      ) Title 
      th(
        class="text-right",
      ) Variants 
      th Actions
    tr(
      v-for="product in products",
      :key="product.id"
    )
      RowAddProductLoyaltyPoint(:product="product")
  div(
    v-else-if="haveSearchTitleFilter",
    class="not-found-data",
  )
    p Oops! No products found !!
  div(
    v-else,
    class="not-found-data",
  )
    p Oops! You have not added any products yet !!
  div(
    class="paganation"
    v-if="haveProducts",
  )
    Button(
      :icon="CircleLeftMajor"
      @click="getProductPreviousPage",
      :disabled="PreviousPage === ''",
    )
    Button(
      :icon="CircleRightMajor"
      @click="getProductNextPage",
      :disabled="NextPage === ''"
    )
</template>
<script setup lang="ts">
import { ref, reactive, watch, computed } from "vue";
import axios from "@/bootstrap/api-interceptor";
import CircleRightMajor from "@shopify/polaris-icons/dist/svg/CircleRightMajor.svg";
import CircleLeftMajor from "@shopify/polaris-icons/dist/svg/CircleLeftMajor.svg";
import RowAddProductLoyaltyPoint from "../../components/base/RowAddProductLoyaltyPoint.vue";

const products = reactive([]);
const searchTitle = ref("");
const PreviousPage = ref("");
const NextPage = ref("");
const isLoading = ref(false);
const limitProductPerPage = ref(7);

let searchInterval: number | undefined = undefined;

const haveProducts = computed(() => {
  return products.length > 0;
});

const haveSearchTitleFilter = computed(() => {
  return searchTitle.value !== "";
});

const getProductFilter = () => {
  isLoading.value = true;
  axios
    .get(
      `/products/filter?filter=${searchTitle.value}&limit=${limitProductPerPage.value}`
    )
    .then((data: unknown) => {
      isLoading.value = false;
      products.splice(0);
      products.push(...data.edges);
      PreviousPage.value = data.pageInfo.hasPreviousPage
        ? data.edges[0].cursor
        : "";
      NextPage.value = data.pageInfo.hasNextPage
        ? data.edges[data.edges.length - 1].cursor
        : "";
    })
    .catch((error: unknown) => {
      console.log(error);
    });
};
const getProductPreviousPage = () => {
  isLoading.value = true;
  axios
    .get(
      `/products/filter?filter=${searchTitle.value}&limit=${limitProductPerPage.value}&cursor=${PreviousPage.value}&link=prev`
    )
    .then((data: unknown) => {
      isLoading.value = false;
      products.splice(0);
      products.push(...data.edges);
      PreviousPage.value = data.pageInfo.hasPreviousPage
        ? data.edges[0].cursor
        : "";
      NextPage.value = data.pageInfo.hasNextPage
        ? data.edges[data.edges.length - 1].cursor
        : "";
    })
    .catch((error: unknown) => {
      console.log(error);
    });
};
const getProductNextPage = () => {
  isLoading.value = true;
  axios
    .get(
      `/products/filter?filter=${searchTitle.value}&limit=${limitProductPerPage.value}&cursor=${NextPage.value}&link=next`
    )
    .then((data: unknown) => {
      isLoading.value = false;
      products.splice(0);
      products.push(...data.edges);
      PreviousPage.value = data.pageInfo?.hasPreviousPage
        ? data.edges[0].cursor
        : "";
      NextPage.value = data.pageInfo?.hasNextPage
        ? data.edges[data.edges.length - 1].cursor
        : "";
    })
    .catch((error: unknown) => {
      console.log(error);
    });
};

watch(searchTitle, () => {
  clearInterval(searchInterval);
  searchInterval = setTimeout(() => {
    getProductFilter();
  }, 750);
  PreviousPage.value = "";
  NextPage.value = "";
});

getProductFilter();
</script>

<style lang="scss">
@import "@/scss/pages/product/_add-loyalty-product.scss";
</style>
