export const getFinalPageNum = (total, pageNum = 1, pageSize = 10, delNum = 1) => {
  const restNum = total - pageSize * (pageNum - 1)
  let pageNumDiff = Math.floor((delNum - restNum) / pageSize) + 1
  pageNumDiff < 0 && (pageNumDiff = 0)
  pageNum = pageNum - pageNumDiff
  pageNum < 1 && (pageNum = 1)
  return pageNum
}
export const isPromise = obj => {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function'
}
export const cloneDeep = (obj, cache = []) => {
  function find (list, f) {
    return list.filter(f)[0]
  }
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  const hit = find(cache, c => c.original === obj)
  if (hit) {
    return hit.copy
  }
  const copy = Array.isArray(obj) ? [] : {}
  cache.push({
    original: obj,
    copy
  })
  Object.keys(obj).forEach(key => {
    copy[key] = cloneDeep(obj[key], cache)
  })
  return copy
}

export const getSelectedIds = (data, id, parentKey = 'parentId', key = 'id', childrenKey = 'children') => {
  // rootPId作用：根节点的pId设置为了一个值，但是找不到对应的以pId的值为id的节点， 也就是说根节点的pId是无效的，不能被push进来(过滤脏数据)
  // 找到第一级的pId(rootPId)
  const rootPIds = data.map(item => item[parentKey])
  const selResult = []
  function findSel (data, id) {
    let isFind = false
    for (const i of data) {
      if (isFind) {
        break
      }
      if (i[key] !== id) {
        if (undefined !== i[childrenKey] && i[childrenKey] !== null) {
          if (i[parentKey] && !rootPIds.includes(i[parentKey])) {
            selResult.push(i[parentKey])
          }
          isFind = findSel(i[childrenKey], id)
        }
      } else {
        if (i[parentKey] && !rootPIds.includes(i[parentKey])) {
          selResult.push(i[parentKey])
        }
        selResult.push(id)
        isFind = true
      }
    }
    if (!isFind) {
      selResult.pop()
    }
    return isFind
  }
  findSel(data, id)
  return selResult
}
export const getPIds = (data, id, parentKey = 'parentId', key = 'id', childrenKey = 'children') => {
  return getSelectedIds(data, id, parentKey, key, childrenKey).filter(item => item !== id)
}
export const getItemById = (data, id, idKey = 'id') => {
  let result
  function findSel (treeData) {
    treeData.forEach(el => {
      if (!result) {
        if (id === el[idKey]) {
          result = el
        }
        if (el.children?.length) {
          findSel(el.children)
        }
      }
    })
  }
  findSel(data)
  return result
}
export const getSelectedItems = (data, selectedIds) => {
  if (!selectedIds?.length) {
    return []
  }
  const selResult = []
  function findSel (treeData) {
    treeData.forEach(item => {
      const { id, children } = item
      if (selectedIds.includes(id)) {
        selResult.push(item)
      }
      if (children?.length) {
        findSel(children)
      }
    })
  }
  findSel(data)
  return selResult
}
export const download = (blob, name) => {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.download = name
  a.style.display = 'none'
  a.href = url
  document.body.appendChild(a)
  a.click()
  a.remove()
}
export const deleteOptionsEmptyChildren = options => {
  options.forEach(option => {
    if (option.children && option.children.length) {
      deleteOptionsEmptyChildren(option.children)
    } else {
      delete option.children
    }
  })
  return options
}
// 从小到大 空排在最后
export const sortMinToNull = (list, sortKey = 'sort') => {
  list.sort((a, b) => {
    return (
      (b[sortKey] !== '' && b[sortKey] !== null && b[sortKey] !== undefined) -
        (a[sortKey] !== '' && a[sortKey] !== null && a[sortKey] !== undefined) || a[sortKey] - b[sortKey]
    )
  })
  return list
}
// 多条件排序
export const someKeySort = (array, ...compairers) => {
  return array.sort((a, b) => {
    for (const c of compairers) {
      const r = c(a, b)
      if (r !== 0) {
        return r
      }
    }
  })
}
// 禁用/启用----写法仅针对antd cascader(父级被禁用，则无法继续选择子级)
export const disabledOptionsItem = (options, disabledIds = []) => {
  const find = data => {
    data.forEach(item => {
      if (disabledIds.includes(item.id)) {
        item.disabled = true
      } else {
        item.disabled = false
        if (item.children?.length) {
          find(item.children)
        }
      }
    })
  }
  find(options)
}
export const getTreeStructList = (source, idKey = 'id', parentIdKey = 'parentId', childrenKey = 'children') => {
  source = cloneDeep(source)
  return source.filter(father => {
    const branchData = source.filter(child => father[idKey] === child[parentIdKey]) // 返回每一项的子级数组
    if (branchData && branchData.length > 0) {
      father[childrenKey] = branchData // 如果存在子级，则给父级添加一个children属性，并赋值
    }
    return !father[parentIdKey] // 返回第一层
  })
}
// _parID 父节点标识.标识它是父节点的值(数据是乱的,给出pid的值找不到对应id,则传空)
export const getTreeData = (data, idKey = 'id', parentIdKey = 'parentId', childrenKey = 'children', _parID) => {
  if (!data || data.length === 0) {
    return []
  }
  if (_parID === undefined || _parID === null || _parID === '') {
    // 找根数据（根节点的pid未知）
    const disParentCode = []
    // 遍历出所有的上级ID
    for (const item of data) {
      const parID = item[parentIdKey]
      if (disParentCode.indexOf(parID) > -1) {
        continue
      }
      disParentCode.push(parID)
    }
    // 遍历出所有的ID
    const disCode = []
    for (const item of data) {
      const funID = item[idKey]
      disCode.push(funID)
    }
    const notExisted = []
    for (const item of disParentCode) {
      if (disCode.indexOf(item) === -1) {
        notExisted.push(item)
      }
    }
    const resultList = []
    for (const item of data) {
      const parID = item[parentIdKey]
      if (notExisted.indexOf(parID) > -1) {
        resultList.push(item)
      }
    }
    // 查找下级
    for (const item of resultList) {
      const funID = item[idKey]
      const temp = getTreeData(data, idKey, parentIdKey, childrenKey, funID)
      if (temp.length > 0) {
        item[childrenKey] = temp
      }
    }
    return resultList
  } else {
    // 根节点的pid已知
    const resultList = []
    for (const item of data) {
      const parID = item[parentIdKey]
      if (parID !== null && parID === _parID) {
        resultList.push(item)
      }
    }
    // 查找下级
    for (const item of resultList) {
      const funID = item[idKey]
      const temp = getTreeData(data, idKey, parentIdKey, childrenKey, funID)
      if (temp.length > 0) {
        item[childrenKey] = temp
      }
    }
    return resultList
  }
}
export const isVillage = areaCode => {
  if (!areaCode) return false
  if (areaCode.slice(-3) !== '000') {
    return true
  }
  return false
}
export const isCounty = areaCode => {
  if (!areaCode) return false
  if (areaCode.slice(-6) === '000000' && areaCode.slice(-8, -6) !== '00') {
    return true
  }
  return false
}
export const isCity = areaCode => {
  if (!areaCode) return false
  return areaCode.slice(-8) === '00000000' && areaCode.slice(-10, -8) !== '00'
}
export const isProvince = areaCode => {
  if (!areaCode) return false
  return areaCode.slice(-10) === '0000000000'
}
export const optionsIsExitId = (options, id) => {
  let isFind = false
  function find (data) {
    data.forEach(option => {
      if (option.id === id) {
        isFind = true
      }
      if (!isFind) {
        if (option.children && option.children.length) {
          find(option.children)
        }
      }
    })
  }
  find(options)
  return isFind
}
export const getEffectIds = (options, ids) => {
  const effectIds = []
  function find (data) {
    data.forEach(option => {
      if (ids.includes(option.id)) {
        effectIds.push(option.id)
      }
      if (option.children && option.children.length) {
        find(option.children)
      }
    })
  }
  find(options)
  return effectIds
}
export const getColors = (randomColorKind = 20) => {
  const colors = []
  const getRandomColor = function () {
    let randomColor = '#'
    const arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f']
    for (let i = 0; i < 6; i++) {
      const num = parseInt(Math.random() * 16)
      randomColor += arr[num]
    }
    return randomColor
  }
  for (let i = 0; i < randomColorKind; i++) {
    colors.push(getRandomColor())
  }
  return ['#007bff', '#5bc43a', '#2f3ced', '#ff7439', '#ffcc00'].concat(colors)
}
