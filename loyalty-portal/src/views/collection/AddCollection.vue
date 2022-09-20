<template lang="pug">
.header
  h2 Add Collections Loyalty Point
div(class="table-collections")
  div(class="search-form")
    input(
      type="text",
      v-model="searchTitle",    
      placeholder="Search By Condition",
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
  table(v-else-if="haveCollections")
    tr
      th Image
      th(
        class="text-left",
      ) Condition 
      th(
        class="text-right",
      ) Products 
      th Actions
    tr(
      v-for="collection in collections",
      :key="collection.id"
    )
      RowAddCollectionLoyaltyPoint(:collection="collection")
  div(
    v-else-if="haveSearchTitleFilter",
    class="not-found-data",
  )
    p Oops! No collections found !!
  div(
    v-else,
    class="not-found-data",
  )
    p Oops! You have not added any collections yet !!
  div(
    class="paganation",
    v-if="haveCollections",
  )
    Button(
      :icon="CircleLeftMajor"
      @click="getCollectionsPreviousPage",
      :disabled="PreviousPage === ''",
    )
    Button(
      :icon="CircleRightMajor"
      @click="(getCollectionsNextPage)",
      :disabled="NextPage === ''"
    )
</template>
<script setup lang="ts">
import { ref, reactive, watch, computed } from "vue";
import axios from "@/bootstrap/api-interceptor";
import CircleRightMajor from "@shopify/polaris-icons/dist/svg/CircleRightMajor.svg";
import CircleLeftMajor from "@shopify/polaris-icons/dist/svg/CircleLeftMajor.svg";
import RowAddCollectionLoyaltyPoint from "../../components/base/RowAddCollectionLoyaltyPoint.vue";

const collections = reactive([]);
const searchTitle = ref("");
const PreviousPage = ref("");
const NextPage = ref("");
// Set limit product per page
const limitProductPerPage = ref(8);
const isLoading = ref(false);
let searchInterval: number | undefined = undefined;

const haveCollections = computed(() => {
  return collections.length > 0;
});

const haveSearchTitleFilter = computed(() => {
  return searchTitle.value !== "";
});

const getCollectionsFilter = () => {
  isLoading.value = true;
  axios
    .get(
      `/collections/filter?filter=${searchTitle.value}&limit=${limitProductPerPage.value}`
    )
    .then((data: unknown) => {
      isLoading.value = false;
      collections.splice(0);
      collections.push(...data.edges);
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
const getCollectionsPreviousPage = () => {
  isLoading.value = true;
  axios
    .get(
      `/collections/filter?filter=${searchTitle.value}&limit=${limitProductPerPage.value}&cursor=${PreviousPage.value}&link=prev`
    )
    .then((data: unknown) => {
      isLoading.value = false;
      //Delete current colections data and set new colections data
      collections.splice(0);
      collections.push(...data.edges);
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
const getCollectionsNextPage = () => {
  isLoading.value = true;
  axios
    .get(
      `/collections/filter?filter=${searchTitle.value}&limit=${limitProductPerPage.value}&cursor=${NextPage.value}&link=next`
    )
    .then((data) => {
      isLoading.value = false;
      //Delete current colections data and set new colections data
      collections.splice(0);
      collections.push(...data.edges);
      PreviousPage.value = data.pageInfo?.hasPreviousPage
        ? data.edges[0].cursor
        : "";
      NextPage.value = data.pageInfo?.hasNextPage
        ? data.edges[data.edges.length - 1].cursor
        : "";
    })
    .catch((error) => {
      console.log(error);
    });
};

watch(searchTitle, () => {
  clearInterval(searchInterval);
  searchInterval = setTimeout(() => {
    getCollectionsFilter();
  }, 750);
  PreviousPage.value = "";
  NextPage.value = "";
});

getCollectionsFilter();
</script>

<style lang="scss">
@import "@/scss/pages/collection/_add-loyalty-collection.scss";
</style>
