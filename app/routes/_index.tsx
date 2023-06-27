import type { V2_MetaFunction } from "@remix-run/node"
import { NavBar } from "~/components/navbar/navBar"
import type { LinksFunction } from '@remix-run/node'
import stylesUrl from '~/styles/index.css'
import { HeroSlider, SliderItem } from '../components/slider/heroSlider'

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: stylesUrl }]
}
const slides = [
  {
    imageUrl: "https://picsum.photos/1080/500",
    heading: "Slide 1",
    tagline: "Tagline1",
    ctaText: "CTA"
  },
  {
    imageUrl: "https://picsum.photos/id/96/1080/500",
    heading: "Slide 2",
    tagline: "Tagline2",
    ctaText: "CTA"
  },
  {
    imageUrl: "https://picsum.photos/id/26/1080/500",
    heading: "Slide 3",
    tagline: "Tagline3",
    ctaText: "CTA"
  }
]

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Better Commerce" },
    { name: "description", content: "Welcome to Better Commerce" },
  ];
}

const Index = () => {
  return (
    <div className="page-container">
      <NavBar />
      <HeroSlider slidesCount={slides.length}>
        {slides.map((slide, index) => (
          <SliderItem key={index} width="100%">
            <h2>{slide.heading}</h2>
            <img className="hero-slider--image" src={slide.imageUrl} alt="hero slide" style={{ objectFit: "contain", objectPosition: "center", height: "50vh"}} />
            <p>{slide.tagline}</p>
          </SliderItem>
        ))}
      </HeroSlider>
      <header className="hero">
        <h1>Better Commerce</h1>
      </header>
      <section>
      </section>
    </div>
  );
}

export default Index
