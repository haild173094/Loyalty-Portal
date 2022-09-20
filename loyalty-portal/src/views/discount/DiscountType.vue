<template lang="pug">
.header
  h2 Discount Type
  ModalDiscountType(
    content="Create New Discount Type",
    primaryAction="Create new discount type",
    secondaryAction=null,
    :discountType="discountType",
  )
div(class="table-discount-type")
  div(class="search-form")
    input(
      type="text",
      v-model="searchTitle",
      placeholder="Search By Name",
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
  table(v-else-if="haveDiscountTypes")
    tr
      //- th ID
      th(
        class="text-left",
      ) Name
      th(
        class="text-left"
      ) Description
      th Apply To
      th(
        class="text-right",
      ) Loyalty Price
      th Time Limit
      th(
        class="text-right",
      ) Discount Value

      th Status
      th Actions
    tr(
      v-for="discount in discountTypes",
      :key="discount.id"
    )
      //- td {{ discount.id  }}
      td(
        class="text-left",
      ) {{ discount.name }}
      td(
        class="text-left",
      ) {{ discount.description }}
      td {{ discount.customer_selection || "all" }}
      td(
        class="text-right"
      ) {{ discount.loyalty_price }}
      td {{ convertToHour(discount.time_limit) }}
      td(
        class="text-right"
      ) {{ discountValue(discount) }}
      td
        TextStyle(
          v-if="discount.status === 1",
          variation="positive",
        ) {{ discountStatus(discount) }}
        TextStyle(
          v-else
          variation="negative",
        ) {{ discountStatus(discount) }}
      td(class="actions")
        ModalDiscountType(
          :discountType="discount",
          content="Update",
          primaryAction="Update",
          :secondaryAction="secondaryAction(discount)",
        )
        ModalDelete(
          v-if="discount.status === 1"
          :discountType="discount",
          content="Delete",
          primaryAction="Delete",
          secondaryAction="Deactivate",
        )
        ModalDelete(
          v-else,
          :discountType="discount",
          content="Delete",
          primaryAction="Delete",
        )
  div(
    v-else-if="haveSearchTitleFilter",
    class="not-found-data",
  )
    p Oops! No discount types found !!
  div(
    v-else,
    class="not-found-data",
  )
    p Oops! You have not added any discounts types yet !!
  div(
    class="paganation"
    v-if="haveDiscountTypes",
  )
    Button(
      :icon="CircleLeftMajor"
      @click="getDiscountTypePreviousPage",
      :disabled="PreviousPage === ''",
    )
    Button(
      :icon="CircleRightMajor"
      @click="getDiscountTypeNextPage",
      :disabled="NextPage === ''"
    )
</template>
<script setup lang="ts">
import axios from "@/bootstrap/api-interceptor";
import { ref, reactive, watch, computed } from "vue";
import { useAuthStore } from "@/stores/auth";
import CircleRightMajor from "@shopify/polaris-icons/dist/svg/CircleRightMajor.svg";
import CircleLeftMajor from "@shopify/polaris-icons/dist/svg/CircleLeftMajor.svg";
import ModalDiscountType from "../../components/base/ModalDiscountType.vue";
import ModalDelete from "../../components/base/ModalDelete.vue";

const discountTypes = reactive([]);
const discountType = reactive({
  id: 0,
  name: "",
  description: "",
  loyalty_price: 0,
  discount_percentage: null,
  discount_amount: null,
  time_limit: 0,
});
const isLoading = ref(false);
const PreviousPage = ref("");
const NextPage = ref("");
const currency = ref("");
const limitDiscountTypePerPage = ref(10);
const searchTitle = ref("");
const auth = useAuthStore();
let searchInterval: number | undefined = undefined;

auth.getUser().then(() => {
  currency.value = auth.user?.currency || "";
});

const discountValue = (discount) => {
  return discount.discount_percentage
    ? discount.discount_percentage + "%"
    : discount.discount_amount + currency.value;
}
const haveDiscountTypes = computed(() => {
  return discountTypes.length > 0;
});

const haveSearchTitleFilter = computed(() => {
  return searchTitle.value !== "";
});
const convertToHour = (time: number) => {
  const day = Math.floor(time / (24 * 3600));
  const hour = Math.floor((time % (24 * 3600)) / 3600);
  const minute = Math.floor((time % 3600) / 60);
  return `${day} day(s) ${hour} hour(s) ${minute} minute(s)`;
};

const discountStatus = (discount) => {
  if (discount.status === 1) {
    return "Active";
  }
  return "Inactive";
};
const secondaryAction = (discount) => {
  if (discount.status === 1) {
    return "Deactivate";
  }
  return "Activate";
};

const getDiscountTypeFilter = () => {
  isLoading.value = true;
  axios
    .get(
      `/price-rule-molds/filter?filter=${searchTitle.value}&limit=${limitDiscountTypePerPage.value}`
    )
    .then((data) => {
      isLoading.value = false;
      discountTypes.splice(0, discountTypes.length);
      discountTypes.push(...data.data);
      PreviousPage.value = data.hasPreviousPage ? data.hasPreviousPage : "";
      NextPage.value = data.hasNextPage ? data.hasNextPage : "";
    })
    .catch((error) => {
      console.log(error);
    });
};

const getDiscountTypePreviousPage = () => {
  isLoading.value = true;
  axios
    .get(
      `/price-rule-molds/filter?filter=${searchTitle.value}&limit=${limitDiscountTypePerPage.value}&cursor=${PreviousPage.value}&link=prev`
    )
    .then((data) => {
      isLoading.value = false;
      discountTypes.splice(0, discountTypes.length);
      discountTypes.push(...data.data);
      PreviousPage.value = data.hasPreviousPage ? data.hasPreviousPage : "";
      NextPage.value = data.hasNextPage ? data.hasNextPage : "";
    })
    .catch((error) => {
      console.log(error);
    });
};

const getDiscountTypeNextPage = () => {
  isLoading.value = true;
  axios
    .get(
      `/price-rule-molds/filter?filter=${searchTitle.value}&limit=${limitDiscountTypePerPage.value}&cursor=${NextPage.value}&link=next`
    )
    .then((data) => {
      isLoading.value = false;
      discountTypes.splice(0, discountTypes.length);
      discountTypes.push(...data.data);
      PreviousPage.value = data.hasPreviousPage ? data.hasPreviousPage : "";
      NextPage.value = data.hasNextPage ? data.hasNextPage : "";
    })
    .catch((error) => {
      console.log(error);
    });
};

watch(searchTitle, () => {
  clearInterval(searchInterval);
  searchInterval = setTimeout(() => {
    getDiscountTypeFilter();
  }, 750);
});

getDiscountTypeFilter();
</script>

<style scoped lang="scss">
@import "@/scss/pages/discount-type/_discount-type.scss";

</style>
