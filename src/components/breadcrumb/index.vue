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
  align-items: center;
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 0 6px 0 #e0e0e0;
  color: #00152a;
  display: flex;
  font-size: 18px;
  height: 60px;
  margin: 0 0 20px 1px;
  padding: 18px;
  button {
    font-size: 14px;
  }

  &-title {
    line-height: 17px;
    margin-left: 26px;
  }
  &-description {
    font-size: 12px;
    font-weight: 300;
    letter-spacing: 0;
    line-height: 17px;
    margin-left: 20px;
    overflow: hidden;
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 363px;
  }
}
</style>
