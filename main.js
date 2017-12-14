import parse from './parse.js'
import search from './search.js'
import template from './template.js'

document.addEventListener('DOMContentLoaded', async () => {
  const query = new URLSearchParams(window.location.search)
  const q = query.get('q')

  if (q) {
    document.querySelector('#input').q.value = q
    const container = document.querySelector('#results')

    const append = html => {
      const element = document.createElement('div')
      element.innerHTML = html
      container.append(element)
    }

    const items = await search(q)

    items.map(parse).map(template).forEach(append)
  }
})
