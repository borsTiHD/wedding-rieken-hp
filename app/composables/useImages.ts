import type { Image } from '@/types/Image'

export function useImages() {
  const images: Image[] = [
    { src: '/img/1-IMG_8097.jpeg', thumbnailSrc: '/img/1-IMG_8097.jpeg', alt: '1-IMG_8097.jpeg', title: '1-IMG_8097.jpeg' },
    { src: '/img/1-IMG_8139.jpeg', thumbnailSrc: '/img/1-IMG_8139.jpeg', alt: '1-IMG_8139.jpeg', title: '1-IMG_8139.jpeg' },
    { src: '/img/1-IMG_8232.jpeg', thumbnailSrc: '/img/1-IMG_8232.jpeg', alt: '1-IMG_8232.jpeg', title: '1-IMG_8232.jpeg' },
    { src: '/img/1-IMG_8400.jpeg', thumbnailSrc: '/img/1-IMG_8400.jpeg', alt: '1-IMG_8400.jpeg', title: '1-IMG_8400.jpeg' },
  ]

  return { images }
}
