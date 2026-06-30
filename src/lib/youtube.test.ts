import { describe, expect, it } from 'vitest'
import { parseYouTubeId, youTubeEmbedUrl, youTubeThumbnail } from './youtube'

describe('parseYouTubeId', () => {
  it('parses the standard watch URL', () => {
    expect(parseYouTubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
  })

  it('parses a watch URL with extra query params', () => {
    expect(parseYouTubeId('https://youtube.com/watch?v=dQw4w9WgXcQ&t=42s&list=abc')).toBe(
      'dQw4w9WgXcQ',
    )
  })

  it('parses short youtu.be links', () => {
    expect(parseYouTubeId('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
    expect(parseYouTubeId('https://youtu.be/dQw4w9WgXcQ?t=10')).toBe('dQw4w9WgXcQ')
  })

  it('parses embed, shorts and live paths', () => {
    expect(parseYouTubeId('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
    expect(parseYouTubeId('https://www.youtube.com/shorts/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
    expect(parseYouTubeId('https://www.youtube.com/live/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
  })

  it('parses m. and nocookie hosts and protocol-less input', () => {
    expect(parseYouTubeId('https://m.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
    expect(parseYouTubeId('youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
  })

  it('accepts a bare 11-char id', () => {
    expect(parseYouTubeId('dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
  })

  it('rejects non-YouTube and malformed input', () => {
    expect(parseYouTubeId('')).toBeNull()
    expect(parseYouTubeId('   ')).toBeNull()
    expect(parseYouTubeId('https://vimeo.com/12345')).toBeNull()
    expect(parseYouTubeId('https://example.com/watch?v=dQw4w9WgXcQ')).toBeNull()
    expect(parseYouTubeId('https://www.youtube.com/watch?v=tooshort')).toBeNull()
    expect(parseYouTubeId('not a url at all')).toBeNull()
  })
})

describe('youTube url helpers', () => {
  it('builds the thumbnail url', () => {
    expect(youTubeThumbnail('dQw4w9WgXcQ')).toBe('https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg')
  })

  it('builds a privacy-friendly autoplay embed url', () => {
    expect(youTubeEmbedUrl('dQw4w9WgXcQ')).toBe(
      'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0',
    )
  })
})
