export default q => {
  const params = new URLSearchParams()
  params.append('key', 'AIzaSyBuCcm-Q9pB2Uc42HaygW1TRf1h5h0lebk')
  params.append('cx', '003954572918023580770:foju3rzhvu8')
  params.append('q', q)
  params.append('num', 3)

  const url = `https://www.googleapis.com/customsearch/v1?${params.toString()}`

  return fetch(url).then(res => res.json()).then(data => data.items)
}
