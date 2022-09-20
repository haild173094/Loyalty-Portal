<template lang="pug">
.header
    h2 Collection Loyalty Point
    Button(
      @click="$router.push({name: 'add-collections'})"
    ) Add new collection loyalty point
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
      th Create At
      th Update At
      th(
        class="text-right",
      ) Loyalty Points  
      th Actions
    tr(
      v-for="collection in collections",
      :key="collection.id"
    )
      RowCollection(:collection="collection")
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
      @click="getCollectionPreviousPage",
      :disabled="PreviousPage === 0"
    )
    Button(
      :icon="CircleRightMajor"
      @click="getCollectionNextPage  ",
      :disabled="NextPage === 0"
    )
</template>
<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import CircleRightMajor from "@shopify/polaris-icons/dist/svg/CircleRightMajor.svg";
import CircleLeftMajor from "@shopify/polaris-icons/dist/svg/CircleLeftMajor.svg";
import axios from "@/bootstrap/api-interceptor";
import { ref, reactive, watch, computed } from "vue";
import RowCollection from "../../components/base/RowCollection.vue";

const collections = reactive([]);
const searchTitle = ref("");
const PreviousPage = ref(0);
const NextPage = ref(0);
const limitCollectionPerPage = ref(8);
const isLoading = ref(false);
let searchInterval: number | undefined = undefined;

const haveCollections = computed(() => {
  return collections.length > 0;
});

const haveSearchTitleFilter = computed(() => {
  return searchTitle.value !== "";
});
const getCollectionFilter = () => {
  isLoading.value = true;
  axios
    .get(
      `/loyal-collections/filter?filter=${searchTitle.value}&limit=${limitCollectionPerPage.value}`
    )
    .then((data) => {
      isLoading.value = false;
      collections.splice(0);
      collections.push(...data.data);
      NextPage.value = data.hasNextPage ? data.hasNextPage : 0;
      PreviousPage.value = data.hasPreviousPage ? data.hasPreviousPage : 0;
    })
    .catch((error) => {
      console.log(error);
    });
};

const getCollectionPreviousPage = () => {
  isLoading.value = true;
  axios
    .get(
      `/loyal-collections/filter?filter=${searchTitle.value}&limit=${limitCollectionPerPage.value}&cursor=${PreviousPage.value}&link=prev`
    )
    .then((data) => {
      isLoading.value = false;
      collections.splice(0);
      collections.push(...data.data);
      NextPage.value = data.hasNextPage ? data.hasNextPage : 0;
      PreviousPage.value = data.hasPreviousPage ? data.hasPreviousPage : 0;
    })
    .catch((error) => {
      console.log(error);
    });
};
const getCollectionNextPage = () => {
  isLoading.value = true;
  axios
    .get(
      `/loyal-collections/filter?filter=${searchTitle.value}&limit=${limitCollectionPerPage.value}&cursor=${NextPage.value}&link=next`
    )
    .then((data) => {
      isLoading.value = false;
      collections.splice(0);
      collections.push(...data.data);
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
    getCollectionFilter();
  }, 750);
});

getCollectionFilter();
</script>

<style scoped lang="scss">
@import "@/scss/pages/collection/_collection-list.scss";
</style>
