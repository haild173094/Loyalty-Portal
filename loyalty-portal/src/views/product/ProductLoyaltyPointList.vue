<template lang="pug">
.header
  h2 Products Loyalty Point
  Button(
    @click="$router.push({name: 'add-product-loyalty-point'})",
  ) Add new loyalty point
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
      th Create At
      th Update At
      th(
        class="text-right",
      ) Loyalty Points  
      th Actions
    tr(
      v-for="product in products",
      :key="product.id"
    )
      RowProductLoyaltyPoint(:product="product")
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
    class="paganation",
    v-if="haveProducts",
  )
    Button(
      :icon="CircleLeftMajor"
      @click="getProductPreviousPage",
      :disabled="PreviousPage === 0"
    )
    Button(
      :icon="CircleRightMajor"
      @click="getProductNextPage  ",
      :disabled="NextPage === 0"
    )
</template>
<script setup lang="ts">
import { ref, reactive, watch, computed } from "vue";
import axios from "@/bootstrap/api-interceptor";
import CircleRightMajor from "@shopify/polaris-icons/dist/svg/CircleRightMajor.svg";
import CircleLeftMajor from "@shopify/polaris-icons/dist/svg/CircleLeftMajor.svg";
import RowProductLoyaltyPoint from "../../components/base/RowProductLoyaltyPoint.vue";

const products = reactive([]);
const searchTitle = ref("");
const PreviousPage = ref(0);
const NextPage = ref(0);
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
      `/loyal-products/filter?filter=${searchTitle.value}&limit=${limitProductPerPage.value}`
    )
    .then((data) => {
      isLoading.value = false;
      products.splice(0);
      products.push(...data.data);
      NextPage.value = data.hasNextPage ? data.hasNextPage : 0;
      PreviousPage.value = data.hasPreviousPage ? data.hasPreviousPage : 0;
    })
    .catch((error) => {
      console.log(error);
    });
};

const getProductPreviousPage = () => {
  isLoading.value = true;
  axios
    .get(
      `/loyal-products/filter?filter=${searchTitle.value}&limit=${limitProductPerPage.value}&cursor=${PreviousPage.value}&link=prev`
    )
    .then((data) => {
      isLoading.value = false;
      products.splice(0);
      products.push(...data.data);
      NextPage.value = data.hasNextPage ? data.hasNextPage : 0;
      PreviousPage.value = data.hasPreviousPage ? data.hasPreviousPage : 0;
    })
    .catch((error) => {
      console.log(error);
    });
};
const getProductNextPage = () => {
  isLoading.value = true;
  axios
    .get(
      `/loyal-products/filter?filter=${searchTitle.value}&limit=${limitProductPerPage.value}&cursor=${NextPage.value}&link=next`
    )
    .then((data) => {
      isLoading.value = false;
      products.splice(0);
      products.push(...data.data);
      NextPage.value = data.hasNextPage ? data.hasNextPage : 0;
      PreviousPage.value = data.hasPreviousPage ? data.hasPreviousPage : 0;
    })
    .catch((error) => {
      console.log(error);
    });
};

watch(searchTitle, () => {
  clearInterval(searchInterval);
  searchInterval = setTimeout(() => {
    getProductFilter();
  }, 750);
});

getProductFilter();
</script>

<style scoped lang="scss">
@import "@/scss/pages/product/_product-list.scss";
p {
  text-align: center;
  font-size: 1.5rem;
}
</style>
