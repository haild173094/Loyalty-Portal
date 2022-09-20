<template lang="pug">
.header
  h2 Customer List
div(
  class="table-customer",
)
  form(class="search-form")
    input(
      type="search",
      v-model="searchTitle",
      placeholder="Search by email or phone number",
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
  table(v-else-if="isHaveCustomers")
    thead
      th Customer Shopify ID
      th(
        class="text-left",
      ) Email
      th Phone Number
      th Create At
      th Update At
      th(
        class="text-right",
      ) Loyalty Points
    tbody
      tr(
        v-for="(customer, index) in customers",
        :key="index",
        @click="$router.push({name: 'customer-detail', params: {id: customer.customer_id}})",
      )
        td {{ customer.customer_id }}
        td(
          class="text-left",
        ) {{ customer.email || "Null" }}
        td {{ customer.phone || "Null" }}
        td {{ customer.created_at }}
        td {{ customer.updated_at }}
        td(
          class="text-right"
        ) {{ customer.loyalty_point || 0 }} point(s)
  div(
    v-else-if="haveSearchTitleFilter",
    class="not-found-data",
  )
    p Oops! No customer found !!
  div(
    v-else,
  class="not-found-data",
  )
    p Oops! No data !!
  div(class="paganation")
    Button(
      :icon="CircleLeftMajor"
      @click="getCustomerPreviousPage",
      :disabled="PreviousPage === ''",
    )
    Button(
      :icon="CircleRightMajor"
      @click="(getCustomerNextPage)",
      :disabled="NextPage === ''"
    )
</template>
<script setup lang="ts">
import { watch, ref, reactive, computed } from "vue";
import CircleRightMajor from "@shopify/polaris-icons/dist/svg/CircleRightMajor.svg";
import CircleLeftMajor from "@shopify/polaris-icons/dist/svg/CircleLeftMajor.svg";
import axios from "@/bootstrap/api-interceptor";

const customers = reactive([]);
const searchTitle = ref("");
const isLoading = ref(false);
const PreviousPage = ref("");
const NextPage = ref("");
const limitCustomerPerPage = ref(8);

let searchInterval: number | undefined = undefined;

const isHaveCustomers = computed(() => {
  return customers.length > 0;
});

const haveSearchTitleFilter = computed(() => {
  return searchTitle.value !== "";
});

const getCustomer = () => {
  isLoading.value = true;
  axios
    .get(
      `/customers/filter?filter=${searchTitle.value}&limit=${limitCustomerPerPage.value}`
    )
    .then((data) => {
      isLoading.value = false;
      customers.splice(0);
      customers.push(...data.data);
      PreviousPage.value = data.hasPreviousPage ? data.hasPreviousPage : "";
      NextPage.value = data.hasNextPage ? data.hasNextPage : "";
    })
    .catch((error) => {
      console.log(error);
    });
};
const getCustomerNextPage = () => {
  isLoading.value = true;
  axios
    .get(
      `/customers/filter?filter=${searchTitle.value}&limit=${limitCustomerPerPage.value}&cursor=${NextPage.value}&link=next`
    )
    .then((data) => {
      isLoading.value = false;
      customers.splice(0);
      customers.push(...data.data);
      PreviousPage.value = data.hasPreviousPage ? data.hasPreviousPage : "";
      NextPage.value = data.hasNextPage ? data.hasNextPage : "";
    })
    .catch((error) => {
      console.log(error);
    });
};
const getCustomerPreviousPage = () => {
  isLoading.value = true;
  axios
    .get(
      `/customers/filter?filter=${searchTitle.value}&limit=${limitCustomerPerPage.value}&cursor=${PreviousPage.value}&link=prev`
    )
    .then((data) => {
      isLoading.value = false;
      customers.splice(0);
      customers.push(...data.data);
      PreviousPage.value = data.hasPreviousPage ? data.hasPreviousPage : "";
      NextPage.value = data.hasNextPage ? data.hasNextPage : "";
    })
    .catch((error: unknown) => {
      console.log(error);
    });
};

watch(searchTitle, () => {
  clearTimeout(searchInterval);
  searchInterval = setTimeout(() => {
    getCustomer();
  }, 500);
});
getCustomer();
</script>

<style lang="scss">
@import "@/scss/pages/customer/_customer-list.scss";
</style>
