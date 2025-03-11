import type { Image } from '@/types/Image'

export function useImages() {
  // TODO: Add thumbnails for images and descriptions
  const images: Image[] = [
    { src: '/img/1-IMG_8097.jpeg', thumbnailSrc: '/img/1-IMG_8097.jpeg', alt: 'Description for Image 1', title: 'Title 1' },
    { src: '/img/1-IMG_8139.jpeg', thumbnailSrc: '/img/1-IMG_8139.jpeg', alt: 'Description for Image 2', title: 'Title 2' },
    { src: '/img/1-IMG_8232.jpeg', thumbnailSrc: '/img/1-IMG_8232.jpeg', alt: 'Description for Image 3', title: 'Title 3' },
    { src: '/img/1-IMG_8400.jpeg', thumbnailSrc: '/img/1-IMG_8400.jpeg', alt: 'Description for Image 4', title: 'Title 4' },
    // TODO: DELETE THIS - JUST FOR TESTING
    { src: '/img/1-IMG_8097.jpeg', thumbnailSrc: '/img/1-IMG_8097.jpeg', alt: 'Description for Image 1', title: 'Title 1' },
    { src: '/img/1-IMG_8139.jpeg', thumbnailSrc: '/img/1-IMG_8139.jpeg', alt: 'Description for Image 2', title: 'Title 2' },
  ]

  return { images }
}
