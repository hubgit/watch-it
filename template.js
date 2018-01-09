export default item => `
  <article itemscope itemtype="http://schema.org/CreativeWork">
    <div class="metadata-container">
      <a itemprop="url" href="${item.url}">
        ${item.data.title}
      </a>
      
      <div class="url">${item.url}</div>
      
      ${item.description ? `
          <p itemprop="description">${item.description}</p>
      ` : ''}
      
      ${item.embed ? `
          <div itemscope itemtype="http://schema.org/AudioObject">
              <object itemprop="embedUrl" data="${item.embed.data}" width="${item.embed.width}" height="${item.embed.height}"></object>
          </div>
      ` : ''}
    </div>
  </article>
`
