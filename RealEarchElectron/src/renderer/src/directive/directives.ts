export const lazyLoad = {
  // mounted 在绑定元素的父组件
  // 及他自己的所有子节点都挂载完成后调用
  mounted(el, binding) {
    // 如果有需要可以先设置src为 loading 图
    // el.setAttribute('src', 'loading 图的路径');
    // const options = {
    //   rootMargin: '0px',
    //   threshold: 0.1
    // }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // binding 是一个对象，binding.value 是传递给指令的值
          el.setAttribute('src', binding.value)
          observer.unobserve(el)
        }
      })
    })
    observer.observe(el)
  }
}
