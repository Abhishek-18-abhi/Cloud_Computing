import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import phone from "../assets/phone.png";
import laptop from "../assets/laptop.png";
import watch from "../assets/watch.png";
import earbuds from "../assets/earbuds.png";
import tablet from "../assets/tablet.png";

function HeroSlider() {
  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
      }}
      pagination={{ clickable: true }}
      loop={true}
    >
      <SwiperSlide>
        <img src={phone} alt="Phone" />
      </SwiperSlide>

      <SwiperSlide>
        <img src={laptop} alt="Laptop" />
      </SwiperSlide>

      <SwiperSlide>
        <img src={watch} alt="Watch" />
      </SwiperSlide>

      <SwiperSlide>
        <img src={earbuds} alt="Earbuds" />
      </SwiperSlide>

      <SwiperSlide>
        <img src={tablet} alt="Tablet" />
      </SwiperSlide>
    </Swiper>
  );
}

export default HeroSlider;