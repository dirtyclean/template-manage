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
  display: flex;
  align-items: center;
  height: 60px;
  margin: 0 0 20px 1px;
  padding: 18px;
  color: #00152a;
  font-size: 18px;
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 0 6px 0 #e0e0e0;
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
    overflow: hidden;
    font-weight: 300;
    font-size: 12px;
    line-height: 17px;
    letter-spacing: 0;
    white-space: nowrap;
    text-align: left;
    text-overflow: ellipsis;
  }
}
</style>
