import { useHeroSlider } from './useHeroSlider'
import type { Slide } from '../../common/types'
import React from 'react'

interface HeroSliderProps {
  slides?: Slide[]
  slidesCount: number
  children: React.ReactNode
}

interface SliderProps {
  children: React.ReactNode
  width: string
}

export const SliderItem: React.FC<SliderProps> = ({ children, width }) => {
  return (
    <div className="slider-item" style={{ width: width }}>
      {children}
    </div>
  )
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ slidesCount, children }) => {
  const { currentSlide, handleSlideChange, setPaused, handleTouchStart, handleTouchEnd } = useHeroSlider(slidesCount)

  return (
    <div
      className="hero-slider"
      role="region"
      aria-label="Hero Slider"
      aria-live="polite"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => handleTouchStart}
      onTouchEnd={() => handleTouchEnd}
    >
      <div className="inner-slider" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
        {children}
      </div>
      <div className="slider-controls">
        <button
          className="slider-control slider-control--prev"
          onClick={() => handleSlideChange(currentSlide - 1)}
          aria-label="Previous Slide"
        >
          Prev
        </button>
        {React.Children.map(children, (child, index) => {
          return (
            <button
              className={`slider-control ${index === currentSlide ? 'slider-control--active' : ''}`}
              onClick={() => handleSlideChange(index)}
              aria-label="Previous Slide"
            >
              {index + 1}
            </button>
          )
        })}
        <button
          className="slider-control slider-control--next"
          onClick={() => handleSlideChange(currentSlide + 1)}
          aria-label="Next Slide"
        >
          Next
        </button>
      </div>
    </div>
  )
}
