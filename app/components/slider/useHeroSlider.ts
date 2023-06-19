import { useState, useEffect } from 'react'
import type { Slide } from '../../common/types'

export const useHeroSlider = (slidesCount: number) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [paused, setPaused] = useState(false)
  const [startTouchX, setStartTouchX] = useState(0)

  const handleTouchStart = (event: TouchEvent) => {
    setStartTouchX(event.touches[0].clientX)
  }

  const handleTouchEnd = (event: TouchEvent) => {
    const endX = event.changedTouches[0].clientX
    const deltaX = endX - startTouchX

    // Determine the swipe direction based on the deltaX value
    if (deltaX > 0) {
      // Swiped right
      handleSlideChange(currentSlide + 1)
    } else if (deltaX < 0) {
      // Swiped left
      handleSlideChange(currentSlide - 1)
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (!paused) {
        if (currentSlide === slidesCount - 1) {
          setCurrentSlide(0)
          handleSlideChange(0)
        } else {
          handleSlideChange(currentSlide + 1)
        }
      }
    }, 3000)

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  })

  const handleSlideChange = (slideIndex: number) => {
    if (slideIndex < 0) {
      slideIndex = 0
    } else if (slideIndex >= slidesCount) {
      slideIndex = slidesCount - 1
    }
    setCurrentSlide(slideIndex)
  }

  return { currentSlide, handleSlideChange, setPaused, handleTouchStart, handleTouchEnd } as const
}
