<template>
  <div class="breadcrumb">
    <span class="breadcrumb-title">{{ title }}</span>
    <span class="breadcrumb-description" :title="description">{{ description }}</span>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Breadcrumb',
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: d => {
        if (d) {
          const length = Array.from(d)
          return length > 20 ? d.substr(0, 20) + '...' : d
        } else {
          return ''
        }
      }
    }
  },
  computed: {}
}
</script>

<style lang="scss" scoped>
.breadcrumb {
  height: 60px;
  padding: 18px;
  color: #00152a;
  font-size: 18px;
  display: flex;
  align-items: center;
  background-color: #fff;
  box-shadow: 0px 0px 6px 0px #e0e0e0;
  margin: 0 0 20px 1px;
  border-radius: 15px;
  button {
    font-size: 14px;
  }

  &-title {
    margin-left: 26px;
    line-height: 17px;
  }
  &-description {
    width: 363px;
    margin-left: 20px;
    font-size: 12px;
    font-weight: 300;
    text-align: left;
    line-height: 17px;
    letter-spacing: 0px;
    overflow: hidden;
    text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
