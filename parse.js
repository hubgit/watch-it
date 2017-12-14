const parseArtist = pagemap => {
  if (pagemap.musicalbum) {
    const { byartist } = pagemap.musicalbum[0]

    if (typeof byartist === 'string') {
      return byartist
    }

    if (typeof byartist === 'object') {
      if (byartist.name) {
        return byartist.name
      }
    }
  }

  if (pagemap.musicgroup && pagemap.musicgroup.name) {
    return pagemap.musicgroup.name
  }
}

const parseAlbum = pagemap => {
  if (pagemap.musicalbum) {
    const { name } = pagemap.musicalbum[0]

    if (name) {
      return name
    }
  }
}

const parseDescription = pagemap => {
  if (pagemap.musicalbum) {
    const { description } = pagemap.musicalbum[0]

    if (description) {
      return description
    }
  }
}

const parseImage = pagemap => {
  if (pagemap.musicalbum) {
    const { image } = pagemap.musicalbum[0]

    if (image) {
      return image
    }
  }

  return pagemap.cseThumbnail
}

const getDate = pagemap => {
  if (pagemap.musicalbum) {
    const { datepublished } = pagemap.musicalbum[0]

    return datepublished
  }

  if (pagemap.metatags) {
    const { musicReleaseDate } = pagemap.metatags[0]

    return musicReleaseDate
  }
}

const parseDate = pagemap => {
  let date = getDate(pagemap)

  if (!date) return

  date = date.replace(/-/, '')

  const matches = date.match(/^(\d{4})/)

  if (matches) {
    return matches[1]
  }
}

const parseTracks = pagemap => {
  if (pagemap.musicrecording) {
    return pagemap.musicrecording.map(item => ({
      name: item.name,
      duration: item.duration ? parseDuration(item.duration) : null
    }))
  }
}

const parseDuration = duration => {
  if (!duration) {
    return ''
  }

  const test = /PT?(?:\d+H)?(\d+)M(\d+)S/

  if (!duration.match(test)) {
    return ''
  }

  return duration.replace(test, (match, minute, second) => {
    while (minute.length < 2) {
      minute = '0' + minute
    }

    while (second.length < 2) {
      second = '0' + second
    }

    return minute + ':' + second
  });
}

const embeddable = /(bandcamp\.com|soundcloud\.com)/

const parseAudio = pagemap => {
  if (pagemap.audioobject) {
    let url;

    if (toString.call(pagemap.audioobject) === '[object Array]') {
      if (pagemap.audioobject.length) {
        url = pagemap.audioobject[0].embedurl;
      }
    } else {
      url = pagemap.audioobject.embedurl;
    }

    if (url && embeddable.test(url)) {
      return {
        data: url
      };
    }
  }

  if (pagemap.metatags && pagemap.metatags[0]['og:audio']) {
    if (pagemap.metatags[0]['og:audio'].match(/^spotify:/)) {
      return {
        data: 'https://embed.spotify.com/?theme=dark&uri=' + pagemap.metatags.ogAudio,
        height: '80px'
      };
    }

    if (embeddable.test(pagemap.metatags[0]['og:audio'])) {
      return {
        data: pagemap.metatags[0]['og:audio']
      };
    }
  }

  if (pagemap.metatags && pagemap.metatags[0]['og:video'] && embeddable.test(pagemap.metatags[0]['og:video'])) {
    // bandcamp player
    pagemap.metatags[0]['og:video'] = pagemap.metatags[0]['og:video'].replace(/tracklist=false/, 'tracklist=true');

    return {
      data: pagemap.metatags[0]['og:video'],
      width: pagemap.metatags[0]['og:video:width'],
      height: pagemap.metatags[0]['og:video:height'],
      type: pagemap.metatags[0]['og:video:type']
    };
  }

  if (pagemap.metatags && pagemap.metatags[0]['og:url']) {
    if (pagemap.metatags[0]['og:url'].match(/^https:\/\/open.spotify.com\//)) {
      return {
        data: pagemap.metatags[0]['og:url'].replace(/open.spotify.com/, 'embed.spotify.com'),
        height: '80px'
      };
    }
  }
}

const parse = function (item) {
  console.log(item);
  const pagemap = item.pagemap

  return {
    data: item,
    artist: parseArtist(pagemap),
    album: parseAlbum(pagemap),
    date: parseDate(pagemap),
    description: parseDescription(pagemap),
    image: parseImage(pagemap),
    embed: parseAudio(pagemap),
    tracks: parseTracks(pagemap)
  }
}
