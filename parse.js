export default item => {
  console.log(item)

  return {
    data: item,
    title: item.title,
    url: item.link
  }
}
