<template>
  <div class="mb25">
    <div class="title">
      <filterForm :filterComponentsData="filterComponentsData" :searchParams.sync="tempSearchParams" @search="search" />
      <slot name="btn"></slot>
    </div>
  </div>
</template>

<script>
import filterForm from './filterForm.vue'
export default {
  name: 'contentHeader',
  components: {
    filterForm
  },
  data () {
    return {
      tempSearchParams: this.searchParams
    }
  },
  props: {
    searchParams: {
      type: Object,
      required: false
    },
    filterComponentsData: {
      type: Array,
      required: false
    }
  },
  watch: {},
  mounted () {},
  methods: {
    search () {
      this.$emit('update:searchParams', {
        ...this.tempSearchParams
      })
      this.$emit('search')
    }
  }
}
</script>
